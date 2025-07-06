'use server'

import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function submitAbsensi(pinAbsensi: string, tipe?: 'MASUK' | 'PULANG') {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'STUDENT') {
      return {
        success: false,
        message: 'Unauthorized access'
      }
    }

    // Cari tempat PKL berdasarkan PIN
    const tempatPkl = await prisma.tempatPkl.findFirst({
      where: {
        pinAbsensi: pinAbsensi,
        isActive: true
      }
    })

    if (!tempatPkl) {
      return {
        success: false,
        message: 'PIN tidak valid atau tempat PKL tidak aktif'
      }
    }

    // Cek apakah student sudah di-mapping ke tempat PKL ini
    const student = await prisma.student.findFirst({
      where: {
        userId: session.user.id,
        tempatPklId: tempatPkl.id
      }
    })

    if (!student) {
      return {
        success: false,
        message: 'Anda tidak terdaftar di tempat PKL ini. Silakan hubungi admin untuk mapping ke tempat PKL yang benar.'
      }
    }

    // Cek setting absensi untuk tempat PKL
    const setting = await prisma.settingAbsensi.findFirst({
      where: {
        tempatPklId: tempatPkl.id
      }
    })

    if (!setting) {
      // Buat setting default jika belum ada
      await prisma.settingAbsensi.create({
        data: {
          tempatPklId: tempatPkl.id,
          modeAbsensi: 'MASUK_PULANG'
        }
      })
    }

    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    const currentTime = currentHour + (currentMinute / 60)

    // Gunakan tipe yang dipilih user, atau tentukan berdasarkan waktu jika tidak ada
    let tipeAbsensi: 'MASUK' | 'PULANG'
    
    if (tipe) {
      tipeAbsensi = tipe
    } else {
      // Fallback: tentukan berdasarkan waktu untuk backward compatibility
      if (currentTime >= 7 && currentTime <= 10) {
        tipeAbsensi = 'MASUK'
      } else if (currentTime >= 13 && currentTime <= 17) {
        tipeAbsensi = 'PULANG'
      } else {
        return {
          success: false,
          message: 'Absensi hanya dapat dilakukan pada jam 07:00-10:00 (masuk) atau 13:00-17:00 (pulang)'
        }
      }
    }

    // Cek apakah sudah absen hari ini dengan tipe yang sama
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const existingAbsensi = await prisma.absensi.findFirst({
      where: {
        studentId: student.id,
        tipe: tipeAbsensi,
        tanggal: {
          gte: today,
          lt: tomorrow
        }
      }
    })

    if (existingAbsensi) {
      return {
        success: false,
        message: `Anda sudah melakukan absensi ${tipeAbsensi.toLowerCase()} hari ini pada ${existingAbsensi.tanggal.toLocaleTimeString('id-ID')}`
      }
    }

    // Simpan absensi dengan waktu yang tepat
    const absensi = await prisma.absensi.create({
      data: {
        studentId: student.id,
        tempatPklId: tempatPkl.id,
        tanggal: now, // Simpan waktu lengkap
        tipe: tipeAbsensi,
        // Set waktu masuk/pulang sesuai tipe
        ...(tipeAbsensi === 'MASUK' ? { waktuMasuk: now } : { waktuPulang: now })
      }
    })

    revalidatePath('/absensi')
    revalidatePath('/dashboard/absensi')

    return {
      success: true,
      message: `Absensi ${tipeAbsensi.toLowerCase()} berhasil dicatat pada ${now.toLocaleTimeString('id-ID')}`,
      data: {
        tipe: tipeAbsensi,
        tempatPkl: tempatPkl.nama,
        waktu: absensi.tanggal
      }
    }
  } catch (error) {
    console.error('Error submitting absensi:', error)
    return {
      success: false,
      message: 'Terjadi kesalahan saat menyimpan absensi. Silakan coba lagi.'
    }
  }
}

export async function getRecentAbsensi() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'STUDENT') {
      return {
        success: false,
        message: 'Unauthorized access'
      }
    }

    const student = await prisma.student.findFirst({
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
      message: 'Terjadi kesalahan saat mengambil data absensi'
    }
  }
}