import React from 'react'
import { formatDate } from '@/../lib/utils'
import { Calendar, CheckCircle } from 'lucide-react'

interface JurnalComment {
  id: string
  comment: string
  createdAt: string
  teacher: {
    user: {
      name: string
    }
  }
}

interface JurnalData {
  id: string
  tanggal: string
  kegiatan: string
  dokumentasi?: string
  comments: JurnalComment[]
  createdAt: string
  updatedAt: string
}

interface PrintableJurnalProps {
  jurnals: JurnalData[]
  studentName: string
  dateFilter?: { start: string; end: string }
  title?: string
}

const PrintableJurnal = React.forwardRef<HTMLDivElement, PrintableJurnalProps>(
  ({ jurnals, studentName, dateFilter, title = "Laporan Jurnal PKL" }, ref) => {
    const formatTanggal = (dateString: string) => {
      const date = new Date(dateString)
      return formatDate(date)
    }

    return (
      <div ref={ref} className="print-container">
        <style jsx>{`
          @media print {
            .print-container {
              font-family: Arial, sans-serif;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
              color: #000 !important;
            }
            .print-header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #000;
              padding-bottom: 20px;
            }
            .print-title {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 10px;
              color: #000 !important;
            }
            .print-subtitle {
              font-size: 18px;
              margin-bottom: 10px;
              color: #000 !important;
            }
            .print-date {
              font-size: 14px;
              color: #666 !important;
            }
            .print-filter-info {
              font-size: 12px;
              color: #666 !important;
              margin-top: 10px;
              font-style: italic;
            }
            .jurnal-card {
              page-break-inside: avoid;
              margin-bottom: 20px;
              border: 1px solid #000;
              border-radius: 8px;
              padding: 16px;
            }
            .field-label {
              font-weight: bold;
              margin-bottom: 8px;
              color: #000 !important;
            }
            .field-content {
              margin-bottom: 15px;
              line-height: 1.6;
              color: #000 !important;
            }
            .comment-section {
              background-color: #f5f5f5 !important;
              padding: 12px;
              border-left: 4px solid #000;
              margin-top: 10px;
            }
            .date-header {
              display: flex;
              align-items: center;
              gap: 8px;
              margin-bottom: 16px;
            }
            .status-badge {
              font-size: 12px;
              padding: 4px 8px;
              border: 1px solid #000;
              border-radius: 4px;
            }
          }
        `}</style>
        
        <div className="print-header">
          <h1 className="print-title">{title}</h1>
          <h2 className="print-subtitle">{studentName}</h2>
          <p className="print-date">Dicetak pada: {formatDate(new Date())}</p>
          {(dateFilter?.start || dateFilter?.end) && (
            <p className="print-filter-info">
              Filter: {dateFilter.start ? `Dari ${formatDate(new Date(dateFilter.start))}` : ''}
              {dateFilter.start && dateFilter.end ? ' ' : ''}
              {dateFilter.end ? `Sampai ${formatDate(new Date(dateFilter.end))}` : ''}
            </p>
          )}
        </div>
        
        <div className="space-y-4">
          {jurnals.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              <p>Tidak ada data jurnal untuk dicetak.</p>
            </div>
          ) : (
            jurnals.map((jurnal) => {
              const hasComments = jurnal.comments.length > 0
              const latestComment = hasComments ? jurnal.comments[jurnal.comments.length - 1] : null
              
              return (
                <div key={jurnal.id} className="jurnal-card">
                  <div className="date-header">
                    <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
                      📅 {formatTanggal(jurnal.tanggal)}
                    </span>
                    {hasComments && (
                      <span className="status-badge">
                        ✓ Sudah dikomentari guru
                      </span>
                    )}
                  </div>
                  
                  <div>
                    <div className="field-label">Kegiatan:</div>
                    <div className="field-content">{jurnal.kegiatan}</div>
                  </div>
                  
                  {jurnal.dokumentasi && (
                    <div>
                      <div className="field-label">Dokumentasi:</div>
                      <div className="field-content">{jurnal.dokumentasi}</div>
                    </div>
                  )}
                  
                  {latestComment && (
                    <div className="comment-section">
                      <div className="field-label">Komentar Guru:</div>
                      <div className="field-content">{latestComment.comment}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        — {latestComment.teacher.user.name} • {formatDate(new Date(latestComment.createdAt))}
                      </div>
                    </div>
                  )}
                  
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#666', 
                    borderTop: '1px solid #ccc', 
                    paddingTop: '8px', 
                    marginTop: '12px' 
                  }}>
                    Dibuat: {formatDate(new Date(jurnal.createdAt))}
                    {jurnal.updatedAt !== jurnal.createdAt && (
                      <> • Diperbarui: {formatDate(new Date(jurnal.updatedAt))}</>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    )
  }
)

PrintableJurnal.displayName = 'PrintableJurnal'

export default PrintableJurnal