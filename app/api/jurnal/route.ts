import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { z } from 'zod';

// Internal imports
import { ApiResponseHelper, handleApiError, parseQueryParams } from '@/lib/api/response';
import { createJurnalSchema, updateJurnalSchema, jurnalFilterSchema } from '@/lib/validations/jurnal';
import { prisma, validatePaginationOptions, calculateOffset, calculateTotalPages } from '@/lib/database/config';
import { authOptions } from '@/lib/auth/auth';

// Helper function for session and student validation
async function validateSessionAndGetStudent(allowedRoles: string[] = ['STUDENT']) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw ApiResponseHelper.unauthorized('Anda harus login terlebih dahulu');
  }

  if (!allowedRoles.includes(session.user.role)) {
    throw ApiResponseHelper.forbidden(`Akses ditolak. Peran yang diizinkan: ${allowedRoles.join(', ')}`);
  }

  const student = await prisma.student.findUnique({
    where: { userId: session.user.id },
  });

  if (!student) {
    throw ApiResponseHelper.notFound('Data siswa tidak ditemukan');
  }

  return { session, student };
}

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

// Types
interface JurnalWithRelations {
  id: string
  tanggal: Date
  kegiatan: string
  keterangan: string | null
  dokumentasi: string | null
  studentId: string
  createdAt: Date
  updatedAt: Date
  student: {
    id: string
    nisn: string
    kelas: string
    jurusan: string
    user: {
      id: string
      name: string
      email: string
    }
  }
  comments: Array<{
    id: string
    comment: string
    createdAt: Date
    teacher: {
      user: {
        name: string
      }
    }
  }>
}

// Helper function to validate and parse date
function parseDate(dateString: string): Date {
  // Validate date format (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) {
    throw ApiResponseHelper.validationError({ message: 'Format tanggal harus YYYY-MM-DD' });
  }

  const date = new Date(dateString + 'T00:00:00.000Z');
  if (isNaN(date.getTime())) {
    throw ApiResponseHelper.validationError({ message: 'Tanggal tidak valid' });
  }

  return date;
}

/**
 * GET /api/jurnal
 * Mengambil daftar jurnal dengan pagination dan filter, atau jurnal berdasarkan tanggal
 */
