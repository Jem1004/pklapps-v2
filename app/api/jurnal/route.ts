import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const jurnalSchema = z.object({
  tanggal: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Format tanggal tidak valid"
  }),
  kegiatan: z.string().min(10, "Deskripsi kegiatan minimal 10 karakter"),
  dokumentasi: z.string().optional()
})

const updateJurnalSchema = z.object({
  id: z.string(),
  kegiatan: z.string().min(10, "Deskripsi kegiatan minimal 10 karakter"),
  dokumentasi: z.string().optional()
})

// POST - Create new jurnal
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get student data
    const student = await prisma.student.findUnique({
      where: { userId: session.user.id }
    })

    if (!student) {
      return NextResponse.json(
        { error: "Data siswa tidak ditemukan" },
        { status: 404 }
      )
    }

    const body = await request.json()
    const validatedData = jurnalSchema.parse(body)

    const tanggal = new Date(validatedData.tanggal)
    
    // Check if jurnal already exists for this date
    const existingJurnal = await prisma.jurnal.findUnique({
      where: {
        studentId_tanggal: {
          studentId: student.id,
          tanggal: tanggal
        }
      }
    })

    if (existingJurnal) {
      return NextResponse.json(
        { error: "Jurnal untuk tanggal ini sudah ada" },
        { status: 400 }
      )
    }

    // Create new jurnal
    const jurnal = await prisma.jurnal.create({
      data: {
        tanggal: tanggal,
        kegiatan: validatedData.kegiatan,
        dokumentasi: validatedData.dokumentasi,
        studentId: student.id
      }
    })

    return NextResponse.json({
      message: "Jurnal berhasil disimpan",
      data: jurnal
    })

  } catch (error) {
    console.error("Error creating jurnal:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Data tidak valid", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    )
  }
}

// PUT - Update existing jurnal
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const student = await prisma.student.findUnique({
      where: { userId: session.user.id }
    })

    if (!student) {
      return NextResponse.json(
        { error: "Data siswa tidak ditemukan" },
        { status: 404 }
      )
    }

    const body = await request.json()
    const validatedData = updateJurnalSchema.parse(body)

    // Check if jurnal exists and belongs to this student
    const existingJurnal = await prisma.jurnal.findFirst({
      where: {
        id: validatedData.id,
        studentId: student.id
      },
      include: {
        comments: true
      }
    })

    if (!existingJurnal) {
      return NextResponse.json(
        { error: "Jurnal tidak ditemukan" },
        { status: 404 }
      )
    }

    // Check if jurnal has been commented by teacher
    if (existingJurnal.comments.length > 0) {
      return NextResponse.json(
        { error: "Jurnal yang sudah dikomentari guru tidak dapat diubah" },
        { status: 403 }
      )
    }

    // Update jurnal
    const updatedJurnal = await prisma.jurnal.update({
      where: { id: validatedData.id },
      data: {
        kegiatan: validatedData.kegiatan,
        dokumentasi: validatedData.dokumentasi
      }
    })

    return NextResponse.json({
      message: "Jurnal berhasil diperbarui",
      data: updatedJurnal
    })

  } catch (error) {
    console.error("Error updating jurnal:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Data tidak valid", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    )
  }
}

// GET - Get jurnal(s)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const student = await prisma.student.findUnique({
      where: { userId: session.user.id }
    })

    if (!student) {
      return NextResponse.json(
        { error: "Data siswa tidak ditemukan" },
        { status: 404 }
      )
    }

    const { searchParams } = new URL(request.url)
    const dateParam = searchParams.get('date')
    const allParam = searchParams.get('all')
    
    // If 'all' parameter is present, return all journals
    if (allParam === 'true') {
      const jurnals = await prisma.jurnal.findMany({
        where: {
          studentId: student.id
        },
        include: {
          comments: {
            include: {
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
          }
        },
        orderBy: {
          tanggal: 'desc'
        }
      })

      return NextResponse.json({ data: jurnals })
    }
    
    // Original logic for single date
    const targetDate = dateParam ? new Date(dateParam) : new Date()
    targetDate.setHours(0, 0, 0, 0)

    const jurnal = await prisma.jurnal.findUnique({
      where: {
        studentId_tanggal: {
          studentId: student.id,
          tanggal: targetDate
        }
      }
    })

    return NextResponse.json({ data: jurnal })

  } catch (error) {
    console.error("Error fetching jurnal:", error)
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    )
  }
}