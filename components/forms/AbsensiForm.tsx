'use client'

import { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Clock, LogIn, LogOut, Eye, EyeOff, AlertTriangle, WifiOff, Save, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { pinAbsensiSchema, type PinAbsensiInput } from '@/lib/validations/absensi'
import { submitAbsensi } from '@/app/absensi/actions'
import { TipeAbsensi } from '@prisma/client'

// Import new utilities
import { usePinStorage } from '@/lib/storage/pin'
import { useOfflineStorage, NetworkUtils } from '@/lib/offline/storage'
import { withRetry, parseError, AttendanceErrorLogger, ErrorUtils } from '@/lib/errors/attendance'
import { getCurrentServerTime, validateAttendanceTime, getClientTimezone } from '@/lib/utils/timezone'

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
  userId?: string
}

interface FormState {
  isSubmitting: boolean
  showPin: boolean
  selectedTipe: TipeAbsensi | null
  pinSuggestions: string[]
  connectionQuality: 'fast' | 'slow' | 'offline'
  timezoneValid: boolean
  offlineQueueCount: number
}

export function AbsensiForm({
  period,
  isOnline,
  onSubmitSuccess,
  onSubmitError,
  lastAbsensi,
  userId = 'default-user'
}: AbsensiFormProps) {
  // Enhanced state management
  const [formState, setFormState] = useState<FormState>({
    isSubmitting: false,
    showPin: false,
    selectedTipe: null,
    pinSuggestions: [],
    connectionQuality: 'fast',
    timezoneValid: true,
    offlineQueueCount: 0
  })
  
  // Initialize hooks
  const pinStorage = usePinStorage(userId)
  const offlineStorage = useOfflineStorage()
  
  // Enhanced form with better validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    getValues
  } = useForm<PinAbsensiInput>({
    resolver: zodResolver(pinAbsensiSchema),
    defaultValues: {
      pin: '',
      tipe: 'MASUK'
    }
  })
  
  const watchedPin = watch('pin')
  
  // Initialize PIN from storage on component mount
  useEffect(() => {
    const storedPin = pinStorage.getStoredPin()
    if (storedPin) {
      setValue('pin', storedPin)
    }
    
    // Check timezone validity
    const clientTime = new Date()
    const serverTime = getCurrentServerTime()
    const validation = validateAttendanceTime(clientTime, serverTime)
    setFormState(prev => ({ ...prev, timezoneValid: validation.isValid }))
    
    // Get offline queue count
    const stats = offlineStorage.getSyncStats()
    setFormState(prev => ({ ...prev, offlineQueueCount: stats.pendingItems }))
  }, [])
  
  // Monitor connection quality
  useEffect(() => {
    const checkConnection = async () => {
      const quality = await NetworkUtils.checkConnectionQuality()
      setFormState(prev => ({ ...prev, connectionQuality: quality }))
    }
    
    checkConnection()
    const interval = setInterval(checkConnection, 30000) // Check every 30 seconds
    
    return () => clearInterval(interval)
  }, [])
  
  // PIN suggestions based on input
  useEffect(() => {
    if (watchedPin && watchedPin.length > 0) {
      const suggestions = pinStorage.getPinSuggestions(watchedPin)
      setFormState(prev => ({ ...prev, pinSuggestions: suggestions }))
    } else {
      setFormState(prev => ({ ...prev, pinSuggestions: [] }))
    }
  }, [watchedPin, pinStorage])
  
  // Auto-uppercase PIN input
  useEffect(() => {
    if (watchedPin) {
      const upperPin = watchedPin.toUpperCase()
      if (upperPin !== watchedPin) {
        setValue('pin', upperPin)
      }
    }
  }, [watchedPin, setValue])

  const handleFormSubmit = async (data: PinAbsensiInput) => {
    if (!formState.selectedTipe) {
      toast.error('Pilih tipe absensi terlebih dahulu')
      return
    }

    // Validate PIN format
    const pinValidation = pinStorage.validatePin(data.pin)
    if (!pinValidation.isValid) {
      toast.error(pinValidation.errors[0] || 'PIN tidak valid')
      return
    }

    // Check timezone validity
    if (!formState.timezoneValid) {
      toast.error('Terjadi masalah dengan zona waktu. Silakan refresh halaman.')
      return
    }

    setFormState(prev => ({ ...prev, isSubmitting: true }))

    try {
      // Store PIN for future use
      pinStorage.storePin(data.pin)

      // If offline, store for later sync
      if (!isOnline || formState.connectionQuality === 'offline') {
        const offlineData = {
          userId,
          pin: data.pin,
          type: formState.selectedTipe as 'masuk' | 'keluar',
          timestamp: Date.now(),
          timezone: getClientTimezone(),
          deviceInfo: { userAgent: navigator.userAgent, platform: navigator.platform, language: navigator.language }
        }
        
        const stored = offlineStorage.storeOfflineAttendance(offlineData)
        if (stored) {
          toast.success('Absensi disimpan offline. Akan disinkronkan saat online.')
          reset()
          setFormState(prev => ({ 
            ...prev, 
            selectedTipe: null,
            offlineQueueCount: prev.offlineQueueCount + 1
          }))
          onSubmitSuccess?.()
        } else {
          toast.error('Gagal menyimpan absensi offline')
        }
        return
      }

      // Online submission with retry mechanism
      const submitWithRetry = async () => {
        const formData = new FormData()
        formData.append('pin', data.pin)
        formData.append('tipe', formState.selectedTipe!)
        formData.append('timezone', getClientTimezone())
        formData.append('timestamp', new Date().toISOString())
        
        return await submitAbsensi(formData)
      }

      const result = await withRetry(submitWithRetry, {
        maxAttempts: 3,
        baseDelay: 1000
      }) as { success: boolean; message?: string }
      
      if (result.success) {
        toast.success(result.message || 'Absensi berhasil dicatat')
        
        reset()
        setFormState(prev => ({ ...prev, selectedTipe: null }))
        onSubmitSuccess?.()
      } else {
        const errorMessage = result.message || 'Gagal mencatat absensi'
        toast.error(errorMessage)
        onSubmitError?.(errorMessage)
      }
    } catch (error) {
      const attendanceError = parseError(error, {
        userId,
        action: 'submit_attendance',
        pin: data.pin
      })
      
      AttendanceErrorLogger.log(attendanceError)
      
      const userMessage = ErrorUtils.getUserMessage(error)
      toast.error(userMessage)
      onSubmitError?.(userMessage)
      
      console.error('Error submitting absensi:', attendanceError)
    } finally {
      setFormState(prev => ({ ...prev, isSubmitting: false }))
    }
  }

  const handleTipeSelect = useCallback((tipe: TipeAbsensi) => {
    setFormState(prev => ({ ...prev, selectedTipe: tipe }))
    setValue('tipe', tipe)
  }, [setValue])

  const getCurrentTime = useCallback(() => {
    try {
      const serverTime = getCurrentServerTime()
      return serverTime.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: getClientTimezone()
      })
    } catch {
      return new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    }
  }, [])

  const getCurrentDate = useCallback(() => {
    try {
      const serverTime = getCurrentServerTime()
      return serverTime.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: getClientTimezone()
      })
    } catch {
      return new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  }, [])
  
  // Sync offline data when coming back online
  const handleSyncOfflineData = useCallback(async () => {
    if (!isOnline) return
    
    try {
      const result = await offlineStorage.syncOfflineData(async (data) => {
        const formData = new FormData()
        formData.append('pin', data.pin)
        formData.append('tipe', data.type === 'masuk' ? 'MASUK' : 'PULANG')
        formData.append('timezone', data.timezone)
        formData.append('timestamp', new Date(data.timestamp).toISOString())
        
        const response = await submitAbsensi(formData) as { success: boolean }
        return response.success
      })
      
      if (result.syncedCount > 0) {
        toast.success(`${result.syncedCount} absensi berhasil disinkronkan`)
        setFormState(prev => ({ 
          ...prev, 
          offlineQueueCount: prev.offlineQueueCount - result.syncedCount 
        }))
      }
      
      if (result.failedCount > 0) {
        toast.error(`${result.failedCount} absensi gagal disinkronkan`)
      }
    } catch (error) {
      console.error('Sync failed:', error)
    }
  }, [isOnline, offlineStorage])
  
  // Auto-sync when coming online
  useEffect(() => {
    if (isOnline && formState.offlineQueueCount > 0) {
      handleSyncOfflineData()
    }
  }, [isOnline, formState.offlineQueueCount, handleSyncOfflineData])

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
            
            {/* Timezone Warning */}
            {!formState.timezoneValid && (
              <div className="text-sm text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
                ⚠️ Timezone tidak sinkron dengan server
              </div>
            )}
            
            {/* Connection Status */}
            {!isOnline && (
              <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-orange-700">
                  <WifiOff className="h-4 w-4" />
                  <span className="text-sm font-medium">Mode Offline</span>
                </div>
                <p className="text-xs text-orange-600 mt-1">
                  Data akan disimpan dan dikirim saat koneksi kembali
                </p>
                {formState.offlineQueueCount > 0 && (
                  <p className="text-xs text-orange-600">
                    {formState.offlineQueueCount} absensi menunggu sinkronisasi
                  </p>
                )}
              </div>
            )}
            
            {/* Connection Quality */}
            {isOnline && formState.connectionQuality && formState.connectionQuality !== 'fast' && (
              <div className="bg-yellow-50 border border-yellow-200 p-2 rounded text-xs text-yellow-700">
                Koneksi {formState.connectionQuality === 'slow' ? 'lemah' : 'sedang'}
              </div>
            )}
            
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
                  type={formState.showPin ? 'text' : 'password'}
                  placeholder="Masukkan PIN absensi..."
                  {...register('pin')}
                  className={`pr-10 ${errors.pin ? 'border-destructive' : ''}`}
                  disabled={formState.isSubmitting || !isOnline}
                  style={{ textTransform: 'uppercase' }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setFormState(prev => ({ ...prev, showPin: !prev.showPin }))}
                  disabled={formState.isSubmitting || !isOnline}
                >
                  {formState.showPin ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              {/* PIN Suggestions */}
              {formState.pinSuggestions.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 p-2 rounded text-xs">
                  <div className="text-blue-700 font-medium mb-1">PIN tersimpan:</div>
                  <div className="flex gap-1 flex-wrap">
                    {formState.pinSuggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={() => {
                          setValue('pin', suggestion)
                          setFormState(prev => ({ ...prev, pinSuggestions: [] }))
                        }}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              
              {errors.pin && (
                <p className="text-sm text-destructive">{errors.pin.message}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Absen Masuk */}
              <Button
                type="submit"
                variant={formState.selectedTipe === 'MASUK' ? 'default' : 'outline'}
                size="lg"
                className="h-16 flex flex-col gap-2"
                disabled={!canAbsenMasuk || formState.isSubmitting || (!isOnline && formState.offlineQueueCount >= 10) || period.type === 'TUTUP'}
                onClick={() => handleTipeSelect('MASUK')}
              >
                {formState.isSubmitting && formState.selectedTipe === 'MASUK' ? (
                  <RefreshCw className="h-6 w-6 animate-spin" />
                ) : (
                  <LogIn className="h-6 w-6" />
                )}
                <span className="text-sm font-medium">
                  {formState.isSubmitting && formState.selectedTipe === 'MASUK' 
                    ? 'Memproses...' 
                    : canAbsenMasuk 
                    ? 'Absen Masuk' 
                    : 'Sudah Absen Masuk'
                  }
                </span>
                {!isOnline && (
                  <Save className="h-3 w-3 text-orange-500" />
                )}
              </Button>

              {/* Absen Pulang */}
              <Button
                type="submit"
                variant={formState.selectedTipe === 'PULANG' ? 'default' : 'outline'}
                size="lg"
                className="h-16 flex flex-col gap-2"
                disabled={!canAbsenPulang || formState.isSubmitting || (!isOnline && formState.offlineQueueCount >= 10) || period.type === 'TUTUP'}
                onClick={() => handleTipeSelect('PULANG')}
              >
                {formState.isSubmitting && formState.selectedTipe === 'PULANG' ? (
                  <RefreshCw className="h-6 w-6 animate-spin" />
                ) : (
                  <LogOut className="h-6 w-6" />
                )}
                <span className="text-sm font-medium">
                  {formState.isSubmitting && formState.selectedTipe === 'PULANG'
                    ? 'Memproses...'
                    : canAbsenPulang 
                    ? 'Absen Pulang' 
                    : !lastAbsensi?.waktuMasuk 
                    ? 'Absen Pulang' 
                    : 'Sudah Absen Pulang'
                  }
                </span>
                {!isOnline && (
                  <Save className="h-3 w-3 text-orange-500" />
                )}
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
            {formState.isSubmitting && (
              <div className="text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>
                  {!isOnline ? 'Menyimpan offline...' : 'Memproses absensi...'}
                </span>
              </div>
            )}
            
            {/* Offline Queue Status */}
            {formState.offlineQueueCount > 0 && isOnline && (
              <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-blue-700">
                    <RefreshCw className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Sinkronisasi {formState.offlineQueueCount} data...
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleSyncOfflineData}
                    disabled={formState.isSubmitting}
                  >
                    Sinkronkan Sekarang
                  </Button>
                </div>
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