import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from 'zod'

const komentarSchema = z.object({
  jurnalId: z.string().min(1, 'Jurnal ID is required'),
  comment: z.string().min(1, 'Komentar tidak boleh kosong').max(1000, 'Komentar terlalu panjang'),
  commentId: z.string().optional() // For editing existing comment
})

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'TEACHER') {
      return NextResponse.json({ error: 'Access denied. Only teachers can comment.' }, { status: 403 })
    }

    // Get teacher data
    const teacher = await prisma.teacher.findUnique({
      where: { userId: session.user.id }
    })

    if (!teacher) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 })
    }

    const body = await request.json()
    const validatedData = komentarSchema.parse(body)

    // Verify jurnal exists
    const jurnal = await prisma.jurnal.findUnique({
      where: { id: validatedData.jurnalId },
      include: {
        student: {
          include: {
            user: true
          }
        }
      }
    })

    if (!jurnal) {
      return NextResponse.json({ error: 'Jurnal not found' }, { status: 404 })
    }

    let result

    if (validatedData.commentId) {
      // Update existing comment
      const existingComment = await prisma.jurnalComment.findUnique({
        where: { id: validatedData.commentId },
        include: { teacher: true }
      })

      if (!existingComment) {
        return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
      }

      // Verify the comment belongs to this teacher
      if (existingComment.teacherId !== teacher.id) {
        return NextResponse.json({ error: 'You can only edit your own comments' }, { status: 403 })
      }

      result = await prisma.jurnalComment.update({
        where: { id: validatedData.commentId },
        data: {
          comment: validatedData.comment
        },
        include: {
          teacher: {
            include: {
              user: true
            }
          }
        }
      })
    } else {
      // Create new comment
      result = await prisma.jurnalComment.create({
        data: {
          comment: validatedData.comment,
          jurnalId: validatedData.jurnalId,
          teacherId: teacher.id
        },
        include: {
          teacher: {
            include: {
              user: true
            }
          }
        }
      })
    }

    return NextResponse.json({
      message: validatedData.commentId ? 'Komentar berhasil diperbarui' : 'Komentar berhasil ditambahkan',
      data: result
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error in komentar API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}