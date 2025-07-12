import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/database';
import { waktuAbsensiSettingUpdateSchema } from '@/lib/validations/waktuAbsensiSetting';
import { invalidateGlobalWaktuAbsensiCache } from '@/lib/cache/waktuAbsensi';
import { convertTimeToDbFormat } from '@/lib/utils/absensi';
import { ApiResponseHelper } from '@/lib/api';
import { TransactionError } from '@/lib/errors';

/**
 * PUT /api/admin/waktu-absensi/[id]
 * Update pengaturan waktu absensi dengan optimistic locking
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return ApiResponseHelper.unauthorized('Hanya admin yang dapat mengupdate pengaturan waktu absensi');
    }

    const { id } = await params;
    const body = await request.json();
    
    // Validate input
    const validationResult = waktuAbsensiSettingUpdateSchema.safeParse({
      id,
      ...body
    });
    
    if (!validationResult.success) {
      return ApiResponseHelper.validationError(
        validationResult.error.flatten().fieldErrors,
        'Data tidak valid'
      );
    }

    const { version, jamMasukMulai, jamMasukSelesai, jamPulangMulai, jamPulangSelesai, isActive } = validationResult.data;

    // Get current setting for optimistic locking
    const currentSetting = await prisma.waktuAbsensiSetting.findUnique({
      where: { id }
    });

    if (!currentSetting) {
      return ApiResponseHelper.notFound('Pengaturan waktu absensi tidak ditemukan');
    }

    // Check version for optimistic locking
    if (currentSetting.version !== version) {
      return ApiResponseHelper.conflict(
        'Data telah diubah oleh pengguna lain. Silakan refresh dan coba lagi.'
      );
    }

    // Prepare update data
    const updateData: any = {
      version: currentSetting.version + 1
    };

    if (jamMasukMulai !== undefined) {
      updateData.jamMasukMulai = convertTimeToDbFormat(jamMasukMulai);
    }
    if (jamMasukSelesai !== undefined) {
      updateData.jamMasukSelesai = convertTimeToDbFormat(jamMasukSelesai);
    }
    if (jamPulangMulai !== undefined) {
      updateData.jamPulangMulai = convertTimeToDbFormat(jamPulangMulai);
    }
    if (jamPulangSelesai !== undefined) {
      updateData.jamPulangSelesai = convertTimeToDbFormat(jamPulangSelesai);
    }
    if (isActive !== undefined) {
      updateData.isActive = isActive;
    }

    // Update with transaction for consistency
    const updatedSetting = await prisma.$transaction(async (tx) => {
      // Double-check version in transaction
      const latestSetting = await tx.waktuAbsensiSetting.findUnique({
        where: { id },
        select: { version: true }
      });

      if (!latestSetting || latestSetting.version !== version) {
        throw new TransactionError(
          'OPTIMISTIC_LOCK_ERROR',
          'Data telah diubah oleh pengguna lain'
        );
      }

      // Perform update
      return await tx.waktuAbsensiSetting.update({
        where: { id },
        data: updateData
      });
    });

    // Invalidate cache
    invalidateGlobalWaktuAbsensiCache();

    return ApiResponseHelper.success(
      updatedSetting,
      'Pengaturan waktu absensi berhasil diupdate'
    );
  } catch (error) {
    console.error('Error updating waktu absensi setting:', error);
    
    if (error instanceof TransactionError && error.name === 'OptimisticLockError') {
      return ApiResponseHelper.conflict(error.message);
    }
    
    return ApiResponseHelper.internalError('Gagal mengupdate pengaturan waktu absensi');
  }
}

/**
 * DELETE /api/admin/waktu-absensi/[id]
 * Hapus pengaturan waktu absensi
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return ApiResponseHelper.unauthorized('Hanya admin yang dapat menghapus pengaturan waktu absensi');
    }

    const { id } = await params;

    // Check if setting exists
    const setting = await prisma.waktuAbsensiSetting.findUnique({
      where: { id }
    });

    if (!setting) {
      return ApiResponseHelper.notFound('Pengaturan waktu absensi tidak ditemukan');
    }

    // Delete setting
    await prisma.waktuAbsensiSetting.delete({
      where: { id }
    });

    // Invalidate cache
    invalidateGlobalWaktuAbsensiCache();

    return ApiResponseHelper.success(
      null,
      'Pengaturan waktu absensi berhasil dihapus'
    );
  } catch (error) {
    console.error('Error deleting waktu absensi setting:', error);
    return ApiResponseHelper.internalError('Gagal menghapus pengaturan waktu absensi');
  }
}

/**
 * GET /api/admin/waktu-absensi/[id]
 * Mendapatkan pengaturan waktu absensi berdasarkan ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return ApiResponseHelper.unauthorized('Hanya admin yang dapat mengakses pengaturan waktu absensi');
    }

    const { id } = await params;

    const setting = await prisma.waktuAbsensiSetting.findUnique({
      where: { id }
    });

    if (!setting) {
      return ApiResponseHelper.notFound('Pengaturan waktu absensi tidak ditemukan');
    }

    return ApiResponseHelper.success(setting);
  } catch (error) {
    console.error('Error fetching waktu absensi setting:', error);
    return ApiResponseHelper.internalError('Gagal mengambil pengaturan waktu absensi');
  }
}