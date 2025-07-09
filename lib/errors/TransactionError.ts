/**
 * Transaction-specific Error Classes
 * Extends the base AppError for database transaction scenarios
 */

import { AppError, ErrorContext, RecoveryAction, ErrorType, ErrorSeverity } from './AppError'

/**
 * Base class for transaction-related errors
 */
export class TransactionError extends AppError {
  public readonly operation: string

  constructor(
    message: string,
    operation: string,
    context: ErrorContext = {},
    cause?: Error
  ) {
    super({
      message,
      type: ErrorType.DATABASE,
      severity: ErrorSeverity.MEDIUM,
      context: {
        ...context,
        operation,
        timestamp: new Date()
      },
      userMessage: 'Terjadi kesalahan pada operasi database. Silakan coba lagi.',
      isRetryable: true,
      recoveryActions: [
        {
          type: 'retry',
          label: 'Coba Lagi',
          action: () => window.location.reload()
        }
      ],
      cause
    })
    
    this.name = 'TransactionError'
    this.operation = operation
  }
}

/**
 * Error for concurrency conflicts (optimistic locking failures)
 */
export class ConcurrencyError extends TransactionError {
  constructor(
    operation: string,
    context?: ErrorContext
  ) {
    super(
      `Concurrency conflict in ${operation}`,
      operation,
      {
        ...context,
        operation
      }
    )
    
    this.name = 'ConcurrencyError'
  }
}

/**
 * Error for transaction timeouts
 */
export class TransactionTimeoutError extends TransactionError {
  constructor(
    operation: string,
    timeout: number,
    context?: ErrorContext
  ) {
    super(
      `Transaction timeout after ${timeout}ms in ${operation}`,
      operation,
      {
          ...context,
          metadata: {
            ...context?.metadata,
            timeout
          }
        }
    )
    
    this.name = 'TransactionTimeoutError'
  }
}

/**
 * Error for deadlock situations
 */
export class DeadlockError extends TransactionError {
  constructor(
    operation: string,
    context?: ErrorContext,
    cause?: Error
  ) {
    super(
      `Deadlock detected in ${operation}`,
      operation,
      context,
      cause
    )

    this.name = 'DeadlockError'
  }
}

/**
 * Error for constraint violations
 */
export class ConstraintViolationError extends TransactionError {
  constructor(
    operation: string,
    constraint: string,
    context?: ErrorContext
  ) {
    super(
      `Constraint violation: ${constraint} in ${operation}`,
      operation,
      {
          ...context,
          metadata: {
            ...context?.metadata,
            constraint
          }
        }
    )
    
    this.name = 'ConstraintViolationError'
  }
}

/**
 * Error for optimistic locking version conflicts
 */
export class OptimisticLockError extends ConcurrencyError {
  constructor(
    operation: string,
    expectedVersion: number,
    actualVersion: number,
    context?: ErrorContext
  ) {
    super(operation, {
        ...context,
        metadata: {
          ...context?.metadata,
          expectedVersion,
          actualVersion
        }
      })
    
    this.name = 'OptimisticLockError'
  }
}

/**
 * Error for connection issues during transactions
 */
export class TransactionConnectionError extends TransactionError {
  constructor(
    operation: string,
    context?: ErrorContext,
    cause?: Error
  ) {
    super(
      `Connection error during ${operation}`,
      operation,
      context,
      cause
    )
    
    this.name = 'TransactionConnectionError'
  }
}

/**
 * Utility function to create appropriate transaction error based on error message
 */
export function createTransactionError(
  error: Error,
  operation: string,
  context?: ErrorContext
): TransactionError {
  const message = error.message.toLowerCase()
  
  if (message.includes('timeout')) {
    const timeoutMatch = message.match(/(\d+)ms/)
    const timeout = timeoutMatch ? parseInt(timeoutMatch[1]) : 10000
    return new TransactionTimeoutError(operation, timeout, context)
  }
  
  if (message.includes('deadlock')) {
    return new DeadlockError(operation, context)
  }
  
  if (message.includes('unique') || message.includes('constraint')) {
    const constraintMatch = message.match(/constraint[\s"'`]([^\s"'`]+)/)
    const constraint = constraintMatch ? constraintMatch[1] : 'unknown'
    return new ConstraintViolationError(operation, constraint, context)
  }
  
  if (message.includes('connection') || message.includes('network')) {
    return new TransactionConnectionError(operation, context, error)
  }
  
  if (message.includes('version') || message.includes('optimistic')) {
    return new OptimisticLockError(operation, 0, 0, context)
  }
  
  // Default to generic transaction error
  return new TransactionError(error.message, operation, context, error)
}

/**
 * Check if an error is transaction-related
 */
export function isTransactionError(error: unknown): error is TransactionError {
  return error instanceof TransactionError
}

/**
 * Check if an error should trigger a retry
 */
export function shouldRetryTransaction(error: unknown): boolean {
  if (isTransactionError(error)) {
    return error.isRetryable
  }
  
  if (error instanceof Error) {
    const message = error.message.toLowerCase()
    return (
      message.includes('timeout') ||
      message.includes('deadlock') ||
      message.includes('connection') ||
      message.includes('busy') ||
      message.includes('retry')
    )
  }
  
  return false
}