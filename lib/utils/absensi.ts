import { CheckCircle, XCircle } from 'lucide-react'
import type { AbsensiPeriod } from '@/types/features/absensi'
import type { WaktuAbsensiSetting, DynamicAbsensiPeriod } from '@/types/features/waktuAbsensi'
import { TipeAbsensi } from '@prisma/client'
import { prisma } from '@/lib/database'

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

/**
 * Mendapatkan pengaturan waktu absensi global
 */
export async function getGlobalWaktuAbsensiSetting(): Promise<WaktuAbsensiSetting | null> {
  try {
    const setting = await prisma.waktuAbsensiSetting.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });
    
    return setting;
  } catch (error) {
    console.error('Error fetching global waktu absensi setting:', error);
    return null;
  }
}



/**
 * Menentukan periode absensi berdasarkan waktu dan pengaturan global
 */
export async function getCurrentPeriodDynamic(
  currentTime: Date = new Date()
): Promise<DynamicAbsensiPeriod> {
  const setting = await getGlobalWaktuAbsensiSetting();
  
  // Gunakan default jika tidak ada pengaturan khusus
  const jamMasukMulai = setting?.jamMasukMulai || "07:00:00";
  const jamMasukSelesai = setting?.jamMasukSelesai || "10:00:00";
  const jamPulangMulai = setting?.jamPulangMulai || "13:00:00";
  const jamPulangSelesai = setting?.jamPulangSelesai || "17:00:00";
  
  const currentTimeStr = formatTimeToString(currentTime);
  
  if (isTimeInRange(currentTimeStr, jamMasukMulai, jamMasukSelesai)) {
    return {
      type: 'MASUK',
      label: 'Waktu Absen Masuk',
      timeRange: `${(jamMasukMulai || '').slice(0,5)} - ${(jamMasukSelesai || '').slice(0,5)}`,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      isCustom: !!setting
    };
  }
  
  if (isTimeInRange(currentTimeStr, jamPulangMulai, jamPulangSelesai)) {
    return {
      type: 'PULANG',
      label: 'Waktu Absen Pulang',
      timeRange: `${(jamPulangMulai || '').slice(0,5)} - ${(jamPulangSelesai || '').slice(0,5)}`,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      isCustom: !!setting
    };
  }
  
  return {
    type: 'TUTUP',
    label: 'Di Luar Jam Absensi',
    timeRange: 'Tidak dalam periode absensi',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    isCustom: !!setting
  };
}



/**
 * Validasi apakah waktu absensi sesuai dengan pengaturan global
 */
export async function isOutsideWorkingHoursDynamic(
  waktu: Date,
  tipe: TipeAbsensi
): Promise<boolean> {
  const setting = await getGlobalWaktuAbsensiSetting();
  
  const waktuStr = formatTimeToString(waktu);
  
  if (tipe === TipeAbsensi.MASUK) {
    const jamMulai = setting?.jamMasukMulai || "07:00:00";
    const jamSelesai = setting?.jamMasukSelesai || "10:00:00";
    return !isTimeInRange(waktuStr, jamMulai, jamSelesai);
  } else {
    const jamMulai = setting?.jamPulangMulai || "13:00:00";
    const jamSelesai = setting?.jamPulangSelesai || "17:00:00";
    return !isTimeInRange(waktuStr, jamMulai, jamSelesai);
  }
}



/**
 * Helper function: Format Date ke string waktu dengan timezone server
 */
function formatTimeToString(date: Date): string {
  try {
    // Format waktu menggunakan timezone server (Asia/Makassar)
    const serverTimezone = 'Asia/Makassar';
    const timeString = date.toLocaleTimeString('en-GB', {
      timeZone: serverTimezone,
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    return timeString; // "HH:mm:ss"
  } catch (error) {
    console.error('Error formatting time to string:', error);
    // Fallback ke metode lama jika ada error
    return date.toTimeString().slice(0, 8);
  }
}

/**
 * Helper function: Cek apakah waktu dalam range
 */
function isTimeInRange(currentTime: string, startTime: string, endTime: string): boolean {
  return currentTime >= startTime && currentTime <= endTime;
}

/**
 * Convert time string dari format HH:mm ke HH:mm:ss
 */
export function convertTimeToDbFormat(timeStr: string): string {
  if (timeStr.length === 5) { // HH:mm
    return `${timeStr}:00`; // HH:mm:ss
  }
  return timeStr;
}

/**
 * Convert time string dari format HH:mm:ss ke HH:mm
 */
export function convertTimeToDisplayFormat(timeStr: string): string {
  if (!timeStr) {
    return '';
  }
  if (timeStr.length === 8) { // HH:mm:ss
    return timeStr.slice(0, 5); // HH:mm
  }
  return timeStr;
}

/**
 * Validasi format waktu
 */
export function isValidTimeFormat(timeStr: string): boolean {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(timeStr);
}

/**
 * Validasi urutan waktu (start harus lebih kecil dari end)
 */
export function isValidTimeOrder(startTime: string, endTime: string): boolean {
  return startTime < endTime;
}