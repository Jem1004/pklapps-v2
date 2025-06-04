'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Clock,
  Users,
  Calendar,
  Filter,
  CheckCircle,
  XCircle,
  MapPin,
  Loader2,
  RefreshCcw,
  AlertCircle,
  TrendingUp,
  UserCheck
} from 'lucide-react'
import { toast } from 'sonner'

import MainLayoutGuru from '@/components/layout/MainLayoutGuru'

interface StudentAbsensi {
  id: string
  tanggal: Date
  waktuMasuk: Date | null
  waktuPulang: Date | null
  tipe: 'MASUK' | 'PULANG'
  student: {
    id: string
    user: {
      name: string
    }
  }
  tempatPkl: {
    nama: string
    alamat: string
  }
}

interface Student {
  id: string
  user: {
    name: string
    username: string
  }
  tempatPkl: {
    nama: string
    alamat: string
  } | null
}

interface GroupedAbsensi {
  date: Date
  student: Student
  tempatPkl: { nama: string; alamat: string } | null
  absensiList: StudentAbsensi[]
}

export default function GuruAbsensiPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [absensiData, setAbsensiData] = useState<StudentAbsensi[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedStudent, setSelectedStudent] = useState<string>('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Redirect if not teacher
  useEffect(() => {
    if (status === 'loading') return
    
    if (!session?.user) {
      router.push('/auth/login')
      return
    }

    if (session.user.role !== 'TEACHER') {
      router.push('/dashboard')
      return
    }
  }, [session, status, router])

  // Load supervised students
  const loadStudents = async () => {
    try {
      setError(null)
      const response = await fetch('/api/guru/students-bimbingan')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (result.data) {
        setStudents(result.data || [])
      } else if (result.error) {
        throw new Error(result.error)
      } else {
        throw new Error('Invalid response format')
      }
    } catch (error) {
      console.error('Error loading students:', error)
      setError('Gagal memuat data siswa bimbingan')
      toast.error('Gagal memuat data siswa bimbingan')
      setStudents([])
    }
  }

  // Load attendance data
  const loadAbsensiData = async () => {
    try {
      setError(null)
      const params = new URLSearchParams()
      if (selectedStudent && selectedStudent !== "all") params.append('studentId', selectedStudent)
      if (dateFrom) params.append('dateFrom', dateFrom)
      if (dateTo) params.append('dateTo', dateTo)
      
      const response = await fetch(`/api/guru/absensi?${params}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (result.success) {
        setAbsensiData(result.data || [])
      } else {
        throw new Error(result.message || 'Failed to load attendance data')
      }
    } catch (error) {
      console.error('Error loading attendance data:', error)
      setError('Gagal memuat data absensi')
      toast.error('Gagal memuat data absensi')
      setAbsensiData([])
    }
  }

  // Initial load
  useEffect(() => {
    if (session?.user?.role === 'TEACHER') {
      loadStudents().then(() => {
        setIsLoading(false)
      })
    }
  }, [session])

  // Load attendance data when students are loaded or filters change
  useEffect(() => {
    if (students.length > 0) {
      loadAbsensiData()
    }
  }, [students, selectedStudent, dateFrom, dateTo])

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await loadStudents()
      await loadAbsensiData()
      toast.success('Data berhasil diperbarui')
    } catch (error) {
      toast.error('Gagal memperbarui data')
    } finally {
      setIsRefreshing(false)
    }
  }

  // Handle filter
  const handleFilter = async () => {
    await loadAbsensiData()
  }

  // Reset filters
  const handleResetFilter = () => {
    setSelectedStudent('')
    setDateFrom('')
    setDateTo('')
  }

  // Get attendance status for a day
  const getAttendanceStatus = (studentAbsensi: StudentAbsensi[]) => {
    const hasEntry = studentAbsensi.some(a => a.tipe === 'MASUK')
    const hasExit = studentAbsensi.some(a => a.tipe === 'PULANG')
    
    if (hasEntry && hasExit) return 'complete'
    if (hasEntry) return 'partial'
    return 'absent'
  }

  // Group attendance by date and student
  const groupedAbsensi = absensiData.reduce((acc, absensi) => {
    const dateKey = new Date(absensi.tanggal).toDateString()
    const studentKey = absensi.student.id
    const key = `${dateKey}-${studentKey}`
    
    if (!acc[key]) {
      const student = students.find(s => s.id === absensi.student.id)
      acc[key] = {
        date: absensi.tanggal,
        student: student || {
          id: absensi.student.id,
          user: {
            name: absensi.student.user.name,
            username: ''
          },
          tempatPkl: null
        },
        tempatPkl: absensi.tempatPkl,
        absensiList: []
      }
    }
    
    acc[key].absensiList.push(absensi)
    return acc
  }, {} as Record<string, GroupedAbsensi>)

  // Calculate statistics
  const totalAttendance = Object.values(groupedAbsensi).length
  const completeAttendance = Object.values(groupedAbsensi).filter(g => getAttendanceStatus(g.absensiList) === 'complete').length
  const partialAttendance = Object.values(groupedAbsensi).filter(g => getAttendanceStatus(g.absensiList) === 'partial').length
  const absentCount = Object.values(groupedAbsensi).filter(g => getAttendanceStatus(g.absensiList) === 'absent').length

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
          <p className="text-gray-600 font-medium">Memuat data...</p>
        </div>
      </div>
    )
  }

  if (!session?.user || session.user.role !== 'TEACHER') {
    return null
  }

  return (
    <MainLayoutGuru>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-8 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Absensi Siswa Bimbingan</h1>
              <p className="text-blue-100">Monitor kehadiran siswa yang Anda bimbing</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span className="font-semibold">{students.length} Siswa</span>
                </div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
              >
                {isRefreshing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCcw className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Hadir Lengkap</p>
                  <p className="text-2xl font-bold text-green-700">{completeAttendance}</p>
                </div>
                <div className="bg-green-500 p-3 rounded-full">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-amber-100 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 text-sm font-medium">Hadir Sebagian</p>
                  <p className="text-2xl font-bold text-yellow-700">{partialAttendance}</p>
                </div>
                <div className="bg-yellow-500 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-rose-100 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-600 text-sm font-medium">Tidak Hadir</p>
                  <p className="text-2xl font-bold text-red-700">{absentCount}</p>
                </div>
                <div className="bg-red-500 p-3 rounded-full">
                  <XCircle className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total Kehadiran</p>
                  <p className="text-2xl font-bold text-blue-700">{totalAttendance}</p>
                </div>
                <div className="bg-blue-500 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-xl p-4"
          >
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-xl">
              <CardTitle className="flex items-center space-x-2 text-slate-800">
                <Calendar className="h-6 w-6 text-blue-600" />
                <span>Riwayat Kehadiran</span>
              </CardTitle>
              <CardDescription className="text-slate-600">
                Data kehadiran siswa bimbingan Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border border-slate-200">
                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">Siswa</Label>
                  <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                    <SelectTrigger className="bg-white border-slate-300">
                      <SelectValue placeholder="Semua siswa" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua siswa</SelectItem>
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">Dari Tanggal</Label>
                  <Input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="bg-white border-slate-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">Sampai Tanggal</Label>
                  <Input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="bg-white border-slate-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label>&nbsp;</Label>
                  <div className="flex space-x-2">
                    <Button 
                      onClick={handleFilter} 
                      className="flex-1 bg-blue-600 hover:bg-blue-700" 
                      disabled={isRefreshing}
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleResetFilter} 
                      disabled={isRefreshing}
                      className="border-slate-300 text-slate-700 hover:bg-slate-50"
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead className="font-semibold text-slate-700">Nama Siswa</TableHead>
                      <TableHead className="font-semibold text-slate-700">Tanggal</TableHead>
                      <TableHead className="font-semibold text-slate-700">Waktu Masuk</TableHead>
                      <TableHead className="font-semibold text-slate-700">Waktu Pulang</TableHead>
                      <TableHead className="font-semibold text-slate-700">Tempat PKL</TableHead>
                      <TableHead className="font-semibold text-slate-700">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.values(groupedAbsensi).length > 0 ? (
                      Object.values(groupedAbsensi).map((group, index) => {
                        const status = getAttendanceStatus(group.absensiList)
                        const masukData = group.absensiList.find(a => a.tipe === 'MASUK')
                        const pulangData = group.absensiList.find(a => a.tipe === 'PULANG')
                        
                        return (
                          <TableRow key={index} className="hover:bg-slate-50">
                            <TableCell className="font-medium text-slate-800">
                              <div className="flex items-center space-x-2">
                                <UserCheck className="h-4 w-4 text-blue-600" />
                                <span>{group.student.user.name}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-slate-600">
                              {new Date(group.date).toLocaleDateString('id-ID', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                              })}
                            </TableCell>
                            <TableCell>
                              {masukData?.waktuMasuk ? (
                                <div className="flex items-center space-x-2">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  <span className="text-slate-700">
                                    {new Date(masukData.waktuMasuk).toLocaleTimeString('id-ID', {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-slate-400">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {pulangData?.waktuPulang ? (
                                <div className="flex items-center space-x-2">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  <span className="text-slate-700">
                                    {new Date(pulangData.waktuPulang).toLocaleTimeString('id-ID', {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-slate-400">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {(group.tempatPkl || group.student.tempatPkl) ? (
                                <div className="flex items-center space-x-2">
                                  <MapPin className="h-4 w-4 text-slate-500" />
                                  <span className="text-slate-700">
                                    {group.tempatPkl?.nama || group.student.tempatPkl?.nama}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-slate-400">Belum dipetakan</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {status === 'complete' && (
                                <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Lengkap
                                </Badge>
                              )}
                              {status === 'partial' && (
                                <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Sebagian
                                </Badge>
                              )}
                              {status === 'absent' && (
                                <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200">
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Tidak Hadir
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        )
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-12">
                          <div className="flex flex-col items-center space-y-4">
                            <Calendar className="h-16 w-16 text-slate-300" />
                            <div className="text-center">
                              <h3 className="text-lg font-semibold text-slate-700 mb-2">
                                Tidak ada data absensi
                              </h3>
                              <p className="text-slate-500">
                                {selectedStudent || dateFrom || dateTo 
                                  ? "Tidak ada data yang sesuai dengan filter" 
                                  : students.length === 0
                                  ? "Anda belum memiliki siswa bimbingan"
                                  : "Belum ada data absensi untuk siswa bimbingan Anda"}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </MainLayoutGuru>
  )
}