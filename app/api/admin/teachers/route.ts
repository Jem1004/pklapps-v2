import { NextResponse } from "../../../../node_modules/next/server"
import { getServerSession } from "../../../../node_modules/next-auth/next"
import { authOptions } from "@/../lib/auth"
import { prisma } from "@/../lib/prisma"

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
            id: true,
            name: true,
            username: true
          }
        }
      }
    })

    return NextResponse.json(teachers)
  } catch (error) {
    console.error('Error fetching teachers:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}