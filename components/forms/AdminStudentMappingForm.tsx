'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { studentMappingSchema, type StudentMappingFormData } from '@/lib/validations/admin'
import { Loader2, Users, Building, UserCheck } from 'lucide-react'

interface Student {
  id: string
  user: {
    name: string
  }
  nisn: string
  kelas: string
  jurusan: string
  tempatPklId?: string | null
  teacherId?: string | null
  tanggalMulai?: Date | null
  tanggalSelesai?: Date | null
}

interface Teacher {
  id: string
  user: {
    name: string
  }
  nip: string
}

interface TempatPkl {
  id: string
  nama: string
  alamat: string
}

interface AdminStudentMappingFormProps {
  student: Student
  teachers: Teacher[]
  tempatPkl: TempatPkl[]
  onSubmit: (data: any) => Promise<void>
  onCancel?: () => void
  isEdit?: boolean
  isLoading?: boolean
}

function AdminStudentMappingForm({
  student,
  teachers,
  tempatPkl,
  onSubmit,
  onCancel,
  isEdit = false,
  isLoading = false
}: AdminStudentMappingFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null)

  const schema = studentMappingSchema
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      studentId: student.id,
      tempatPklId: student.tempatPklId || '',
      teacherId: student.teacherId || 'none'
    }
  })

  const selectedTempatPklId = watch('tempatPklId')
  const selectedTeacherId = watch('teacherId')

  const handleFormSubmit = async (data: any) => {
    try {
      setSubmitError(null)
      await onSubmit(data)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Terjadi kesalahan saat menyimpan data')
    }
  }

  const selectedTempatPkl = tempatPkl.find(t => t.id === selectedTempatPklId)
  const selectedTeacher = selectedTeacherId && selectedTeacherId !== 'none' ? teachers.find(t => t.id === selectedTeacherId) : undefined

  return (
    <Card className="w-full max-w-2xl mx-auto border-l-4 border-l-primary">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="h-5 w-5" />
          {isEdit ? 'Edit Penempatan Siswa' : 'Tambah Penempatan Siswa'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {submitError && (
            <Alert variant="destructive">
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}

          {/* Student Information */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Informasi Siswa
            </Label>
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="font-medium">{student.user.name}</p>
              <p className="text-sm text-gray-600">NISN: {student.nisn}</p>
              <p className="text-sm text-gray-600">{student.kelas} - {student.jurusan}</p>
            </div>
            <input type="hidden" {...register('studentId')} value={student.id} />
          </div>

          {/* Tempat PKL Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Pilih Tempat PKL *
            </Label>
            <Select
              value={selectedTempatPklId || ''}
              onValueChange={(value) => setValue('tempatPklId', value)}
            >
              <SelectTrigger className={errors.tempatPklId ? 'border-red-500' : ''}>
                <SelectValue placeholder="Pilih tempat PKL" />
              </SelectTrigger>
              <SelectContent>
                {tempatPkl.map((tempat) => (
                  <SelectItem key={tempat.id} value={tempat.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{tempat.nama}</span>
                      <span className="text-sm text-gray-500">{tempat.alamat}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.tempatPklId && (
              <p className="text-sm text-red-500">{errors.tempatPklId.message}</p>
            )}
            {selectedTempatPkl && (
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm">
                  <span className="font-medium">Tempat PKL terpilih:</span> {selectedTempatPkl.nama}
                </p>
                <p className="text-xs text-gray-600">{selectedTempatPkl.alamat}</p>
              </div>
            )}
          </div>

          {/* Teacher Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Guru Pembimbing
            </Label>
            <Select
              value={selectedTeacherId || ''}
              onValueChange={(value) => setValue('teacherId', value)}
            >
              <SelectTrigger className={errors.teacherId ? 'border-red-500' : ''}>
                <SelectValue placeholder="Pilih guru pembimbing (opsional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Tidak ada guru pembimbing</SelectItem>
                {teachers.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{teacher.user.name}</span>
                      <span className="text-sm text-gray-500">NIP: {teacher.nip}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.teacherId && (
              <p className="text-sm text-red-500">{errors.teacherId.message}</p>
            )}
            {selectedTeacher && (
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="text-sm">
                  <span className="font-medium">Guru pembimbing:</span> {selectedTeacher.user.name}
                </p>
                <p className="text-xs text-gray-600">NIP: {selectedTeacher.nip}</p>
              </div>
            )}
          </div>



          {/* Summary */}
          {selectedTempatPkl && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Ringkasan Penempatan:</h4>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Siswa:</span> {student.user.name}</p>
                <p><span className="font-medium">Tempat PKL:</span> {selectedTempatPkl.nama}</p>
                <p><span className="font-medium">Guru Pembimbing:</span> {selectedTeacher ? selectedTeacher.user.name : 'Tidak ada'}</p>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="flex-1"
            >
              {isSubmitting || isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEdit ? 'Memperbarui...' : 'Menyimpan...'}
                </>
              ) : (
                isEdit ? 'Perbarui Penempatan' : 'Simpan Penempatan'
              )}
            </Button>
            
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting || isLoading}
                className="flex-1 sm:flex-none"
              >
                Batal
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export { AdminStudentMappingForm }