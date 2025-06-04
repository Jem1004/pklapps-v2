"use server"

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { TipeAbsensi } from "@prisma/client"

export interface AbsensiData {
  id: string
  tanggal: Date
  waktuMasuk: Date | null
  waktuPulang: Date | null
  tipe: TipeAbsensi
  tempatPkl: {
    nama: string
  }
  diLuarWaktu: boolean
}

export interface AbsensiResponse {
  success: boolean
  data?: AbsensiData[]
  message?: string
  sudahAbsenHariIni: boolean
}

// Fungsi untuk mengecek apakah absensi dilakukan di luar waktu
function isOutsideWorkingHours(waktu: Date, tipe: TipeAbsensi): boolean {
  const hour = waktu.getHours()
  const minute = waktu.getMinutes()
  const time = hour + (minute / 60)
  
  if (tipe === TipeAbsensi.MASUK) {
    // Jam masuk: 07:00 - 10:00
    return time < 7 || time > 10
  } else {
    // Jam pulang: 13:00 - 17:00
    return time < 13 || time > 17
  }
}

export async function getAbsensiData(bulan?: string): Promise<AbsensiResponse> {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== "STUDENT") {
      return {
        success: false,
        message: "Unauthorized: Hanya siswa yang dapat mengakses data absensi",
        sudahAbsenHariIni: false
      }
    }

    // Ambil data student
    const student = await prisma.student.findUnique({
      where: { userId: session.user.id }
    })

    if (!student) {
      return {
        success: false,
        message: "Data siswa tidak ditemukan",
        sudahAbsenHariIni: false
      }
    }

    // Buat filter tanggal jika ada parameter bulan
    let dateFilter = {}
    if (bulan) {
      const [year, month] = bulan.split('-')
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1)
      const endDate = new Date(parseInt(year), parseInt(month), 0)
      
      dateFilter = {
        tanggal: {
          gte: startDate,
          lte: endDate
        }
      }
    }

    // Ambil data absensi
    const absensiList = await prisma.absensi.findMany({
      where: {
        studentId: student.id,
        ...dateFilter
      },
      include: {
        tempatPkl: {
          select: {
            nama: true
          }
        }
      },
      orderBy: {
        tanggal: 'desc'
      }
    })

    // Cek apakah sudah absen hari ini
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const absensiHariIni = absensiList.some(absensi => {
      const tanggalAbsensi = new Date(absensi.tanggal)
      tanggalAbsensi.setHours(0, 0, 0, 0)
      return tanggalAbsensi.getTime() === today.getTime()
    })

    // Transform data dan tambahkan info di luar waktu
    const transformedData: AbsensiData[] = absensiList.map(absensi => {
      let diLuarWaktu = false
      
      if (absensi.tipe === TipeAbsensi.MASUK && absensi.waktuMasuk) {
        diLuarWaktu = isOutsideWorkingHours(absensi.waktuMasuk, TipeAbsensi.MASUK)
      } else if (absensi.tipe === TipeAbsensi.PULANG && absensi.waktuPulang) {
        diLuarWaktu = isOutsideWorkingHours(absensi.waktuPulang, TipeAbsensi.PULANG)
      }

      return {
        id: absensi.id,
        tanggal: absensi.tanggal,
        waktuMasuk: absensi.waktuMasuk,
        waktuPulang: absensi.waktuPulang,
        tipe: absensi.tipe,
        tempatPkl: absensi.tempatPkl,
        diLuarWaktu
      }
    })

    return {
      success: true,
      data: transformedData,
      sudahAbsenHariIni: absensiHariIni
    }

  } catch (error) {
    console.error("Error fetching absensi data:", error)
    return {
      success: false,
      message: "Terjadi kesalahan saat mengambil data absensi",
      sudahAbsenHariIni: false
    }
  }
}