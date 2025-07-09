// Configuration for database transactions

export interface TransactionConfig {
  maxRetries: number
  baseDelay: number
  maxDelay: number
  timeout: number
  enableOptimisticLocking: boolean
  enableMetrics: boolean
  logLevel: 'debug' | 'info' | 'warn' | 'error'
}

export const defaultTransactionConfig: TransactionConfig = {
  maxRetries: 3,
  baseDelay: 100, // milliseconds
  maxDelay: 5000, // milliseconds
  timeout: 30000, // 30 seconds
  enableOptimisticLocking: true,
  enableMetrics: true,
  logLevel: 'info'
}

export const absensiTransactionConfig: TransactionConfig = {
  ...defaultTransactionConfig,
  maxRetries: 5, // Higher retries for attendance due to concurrency
  baseDelay: 50,
  timeout: 15000 // Shorter timeout for better UX
}

export const jurnalTransactionConfig: TransactionConfig = {
  ...defaultTransactionConfig,
  maxRetries: 2, // Lower retries for journal operations
  timeout: 20000
}

// Environment-based configuration
export function getTransactionConfig(): TransactionConfig {
  const env = process.env.NODE_ENV
  
  if (env === 'development') {
    return {
      ...defaultTransactionConfig,
      logLevel: 'debug',
      enableMetrics: true
    }
  }
  
  if (env === 'test') {
    return {
      ...defaultTransactionConfig,
      maxRetries: 1,
      baseDelay: 10,
      timeout: 5000,
      enableMetrics: false,
      logLevel: 'error'
    }
  }
  
  // Production
  return {
    ...defaultTransactionConfig,
    logLevel: 'warn',
    enableMetrics: true
  }
}

// Retry strategy configuration
export interface RetryStrategy {
  shouldRetry: (error: Error, attempt: number) => boolean
  getDelay: (attempt: number, baseDelay: number) => number
}

export const exponentialBackoffStrategy: RetryStrategy = {
  shouldRetry: (error: Error, attempt: number) => {
    // Don't retry validation errors or business logic errors
    if (error.message.includes('validation') || 
        error.message.includes('tidak valid') ||
        error.message.includes('sudah melakukan')) {
      return false
    }
    
    return attempt < defaultTransactionConfig.maxRetries
  },
  
  getDelay: (attempt: number, baseDelay: number) => {
    const delay = baseDelay * Math.pow(2, attempt - 1)
    const jitter = Math.random() * 0.1 * delay
    return Math.min(delay + jitter, defaultTransactionConfig.maxDelay)
  }
}

// Transaction isolation levels
export enum TransactionIsolationLevel {
  READ_UNCOMMITTED = 'ReadUncommitted',
  READ_COMMITTED = 'ReadCommitted',
  REPEATABLE_READ = 'RepeatableRead',
  SERIALIZABLE = 'Serializable'
}

// Default isolation level for different operations
export const isolationLevels = {
  absensi: TransactionIsolationLevel.READ_COMMITTED,
  jurnal: TransactionIsolationLevel.READ_COMMITTED,
  user: TransactionIsolationLevel.REPEATABLE_READ,
  settings: TransactionIsolationLevel.SERIALIZABLE
} as const