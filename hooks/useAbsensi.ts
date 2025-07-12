'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { submitAbsensi as submitAbsensiAction, getRecentAbsensi as getRecentAbsensiAction } from '@/app/absensi/actions'
import { TipeAbsensi } from '@prisma/client'
import { getClientTimezone, getCurrentServerTime, syncServerTime } from '@/lib/utils/timezone'
import { withRetry, parseError, AttendanceErrorCode } from '@/lib/errors/attendance'
import { NetworkUtils } from '@/lib/offline/storage'
import type {
  RecentAbsensi,
  AbsensiSubmitResult,
  UseAbsensiReturn,
  UseAbsensiOptions
} from '@/types/features/absensi'

/**
 * Custom hook untuk mengelola state dan operasi absensi
 * 
 * @param options - Konfigurasi opsional untuk hook
 * @returns Object dengan state dan fungsi untuk operasi absensi
 */
export function useAbsensi(options: UseAbsensiOptions = {}): UseAbsensiReturn {
  const {
    autoLoad = true,
    onSubmitSuccess,
    onSubmitError,
    onLoadError
  } = options

  const { data: session } = useSession()
  
  // State management
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [recentAbsensi, setRecentAbsensi] = useState<RecentAbsensi[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [hasTempatPkl, setHasTempatPkl] = useState(true)

  /**
   * Transform data dari API ke format yang digunakan di UI
   */
  const transformAbsensiData = useCallback((data: any[]): RecentAbsensi[] => {
    return data.map(item => ({
      id: item.id,
      tanggal: item.tanggal,
      waktu: item.waktuMasuk || item.waktuPulang || new Date(),
      tipe: item.tipe,
      tempatPkl: {
        nama: item.tempatPkl.nama,
        alamat: item.tempatPkl.alamat
      }
    }))
  }, [])

  /**
   * Load data absensi terbaru dari server
   */
  const loadRecentAbsensi = useCallback(async (): Promise<void> => {
    try {
      const result = await getRecentAbsensiAction()
      
      if (result.success && result.data) {
        const transformedData = transformAbsensiData(result.data)
        setRecentAbsensi(transformedData)
        setHasTempatPkl(result.hasTempatPkl ?? true)
      } else {
        const errorMessage = result.message || 'Gagal memuat data absensi'
        console.error('Error loading recent absensi:', errorMessage)
        onLoadError?.(errorMessage)
      }
    } catch (error) {
      const errorMessage = 'Terjadi kesalahan saat memuat data absensi'
      console.error('Error loading recent absensi:', error)
      onLoadError?.(errorMessage)
    }
  }, [transformAbsensiData, onLoadError])

  /**
   * Refresh data absensi dengan loading indicator
   */
  const refreshRecentAbsensi = useCallback(async (): Promise<void> => {
    setIsRefreshing(true)
    try {
      await loadRecentAbsensi()
      toast.success('Data berhasil diperbarui')
    } catch (error) {
      toast.error('Gagal memperbarui data')
    } finally {
      setIsRefreshing(false)
    }
  }, [loadRecentAbsensi])

  /**
   * Submit absensi dengan PIN dan tipe (Enhanced with timezone and retry)
   */
  const submitAbsensi = useCallback(async (pin: string, tipe: TipeAbsensi): Promise<AbsensiSubmitResult> => {
    // Validasi input
    if (!pin.trim()) {
      const error = 'PIN absensi harus diisi'
      onSubmitError?.(error)
      return {
        success: false,
        message: error
      }
    }
    
    if (pin.length < 4) {
      const error = 'PIN absensi minimal 4 karakter'
      onSubmitError?.(error)
      return {
        success: false,
        message: error
      }
    }

    if (!tipe || !['MASUK', 'PULANG'].includes(tipe)) {
      const error = 'Tipe absensi harus dipilih'
      onSubmitError?.(error)
      return {
        success: false,
        message: error
      }
    }
    
    setIsSubmitting(true)
    
    try {
      // Check network connectivity
      const isOnline = await NetworkUtils.checkNetworkStatus()
      if (!isOnline) {
        const error = 'Tidak ada koneksi internet. Pastikan perangkat terhubung ke internet.'
        onSubmitError?.(error)
        return {
          success: false,
          message: error
        }
      }

      // Validate timezone and time
      const clientTimezone = getClientTimezone()
      const clientTime = new Date()
      
      try {
        const syncResult = await syncServerTime(clientTime, clientTimezone)
        if (Math.abs(syncResult.timeDifference) > 300000) { // 5 minutes
          const error = 'Waktu perangkat tidak sinkron dengan server. Periksa pengaturan waktu perangkat.'
          onSubmitError?.(error)
          return {
            success: false,
            message: error
          }
        }
      } catch (error) {
        console.warn('Timezone validation failed, proceeding with submission:', error)
      }
      
      // Create FormData with timezone information
      const formData = new FormData()
      formData.append('pin', pin.toUpperCase())
      formData.append('tipe', tipe)
      formData.append('timezone', clientTimezone)
      formData.append('timestamp', clientTime.toISOString())
      
      // Submit with retry mechanism
      const result = await withRetry(
        () => submitAbsensiAction(formData),
        {
          maxAttempts: 3,
          baseDelay: 1000
        }
      ) as AbsensiSubmitResult
      
      if (result.success) {
        // Refresh data setelah submit berhasil
        await loadRecentAbsensi()
        
        const successMessage = result.message || 'Absensi berhasil dicatat!'
        toast.success(successMessage)
        onSubmitSuccess?.(result)
      } else {
        const errorMessage = result.message || 'Gagal mencatat absensi'
        
        // Handle specific error codes
        if ('code' in result) {
          switch (result.code) {
            case AttendanceErrorCode.PIN_INVALID:
              toast.error('PIN tidak valid. Periksa kembali PIN dari pembimbing PKL.')
              break
            case AttendanceErrorCode.ALREADY_SUBMITTED:
              toast.error('Anda sudah melakukan absensi untuk tipe ini hari ini.')
              break
            case AttendanceErrorCode.OUTSIDE_HOURS:
              toast.error('Absensi hanya dapat dilakukan pada jam yang telah ditentukan.')
              break
            case AttendanceErrorCode.TIMEZONE_MISMATCH:
              toast.error('Waktu perangkat tidak sinkron. Periksa pengaturan waktu perangkat.')
              break
            default:
              toast.error(errorMessage)
          }
        } else {
          toast.error(errorMessage)
        }
        
        onSubmitError?.(errorMessage)
      }
      
      return result
    } catch (error) {
      const parsedError = parseError(error as Error)
      const errorMessage = parsedError.message || 'Terjadi kesalahan saat mencatat absensi'
      
      console.error('Error submitting absensi:', error)
      toast.error(errorMessage)
      onSubmitError?.(errorMessage)
      
      return {
        success: false,
        message: errorMessage
      }
    } finally {
      setIsSubmitting(false)
    }
  }, [loadRecentAbsensi, onSubmitSuccess, onSubmitError])

  // Auto-load data saat hook pertama kali digunakan
  useEffect(() => {
    if (autoLoad && session?.user?.role === 'STUDENT') {
      loadRecentAbsensi()
    }
  }, [autoLoad, session?.user?.role]) // loadRecentAbsensi removed from deps to prevent infinite loop

  return {
    // State
    isSubmitting,
    recentAbsensi,
    isRefreshing,
    hasTempatPkl,
    
    // Actions
    submitAbsensi,
    refreshRecentAbsensi,
    loadRecentAbsensi
  }
}