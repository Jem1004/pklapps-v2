/**
 * Error Handling Module Exports
 * Centralized exports for all error handling functionality
 */

// Core Error Classes
export {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NetworkError,
  DatabaseError,
  BusinessLogicError,
  ErrorType,
  ErrorSeverity,
  type ErrorContext,
  type RecoveryAction
} from './AppError';

// Error Logger
export {
  errorLogger,
  type LogEntry,
  type ErrorLoggerConfig,
  default as ErrorLoggerService
} from './ErrorLogger';

// Error Utilities
export {
  handleApiError,
  handleNetworkError,
  handleValidationError,
  handleBusinessLogicError,
  safeAsync,
  safeSync,
  showErrorToast,
  showSuccessToast,
  retryWithBackoff,
  createErrorContext,
  isRetryableError,
  formatErrorForDisplay
} from './errorUtils';

// Error Boundary Component
export {
  ErrorBoundary,
  withErrorBoundary,
  useErrorHandler,
  default as ErrorBoundaryComponent
} from '../../components/common/ErrorBoundary';

// Re-export for convenience
export { AppError as default } from './AppError';
