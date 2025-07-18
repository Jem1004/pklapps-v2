'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import type { WaktuAbsensiSetting } from '@/types/features/waktuAbsensi'

interface UseWaktuAbsensiReturn {
  currentPeriod: string
  currentPeriodData: {
    type: 'MASUK' | 'PULANG' | 'TUTUP'
    label: string
    timeRange?: string
    color?: string
    bgColor?: string
    borderColor?: string
    isCustom?: boolean
  } | null
  isOutsideWorkingHours: boolean
  waktuAbsensiSetting: WaktuAbsensiSetting | null
  isLoading: boolean
  error: string | null
  refreshWaktuAbsensi: () => Promise<void>
}

/**
 * Custom hook untuk mengelola waktu absensi global
 * 
 * @returns Object dengan state dan fungsi untuk waktu absensi global
 */
export function useWaktuAbsensi(): UseWaktuAbsensiReturn {
  const { data: session } = useSession()
  
  // State management
  const [currentPeriod, setCurrentPeriod] = useState<string>('Belum Dimulai')
  const [currentPeriodData, setCurrentPeriodData] = useState<{
    type: 'MASUK' | 'PULANG' | 'TUTUP'
    label: string
    timeRange?: string
    color?: string
    bgColor?: string
    borderColor?: string
    isCustom?: boolean
  } | null>(null)
  const [isOutsideWorkingHours, setIsOutsideWorkingHours] = useState<boolean>(false)
  const [waktuAbsensiSetting, setWaktuAbsensiSetting] = useState<WaktuAbsensiSetting | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * Load waktu absensi setting dan update periode saat ini
   */
  const loadWaktuAbsensi = useCallback(async (): Promise<void> => {
    if (!session?.user?.id || session.user.role !== 'STUDENT') {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // Fetch current period and working hours status from API
      const response = await fetch('/api/waktu-absensi')
      if (response.ok) {
        const result = await response.json()
        const data = result.data
        
        // Set current period (keep backward compatibility)
        setCurrentPeriod(data.currentPeriod?.label || 'Belum Dimulai')
        
        // Set complete period data for accurate type checking
        setCurrentPeriodData(data.currentPeriod || null)
        
        // Set outside working hours status (use MASUK as default)
        setIsOutsideWorkingHours(data.isOutsideWorkingHours?.masuk || false)
      } else {
        throw new Error('Failed to fetch waktu absensi data')
      }

      // Note: Students don't need access to full admin settings
      // The current period and working hours info is sufficient
      
    } catch (error) {
      console.error('Error loading waktu absensi:', error)
      setError('Gagal memuat pengaturan waktu absensi')
      
      // Fallback ke periode default
      setCurrentPeriod('Belum Dimulai')
      setCurrentPeriodData(null)
      setIsOutsideWorkingHours(false)
    } finally {
      setIsLoading(false)
    }
  }, [session?.user?.id, session?.user?.role])

  /**
   * Refresh waktu absensi data
   */
  const refreshWaktuAbsensi = useCallback(async (): Promise<void> => {
    await loadWaktuAbsensi()
  }, [loadWaktuAbsensi])

  // Auto-load data saat hook pertama kali digunakan
  useEffect(() => {
    if (session?.user?.role === 'STUDENT') {
      loadWaktuAbsensi()
    }
  }, [session?.user?.role, loadWaktuAbsensi])

  // Update periode setiap menit untuk real-time updates
  useEffect(() => {
    if (!session?.user?.id || session.user.role !== 'STUDENT') {
      return
    }

    const interval = setInterval(async () => {
      try {
        // Fetch current period and working hours status from API
        const response = await fetch('/api/waktu-absensi')
        if (response.ok) {
          const result = await response.json()
          const data = result.data
          
          // Set current period (keep backward compatibility)
          setCurrentPeriod(data.currentPeriod?.label || 'Belum Dimulai')
          
          // Set complete period data for accurate type checking
          setCurrentPeriodData(data.currentPeriod || null)
          
          // Set outside working hours status (use MASUK as default)
          setIsOutsideWorkingHours(data.isOutsideWorkingHours?.masuk || false)
        }
      } catch (error) {
        console.error('Error updating waktu absensi:', error)
      }
    }, 30000) // Update setiap 30 detik untuk better consistency

    return () => clearInterval(interval)
  }, [session?.user?.id, session?.user?.role])

  return {
    currentPeriod,
    currentPeriodData,
    isOutsideWorkingHours,
    waktuAbsensiSetting,
    isLoading,
    error,
    refreshWaktuAbsensi
  }
}