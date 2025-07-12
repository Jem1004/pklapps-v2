import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import PDFDocument from 'pdfkit'
import QRCode from 'qrcode'

const printRequestSchema = z.object({
  studentIds: z.array(z.string()).min(1, 'Minimal satu siswa harus dipilih'),
  options: z.object({
    includeQR: z.boolean().default(true),
    includePhoto: z.boolean().default(false),
    cardSize: z.enum(['standard', 'mini']).default('standard'),
    layout: z.enum(['single', 'multiple']).default('multiple')
  })
})

type PrintRequest = z.infer<typeof printRequestSchema>

// Card dimensions in points (1 point = 1/72 inch)
const CARD_DIMENSIONS = {
  standard: {
    width: 242.65, // 85.6mm
    height: 153.07 // 53.98mm
  },
  mini: {
    width: 198.43, // 70mm
    height: 127.56  // 45mm
  }
}

const COLORS = {
  primary: '#1e40af',
  secondary: '#64748b',
  accent: '#3b82f6',
  text: '#1f2937',
  light: '#f8fafc'
}

// Helper function to safely set font with fallback
function setFont(doc: PDFKit.PDFDocument, fontName: string) {
  try {
    doc.font(fontName)
  } catch (error) {
    console.warn(`Font ${fontName} not available, trying fallback fonts`)
    // Try fallback fonts in order of preference
    const fallbackFonts = ['Courier', 'Courier-Bold']
    let fontSet = false
    
    for (const fallback of fallbackFonts) {
      try {
        doc.font(fallback)
        fontSet = true
        break
      } catch (fallbackError) {
        console.warn(`Fallback font ${fallback} also not available`)
      }
    }
    
    if (!fontSet) {
      console.warn('All fonts failed, using PDFKit default')
      // PDFKit will use its built-in default font
    }
  }
}

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
    const validatedData = printRequestSchema.parse(body)
    const { studentIds, options } = validatedData

    // Fetch students data
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
            alamat: true
          }
        }
      },
      orderBy: {
        user: {
          name: 'asc'
        }
      }
    })

    if (students.length === 0) {
      return NextResponse.json(
        { error: 'Tidak ada siswa yang ditemukan' },
        { status: 404 }
      )
    }

    // Generate PDF
    const pdfBuffer = await generatePinCardsPDF(students, options)

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="pin-cards-${new Date().toISOString().split('T')[0]}.pdf"`,
        'Content-Length': pdfBuffer.length.toString()
      }
    })

  } catch (error) {
    console.error('Error generating PIN cards:', error)
    
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

async function generatePinCardsPDF(students: any[], options: PrintRequest['options']): Promise<Buffer> {
  return new Promise(async (resolve, reject) => {
    try {
      // Create PDF document with fallback font configuration
      const doc = new PDFDocument({
        size: 'A4',
        margin: 20,
        bufferPages: true
      })
      
      // Use PDFKit default font to avoid ENOENT errors
      // setFont(doc, 'Times-Roman') // Commented out to use default font only

      const chunks: Buffer[] = []
      doc.on('data', chunk => chunks.push(chunk))
      doc.on('end', () => resolve(Buffer.concat(chunks)))
      doc.on('error', reject)

      const cardDim = CARD_DIMENSIONS[options.cardSize]
      const pageWidth = 595.28 // A4 width in points
      const pageHeight = 841.89 // A4 height in points
      const margin = 20

      let cardsPerRow = 1
      let cardsPerColumn = 1

      if (options.layout === 'multiple') {
        cardsPerRow = Math.floor((pageWidth - 2 * margin) / (cardDim.width + 10))
        cardsPerColumn = Math.floor((pageHeight - 2 * margin) / (cardDim.height + 10))
      }

      const cardsPerPage = cardsPerRow * cardsPerColumn
      let cardCount = 0

      for (let i = 0; i < students.length; i++) {
        const student = students[i]
        
        // Start new page if needed
        if (cardCount > 0 && cardCount % cardsPerPage === 0) {
          doc.addPage()
        }

        const cardIndex = cardCount % cardsPerPage
        const row = Math.floor(cardIndex / cardsPerRow)
        const col = cardIndex % cardsPerRow

        const x = margin + col * (cardDim.width + 10)
        const y = margin + row * (cardDim.height + 10)

        await drawPinCard(doc, student, x, y, cardDim, options)
        cardCount++
      }

      doc.end()
    } catch (error) {
      console.error('Error in generatePinCardsPDF:', error)
      reject(new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`))
    }
  })
}

