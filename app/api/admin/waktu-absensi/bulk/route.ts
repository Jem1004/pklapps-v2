import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ApiResponseHelper } from '@/lib/api';

/**
 * POST /api/admin/waktu-absensi/bulk
 * Bulk operations tidak lagi didukung untuk pengaturan waktu absensi global
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return ApiResponseHelper.unauthorized('Hanya admin yang dapat mengakses endpoint ini');
    }

    return ApiResponseHelper.error(
      'OPERATION_NOT_ALLOWED',
      'Bulk operations tidak lagi didukung. Sistem sekarang menggunakan pengaturan waktu absensi global tunggal. ' +
      'Gunakan endpoint /api/admin/waktu-absensi untuk mengelola pengaturan global.',
      405
    );
  } catch (error) {
    console.error('Error in bulk operation endpoint:', error);
    return ApiResponseHelper.internalError('Gagal memproses permintaan');
  }
}

// Bulk operations tidak lagi diperlukan untuk pengaturan waktu absensi global
// Semua operasi sekarang dilakukan melalui endpoint utama /api/admin/waktu-absensi