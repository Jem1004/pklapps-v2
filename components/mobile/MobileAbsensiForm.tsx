'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Clock, MapPin, Wifi, WifiOff, CheckCircle, AlertCircle } from 'lucide-react'
import { TouchOptimizedButton, TouchOptimizedInput } from './TouchOptimizedForm'
import { MobileCard, MobileContainer } from '../layout/MobileOptimizedLayout'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useLocalStorage } from '@/hooks/useLocalStorage'

const absensiSchema = z.object({
  pin: z.string().min(4, 'PIN minimal 4 karakter').max(6, 'PIN maksimal 6 karakter'),
  type: z.enum(['masuk', 'pulang']),
  location: z.string().optional(),
  notes: z.string().optional()
})

type AbsensiFormData = z.infer<typeof absensiSchema>

interface MobileAbsensiFormProps {
  onSubmit: (data: AbsensiFormData) => Promise<void>
  className?: string
}

export function MobileAbsensiForm({ onSubmit, className }: MobileAbsensiFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [connectionQuality, setConnectionQuality] = useState<'good' | 'poor' | 'offline'>('good')
  const [isValidTimeZone, setIsValidTimeZone] = useState(true)
  const [offlineQueueCount, setOfflineQueueCount] = useState(0)
  
  const [pinSuggestions] = useLocalStorage('pinSuggestions', [])
  const [queueCount] = useLocalStorage('offlineQueue', 0)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<AbsensiFormData>({
    resolver: zodResolver(absensiSchema),
    defaultValues: {
      type: 'masuk'
    }
  })
  
  const watchedType = watch('type')
  
  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])
  
  // Monitor connection quality
  useEffect(() => {
    const updateConnectionStatus = () => {
      if (!navigator.onLine) {
        setConnectionQuality('offline')
        return
      }
      
      // Check connection quality using navigator.connection if available
      const connection = (navigator as any).connection
      if (connection) {
        const { effectiveType, downlink } = connection
        if (effectiveType === '4g' && downlink > 1) {
          setConnectionQuality('good')
        } else {
          setConnectionQuality('poor')
        }
      } else {
        setConnectionQuality('good')
      }
    }
    
    updateConnectionStatus()
    window.addEventListener('online', updateConnectionStatus)
    window.addEventListener('offline', updateConnectionStatus)
    
    return () => {
      window.removeEventListener('online', updateConnectionStatus)
      window.removeEventListener('offline', updateConnectionStatus)
    }
  }, [])
  
  // Validate timezone
  useEffect(() => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    setIsValidTimeZone(timezone === 'Asia/Makassar')
  }, [])
  
  // Update offline queue count
  useEffect(() => {
    setOfflineQueueCount(queueCount)
  }, [queueCount])
  
  // Disable PIN suggestions for security (placeholder)
  useEffect(() => {
    // PIN suggestions disabled for security
  }, [])
  
  const handleFormSubmit = async (data: AbsensiFormData) => {
    setIsSubmitting(true)
    
    try {
      // Convert PIN to uppercase for consistency
      const formattedData = {
        ...data,
        pin: data.pin.toUpperCase(),
        timestamp: currentTime.toISOString(),
        location: await getCurrentLocation()
      }
      
      await onSubmit(formattedData)
    } catch (error) {
      console.error('Error submitting absensi:', error)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const getCurrentLocation = async (): Promise<string> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve('Location not available')
        return
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          resolve(`${latitude}, ${longitude}`)
        },
        () => {
          resolve('Location access denied')
        },
        { timeout: 5000, enableHighAccuracy: true }
      )
    })
  }
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  const getConnectionIcon = () => {
    switch (connectionQuality) {
      case 'good':
        return <Wifi className="h-4 w-4 text-green-500" />
      case 'poor':
        return <Wifi className="h-4 w-4 text-yellow-500" />
      case 'offline':
        return <WifiOff className="h-4 w-4 text-red-500" />
    }
  }
  
  const getConnectionText = () => {
    switch (connectionQuality) {
      case 'good':
        return 'Koneksi Baik'
      case 'poor':
        return 'Koneksi Lemah'
      case 'offline':
        return 'Offline'
    }
  }
  
  return (
    <MobileContainer className={className}>
      <MobileCard className="space-y-6">
        {/* Header with Time and Status */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2 text-2xl font-bold text-primary">
            <Clock className="h-6 w-6" />
            <span>{formatTime(currentTime)}</span>
          </div>
          <p className="text-sm text-muted-foreground">{formatDate(currentTime)}</p>
          
          {/* Connection Status */}
          <div className="flex items-center justify-center space-x-2">
            {getConnectionIcon()}
            <span className="text-xs">{getConnectionText()}</span>
          </div>
        </div>
        
        {/* Alerts */}
        {!isValidTimeZone && (
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              Zona waktu perangkat tidak sesuai. Pastikan menggunakan zona waktu Asia/Makassar.
            </AlertDescription>
          </Alert>
        )}
        
        {offlineQueueCount > 0 && (
          <Alert className="border-blue-200 bg-blue-50">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Ada {offlineQueueCount} absensi dalam antrian offline yang akan dikirim saat koneksi tersedia.
            </AlertDescription>
          </Alert>
        )}
        
        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Absensi Type Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Jenis Absensi</label>
            <div className="grid grid-cols-2 gap-3">
              <TouchOptimizedButton
                type="button"
                variant={watchedType === 'masuk' ? 'primary' : 'secondary'}
                onClick={() => setValue('type', 'masuk')}
                className="h-12"
              >
                Masuk
              </TouchOptimizedButton>
              <TouchOptimizedButton
                type="button"
                variant={watchedType === 'pulang' ? 'primary' : 'secondary'}
                onClick={() => setValue('type', 'pulang')}
                className="h-12"
              >
                Pulang
              </TouchOptimizedButton>
            </div>
          </div>
          
          {/* PIN Input */}
          <div className="space-y-2">
            <label htmlFor="pin" className="text-sm font-medium">
              PIN Absensi
            </label>
            <TouchOptimizedInput
              id="pin"
              type="password"
              placeholder="Masukkan PIN"
              autoComplete="off"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              {...register('pin', {
                onChange: (e) => {
                  e.target.value = e.target.value.toUpperCase()
                }
              })}
              error={errors.pin?.message}
            />
          </div>
          
          {/* Notes (Optional) */}
          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">
              Catatan (Opsional)
            </label>
            <TouchOptimizedInput
              id="notes"
              placeholder="Tambahkan catatan..."
              {...register('notes')}
            />
          </div>
          
          {/* Submit Button */}
          <TouchOptimizedButton
            type="submit"
            className="w-full h-14 text-lg font-semibold"
            loading={isSubmitting}
            disabled={isSubmitting || !isValidTimeZone}
          >
            {isSubmitting ? 'Memproses...' : `Absen ${watchedType === 'masuk' ? 'Masuk' : 'Pulang'}`}
          </TouchOptimizedButton>
        </form>
        
        {/* Location Info */}
        <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span>Lokasi akan dideteksi otomatis</span>
        </div>
      </MobileCard>
    </MobileContainer>
  )
}