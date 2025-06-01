import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Get student data
    const student = await prisma.student.findUnique({
      where: { userId: session.user.id },
      include: {
        user: true,
        tempatPkl: true,
        jurnals: {
          include: {
            comments: {
              include: {
                teacher: {
                  include: {
                    user: true
                  }
                }
              }
            }
          },
          orderBy: {
            tanggal: 'asc'
          }
        }
      }
    })

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    // Generate HTML content for PDF
    const htmlContent = generateHTMLContent(student)
    
    // Return HTML content that will be converted to PDF on client side
    return NextResponse.json({ 
      success: true, 
      htmlContent,
      fileName: `jurnal-pkl-${student.user.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`
    })
    
  } catch (error) {
    console.error('Error exporting PDF:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function generateHTMLContent(student: any): string {
  const currentDate = new Date().toLocaleDateString('id-ID')
  
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Jurnal PKL - ${student.user.name}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          line-height: 1.6;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .header h1 {
          font-size: 24px;
          margin-bottom: 10px;
        }
        .student-info {
          margin-bottom: 30px;
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 5px;
        }
        .student-info h2 {
          font-size: 18px;
          margin-bottom: 15px;
          color: #333;
        }
        .info-row {
          margin-bottom: 8px;
        }
        .journal-entry {
          margin-bottom: 25px;
          padding: 15px;
          border: 1px solid #eee;
          border-radius: 5px;
          page-break-inside: avoid;
        }
        .journal-date {
          font-size: 16px;
          font-weight: bold;
          color: #2563eb;
          margin-bottom: 10px;
          border-bottom: 2px solid #2563eb;
          padding-bottom: 5px;
        }
        .journal-activity {
          margin-bottom: 15px;
        }
        .journal-activity h4 {
          font-size: 14px;
          margin-bottom: 8px;
          color: #374151;
        }
        .journal-activity p {
          margin: 0;
          white-space: pre-wrap;
          color: #4b5563;
        }
        .journal-docs {
          margin-bottom: 15px;
        }
        .journal-docs h4 {
          font-size: 14px;
          margin-bottom: 8px;
          color: #374151;
        }
        .journal-comment {
          background-color: #eff6ff;
          padding: 12px;
          border-left: 4px solid #3b82f6;
          border-radius: 0 5px 5px 0;
        }
        .journal-comment h4 {
          font-size: 14px;
          margin-bottom: 8px;
          color: #1e40af;
        }
        .journal-comment p {
          margin: 0 0 8px 0;
          color: #1e3a8a;
        }
        .comment-author {
          font-size: 12px;
          color: #6b7280;
          font-style: italic;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          font-size: 12px;
          color: #6b7280;
        }
        @media print {
          body { margin: 0; }
          .journal-entry { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>JURNAL KEGIATAN PKL</h1>
      </div>
      
      <div class="student-info">
        <h2>Informasi Siswa</h2>
        <div class="info-row"><strong>Nama Siswa:</strong> ${student.user.name}</div>
        <div class="info-row"><strong>NISN:</strong> ${student.nisn}</div>
        <div class="info-row"><strong>Kelas:</strong> ${student.kelas}</div>
        <div class="info-row"><strong>Jurusan:</strong> ${student.jurusan}</div>
        ${student.tempatPkl ? `
          <div class="info-row"><strong>Tempat PKL:</strong> ${student.tempatPkl.nama}</div>
          <div class="info-row"><strong>Alamat:</strong> ${student.tempatPkl.alamat}</div>
        ` : ''}
        <div class="info-row"><strong>Tanggal Export:</strong> ${currentDate}</div>
      </div>
  `
  
  // Add journal entries
  student.jurnals.forEach((jurnal: any, index: number) => {
    const jurnalDate = new Date(jurnal.tanggal).toLocaleDateString('id-ID')
    
    html += `
      <div class="journal-entry">
        <div class="journal-date">${index + 1}. ${jurnalDate}</div>
        
        <div class="journal-activity">
          <h4>Kegiatan:</h4>
          <p>${jurnal.kegiatan}</p>
        </div>
    `
    
    if (jurnal.dokumentasi) {
      html += `
        <div class="journal-docs">
          <h4>Dokumentasi:</h4>
          <p>${jurnal.dokumentasi}</p>
        </div>
      `
    }
    
    // Add comments
    jurnal.comments.forEach((comment: any) => {
      const commentDate = new Date(comment.createdAt).toLocaleDateString('id-ID')
      html += `
        <div class="journal-comment">
          <h4>Komentar Guru:</h4>
          <p>${comment.comment}</p>
          <div class="comment-author">— ${comment.teacher.user.name} (${commentDate})</div>
        </div>
      `
    })
    
    html += `</div>`
  })
  
  html += `
      <div class="footer">
        <p>Total ${student.jurnals.length} jurnal kegiatan</p>
        <p>Dokumen ini digenerate secara otomatis pada ${currentDate}</p>
      </div>
    </body>
    </html>
  `
  
  return html
}