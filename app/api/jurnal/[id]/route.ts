import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { z } from 'zod'

// Internal imports
import { ApiResponseHelper, handleApiError } from '@/lib/api/response'
import { authOptions } from '@/lib/auth/auth'
import { prisma } from '@/lib/database/config'

// Validation schemas
const updateJurnalSchema = z.object({
  kegiatan: z.string().min(10, 'Kegiatan minimal 10 karakter').max(1000, 'Kegiatan maksimal 1000 karakter'),
  dokumentasi: z.string().max(500, 'Dokumentasi maksimal 500 karakter').optional(),
});

// Reusable include object for Jurnal
const jurnalInclude = {
  student: {
    select: {
      id: true,
      nisn: true,
      kelas: true,
      jurusan: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  },
  comments: {
    select: {
      id: true,
      comment: true,
      createdAt: true,
      teacher: {
        select: {
          user: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc' as const,
    },
  },
};

// Helper function to validate session and get student data
async function validateSessionAndGetStudent() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw ApiResponseHelper.unauthorized('Anda harus login terlebih dahulu');
  }
  if (session.user.role !== 'STUDENT') {
    throw ApiResponseHelper.forbidden('Hanya siswa yang dapat melakukan aksi ini');
  }

  const student = await prisma.student.findUnique({
    where: { userId: session.user.id },
  });

  if (!student) {
    throw ApiResponseHelper.notFound('Data siswa tidak ditemukan');
  }

  return { session, student };
}

/**
 * GET /api/jurnal/[id]
 * Mengambil jurnal berdasarkan tanggal dan studentId dari session
 */
async function handleGetJurnal(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { student } = await validateSessionAndGetStudent();
  const { id } = await params;

  const jurnal = await prisma.jurnal.findUnique({
    where: {
      id: id,
      studentId: student.id, // Ensure the journal belongs to the logged-in student
    },
    include: jurnalInclude,
  });

  if (!jurnal) {
    return ApiResponseHelper.notFound('Jurnal tidak ditemukan atau Anda tidak memiliki akses');
  }

  return ApiResponseHelper.success(jurnal, 'Jurnal berhasil ditemukan');
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    return await handleGetJurnal(request, { params });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/jurnal/[id]
 * Update jurnal berdasarkan tanggal dan studentId dari session
 */
async function handlePutJurnal(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { student } = await validateSessionAndGetStudent();
  const { id } = await params;
  const body = await request.json();
  const validatedData = updateJurnalSchema.parse(body);

  // Verify that the journal exists and belongs to the student
  const existingJurnal = await prisma.jurnal.findFirst({
    where: {
      id: id,
      studentId: student.id,
    },
  });

  if (!existingJurnal) {
    return ApiResponseHelper.notFound('Jurnal tidak ditemukan atau Anda tidak memiliki akses');
  }

  const updatedJurnal = await prisma.jurnal.update({
    where: { id: id },
    data: {
      kegiatan: validatedData.kegiatan,
      dokumentasi: validatedData.dokumentasi || null,
    },
    include: jurnalInclude,
  });

  return ApiResponseHelper.success(updatedJurnal, 'Jurnal berhasil diperbarui');
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    return await handlePutJurnal(request, { params });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/jurnal/[id]
 * Hapus jurnal berdasarkan tanggal dan studentId dari session
 */
async function handleDeleteJurnal(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { student } = await validateSessionAndGetStudent();
  const { id } = await params;

  // Verify that the journal exists and belongs to the student
  const existingJurnal = await prisma.jurnal.findFirst({
    where: {
      id: id,
      studentId: student.id,
    },
  });

  if (!existingJurnal) {
    return ApiResponseHelper.notFound('Jurnal tidak ditemukan atau Anda tidak memiliki akses');
  }

  await prisma.jurnal.delete({
    where: { id: id },
  });

  return ApiResponseHelper.success(null, 'Jurnal berhasil dihapus');
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    return await handleDeleteJurnal(request, { params });
  } catch (error) {
    return handleApiError(error);
  }
}