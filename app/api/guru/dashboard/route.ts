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

    // Get teacher data
    const teacher = await prisma.teacher.findUnique({
      where: { userId: session.user.id }
    })

    if (!teacher) {
      return NextResponse.json({ success: false, message: "Teacher not found" }, { status: 404 })
    }

    // Get total students supervised by this teacher
    const totalStudents = await prisma.student.count({
      where: {
        teacherId: teacher.id
      }
    })

    // Get total attendance records for supervised students
    const totalAbsensi = await prisma.absensi.count({
      where: {
        student: {
          teacherId: teacher.id
        }
      }
    })

    // Get today's attendance count
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const todayAbsensi = await prisma.absensi.count({
      where: {
        student: {
          teacherId: teacher.id
        },
        tanggal: {
          gte: today,
          lt: tomorrow
        }
      }
    })

    // Get recent activity (last attendance date for each student)
    const recentActivity = await prisma.absensi.findMany({
      where: {
        student: {
          teacherId: teacher.id
        }
      },
      include: {
        student: {
          include: {
            user: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        tanggal: 'desc'
      },
      take: 5
    })

    // Get students with their last attendance
    const studentsWithLastAttendance = await prisma.student.findMany({
      where: {
        teacherId: teacher.id
      },
      include: {
        user: {
          select: {
            name: true
          }
        },
        absensis: {
          orderBy: {
            tanggal: 'desc'
          },
          take: 1
        }
      }
    })

    const dashboardData = {
      totalStudents,
      totalAbsensi,
      todayAbsensi,
      recentActivity: recentActivity.map(activity => ({
        studentName: activity.student.user.name,
        date: activity.tanggal,
        type: activity.tipe
      })),
      studentsActivity: studentsWithLastAttendance.map(student => ({
        name: student.user.name,
        lastAttendance: student.absensis.length > 0 ? student.absensis[0].tanggal : null
      }))
    }

    return NextResponse.json({ success: true, data: dashboardData })
  } catch (error) {
    console.error('Error fetching dashboard data for teacher:', error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}