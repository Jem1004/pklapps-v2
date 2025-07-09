'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Clock, LogIn, LogOut, Eye, EyeOff, AlertTriangle, WifiOff } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { pinAbsensiSchema, type PinAbsensiInput } from '@/lib/validations/absensi'
import { submitAbsensi } from '@/app/absensi/actions'
import { TipeAbsensi } from '@prisma/client'

interface AbsensiFormProps {
  period: {
    type: 'MASUK' | 'PULANG' | 'TUTUP'
    label: string
    color: string
    bgColor: string
    borderColor: string
  }
  isOnline: boolean
  onSubmitSuccess?: () => void
  onSubmitError?: (error: string) => void
  lastAbsensi?: {
    tanggal: string
    waktuMasuk?: string
    waktuPulang?: string
  } | null
}

export function AbsensiForm({
  period,
  isOnline,
  onSubmitSuccess,
  onSubmitError,
  lastAbsensi
}: AbsensiFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPin, setShowPin] = useState(false)
  const [selectedTipe, setSelectedTipe] = useState<TipeAbsensi | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<PinAbsensiInput>({
    resolver: zodResolver(pinAbsensiSchema),
    defaultValues: {
      pin: '',
      tipe: 'MASUK'
    }
  })

  const handleFormSubmit = async (data: PinAbsensiInput) => {
    if (!selectedTipe) {
      toast.error('Pilih tipe absensi terlebih dahulu')
      return
    }

    if (!isOnline) {
      onSubmitError?.('Tidak ada koneksi internet')
      return
    }

    try {
      setIsSubmitting(true)
      
      // Create FormData for the new transaction-based API
      const formData = new FormData()
      formData.append('pin', data.pin)
      formData.append('tipe', selectedTipe)
      
      const result = await submitAbsensi(formData) as { success: boolean; message?: string }
      
      if (result.success) {
        toast.success(result.message || 'Absensi berhasil dicatat')
        reset()
        setSelectedTipe(null)
        onSubmitSuccess?.()
      } else {
        const errorMessage = result.message || 'Gagal mencatat absensi'
        toast.error(errorMessage)
        onSubmitError?.(errorMessage)
      }
    } catch (error) {
      console.error('Error submitting absensi:', error)
      const errorMessage = 'Terjadi kesalahan saat mencatat absensi'
      toast.error(errorMessage)
      onSubmitError?.(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTipeSelect = (tipe: TipeAbsensi) => {
    setSelectedTipe(tipe)
    setValue('tipe', tipe)
  }

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const canAbsenMasuk = !lastAbsensi?.waktuMasuk
  const canAbsenPulang = lastAbsensi?.waktuMasuk && !lastAbsensi?.waktuPulang

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5" />
            Status Absensi Hari Ini
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground">
              {getCurrentDate()}
            </div>
            <div className="text-2xl font-mono">
              {getCurrentTime()}
            </div>
            
            {lastAbsensi ? (
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-1">
                  <div className="text-sm font-medium">Waktu Masuk</div>
                  <div className={`text-lg font-mono ${
                    lastAbsensi.waktuMasuk ? 'text-green-600' : 'text-muted-foreground'
                  }`}>
                    {lastAbsensi.waktuMasuk || 'Belum absen'}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Waktu Pulang</div>
                  <div className={`text-lg font-mono ${
                    lastAbsensi.waktuPulang ? 'text-blue-600' : 'text-muted-foreground'
                  }`}>
                    {lastAbsensi.waktuPulang || 'Belum absen'}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-muted-foreground">
                Belum ada data absensi hari ini
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Absensi Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Form Absensi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* PIN Input */}
            <div className="space-y-2">
              <Label htmlFor="pin">PIN Absensi dari Pembimbing PKL</Label>
              <div className="relative">
                <Input
                  id="pin"
                  type={showPin ? 'text' : 'password'}
                  placeholder="Masukkan PIN absensi..."
                  {...register('pin')}
                  className={`pr-10 ${errors.pin ? 'border-destructive' : ''}`}
                  disabled={isSubmitting || !isOnline}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPin(!showPin)}
                  disabled={isSubmitting || !isOnline}
                >
                  {showPin ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {errors.pin && (
                <p className="text-sm text-destructive">{errors.pin.message}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Absen Masuk */}
              <Button
                type="submit"
                variant={selectedTipe === 'MASUK' ? 'default' : 'outline'}
                size="lg"
                className="h-16 flex flex-col gap-2"
                disabled={!canAbsenMasuk || isSubmitting || !isOnline || period.type === 'TUTUP'}
                onClick={() => handleTipeSelect('MASUK')}
              >
                <LogIn className="h-6 w-6" />
                <span className="text-sm font-medium">
                  {canAbsenMasuk ? 'Absen Masuk' : 'Sudah Absen Masuk'}
                </span>
              </Button>

              {/* Absen Pulang */}
              <Button
                type="submit"
                variant={selectedTipe === 'PULANG' ? 'default' : 'outline'}
                size="lg"
                className="h-16 flex flex-col gap-2"
                disabled={!canAbsenPulang || isSubmitting || !isOnline || period.type === 'TUTUP'}
                onClick={() => handleTipeSelect('PULANG')}
              >
                <LogOut className="h-6 w-6" />
                <span className="text-sm font-medium">
                  {canAbsenPulang ? 'Absen Pulang' : 
                   !lastAbsensi?.waktuMasuk ? 'Absen Masuk Dulu' : 'Sudah Absen Pulang'}
                </span>
              </Button>
            </div>

            {/* Instructions */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Cara Menggunakan:</h4>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Masukkan PIN absensi yang diberikan oleh pembimbing PKL</li>
                <li>Pilih "Absen Masuk" saat tiba di tempat PKL</li>
                <li>Pilih "Absen Pulang" saat selesai PKL</li>
                <li>Sistem akan otomatis mencatat waktu absensi</li>
              </ol>
            </div>

            {/* Alerts */}
            {period.type === 'TUTUP' && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Absensi hanya dapat dilakukan pada jam 07:00-10:00 (masuk) dan 13:00-17:00 (pulang).
                </AlertDescription>
              </Alert>
            )}
            
            {!isOnline && (
              <Alert>
                <WifiOff className="h-4 w-4" />
                <AlertDescription>
                  Tidak ada koneksi internet. Pastikan perangkat terhubung ke internet untuk mencatat absensi.
                </AlertDescription>
              </Alert>
            )}

            {/* Loading State */}
            {isSubmitting && (
              <div className="text-center text-sm text-muted-foreground">
                Memproses absensi...
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

// Export for backward compatibility
export default AbsensiForm