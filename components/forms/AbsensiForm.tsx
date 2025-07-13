'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
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
import { getCurrentServerTime, syncServerTime, getClientTimezone } from '@/lib/utils/timezone'

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
  
  // Initialize component without PIN storage
  useEffect(() => {
    // Check timezone validity with improved async handling
    const checkTimezone = async () => {
      try {
        const clientTime = new Date()
        const clientTimezone = getClientTimezone()
        const syncResult = await syncServerTime(clientTime, clientTimezone)
        
        // Consider timezone valid if time difference is less than 5 minutes
        const isValid = Math.abs(syncResult.timeDifference) <= 300000
        
        setFormState(prev => ({ ...prev, timezoneValid: isValid }))
      } catch (error) {
        console.warn('Failed to validate timezone:', error)
        // Assume valid if we can't check
        setFormState(prev => ({ ...prev, timezoneValid: true }))
      }
    }
    
    // Only check timezone once on mount
    checkTimezone()
    
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
  }, []) // Empty dependency array is correct here
  
  // PIN suggestions disabled for security
  useEffect(() => {
    // PIN suggestions are disabled to prevent PIN storage
    setFormState(prev => ({ ...prev, pinSuggestions: [] }))
  }, [watchedPin])
  
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
    // Prevent multiple submissions
    if (formState.isSubmitting) {
      return
    }

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
      // PIN storage disabled for security reasons
      // PIN should not be stored and must be entered each time

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
        
        // Clear form and PIN for security
        reset({ pin: '', tipe: 'MASUK' })
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
      // Use current time with server timezone for display
      const now = new Date()
      return now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Asia/Makassar'
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
      // Use current date with server timezone for display
      const now = new Date()
      return now.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'Asia/Makassar'
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
  }, [isOnline])
  
  // Auto-sync when coming online
  useEffect(() => {
    if (isOnline && formState.offlineQueueCount > 0) {
      handleSyncOfflineData()
    }
  }, [isOnline]) // Only depend on isOnline to prevent infinite loop

  // Security: Clear PIN when user leaves the page
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Clear PIN field for security
      setValue('pin', '')
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Clear PIN when tab becomes hidden
        setValue('pin', '')
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [setValue])

  // Security: Auto-clear PIN after inactivity
  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const resetTimeout = () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      
      // Clear PIN after 5 minutes of inactivity
      timeoutId = setTimeout(() => {
        if (watchedPin) {
          setValue('pin', '')
          toast.info('PIN telah dihapus karena tidak aktif selama 5 menit')
        }
      }, 5 * 60 * 1000) // 5 minutes
    }

    const handleActivity = () => {
      resetTimeout()
    }

    // Reset timeout when PIN changes
    if (watchedPin) {
      resetTimeout()
    }

    // Listen for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true)
    })

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true)
      })
    }
  }, [watchedPin, setValue])

  // Prevent browser from saving password
  useEffect(() => {
    const preventPasswordSave = (e: BeforeUnloadEvent) => {
      // Clear PIN before page unload
      const currentPin = getValues('pin')
      if (currentPin) {
        setValue('pin', '')
      }
      
      // Clear any autofill data
      const pinInput = document.querySelector('input[name="pin-absensi-temp"]') as HTMLInputElement
      if (pinInput) {
        pinInput.value = ''
        pinInput.setAttribute('autocomplete', 'new-password')
      }
    }

    const handleFormSubmit = (e: Event) => {
      // Prevent browser password save dialog
      const form = e.target as HTMLFormElement
      if (form && form.tagName === 'FORM') {
        setTimeout(() => {
          const pinInput = document.querySelector('input[name="pin-absensi-temp"]') as HTMLInputElement
          if (pinInput) {
            pinInput.value = ''
          }
        }, 100)
      }
    }

    window.addEventListener('beforeunload', preventPasswordSave)
    document.addEventListener('submit', handleFormSubmit)

    return () => {
      window.removeEventListener('beforeunload', preventPasswordSave)
      document.removeEventListener('submit', handleFormSubmit)
    }
  }, [getValues, setValue])

  const canAbsenMasuk = useMemo(() => !lastAbsensi?.waktuMasuk, [lastAbsensi?.waktuMasuk])
  const canAbsenPulang = useMemo(() => lastAbsensi?.waktuMasuk && !lastAbsensi?.waktuPulang, [lastAbsensi?.waktuMasuk, lastAbsensi?.waktuPulang])

  return (
    <div className="space-y-6">
      {/* CSS to prevent password manager icons */}
      <style dangerouslySetInnerHTML={{
        __html: `
          input[type="password"]::-ms-reveal,
          input[type="password"]::-ms-clear {
            display: none;
          }
          input[type="password"]::-webkit-credentials-auto-fill-button,
          input[type="password"]::-webkit-strong-password-auto-fill-button {
            display: none !important;
          }
          input[name="pin-absensi-temp"] {
            -webkit-text-security: ${formState.showPin ? 'none' : 'disc'};
          }
          .pin-input-secure {
            background-image: none !important;
            background-color: transparent !important;
          }
        `
      }} />
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
          <form 
            onSubmit={handleSubmit(handleFormSubmit)} 
            className="space-y-6"
            autoComplete="off"
            noValidate
          >
            {/* PIN Input */}
            <div className="space-y-2">
              <Label htmlFor="pin">PIN Absensi dari Pembimbing PKL</Label>
              <div className="bg-amber-50 border border-amber-200 p-2 rounded text-xs text-amber-700">
                <strong>⚠️ Keamanan:</strong> PIN bersifat rahasia dan tidak akan disimpan oleh sistem. Masukkan PIN setiap kali melakukan absensi.
              </div>
              <div className="relative">
                <Input
                  id="pin"
                  type={formState.showPin ? 'text' : 'password'}
                  placeholder="Masukkan PIN absensi..."
                  {...register('pin')}
                  className={`pr-10 pin-input-secure ${errors.pin ? 'border-destructive' : ''}`}
                  disabled={formState.isSubmitting}
                  style={{ 
                    textTransform: 'uppercase',
                    ...(formState.showPin ? {} : { WebkitTextSecurity: 'disc' } as React.CSSProperties)
                  }}
                  autoComplete="new-password"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  data-form-type="other"
                  data-lpignore="true"
                  data-1p-ignore="true"
                  data-bwignore="true"
                  data-name="pin-absensi-temp"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setFormState(prev => ({ ...prev, showPin: !prev.showPin }))}
                  disabled={formState.isSubmitting}
                >
                  {formState.showPin ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              {/* PIN Suggestions disabled for security */}
              {/* PIN suggestions are disabled to prevent PIN storage and maintain security */}
              
              {errors.pin && (
                <p className="text-sm text-destructive">{errors.pin.message}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Absen Masuk */}
              <Button
                type="button"
                variant={formState.selectedTipe === 'MASUK' ? 'default' : 'outline'}
                size="lg"
                className="h-16 flex flex-col gap-2"
                disabled={!canAbsenMasuk || formState.isSubmitting || period.type === 'TUTUP'}
                onClick={() => {
                  if (formState.isSubmitting) return
                  handleTipeSelect('MASUK')
                  const pin = getValues('pin')
                  if (pin && pin.length >= 4) {
                    handleSubmit(handleFormSubmit)()
                  }
                }}
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
                type="button"
                variant={formState.selectedTipe === 'PULANG' ? 'default' : 'outline'}
                size="lg"
                className="h-16 flex flex-col gap-2"
                disabled={!canAbsenPulang || formState.isSubmitting || period.type === 'TUTUP'}
                onClick={() => {
                  if (formState.isSubmitting) return
                  handleTipeSelect('PULANG')
                  const pin = getValues('pin')
                  if (pin && pin.length >= 4) {
                    handleSubmit(handleFormSubmit)()
                  }
                }}
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
                <li>Minta PIN absensi dari pembimbing PKL (PIN bersifat rahasia)</li>
                <li>Masukkan PIN dengan hati-hati - PIN tidak akan disimpan oleh sistem</li>
                <li>Pilih "Absen Masuk" saat tiba di tempat PKL</li>
                <li>Pilih "Absen Pulang" saat selesai PKL</li>
                <li>PIN akan otomatis terhapus setelah absensi berhasil</li>
              </ol>
              <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                <strong>🔒 Penting:</strong> Pastikan Inputkan PIN Absensi sesuai dengan waktu datang atau pulang
              </div>
            </div>

            {/* Alerts */}
            {period.type === 'TUTUP' && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Absensi hanya dapat dilakukan pada jam  (masuk) dan  (pulang).
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