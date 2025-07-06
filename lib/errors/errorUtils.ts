/**
 * Error Handling Utilities
 * Helper functions for common error scenarios and error transformation
 */

import { toast } from 'sonner';
import {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NetworkError,
  DatabaseError,
  BusinessLogicError,
  ErrorType,
  ErrorSeverity,
  ErrorContext,
  RecoveryAction
} from './AppError';
import { errorLogger } from './ErrorLogger';

/**
 * Handle API response errors
 */
export async function handleApiError(response: Response, context?: ErrorContext): Promise<never> {
  let errorMessage = 'Terjadi kesalahan pada server';
  let errorType = ErrorType.UNKNOWN;
  let userMessage = '';
  
  try {
    const errorData = await response.json();
    errorMessage = errorData.message || errorMessage;
    userMessage = errorData.userMessage || '';
  } catch {
    // If response is not JSON, use status text
    errorMessage = response.statusText || errorMessage;
  }

  // Map HTTP status codes to error types
  switch (response.status) {
    case 400:
      throw new ValidationError(errorMessage, context);
    case 401:
      throw new AuthenticationError(errorMessage, context);
    case 403:
      throw new AuthorizationError(errorMessage, context);
    case 404:
      throw new AppError({
        message: errorMessage,
        type: ErrorType.NOT_FOUND,
        context,
        userMessage: userMessage || 'Data yang dicari tidak ditemukan'
      });
    case 422:
      throw new ValidationError(errorMessage, context);
    case 429:
      throw new AppError({
        message: 'Too many requests',
        type: ErrorType.NETWORK,
        context,
        userMessage: 'Terlalu banyak permintaan. Silakan coba lagi nanti.',
        isRetryable: true
      });
    case 500:
    case 502:
    case 503:
    case 504:
      throw new DatabaseError(errorMessage, context);
    default:
      throw new AppError({
        message: errorMessage,
        type: errorType,
        context,
        userMessage: userMessage || 'Terjadi kesalahan yang tidak terduga'
      });
  }
}

/**
 * Handle network errors (fetch failures)
 */
export function handleNetworkError(error: Error, context?: ErrorContext, retryAction?: () => Promise<void>): never {
  const networkError = new NetworkError(
    `Network error: ${error.message}`,
    context,
    retryAction
  );
  
  throw networkError;
}

/**
 * Handle validation errors with field-specific messages
 */
export function handleValidationError(
  fieldErrors: Record<string, string[]>,
  context?: ErrorContext
): never {
  const errorMessages = Object.entries(fieldErrors)
    .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
    .join('; ');

  const recoveryActions: RecoveryAction[] = [
    {
      type: 'fallback',
      label: 'Perbaiki Data',
      action: () => {
        // Focus on first error field if possible
        const firstField = Object.keys(fieldErrors)[0];
        const element = document.querySelector(`[name="${firstField}"]`) as HTMLElement;
        if (element) {
          element.focus();
        }
      }
    }
  ];

  throw new ValidationError(errorMessages, context, recoveryActions);
}

/**
 * Handle business logic errors with custom user messages
 */
export function handleBusinessLogicError(
  message: string,
  userMessage: string,
  context?: ErrorContext,
  recoveryActions?: RecoveryAction[]
): never {
  throw new BusinessLogicError(message, userMessage, context, recoveryActions);
}

/**
 * Safely execute async operations with error handling
 */
export async function safeAsync<T>(
  operation: () => Promise<T>,
  context?: ErrorContext,
  onError?: (error: AppError) => void
): Promise<T | null> {
  try {
    return await operation();
  } catch (error) {
    const appError = error instanceof AppError ? error : new AppError({
      message: error instanceof Error ? error.message : 'Unknown error',
      type: ErrorType.UNKNOWN,
      context,
      cause: error instanceof Error ? error : undefined
    });

    errorLogger.logError(appError, context);
    
    if (onError) {
      onError(appError);
    } else {
      // Default error handling with toast
      showErrorToast(appError);
    }

    return null;
  }
}

/**
 * Safely execute sync operations with error handling
 */
export function safeSync<T>(
  operation: () => T,
  context?: ErrorContext,
  onError?: (error: AppError) => void
): T | null {
  try {
    return operation();
  } catch (error) {
    const appError = error instanceof AppError ? error : new AppError({
      message: error instanceof Error ? error.message : 'Unknown error',
      type: ErrorType.UNKNOWN,
      context,
      cause: error instanceof Error ? error : undefined
    });

    errorLogger.logError(appError, context);
    
    if (onError) {
      onError(appError);
    } else {
      showErrorToast(appError);
    }

    return null;
  }
}

