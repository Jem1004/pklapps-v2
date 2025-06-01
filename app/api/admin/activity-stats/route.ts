import { NextResponse } from "../../../../node_modules/next/server"
import { getServerSession } from "../../../../node_modules/next-auth/next"
import { authOptions } from "@/../lib/auth"
import { prisma } from "@/../lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const [totalStudents, totalJournals, totalComments, journalsThisMonth, commentsThisMonth] = await Promise.all([
      prisma.student.count(),
      prisma.jurnal.count(),
      prisma.jurnalComment.count(),
      prisma.jurnal.count({
        where: {
          tanggal: {
            gte: startOfMonth
          }
        }
      }),
      prisma.jurnalComment.count({
        where: {
          createdAt: {
            gte: startOfMonth
          }
        }
      })
    ])

    // Count active students (students who have submitted journals in the last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const activeStudents = await prisma.student.count({
      where: {
        jurnals: {
          some: {
            tanggal: {
              gte: sevenDaysAgo
            }
          }
        }
      }
    })

    return NextResponse.json({
      totalStudents,
      totalJournals,
      totalComments,
      journalsThisMonth,
      commentsThisMonth,
      activeStudents
    })
  } catch (error) {
    console.error('Error fetching activity stats:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}