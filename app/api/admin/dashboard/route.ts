import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Get all statistics in parallel for better performance
    const [
      totalUsers,
      totalStudents, 
      totalTeachers,
      totalTempatPkl,
      totalAbsensi,
      totalJurnal,
      todayAbsensi,
      todayJurnal,
      activeTempatPkl,
      activeStudents
    ] = await Promise.all([
      // Total users (all roles)
      prisma.user.count(),
      
      // Total students
      prisma.student.count(),
      
      // Total teachers
      prisma.teacher.count(),
      
      // Total tempat PKL
      prisma.tempatPkl.count(),
      
      // Total absensi records
      prisma.absensi.count(),
      
      // Total jurnal records
      prisma.jurnal.count(),
      
      // Today's attendance
      prisma.absensi.count({
        where: {
          tanggal: {
            gte: today,
            lt: tomorrow
          }
        }
      }),
      
      // Today's journals
      prisma.jurnal.count({
        where: {
          tanggal: {
            gte: today,
            lt: tomorrow
          }
        }
      }),
      
      // Active tempat PKL (with students)
      prisma.tempatPkl.count({
        where: {
          isActive: true,
          students: {
            some: {}
          }
        }
      }),
      
      // Active students (with recent activity in last 7 days)
      prisma.student.count({
        where: {
          OR: [
            {
              jurnals: {
                some: {
                  tanggal: {
                    gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                  }
                }
              }
            },
            {
              absensis: {
                some: {
                  tanggal: {
                    gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                  }
                }
              }
            }
          ]
        }
      })
    ])

    // Calculate growth percentages (mock calculation - you can implement real historical comparison)
    const stats = {
      totalUsers: {
        value: totalUsers,
        change: '+5%', // You can calculate real growth by comparing with previous period
        label: 'Total Users'
      },
      totalStudents: {
        value: totalStudents,
        change: '+8%',
        label: 'Total Siswa'
      },
      totalTeachers: {
        value: totalTeachers,
        change: '+2%',
        label: 'Total Guru'
      },
      totalTempatPkl: {
        value: totalTempatPkl,
        change: '+3%',
        label: 'Tempat PKL'
      },
      activeTempatPkl: {
        value: activeTempatPkl,
        change: '+12%',
        label: 'Tempat PKL Aktif'
      },
      activeStudents: {
        value: activeStudents,
        change: '+15%',
        label: 'Siswa Aktif'
      },
      totalAbsensi: {
        value: totalAbsensi,
        change: '+25%',
        label: 'Total Absensi'
      },
      totalJurnal: {
        value: totalJurnal,
        change: '+18%',
        label: 'Total Jurnal'
      },
      todayActivity: {
        value: todayAbsensi + todayJurnal,
        change: '+20%',
        label: 'Aktivitas Hari Ini'
      },
      todayAbsensi: {
        value: todayAbsensi,
        change: '+10%',
        label: 'Absensi Hari Ini'
      },
      todayJurnal: {
        value: todayJurnal,
        change: '+15%',
        label: 'Jurnal Hari Ini'
      }
    }

    return NextResponse.json({
      success: true,
      data: stats,
      timestamp: now.toISOString()
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json({ 
      success: false, 
      error: "Internal server error" 
    }, { status: 500 })
  }
}