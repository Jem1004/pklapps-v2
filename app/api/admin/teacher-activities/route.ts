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

    const teachers = await prisma.teacher.findMany({
      include: {
        user: {
          select: {
            name: true,
            username: true
          }
        },
        comments: {
          select: {
            id: true,
            createdAt: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    const teacherActivities = await Promise.all(
      teachers.map(async (teacher) => {
        const commentCount = teacher.comments.length
        const lastCommentDate = teacher.comments.length > 0 ? teacher.comments[0].createdAt : null
        
        // Count students supervised (students whose journals this teacher has commented on)
        const studentsSupervised = await prisma.student.count({
          where: {
            jurnals: {
              some: {
                comments: {
                  some: {
                    teacherId: teacher.id
                  }
                }
              }
            }
          }
        })

        return {
          id: teacher.id,
          user: teacher.user,
          nip: teacher.nip,
          commentCount,
          lastCommentDate: lastCommentDate ? lastCommentDate.toISOString() : null,
          studentsSupervised
        }
      })
    )

    return NextResponse.json(teacherActivities)
  } catch (error) {
    console.error('Error fetching teacher activities:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}