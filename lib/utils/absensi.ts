import { CheckCircle, XCircle } from 'lucide-react'
import type { AbsensiPeriod } from '@/types/features/absensi'

/**
 * Menentukan periode absensi berdasarkan waktu saat ini
 * 
 * @param currentTime - Waktu saat ini (opsional, default: new Date())
 * @returns Object dengan informasi periode absensi
 */
export function getCurrentPeriod(currentTime: Date = new Date()): AbsensiPeriod {
  const hour = currentTime.getHours()
  const minute = currentTime.getMinutes()
  const time = hour + minute / 60

  if (time >= 7 && time <= 10) {
    return {
      type: 'MASUK',
      label: 'Waktu Absen Masuk',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      icon: CheckCircle
    }
  } else if (time >= 13 && time <= 17) {
    return {
      type: 'PULANG',
      label: 'Waktu Absen Pulang',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      icon: CheckCircle
    }
  } else {
    return {
      type: 'TUTUP',
      label: 'Di Luar Jam Absensi',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      icon: XCircle
    }
  }
}

/**
 * Format waktu untuk tampilan UI
 * 
 * @param date - Date object yang akan diformat
 * @param options - Opsi formatting
 * @returns String waktu yang telah diformat
 */
export function formatTime(date: Date, options: {
  includeSeconds?: boolean
  locale?: string
} = {}): string {
  const { includeSeconds = false, locale = 'id-ID' } = options
  
  return date.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
    ...(includeSeconds && { second: '2-digit' })
  })
}

/**
 * Format tanggal untuk tampilan UI
 * 
 * @param date - Date object yang akan diformat
 * @param options - Opsi formatting
 * @returns String tanggal yang telah diformat
 */
export function formatDate(date: Date, options: {
  includeWeekday?: boolean
  locale?: string
} = {}): string {
  const { includeWeekday = false, locale = 'id-ID' } = options
  
  return date.toLocaleDateString(locale, {
    ...(includeWeekday && { weekday: 'short' }),
    day: 'numeric',
    month: 'short'
  })
}

/**
 * Validasi PIN absensi
 * 
 * @param pin - PIN yang akan divalidasi
 * @returns Object dengan hasil validasi
 */
export function validateAbsensiPin(pin: string): {
  isValid: boolean
  error?: string
} {
  if (!pin.trim()) {
    return {
      isValid: false,
      error: 'PIN absensi harus diisi'
    }
  }
  
  if (pin.length < 4) {
    return {
      isValid: false,
      error: 'PIN absensi minimal 4 karakter'
    }
  }
  
  return { isValid: true }
}