import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const userUpdateSchema = z.object({
  username: z.string().min(3),
  name: z.string().min(2),
  email: z.string().email().optional().or(z.literal("")),
  password: z.string().min(6).optional(),
  role: z.enum(["STUDENT", "TEACHER"]),
  nisn: z.string().optional(),
  kelas: z.string().optional(),
  jurusan: z.string().optional(),
  nip: z.string().optional(),
})

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { userId } = await params

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        student: true,
        teacher: true
      }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User tidak ditemukan' },
        { status: 404 }
      )
    }

    // Delete user (cascade will handle student/teacher records)
    await prisma.user.delete({
      where: { id: userId }
    })

    return NextResponse.json({ 
      message: 'User berhasil dihapus',
      deletedUser: {
        id: existingUser.id,
        name: existingUser.name,
        role: existingUser.role
      }
    })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { userId } = await params
    const body = await request.json()
    const validatedData = userUpdateSchema.parse(body)

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        student: true,
        teacher: true
      }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User tidak ditemukan' },
        { status: 404 }
      )
    }

    // Check if username is taken by another user
    if (validatedData.username !== existingUser.username) {
      const usernameExists = await prisma.user.findUnique({
        where: { username: validatedData.username }
      })

      if (usernameExists) {
        return NextResponse.json(
          { error: 'Username sudah digunakan' },
          { status: 400 }
        )
      }
    }

    // Check email if provided and different
    if (validatedData.email && validatedData.email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: validatedData.email }
      })

      if (emailExists) {
        return NextResponse.json(
          { error: 'Email sudah digunakan' },
          { status: 400 }
        )
      }
    }

    // Prepare user update data
    const userUpdateData: any = {
      username: validatedData.username,
      name: validatedData.name,
      email: validatedData.email || `${validatedData.username}@example.com`,
      role: validatedData.role,
    }

    // Hash password if provided
    if (validatedData.password) {
      userUpdateData.passwordHash = await bcrypt.hash(validatedData.password, 12)
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: userUpdateData,
      include: {
        student: true,
        teacher: true
      }
    })

    // Handle role changes
    if (existingUser.role !== validatedData.role) {
      // Delete old role-specific record
      if (existingUser.student) {
        await prisma.student.delete({
          where: { userId: userId }
        })
      }
      if (existingUser.teacher) {
        await prisma.teacher.delete({
          where: { userId: userId }
        })
      }

      // Create new role-specific record
      if (validatedData.role === 'STUDENT' && validatedData.nisn) {
        await prisma.student.create({
          data: {
            userId: userId,
            nisn: validatedData.nisn,
            kelas: validatedData.kelas || '',
            jurusan: validatedData.jurusan || '',
          }
        })
      } else if (validatedData.role === 'TEACHER' && validatedData.nip) {
        await prisma.teacher.create({
          data: {
            userId: userId,
            nip: validatedData.nip,
          }
        })
      }
    } else {
      // Update existing role-specific record
      if (validatedData.role === 'STUDENT' && existingUser.student) {
        await prisma.student.update({
          where: { userId: userId },
          data: {
            nisn: validatedData.nisn || existingUser.student.nisn,
            kelas: validatedData.kelas || existingUser.student.kelas,
            jurusan: validatedData.jurusan || existingUser.student.jurusan,
          }
        })
      } else if (validatedData.role === 'TEACHER' && existingUser.teacher) {
        await prisma.teacher.update({
          where: { userId: userId },
          data: {
            nip: validatedData.nip || existingUser.teacher.nip,
          }
        })
      }
    }

    // Fetch updated user with relations
    const finalUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        student: true,
        teacher: true
      }
    })

    return NextResponse.json({ 
      message: 'User berhasil diupdate',
      data: finalUser
    })
  } catch (error) {
    console.error('Error updating user:', error)
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