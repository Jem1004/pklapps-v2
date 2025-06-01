"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart3, FileText, MessageSquare, Users, Calendar, Search, ChevronLeft, ChevronRight, Grid, List, Eye } from "lucide-react"

interface ActivityStats {
  totalStudents: number
  totalJournals: number
  totalComments: number
  journalsThisMonth: number
  commentsThisMonth: number
  activeStudents: number
}

interface StudentActivity {
  id: string
  user: {
    name: string // Menggunakan 'name' untuk nama lengkap
    username: string
  }
  nisn: string
  kelas: string
  jurusan: string
  tempatPkl: {
    nama: string
  } | null
  journalCount: number
  lastJournalDate: string | null
  commentCount: number
  lastActivity: string | null
}

interface TeacherActivity {
  id: string
  user: {
    name: string // Menggunakan 'name' untuk nama lengkap
    username: string
  }
  nip: string
  commentCount: number
  lastCommentDate: string | null
  studentsSupervised: number
}

export default function ActivityMonitoring() {
  const [stats, setStats] = useState<ActivityStats | null>(null)
  const [studentActivities, setStudentActivities] = useState<StudentActivity[]>([])
  const [teacherActivities, setTeacherActivities] = useState<TeacherActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [activeView, setActiveView] = useState<"overview" | "students" | "teachers">("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"name" | "journals" | "comments" | "lastActivity">("lastActivity")
  const [viewMode, setViewMode] = useState<"table" | "card">("card")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    fetchActivityData()
  }, [])

  const fetchActivityData = async () => {
    try {
      setLoading(true)
      const [statsRes, studentsRes, teachersRes] = await Promise.all([
        fetch('/api/admin/activity-stats'),
        fetch('/api/admin/student-activities'),
        fetch('/api/admin/teacher-activities')
      ])

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }

      if (studentsRes.ok) {
        const studentsData = await studentsRes.json()
        setStudentActivities(studentsData)
      }

      if (teachersRes.ok) {
        const teachersData = await teachersRes.json()
        setTeacherActivities(teachersData)
      }
    } catch (error) {
      console.error('Error fetching activity data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredStudents = studentActivities
    .filter(student => {
      const name = student.user?.name || ''
      const nisn = student.nisn || ''
      const kelas = student.kelas || ''
      const jurusan = student.jurusan || ''
      
      return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             nisn.includes(searchTerm) ||
             kelas.toLowerCase().includes(searchTerm.toLowerCase()) ||
             jurusan.toLowerCase().includes(searchTerm.toLowerCase())
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.user.name.localeCompare(b.user.name)
        case "journals":
          return b.journalCount - a.journalCount
        case "comments":
          return b.commentCount - a.commentCount
        case "lastActivity":
          if (!a.lastActivity && !b.lastActivity) return 0
          if (!a.lastActivity) return 1
          if (!b.lastActivity) return -1
          return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
        default:
          return 0
      }
    })

  const filteredTeachers = teacherActivities
    .filter(teacher => {
      const name = teacher.user?.name || ''
      const nip = teacher.nip || ''
      
      return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             nip.includes(searchTerm)
    })
    .sort((a, b) => b.commentCount - a.commentCount)

  // Pagination logic
  const totalStudentPages = Math.ceil(filteredStudents.length / itemsPerPage)
  const totalTeacherPages = Math.ceil(filteredTeachers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage)
  const paginatedTeachers = filteredTeachers.slice(startIndex, startIndex + itemsPerPage)

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Tidak pernah"
    return new Date(dateString).toLocaleDateString('id-ID')
  }

  const getActivityStatus = (lastActivity: string | null) => {
    if (!lastActivity) return { status: "inactive", label: "Tidak Aktif", color: "destructive" }
    
    const daysSince = Math.floor((Date.now() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysSince <= 3) return { status: "active", label: "Aktif", color: "default" }
    if (daysSince <= 7) return { status: "moderate", label: "Sedang", color: "secondary" }
    return { status: "inactive", label: "Tidak Aktif", color: "destructive" }
  }

  const getBadgeColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800"
      case "moderate": return "bg-yellow-100 text-yellow-800"
      case "inactive": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Monitoring Aktivitas</h2>
          <p className="text-gray-600">Monitor aktivitas jurnal dan komentar siswa dan guru</p>
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => {
            setActiveView("overview")
            setCurrentPage(1)
          }}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeView === "overview" ? "bg-white shadow-sm" : "hover:bg-gray-200"
          }`}
        >
          Ringkasan
        </button>
        <button
          onClick={() => {
            setActiveView("students")
            setCurrentPage(1)
          }}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeView === "students" ? "bg-white shadow-sm" : "hover:bg-gray-200"
          }`}
        >
          Siswa
        </button>
        <button
          onClick={() => {
            setActiveView("teachers")
            setCurrentPage(1)
          }}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeView === "teachers" ? "bg-white shadow-sm" : "hover:bg-gray-200"
          }`}
        >
          Guru
        </button>
      </div>

      {/* Overview */}
      {activeView === "overview" && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Siswa</p>
                <p className="text-3xl font-bold">{stats.totalStudents}</p>
                <p className="text-sm text-green-600">{stats.activeStudents} aktif</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <FileText className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Jurnal</p>
                <p className="text-3xl font-bold">{stats.totalJournals}</p>
                <p className="text-sm text-blue-600">{stats.journalsThisMonth} bulan ini</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <MessageSquare className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Komentar</p>
                <p className="text-3xl font-bold">{stats.totalComments}</p>
                <p className="text-sm text-purple-600">{stats.commentsThisMonth} bulan ini</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Students View */}
      {activeView === "students" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Cari berdasarkan nama, NISN, kelas, atau jurusan..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-10"
              />
            </div>
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Urutkan Nama</SelectItem>
                <SelectItem value="journals">Urutkan Jurnal</SelectItem>
                <SelectItem value="comments">Urutkan Komentar</SelectItem>
                <SelectItem value="lastActivity">Aktivitas Terakhir</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("table")}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "card" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("card")}
              >
                <Grid className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Menampilkan {paginatedStudents.length} dari {filteredStudents.length} siswa
            </p>
          </div>

          {/* Table View */}
          {viewMode === "table" && (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Lengkap</TableHead>
                    <TableHead>NISN</TableHead>
                    <TableHead>Kelas</TableHead>
                    <TableHead>Tempat PKL</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Jurnal</TableHead>
                    <TableHead>Komentar</TableHead>
                    <TableHead>Aktivitas Terakhir</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedStudents.map((student) => {
                    const activityStatus = getActivityStatus(student.lastActivity)
                    return (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.user.name}</TableCell>
                        <TableCell>{student.nisn}</TableCell>
                        <TableCell>{student.kelas} - {student.jurusan}</TableCell>
                        <TableCell>
                          {student.tempatPkl ? student.tempatPkl.nama : "-"}
                        </TableCell>
                        <TableCell>
                          <Badge className={getBadgeColor(activityStatus.status)}>
                            {activityStatus.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <FileText className="h-4 w-4 text-green-600" />
                            <span className="font-semibold">{student.journalCount}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4 text-purple-600" />
                            <span className="font-semibold">{student.commentCount}</span>
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(student.lastActivity)}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Card View */}
          {viewMode === "card" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedStudents.map((student) => {
                const activityStatus = getActivityStatus(student.lastActivity)
                return (
                  <Card key={student.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{student.user.name}</h3>
                        <p className="text-sm text-gray-600">@{student.user.username}</p>
                      </div>
                      <Badge className={getBadgeColor(activityStatus.status)}>
                        {activityStatus.label}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="text-sm">
                        <span className="font-medium">NISN:</span> {student.nisn}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Kelas:</span> {student.kelas} - {student.jurusan}
                      </div>
                      {student.tempatPkl && (
                        <div className="text-sm">
                          <span className="font-medium">PKL:</span> {student.tempatPkl.nama}
                        </div>
                      )}
                      <div className="text-sm">
                        <span className="font-medium">Aktivitas Terakhir:</span> {formatDate(student.lastActivity)}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4 text-green-600" />
                          <span className="font-semibold">{student.journalCount}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4 text-purple-600" />
                          <span className="font-semibold">{student.commentCount}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}

          {/* Pagination for Students */}
          {totalStudentPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <span className="text-sm text-gray-600">
                Halaman {currentPage} dari {totalStudentPages}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalStudentPages))}
                disabled={currentPage === totalStudentPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Teachers View */}
      {activeView === "teachers" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Cari berdasarkan nama atau NIP..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("table")}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "card" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("card")}
              >
                <Grid className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Menampilkan {paginatedTeachers.length} dari {filteredTeachers.length} guru
            </p>
          </div>

          {/* Table View */}
          {viewMode === "table" && (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Lengkap</TableHead>
                    <TableHead>NIP</TableHead>
                    <TableHead>Siswa Dibimbing</TableHead>
                    <TableHead>Komentar</TableHead>
                    <TableHead>Komentar Terakhir</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTeachers.map((teacher) => (
                    <TableRow key={teacher.id}>
                      <TableCell className="font-medium">{teacher.user.name}</TableCell>
                      <TableCell>{teacher.nip}</TableCell>
                      <TableCell>{teacher.studentsSupervised}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4 text-purple-600" />
                          <span className="font-semibold">{teacher.commentCount}</span>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(teacher.lastCommentDate)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Card View */}
          {viewMode === "card" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedTeachers.map((teacher) => (
                <Card key={teacher.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="mb-3">
                    <h3 className="font-semibold text-lg">{teacher.user.name}</h3>
                    <p className="text-sm text-gray-600">@{teacher.user.username}</p>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="text-sm">
                      <span className="font-medium">NIP:</span> {teacher.nip}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Siswa Dibimbing:</span> {teacher.studentsSupervised}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Komentar Terakhir:</span> {formatDate(teacher.lastCommentDate)}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4 text-purple-600" />
                    <span className="font-semibold">{teacher.commentCount}</span>
                    <span className="text-sm text-gray-600">Komentar</span>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination for Teachers */}
          {totalTeacherPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <span className="text-sm text-gray-600">
                Halaman {currentPage} dari {totalTeacherPages}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalTeacherPages))}
                disabled={currentPage === totalTeacherPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {((activeView === "students" && filteredStudents.length === 0) || 
        (activeView === "teachers" && filteredTeachers.length === 0)) && (
        <div className="text-center py-8">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            {searchTerm 
              ? `Tidak ada ${activeView === "students" ? "siswa" : "guru"} yang sesuai dengan pencarian`
              : `Belum ada data ${activeView === "students" ? "siswa" : "guru"}`
            }
          </p>
        </div>
      )}
    </div>
  )
}