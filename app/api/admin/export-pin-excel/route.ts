import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import * as XLSX from 'xlsx'

const exportRequestSchema = z.object({
  studentIds: z.array(z.string()).min(1, 'Minimal satu siswa harus dipilih'),
  includeTempatPkl: z.boolean().default(true),
  includeGuruPembimbing: z.boolean().default(true),
  includeKontakInfo: z.boolean().default(false)
})

type ExportRequest = z.infer<typeof exportRequestSchema>

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Validate request body
    const body = await request.json()
    const validatedData = exportRequestSchema.parse(body)
    const { studentIds, includeTempatPkl, includeGuruPembimbing, includeKontakInfo } = validatedData
    const options = { includeTempatPkl, includeGuruPembimbing, includeKontakInfo }

    // Fetch students data with related information
    const students = await prisma.student.findMany({
      where: {
        id: {
          in: studentIds
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        tempatPkl: {
          select: {
            id: true,
            nama: true,
            alamat: true,
            pinAbsensi: true,
            isActive: true
          }
        },
        teacher: options.includeGuruPembimbing ? {
          select: {
            id: true,
            nip: true,
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        } : false
      },
      orderBy: [
        {
          kelas: 'asc'
        },
        {
          jurusan: 'asc'
        },
        {
          user: {
            name: 'asc'
          }
        }
      ]
    })

    if (students.length === 0) {
      return NextResponse.json(
        { error: 'Tidak ada siswa yang ditemukan' },
        { status: 404 }
      )
    }

    // Generate Excel file
    const excelBuffer = await generatePinExcel(students, options)

    // Return Excel as response
    return new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="data-pin-pkl-${new Date().toISOString().split('T')[0]}.xlsx"`,
        'Content-Length': excelBuffer.length.toString()
      }
    })

  } catch (error) {
    console.error('Error generating PIN Excel:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    // Provide more detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    )
  }
}

async function generatePinExcel(students: any[], options: { includeTempatPkl: boolean; includeGuruPembimbing: boolean; includeKontakInfo: boolean }): Promise<Buffer> {
  try {
    // Prepare data for Excel
    const excelData = students.map((student, index) => {
      const baseData = {
        'No': index + 1,
        'Nama Siswa': student.user.name,
        'NIS': student.nis,
        'Kelas': student.kelas,
        'Jurusan': student.jurusan,
        'Email': student.user.email
      }

      // Add tempat PKL information if requested
      if (options.includeTempatPkl && student.tempatPkl) {
        Object.assign(baseData, {
          'Tempat PKL': student.tempatPkl.nama,
          'Alamat PKL': student.tempatPkl.alamat,
          'PIN Absensi': student.tempatPkl.pinAbsensi,
          'Status PKL': student.tempatPkl.isActive ? 'Aktif' : 'Tidak Aktif'
        })
      } else if (options.includeTempatPkl) {
        Object.assign(baseData, {
          'Tempat PKL': 'Belum Dipetakan',
          'Alamat PKL': '-',
          'PIN Absensi': '-',
          'Status PKL': '-'
        })
      }

      // Add guru pembimbing information if requested
      if (options.includeGuruPembimbing && student.teacher) {
        Object.assign(baseData, {
          'Guru Pembimbing': student.teacher.user.name,
          'NIP Guru': student.teacher.nip,
          'Email Guru': student.teacher.user.email
        })
      } else if (options.includeGuruPembimbing) {
        Object.assign(baseData, {
          'Guru Pembimbing': 'Belum Ditentukan',
          'NIP Guru': '-',
          'Email Guru': '-'
        })
      }

      return baseData
    })

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(excelData)

    // Set column widths for better readability
    const columnWidths = [
      { wch: 5 },   // No
      { wch: 25 },  // Nama Siswa
      { wch: 15 },  // NIS
      { wch: 10 },  // Kelas
      { wch: 15 },  // Jurusan
      { wch: 25 },  // Email
    ]

    if (options.includeTempatPkl) {
      columnWidths.push(
        { wch: 30 },  // Tempat PKL
        { wch: 40 },  // Alamat PKL
        { wch: 15 },  // PIN Absensi
        { wch: 12 }   // Status PKL
      )
    }

    if (options.includeGuruPembimbing) {
      columnWidths.push(
        { wch: 25 },  // Guru Pembimbing
        { wch: 20 },  // NIP Guru
        { wch: 25 }   // Email Guru
      )
    }

    worksheet['!cols'] = columnWidths

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data PIN PKL')

    // Add summary sheet
    const summaryData = [
      { 'Informasi': 'Total Siswa', 'Nilai': students.length },
      { 'Informasi': 'Siswa dengan Tempat PKL', 'Nilai': students.filter(s => s.tempatPkl).length },
      { 'Informasi': 'Siswa dengan Guru Pembimbing', 'Nilai': students.filter(s => s.teacher).length },
      { 'Informasi': 'Tanggal Export', 'Nilai': new Date().toLocaleDateString('id-ID') },
      { 'Informasi': 'Waktu Export', 'Nilai': new Date().toLocaleTimeString('id-ID') }
    ]

    const summaryWorksheet = XLSX.utils.json_to_sheet(summaryData)
    summaryWorksheet['!cols'] = [{ wch: 25 }, { wch: 20 }]
    XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'Ringkasan')

    // Generate buffer
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
    return excelBuffer

  } catch (error) {
    console.error('Error in generatePinExcel:', error)
    throw new Error(`Failed to generate Excel: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}