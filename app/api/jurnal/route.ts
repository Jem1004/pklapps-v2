import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { z } from 'zod';

// Internal imports
import { ApiResponseHelper, handleApiError, parseQueryParams } from '@/lib/api/response';
import { createJurnalSchema, jurnalFilterSchema } from '@/lib/validations/jurnal';
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

/**
 * GET /api/jurnal
 * Mengambil daftar jurnal dengan pagination dan filter
 */
async function handleGetJurnal(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const { pagination, filters } = parseQueryParams(searchParams);

  const validatedPagination = validatePaginationOptions(pagination);
  const offset = calculateOffset(validatedPagination.page, validatedPagination.limit);

  const validatedFilters = jurnalFilterSchema.parse({
    studentId: filters.studentId,
    startDate: filters.startDate ? new Date(filters.startDate) : undefined,
    endDate: filters.endDate ? new Date(filters.endDate) : undefined,
    search: filters.search,
  });

  const whereClause: any = {};
  if (validatedFilters.studentId) whereClause.studentId = validatedFilters.studentId;
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
 * Update jurnal (batch update)
 */
async function handlePutJurnal(request: NextRequest) {
  const body = await request.json();

  if (!Array.isArray(body)) {
    return ApiResponseHelper.validationError({ message: 'Body harus berupa array' });
  }

  const updateSchema = z.object({
    id: z.string().min(1),
    tanggal: z.date().optional(),
    kegiatan: z.string().min(10).max(1000).optional(),
    keterangan: z.string().max(500).optional(),
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
 * Delete jurnal (batch delete)
 */
async function handleDeleteJurnal(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const idsParam = searchParams.get('ids');

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