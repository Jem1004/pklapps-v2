import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "TEACHER") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    // Get teacher data first
    const teacher = await prisma.teacher.findUnique({
      where: { userId: session.user.id }
    })

    if (!teacher) {
      return NextResponse.json({ success: false, message: "Teacher not found" }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')

    // Build where clause for absensi
    const whereClause: any = {
      student: {
        teacherId: teacher.id // Use teacher.id instead of session.user.id
      }
    }
    
    // Filter by specific student if provided and not "all"
    if (studentId && studentId !== "all") {
      whereClause.studentId = studentId
    }

    // Filter by date range
    if (dateFrom || dateTo) {
      whereClause.tanggal = {}
      if (dateFrom) {
        whereClause.tanggal.gte = new Date(dateFrom + 'T00:00:00.000Z')
      }
      if (dateTo) {
        whereClause.tanggal.lte = new Date(dateTo + 'T23:59:59.999Z')
      }
    }

    const absensiLogs = await prisma.absensi.findMany({
      where: whereClause,
      include: {
        student: {
          include: {
            user: {
              select: {
                name: true,
                username: true
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
      orderBy: [
        {
          tanggal: 'desc'
        },
        {
          waktuMasuk: 'desc'
        }
      ]
    })

    return NextResponse.json({ success: true, data: absensiLogs })
  } catch (error) {
    console.error('Error fetching absensi logs for teacher:', error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}