async function drawPinCard(
  doc: PDFKit.PDFDocument, 
  student: any, 
  x: number, 
  y: number, 
  cardDim: { width: number; height: number },
  options: PrintRequest['options']
): Promise<void> {
  const { width, height } = cardDim
  
  // Draw card background
  doc.save()
  
  // Card border and background
  doc.roundedRect(x, y, width, height, 8)
    .fillAndStroke(COLORS.light, COLORS.primary)
  
  // Header background
  doc.roundedRect(x, y, width, height * 0.25, 8)
    .fill(COLORS.primary)
  
  // School logo area (placeholder)
  const logoSize = height * 0.15
  doc.circle(x + 15, y + height * 0.125, logoSize / 2)
    .fill('#ffffff')
  
  // School name
  doc.fill('#ffffff')
    .fontSize(options.cardSize === 'standard' ? 12 : 10)
  // setFont(doc, 'Times-Bold') // Use default font
  doc.text('SMK NEGERI 1 PPU', x + logoSize + 20, y + height * 0.08, {
      width: width - logoSize - 40,
      align: 'left'
    })
  
  // Card title
  doc.fontSize(options.cardSize === 'standard' ? 8 : 7)
  // setFont(doc, 'Times-Roman') // Use default font
  doc.text('KARTU IDENTITAS SISWA PKL', x + logoSize + 20, y + height * 0.15, {
      width: width - logoSize - 40,
      align: 'left'
    })
  
  // Student photo placeholder
  const photoSize = height * 0.35
  const photoX = x + 15
  const photoY = y + height * 0.3
  
  if (options.includePhoto) {
    doc.roundedRect(photoX, photoY, photoSize, photoSize, 4)
      .fillAndStroke('#e5e7eb', '#9ca3af')
    
    doc.fill(COLORS.secondary)
      .fontSize(8)
      .text('FOTO', photoX + photoSize/2 - 10, photoY + photoSize/2 - 4)
  }
  
  // Student information
  const infoX = options.includePhoto ? photoX + photoSize + 15 : x + 15
  const infoY = y + height * 0.35
  const infoWidth = width - (infoX - x) - 15
  
  doc.fill(COLORS.text)
    .fontSize(options.cardSize === 'standard' ? 10 : 8)
  // setFont(doc, 'Times-Bold') // Use default font
  doc.text('NAMA:', infoX, infoY)
  
  doc.fontSize(options.cardSize === 'standard' ? 9 : 7)
  // setFont(doc, 'Times-Roman') // Use default font
  doc.text(student.user.name, infoX, infoY + 12, {
      width: infoWidth,
      ellipsis: true
    })
  
  doc.fontSize(options.cardSize === 'standard' ? 8 : 7)
  // setFont(doc, 'Times-Bold') // Use default font
  doc.text('NIS:', infoX, infoY + 28)
  
  // setFont(doc, 'Times-Roman') // Use default font
  doc.text(student.nis, infoX + 25, infoY + 28)
  
  // setFont(doc, 'Times-Bold') // Use default font
  doc.text('KELAS:', infoX, infoY + 42)
  
  // setFont(doc, 'Times-Roman') // Use default font
  doc.text(`${student.kelas} ${student.jurusan}`, infoX + 35, infoY + 42, {
      width: infoWidth - 35,
      ellipsis: true
    })
  
  if (student.tempatPkl) {
    // setFont(doc, 'Times-Bold') // Use default font
    doc.text('PKL:', infoX, infoY + 56)
    
    // setFont(doc, 'Times-Roman') // Use default font
    doc.text(student.tempatPkl.nama, infoX, infoY + 68, {
        width: infoWidth,
        ellipsis: true
      })
  }
  
  // QR Code
  if (options.includeQR) {
    try {
      const qrData = JSON.stringify({
        id: student.id,
        nis: student.nis,
        name: student.user.name,
        class: `${student.kelas} ${student.jurusan}`,
        pkl: student.tempatPkl?.nama || null
      })
      
      const qrCodeDataURL = await QRCode.toDataURL(qrData, {
        width: 60,
        margin: 1,
        color: {
          dark: COLORS.primary,
          light: '#ffffff'
        }
      })
      
      const qrSize = options.cardSize === 'standard' ? 50 : 40
      const qrX = x + width - qrSize - 10
      const qrY = y + height - qrSize - 10
      
      // Convert data URL to buffer and embed in PDF
      const base64Data = qrCodeDataURL.split(',')[1]
      const qrBuffer = Buffer.from(base64Data, 'base64')
      
      doc.image(qrBuffer, qrX, qrY, {
        width: qrSize,
        height: qrSize
      })
    } catch (error) {
      console.error('Error generating QR code:', error)
    }
  }
  
  // Footer
  doc.fill(COLORS.secondary)
    .fontSize(6)
  // setFont(doc, 'Times-Roman') // Use default font
  doc.text(`Dicetak: ${new Date().toLocaleDateString('id-ID')}`, x + 10, y + height - 15, {
      width: width - 20,
      align: 'left'
    })
  
  doc.restore()
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}