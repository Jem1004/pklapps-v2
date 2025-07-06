'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { User, Eye, EyeOff, UserPlus, UserCheck } from 'lucide-react'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createUserSchema, updateUserSchema, type CreateUserInput, type UpdateUserInput } from '@/lib/validations/auth'
import { useErrorHandling } from '@/hooks/useErrorHandling'

// Extended schemas for admin user form with additional fields
const createAdminUserSchema = createUserSchema.extend({
  email: z
    .string()
    .email('Format email tidak valid')
    .optional()
    .or(z.literal('')),
  confirmPassword: z
    .string()
    .min(6, 'Konfirmasi password minimal 6 karakter')
    .max(100, 'Konfirmasi password maksimal 100 karakter'),
  // Student-specific fields
  nisn: z
    .string()
    .max(20, 'NISN maksimal 20 karakter')
    .optional()
    .or(z.literal('')),
  kelas: z
    .string()
    .max(10, 'Kelas maksimal 10 karakter')
    .optional()
    .or(z.literal('')),
  jurusan: z
    .string()
    .max(50, 'Jurusan maksimal 50 karakter')
    .optional()
    .or(z.literal('')),
  // Teacher-specific fields
  nip: z
    .string()
    .max(20, 'NIP maksimal 20 karakter')
    .optional()
    .or(z.literal('')),
}).refine((data) => {
  return data.password === data.confirmPassword
}, {
  message: 'Password dan konfirmasi password tidak sama',
  path: ['confirmPassword'],
}).refine((data) => {
  // Validate student-specific fields
  if (data.role === 'SISWA') {
    return data.nisn && data.nisn.trim() !== '' && data.kelas && data.kelas.trim() !== ''
  }
  return true
}, {
  message: 'NISN dan Kelas wajib diisi untuk siswa',
  path: ['nisn'],
}).refine((data) => {
  // Validate teacher-specific fields
  if (data.role === 'GURU') {
    return data.nip && data.nip.trim() !== ''
  }
  return true
}, {
  message: 'NIP wajib diisi untuk guru',
  path: ['nip'],
})

const updateAdminUserSchema = updateUserSchema.extend({
  email: z
    .string()
    .email('Format email tidak valid')
    .optional()
    .or(z.literal('')),
  confirmPassword: z
    .string()
    .min(6, 'Konfirmasi password minimal 6 karakter')
    .max(100, 'Konfirmasi password maksimal 100 karakter')
    .optional()
    .or(z.literal('')),
  // Student-specific fields
  nisn: z
    .string()
    .max(20, 'NISN maksimal 20 karakter')
    .optional()
    .or(z.literal('')),
  kelas: z
    .string()
    .max(10, 'Kelas maksimal 10 karakter')
    .optional()
    .or(z.literal('')),
  jurusan: z
    .string()
    .max(50, 'Jurusan maksimal 50 karakter')
    .optional()
    .or(z.literal('')),
  // Teacher-specific fields
  nip: z
    .string()
    .max(20, 'NIP maksimal 20 karakter')
    .optional()
    .or(z.literal('')),
}).refine((data) => {
  if (data.password && data.confirmPassword) {
    return data.password === data.confirmPassword
  }
  return true
}, {
  message: 'Password dan konfirmasi password tidak sama',
  path: ['confirmPassword'],
}).refine((data) => {
  // Validate student-specific fields
  if (data.role === 'SISWA') {
    return data.nisn && data.nisn.trim() !== '' && data.kelas && data.kelas.trim() !== ''
  }
  return true
}, {
  message: 'NISN dan Kelas wajib diisi untuk siswa',
  path: ['nisn'],
}).refine((data) => {
  // Validate teacher-specific fields
  if (data.role === 'GURU') {
    return data.nip && data.nip.trim() !== ''
  }
  return true
}, {
  message: 'NIP wajib diisi untuk guru',
  path: ['nip'],
})

type CreateAdminUserInput = z.infer<typeof createAdminUserSchema>
type UpdateAdminUserInput = z.infer<typeof updateAdminUserSchema>

interface AdminUserFormProps {
  onSubmit: (data: CreateUserInput | UpdateUserInput) => Promise<void>
  defaultValues?: Partial<CreateAdminUserInput | UpdateAdminUserInput>
  isLoading?: boolean
  mode?: 'create' | 'edit'
  userId?: string
}