async function handleGetJurnal(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const dateParam = searchParams.get('date');

  // Jika ada parameter date, ambil jurnal berdasarkan tanggal untuk student yang login
  if (dateParam) {
    const { student } = await validateSessionAndGetStudent();
    const targetDate = parseDate(dateParam);

    const jurnal = await prisma.jurnal.findUnique({
      where: {
        studentId_tanggal: {
          studentId: student.id,
          tanggal: targetDate,
        },
      },
      include: jurnalInclude,
    });

    if (!jurnal) {
      return ApiResponseHelper.notFound('Jurnal untuk tanggal ini tidak ditemukan');
    }

    return ApiResponseHelper.success(jurnal, 'Jurnal berhasil ditemukan');
  }

  // Validasi session dan dapatkan student yang login
  const { student } = await validateSessionAndGetStudent();
  
  // Logika existing untuk pagination dan filter
  const { pagination, filters } = parseQueryParams(searchParams);

  const validatedPagination = validatePaginationOptions(pagination);
  const offset = calculateOffset(validatedPagination.page, validatedPagination.limit);

  const validatedFilters = jurnalFilterSchema.parse({
    studentId: filters.studentId,
    startDate: filters.startDate ? new Date(filters.startDate) : undefined,
    endDate: filters.endDate ? new Date(filters.endDate) : undefined,
    search: filters.search,
  });

  // Pastikan hanya jurnal milik siswa yang login yang dikembalikan
  const whereClause: any = {
    studentId: student.id // Filter berdasarkan siswa yang login
  };
  
  // Filter tambahan hanya jika diperlukan (untuk admin/guru bisa menggunakan endpoint terpisah)
  if (validatedFilters.studentId && validatedFilters.studentId !== student.id) {
    // Jika ada filter studentId yang berbeda, kembalikan array kosong
    // karena siswa hanya boleh melihat jurnalnya sendiri
    const emptyPagination = {
      page: validatedPagination.page,
      limit: validatedPagination.limit,
      total: 0,
      totalPages: 0,
      hasNext: false,
      hasPrev: false,
    };
    return ApiResponseHelper.paginated([], emptyPagination, 'Jurnal berhasil diambil');
  }
  if (validatedFilters.startDate || validatedFilters.endDate) {
    whereClause.tanggal = {};
    if (validatedFilters.startDate) whereClause.tanggal.gte = validatedFilters.startDate;
    if (validatedFilters.endDate) whereClause.tanggal.lte = validatedFilters.endDate;
  }
  if (validatedFilters.search) {
    whereClause.OR = [
      { kegiatan: { contains: validatedFilters.search, mode: 'insensitive' } },
      { keterangan: { contains: validatedFilters.search, mode: 'insensitive' } },
      { student: { user: { name: { contains: validatedFilters.search, mode: 'insensitive' } } } },
    ];
  }

  const orderBy: any = validatedPagination.sortBy
    ? { [validatedPagination.sortBy]: validatedPagination.sortOrder }
    : { tanggal: 'desc' };

  const [jurnals, totalCount] = await Promise.all([
    prisma.jurnal.findMany({
      where: whereClause,
      include: jurnalInclude,
      orderBy,
      skip: offset,
      take: validatedPagination.limit,
    }),
    prisma.jurnal.count({ where: whereClause }),
  ]);

  const totalPages = calculateTotalPages(totalCount, validatedPagination.limit);
  const paginationMeta = {
    page: validatedPagination.page,
    limit: validatedPagination.limit,
    total: totalCount,
    totalPages,
    hasNext: validatedPagination.page < totalPages,
    hasPrev: validatedPagination.page > 1,
  };

  return ApiResponseHelper.paginated(jurnals, paginationMeta, 'Daftar jurnal berhasil diambil');
}

