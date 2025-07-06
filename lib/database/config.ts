import { z } from 'zod'
import { PrismaClient } from '@prisma/client'

// Environment validation schema
const databaseEnvSchema = z.object({
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_POOL_SIZE: z.string().transform(Number).pipe(z.number().min(1).max(100)).default('10'),
  DATABASE_TIMEOUT: z.string().transform(Number).pipe(z.number().min(1000).max(60000)).default('30000'),
  DATABASE_SSL: z.string().transform(val => val === 'true').default('false')
})

// Validate environment variables
const env = databaseEnvSchema.parse(process.env)

// Database configuration constants
export const DATABASE_CONFIG = {
  // Connection settings
  CONNECTION: {
    URL: env.DATABASE_URL,
    POOL_SIZE: env.DATABASE_POOL_SIZE,
    TIMEOUT: env.DATABASE_TIMEOUT,
    SSL: env.DATABASE_SSL
  },
  
  // Query optimization settings
  QUERY: {
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
    DEFAULT_OFFSET: 0,
    BATCH_SIZE: 1000
  },
  
  // Cache settings
  CACHE: {
    TTL: 300, // 5 minutes in seconds
    MAX_ENTRIES: 1000,
    ENABLED: env.NODE_ENV === 'production'
  },
  
  // Retry settings
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY_MS: 1000,
    BACKOFF_MULTIPLIER: 2
  },
  
  // Logging settings
  LOGGING: {
    ENABLED: env.NODE_ENV !== 'production',
    SLOW_QUERY_THRESHOLD: 1000, // 1 second
    LOG_LEVEL: env.NODE_ENV === 'development' ? 'debug' : 'error'
  }
} as const

// Database connection options for Prisma
export const PRISMA_CONFIG = {
  datasources: {
    db: {
      url: DATABASE_CONFIG.CONNECTION.URL
    }
  },
  log: DATABASE_CONFIG.LOGGING.ENABLED 
    ? ['query', 'info', 'warn', 'error'] as const
    : ['error'] as const,
  errorFormat: 'pretty' as const
} as const

// Type definitions
export interface DatabaseConnectionOptions {
  url: string
  poolSize?: number
  timeout?: number
  ssl?: boolean
}

export interface QueryOptions {
  limit?: number
  offset?: number
  orderBy?: Record<string, 'asc' | 'desc'>
  include?: Record<string, boolean | object>
  select?: Record<string, boolean>
}

export interface PaginationOptions {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// Utility functions
export function validatePaginationOptions(options: Partial<PaginationOptions>): PaginationOptions {
  const page = Math.max(1, options.page || 1)
  const limit = Math.min(
    DATABASE_CONFIG.QUERY.MAX_LIMIT,
    Math.max(1, options.limit || DATABASE_CONFIG.QUERY.DEFAULT_LIMIT)
  )
  
  return {
    page,
    limit,
    sortBy: options.sortBy,
    sortOrder: options.sortOrder || 'desc'
  }
}

export function calculateOffset(page: number, limit: number): number {
  return (page - 1) * limit
}

export function calculateTotalPages(totalCount: number, limit: number): number {
  return Math.ceil(totalCount / limit)
}

// Database health check function
export async function checkDatabaseHealth(): Promise<{
  status: 'healthy' | 'unhealthy'
  latency?: number
  error?: string
}> {
  try {
    const startTime = Date.now()
    
    // Simple database ping - will be implemented with actual Prisma instance
    // This is a placeholder for the actual health check
    const endTime = Date.now()
    const latency = endTime - startTime
    
    return {
      status: 'healthy',
      latency
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown database error'
    }
  }
}

// Prisma client instance with optimized configuration
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ??
  new PrismaClient({
    log: DATABASE_CONFIG.LOGGING.ENABLED 
      ? ['query', 'info', 'warn', 'error']
      : ['error'],
    errorFormat: 'pretty'
  })

if (env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Database utility functions
export async function getDatabaseInfo(): Promise<{
  version: string
  status: 'connected' | 'disconnected'
  latency: number
}> {
  try {
    const startTime = Date.now()
    await prisma.$queryRaw`SELECT 1`
    const latency = Date.now() - startTime
    
    const result = await prisma.$queryRaw<Array<{ version: string }>>`SELECT version()`
    const version = result[0]?.version || 'Unknown'
    
    return {
      version,
      status: 'connected',
      latency
    }
  } catch (error) {
    return {
      version: 'Unknown',
      status: 'disconnected',
      latency: -1
    }
  }
}

// Query timing wrapper
export async function withQueryTiming<T>(
  queryName: string,
  queryFn: () => Promise<T>
): Promise<T> {
  const startTime = Date.now()
  try {
    const result = await queryFn()
    const duration = Date.now() - startTime
    
    if (DATABASE_CONFIG.LOGGING.ENABLED && duration > DATABASE_CONFIG.LOGGING.SLOW_QUERY_THRESHOLD) {
      console.warn(`Slow query detected: ${queryName} took ${duration}ms`)
    }
    
    return result
  } catch (error) {
    const duration = Date.now() - startTime
    console.error(`Query failed: ${queryName} after ${duration}ms`, error)
    throw error
  }
}

// Batch operations helper
export const batchOperations = {
  async batchCreate<T>(
    model: any,
    data: T[],
    batchSize: number = DATABASE_CONFIG.QUERY.BATCH_SIZE
  ) {
    const results = []
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize)
      const batchResult = await model.createMany({
        data: batch,
        skipDuplicates: true
      })
      results.push(batchResult)
    }
    return results
  },
  
  async batchUpdate<T>(
    model: any,
    updates: Array<{ where: any; data: T }>,
    batchSize: number = DATABASE_CONFIG.QUERY.BATCH_SIZE
  ) {
    const results = []
    for (let i = 0; i < updates.length; i += batchSize) {
      const batch = updates.slice(i, i + batchSize)
      const promises = batch.map(({ where, data }) => 
        model.update({ where, data })
      )
      const batchResult = await Promise.all(promises)
      results.push(...batchResult)
    }
    return results
  }
}

// Database cleanup function
export async function databaseCleanup(): Promise<void> {
  try {
    await prisma.$disconnect()
    console.log('Database connection closed successfully')
  } catch (error) {
    console.error('Error during database cleanup:', error)
  }
}

// Graceful shutdown handler
process.on('beforeExit', async () => {
  await databaseCleanup()
})

process.on('SIGINT', async () => {
  await databaseCleanup()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  await databaseCleanup()
  process.exit(0)
})

// Export environment for use in other modules
export { env as databaseEnv }

// Export types
export type DatabaseConfig = typeof DATABASE_CONFIG
export type PrismaConfig = typeof PRISMA_CONFIG
export type DatabaseEnv = z.infer<typeof databaseEnvSchema>