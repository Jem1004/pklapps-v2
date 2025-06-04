"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UserCheck, MapPin, Search, Plus, ChevronLeft, ChevronRight, Eye, Grid, List } from "lucide-react"

interface Student {
  id: string
  user: {
    id: string
    name: string
    username: string
  }
  nisn: string
  kelas: string
  jurusan: string
  tempatPklId: string | null
  teacherId: string | null
  tempatPkl: {
    id: string
    nama: string
    alamat: string
  } | null
  teacher: {
    id: string
    user: {
      id: string
      name: string
      username: string
    }
  } | null
}

interface Teacher {
  id: string
  user: {
    id: string
    name: string
    username: string
  }
  nip: string
}

interface TempatPkl {
  id: string
  nama: string
  alamat: string
}

export default function StudentMapping() {
  const [students, setStudents] = useState<Student[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [tempatPkl, setTempatPkl] = useState<TempatPkl[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "mapped" | "unmapped">("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<string>("")
  const [selectedTeacher, setSelectedTeacher] = useState<string>("")
  const [viewMode, setViewMode] = useState<"table" | "card">("card")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [studentsRes, teachersRes, locationsRes] = await Promise.all([
        fetch('/api/admin/students'),
        fetch('/api/admin/teachers'),
        fetch('/api/admin/tempat-pkl')
      ])
  
      if (studentsRes.ok) {
        const studentsData = await studentsRes.json()
        setStudents(studentsData)
      }
  
      if (teachersRes.ok) {
        const teachersData = await teachersRes.json()
        setTeachers(teachersData)
      }
  
      if (locationsRes.ok) {
        const locationsData = await locationsRes.json()
        // Fix: Access the data property from the API response
        setTempatPkl(locationsData.data || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      // Set empty arrays on error to prevent map function errors
      setStudents([])
      setTeachers([])
      setTempatPkl([])
    } finally {
      setLoading(false)
    }
  }

  const handleMapping = async () => {
    if (!selectedStudent || !selectedLocation) return

    try {
      const response = await fetch('/api/admin/student-mapping', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: selectedStudent.id,
          tempatPklId: selectedLocation,
          teacherId: selectedTeacher === "none" ? null : selectedTeacher || null
        })
      })

      if (response.ok) {
        await fetchData()
        setIsDialogOpen(false)
        setSelectedStudent(null)
        setSelectedLocation("")
        setSelectedTeacher("")
      }
    } catch (error) {
      console.error('Error mapping student:', error)
    }
  }

  const filteredStudents = students.filter(student => {
    const name = student.user?.name || ''
    const nisn = student.nisn || ''
    const kelas = student.kelas || ''
    const jurusan = student.jurusan || ''
    
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       nisn.includes(searchTerm) ||
                       kelas.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       jurusan.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterStatus === "all" || 
                       (filterStatus === "mapped" && student.tempatPklId) ||
                       (filterStatus === "unmapped" && !student.tempatPklId)
    
    return matchesSearch && matchesFilter
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage)

  const mappedCount = students.filter(s => s.tempatPklId).length
  const unmappedCount = students.length - mappedCount

  const getBadgeColor = (isMapped: boolean) => {
    return isMapped ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
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
          <h2 className="text-2xl font-bold">Pemetaan Siswa PKL</h2>
          <p className="text-gray-600">Petakan siswa ke tempat PKL dan guru pembimbing</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserCheck className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Siswa</p>
              <p className="text-2xl font-bold">{students.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <MapPin className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Sudah Dipetakan</p>
              <p className="text-2xl font-bold text-green-600">{mappedCount}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <UserCheck className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Belum Dipetakan</p>
              <p className="text-2xl font-bold text-red-600">{unmappedCount}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Controls */}
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
        <Select value={filterStatus} onValueChange={(value: "all" | "mapped" | "unmapped") => {
          setFilterStatus(value)
          setCurrentPage(1)
        }}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Siswa</SelectItem>
            <SelectItem value="mapped">Sudah Dipetakan</SelectItem>
            <SelectItem value="unmapped">Belum Dipetakan</SelectItem>
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
          {filterStatus !== "all" && ` (${filterStatus === "mapped" ? "sudah dipetakan" : "belum dipetakan"})`}
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
                <TableHead>Jurusan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Guru Pembimbing</TableHead>
                <TableHead>Tempat PKL</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.user.name}</TableCell>
                  <TableCell>{student.nisn}</TableCell>
                  <TableCell>{student.kelas}</TableCell>
                  <TableCell>{student.jurusan}</TableCell>
                  <TableCell>
                    <Badge className={getBadgeColor(!!student.tempatPklId)}>
                      {student.tempatPklId ? "Dipetakan" : "Belum"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {student.teacher ? (
                      <div className="text-sm">
                        <div className="font-medium">{student.teacher.user.name}</div>
                        <div className="text-gray-500">@{student.teacher.user.username}</div>
                      </div>
                    ) : (
                      <span className="text-gray-400">Belum ditentukan</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {student.tempatPkl ? (
                      <div className="text-sm">
                        <div className="font-medium">{student.tempatPkl.nama}</div>
                        <div className="text-gray-500">{student.tempatPkl.alamat}</div>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      onClick={() => {
                        setSelectedStudent(student)
                        setSelectedLocation(student.tempatPklId || "")
                        setSelectedTeacher(student.teacherId || "none")
                        setIsDialogOpen(true)
                      }}
                      size="sm"
                      variant="outline"
                    >
                      {student.tempatPklId ? "Edit" : "Petakan"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Card View */}
      {viewMode === "card" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedStudents.map((student) => (
            <Card key={student.id} className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{student.user.name}</h3>
                    <p className="text-sm text-gray-600">NISN: {student.nisn}</p>
                  </div>
                  <Badge className={getBadgeColor(!!student.tempatPklId)}>
                    {student.tempatPklId ? "Dipetakan" : "Belum"}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Kelas:</span>
                    <span className="font-medium">{student.kelas}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Jurusan:</span>
                    <span className="font-medium">{student.jurusan}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">Guru Pembimbing:</span>
                    {student.teacher ? (
                      <div className="mt-1">
                        <div className="font-medium">{student.teacher.user.name}</div>
                        <div className="text-gray-500">@{student.teacher.user.username}</div>
                      </div>
                    ) : (
                      <div className="text-gray-400 mt-1">Belum ditentukan</div>
                    )}
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">Tempat PKL:</span>
                    {student.tempatPkl ? (
                      <div className="mt-1">
                        <div className="font-medium">{student.tempatPkl.nama}</div>
                        <div className="text-gray-500">{student.tempatPkl.alamat}</div>
                      </div>
                    ) : (
                      <div className="text-gray-400 mt-1">Belum dipetakan</div>
                    )}
                  </div>
                </div>
                
                <Button
                  onClick={() => {
                    setSelectedStudent(student)
                    setSelectedLocation(student.tempatPklId || "")
                    setSelectedTeacher(student.teacherId || "none")
                    setIsDialogOpen(true)
                  }}
                  className="w-full"
                  variant="outline"
                >
                  {student.tempatPklId ? "Edit Pemetaan" : "Petakan Siswa"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Halaman {currentPage} dari {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
            >
              <ChevronLeft className="h-4 w-4" />
              Sebelumnya
            </Button>
            <Button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              variant="outline"
              size="sm"
            >
              Selanjutnya
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Mapping Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedStudent?.tempatPklId ? "Edit Pemetaan Siswa" : "Petakan Siswa"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedStudent && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">{selectedStudent.user.name}</p>
                <p className="text-sm text-gray-600">NISN: {selectedStudent.nisn}</p>
                <p className="text-sm text-gray-600">{selectedStudent.kelas} - {selectedStudent.jurusan}</p>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="location">Tempat PKL *</Label>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tempat PKL" />
                </SelectTrigger>
                <SelectContent>
                  {tempatPkl.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      <div>
                        <div className="font-medium">{location.nama}</div>
                        <div className="text-sm text-gray-500">{location.alamat}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="teacher">Guru Pembimbing</Label>
              <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih guru pembimbing (opsional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Tidak ada guru pembimbing</SelectItem>
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      <div>
                        <div className="font-medium">{teacher.user.name}</div>
                        <div className="text-sm text-gray-500">NIP: {teacher.nip}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button
                onClick={() => setIsDialogOpen(false)}
                variant="outline"
                className="flex-1"
              >
                Batal
              </Button>
              <Button
                onClick={handleMapping}
                disabled={!selectedLocation}
                className="flex-1"
              >
                {selectedStudent?.tempatPklId ? "Update" : "Petakan"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}