import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const toggleStatusSchema = z.object({
  tempatPklId: z.string().min(1, "ID tempat PKL harus diisi"),
  isActive: z.boolean()
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { tempatPklId, isActive } = toggleStatusSchema.parse(body)

    // Update status di database
    const updatedTempatPkl = await prisma.tempatPkl.update({
      where: { id: tempatPklId },
      data: { isActive },
      include: {
        _count: {
          select: {
            students: true
          }
        }
      }
    })

    return NextResponse.json({ 
      success: true, 
      message: `Tempat PKL berhasil ${isActive ? 'diaktifkan' : 'dinonaktifkan'}`,
      data: updatedTempatPkl 
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        success: false, 
        message: "Validation error", 
        errors: error.errors 
      }, { status: 400 })
    }
    
    console.error('Error toggling status:', error)
    return NextResponse.json({ 
      success: false, 
      message: "Internal server error" 
    }, { status: 500 })
  }
}