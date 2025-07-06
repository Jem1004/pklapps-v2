'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { submitAbsensi as submitAbsensiAction, getRecentAbsensi as getRecentAbsensiAction } from '@/app/absensi/actions'
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
   * Submit absensi dengan PIN
   */
  const submitAbsensi = useCallback(async (pin: string): Promise<AbsensiSubmitResult> => {
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
    
    setIsSubmitting(true)
    
    try {
      const result = await submitAbsensiAction(pin)
      
      if (result.success) {
        // Refresh data setelah submit berhasil
        await loadRecentAbsensi()
        
        const successMessage = result.message || 'Absensi berhasil dicatat!'
        toast.success(successMessage)
        onSubmitSuccess?.(result)
      } else {
        const errorMessage = result.message || 'Gagal mencatat absensi'
        toast.error(errorMessage)
        onSubmitError?.(errorMessage)
      }
      
      return result
    } catch (error) {
      const errorMessage = 'Terjadi kesalahan saat mencatat absensi'
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
  }, [autoLoad, session?.user?.role]) // Hapus loadRecentAbsensi dari dependency untuk mencegah infinite loop

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