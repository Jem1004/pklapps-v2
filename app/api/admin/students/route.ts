import { NextResponse } from "next/server"
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
            id: true,
            name: true,
            username: true
          }
        },
        tempatPkl: {
          select: {
            id: true,
            nama: true,
            alamat: true
          }
        },
        teacher: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true
              }
            }
          }
        }
      },
      orderBy: {
        user: {
          name: 'asc'
        }
      }
    })

    return NextResponse.json(students)
  } catch (error) {
    console.error('Error fetching students:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}