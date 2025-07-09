/**
 * Attendance system error handling utilities
 * Provides comprehensive error handling, retry mechanisms, and user-friendly error messages
 */

export enum AttendanceErrorCode {
  // Network errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  CONNECTION_LOST = 'CONNECTION_LOST',
  
  // Authentication errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  
  // Validation errors
  PIN_INVALID = 'PIN_INVALID',
  PIN_TOO_SHORT = 'PIN_TOO_SHORT',
  PIN_TOO_LONG = 'PIN_TOO_LONG',
  PIN_INVALID_FORMAT = 'PIN_INVALID_FORMAT',
  
  // Timing errors
  OUTSIDE_HOURS = 'OUTSIDE_HOURS',
  TIMEZONE_MISMATCH = 'TIMEZONE_MISMATCH',
  INVALID_TIME_FORMAT = 'INVALID_TIME_FORMAT',
  
  // Data errors
  ALREADY_SUBMITTED = 'ALREADY_SUBMITTED',
  ATTENDANCE_NOT_FOUND = 'ATTENDANCE_NOT_FOUND',
  DATA_CORRUPTION = 'DATA_CORRUPTION',
  
  // System errors
  DATABASE_ERROR = 'DATABASE_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  CACHE_ERROR = 'CACHE_ERROR',
  
  // Business logic errors
  ALREADY_CHECKED_IN = 'ALREADY_CHECKED_IN',
  ALREADY_CHECKED_OUT = 'ALREADY_CHECKED_OUT',
  MUST_CHECK_IN_FIRST = 'MUST_CHECK_IN_FIRST',
  
