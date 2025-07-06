# API Response Standardization Guide

This document outlines the standardized API response structure and middleware system implemented for consistent, maintainable, and secure API endpoints.

## Overview

The API standardization includes:
- Consistent response formats
- Centralized error handling
- Authentication and authorization middleware
- Request validation
- Rate limiting
- Logging and monitoring
- Pagination utilities

## Response Structure

### Success Response
```typescript
{
  success: true,
  data: any, // The actual response data
  message?: string, // Optional success message
  meta?: {
    requestId: string,
    timestamp: string,
    version: string
  }
}
```

### Error Response
```typescript
{
  success: false,
  error: {
    code: string, // Error code (e.g., 'VALIDATION_ERROR')
    message: string, // Human-readable error message
    details?: any, // Additional error details
    field?: string // Field name for validation errors
  },
  meta?: {
    requestId: string,
    timestamp: string,
    version: string
  }
}
```

### Paginated Response
```typescript
{
  success: true,
  data: any[], // Array of items
  pagination: {
    page: number,
    limit: number,
    total: number,
    totalPages: number,
    hasNext: boolean,
    hasPrev: boolean
  },
  message?: string,
  meta?: {
    requestId: string,
    timestamp: string,
    version: string
  }
}
```

## Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `VALIDATION_ERROR` | Request validation failed | 400 |
| `AUTHENTICATION_REQUIRED` | User not authenticated | 401 |
| `INSUFFICIENT_PERMISSIONS` | User lacks required permissions | 403 |
| `RESOURCE_NOT_FOUND` | Requested resource not found | 404 |
| `RESOURCE_CONFLICT` | Resource already exists | 409 |
| `RATE_LIMIT_EXCEEDED` | Too many requests | 429 |
| `INTERNAL_SERVER_ERROR` | Unexpected server error | 500 |

## Middleware System

### Authentication Middleware

Automatically handles user authentication and role-based access control.

```typescript
import { withAuth } from '@/lib/api'

// Require any authenticated user
export const GET = withAuth(handler, 'ANY')

// Require specific role
export const POST = withAuth(handler, 'ADMIN')
export const PUT = withAuth(handler, 'ADMIN_OR_GURU')
```

### Validation Middleware

Validates request body using Zod schemas.

```typescript
import { withValidation } from '@/lib/api'
import { createUserSchema } from '@/lib/validations'

export const POST = withValidation(
  createUserSchema,
  async (request, validatedData) => {
    // validatedData is type-safe and validated
    return ApiResponseHelper.success(validatedData)
  }
)
```

### Combined Middleware

Use pre-configured middleware combinations for common patterns.

```typescript
import { withStandardMiddleware, withValidatedMiddleware } from '@/lib/api'

// Standard middleware (auth + error handling + logging)
export const GET = withStandardMiddleware('ADMIN')(handler)

// Validation + standard middleware
export const POST = withValidatedMiddleware(
  createSchema,
  'ADMIN'
)(handler)
```

## API Response Helpers

### Success Responses

```typescript
import { ApiResponseHelper } from '@/lib/api'

// Simple success
return ApiResponseHelper.success(data, 'Operation completed')

// Created resource
return ApiResponseHelper.created(newResource, 'Resource created')

// Paginated data
return ApiResponseHelper.paginatedSuccess(
  items,
  { page: 1, limit: 10, total: 100 }
)
```

### Error Responses

```typescript
// Bad request
return ApiResponseHelper.badRequest('Invalid input')

// Unauthorized
return ApiResponseHelper.unauthorized('Login required')

// Forbidden
return ApiResponseHelper.forbidden('Access denied')

// Not found
return ApiResponseHelper.notFound('Resource not found')

// Conflict
return ApiResponseHelper.conflict('Resource already exists')

// Validation error
return ApiResponseHelper.validationError(
  zodErrors,
  'Validation failed'
)

// Internal error
return ApiResponseHelper.internalError('Something went wrong')
```

## Creating Standardized API Routes

### Basic Template

