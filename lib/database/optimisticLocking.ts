/**
 * Optimistic Locking Utilities
 * Provides version-based concurrency control for database operations
 */

import { PrismaTransaction } from './transactions'
import { OptimisticLockError, ConcurrencyError } from '@/lib/errors/TransactionError'
import { ErrorContext } from '@/lib/errors/AppError'

/**
 * Interface for models that support optimistic locking
 */
export interface VersionedModel {
  id: string
  version: number
  updatedAt: Date
}

/**
 * Options for optimistic locking operations
 */
export interface OptimisticLockOptions {
  retryOnConflict?: boolean
  maxRetries?: number
  context?: ErrorContext
}

/**
 * Update a record with optimistic locking
 */
export async function updateWithOptimisticLock<T extends VersionedModel>(
  tx: PrismaTransaction,
  model: string,
  id: string,
  currentVersion: number,
  updateData: Partial<T>,
  options?: OptimisticLockOptions
): Promise<T> {
  const { retryOnConflict = false, maxRetries = 3, context } = options || {}
  
  let attempt = 0
  
  while (attempt < (retryOnConflict ? maxRetries : 1)) {
    try {
      // Increment version and add timestamp
      const dataWithVersion = {
        ...updateData,
        version: currentVersion + 1,
        updatedAt: new Date()
      }
      
      // Attempt to update with version check
      const result = await (tx as any)[model].updateMany({
        where: {
          id,
          version: currentVersion
        },
        data: dataWithVersion
      })
      
      if (result.count === 0) {
        // No rows updated - version conflict
        if (retryOnConflict && attempt < maxRetries - 1) {
          // Fetch current version and retry
          const current = await (tx as any)[model].findUnique({
            where: { id },
            select: { version: true }
          })
          
          if (current) {
            currentVersion = current.version
            attempt++
            continue
          }
        }
        
        throw new OptimisticLockError(
          `update ${model}`,
          currentVersion,
          -1, // Unknown actual version
          context
        )
      }
      
      // Fetch and return updated record
      const updated = await (tx as any)[model].findUnique({
        where: { id }
      })
      
      return updated as T
      
    } catch (error) {
      if (error instanceof OptimisticLockError) {
        throw error
      }
      
      // Handle other errors
      throw new ConcurrencyError(`update ${model}`, context)
    }
  }
  
  throw new OptimisticLockError(
    `update ${model}`,
    currentVersion,
    -1,
    context
  )
}

/**
 * Delete a record with optimistic locking
 */
export async function deleteWithOptimisticLock(
  tx: PrismaTransaction,
  model: string,
  id: string,
  currentVersion: number,
  context?: ErrorContext
): Promise<boolean> {
  const result = await (tx as any)[model].deleteMany({
    where: {
      id,
      version: currentVersion
    }
  })
  
  if (result.count === 0) {
    throw new OptimisticLockError(
      `delete ${model}`,
      currentVersion,
      -1,
      context
    )
  }
  
  return true
}

/**
 * Create a record with initial version
 */
export async function createWithVersion<T>(
  tx: PrismaTransaction,
  model: string,
  data: Omit<T, 'id' | 'version' | 'createdAt' | 'updatedAt'>
): Promise<T> {
  const dataWithVersion = {
    ...data,
    version: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  
  return await (tx as any)[model].create({
    data: dataWithVersion
  }) as T
}

/**
 * Fetch record with version for optimistic locking
 */
export async function fetchWithVersion<T extends VersionedModel>(
  tx: PrismaTransaction,
  model: string,
  id: string
): Promise<T | null> {
  return await (tx as any)[model].findUnique({
    where: { id }
  }) as T | null
}

/**
 * Compare and swap operation with optimistic locking
 */
export async function compareAndSwap<T extends VersionedModel>(
  tx: PrismaTransaction,
  model: string,
  id: string,
  expectedVersion: number,
  updateFn: (current: T) => Partial<T>,
  context?: ErrorContext
): Promise<T> {
  // Fetch current record
  const current = await fetchWithVersion<T>(tx, model, id)
  
  if (!current) {
    throw new Error(`Record not found: ${model}#${id}`)
  }
  
  if (current.version !== expectedVersion) {
    throw new OptimisticLockError(
      `compareAndSwap ${model}`,
      expectedVersion,
      current.version,
      context
    )
  }
  
  // Apply update function
  const updateData = updateFn(current)
  
  // Perform optimistic update
  return await updateWithOptimisticLock(
    tx,
    model,
    id,
    expectedVersion,
    updateData,
    { context }
  )
}

/**
 * Batch update with optimistic locking
 */
export async function batchUpdateWithOptimisticLock<T extends VersionedModel>(
  tx: PrismaTransaction,
  model: string,
  updates: Array<{
    id: string
    version: number
    data: Partial<T>
  }>,
  context?: ErrorContext
): Promise<T[]> {
  const results: T[] = []
  
  for (const update of updates) {
    const result = await updateWithOptimisticLock<T>(
      tx,
      model,
      update.id,
      update.version,
      update.data,
      { context }
    )
    results.push(result)
  }
  
  return results
}

/**
 * Check if a model supports optimistic locking
 */
export function supportsOptimisticLocking(model: any): model is VersionedModel {
  return (
    typeof model === 'object' &&
    model !== null &&
    'id' in model &&
    'version' in model &&
    'updatedAt' in model
  )
}

/**
 * Get version conflict resolution strategies
 */
export enum ConflictResolution {
  FAIL_FAST = 'fail_fast',
  RETRY_WITH_LATEST = 'retry_with_latest',
  MERGE_CHANGES = 'merge_changes',
  USER_CHOICE = 'user_choice'
}

/**
 * Resolve version conflicts based on strategy
 */
export async function resolveVersionConflict<T extends VersionedModel>(
  tx: PrismaTransaction,
  model: string,
  id: string,
  expectedVersion: number,
  updateData: Partial<T>,
  strategy: ConflictResolution,
  context?: ErrorContext
): Promise<T> {
  switch (strategy) {
    case ConflictResolution.FAIL_FAST:
      throw new OptimisticLockError(
        `resolve conflict ${model}`,
        expectedVersion,
        -1,
        context
      )
      
    case ConflictResolution.RETRY_WITH_LATEST:
      const latest = await fetchWithVersion<T>(tx, model, id)
      if (!latest) {
        throw new Error(`Record not found: ${model}#${id}`)
      }
      return await updateWithOptimisticLock(
        tx,
        model,
        id,
        latest.version,
        updateData,
        { context }
      )
      
    case ConflictResolution.MERGE_CHANGES:
      // This would require custom merge logic per model
      throw new Error('Merge changes strategy not implemented')
      
    case ConflictResolution.USER_CHOICE:
      // This would require user interaction
      throw new Error('User choice strategy requires UI interaction')
      
    default:
      throw new Error(`Unknown conflict resolution strategy: ${strategy}`)
  }
}

/**
 * Utility to increment version manually
 */
export function incrementVersion<T extends VersionedModel>(record: T): T {
  return {
    ...record,
    version: record.version + 1,
    updatedAt: new Date()
  }
}

/**
 * Validate version consistency
 */
export function validateVersion(expected: number, actual: number): boolean {
  return expected === actual
}