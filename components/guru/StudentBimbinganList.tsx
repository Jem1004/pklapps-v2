'use client'

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { formatDate } from "@/lib/utils"
import { Users, MapPin, Calendar, FileText, Search, GraduationCap } from "lucide-react"

interface StudentBimbingan {
  id: string
  user: {
    name: string
    username: string
  }
  nisn: string
  kelas: string
  jurusan: string
  tempatPkl: {
    nama: string
    alamat: string
  } | null
  lastJurnalDate: string | null
  totalJurnals: number
}

export default function StudentBimbinganList() {
  const [students, setStudents] = useState<StudentBimbingan[]>([])
  const [filteredStudents, setFilteredStudents] = useState<StudentBimbingan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchStudentsBimbingan = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/guru/students-bimbingan')
      const result = await response.json()
      
      if (response.ok) {
        setStudents(result.data || [])
        setFilteredStudents(result.data || [])
      } else {
        console.error('Error fetching students:', result.error)
      }
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStudentsBimbingan()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = students.filter(student => 
        student.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.nisn.includes(searchTerm) ||
        student.kelas.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.jurusan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.tempatPkl?.nama || '').toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredStudents(filtered)
    } else {
      setFilteredStudents(students)
    }
  }, [searchTerm, students])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 font-medium">Memuat data siswa...</p>
        </div>
      </div>
    )
  }

  if (students.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16"
      >
        <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <GraduationCap className="h-12 w-12 text-blue-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Belum Ada Siswa Bimbingan</h3>
        <p className="text-gray-500 max-w-md mx-auto">Anda belum memiliki siswa yang dipetakan untuk dibimbing. Hubungi administrator untuk penugasan siswa.</p>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
            <Users className="h-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Siswa Bimbingan</h2>
            <p className="text-sm text-gray-600">{filteredStudents.length} dari {students.length} siswa</p>
          </div>
        </div>
        
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Cari nama, NISN, kelas, atau tempat PKL..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
          />
        </div>
      </div>

      {/* Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
              <TableHead className="font-semibold text-gray-900">Nama Siswa</TableHead>
              <TableHead className="font-semibold text-gray-900">NISN</TableHead>
              <TableHead className="font-semibold text-gray-900">Kelas</TableHead>
              <TableHead className="font-semibold text-gray-900">Jurusan</TableHead>
              <TableHead className="font-semibold text-gray-900">Tempat PKL</TableHead>
              <TableHead className="font-semibold text-gray-900">Total Jurnal</TableHead>
              <TableHead className="font-semibold text-gray-900">Terakhir Mengisi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <div className="text-gray-500">
                    <Search className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p>Tidak ada siswa yang sesuai dengan pencarian "{searchTerm}"</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredStudents.map((student, index) => (
                <motion.tr
                  key={student.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-blue-50/50 transition-colors duration-200 border-b border-gray-100"
                >
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {student.user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{student.user.name}</p>
                        <p className="text-sm text-gray-500">@{student.user.username}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-xs">
                      {student.nisn}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-gray-900">{student.kelas}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {student.jurusan}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {student.tempatPkl ? (
                      <div className="space-y-1">
                        <p className="font-medium text-gray-900">{student.tempatPkl.nama}</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span className="truncate max-w-32">{student.tempatPkl.alamat}</span>
                        </div>
                      </div>
                    ) : (
                      <Badge variant="destructive" className="text-xs">
                        Belum Ditentukan
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-green-600" />
                      <span className="font-semibold text-green-600">{student.totalJurnals}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {student.lastJurnalDate ? (
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-700">
                          {formatDate(student.lastJurnalDate)}
                        </span>
                      </div>
                    ) : (
                      <Badge variant="outline" className="text-xs text-gray-500">
                        Belum Ada
                      </Badge>
                    )}
                  </TableCell>
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </motion.div>
    </div>
  )
}