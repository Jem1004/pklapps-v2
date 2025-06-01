import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const importUserSchema = z.object({
  username: z.string().min(3),
  nama_lengkap: z.string().min(2),
  email: z.string().email().optional().or(z.literal('')),
  password: z.string().optional(),
  role: z.enum(["STUDENT", "TEACHER"]),
  nisn: z.string().optional(),
  kelas: z.string().optional(),
  jurusan: z.string().optional(),
})

const importSchema = z.object({
  users: z.array(importUserSchema)
})

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
    
    // Filter out empty rows before validation
    const filteredUsers = body.users.filter((user: any) => 
      user.username && user.username.trim() !== '' &&
      user.nama_lengkap && user.nama_lengkap.trim() !== '' &&
      user.role && user.role.trim() !== ''
    )
    
    const { users } = importSchema.parse({ users: filteredUsers })

    const results = {
      success: 0,
      failed: 0,
      errors: [] as Array<{ row: number; username: string; error: string }>
    }

    for (let i = 0; i < users.length; i++) {
      const user = users[i]
      const rowNumber = i + 2 // +2 because CSV starts from row 2 (after header)

      try {
        // Validate required fields
        if (!user.username || !user.nama_lengkap || !user.role) {
          results.failed++
          results.errors.push({
            row: rowNumber,
            username: user.username || 'N/A',
            error: 'Username, nama lengkap, dan role wajib diisi'
          })
          continue
        }

        // Validate role-specific fields
        if (user.role === 'STUDENT' && !user.nisn) {
          results.failed++
          results.errors.push({
            row: rowNumber,
            username: user.username,
            error: 'NISN wajib diisi untuk role STUDENT'
          })
          continue
        }

        // Check if username already exists
        const existingUser = await prisma.user.findUnique({
          where: { username: user.username }
        })

        if (existingUser) {
          results.failed++
          results.errors.push({
            row: rowNumber,
            username: user.username,
            error: 'Username sudah digunakan'
          })
          continue
        }

        // Check if NISN already exists for students
        if (user.role === 'STUDENT' && user.nisn) {
          const existingStudent = await prisma.student.findUnique({
            where: { nisn: user.nisn }
          })

          if (existingStudent) {
            results.failed++
            results.errors.push({
              row: rowNumber,
              username: user.username,
              error: 'NISN sudah digunakan'
            })
            continue
          }
        }

        // Generate email if not provided
        const email = user.email && user.email.trim() !== '' 
          ? user.email 
          : `${user.username}@smkmutu.sch.id`

        // Generate password if not provided
        const password = user.password || 'pkl2025!'
        const passwordHash = await bcrypt.hash(password, 12)

        // Create user
        const newUser = await prisma.user.create({
          data: {
            username: user.username,
            name: user.nama_lengkap,
            email: email,
            passwordHash,
            role: user.role,
          }
        })

        // Create student or teacher record with provided data
        if (user.role === 'STUDENT') {
          await prisma.student.create({
            data: {
              userId: newUser.id,
              nisn: user.nisn || user.username,
              kelas: user.kelas || 'Belum ditentukan',
              jurusan: user.jurusan || 'Belum ditentukan',
            }
          })
        } else if (user.role === 'TEACHER') {
          await prisma.teacher.create({
            data: {
              userId: newUser.id,
              nip: user.username, // Use username as default NIP
            }
          })
        }

        results.success++
      } catch (error) {
        console.error(`Error creating user ${user.username}:`, error)
        results.failed++
        results.errors.push({
          row: rowNumber,
          username: user.username,
          error: 'Terjadi kesalahan saat membuat user'
        })
      }
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error('Error importing users:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Format data tidak valid', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}