  // Unknown errors
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export interface AttendanceError {
  code: AttendanceErrorCode
  message: string
  userMessage: string
  details?: any
  timestamp: Date
  retryable: boolean
  severity: 'low' | 'medium' | 'high' | 'critical'
}

export interface RetryConfig {
  maxAttempts: number
  baseDelay: number
  maxDelay: number
  backoffMultiplier: number
  retryableErrors: AttendanceErrorCode[]
}

export interface ErrorContext {
  userId?: string
  action?: string
  pin?: string
  timestamp?: Date
  userAgent?: string
  url?: string
  additionalData?: Record<string, any>
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2,
  retryableErrors: [
    AttendanceErrorCode.NETWORK_ERROR,
    AttendanceErrorCode.TIMEOUT_ERROR,
    AttendanceErrorCode.CONNECTION_LOST,
    AttendanceErrorCode.SERVER_ERROR,
    AttendanceErrorCode.DATABASE_ERROR
  ]
}

/**
 * Error message mappings for user-friendly display
 */
const ERROR_MESSAGES: Record<AttendanceErrorCode, { message: string; userMessage: string; severity: AttendanceError['severity'] }> = {
  [AttendanceErrorCode.NETWORK_ERROR]: {
    message: 'Network connection failed',
    userMessage: 'Koneksi internet bermasalah. Silakan coba lagi.',
    severity: 'medium'
  },
  [AttendanceErrorCode.TIMEOUT_ERROR]: {
    message: 'Request timeout',
    userMessage: 'Permintaan timeout. Silakan coba lagi.',
    severity: 'medium'
  },
  [AttendanceErrorCode.CONNECTION_LOST]: {
    message: 'Connection lost during request',
    userMessage: 'Koneksi terputus. Silakan periksa internet Anda.',
    severity: 'high'
  },
  [AttendanceErrorCode.UNAUTHORIZED]: {
    message: 'User not authorized',
    userMessage: 'Anda tidak memiliki akses. Silakan login ulang.',
    severity: 'high'
  },
  [AttendanceErrorCode.SESSION_EXPIRED]: {
    message: 'User session has expired',
    userMessage: 'Sesi Anda telah berakhir. Silakan login ulang.',
    severity: 'medium'
  },
  [AttendanceErrorCode.INVALID_CREDENTIALS]: {
    message: 'Invalid user credentials',
    userMessage: 'Kredensial tidak valid. Silakan login ulang.',
    severity: 'high'
  },
  [AttendanceErrorCode.PIN_INVALID]: {
    message: 'Invalid PIN provided',
    userMessage: 'PIN tidak valid. Silakan periksa kembali.',
    severity: 'low'
  },
  [AttendanceErrorCode.PIN_TOO_SHORT]: {
    message: 'PIN is too short',
    userMessage: 'PIN terlalu pendek. Minimal 4 karakter.',
    severity: 'low'
  },
  [AttendanceErrorCode.PIN_TOO_LONG]: {
    message: 'PIN is too long',
    userMessage: 'PIN terlalu panjang. Maksimal 20 karakter.',
    severity: 'low'
  },
  [AttendanceErrorCode.PIN_INVALID_FORMAT]: {
    message: 'PIN contains invalid characters',
    userMessage: 'PIN hanya boleh berisi huruf dan angka.',
    severity: 'low'
  },
  [AttendanceErrorCode.OUTSIDE_HOURS]: {
    message: 'Attendance submitted outside allowed hours',
    userMessage: 'Absensi hanya dapat dilakukan pada jam yang ditentukan.',
    severity: 'medium'
  },
  [AttendanceErrorCode.TIMEZONE_MISMATCH]: {
    message: 'Client and server timezone mismatch',
    userMessage: 'Terjadi masalah dengan zona waktu. Silakan refresh halaman.',
    severity: 'medium'
  },
  [AttendanceErrorCode.INVALID_TIME_FORMAT]: {
    message: 'Invalid time format provided',
    userMessage: 'Format waktu tidak valid.',
    severity: 'low'
  },
  [AttendanceErrorCode.ALREADY_SUBMITTED]: {
    message: 'Duplicate attendance record',
    userMessage: 'Anda sudah melakukan absensi untuk periode ini.',
    severity: 'medium'
  },
  [AttendanceErrorCode.ATTENDANCE_NOT_FOUND]: {
    message: 'Attendance record not found',
    userMessage: 'Data absensi tidak ditemukan.',
    severity: 'medium'
  },
  [AttendanceErrorCode.DATA_CORRUPTION]: {
    message: 'Data corruption detected',
    userMessage: 'Terjadi masalah dengan data. Silakan hubungi admin.',
    severity: 'critical'
  },
  [AttendanceErrorCode.DATABASE_ERROR]: {
    message: 'Database operation failed',
    userMessage: 'Terjadi masalah sistem. Silakan coba lagi.',
    severity: 'high'
  },
  [AttendanceErrorCode.SERVER_ERROR]: {
    message: 'Internal server error',
    userMessage: 'Terjadi masalah server. Silakan coba lagi.',
    severity: 'high'
  },
  [AttendanceErrorCode.CACHE_ERROR]: {
    message: 'Cache operation failed',
    userMessage: 'Terjadi masalah cache. Silakan refresh halaman.',
    severity: 'low'
  },
  [AttendanceErrorCode.ALREADY_CHECKED_IN]: {
    message: 'User already checked in',
    userMessage: 'Anda sudah melakukan check-in hari ini.',
    severity: 'medium'
  },
  [AttendanceErrorCode.ALREADY_CHECKED_OUT]: {
    message: 'User already checked out',
    userMessage: 'Anda sudah melakukan check-out hari ini.',
    severity: 'medium'
  },
  [AttendanceErrorCode.MUST_CHECK_IN_FIRST]: {
    message: 'Must check in before checking out',
    userMessage: 'Anda harus check-in terlebih dahulu sebelum check-out.',
    severity: 'medium'
  },
  [AttendanceErrorCode.UNKNOWN_ERROR]: {
    message: 'Unknown error occurred',
    userMessage: 'Terjadi kesalahan yang tidak diketahui. Silakan coba lagi.',
    severity: 'medium'
  }
}

/**
 * Create an AttendanceError from error code
 * @param code - Error code
 * @param details - Additional error details
 * @param context - Error context
 * @returns AttendanceError
 */
export function createAttendanceError(
  code: AttendanceErrorCode,
  details?: any,
  context?: ErrorContext
): AttendanceError {
  const errorInfo = ERROR_MESSAGES[code] || ERROR_MESSAGES[AttendanceErrorCode.UNKNOWN_ERROR]
  
  return {
    code,
    message: errorInfo.message,
    userMessage: errorInfo.userMessage,
    details: details || null,
    timestamp: new Date(),
    retryable: DEFAULT_RETRY_CONFIG.retryableErrors.includes(code),
    severity: errorInfo.severity
  }
}

/**
 * Parse and classify unknown errors
 * @param error - Unknown error object
 * @param context - Error context
 * @returns AttendanceError
 */
export function parseError(error: unknown, context?: ErrorContext): AttendanceError {
  // Handle AttendanceError
  if (error && typeof error === 'object' && 'code' in error) {
    return error as AttendanceError
  }
  
  // Handle standard Error objects
  if (error instanceof Error) {
    const message = error.message.toLowerCase()
    
    // Network errors
    if (message.includes('network') || message.includes('fetch')) {
      return createAttendanceError(AttendanceErrorCode.NETWORK_ERROR, error, context)
    }
    
    if (message.includes('timeout')) {
      return createAttendanceError(AttendanceErrorCode.TIMEOUT_ERROR, error, context)
    }
    
    // Authentication errors
    if (message.includes('unauthorized') || message.includes('401')) {
      return createAttendanceError(AttendanceErrorCode.UNAUTHORIZED, error, context)
    }
    
    if (message.includes('session') || message.includes('expired')) {
      return createAttendanceError(AttendanceErrorCode.SESSION_EXPIRED, error, context)
    }
    
    // Database errors
    if (message.includes('database') || message.includes('sql')) {
      return createAttendanceError(AttendanceErrorCode.DATABASE_ERROR, error, context)
    }
    
    // Server errors
    if (message.includes('server') || message.includes('500')) {
      return createAttendanceError(AttendanceErrorCode.SERVER_ERROR, error, context)
    }
  }
  
  // Handle HTTP response errors
  if (error && typeof error === 'object' && 'status' in error) {
    const status = (error as any).status
    
    switch (status) {
      case 401:
        return createAttendanceError(AttendanceErrorCode.UNAUTHORIZED, error, context)
      case 408:
        return createAttendanceError(AttendanceErrorCode.TIMEOUT_ERROR, error, context)
      case 500:
        return createAttendanceError(AttendanceErrorCode.SERVER_ERROR, error, context)
      default:
        return createAttendanceError(AttendanceErrorCode.UNKNOWN_ERROR, error, context)
    }
  }
  
  // Default to unknown error
  return createAttendanceError(AttendanceErrorCode.UNKNOWN_ERROR, error, context)
}

/**
 * Retry mechanism with exponential backoff
 * @param fn - Function to retry
 * @param config - Retry configuration
 * @returns Promise with result or final error
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  const retryConfig = { ...DEFAULT_RETRY_CONFIG, ...config }
  let lastError: AttendanceError
  
  for (let attempt = 1; attempt <= retryConfig.maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = parseError(error)
      
      // Don't retry if error is not retryable
      if (!retryConfig.retryableErrors.includes(lastError.code)) {
        throw lastError
      }
      
      // Don't retry on last attempt
      if (attempt === retryConfig.maxAttempts) {
        throw lastError
      }
      
      // Calculate delay with exponential backoff
      const delay = Math.min(
        retryConfig.baseDelay * Math.pow(retryConfig.backoffMultiplier, attempt - 1),
        retryConfig.maxDelay
      )
      
      // Add jitter to prevent thundering herd
      const jitteredDelay = delay + Math.random() * 1000
      
      await new Promise(resolve => setTimeout(resolve, jitteredDelay))
    }
  }
  
  throw lastError!
}

/**
 * Error logger for attendance system
 */
export class AttendanceErrorLogger {
  private static logs: AttendanceError[] = []
  private static maxLogs = 100
  
