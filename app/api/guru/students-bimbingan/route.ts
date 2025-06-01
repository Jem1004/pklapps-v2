import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/../lib/auth'
import { prisma } from '@/../lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'TEACHER') {
      return NextResponse.json({ error: 'Access denied. Only teachers can view student data.' }, { status: 403 })
    }

    // Get teacher data
    const teacher = await prisma.teacher.findUnique({
      where: { userId: session.user.id }
    })

    if (!teacher) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 })
    }

    // Get students supervised by this teacher with journal statistics
    const students = await prisma.student.findMany({
      where: {
        teacherId: teacher.id
      },
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
        },
        jurnals: {
          select: {
            tanggal: true
          },
          orderBy: {
            tanggal: 'desc'
          }
        }
      },
      orderBy: {
        user: {
          name: 'asc'
        }
      }
    })

    // Transform data to include journal statistics
    const studentsWithStats = students.map(student => ({
      id: student.id,
      user: student.user,
      nisn: student.nisn,
      kelas: student.kelas,
      jurusan: student.jurusan,
      tempatPkl: student.tempatPkl,
      totalJurnals: student.jurnals.length,
      lastJurnalDate: student.jurnals.length > 0 ? student.jurnals[0].tanggal : null
    }))

    return NextResponse.json({
      message: 'Students retrieved successfully',
      data: studentsWithStats
    })

  } catch (error) {
    console.error('Error fetching students:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}