import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { handleApiError } from "@/lib/api/response"
import { studentQueries, queryPerformance } from "@/lib/database/queryOptimization"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const kelas = searchParams.get('kelas')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const minimal = searchParams.get('minimal') === 'true'
    const withMapping = searchParams.get('withMapping') === 'true'
    const unmapped = searchParams.get('unmapped') === 'true'

    let students

    if (unmapped) {
      // For bulk mapping - get unmapped students
      students = await queryPerformance.withTiming(
        'students-unmapped',
        () => studentQueries.getUnmappedStudents()
      )
    } else if (minimal) {
      // For dropdown lists or minimal data requirements
      students = await queryPerformance.withTiming(
        'students-minimal',
        () => studentQueries.getStudentsMinimal()
      )
    } else if (withMapping) {
      // For student mapping page with teacher and tempatPkl relations
      students = await queryPerformance.withTiming(
        'students-with-mapping',
        () => studentQueries.getStudentsWithMapping()
      )
    } else if (kelas) {
      // Filter by class with pagination
      students = await queryPerformance.withTiming(
        'students-by-class',
        () => studentQueries.getStudentsByClass(kelas, page, limit)
      )
    } else {
      // Get all students with full details (consider adding pagination here too)
      students = await queryPerformance.withTiming(
        'students-full',
        () => studentQueries.getStudentsMinimal() // Using minimal for performance
      )
    }

    return NextResponse.json(students)
  } catch (error) {
    return handleApiError(error)
  }
}