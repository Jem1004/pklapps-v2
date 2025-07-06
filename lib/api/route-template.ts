/**
 * API Route Template
 * 
 * This template demonstrates how to create standardized API routes
 * using the new response utilities and middleware.
 * 
 * Copy this template and modify it for your specific endpoints.
 */

import { NextRequest } from 'next/server'
import { z } from 'zod'
import {
  ApiResponseHelper,
  withStandardMiddleware,
  withValidatedMiddleware,
  AuthenticatedRequest,
  ValidatedApiHandler,
  RoleRequirement,
  ERROR_CODES
} from '@/lib/api'
import { prisma } from '@/lib/database'

// 1. Define your validation schemas
const createSchema = z.object({
  tanggal: z.coerce.date(),
  kegiatan: z.string().min(1, 'Kegiatan is required'),
  keterangan: z.string().optional(),
  dokumentasi: z.string().optional()
})

const updateSchema = z.object({
  tanggal: z.coerce.date().optional(),
  kegiatan: z.string().min(1, 'Kegiatan is required').optional(),
  keterangan: z.string().optional(),
  dokumentasi: z.string().optional()
})

const querySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 10),
  search: z.string().optional()
})

type CreateData = z.infer<typeof createSchema>
type UpdateData = z.infer<typeof updateSchema>
type QueryData = z.infer<typeof querySchema>

// 2. Define your handlers
async function handleGet(request: AuthenticatedRequest, query: QueryData) {
  const { page, limit, search } = query
  
  const where = search ? {
    OR: [
      { kegiatan: { contains: search, mode: 'insensitive' as const } },
      { keterangan: { contains: search, mode: 'insensitive' as const } }
    ]
  } : {}
  
  const [items, total] = await Promise.all([
    prisma.jurnal.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        student: {
          select: {
            user: {
              select: { name: true }
            }
          }
        }
      }
    }),
    prisma.jurnal.count({ where })
  ])
  
  const totalPages = Math.ceil(total / limit)
  
  return ApiResponseHelper.paginated(
    items,
    {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  )
}

const handlePost: ValidatedApiHandler<CreateData> = async (
  request: AuthenticatedRequest,
  data: CreateData
) => {
  // Pastikan user adalah student
  if (!request.student) {
    return ApiResponseHelper.forbidden('Only students can create jurnal entries')
  }
  
  const item = await prisma.jurnal.create({
    data: {
      ...data,
      studentId: request.student.id
    },
    include: {
      student: {
        select: {
          user: {
            select: { name: true }
          }
        }
      }
    }
  })
  
  return ApiResponseHelper.success(item, 'Jurnal created successfully', 201)
}

const handlePut: ValidatedApiHandler<UpdateData> = async (
  request: AuthenticatedRequest,
  data: UpdateData
) => {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  
  if (!id) {
    return ApiResponseHelper.error(ERROR_CODES.VALIDATION_ERROR, 'ID is required', 400)
  }
  
  // Check if item exists
  const existingItem = await prisma.jurnal.findUnique({
    where: { id },
    include: {
      student: true
    }
  })
  
  if (!existingItem) {
    return ApiResponseHelper.notFound('Jurnal not found')
  }
  
  // Check ownership (if needed)
  if (request.user.role !== 'ADMIN' && request.student && existingItem.studentId !== request.student.id) {
    return ApiResponseHelper.forbidden('You can only update your own jurnal entries')
  }
  
  const updatedItem = await prisma.jurnal.update({
    where: { id },
    data: {
      ...data,
      updatedAt: new Date()
    },
    include: {
      student: {
        select: {
          user: {
            select: { name: true }
          }
        }
      }
    }
  })
  
  return ApiResponseHelper.success(updatedItem, 'Jurnal updated successfully')
}

async function handleDelete(request: AuthenticatedRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  
  if (!id) {
    return ApiResponseHelper.error(ERROR_CODES.VALIDATION_ERROR, 'ID is required', 400)
  }
  
  // Check if item exists
  const existingItem = await prisma.jurnal.findUnique({
    where: { id },
    include: {
      student: true
    }
  })
  
  if (!existingItem) {
    return ApiResponseHelper.notFound('Jurnal not found')
  }
  
  // Check ownership (if needed)
  if (request.user.role !== 'ADMIN' && request.student && existingItem.studentId !== request.student.id) {
    return ApiResponseHelper.forbidden('You can only delete your own jurnal entries')
  }
  
  await prisma.jurnal.delete({
    where: { id }
  })
  
  return ApiResponseHelper.success(null, 'Jurnal deleted successfully')
}

// 3. Export your route handlers with middleware

// GET - List items with pagination and search
export const GET = withStandardMiddleware('ANY')(
  async (request: AuthenticatedRequest) => {
    const { searchParams } = new URL(request.url)
    const queryObject: Record<string, any> = {}
    
    for (const [key, value] of searchParams.entries()) {
      queryObject[key] = value
    }
    
    const validatedQuery = querySchema.parse(queryObject)
    return await handleGet(request, validatedQuery)
  }
)

// POST - Create new item
export const POST = withValidatedMiddleware(
  createSchema,
  'SISWA' // Only students can create jurnal entries
)(
  handlePost
)

// PUT - Update existing item
export const PUT = withValidatedMiddleware(
  updateSchema,
  'ANY' // Students can update their own, teachers and admins can update any
)(
  handlePut
)

// DELETE - Delete item
export const DELETE = withStandardMiddleware('ANY')( // Change role as needed
  handleDelete
)

/**
 * Usage Examples:
 * 
 * 1. Simple GET with authentication:
 * export const GET = withStandardMiddleware('ADMIN')(handleGet)
 * 
 * 2. POST with validation and role requirement:
 * export const POST = withValidatedMiddleware(createSchema, 'ADMIN')(handlePost)
 * 
 * 3. Custom middleware composition:
 * export const POST = composeMiddleware(
 *   withErrorHandling,
 *   withLogging,
 *   (handler) => withRateLimit(50, 60000, handler), // 50 requests per minute
 *   (handler) => withValidation(createSchema, handler),
 *   (handler) => withAuth(handler, 'ADMIN')
 * )(handlePost)
 * 
 * 4. Query validation:
 * export const GET = withStandardMiddleware('ANY')(
 *   withQueryValidation(querySchema, handleGet)
 * )
 */