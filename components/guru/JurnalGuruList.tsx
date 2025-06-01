"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/../components/ui/card"
import { Button } from "@/../components/ui/button"
import { Badge } from "@/../components/ui/badge"
import { formatDate } from "@/../lib/utils"
import { Calendar, FileText, MessageSquare, Edit, ExternalLink, User, Building } from "lucide-react"
import KomentarDialog from "./KomentarDialog"

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
  createdAt: string
  updatedAt: string
  student: {
    user: {
      name: string
    }
    nisn: string
    kelas: string
    jurusan: string
    tempatPkl?: {
      nama: string
      alamat: string
    }
  }
  comments: JurnalComment[]
}

export default function JurnalGuruList() {
  const [jurnals, setJurnals] = useState<JurnalData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedJurnal, setSelectedJurnal] = useState<JurnalData | null>(null)
  const [isKomentarDialogOpen, setIsKomentarDialogOpen] = useState(false)
  const [filter, setFilter] = useState<'all' | 'commented' | 'uncommented'>('all')

  const fetchJurnals = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/guru/jurnal')
      const result = await response.json()
      
      if (response.ok) {
        setJurnals(result.data || [])
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

  const handleKomentar = (jurnal: JurnalData) => {
    setSelectedJurnal(jurnal)
    setIsKomentarDialogOpen(true)
  }

  const handleKomentarSuccess = () => {
    fetchJurnals()
  }

  const filteredJurnals = jurnals.filter(jurnal => {
    if (filter === 'commented') return jurnal.comments.length > 0
    if (filter === 'uncommented') return jurnal.comments.length === 0
    return true
  })

  const formatTanggal = (dateString: string) => {
    const date = new Date(dateString)
    return formatDate(date)
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

  return (
    <div className="space-y-6">
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          Semua ({jurnals.length})
        </Button>
        <Button
          variant={filter === 'uncommented' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('uncommented')}
        >
          Belum Dikomentar ({jurnals.filter(j => j.comments.length === 0).length})
        </Button>
        <Button
          variant={filter === 'commented' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('commented')}
        >
          Sudah Dikomentar ({jurnals.filter(j => j.comments.length > 0).length})
        </Button>
      </div>

      {filteredJurnals.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada jurnal</h3>
            <p className="text-gray-500 text-center">
              {filter === 'all' ? 'Belum ada jurnal siswa.' : 
               filter === 'commented' ? 'Belum ada jurnal yang sudah dikomentar.' :
               'Semua jurnal sudah dikomentar.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredJurnals.map((jurnal) => {
            const hasComments = jurnal.comments.length > 0
            const latestComment = hasComments ? jurnal.comments[jurnal.comments.length - 1] : null
            
            return (
              <Card key={jurnal.id} className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <span className="text-base sm:text-lg">{formatTanggal(jurnal.tanggal)}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                      {hasComments ? (
                        <>
                          <Badge variant="default" className="bg-green-100 text-green-800 w-fit">
                            🟢 Sudah Diberi Komentar
                          </Badge>
                          <Button
                            onClick={() => handleKomentar(jurnal)}
                            variant="outline"
                            size="sm"
                            className="w-full sm:w-auto"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Komentar
                          </Button>
                        </>
                      ) : (
                        <>
                          <Badge variant="destructive" className="w-fit">
                            🔴 Belum Diberi Komentar
                          </Badge>
                          <Button
                            onClick={() => handleKomentar(jurnal)}
                            variant="default"
                            size="sm"
                            className="w-full sm:w-auto"
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Beri Komentar
                          </Button>
                        </>
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Student Info */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-600" />
                        <div>
                          <p className="font-medium">{jurnal.student.user.name}</p>
                          <p className="text-sm text-gray-600">NISN: {jurnal.student.nisn}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Kelas: {jurnal.student.kelas}</p>
                        <p className="text-sm text-gray-600">Jurusan: {jurnal.student.jurusan}</p>
                      </div>
                    </div>
                    {jurnal.student.tempatPkl && (
                      <div className="mt-3 flex items-start gap-2">
                        <Building className="h-4 w-4 text-gray-600 mt-1" />
                        <div>
                          <p className="font-medium text-sm">{jurnal.student.tempatPkl.nama}</p>
                          <p className="text-xs text-gray-600">{jurnal.student.tempatPkl.alamat}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Journal Content */}
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
          })}
        </div>
      )}

      {selectedJurnal && (
        <KomentarDialog
          jurnal={selectedJurnal}
          isOpen={isKomentarDialogOpen}
          onClose={() => {
            setIsKomentarDialogOpen(false)
            setSelectedJurnal(null)
          }}
          onSuccess={handleKomentarSuccess}
        />
      )}
    </div>
  )
}