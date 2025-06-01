import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const userSchema = z.object({
  username: z.string().min(3),
  name: z.string().min(2),
  email: z.string().email().optional().or(z.literal("")),
  password: z.string().min(6),
  role: z.enum(["STUDENT", "TEACHER"]),
  nisn: z.string().optional(),
  kelas: z.string().optional(),
  jurusan: z.string().optional(),
  nip: z.string().optional(),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const users = await prisma.user.findMany({
      include: {
        student: true,
        teacher: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ data: users })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = userSchema.parse(body)

    // Check if username already exists
    const existingUser = await prisma.user.findUnique({
      where: { username: validatedData.username }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username sudah digunakan' },
        { status: 400 }
      )
    }

    // Check email if provided
    if (validatedData.email) {
      const existingEmail = await prisma.user.findUnique({
        where: { email: validatedData.email }
      })

      if (existingEmail) {
        return NextResponse.json(
          { error: 'Email sudah digunakan' },
          { status: 400 }
        )
      }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(validatedData.password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        username: validatedData.username,
        name: validatedData.name,
        email: validatedData.email || `${validatedData.username}@example.com`,
        passwordHash,
        role: validatedData.role,
      }
    })

    // Create student or teacher record
    if (validatedData.role === 'STUDENT' && validatedData.nisn) {
      await prisma.student.create({
        data: {
          userId: user.id,
          nisn: validatedData.nisn,
          kelas: validatedData.kelas || '',
          jurusan: validatedData.jurusan || '',
        }
      })
    } else if (validatedData.role === 'TEACHER' && validatedData.nip) {
      await prisma.teacher.create({
        data: {
          userId: user.id,
          nip: validatedData.nip,
        }
      })
    }

    return NextResponse.json({ data: user })
  } catch (error) {
    console.error('Error creating user:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Data tidak valid', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}