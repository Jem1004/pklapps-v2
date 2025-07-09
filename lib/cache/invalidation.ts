/**
 * Cache invalidation utilities
 * Handles proper cache invalidation strategies for attendance system
 */

import { revalidatePath, revalidateTag } from 'next/cache'

export interface CacheInvalidationConfig {
  tags: string[]
  paths: string[]
  strategy: 'immediate' | 'delayed' | 'background'
  delay?: number
}

export interface CacheInvalidationResult {
  success: boolean
  invalidatedTags: string[]
  invalidatedPaths: string[]
  errors?: string[]
}

/**
 * Create cache key for specific data type and identifier
 * @param type - Type of data (e.g., 'attendance', 'user', 'session')
 * @param identifier - Unique identifier (e.g., userId, attendanceId)
 * @returns Formatted cache key
 */
export function createCacheKey(type: string, identifier: string): string {
  return `${type}:${identifier}`
}

/**
 * Create cache tags for attendance data
 * @param userId - User ID
 * @param date - Date string (optional)
 * @returns Array of cache tags
 */
export function createAttendanceCacheTags(userId: string, date?: string): string[] {
  const tags = [
    createCacheKey('attendance', userId),
    createCacheKey('user-attendance', userId),
    'attendance-list'
  ]
  
  if (date) {
    tags.push(createCacheKey('attendance-date', date))
    tags.push(createCacheKey('attendance-user-date', `${userId}-${date}`))
  }
  
  return tags
}

/**
 * Create cache tags for user data
 * @param userId - User ID
 * @returns Array of cache tags
 */
export function createUserCacheTags(userId: string): string[] {
  return [
    createCacheKey('user', userId),
    createCacheKey('user-profile', userId),
    'user-list'
  ]
}

/**
 * Invalidate attendance cache for specific user
 * @param userId - User ID
 * @param date - Specific date (optional)
 * @param config - Cache invalidation configuration
 * @returns Promise<CacheInvalidationResult>
 */
export async function invalidateAttendanceCache(
  userId: string,
  date?: string,
  config: Partial<CacheInvalidationConfig> = {}
): Promise<CacheInvalidationResult> {
  const defaultConfig: CacheInvalidationConfig = {
    tags: createAttendanceCacheTags(userId, date),
    paths: [
      '/dashboard/absensi',
      `/dashboard/absensi/${userId}`,
      '/absensi'
    ],
    strategy: 'immediate',
    ...config
  }
  
  return await invalidateCache(defaultConfig)
}

/**
 * Invalidate user cache
 * @param userId - User ID
 * @param config - Cache invalidation configuration
 * @returns Promise<CacheInvalidationResult>
 */
export async function invalidateUserCache(
  userId: string,
  config: Partial<CacheInvalidationConfig> = {}
): Promise<CacheInvalidationResult> {
  const defaultConfig: CacheInvalidationConfig = {
    tags: createUserCacheTags(userId),
    paths: [
      '/dashboard',
      `/dashboard/user/${userId}`,
      '/dashboard/admin/users'
    ],
    strategy: 'immediate',
    ...config
  }
  
  return await invalidateCache(defaultConfig)
}

/**
 * Invalidate cache based on configuration
 * @param config - Cache invalidation configuration
 * @returns Promise<CacheInvalidationResult>
 */
