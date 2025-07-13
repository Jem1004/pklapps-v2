'use server'

import { getAuthenticatedSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { TipeAbsensi } from '@prisma/client'
import { redirect } from 'next/navigation'
import { handleApiError } from '@/lib/errors/errorUtils'
import { withRetryTransaction } from '@/lib/database/transactions'
import { updateWithOptimisticLock } from '@/lib/database/optimisticLocking'
import { TransactionError, ConcurrencyError, ConstraintViolationError } from '@/lib/errors/TransactionError'
import { absensiTransactionConfig } from '@/lib/config/transactions'
import { validateAttendanceTime, getServerTimezone, syncServerTime } from '@/lib/utils/timezone'
import { formatDateForDatabase } from '@/lib/database/timezone'
import { createAttendanceError, AttendanceErrorCode, AttendanceErrorLogger, AttendanceError, parseError } from '@/lib/errors/attendance'
import { revalidateAttendanceData } from '@/lib/cache/revalidation'
import { isOutsideWorkingHoursDynamic, getCurrentPeriodDynamic } from '@/lib/utils/absensi'
import { invalidateGlobalWaktuAbsensiCache } from '@/lib/cache/waktuAbsensi'
import prisma from '@/lib/prisma'

export async function submitAbsensi(formData: FormData) {
  const errorLogger = new AttendanceErrorLogger()
  let session: any
  
  try {
    session = await getAuthenticatedSession()

    const pin = formData.get('pin') as string
    const tipe = formData.get('tipe') as TipeAbsensi
    const clientTimezone = formData.get('timezone') as string
    const clientTimestamp = formData.get('timestamp') as string

    if (!pin || !tipe) {
      throw createAttendanceError(
        AttendanceErrorCode.PIN_INVALID,
        'PIN dan tipe absensi harus diisi'
      )
    }

    // Validate timezone and time consistency
    const clientTime = clientTimestamp ? new Date(clientTimestamp) : new Date()
    const syncResult = await syncServerTime(clientTime, clientTimezone)
    const serverTime = syncResult.serverTime
    
    if (!syncResult.isValid) {
      throw createAttendanceError(
        AttendanceErrorCode.TIMEZONE_MISMATCH,
        `Perbedaan waktu terlalu besar: ${Math.round(syncResult.timeDifference / 1000)} detik. Silakan sinkronkan waktu perangkat Anda.`
      )
    }

    const result = await withRetryTransaction(async (tx) => {
       // Cari tempat PKL berdasarkan PIN
       const tempatPkl = await tx.tempatPkl.findFirst({
         where: {
           pinAbsensi: pin,
           isActive: true
         }
       })

       if (!tempatPkl) {
         throw createAttendanceError(
           AttendanceErrorCode.PIN_INVALID,
           'PIN tidak valid atau tempat PKL tidak aktif'
         )
       }

       // Cari student berdasarkan user ID
       const student = await tx.student.findUnique({
         where: {
           userId: session.user.id
         }
       })

       if (!student) {
         throw createAttendanceError(
           AttendanceErrorCode.UNAUTHORIZED,
           'Data siswa tidak ditemukan'
         )
       }

       // Validasi apakah siswa terdaftar di tempat PKL ini
       if (student.tempatPklId !== tempatPkl.id) {
         throw createAttendanceError(
           AttendanceErrorCode.UNAUTHORIZED,
           'Anda tidak terdaftar di tempat PKL ini'
         )
       }

       const today = new Date()
       today.setHours(0, 0, 0, 0)

       // Cek setting absensi untuk tempat PKL dengan optimistic locking
       const settingAbsensi = await tx.settingAbsensi.findUnique({
         where: {
           tempatPklId: tempatPkl.id
         }
       })

       // Jika mode MASUK_SAJA, hanya boleh absen masuk
       if (settingAbsensi?.modeAbsensi === 'MASUK_SAJA' && tipe === 'PULANG') {
         throw createAttendanceError(
           AttendanceErrorCode.OUTSIDE_HOURS,
           'Tempat PKL ini hanya menggunakan absensi masuk'
         )
       }

       // Validasi waktu absensi menggunakan pengaturan dinamis
       try {
         const isOutsideHours = await isOutsideWorkingHoursDynamic(serverTime, tipe);
         if (isOutsideHours) {
           const currentPeriod = await getCurrentPeriodDynamic();
           throw createAttendanceError(
             AttendanceErrorCode.OUTSIDE_HOURS,
             `Absensi ${tipe.toLowerCase()} hanya dapat dilakukan pada ${currentPeriod.label}. Waktu saat ini: ${serverTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`
           );
         }
       } catch (timeValidationError) {
         // Jika terjadi error saat validasi waktu dinamis, gunakan fallback ke waktu default
         console.warn('Dynamic time validation failed, using fallback:', timeValidationError);
         
         const hour = serverTime.getHours();
         const minute = serverTime.getMinutes();
         const time = hour + (minute / 60);
         
         let isOutsideDefaultHours = false;
         if (tipe === 'MASUK') {
           isOutsideDefaultHours = time < 7 || time > 10;
         } else {
           isOutsideDefaultHours = time < 13 || time > 17;
         }
         
         if (isOutsideDefaultHours) {
           const defaultPeriod = tipe === 'MASUK' ? '07:00 - 10:00' : '13:00 - 17:00';
           throw createAttendanceError(
             AttendanceErrorCode.OUTSIDE_HOURS,
             `Absensi ${tipe.toLowerCase()} hanya dapat dilakukan pada ${defaultPeriod}. Waktu saat ini: ${serverTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`
           );
         }
       }

       // Cek apakah sudah absen hari ini untuk tipe yang sama
       const existingAbsensi = await tx.absensi.findUnique({
         where: {
           studentId_tanggal_tipe: {
             studentId: student.id,
             tanggal: today,
             tipe: tipe
           }
         }
       })

       if (existingAbsensi) {
         throw createAttendanceError(
           AttendanceErrorCode.ALREADY_SUBMITTED,
           `Anda sudah melakukan absensi ${tipe.toLowerCase()} hari ini`
         )
       }

       // Jika absen pulang, pastikan sudah absen masuk
       if (tipe === 'PULANG') {
         const absensiMasuk = await tx.absensi.findUnique({
           where: {
             studentId_tanggal_tipe: {
               studentId: student.id,
               tanggal: today,
               tipe: 'MASUK'
             }
           }
         })

         if (!absensiMasuk) {
           throw createAttendanceError(
             AttendanceErrorCode.MUST_CHECK_IN_FIRST,
             'Anda harus absen masuk terlebih dahulu'
           )
         }
       }

       const now = serverTime
       const formattedDate = formatDateForDatabase(today)
       const formattedTime = formatDateForDatabase(now)

       // Buat record absensi dengan version untuk optimistic locking
       const newAbsensi = await tx.absensi.create({
         data: {
           studentId: student.id,
           tempatPklId: tempatPkl.id,
           tanggal: today,
           tipe: tipe,
           waktuMasuk: tipe === 'MASUK' ? now : null,
           waktuPulang: tipe === 'PULANG' ? now : null,
           version: 1
         }
       })

       // Log successful attendance
       console.log('Attendance submitted successfully:', {
         operation: 'submitAbsensi',
         userId: session.user.id,
         studentId: student.id,
         tempatPklId: tempatPkl.id,
         tipe,
         timestamp: now,
         timezone: getServerTimezone()
       })

       return {
         success: true,
         message: `Absensi ${tipe.toLowerCase()} berhasil dicatat pada ${now.toLocaleTimeString('id-ID')}`,
         data: newAbsensi
       }
     }, 
     {
       maxRetries: absensiTransactionConfig.maxRetries,
       baseDelay: absensiTransactionConfig.baseDelay
     },
     {
       operation: `submitAbsensi_${tipe}`,
       enableMetrics: absensiTransactionConfig.enableMetrics
     })

    // Use optimized cache revalidation
    await revalidateAttendanceData(session.user.id, 'soft')
    return result

  } catch (error) {
    console.error('Error submitting absensi:', error)
    
    // Log error with context
    const attendanceError = parseError(error, {
      action: 'submitAbsensi',
      userId: session?.user?.id,
      pin: formData.get('pin') ? '[REDACTED]' : undefined
    })
    AttendanceErrorLogger.log(attendanceError)
    
    // Handle specific attendance errors
    if (error && typeof error === 'object' && 'code' in error) {
      const attendanceError = error as AttendanceError
      return {
        success: false,
        message: attendanceError.userMessage,
        code: attendanceError.code,
        retryable: attendanceError.retryable
      }
    }
    
    // Handle specific transaction errors
    if (error instanceof TransactionError) {
      return {
        success: false,
        message: error.message,
        retryable: true
      }
    }
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak terduga',
      retryable: false
    }
  }
}