  /**
   * Log an attendance error
   * @param error - AttendanceError to log
   * @param context - Additional context
   */
  static log(error: AttendanceError, context?: ErrorContext): void {
    const logEntry = {
      ...error,
      context: context || null
    }
    
    this.logs.unshift(logEntry)
    
    // Maintain max logs limit
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs)
    }
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Attendance Error:', logEntry)
    }
    
    // Send to monitoring service in production
    if (process.env.NODE_ENV === 'production' && error.severity === 'critical') {
      this.sendToMonitoring(logEntry)
    }
  }
  
  /**
   * Get error logs
   * @param limit - Maximum number of logs to return
   * @returns Array of error logs
   */
  static getLogs(limit: number = 50): AttendanceError[] {
    return this.logs.slice(0, limit)
  }
  
  /**
   * Clear error logs
   */
  static clearLogs(): void {
    this.logs = []
  }
  
  /**
   * Get error statistics
   * @returns Object with error statistics
   */
  static getStats() {
    const errorCounts = this.logs.reduce((acc, error) => {
      acc[error.code] = (acc[error.code] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const severityCounts = this.logs.reduce((acc, error) => {
      acc[error.severity] = (acc[error.severity] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    return {
      totalErrors: this.logs.length,
      errorCounts,
      severityCounts,
      lastError: this.logs[0] || null,
      retryableErrors: this.logs.filter(e => e.retryable).length
    }
  }
  
  /**
   * Send error to monitoring service
   * @param error - Error to send
   */
  private static sendToMonitoring(error: any): void {
    // Implementation would depend on monitoring service
    // Example: Sentry, LogRocket, etc.
    try {
      // Example implementation
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'exception', {
          description: error.message,
          fatal: error.severity === 'critical'
        })
      }
    } catch {
      // Silently fail monitoring
    }
  }
}

/**
 * Error boundary utilities for React components
 */
export const ErrorBoundaryUtils = {
  /**
   * Handle component errors
   * @param error - Error object
   * @param errorInfo - React error info
   * @returns AttendanceError
   */
  handleComponentError(error: Error, errorInfo: any): AttendanceError {
    const attendanceError = parseError(error, {
      action: 'component_render',
      additionalData: errorInfo
    })
    
    AttendanceErrorLogger.log(attendanceError)
    return attendanceError
  },
  
  /**
   * Get fallback UI props for error boundary
   * @param error - AttendanceError
   * @returns Object with fallback UI props
   */
  getFallbackProps(error: AttendanceError) {
    return {
      title: 'Terjadi Kesalahan',
      message: error.userMessage,
      canRetry: error.retryable,
      severity: error.severity,
      timestamp: error.timestamp
    }
  }
}

/**
 * Utility functions for error handling
 */
export const ErrorUtils = {
  /**
   * Check if error is retryable
   * @param error - Error to check
   * @returns boolean
   */
  isRetryable(error: unknown): boolean {
    const attendanceError = parseError(error)
    return attendanceError.retryable
  },
  
  /**
   * Get user-friendly error message
   * @param error - Error object
   * @returns string
   */
  getUserMessage(error: unknown): string {
    const attendanceError = parseError(error)
    return attendanceError.userMessage
  },
  
  /**
   * Check if error is critical
   * @param error - Error to check
   * @returns boolean
   */
  isCritical(error: unknown): boolean {
    const attendanceError = parseError(error)
    return attendanceError.severity === 'critical'
  }
}