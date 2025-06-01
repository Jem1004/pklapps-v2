"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/../components/ui/card"
import { Button } from "@/../components/ui/button"
import { Badge } from "@/../components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/../components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/../components/ui/accordion"
import { formatDate } from "@/../lib/utils"
import { Calendar, FileText, MessageSquare, Edit, ExternalLink, User, Building, Users, MapPin } from "lucide-react"
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

interface GroupedStudent {
  studentId: string
  studentName: string
  nisn: string
  kelas: string
  jurusan: string
  tempatPkl?: {
    nama: string
    alamat: string
  }
  jurnals: JurnalData[]
  totalJurnals: number
  commentedJurnals: number
  uncommentedJurnals: number
}

type FilterType = 'all' | 'student' | 'tempat-pkl' | 'commented' | 'uncommented'

export default function JurnalGuruGroupedList() {
  const [jurnals, setJurnals] = useState<JurnalData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedJurnal, setSelectedJurnal] = useState<JurnalData | null>(null)
  const [isKomentarDialogOpen, setIsKomentarDialogOpen] = useState(false)
  const [filter, setFilter] = useState<FilterType>('all')
  const [selectedStudent, setSelectedStudent] = useState<string>('all')
  const [selectedTempatPkl, setSelectedTempatPkl] = useState<string>('all')

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

  // Group jurnals by student
  const groupedStudents = useMemo(() => {
    const groups = new Map<string, GroupedStudent>()
    
    jurnals.forEach(jurnal => {
      const studentKey = `${jurnal.student.nisn}-${jurnal.student.user.name}`
      
      if (!groups.has(studentKey)) {
        groups.set(studentKey, {
          studentId: studentKey,
          studentName: jurnal.student.user.name,
          nisn: jurnal.student.nisn,
          kelas: jurnal.student.kelas,
          jurusan: jurnal.student.jurusan,
          tempatPkl: jurnal.student.tempatPkl,
          jurnals: [],
          totalJurnals: 0,
          commentedJurnals: 0,
          uncommentedJurnals: 0
        })
      }
      
      const group = groups.get(studentKey)!
      group.jurnals.push(jurnal)
      group.totalJurnals++
      
      if (jurnal.comments.length > 0) {
        group.commentedJurnals++
      } else {
        group.uncommentedJurnals++
      }
    })
    
    // Sort jurnals within each group by date (newest first)
    groups.forEach(group => {
      group.jurnals.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime())
    })
    
    return Array.from(groups.values()).sort((a, b) => a.studentName.localeCompare(b.studentName))
  }, [jurnals])

  // Get unique students and tempat PKL for filters
  const uniqueStudents = useMemo(() => {
    return Array.from(new Set(groupedStudents.map(g => g.studentName))).sort()
  }, [groupedStudents])

  const uniqueTempatPkl = useMemo(() => {
    return Array.from(new Set(
      groupedStudents
        .filter(g => g.tempatPkl)
        .map(g => g.tempatPkl!.nama)
    )).sort()
  }, [groupedStudents])

  // Filter grouped students
  const filteredGroupedStudents = useMemo(() => {
    let filtered = groupedStudents

    // Filter by student
    if (selectedStudent !== 'all') {
      filtered = filtered.filter(group => group.studentName === selectedStudent)
    }

    // Filter by tempat PKL
    if (selectedTempatPkl !== 'all') {
      filtered = filtered.filter(group => group.tempatPkl?.nama === selectedTempatPkl)
    }

    // Filter by comment status
    if (filter === 'commented') {
      filtered = filtered.filter(group => group.commentedJurnals > 0)
    } else if (filter === 'uncommented') {
      filtered = filtered.filter(group => group.uncommentedJurnals > 0)
    }

    return filtered
  }, [groupedStudents, selectedStudent, selectedTempatPkl, filter])

  const formatTanggal = (dateString: string) => {
    const date = new Date(dateString)
    return formatDate(date)
  }

  const getTotalStats = () => {
    const total = jurnals.length
    const commented = jurnals.filter(j => j.comments.length > 0).length
    const uncommented = total - commented
    return { total, commented, uncommented }
  }

  const stats = getTotalStats()

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-gray-600">Total Jurnal</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.commented}</p>
                <p className="text-sm text-gray-600">Sudah Dikomentar</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-2xl font-bold text-red-600">{stats.uncommented}</p>
                <p className="text-sm text-gray-600">Belum Dikomentar</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            Semua Siswa ({groupedStudents.length})
          </Button>
          <Button
            variant={filter === 'uncommented' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('uncommented')}
          >
            Ada Jurnal Belum Dikomentar ({groupedStudents.filter(g => g.uncommentedJurnals > 0).length})
          </Button>
          <Button
            variant={filter === 'commented' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('commented')}
          >
            Semua Jurnal Sudah Dikomentar ({groupedStudents.filter(g => g.uncommentedJurnals === 0 && g.totalJurnals > 0).length})
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Filter berdasarkan Siswa:</label>
            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih siswa..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Siswa</SelectItem>
                {uniqueStudents.map(student => (
                  <SelectItem key={student} value={student}>{student}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Filter berdasarkan Tempat PKL:</label>
            <Select value={selectedTempatPkl} onValueChange={setSelectedTempatPkl}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih tempat PKL..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Tempat PKL</SelectItem>
                {uniqueTempatPkl.map(tempat => (
                  <SelectItem key={tempat} value={tempat}>{tempat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Grouped Students */}
      {filteredGroupedStudents.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada data siswa</h3>
            <p className="text-gray-500 text-center">
              Tidak ada siswa yang sesuai dengan filter yang dipilih.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Accordion type="multiple" className="space-y-4">
          {filteredGroupedStudents.map((student) => (
            <AccordionItem key={student.studentId} value={student.studentId} className="border rounded-lg">
              <Card>
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full text-left">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-blue-600" />
                      <div>
                        <h3 className="font-semibold text-lg">{student.studentName}</h3>
                        <p className="text-sm text-gray-600">NISN: {student.nisn} • {student.kelas} • {student.jurusan}</p>
                        {student.tempatPkl && (
                          <div className="flex items-center gap-1 mt-1">
                            <Building className="h-3 w-3 text-gray-500" />
                            <p className="text-xs text-gray-500">{student.tempatPkl.nama}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                      <Badge variant="outline" className="text-xs">
                        {student.totalJurnals} Jurnal
                      </Badge>
                      {student.commentedJurnals > 0 && (
                        <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                          🟢 {student.commentedJurnals} Dikomentar
                        </Badge>
                      )}
                      {student.uncommentedJurnals > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          🔴 {student.uncommentedJurnals} Belum
                        </Badge>
                      )}
                    </div>
                  </div>
                </AccordionTrigger>
                
                <AccordionContent>
                  <div className="px-6 pb-4 space-y-4">
                    {student.tempatPkl && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-gray-600 mt-1" />
                          <div>
                            <p className="font-medium text-sm">{student.tempatPkl.nama}</p>
                            <p className="text-xs text-gray-600">{student.tempatPkl.alamat}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-3">
                      {student.jurnals.map((jurnal) => {
                        const hasComments = jurnal.comments.length > 0
                        const latestComment = hasComments ? jurnal.comments[jurnal.comments.length - 1] : null
                        
                        return (
                          <Card key={jurnal.id} className="border-l-4 border-l-blue-200">
                            <CardHeader className="pb-3">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-blue-600" />
                                  <span className="font-medium">{formatTanggal(jurnal.tanggal)}</span>
                                </div>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                                  {hasComments ? (
                                    <>
                                      <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                                        🟢 Sudah Dikomentar
                                      </Badge>
                                      <Button
                                        onClick={() => handleKomentar(jurnal)}
                                        variant="outline"
                                        size="sm"
                                        className="text-xs"
                                      >
                                        <Edit className="h-3 w-3 mr-1" />
                                        Edit
                                      </Button>
                                    </>
                                  ) : (
                                    <>
                                      <Badge variant="destructive" className="text-xs">
                                        🔴 Belum Dikomentar
                                      </Badge>
                                      <Button
                                        onClick={() => handleKomentar(jurnal)}
                                        variant="default"
                                        size="sm"
                                        className="text-xs"
                                      >
                                        <MessageSquare className="h-3 w-3 mr-1" />
                                        Beri Komentar
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </div>
                            </CardHeader>
                            
                            <CardContent className="space-y-3">
                              <div>
                                <h4 className="font-medium text-gray-900 mb-1 text-sm">Kegiatan:</h4>
                                <p className="text-gray-700 text-sm leading-relaxed">{jurnal.kegiatan}</p>
                              </div>
                              
                              {jurnal.dokumentasi && (
                                <div>
                                  <h4 className="font-medium text-gray-900 mb-1 text-sm">Dokumentasi:</h4>
                                  <div className="flex items-center gap-2">
                                    <ExternalLink className="h-3 w-3 text-blue-600 flex-shrink-0" />
                                    <a 
                                      href={jurnal.dokumentasi} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline text-sm break-all"
                                    >
                                      {jurnal.dokumentasi}
                                    </a>
                                  </div>
                                </div>
                              )}
                              
                              {latestComment && (
                                <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                                  <div className="flex items-center gap-2 mb-2">
                                    <MessageSquare className="h-3 w-3 text-blue-600" />
                                    <h4 className="font-medium text-blue-900 text-sm">Komentar Guru:</h4>
                                  </div>
                                  <p className="text-blue-800 mb-2 text-sm">{latestComment.comment}</p>
                                  <p className="text-xs text-blue-600">
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
                  </div>
                </AccordionContent>
              </Card>
            </AccordionItem>
          ))}
        </Accordion>
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