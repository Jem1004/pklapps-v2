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

    const students = await prisma.student.findMany({
      include: {
        user: {
          select: {
            name: true,
            username: true
          }
        },
        tempatPkl: {
          select: {
            nama: true
          }
        },
        jurnals: {
          select: {
            id: true,
            tanggal: true,
            comments: {
              select: {
                id: true
              }
            }
          },
          orderBy: {
            tanggal: 'desc'
          }
        }
      }
    })

    const studentActivities = students.map(student => {
      const journalCount = student.jurnals.length
      const lastJournalDate = student.jurnals.length > 0 ? student.jurnals[0].tanggal : null
      const commentCount = student.jurnals.reduce((total, journal) => total + journal.comments.length, 0)
      
      return {
        id: student.id,
        user: student.user,
        nisn: student.nisn,
        kelas: student.kelas,
        jurusan: student.jurusan,
        tempatPkl: student.tempatPkl,
        journalCount,
        lastJournalDate: lastJournalDate ? lastJournalDate.toISOString() : null,
        commentCount,
        lastActivity: lastJournalDate ? lastJournalDate.toISOString() : null
      }
    })

    return NextResponse.json(studentActivities)
  } catch (error) {
    console.error('Error fetching student activities:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}