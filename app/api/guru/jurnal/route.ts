import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'TEACHER') {
      return NextResponse.json({ error: 'Access denied. Only teachers can view student journals.' }, { status: 403 })
    }

    // Get teacher data
    const teacher = await prisma.teacher.findUnique({
      where: { userId: session.user.id }
    })

    if (!teacher) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 })
    }

    // Get journals only from students supervised by this teacher
    const jurnals = await prisma.jurnal.findMany({
      where: {
        student: {
          teacherId: teacher.id
        }
      },
      include: {
        student: {
          include: {
            user: true,
            tempatPkl: true,
            teacher: {
              include: {
                user: true
              }
            }
          }
        },
        comments: {
          include: {
            teacher: {
              include: {
                user: true
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      },
      orderBy: {
        tanggal: 'desc'
      }
    })

    return NextResponse.json({
      message: 'Journals retrieved successfully',
      data: jurnals
    })

  } catch (error) {
    console.error('Error fetching journals:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}