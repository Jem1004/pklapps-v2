/**
 * Cache revalidation utilities
 * Handles optimized revalidation strategies for better performance
 */

import { revalidatePath, revalidateTag } from 'next/cache'
import { invalidateAttendanceCache, createCacheKey } from './invalidation'

export interface RevalidationConfig {
  strategy: 'soft' | 'hard' | 'selective'
  priority: 'high' | 'medium' | 'low'
  delay?: number
  retries?: number
}

export interface RevalidationResult {
  success: boolean
  strategy: string
  revalidatedPaths: string[]
  revalidatedTags: string[]
  duration: number
  errors?: string[]
}

/**
 * Revalidate attendance data with optimized strategy
 * @param userId - User ID
 * @param strategy - Revalidation strategy ('soft' | 'hard')
 * @returns Promise<RevalidationResult>
 */
export async function revalidateAttendanceData(
  userId: string,
  strategy: 'soft' | 'hard' = 'soft'
): Promise<RevalidationResult> {
  const startTime = Date.now()
  const result: RevalidationResult = {
    success: true,
    strategy,
    revalidatedPaths: [],
    revalidatedTags: [],
    duration: 0,
    errors: []
  }
  
  try {
    switch (strategy) {
      case 'soft':
        await softRevalidation(userId, result)
        break
      case 'hard':
        await hardRevalidation(userId, result)
        break
      default:
        await softRevalidation(userId, result)
    }
  } catch (error) {
    result.success = false
    result.errors?.push(`Revalidation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
  
  result.duration = Date.now() - startTime
  return result
}

/**
 * Soft revalidation - only revalidate essential paths
 * @param userId - User ID
 * @param result - Result object to update
 */
async function softRevalidation(
  userId: string,
  result: RevalidationResult
): Promise<void> {
  const essentialPaths = [
    '/dashboard/absensi',
    `/dashboard/absensi/${userId}`
  ]
  
  const essentialTags = [
    createCacheKey('attendance', userId),
    createCacheKey('user-attendance', userId)
  ]
  
  // Revalidate essential paths
  for (const path of essentialPaths) {
    try {
      revalidatePath(path)
      result.revalidatedPaths.push(path)
    } catch (error) {
      result.errors?.push(`Failed to revalidate path ${path}: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
  
  // Revalidate essential tags
  for (const tag of essentialTags) {
    try {
      revalidateTag(tag)
      result.revalidatedTags.push(tag)
    } catch (error) {
      result.errors?.push(`Failed to revalidate tag ${tag}: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}

/**
 * Hard revalidation - revalidate all related paths and tags
 * @param userId - User ID
 * @param result - Result object to update
 */
async function hardRevalidation(
  userId: string,
  result: RevalidationResult
): Promise<void> {
  const allPaths = [
    '/dashboard/absensi',
    `/dashboard/absensi/${userId}`,
    '/absensi',
    '/dashboard/admin/absensi',
    '/dashboard/guru/absensi'
  ]
  
  const allTags = [
    createCacheKey('attendance', userId),
    createCacheKey('user-attendance', userId),
    'attendance-list',
    'user-list',
    'attendance-stats'
  ]
  
  // Revalidate all paths
  for (const path of allPaths) {
    try {
      revalidatePath(path)
      result.revalidatedPaths.push(path)
    } catch (error) {
      result.errors?.push(`Failed to revalidate path ${path}: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
  
  // Revalidate all tags
  for (const tag of allTags) {
    try {
      revalidateTag(tag)
      result.revalidatedTags.push(tag)
    } catch (error) {
      result.errors?.push(`Failed to revalidate tag ${tag}: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}

/**
 * Schedule revalidation with delay
 * @param path - Path to revalidate
 * @param delay - Delay in milliseconds (default: 0)
 * @returns Promise<void>
 */
export function scheduleRevalidation(
  path: string,
  delay: number = 0
): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        revalidatePath(path)
        resolve()
      } catch (error) {
        reject(error)
      }
    }, delay)
  })
}

/**
 * Batch revalidation for multiple paths
 * @param paths - Array of paths to revalidate
 * @param config - Revalidation configuration
 * @returns Promise<RevalidationResult>
 */
export async function batchRevalidation(
  paths: string[],
  config: RevalidationConfig = { strategy: 'soft', priority: 'medium' }
): Promise<RevalidationResult> {
  const startTime = Date.now()
  const result: RevalidationResult = {
    success: true,
    strategy: config.strategy,
    revalidatedPaths: [],
    revalidatedTags: [],
    duration: 0,
    errors: []
  }
  
  const delay = config.delay || 0
  const retries = config.retries || 1
  
  for (const path of paths) {
    let attempts = 0
    let success = false
    
    while (attempts < retries && !success) {
      try {
        if (delay > 0) {
          await new Promise(resolve => setTimeout(resolve, delay))
        }
        
        revalidatePath(path)
        result.revalidatedPaths.push(path)
        success = true
      } catch (error) {
        attempts++
        if (attempts >= retries) {
          result.errors?.push(`Failed to revalidate path ${path} after ${retries} attempts: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
      }
    }
  }
  
  result.duration = Date.now() - startTime
  result.success = result.errors?.length === 0
  
  return result
}

/**
 * Smart revalidation based on data type and user activity
 * @param dataType - Type of data that changed
 * @param userId - User ID
 * @param metadata - Additional metadata for smart decisions
 * @returns Promise<RevalidationResult>
 */
export async function smartRevalidation(
  dataType: 'attendance' | 'user' | 'session',
  userId: string,
  metadata?: {
    isRealTime?: boolean
    affectedUsers?: string[]
    priority?: 'high' | 'medium' | 'low'
  }
): Promise<RevalidationResult> {
  const startTime = Date.now()
  const result: RevalidationResult = {
    success: true,
    strategy: 'selective',
    revalidatedPaths: [],
    revalidatedTags: [],
    duration: 0,
    errors: []
  }
  
  try {
    switch (dataType) {
      case 'attendance':
        await smartAttendanceRevalidation(userId, metadata, result)
        break
      case 'user':
        await smartUserRevalidation(userId, metadata, result)
        break
      case 'session':
        await smartSessionRevalidation(userId, metadata, result)
        break
    }
  } catch (error) {
    result.success = false
    result.errors?.push(`Smart revalidation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
  
  result.duration = Date.now() - startTime
  return result
}

/**
 * Smart attendance revalidation
 * @param userId - User ID
 * @param metadata - Additional metadata
 * @param result - Result object to update
 */
async function smartAttendanceRevalidation(
  userId: string,
  metadata: any,
  result: RevalidationResult
): Promise<void> {
  const isRealTime = metadata?.isRealTime || false
  const priority = metadata?.priority || 'medium'
  
  if (isRealTime || priority === 'high') {
    // High priority: immediate revalidation
    await hardRevalidation(userId, result)
  } else {
    // Normal priority: soft revalidation with delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    await softRevalidation(userId, result)
  }
}

/**
 * Smart user revalidation
 * @param userId - User ID
 * @param metadata - Additional metadata
 * @param result - Result object to update
 */
async function smartUserRevalidation(
  userId: string,
  metadata: any,
  result: RevalidationResult
): Promise<void> {
  const affectedUsers = metadata?.affectedUsers || [userId]
  
  const userPaths = affectedUsers.map((id: string) => `/dashboard/user/${id}`)
  const userTags = affectedUsers.map((id: string) => createCacheKey('user', id))
  
  // Revalidate user-specific paths
  for (const path of userPaths) {
    try {
      revalidatePath(path)
      result.revalidatedPaths.push(path)
    } catch (error) {
      result.errors?.push(`Failed to revalidate user path ${path}: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
  
  // Revalidate user-specific tags
  for (const tag of userTags) {
    try {
      revalidateTag(tag)
      result.revalidatedTags.push(tag)
    } catch (error) {
      result.errors?.push(`Failed to revalidate user tag ${tag}: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}

/**
 * Smart session revalidation
 * @param userId - User ID
 * @param metadata - Additional metadata
 * @param result - Result object to update
 */
async function smartSessionRevalidation(
  userId: string,
  metadata: any,
  result: RevalidationResult
): Promise<void> {
  const sessionPaths = [
    '/dashboard',
    `/dashboard/user/${userId}`
  ]
  
  const sessionTags = [
    createCacheKey('session', userId),
    createCacheKey('user', userId)
  ]
  
  // Revalidate session paths
  for (const path of sessionPaths) {
    try {
      revalidatePath(path)
      result.revalidatedPaths.push(path)
    } catch (error) {
      result.errors?.push(`Failed to revalidate session path ${path}: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
  
  // Revalidate session tags
  for (const tag of sessionTags) {
    try {
      revalidateTag(tag)
      result.revalidatedTags.push(tag)
    } catch (error) {
      result.errors?.push(`Failed to revalidate session tag ${tag}: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}

/**
 * Get revalidation metrics
 * @returns Object with revalidation statistics
 */
export function getRevalidationMetrics() {
  // This would typically connect to a monitoring system
  return {
    totalRevalidations: 0,
    successfulRevalidations: 0,
    failedRevalidations: 0,
    averageRevalidationTime: 0,
    lastRevalidation: null as Date | null,
    strategiesUsed: {
      soft: 0,
      hard: 0,
      selective: 0
    }
  }
}