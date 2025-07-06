import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { AppError } from '@/lib/errors'

// Standard API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  meta?: {
    timestamp: string
    requestId?: string
    pagination?: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
}

export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

// Error Codes
export const ERROR_CODES = {
  // Authentication & Authorization
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  
  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  
  // Resource
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  CONFLICT: 'CONFLICT',
  
  // Business Logic
  BUSINESS_RULE_VIOLATION: 'BUSINESS_RULE_VIOLATION',
  OPERATION_NOT_ALLOWED: 'OPERATION_NOT_ALLOWED',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  
  // System
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED'
} as const

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES]

// Success Response Builder
export function createSuccessResponse<T>(
  data?: T,
  message?: string,
  meta?: Partial<ApiResponse['meta']>
): ApiResponse<T> {
  return {
    success: true,
    message,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      ...meta
    }
  }
}

// Error Response Builder
export function createErrorResponse(
  code: ErrorCode,
  message: string,
  details?: any,
  meta?: Partial<ApiResponse['meta']>
): ApiResponse {
  return {
    success: false,
    error: {
      code,
      message,
      details
    },
    meta: {
      timestamp: new Date().toISOString(),
      ...meta
    }
  }
}

// Paginated Response Builder
export function createPaginatedResponse<T>(
  data: T[],
  pagination: PaginationMeta,
  message?: string
): ApiResponse<T[]> {
  return {
    success: true,
    message,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      pagination
    }
  }
}

// NextResponse Helpers
export class ApiResponseHelper {
  static success<T>(
    data?: T,
    message?: string,
    status: number = 200,
    meta?: Partial<ApiResponse['meta']>
  ): NextResponse {
    return NextResponse.json(
      createSuccessResponse(data, message, meta),
      { status }
    )
  }

  static error(
    code: ErrorCode,
    message: string,
    status: number = 500,
    details?: any,
    meta?: Partial<ApiResponse['meta']>
  ): NextResponse {
    return NextResponse.json(
      createErrorResponse(code, message, details, meta),
      { status }
    )
  }

  static paginated<T>(
    data: T[],
    pagination: PaginationMeta,
    message?: string,
    status: number = 200
  ): NextResponse {
    return NextResponse.json(
      createPaginatedResponse(data, pagination, message),
      { status }
    )
  }

  // Common Error Responses
  static unauthorized(message: string = 'Unauthorized access'): NextResponse {
    return this.error(ERROR_CODES.UNAUTHORIZED, message, 401)
  }

  static forbidden(message: string = 'Access forbidden'): NextResponse {
    return this.error(ERROR_CODES.FORBIDDEN, message, 403)
  }

  static notFound(message: string = 'Resource not found'): NextResponse {
    return this.error(ERROR_CODES.NOT_FOUND, message, 404)
  }

  static conflict(message: string = 'Resource conflict'): NextResponse {
    return this.error(ERROR_CODES.CONFLICT, message, 409)
  }

  static validationError(details: any, message: string = 'Validation failed'): NextResponse {
    return this.error(ERROR_CODES.VALIDATION_ERROR, message, 400, details)
  }

  static internalError(message: string = 'Internal server error'): NextResponse {
    return this.error(ERROR_CODES.INTERNAL_SERVER_ERROR, message, 500)
  }

  static businessRuleViolation(message: string): NextResponse {
    return this.error(ERROR_CODES.BUSINESS_RULE_VIOLATION, message, 422)
  }
}

// Error Handler Middleware
export function handleApiError(error: unknown): NextResponse {
  console.error('API Error:', error)

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return ApiResponseHelper.validationError(
      error.errors,
      'Invalid input data'
    )
  }

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
    const code = (error as any).code as ErrorCode || ERROR_CODES.INTERNAL_SERVER_ERROR

    return ApiResponseHelper.error(
      code,
      error.message,
      status,
      (error as any).details || undefined
    )
  }

  // Handle generic errors
  if (error instanceof Error) {
    return ApiResponseHelper.internalError(error.message)
  }

  // Handle unknown errors
  return ApiResponseHelper.internalError('An unexpected error occurred')
}

// Pagination Helper
export function calculatePagination(
  page: number = 1,
  limit: number = 10,
  total: number
): PaginationMeta {
  const totalPages = Math.ceil(total / limit)
  const hasNext = page < totalPages
  const hasPrev = page > 1

  return {
    page,
    limit,
    total,
    totalPages,
    hasNext,
    hasPrev
  }
}

// Query Parameter Parser
export function parseQueryParams(searchParams: URLSearchParams): {
  pagination: PaginationParams
  filters: Record<string, any>
} {
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '10', 10)
  const sortBy = searchParams.get('sortBy') || undefined
  const sortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc'

  const pagination: PaginationParams = {
    page: Math.max(1, page),
    limit: Math.min(100, Math.max(1, limit)), // Limit between 1-100
    sortBy,
    sortOrder
  }

  // Extract other parameters as filters
  const filters: Record<string, any> = {}
  for (const [key, value] of searchParams.entries()) {
    if (!['page', 'limit', 'sortBy', 'sortOrder'].includes(key)) {
      filters[key] = value
    }
  }

  return { pagination, filters }
}

// Request ID Generator (for tracing)
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// CORS Headers Helper
export function addCorsHeaders(response: NextResponse): NextResponse {
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  return response
}

export default ApiResponseHelper