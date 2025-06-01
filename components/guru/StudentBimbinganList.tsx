"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/../components/ui/card"
import { Badge } from "@/../components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/../components/ui/table"
import { formatDate } from "@/../lib/utils"
import { Users, MapPin, Calendar, FileText } from "lucide-react"

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
  const [isLoading, setIsLoading] = useState(true)

  const fetchStudentsBimbingan = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/guru/students-bimbingan')
      const result = await response.json()
      
      if (response.ok) {
        setStudents(result.data || [])
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (students.length === 0) {
    return (
      <Card className="p-8">
        <div className="text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Siswa Bimbingan</h3>
          <p className="text-gray-500">Anda belum memiliki siswa yang dipetakan untuk dibimbing.</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Users className="h-6 w-6 text-blue-600" />
        <div>
          <h2 className="text-xl font-semibold">Siswa Bimbingan</h2>
          <p className="text-sm text-gray-600">{students.length} siswa yang Anda bimbing</p>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Siswa</TableHead>
              <TableHead>NISN</TableHead>
              <TableHead>Kelas</TableHead>
              <TableHead>Jurusan</TableHead>
              <TableHead>Tempat PKL</TableHead>
              <TableHead>Total Jurnal</TableHead>
              <TableHead>Terakhir Mengisi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{student.user.name}</div>
                    <div className="text-sm text-gray-500">@{student.user.username}</div>
                  </div>
                </TableCell>
                <TableCell>{student.nisn}</TableCell>
                <TableCell>{student.kelas}</TableCell>
                <TableCell>{student.jurusan}</TableCell>
                <TableCell>
                  {student.tempatPkl ? (
                    <div className="text-sm">
                      <div className="font-medium flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-green-600" />
                        {student.tempatPkl.nama}
                      </div>
                      <div className="text-gray-500">{student.tempatPkl.alamat}</div>
                    </div>
                  ) : (
                    <Badge variant="secondary">Belum dipetakan</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">{student.totalJurnals}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {student.lastJurnalDate ? (
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      {formatDate(new Date(student.lastJurnalDate))}
                    </div>
                  ) : (
                    <span className="text-gray-400">Belum pernah</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}