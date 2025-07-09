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
import prisma from '@/lib/prisma'

export async function submitAbsensi(formData: FormData) {
  try {
    const session = await getAuthenticatedSession()

    const pin = formData.get('pin') as string
    const tipe = formData.get('tipe') as TipeAbsensi

    if (!pin || !tipe) {
      throw new Error('PIN dan tipe absensi harus diisi')
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
         throw new Error('PIN tidak valid atau tempat PKL tidak aktif')
       }

       // Cari student berdasarkan user ID
       const student = await tx.student.findUnique({
         where: {
           userId: session.user.id
         }
       })

       if (!student) {
         throw new Error('Data siswa tidak ditemukan')
       }

       // Validasi apakah siswa terdaftar di tempat PKL ini
       if (student.tempatPklId !== tempatPkl.id) {
         throw new Error('Anda tidak terdaftar di tempat PKL ini')
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
         throw new Error('Tempat PKL ini hanya menggunakan absensi masuk')
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
         throw new ConstraintViolationError(
           'submitAbsensi',
           'DUPLICATE_ATTENDANCE'
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
           throw new Error('Anda harus absen masuk terlebih dahulu')
         }
       }

       const now = new Date()

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

    revalidatePath('/dashboard/absensi')
    return result

  } catch (error) {
    console.error('Error submitting absensi:', error)
    
    // Handle specific transaction errors
    if (error instanceof TransactionError) {
      return {
        success: false,
        message: error.message
      }
    }
    
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