export async function invalidateCache(
  config: CacheInvalidationConfig
): Promise<CacheInvalidationResult> {
  const result: CacheInvalidationResult = {
    success: true,
    invalidatedTags: [],
    invalidatedPaths: [],
    errors: []
  }
  
  try {
    switch (config.strategy) {
      case 'immediate':
        await invalidateImmediate(config, result)
        break
      case 'delayed':
        await invalidateDelayed(config, result)
        break
      case 'background':
        invalidateBackground(config, result)
        break
      default:
        await invalidateImmediate(config, result)
    }
  } catch (error) {
    result.success = false
    result.errors?.push(`Cache invalidation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
  
  return result
}

/**
 * Immediate cache invalidation
 * @param config - Cache invalidation configuration
 * @param result - Result object to update
 */
async function invalidateImmediate(
  config: CacheInvalidationConfig,
  result: CacheInvalidationResult
): Promise<void> {
  // Invalidate tags
  for (const tag of config.tags) {
    try {
      revalidateTag(tag)
      result.invalidatedTags.push(tag)
    } catch (error) {
      result.errors?.push(`Failed to invalidate tag ${tag}: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
  
  // Invalidate paths
  for (const path of config.paths) {
    try {
      revalidatePath(path)
      result.invalidatedPaths.push(path)
    } catch (error) {
      result.errors?.push(`Failed to invalidate path ${path}: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}

/**
 * Delayed cache invalidation
 * @param config - Cache invalidation configuration
 * @param result - Result object to update
 */
async function invalidateDelayed(
  config: CacheInvalidationConfig,
  result: CacheInvalidationResult
): Promise<void> {
  const delay = config.delay || 1000 // Default 1 second delay
  
  await new Promise(resolve => setTimeout(resolve, delay))
  await invalidateImmediate(config, result)
}

/**
 * Background cache invalidation (non-blocking)
 * @param config - Cache invalidation configuration
 * @param result - Result object to update
 */
function invalidateBackground(
  config: CacheInvalidationConfig,
  result: CacheInvalidationResult
): void {
  // Run invalidation in background without blocking
  setImmediate(async () => {
    try {
      await invalidateImmediate(config, result)
    } catch (error) {
      console.error('Background cache invalidation failed:', error)
    }
  })
  
  // Mark as successful immediately since it's background
  result.invalidatedTags = config.tags
  result.invalidatedPaths = config.paths
}

/**
 * Invalidate all attendance-related cache
 * @returns Promise<CacheInvalidationResult>
 */
export async function invalidateAllAttendanceCache(): Promise<CacheInvalidationResult> {
  const config: CacheInvalidationConfig = {
    tags: [
      'attendance-list',
      'user-attendance',
      'attendance-stats'
    ],
    paths: [
      '/dashboard/absensi',
      '/absensi',
      '/dashboard/admin/absensi',
      '/dashboard/guru/absensi'
    ],
    strategy: 'immediate'
  }
  
  return await invalidateCache(config)
}

/**
 * Invalidate cache for specific date
 * @param date - Date string (YYYY-MM-DD)
 * @returns Promise<CacheInvalidationResult>
 */
export async function invalidateDateCache(date: string): Promise<CacheInvalidationResult> {
  const config: CacheInvalidationConfig = {
    tags: [
      createCacheKey('attendance-date', date),
      createCacheKey('daily-stats', date)
    ],
    paths: [
      `/dashboard/absensi?date=${date}`,
      `/dashboard/admin/absensi?date=${date}`
    ],
    strategy: 'immediate'
  }
  
  return await invalidateCache(config)
}

/**
 * Schedule cache invalidation
 * @param config - Cache invalidation configuration
 * @param scheduleTime - Time to schedule invalidation (in milliseconds)
 * @returns Promise<void>
 */
export async function scheduleInvalidation(
  config: CacheInvalidationConfig,
  scheduleTime: number
): Promise<void> {
  setTimeout(async () => {
    try {
      await invalidateCache(config)
    } catch (error) {
      console.error('Scheduled cache invalidation failed:', error)
    }
  }, scheduleTime)
}

/**
 * Get cache invalidation metrics
 * @returns Object with cache invalidation statistics
 */
export function getCacheInvalidationMetrics() {
  // This would typically connect to a monitoring system
  // For now, return basic structure
  return {
    totalInvalidations: 0,
    successfulInvalidations: 0,
    failedInvalidations: 0,
    averageInvalidationTime: 0,
    lastInvalidation: null as Date | null
  }
}