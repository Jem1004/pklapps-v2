import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ApiResponseHelper } from '@/lib/api/response';
import { TipeAbsensi } from '@prisma/client';
import { getCachedGlobalWaktuAbsensiSetting } from '@/lib/cache/waktuAbsensi';

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
 * Menentukan periode absensi berdasarkan waktu dan pengaturan global
 */
async function getCurrentPeriodDynamic(
  currentTime: Date = new Date()
): Promise<any> {
  const setting = await getCachedGlobalWaktuAbsensiSetting();
  
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
async function isOutsideWorkingHoursDynamic(
  waktu: Date,
  tipe: TipeAbsensi
): Promise<boolean> {
  const setting = await getCachedGlobalWaktuAbsensiSetting();
  
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

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return ApiResponseHelper.unauthorized('Silakan login terlebih dahulu');
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const tipe = searchParams.get('tipe') as TipeAbsensi;
    
    const currentTime = new Date();

    if (action === 'current-period') {
      const period = await getCurrentPeriodDynamic(currentTime);
      return ApiResponseHelper.success(period, 'Periode absensi berhasil diambil');
    }

    if (action === 'check-working-hours' && tipe) {
      const isOutside = await isOutsideWorkingHoursDynamic(currentTime, tipe);
      return ApiResponseHelper.success(
        { isOutsideWorkingHours: isOutside },
        'Status jam kerja berhasil diperiksa'
      );
    }

    // Default: return both current period and working hours status
    const [period, isOutsideMasuk, isOutsidePulang] = await Promise.all([
      getCurrentPeriodDynamic(currentTime),
      isOutsideWorkingHoursDynamic(currentTime, TipeAbsensi.MASUK),
      isOutsideWorkingHoursDynamic(currentTime, TipeAbsensi.PULANG)
    ]);

    return ApiResponseHelper.success({
      currentPeriod: period,
      isOutsideWorkingHours: {
        masuk: isOutsideMasuk,
        pulang: isOutsidePulang
      }
    }, 'Data waktu absensi berhasil diambil');

  } catch (error) {
    console.error('Error in waktu-absensi API:', error);
    return ApiResponseHelper.internalError('Gagal mengambil data waktu absensi');
  }
}