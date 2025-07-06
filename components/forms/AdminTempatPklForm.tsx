'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { createTempatPklSchema, updateTempatPklSchema, type CreateTempatPklInput, type UpdateTempatPklInput } from '@/lib/validations/admin'
import { Loader2, MapPin, Building, Phone } from 'lucide-react'

interface AdminTempatPklFormProps {
  mode: 'create' | 'edit'
  initialData?: Partial<UpdateTempatPklInput>
  onSubmit: (data: CreateTempatPklInput | UpdateTempatPklInput) => Promise<void>
  onCancel?: () => void
  isLoading?: boolean
}

export function AdminTempatPklForm({
  mode,
  initialData,
  onSubmit,
  onCancel,
  isLoading = false
}: AdminTempatPklFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null)

  const schema = mode === 'create' ? createTempatPklSchema : updateTempatPklSchema
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch
  } = useForm<CreateTempatPklInput | UpdateTempatPklInput>({
    resolver: zodResolver(schema),
    defaultValues: initialData || {
      nama: '',
      alamat: '',
      kontak: '',
      deskripsi: ''
    }
  })

  const handleFormSubmit = async (data: CreateTempatPklInput | UpdateTempatPklInput) => {
    try {
      setSubmitError(null)
      await onSubmit(data)
      if (mode === 'create') {
        reset()
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Terjadi kesalahan saat menyimpan data')
    }
  }

  const handleReset = () => {
    reset()
    setSubmitError(null)
  }

  const deskripsi = watch('deskripsi')
  const deskripsiLength = deskripsi?.length || 0

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          {mode === 'create' ? 'Tambah Tempat PKL' : 'Edit Tempat PKL'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {submitError && (
            <Alert variant="destructive">
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}

          {/* Nama Tempat PKL */}
          <div className="space-y-2">
            <Label htmlFor="nama" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Nama Tempat PKL *
            </Label>
            <Input
              id="nama"
              {...register('nama')}
              placeholder="Masukkan nama tempat PKL"
              className={errors.nama ? 'border-red-500' : ''}
            />
            {errors.nama && (
              <p className="text-sm text-red-500">{errors.nama.message}</p>
            )}
          </div>

          {/* Alamat */}
          <div className="space-y-2">
            <Label htmlFor="alamat" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Alamat *
            </Label>
            <Textarea
              id="alamat"
              {...register('alamat')}
              placeholder="Masukkan alamat lengkap tempat PKL"
              className={errors.alamat ? 'border-red-500' : ''}
              rows={3}
            />
            {errors.alamat && (
              <p className="text-sm text-red-500">{errors.alamat.message}</p>
            )}
          </div>

          {/* Kontak */}
          <div className="space-y-2">
            <Label htmlFor="kontak" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Nomor Kontak *
            </Label>
            <Input
              id="kontak"
              {...register('kontak')}
              placeholder="Masukkan nomor telepon/HP"
              className={errors.kontak ? 'border-red-500' : ''}
            />
            {errors.kontak && (
              <p className="text-sm text-red-500">{errors.kontak.message}</p>
            )}
            <p className="text-xs text-gray-500">
              Format: 08xxxxxxxxxx atau +62xxxxxxxxxx
            </p>
          </div>



          {/* Deskripsi */}
          <div className="space-y-2">
            <Label htmlFor="deskripsi">
              Deskripsi
            </Label>
            <Textarea
              id="deskripsi"
              {...register('deskripsi')}
              placeholder="Masukkan deskripsi tempat PKL (opsional)"
              className={errors.deskripsi ? 'border-red-500' : ''}
              rows={4}
            />
            <div className="flex justify-between items-center">
              {errors.deskripsi && (
                <p className="text-sm text-red-500">{errors.deskripsi.message}</p>
              )}
              <p className="text-xs text-gray-500 ml-auto">
                {deskripsiLength}/500 karakter
              </p>
            </div>
          </div>

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
                  {mode === 'create' ? 'Menyimpan...' : 'Memperbarui...'}
                </>
              ) : (
                mode === 'create' ? 'Simpan Tempat PKL' : 'Perbarui Tempat PKL'
              )}
            </Button>
            
            {mode === 'create' && (
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={isSubmitting || isLoading}
                className="flex-1 sm:flex-none"
              >
                Reset
              </Button>
            )}
            
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

export default AdminTempatPklForm