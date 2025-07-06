"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { useReactToPrint } from 'react-to-print'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatDate, formatDateForInput } from "@/lib/utils"
import { Calendar, FileText, Edit, CheckCircle, ExternalLink, MessageSquare, Download, Filter, Trash2 } from "lucide-react"
import EditJurnalDialog from "./EditJurnalDialog"
import PrintableJurnal from "./PrintableJurnal"

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

export default function JurnalList() {
  const { data: session } = useSession()
  const [jurnals, setJurnals] = useState<JurnalData[]>([])
  const [filteredJurnals, setFilteredJurnals] = useState<JurnalData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingJurnal, setEditingJurnal] = useState<JurnalData | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' })
  const [isPrintReady, setIsPrintReady] = useState(false)
  const printRef = useRef<HTMLDivElement>(null)

  const fetchJurnals = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/jurnal?all=true')
      const result = await response.json()
      
      if (response.ok) {
        const sortedJurnals = (result.data || []).sort((a: JurnalData, b: JurnalData) => 
          new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
        )
        setJurnals(sortedJurnals)
        setFilteredJurnals(sortedJurnals)
      } else {
        console.error('Error fetching jurnals:', result.error)
      }
    } catch (error) {
      console.error('Error fetching jurnals:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchJurnals()
  }, [])

  // Updated useEffect to set print ready state
  useEffect(() => {
    let filtered = jurnals
    
    if (dateFilter.start) {
      filtered = filtered.filter(jurnal => jurnal.tanggal >= dateFilter.start)
    }
    
    if (dateFilter.end) {
      filtered = filtered.filter(jurnal => jurnal.tanggal <= dateFilter.end)
    }
    
    setFilteredJurnals(filtered)
    
    // Set print ready after data is filtered and component is mounted
    setTimeout(() => setIsPrintReady(true), 100)
  }, [jurnals, dateFilter])

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `jurnal-pkl-${session?.user?.name?.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}`,
    onBeforePrint: () => {
      return new Promise((resolve) => {
        // Ensure data is ready before printing
        if (filteredJurnals.length > 0 && isPrintReady) {
          resolve()
        } else {
          setTimeout(resolve, 500)
        }
      })
    },
    onAfterPrint: () => {
      console.log('PDF export completed')
    },
    pageStyle: `
      @page {
        size: A4;
        margin: 20mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    `
  })

  const handleEdit = (jurnal: JurnalData) => {
    setEditingJurnal(jurnal)
    setIsEditDialogOpen(true)
  }

    const handleDelete = async (jurnalId: string) => {
    if (window.confirm(`Yakin ingin menghapus jurnal ini?`)) {
      try {
        const response = await fetch(`/api/jurnal/${jurnalId}`, {
          method: 'DELETE',
        });
        const result = await response.json();
        if (response.ok) {
          fetchJurnals();
        } else {
          console.error('Failed to delete journal:', result.error);
        }
      } catch (error) {
        console.error('Error deleting journal:', error);
      }
    }
  };

  const handleEditSuccess = () => {
    fetchJurnals()
  }

  const formatTanggal = (dateString: string) => {
    const date = new Date(dateString)
    return formatDate(date)
  }

  const clearFilter = () => {
    setDateFilter({ start: '', end: '' })
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (jurnals.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada jurnal</h3>
          <p className="text-gray-500 text-center">Mulai buat jurnal harian untuk mencatat kegiatan PKL Anda.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Export and Filter */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <h2 className="text-xl sm:text-2xl font-bold">Daftar Jurnal PKL</h2>
            <Badge variant="secondary" className="w-fit">
              {filteredJurnals.length} dari {jurnals.length} jurnal
            </Badge>
          </div>
          <Button 
            onClick={handlePrint} 
            disabled={filteredJurnals.length === 0 || !isPrintReady || isLoading}
            className="w-full sm:w-auto"
          >
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>

        {/* Date Filter */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="h-5 w-5" />
              Filter Tanggal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="start-date" className="text-sm font-medium">Dari Tanggal:</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={dateFilter.start}
                  onChange={(e) => setDateFilter(prev => ({ ...prev, start: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="end-date" className="text-sm font-medium">Sampai Tanggal:</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={dateFilter.end}
                  onChange={(e) => setDateFilter(prev => ({ ...prev, end: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <Button 
                onClick={clearFilter} 
                variant="outline" 
                className="w-full sm:w-auto"
                disabled={!dateFilter.start && !dateFilter.end}
              >
                Reset Filter
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Printable Content - Hidden but accessible for printing */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <PrintableJurnal
          ref={printRef}
          jurnals={filteredJurnals}
          studentName={session?.user?.name || 'Siswa'}
          dateFilter={dateFilter.start || dateFilter.end ? dateFilter : undefined}
        />
      </div>

      {/* Tampilan normal di UI */}
      <div className="space-y-4">
        {filteredJurnals.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada jurnal ditemukan</h3>
              <p className="text-gray-500 text-center">Coba ubah filter tanggal atau buat jurnal baru.</p>
            </CardContent>
          </Card>
        ) : (
          filteredJurnals.map((jurnal) => {
            const hasComments = jurnal.comments.length > 0
            const latestComment = hasComments ? jurnal.comments[jurnal.comments.length - 1] : null
            
            return (
              <Card key={jurnal.id} className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-gray-600" />
                        <span className="text-lg font-semibold">{formatTanggal(jurnal.tanggal)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {hasComments ? (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Dikomentari
                          </Badge>
                        ) : (
                          <Badge variant="outline">Menunggu</Badge>
                        )}
                        <Button variant="outline" size="icon" onClick={() => handleEdit(jurnal)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => handleDelete(jurnal.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Kegiatan:</h4>
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
                      {jurnal.kegiatan}
                    </p>
                  </div>
                  
                  {jurnal.dokumentasi && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Dokumentasi:</h4>
                      <div className="flex items-center gap-2">
                        <ExternalLink className="h-4 w-4 text-blue-600 flex-shrink-0" />
                        <a 
                          href={jurnal.dokumentasi} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm sm:text-base break-all"
                        >
                          {jurnal.dokumentasi}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {latestComment && (
                    <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border-l-4 border-blue-400">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="h-4 w-4 text-blue-600" />
                        <h4 className="font-medium text-blue-900 text-sm sm:text-base">Komentar Guru:</h4>
                      </div>
                      <p className="text-blue-800 mb-2 text-sm sm:text-base">{latestComment.comment}</p>
                      <p className="text-xs sm:text-sm text-blue-600">
                        — {latestComment.teacher.user.name} • {formatDate(new Date(latestComment.createdAt))}
                      </p>
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500 pt-2 border-t">
                    Dibuat: {formatDate(new Date(jurnal.createdAt))}
                    {jurnal.updatedAt !== jurnal.createdAt && (
                      <> • Diperbarui: {formatDate(new Date(jurnal.updatedAt))}</>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {editingJurnal && (
        <EditJurnalDialog
          jurnal={editingJurnal}
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false)
            setEditingJurnal(null)
          }}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  )
}