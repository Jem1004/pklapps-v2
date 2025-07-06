import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/database'
import { ApiResponseHelper, ERROR_CODES, type ErrorCode, generateRequestId } from './response'
import { ZodSchema } from 'zod'
import { AppError } from '@/lib/errors'
import { Role } from '@prisma/client'

// Types
export interface AuthenticatedRequest extends NextRequest {
  user: {
    id: string
    username: string
    role: Role
    name: string
  }
  student?: {
    id: string
    name: string
    tempatPklId: string | null
  }
  teacher?: {
    id: string
    name: string
  }
  requestId: string
}

export type ApiHandler<T = any> = (
  request: AuthenticatedRequest
) => Promise<Response | T>

export type ValidatedApiHandler<TData = any, TReturn = any> = (
  request: AuthenticatedRequest,
  validatedData: TData
) => Promise<Response | TReturn>

export type RoleRequirement = 'ADMIN' | 'GURU' | 'SISWA' | 'ADMIN_OR_GURU' | 'ANY'

// Authentication Middleware
export function withAuth(
  handler: ApiHandler,
  roleRequirement: RoleRequirement = 'ANY'
): (request: NextRequest) => Promise<Response> {
  return async (request: NextRequest) => {
    try {
      const requestId = generateRequestId()
      
      // Get session
      const session = await getServerSession(authOptions)
      
      if (!session?.user) {
        return ApiResponseHelper.unauthorized('Authentication required')
      }

      // Check role requirements
      const userRole = session.user.role
      const hasPermission = checkRolePermission(userRole, roleRequirement)
      
      if (!hasPermission) {
        return ApiResponseHelper.forbidden(
          `Access denied. Required role: ${roleRequirement}`
        )
      }

      // Extend request with user data
      const authenticatedRequest = request as AuthenticatedRequest
      authenticatedRequest.user = {
        id: session.user.id,
        username: session.user.username,
        role: userRole,
        name: session.user.name
      }
      authenticatedRequest.requestId = requestId

      // Load additional user data based on role
      if (userRole === 'STUDENT') {
        const student = await prisma.student.findUnique({
          where: { userId: session.user.id },
          select: {
            id: true,
            tempatPklId: true,
            user: {
              select: {
                name: true
              }
            }
          }
        })
        
        if (!student) {
          return ApiResponseHelper.notFound('Student data not found')
        }
        
        authenticatedRequest.student = {
          id: student.id,
          name: student.user.name,
          tempatPklId: student.tempatPklId
        }
      } else if (userRole === 'TEACHER') {
        const teacher = await prisma.teacher.findUnique({
          where: { userId: session.user.id },
          select: {
            id: true,
            user: {
              select: {
                name: true
              }
            }
          }
        })
        
        if (!teacher) {
          return ApiResponseHelper.notFound('Teacher data not found')
        }
        
        authenticatedRequest.teacher = {
          id: teacher.id,
          name: teacher.user.name
        }
      }

      return await handler(authenticatedRequest)
    } catch (error) {
      console.error('Auth middleware error:', error)
      return ApiResponseHelper.internalError('Authentication failed')
    }
  }
}

// Validation Middleware
export function withValidation<T>(
  schema: ZodSchema<T>,
  handler: ValidatedApiHandler<T>
) {
  return async (request: AuthenticatedRequest) => {
    try {
      const body = await request.json()
      const validatedData = schema.parse(body)
      return await handler(request, validatedData)
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        return ApiResponseHelper.validationError(
          (error as any).errors,
          'Invalid request data'
        )
      }
      throw error
    }
  }
}

// Query Validation Middleware
export function withQueryValidation<T>(
  schema: ZodSchema<T>,
  handler: ValidatedApiHandler<T>
) {
  return async (request: AuthenticatedRequest) => {
    try {
      const { searchParams } = new URL(request.url)
      const queryObject: Record<string, any> = {}
      
      for (const [key, value] of searchParams.entries()) {
        queryObject[key] = value
      }
      
      const validatedQuery = schema.parse(queryObject)
      return await handler(request, validatedQuery)
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        return ApiResponseHelper.validationError(
          (error as any).errors,
          'Invalid query parameters'
        )
      }
      throw error
    }
  }
}

// Error Handling Middleware
export function withErrorHandling(handler: ApiHandler) {
  return async (request: AuthenticatedRequest) => {
    try {
      const result = await handler(request)
      return result
    } catch (error) {
      console.error(`API Error [${request.requestId}]:`, error)
      
      // Handle custom AppError
      if (error instanceof AppError) {
        const statusMap: Record<string, number> = {
          ValidationError: 400,
          AuthenticationError: 401,
          AuthorizationError: 403,
          NotFoundError: 404,
          ConflictError: 409,
          BusinessLogicError: 422,
          DatabaseError: 500,
          ExternalServiceError: 502
        }
        
        const status = statusMap[error.name] || 500
        
        // Map error types to error codes
        const codeMap: Record<string, string> = {
          VALIDATION: ERROR_CODES.VALIDATION_ERROR,
          AUTHENTICATION: ERROR_CODES.UNAUTHORIZED,
          AUTHORIZATION: ERROR_CODES.FORBIDDEN,
          NOT_FOUND: ERROR_CODES.NOT_FOUND,
          NETWORK: ERROR_CODES.EXTERNAL_SERVICE_ERROR,
          DATABASE: ERROR_CODES.DATABASE_ERROR,
          BUSINESS_LOGIC: ERROR_CODES.BUSINESS_RULE_VIOLATION,
          EXTERNAL_API: ERROR_CODES.EXTERNAL_SERVICE_ERROR
        }
        
        const code = codeMap[error.type] || ERROR_CODES.INTERNAL_SERVER_ERROR
        
        return ApiResponseHelper.error(
          code as ErrorCode,
          error.message,
          status,
          error.context,
          { requestId: request.requestId }
        )
      }
      
      // Handle generic errors
      return ApiResponseHelper.internalError(
        'An unexpected error occurred'
      )
    }
  }
}