export async function getTodayAbsensi() {
  try {
    const session = await getAuthenticatedSession()

    const student = await prisma.student.findUnique({
      where: {
        userId: session.user.id
      }
    })

    if (!student) {
      return {
        success: false,
        message: 'Data student tidak ditemukan',
        hasTempatPkl: false
      }
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const todayAbsensi = await prisma.absensi.findMany({
      where: {
        studentId: student.id,
        tanggal: today
      },
      orderBy: {
        tipe: 'asc'
      }
    })

    const absensiMasuk = todayAbsensi.find(a => a.tipe === 'MASUK')
    const absensiPulang = todayAbsensi.find(a => a.tipe === 'PULANG')

    return {
      success: true,
      data: {
        tanggal: today.toISOString().split('T')[0],
        waktuMasuk: absensiMasuk?.waktuMasuk?.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit'
        }) || null,
        waktuPulang: absensiPulang?.waktuPulang?.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit'
        }) || null
      },
      hasTempatPkl: !!student.tempatPklId
    }
  } catch (error) {
    console.error('Error getting today absensi:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak terduga'
    }
  }
}

export async function getRecentAbsensi() {
  try {
    const session = await getAuthenticatedSession()

    const student = await prisma.student.findUnique({
      where: {
        userId: session.user.id
      }
    })

    if (!student) {
      return {
        success: false,
        message: 'Data student tidak ditemukan',
        hasTempatPkl: false
      }
    }

    const recentAbsensi = await prisma.absensi.findMany({
      where: {
        studentId: student.id
      },
      include: {
        tempatPkl: {
          select: {
            nama: true,
            alamat: true
          }
        }
      },
      orderBy: {
        tanggal: 'desc'
      },
      take: 5
    })

    return {
      success: true,
      data: recentAbsensi,
      hasTempatPkl: !!student.tempatPklId
    }
  } catch (error) {
    console.error('Error getting recent absensi:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak terduga'
    }
  }
}