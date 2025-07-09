/**
 * Database Transaction Utilities
 * Provides transaction management, retry logic, and error handling
 */

import { PrismaClient, Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { TransactionError, ConcurrencyError } from '@/lib/errors/TransactionError'
import { errorLogger } from '@/lib/errors/ErrorLogger'
import { ErrorContext } from '@/lib/errors/AppError'
import { getTransactionConfig, exponentialBackoffStrategy } from '@/lib/config/transactions'
import { getTransactionMonitor, initializeTransactionMonitor } from '@/lib/monitoring/transactionMetrics'

// Type definitions
export type PrismaTransaction = Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>

export interface TransactionOptions {
  isolationLevel?: Prisma.TransactionIsolationLevel
  timeout?: number
  maxWait?: number
  operation?: string
  enableMetrics?: boolean
}

export interface RetryOptions {
  maxRetries?: number
  baseDelay?: number
  maxDelay?: number
  exponentialBackoff?: boolean
}

/**
 * Execute operation within a database transaction
 */
export async function withTransaction<T>(
  operation: (tx: PrismaTransaction) => Promise<T>,
  options?: TransactionOptions
): Promise<T> {
  const transactionOptions = {
    isolationLevel: options?.isolationLevel || 'ReadCommitted',
    timeout: options?.timeout || parseInt(process.env.DB_TRANSACTION_TIMEOUT || '10000'),
    maxWait: options?.maxWait || 5000
  }

  try {
    return await prisma.$transaction(operation, transactionOptions)
  } catch (error) {
    const context: ErrorContext = {
      operation: 'database_transaction',
      timestamp: new Date(),
      metadata: {
        isolationLevel: transactionOptions.isolationLevel,
        timeout: transactionOptions.timeout
      }
    }

    errorLogger.logError(error as Error, context)
    
        if (error instanceof TransactionError) {
      throw error;
    }

    if (error instanceof Error) {
      throw new TransactionError(
        `Transaction failed: ${error.message}`,
        'withTransaction',
        context,
        error
      );
    }

    throw error;
  }
}

/**
 * Execute operation with retry mechanism for transient failures
 */
export async function withRetryTransaction<T>(
  operation: (tx: PrismaTransaction) => Promise<T>,
  retryOptions?: RetryOptions,
  transactionOptions?: TransactionOptions
): Promise<T> {
  const config = getTransactionConfig()
  const {
    maxRetries = config.maxRetries || parseInt(process.env.DB_MAX_RETRIES || '3'),
    baseDelay = config.baseDelay || parseInt(process.env.DB_RETRY_DELAY || '1000'),
    maxDelay = 10000,
    exponentialBackoff = true
  } = retryOptions || {}

  const {
    operation: operationName = 'unknown',
    enableMetrics = config.enableMetrics
  } = transactionOptions || {}

  let monitor
  let transactionId
  
  if (enableMetrics) {
    try {
      monitor = getTransactionMonitor()
    } catch {
      monitor = initializeTransactionMonitor(config)
    }
    transactionId = monitor.startTransaction(operationName, { maxRetries, baseDelay, timeout: transactionOptions?.timeout })
  }

  let lastError: Error
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await prisma.$transaction(operation, {
        timeout: transactionOptions?.timeout || 10000,
        isolationLevel: transactionOptions?.isolationLevel,
        maxWait: transactionOptions?.maxWait
      })
      
      if (monitor && transactionId) {
        monitor.endTransaction(transactionId, true, attempt - 1)
      }
      
      return result
    } catch (error) {
      lastError = error as Error
      
      // Don't retry on the last attempt
      if (attempt === maxRetries) {
        break
      }
      
      // Only retry for specific retryable errors
      if (!isRetryableError(lastError)) {
        break
      }
      
      // Calculate delay with exponential backoff
      const delay = exponentialBackoff 
        ? Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay)
        : baseDelay
      
      const context: ErrorContext = {
        operation: 'retry_transaction',
        timestamp: new Date(),
        metadata: {
          attempt,
          maxRetries,
          delay,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
      
      errorLogger.logError(
        new Error(`Transaction retry attempt ${attempt}/${maxRetries}`),
        context
      )
      
      if (config.logLevel === 'debug' || config.logLevel === 'info') {
        console.warn(`Transaction attempt ${attempt} failed, retrying in ${delay}ms:`, lastError.message)
      }
      
      await sleep(delay)
    }
  }
  
  if (monitor && transactionId) {
    monitor.endTransaction(transactionId, false, maxRetries, lastError!)
  }
  
  throw lastError!
}

/**
 * Check if error is retryable (transient failure)
 */
export function isRetryableError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase()
    return (
      message.includes('timeout') ||
      message.includes('connection') ||
      message.includes('deadlock') ||
      message.includes('serialization') ||
      message.includes('lock') ||
      message.includes('busy') ||
      message.includes('retry')
    )
  }
  return false
}

/**
 * Sleep utility for retry delays
 */
export async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Execute multiple operations in a single transaction
 */
export async function withBatchTransaction<T>(
  operations: Array<(tx: PrismaTransaction) => Promise<any>>,
  options?: TransactionOptions
): Promise<T[]> {
  return await withTransaction(async (tx) => {
    const results: T[] = []
    
    for (const operation of operations) {
      const result = await operation(tx)
      results.push(result)
    }
    
    return results
  }, options)
}

/**
 * Transaction wrapper with automatic error handling and logging
 */
export async function safeTransaction<T>(
  operation: (tx: PrismaTransaction) => Promise<T>,
  context?: ErrorContext,
  options?: TransactionOptions
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const data = await withTransaction(operation, options)
    return { success: true, data }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown transaction error'
    
    errorLogger.logError(error as Error, {
      ...context,
      operation: 'safe_transaction',
      timestamp: new Date()
    })
    
    return {
      success: false,
      error: errorMessage
    }
  }
}

/**
 * Get transaction statistics for monitoring
 */
export function getTransactionStats() {
  return {
    timeout: parseInt(process.env.DB_TRANSACTION_TIMEOUT || '10000'),
    maxRetries: parseInt(process.env.DB_MAX_RETRIES || '3'),
    retryDelay: parseInt(process.env.DB_RETRY_DELAY || '1000'),
    isolationLevel: process.env.DB_ISOLATION_LEVEL || 'ReadCommitted'
  }
}