const ROLE_OPTIONS = [
  { value: 'ADMIN', label: 'Admin' },
  { value: 'GURU', label: 'Guru' },
  { value: 'SISWA', label: 'Siswa' },
] as const

const KELAS_OPTIONS = [
  'X RPL 1', 'X RPL 2', 'X TKJ 1', 'X TKJ 2',
  'XI RPL 1', 'XI RPL 2', 'XI TKJ 1', 'XI TKJ 2',
  'XII RPL 1', 'XII RPL 2', 'XII TKJ 1', 'XII TKJ 2',
] as const

const JURUSAN_OPTIONS = [
  'Rekayasa Perangkat Lunak',
  'Teknik Komputer dan Jaringan',
  'Teknik Elektronika Industri',
  'Teknik Mesin',
] as const

export default function AdminUserForm({
  onSubmit,
  defaultValues,
  isLoading = false,
  mode = 'create',
  userId
}: AdminUserFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { handleError } = useErrorHandling()

  const schema = mode === 'create' ? createAdminUserSchema : updateAdminUserSchema

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
    clearErrors
  } = useForm<CreateAdminUserInput | UpdateAdminUserInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      role: 'SISWA',
      ...defaultValues
    }
  })

  const watchedRole = watch('role')
  const watchedUsername = watch('username')
  const watchedName = watch('name')

  // Reset form when mode or defaultValues change
  useEffect(() => {
    if (defaultValues) {
      reset({
        role: 'SISWA',
        ...defaultValues
      })
    }
  }, [defaultValues, reset])

  // Clear role-specific errors when role changes
  useEffect(() => {
    clearErrors(['nisn', 'kelas', 'jurusan', 'nip'])
  }, [watchedRole, clearErrors])

  const handleFormSubmit = async (data: CreateAdminUserInput | UpdateAdminUserInput) => {
    try {
      setIsSubmitting(true)
      
      // Remove confirmPassword and empty optional fields before submitting
      const { confirmPassword, ...submitData } = data as any
      
      // Remove empty optional fields
      Object.keys(submitData).forEach(key => {
        if (submitData[key] === '' || submitData[key] === undefined) {
          delete submitData[key]
        }
      })
      
      // Remove role-specific fields that don't apply
      if (submitData.role !== 'SISWA') {
        delete submitData.nisn
        delete submitData.kelas
        delete submitData.jurusan
      }
      
      if (submitData.role !== 'GURU') {
        delete submitData.nip
      }
      
      await onSubmit(submitData)
      
      if (mode === 'create') {
        reset({
          role: 'SISWA',
          username: '',
          password: '',
          confirmPassword: '',
          name: '',
          email: '',
          nisn: '',
          kelas: '',
          jurusan: '',
          nip: ''
        })
      }
    } catch (error) {
      handleError(error as Error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const generateUsername = () => {
    if (watchedName) {
      const cleanName = watchedName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .substring(0, 20)
      setValue('username', cleanName)
    }
  }

  const isStudentRole = watchedRole === 'SISWA'
  const isTeacherRole = watchedRole === 'GURU'
  const isAdminRole = watchedRole === 'ADMIN'

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {mode === 'create' ? (
            <>
              <UserPlus className="h-5 w-5" />
              Tambah Pengguna Baru
            </>
          ) : (
            <>
              <UserCheck className="h-5 w-5" />
              Edit Pengguna
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Informasi Dasar</h3>
            
            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="role">
                Role
                <span className="text-destructive ml-1">*</span>
              </Label>
              <Select
                value={watchedRole}
                onValueChange={(value) => setValue('role', value as any)}
              >
                <SelectTrigger className={errors.role ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Pilih role pengguna" />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-sm text-destructive">{errors.role.message}</p>
              )}
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Nama Lengkap
                <span className="text-destructive ml-1">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Masukkan nama lengkap"
                {...register('name')}
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username">
                Username
                <span className="text-destructive ml-1">*</span>
              </Label>
              <div className="flex gap-2">
                <Input
                  id="username"
                  placeholder="Masukkan username"
                  {...register('username')}
                  className={`flex-1 ${errors.username ? 'border-destructive' : ''}`}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={generateUsername}
                  disabled={!watchedName}
                >
                  Generate
                </Button>
              </div>
              {errors.username && (
                <p className="text-sm text-destructive">{errors.username.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Username hanya boleh mengandung huruf, angka, dan underscore
              </p>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email (Opsional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="Masukkan email"
                {...register('email')}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* Password Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              {mode === 'create' ? 'Password' : 'Ubah Password (Kosongkan jika tidak ingin mengubah)'}
            </h3>
            
            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">
                Password
                {mode === 'create' && <span className="text-destructive ml-1">*</span>}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={mode === 'create' ? 'Masukkan password' : 'Masukkan password baru'}
                  {...register('password')}
                  className={`pr-10 ${errors.password ? 'border-destructive' : ''}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                Konfirmasi Password
                {mode === 'create' && <span className="text-destructive ml-1">*</span>}
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder={mode === 'create' ? 'Konfirmasi password' : 'Konfirmasi password baru'}
                  {...register('confirmPassword')}
                  className={`pr-10 ${errors.confirmPassword ? 'border-destructive' : ''}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          {/* Role-specific Fields */}
          {isStudentRole && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Informasi Siswa</h3>
              
              {/* NISN */}
              <div className="space-y-2">
                <Label htmlFor="nisn">
                  NISN
                  <span className="text-destructive ml-1">*</span>
                </Label>
                <Input
                  id="nisn"
                  placeholder="Masukkan NISN"
                  {...register('nisn')}
                  className={errors.nisn ? 'border-destructive' : ''}
                />
                {errors.nisn && (
                  <p className="text-sm text-destructive">{errors.nisn.message}</p>
                )}
              </div>

              {/* Kelas */}
              <div className="space-y-2">
                <Label htmlFor="kelas">
                  Kelas
                  <span className="text-destructive ml-1">*</span>
                </Label>
                <Select
                  value={watch('kelas') || ''}
                  onValueChange={(value) => setValue('kelas', value)}
                >
                  <SelectTrigger className={errors.kelas ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Pilih kelas" />
                  </SelectTrigger>
                  <SelectContent>
                    {KELAS_OPTIONS.map((kelas) => (
                      <SelectItem key={kelas} value={kelas}>
                        {kelas}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.kelas && (
                  <p className="text-sm text-destructive">{errors.kelas.message}</p>
                )}
              </div>

              {/* Jurusan */}
              <div className="space-y-2">
                <Label htmlFor="jurusan">Jurusan</Label>
                <Select
                  value={watch('jurusan') || ''}
                  onValueChange={(value) => setValue('jurusan', value)}
                >
                  <SelectTrigger className={errors.jurusan ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Pilih jurusan" />
                  </SelectTrigger>
                  <SelectContent>
                    {JURUSAN_OPTIONS.map((jurusan) => (
                      <SelectItem key={jurusan} value={jurusan}>
                        {jurusan}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.jurusan && (
                  <p className="text-sm text-destructive">{errors.jurusan.message}</p>
                )}
              </div>
            </div>
          )}

          {isTeacherRole && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Informasi Guru</h3>
              
              {/* NIP */}
              <div className="space-y-2">
                <Label htmlFor="nip">
                  NIP
                  <span className="text-destructive ml-1">*</span>
                </Label>
                <Input
                  id="nip"
                  placeholder="Masukkan NIP"
                  {...register('nip')}
                  className={errors.nip ? 'border-destructive' : ''}
                />
                {errors.nip && (
                  <p className="text-sm text-destructive">{errors.nip.message}</p>
                )}
              </div>
            </div>
          )}

          {/* Information Box */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="text-sm font-medium mb-2">💡 Informasi:</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Username harus unik dan hanya boleh mengandung huruf, angka, dan underscore</li>
              <li>• Password minimal 6 karakter</li>
              {isStudentRole && (
                <>
                  <li>• NISN dan Kelas wajib diisi untuk siswa</li>
                  <li>• Siswa dapat ditugaskan ke tempat PKL setelah akun dibuat</li>
                </>
              )}
              {isTeacherRole && (
                <>
                  <li>• NIP wajib diisi untuk guru</li>
                  <li>• Guru dapat ditugaskan sebagai pembimbing siswa</li>
                </>
              )}
              {isAdminRole && (
                <li>• Admin memiliki akses penuh ke sistem</li>
              )}
            </ul>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="flex-1"
            >
              {isSubmitting 
                ? (mode === 'create' ? 'Membuat...' : 'Mengupdate...') 
                : (mode === 'create' ? 'Buat Pengguna' : 'Update Pengguna')
              }
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
              disabled={isSubmitting || isLoading}
            >
              Reset
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

// Named exports
export { type CreateAdminUserInput, type UpdateAdminUserInput }