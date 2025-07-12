import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/database';
import { ApiResponseHelper, handleApiError } from '@/lib/api';
import { withAuth } from '@/lib/api/middleware';
import { waktuAbsensiSettingSchema } from '@/lib/validations/waktuAbsensiSetting';
import { Role } from '@prisma/client';
import { invalidateGlobalWaktuAbsensiCache } from '@/lib/cache/waktuAbsensi';
import { convertTimeToDbFormat } from '@/lib/utils/absensi';

/**
 * GET /api/admin/waktu-absensi
 * Mendapatkan pengaturan waktu absensi global
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return ApiResponseHelper.unauthorized('Hanya admin yang dapat mengakses pengaturan waktu absensi');
    }

    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get('isActive');
    
    // Build where clause
    const where: any = {};
    if (isActive !== null) {
      where.isActive = isActive === 'true';
    }

    const settings = await prisma.waktuAbsensiSetting.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('API GET /waktu-absensi returning:', settings);

    return ApiResponseHelper.success(settings);
  } catch (error) {
    console.error('Error fetching waktu absensi settings:', error);
    return ApiResponseHelper.internalError('Gagal mengambil pengaturan waktu absensi');
  }
}

/**
 * POST /api/admin/waktu-absensi
 * Membuat pengaturan waktu absensi global baru
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return ApiResponseHelper.unauthorized('Hanya admin yang dapat membuat pengaturan waktu absensi');
    }

    const body = await request.json();
    
    // Validate input
    const validationResult = waktuAbsensiSettingSchema.safeParse(body);
    if (!validationResult.success) {
      return ApiResponseHelper.validationError(
        validationResult.error.flatten().fieldErrors,
        'Data tidak valid'
      );
    }

    const { jamMasukMulai, jamMasukSelesai, jamPulangMulai, jamPulangSelesai, isActive } = validationResult.data;

    // Check if global setting already exists
    const existingSetting = await prisma.waktuAbsensiSetting.findFirst();

    if (existingSetting) {
      return ApiResponseHelper.conflict('Pengaturan waktu absensi global sudah ada. Gunakan endpoint update untuk mengubah pengaturan.');
    }

    // Create new global setting
    const newSetting = await prisma.waktuAbsensiSetting.create({
      data: {

        jamMasukMulai: convertTimeToDbFormat(jamMasukMulai),
        jamMasukSelesai: convertTimeToDbFormat(jamMasukSelesai),
        jamPulangMulai: convertTimeToDbFormat(jamPulangMulai),
        jamPulangSelesai: convertTimeToDbFormat(jamPulangSelesai),
        isActive
      }
    });

    // Invalidate cache
    invalidateGlobalWaktuAbsensiCache();

    return ApiResponseHelper.success(
      newSetting,
      'Pengaturan waktu absensi global berhasil dibuat',
      201
    );
  } catch (error) {
    console.error('Error creating waktu absensi setting:', error);
    return ApiResponseHelper.internalError('Gagal membuat pengaturan waktu absensi');
  }
}