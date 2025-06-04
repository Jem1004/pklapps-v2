import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const tempatPklId = searchParams.get('tempatPklId')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')

    const whereClause: any = {}
    
    if (tempatPklId) {
      whereClause.student = {
        tempatPklId: tempatPklId
      }
    }

    if (dateFrom || dateTo) {
      whereClause.tanggal = {}
      if (dateFrom) {
        whereClause.tanggal.gte = new Date(dateFrom)
      }
      if (dateTo) {
        whereClause.tanggal.lte = new Date(dateTo + 'T23:59:59.999Z')
      }
    }

    // Fetch data absensi dengan relasi lengkap
    const absensiLogs = await prisma.absensi.findMany({
      where: whereClause,
      include: {
        student: {
          include: {
            user: {
              select: {
                name: true
              }
            },
            tempatPkl: {
              select: {
                nama: true,
                alamat: true
              }
            }
          }
        },
        tempatPkl: {
          select: {
            nama: true,
            alamat: true
          }
        }
      },
      orderBy: {
        tanggal: 'desc'
      }
    })

    // Group absensi by student and date untuk menggabungkan MASUK dan PULANG
    const groupedAbsensi = new Map()
    
    absensiLogs.forEach(absensi => {
      const key = `${absensi.studentId}-${absensi.tanggal.toISOString().split('T')[0]}`
      
      if (!groupedAbsensi.has(key)) {
        groupedAbsensi.set(key, {
          id: absensi.id,
          tanggal: absensi.tanggal,
          jamMasuk: null,
          jamKeluar: null,
          student: absensi.student,
          tempatPkl: absensi.tempatPkl || absensi.student.tempatPkl,
          lokasi: null,
          status: 'TIDAK_HADIR'
        })
      }
      
      const record = groupedAbsensi.get(key)
      
      if (absensi.tipe === 'MASUK') {
        record.jamMasuk = absensi.waktuMasuk
        record.status = 'HADIR'
        
        // Cek keterlambatan (asumsi jam masuk normal 08:00)
        if (absensi.waktuMasuk) {
          const jamMasuk = new Date(absensi.waktuMasuk)
          const jamNormal = new Date(absensi.waktuMasuk)
          jamNormal.setHours(8, 0, 0, 0)
          
          if (jamMasuk > jamNormal) {
            record.status = 'TERLAMBAT'
          }
        }
      } else if (absensi.tipe === 'PULANG') {
        record.jamKeluar = absensi.waktuPulang
      }
    })

    const processedData = Array.from(groupedAbsensi.values())

    return NextResponse.json({ success: true, data: processedData })
  } catch (error) {
    console.error('Error fetching absensi logs:', error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}