/**
 * Show error toast with appropriate styling based on severity
 */
export function showErrorToast(error: AppError | Error): void {
  const isAppError = error instanceof AppError;
  const message = isAppError ? error.userMessage : error.message;
  const severity = isAppError ? error.severity : ErrorSeverity.MEDIUM;

  switch (severity) {
    case ErrorSeverity.CRITICAL:
      toast.error(message, {
        duration: 10000,
        description: 'Silakan hubungi tim teknis jika masalah berlanjut.',
        action: {
          label: 'Tutup',
          onClick: () => {}
        }
      });
      break;
    case ErrorSeverity.HIGH:
      toast.error(message, {
        duration: 8000,
        description: 'Silakan coba lagi atau hubungi tim teknis.'
      });
      break;
    case ErrorSeverity.MEDIUM:
      toast.error(message, {
        duration: 5000
      });
      break;
    case ErrorSeverity.LOW:
      toast.warning(message, {
        duration: 3000
      });
      break;
    default:
      toast.error(message);
  }
}

/**
 * Show success toast for recovery actions
 */
export function showSuccessToast(message: string, description?: string): void {
  toast.success(message, {
    description,
    duration: 3000
  });
}

/**
 * Retry mechanism with exponential backoff
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
  context?: ErrorContext
): Promise<T> {
  let lastError: Error | undefined;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      if (attempt === maxRetries) {
        break;
      }
      
      // Calculate delay with exponential backoff and jitter
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
      
      errorLogger.logWarning(`Retry attempt ${attempt + 1}/${maxRetries} failed`, {
        ...context,
        additionalData: {
          attempt: attempt + 1,
          maxRetries,
          error: lastError.message
        }
      });
    }
  }
  
  // All retries failed, throw the last error
  // lastError is guaranteed to be defined here since we only reach this point after catching an error
  throw new NetworkError(
    `Operation failed after ${maxRetries} retries: ${lastError!.message}`,
    context,
    async () => { await retryWithBackoff(operation, maxRetries, baseDelay, context); }
  );
}

/**
 * Create error context from component and action
 */
export function createErrorContext(
  component: string,
  action: string,
  additionalData?: Record<string, any>
): ErrorContext {
  return {
    component,
    action,
    timestamp: new Date(),
    url: typeof window !== 'undefined' ? window.location.href : undefined,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    additionalData
  };
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: Error): boolean {
  if (error instanceof AppError) {
    return error.isRetryable;
  }
  
  // Check for common retryable error patterns
  const retryablePatterns = [
    /network/i,
    /timeout/i,
    /connection/i,
    /fetch/i,
    /502/,
    /503/,
    /504/
  ];
  
  return retryablePatterns.some(pattern => pattern.test(error.message));
}

/**
 * Format error for display
 */
export function formatErrorForDisplay(error: AppError | Error): {
  title: string;
  message: string;
  severity: ErrorSeverity;
  canRetry: boolean;
} {
  if (error instanceof AppError) {
    return {
      title: getErrorTitle(error.type),
      message: error.userMessage,
      severity: error.severity,
      canRetry: error.isRetryable
    };
  }
  
  return {
    title: 'Kesalahan Sistem',
    message: 'Terjadi kesalahan yang tidak terduga. Silakan coba lagi.',
    severity: ErrorSeverity.MEDIUM,
    canRetry: isRetryableError(error)
  };
}

function getErrorTitle(errorType: ErrorType): string {
  switch (errorType) {
    case ErrorType.VALIDATION:
      return 'Data Tidak Valid';
    case ErrorType.AUTHENTICATION:
      return 'Sesi Berakhir';
    case ErrorType.AUTHORIZATION:
      return 'Akses Ditolak';
    case ErrorType.NOT_FOUND:
      return 'Data Tidak Ditemukan';
    case ErrorType.NETWORK:
      return 'Masalah Koneksi';
    case ErrorType.DATABASE:
      return 'Kesalahan Sistem';
    case ErrorType.BUSINESS_LOGIC:
      return 'Operasi Tidak Valid';
    case ErrorType.EXTERNAL_API:
      return 'Layanan Tidak Tersedia';
    default:
      return 'Kesalahan Sistem';
  }
}