export async function GET(request: NextRequest) {
  try {
    return await handleGetJurnal(request);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/jurnal
 * Membuat jurnal baru (menggunakan session untuk mendapatkan studentId)
 */
async function handlePostJurnal(request: NextRequest) {
  const { student } = await validateSessionAndGetStudent();

  const body = await request.json();
  const validatedData = createJurnalSchema.parse({
    ...body,
    tanggal: new Date(body.tanggal),
    studentId: student.id
  });

  const existingJurnal = await prisma.jurnal.findUnique({
    where: {
      studentId_tanggal: {
        studentId: student.id,
        tanggal: validatedData.tanggal,
      },
    },
  });

  if (existingJurnal) {
    return ApiResponseHelper.conflict('Jurnal untuk tanggal ini sudah ada.');
  }

  const newJurnal = await prisma.jurnal.create({
    data: { ...validatedData, studentId: student.id },
    include: jurnalInclude,
  });

  return ApiResponseHelper.success(newJurnal, 'Jurnal berhasil dibuat', 201);
}

export async function POST(request: NextRequest) {
  try {
    return await handlePostJurnal(request);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/jurnal
 * Update jurnal (batch update atau berdasarkan tanggal)
 */
async function handlePutJurnal(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const dateParam = searchParams.get('date');
  const body = await request.json();

  // Jika ada parameter date, update jurnal berdasarkan tanggal untuk student yang login
  if (dateParam) {
    const { student } = await validateSessionAndGetStudent();
    const targetDate = parseDate(dateParam);

    // Validasi input menggunakan updateJurnalSchema untuk konsistensi
    const validatedData = updateJurnalSchema.parse({
      ...body,
      tanggal: targetDate,
      studentId: student.id
    });

    // Cek apakah jurnal untuk tanggal ini sudah ada
    const existingJurnal = await prisma.jurnal.findUnique({
      where: {
        studentId_tanggal: {
          studentId: student.id,
          tanggal: targetDate,
        },
      },
    });

    if (!existingJurnal) {
      throw ApiResponseHelper.notFound('Jurnal untuk tanggal ini tidak ditemukan');
    }

    // Update jurnal dengan data yang sudah divalidasi
    const updatedJurnal = await prisma.jurnal.update({
      where: {
        id: existingJurnal.id,
      },
      data: {
        kegiatan: validatedData.kegiatan,
        keterangan: validatedData.keterangan,
        dokumentasi: validatedData.dokumentasi,
      },
      include: jurnalInclude,
    });

    return ApiResponseHelper.success(updatedJurnal, 'Jurnal berhasil diperbarui');
  }

  // Logika existing untuk batch update
  if (!Array.isArray(body)) {
    return ApiResponseHelper.validationError({ message: 'Body harus berupa array' });
  }

  const updateSchema = z.object({
    id: z.string().min(1),
    tanggal: z.date().optional(),
    kegiatan: z.string().min(10).max(1000).optional(),
    keterangan: z.string().max(500).optional(),
    dokumentasi: z.string().url('Dokumentasi harus berupa URL yang valid').max(500, 'Dokumentasi maksimal 500 karakter').optional().nullable(),
  });

  const validatedUpdates = z.array(updateSchema).parse(body.map(item => ({
    ...item,
    tanggal: item.tanggal ? new Date(item.tanggal) : undefined,
  })));

  const updatedJurnals = await prisma.$transaction(
    validatedUpdates.map(update =>
      prisma.jurnal.update({
        where: { id: update.id },
        data: update,
        include: jurnalInclude,
      })
    )
  );

  return ApiResponseHelper.success(updatedJurnals, `${updatedJurnals.length} jurnal berhasil diperbarui`);
}

export async function PUT(request: NextRequest) {
  try {
    return await handlePutJurnal(request);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/jurnal
 * Delete jurnal (batch delete atau berdasarkan tanggal)
 */
async function handleDeleteJurnal(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const dateParam = searchParams.get('date');
  const idsParam = searchParams.get('ids');

  // Jika ada parameter date, hapus jurnal berdasarkan tanggal untuk student yang login
  if (dateParam) {
    const { student } = await validateSessionAndGetStudent();
    const targetDate = parseDate(dateParam);

    // Cek apakah jurnal untuk tanggal ini sudah ada
    const existingJurnal = await prisma.jurnal.findUnique({
      where: {
        studentId_tanggal: {
          studentId: student.id,
          tanggal: targetDate,
        },
      },
    });

    if (!existingJurnal) {
      throw ApiResponseHelper.notFound('Jurnal untuk tanggal ini tidak ditemukan');
    }

    // Hapus jurnal
    await prisma.jurnal.delete({
      where: {
        id: existingJurnal.id,
      },
    });

    return ApiResponseHelper.success(null, 'Jurnal berhasil dihapus');
  }

  // Logika existing untuk batch delete
  if (!idsParam) {
    return ApiResponseHelper.validationError({ message: 'Parameter ids diperlukan' });
  }

  const ids = idsParam.split(',').map(id => id.trim()).filter(Boolean);
  if (ids.length === 0) {
    return ApiResponseHelper.validationError({ message: 'Minimal satu ID diperlukan' });
  }

  const count = await prisma.jurnal.count({ where: { id: { in: ids } } });
  if (count !== ids.length) {
    return ApiResponseHelper.notFound('Beberapa jurnal tidak ditemukan.');
  }

  const { count: deletedCount } = await prisma.jurnal.deleteMany({
    where: { id: { in: ids } },
  });

  return ApiResponseHelper.success({ deletedCount }, `${deletedCount} jurnal berhasil dihapus`);
}

export async function DELETE(request: NextRequest) {
  try {
    return await handleDeleteJurnal(request);
  } catch (error) {
    return handleApiError(error);
  }
}

// Note: Prisma connection cleanup is handled in @/lib/database/config