// Rate Limiting Middleware (Simple in-memory implementation)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export function withRateLimit(
  maxRequests: number = 100,
  windowMs: number = 15 * 60 * 1000, // 15 minutes
  handler: ApiHandler
) {
  return async (request: AuthenticatedRequest) => {
    const key = `${request.user.id}:${request.url}`
    const now = Date.now()
    
    const current = rateLimitStore.get(key)
    
    if (!current || now > current.resetTime) {
      // Reset or initialize
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs
      })
    } else {
      // Increment count
      current.count++
      
      if (current.count > maxRequests) {
        return ApiResponseHelper.error(
          ERROR_CODES.RATE_LIMIT_EXCEEDED,
          'Rate limit exceeded. Please try again later.',
          429,
          {
            limit: maxRequests,
            windowMs,
            resetTime: current.resetTime
          }
        )
      }
    }
    
    return await handler(request)
  }
}

// Logging Middleware
export function withLogging(handler: ApiHandler) {
  return async (request: AuthenticatedRequest) => {
    const startTime = Date.now()
    
    console.log(`[${request.requestId}] ${request.method} ${request.url} - User: ${request.user.username} (${request.user.role})`)
    
    try {
      const result = await handler(request)
      const duration = Date.now() - startTime
      
      console.log(`[${request.requestId}] Completed in ${duration}ms`)
      
      return result
    } catch (error) {
      const duration = Date.now() - startTime
      
      console.error(`[${request.requestId}] Failed in ${duration}ms:`, error)
      
      throw error
    }
  }
}

// Compose multiple middlewares
export function composeMiddleware(...middlewares: Array<(handler: ApiHandler) => ApiHandler>) {
  return (handler: ApiHandler) => {
    return middlewares.reduceRight((acc, middleware) => middleware(acc), handler)
  }
}

// Common middleware combinations
export const withStandardMiddleware = (roleRequirement: RoleRequirement = 'ANY') => 
  composeMiddleware(
    withErrorHandling,
    withLogging,
    (handler) => withAuth(handler, roleRequirement)
  )

export const withValidatedMiddleware = <T>(
  schema: ZodSchema<T>,
  roleRequirement: RoleRequirement = 'ANY'
) => {
  return (handler: ValidatedApiHandler<T>) => {
    const validatedHandler = withValidation(schema, handler)
    const authHandler = withAuth(validatedHandler, roleRequirement)
    const loggedHandler = withLogging(authHandler)
    return withErrorHandling(loggedHandler)
  }
}

export const withRateLimitedMiddleware = (
  maxRequests: number = 100,
  windowMs: number = 15 * 60 * 1000,
  roleRequirement: RoleRequirement = 'ANY'
) => 
  composeMiddleware(
    withErrorHandling,
    withLogging,
    (handler) => withRateLimit(maxRequests, windowMs, handler),
    (handler) => withAuth(handler, roleRequirement)
  )

// Helper Functions
function checkRolePermission(
  userRole: Role,
  requirement: RoleRequirement
): boolean {
  switch (requirement) {
    case 'ANY':
      return true
    case 'ADMIN':
      return userRole === 'ADMIN'
    case 'GURU':
      return userRole === 'TEACHER'
    case 'SISWA':
      return userRole === 'STUDENT'
    case 'ADMIN_OR_GURU':
      return userRole === 'ADMIN' || userRole === 'TEACHER'
    default:
      return false
  }
}

// Resource ownership validation
export async function validateResourceOwnership(
  request: AuthenticatedRequest,
  resourceType: 'jurnal' | 'absensi',
  resourceId: string
): Promise<boolean> {
  if (request.user.role === 'ADMIN') {
    return true // Admin can access all resources
  }
  
  if (request.user.role === 'STUDENT' && request.student) {
    if (resourceType === 'jurnal') {
      const jurnal = await prisma.jurnal.findFirst({
        where: {
          id: resourceId,
          studentId: request.student.id
        }
      })
      return !!jurnal
    }
    
    if (resourceType === 'absensi') {
      const absensi = await prisma.absensi.findFirst({
        where: {
          id: resourceId,
          studentId: request.student.id
        }
      })
      return !!absensi
    }
  }
  
  if (request.user.role === 'TEACHER' && request.teacher) {
    // Teachers can access resources of their supervised students
    if (resourceType === 'jurnal') {
      const jurnal = await prisma.jurnal.findFirst({
        where: {
          id: resourceId,
          student: {
            teacherId: request.teacher.id
          }
        }
      })
      return !!jurnal
    }
    
    if (resourceType === 'absensi') {
      const absensi = await prisma.absensi.findFirst({
        where: {
          id: resourceId,
          student: {
            teacherId: request.teacher.id
          }
        }
      })
      return !!absensi
    }
  }
  
  return false
}

export default {
  withAuth,
  withValidation,
  withQueryValidation,
  withErrorHandling,
  withRateLimit,
  withLogging,
  composeMiddleware,
  withStandardMiddleware,
  withValidatedMiddleware,
  withRateLimitedMiddleware,
  validateResourceOwnership
}