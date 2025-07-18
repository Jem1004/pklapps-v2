// Types untuk fitur absensi
import { TipeAbsensi } from '@prisma/client'
import { AttendanceErrorCode } from '@/lib/errors/attendance'

export type AbsensiType = TipeAbsensi

export interface RecentAbsensi {
  id: string
  tanggal: Date
  waktu: Date
  tipe: AbsensiType
  tempatPkl: {
    nama: string
    alamat: string
  }
}

export interface AbsensiSubmitResult {
  success: boolean
  message: string
  code?: AttendanceErrorCode
  retryable?: boolean
  data?: {
    tipe: AbsensiType
    tempatPkl: string
    waktu: Date
  }
}

export interface AbsensiRecentResult {
  success: boolean
  message?: string
  data?: Array<{
    id: string
    tanggal: Date
    waktuMasuk?: Date
    waktuPulang?: Date
    tipe: AbsensiType
    tempatPkl: {
      nama: string
      alamat: string
    }
  }>
  hasTempatPkl?: boolean
}

export interface AbsensiPeriod {
  type: AbsensiType | 'TUTUP'
  label: string
  color: string
  bgColor: string
  borderColor: string
  icon: any // Lucide icon component
}

export interface UseAbsensiReturn {
  // State
  isSubmitting: boolean
  recentAbsensi: RecentAbsensi[]
  isRefreshing: boolean
  hasTempatPkl: boolean
  todayAbsensi: {
    tanggal: string
    waktuMasuk?: string | null
    waktuPulang?: string | null
  } | null
  
  // Actions
  submitAbsensi: (pin: string, tipe: TipeAbsensi) => Promise<AbsensiSubmitResult>
  refreshRecentAbsensi: () => Promise<void>
  loadRecentAbsensi: () => Promise<void>
  loadTodayAbsensi: () => Promise<void>
}

export interface UseAbsensiOptions {
  autoLoad?: boolean
  onSubmitSuccess?: (result: AbsensiSubmitResult) => void
  onSubmitError?: (error: string) => void
  onLoadError?: (error: string) => void
}