```typescript
import {
  ApiResponseHelper,
  withStandardMiddleware,
  withValidatedMiddleware,
  AuthenticatedRequest
} from '@/lib/api'
import { createSchema, updateSchema } from '@/lib/validations'
import { prisma } from '@/lib/database'

// Handler functions
async function handleGet(request: AuthenticatedRequest) {
  const data = await prisma.model.findMany()
  return ApiResponseHelper.success(data)
}

async function handlePost(request: AuthenticatedRequest, validatedData: any) {
  const newItem = await prisma.model.create({ data: validatedData })
  return ApiResponseHelper.created(newItem, 'Item created successfully')
}

// Export route handlers
export const GET = withStandardMiddleware('ANY')(handleGet)
export const POST = withValidatedMiddleware(createSchema, 'ADMIN')(handlePost)
```

### Advanced Example with Pagination

```typescript
async function handleGetWithPagination(request: AuthenticatedRequest) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const search = searchParams.get('search')
  
  const where = search ? {
    name: { contains: search, mode: 'insensitive' as const }
  } : {}
  
  const [items, total] = await Promise.all([
    prisma.model.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.model.count({ where })
  ])
  
  return ApiResponseHelper.paginatedSuccess(
    items,
    { page, limit, total }
  )
}
```

## Role-Based Access Control

### Available Roles
- `ADMIN`: Full system access
- `GURU`: Teacher access (can manage supervised students)
- `SISWA`: Student access (can only access own data)
- `ADMIN_OR_GURU`: Either admin or teacher
- `ANY`: Any authenticated user

### Role Checking in Handlers

```typescript
async function handleUpdate(request: AuthenticatedRequest, data: any) {
  // Check specific permissions
  if (request.user.role === 'SISWA') {
    // Students can only update their own data
    if (data.studentId !== request.student?.id) {
      return ApiResponseHelper.forbidden('Access denied')
    }
  }
  
  // Proceed with update
  const updated = await prisma.model.update({ where: { id }, data })
  return ApiResponseHelper.success(updated)
}
```

## Error Handling

### Automatic Error Handling

The middleware automatically handles:
- Zod validation errors
- Authentication errors
- Database errors
- Unexpected errors

### Custom Error Handling

```typescript
import { AppError } from '@/lib/errors'

// Throw custom errors
throw new AppError('ValidationError', 'Invalid data', { field: 'email' })
throw new AppError('NotFoundError', 'User not found')
throw new AppError('ConflictError', 'Email already exists')
```

## Rate Limiting

```typescript
import { withRateLimit } from '@/lib/api'

// Apply rate limiting (100 requests per 15 minutes)
export const POST = withRateLimit(
  100, // max requests
  15 * 60 * 1000, // window in ms
  handler
)
```

## Logging and Monitoring

All requests are automatically logged with:
- Request ID for tracing
- User information
- Response time
- Error details

### Request Tracing

Each request gets a unique ID that can be used for debugging:

```typescript
async function handler(request: AuthenticatedRequest) {
  console.log(`Processing request ${request.requestId}`)
  // ... handle request
}
```

## Migration Guide

### Before (Old Pattern)

```typescript
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await request.json()
    const validatedData = schema.parse(body)
    
    const result = await prisma.model.create({ data: validatedData })
    
    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
```

### After (New Pattern)

```typescript
async function handlePost(request: AuthenticatedRequest, data: ValidatedData) {
  const result = await prisma.model.create({ data })
  return ApiResponseHelper.created(result, 'Created successfully')
}

export const POST = withValidatedMiddleware(schema, 'ANY')(handlePost)
```

## Best Practices

1. **Always use middleware**: Don't handle auth/validation manually
2. **Use type-safe handlers**: Leverage TypeScript for better DX
3. **Consistent error messages**: Use descriptive, user-friendly messages
4. **Proper HTTP status codes**: Let the helpers handle status codes
5. **Resource ownership**: Always check if users can access/modify resources
6. **Pagination**: Use pagination for list endpoints
7. **Validation**: Validate all inputs with Zod schemas
8. **Logging**: Use request IDs for debugging

## Testing

### Example Test

```typescript
import { testApiHandler } from 'next-test-api-route-handler'
import handler from '@/app/api/example/route'

it('should create resource successfully', async () => {
  await testApiHandler({
    handler,
    test: async ({ fetch }) => {
      const res = await fetch({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Test' })
      })
      
      const data = await res.json()
      
      expect(res.status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.data.name).toBe('Test')
    }
  })
})
```

This standardization ensures consistent, maintainable, and secure API endpoints across the entire application.