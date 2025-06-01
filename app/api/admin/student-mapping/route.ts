import { NextRequest, NextResponse } from "../../../../node_modules/next/server"
import { getServerSession } from "../../../../node_modules/next-auth/next"
import { authOptions } from "@/../lib/auth"
import { prisma } from "@/../lib/prisma"
import { z } from "zod"

const mappingSchema = z.object({
  studentId: z.string(),
  tempatPklId: z.string(),
  teacherId: z.string().optional().nullable()
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { studentId, tempatPklId, teacherId } = mappingSchema.parse(body)

    const updatedStudent = await prisma.student.update({
      where: { id: studentId },
      data: {
        tempatPklId: tempatPklId,
        teacherId: teacherId || null
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
        teacher: {
          include: {
            user: {
              select: {
                name: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json(updatedStudent)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error mapping student:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')

    if (!studentId) {
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 })
    }

    const updatedStudent = await prisma.student.update({
      where: { id: studentId },
      data: {
        tempatPklId: null,
        teacherId: null
      }
    })

    return NextResponse.json(updatedStudent)
  } catch (error) {
    console.error('Error removing student mapping:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}