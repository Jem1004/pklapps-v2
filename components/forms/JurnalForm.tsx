'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useState, useMemo, useCallback } from 'react'
import { format } from 'date-fns'
import { CalendarIcon, FileText, Link } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'
import { useOfflineJurnal } from '@/lib/offline/jurnalStorage'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Wifi, WifiOff, Loader2 } from 'lucide-react'
import { createJurnalSchema, type CreateJurnalInput } from '@/lib/validations/jurnal'
import { useErrorHandling } from '@/hooks/useErrorHandling'

interface JurnalFormProps {
  onSubmit: (data: CreateJurnalInput) => Promise<void>
  studentId: string
  defaultValues?: Partial<CreateJurnalInput>
  isLoading?: boolean
  mode?: 'create' | 'edit'
}

export function JurnalForm({
  onSubmit,
  studentId,
  defaultValues,
  isLoading = false,
  mode = 'create'
}: JurnalFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitAttempts, setSubmitAttempts] = useState(0)
  const [lastError, setLastError] = useState<string | null>(null)
  const { handleError } = useErrorHandling()
  const { storeOfflineJurnal, isOnline } = useOfflineJurnal()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset
  } = useForm<CreateJurnalInput>({
    resolver: zodResolver(createJurnalSchema),
    defaultValues: {
      tanggal: new Date(),
      studentId,
      ...defaultValues
    }
  })

  const watchedKegiatan = watch('kegiatan')
  const watchedKeterangan = watch('keterangan')
  
  // Debounced values to prevent excessive re-renders
  const debouncedKegiatan = useDebounce(watchedKegiatan || '', 300)
  const debouncedKeterangan = useDebounce(watchedKeterangan || '', 300)

  const handleFormSubmit = async (data: CreateJurnalInput) => {
    const maxRetries = 3
    const retryDelay = 2000 // 2 seconds
    
    try {
      setIsSubmitting(true)
      setLastError(null)
      
      // Attempt submission with retry logic
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          setSubmitAttempts(attempt)
          
          // Check if online before attempting
          if (!isOnline()) {
            throw new Error('Device is offline')
          }
          
          await onSubmit(data)
          
          // Success - reset form if creating new jurnal
          if (mode === 'create') {
            reset({
              tanggal: new Date(),
              studentId,
              kegiatan: '',
              keterangan: '',
              dokumentasi: ''
            })
          }
          
          setSubmitAttempts(0)
          return // Exit on success
          
        } catch (error) {
          console.warn(`Submission attempt ${attempt} failed:`, error)
          
          // If this is the last attempt or device is offline, handle differently
          if (attempt === maxRetries || !isOnline()) {
            throw error
          }
          
          // Wait before retry (with exponential backoff)
          await new Promise(resolve => setTimeout(resolve, retryDelay * attempt))
        }
      }
      
    } catch (error) {
      console.error('All submission attempts failed:', error)
      
      // Store offline if device is offline and mode is create
      if (!isOnline() && mode === 'create') {
        const offlineData = {
          studentId: data.studentId,
          tanggal: data.tanggal,
          kegiatan: data.kegiatan,
          keterangan: data.keterangan || '',
          dokumentasi: data.dokumentasi || '',
          timestamp: Date.now(),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
        
        const stored = storeOfflineJurnal(offlineData)
        
        if (stored) {
          setLastError('Tidak ada koneksi internet. Jurnal disimpan offline dan akan dikirim otomatis saat koneksi tersedia.')
          
          // Reset form on successful offline storage
          reset({
            tanggal: new Date(),
            studentId,
            kegiatan: '',
            keterangan: '',
            dokumentasi: ''
          })
        } else {
          setLastError('Gagal menyimpan jurnal. Pastikan perangkat memiliki ruang penyimpanan yang cukup.')
        }
      } else {
        setLastError(`Gagal ${mode === 'create' ? 'menyimpan' : 'mengupdate'} jurnal setelah ${maxRetries} percobaan.`)
        handleError(error as Error, 'JurnalForm.handleFormSubmit', {
          userMessage: mode === 'create' ? 'Gagal menyimpan jurnal' : 'Gagal mengupdate jurnal'
        })
      }
    } finally {
      setIsSubmitting(false)
      setSubmitAttempts(0)
    }
  }

  const setToday = () => {
    setValue('tanggal', new Date())
  }

  const getCharacterCount = useCallback((text: string) => {
    return text?.length || 0
  }, [])
  
  // Memoized character counts to prevent recalculation
  const kegiatanCount = useMemo(() => getCharacterCount(debouncedKegiatan), [debouncedKegiatan, getCharacterCount])
  const keteranganCount = useMemo(() => getCharacterCount(debouncedKeterangan), [debouncedKeterangan, getCharacterCount])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {mode === 'create' ? 'Form Jurnal Baru' : 'Edit Jurnal'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Tanggal */}
          <div className="space-y-2">
            <Label htmlFor="tanggal">Tanggal</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="tanggal"
                  type="date"
                  {...register('tanggal', {
                    valueAsDate: true
                  })}
                  className={errors.tanggal ? 'border-destructive' : ''}
                />
                <CalendarIcon className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={setToday}
              >
                Hari Ini
              </Button>
            </div>
            {errors.tanggal && (
              <p className="text-sm text-destructive">{errors.tanggal.message}</p>
            )}
          </div>

          {/* Kegiatan */}
          <div className="space-y-2">
            <Label htmlFor="kegiatan">
              Kegiatan
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Textarea
              id="kegiatan"
              placeholder="Deskripsikan kegiatan yang dilakukan hari ini..."
              {...register('kegiatan')}
              className={`min-h-[120px] ${errors.kegiatan ? 'border-destructive' : ''}`}
              rows={5}
            />
            <div className="flex justify-between items-center">
              <div>
                {errors.kegiatan && (
                  <p className="text-sm text-destructive">{errors.kegiatan.message}</p>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {kegiatanCount}/1000 karakter
              </p>
            </div>
          </div>

          {/* Keterangan */}
          <div className="space-y-2">
            <Label htmlFor="keterangan">Keterangan Tambahan (Opsional)</Label>
            <Textarea
              id="keterangan"
              placeholder="Tambahkan keterangan atau catatan khusus..."
              {...register('keterangan')}
              className={errors.keterangan ? 'border-destructive' : ''}
              rows={3}
            />
            <div className="flex justify-between items-center">
              <div>
                {errors.keterangan && (
                  <p className="text-sm text-destructive">{errors.keterangan.message}</p>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {keteranganCount}/500 karakter
              </p>
            </div>
          </div>

          {/* Dokumentasi */}
          <div className="space-y-2">
            <Label htmlFor="dokumentasi" className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              Link Dokumentasi (Opsional)
            </Label>
            <Input
              id="dokumentasi"
              type="url"
              placeholder="https://example.com/dokumentasi"
              {...register('dokumentasi')}
              className={errors.dokumentasi ? 'border-destructive' : ''}
            />
            {errors.dokumentasi && (
              <p className="text-sm text-destructive">{errors.dokumentasi.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Masukkan URL link dokumentasi, foto, atau file pendukung kegiatan
            </p>
          </div>

          {/* Tips */}
          <div className="bg-muted/50 p-3 rounded-lg">
            <h4 className="text-sm font-medium mb-2">💡 Tips Menulis Jurnal:</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Jelaskan kegiatan secara detail dan spesifik</li>
              <li>• Sertakan waktu dan lokasi kegiatan</li>
              <li>• Tuliskan hasil atau pencapaian dari kegiatan</li>
              <li>• Minimal 10 karakter untuk kegiatan</li>
            </ul>
          </div>

          {/* Connection Status & Error Display */}
          {(lastError || !isOnline()) && (
            <Alert className={`${!isOnline() ? 'border-yellow-200 bg-yellow-50' : lastError?.includes('offline') ? 'border-blue-200 bg-blue-50' : 'border-red-200 bg-red-50'}`}>
              {!isOnline() ? <WifiOff className="h-4 w-4" /> : <Wifi className="h-4 w-4" />}
              <AlertDescription className={`${!isOnline() ? 'text-yellow-800' : lastError?.includes('offline') ? 'text-blue-800' : 'text-red-800'}`}>
                {!isOnline() 
                  ? 'Tidak ada koneksi internet. Jurnal akan disimpan offline.' 
                  : lastError
                }
              </AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="flex-1"
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isSubmitting 
                ? (
                  submitAttempts > 0 
                    ? `Percobaan ke-${submitAttempts}...` 
                    : (mode === 'create' ? 'Menyimpan...' : 'Mengupdate...')
                ) 
                : (
                  !isOnline() 
                    ? 'Simpan Offline' 
                    : (mode === 'create' ? 'Simpan Jurnal' : 'Update Jurnal')
                )
              }
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset()
                setLastError(null)
              }}
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