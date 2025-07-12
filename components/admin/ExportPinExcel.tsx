'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { FileSpreadsheet, Download, Search, Users, FileText, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface Student {
  id: string
  nis: string
  kelas: string
  jurusan: string
  user: {
    id: string
    name: string
    email: string
  }
  tempatPkl?: {
    id: string
    nama: string
    pinAbsensi?: string
  } | null
  guruPembimbing?: {
    id: string
    user: {
      name: string
      email: string
    }
  } | null
}

interface ExportOptions {
  includeTempatPkl: boolean
  includeGuruPembimbing: boolean
  includeKontakInfo: boolean
}

export function ExportPinExcel() {
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClass, setSelectedClass] = useState<string>('all')
  const [selectedJurusan, setSelectedJurusan] = useState<string>('all')
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    includeTempatPkl: true,
    includeGuruPembimbing: true,
    includeKontakInfo: true
  })
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [classes, setClasses] = useState<string[]>([])
  const [jurusans, setJurusans] = useState<string[]>([])

  useEffect(() => {
    fetchStudents()
  }, [])

  useEffect(() => {
    filterStudents()
  }, [students, searchTerm, selectedClass, selectedJurusan])

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/students?minimal=true')
      if (!response.ok) throw new Error('Failed to fetch students')
      
      const data = await response.json()
      setStudents(data)
      
      // Extract unique classes and jurusans
      const uniqueClasses = [...new Set(data.map((s: Student) => s.kelas))].sort()
      const uniqueJurusans = [...new Set(data.map((s: Student) => s.jurusan))].sort()
      
      setClasses(uniqueClasses as string[])
      setJurusans(uniqueJurusans as string[])
    } catch (error) {
      console.error('Error fetching students:', error)
      toast.error('Gagal memuat data siswa')
    } finally {
      setLoading(false)
    }
  }

  const filterStudents = () => {
    let filtered = students

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(student => 
        student.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.nis.includes(searchTerm) ||
        student.user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by class
    if (selectedClass !== 'all') {
      filtered = filtered.filter(student => student.kelas === selectedClass)
    }

    // Filter by jurusan
    if (selectedJurusan !== 'all') {
      filtered = filtered.filter(student => student.jurusan === selectedJurusan)
    }

    setFilteredStudents(filtered)
  }

  const handleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([])
    } else {
      setSelectedStudents(filteredStudents.map(s => s.id))
    }
  }

  const handleSelectStudent = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    )
  }

  const handleExportExcel = async () => {
    if (selectedStudents.length === 0) {
      toast.error('Pilih minimal satu siswa untuk diekspor')
      return
    }

    try {
      setExporting(true)
      
      const response = await fetch('/api/admin/export-pin-excel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          studentIds: selectedStudents,
          ...exportOptions
        })
      })

      if (!response.ok) throw new Error('Failed to export PIN data')

      // Download the Excel file
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `pin-tempat-pkl-${new Date().toISOString().split('T')[0]}.xlsx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success(`Berhasil mengekspor data ${selectedStudents.length} siswa ke Excel`)
    } catch (error) {
      console.error('Error exporting PIN data:', error)
      toast.error('Gagal mengekspor data PIN')
    } finally {
      setExporting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Memuat data siswa...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Export PIN Tempat PKL</h2>
          <p className="text-muted-foreground">
            Export data PIN tempat PKL siswa ke file Excel
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          {filteredStudents.length} siswa
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Filters and Student List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Filter Siswa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="search">Cari Siswa</Label>
                  <Input
                    id="search"
                    placeholder="Nama, NIS, atau email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="class">Kelas</Label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kelas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Kelas</SelectItem>
                      {classes.map(kelas => (
                        <SelectItem key={kelas} value={kelas}>{kelas}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="jurusan">Jurusan</Label>
                  <Select value={selectedJurusan} onValueChange={setSelectedJurusan}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jurusan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Jurusan</SelectItem>
                      {jurusans.map(jurusan => (
                        <SelectItem key={jurusan} value={jurusan}>{jurusan}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Student List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Daftar Siswa</CardTitle>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                  <Label>Pilih Semua</Label>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredStudents.map(student => (
                  <div key={student.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50">
                    <Checkbox
                      checked={selectedStudents.includes(student.id)}
                      onCheckedChange={() => handleSelectStudent(student.id)}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{student.user.name}</div>
                      <div className="text-sm text-muted-foreground">
                        NIS: {student.nis} • {student.kelas} • {student.jurusan}
                      </div>
                      {student.tempatPkl && (
                        <div className="text-xs text-blue-600">
                          PKL: {student.tempatPkl.nama}
                          {student.tempatPkl.pinAbsensi && (
                            <span className="ml-2 text-green-600">• PIN: {student.tempatPkl.pinAbsensi}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {filteredStudents.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Tidak ada siswa yang sesuai dengan filter
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Print Options and Actions */}
        <div className="space-y-4">
          {/* Export Options */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5" />
                Opsi Export
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeTempatPkl"
                    checked={exportOptions.includeTempatPkl}
                    onCheckedChange={(checked) => 
                      setExportOptions(prev => ({ ...prev, includeTempatPkl: checked as boolean }))
                    }
                  />
                  <Label htmlFor="includeTempatPkl">Sertakan Data Tempat PKL</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeGuruPembimbing"
                    checked={exportOptions.includeGuruPembimbing}
                    onCheckedChange={(checked) => 
                      setExportOptions(prev => ({ ...prev, includeGuruPembimbing: checked as boolean }))
                    }
                  />
                  <Label htmlFor="includeGuruPembimbing">Sertakan Guru Pembimbing</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeKontakInfo"
                    checked={exportOptions.includeKontakInfo}
                    onCheckedChange={(checked) => 
                      setExportOptions(prev => ({ ...prev, includeKontakInfo: checked as boolean }))
                    }
                  />
                  <Label htmlFor="includeKontakInfo">Sertakan Informasi Kontak</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Selected Students Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Ringkasan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Siswa dipilih:</span>
                  <Badge variant="secondary">{selectedStudents.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Total siswa:</span>
                  <Badge variant="outline">{filteredStudents.length}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Export Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <Button 
                  onClick={handleExportExcel}
                  disabled={selectedStudents.length === 0 || exporting}
                  className="w-full"
                >
                  {exporting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Mengekspor...
                    </>
                  ) : (
                    <>
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Export ke Excel
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}