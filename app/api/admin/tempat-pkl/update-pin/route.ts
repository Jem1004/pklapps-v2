import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updatePinSchema = z.object({
  tempatPklId: z.string().min(1, "ID tempat PKL harus diisi"),
  newPin: z.string().min(4, "PIN minimal 4 karakter")
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { tempatPklId, newPin } = updatePinSchema.parse(body)

    // Update PIN di database
    const updatedTempatPkl = await prisma.tempatPkl.update({
      where: { id: tempatPklId },
      data: { pinAbsensi: newPin },
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
      message: "PIN berhasil diperbarui",
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
    
    console.error('Error updating PIN:', error)
    return NextResponse.json({ 
      success: false, 
      message: "Internal server error" 
    }, { status: 500 })
  }
}