/**
 * useErrorHandling Hook
 * Provides error handling functionality for React components
 */

'use client';

import { useCallback, useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  AppError,
  ErrorType,
  ErrorContext,
  errorLogger,
  showErrorToast,
  showSuccessToast,
  createErrorContext,
  safeAsync,
  retryWithBackoff
} from '@/lib/errors';

export interface UseErrorHandlingOptions {
  component?: string;
  enableToasts?: boolean;
  enableLogging?: boolean;
  defaultRetries?: number;
}

export interface UseErrorHandlingReturn {
  // Error state
  error: AppError | null;
  isError: boolean;
  clearError: () => void;
  
  // Error handling functions
  handleError: (error: Error | AppError, action?: string, additionalContext?: any) => void;
  handleAsyncError: <T>(operation: () => Promise<T>, action?: string) => Promise<T | null>;
  
  // Utility functions
  showError: (message: string, description?: string) => void;
  showSuccess: (message: string, description?: string) => void;
  
  // Retry functionality
  retryOperation: <T>(operation: () => Promise<T>, maxRetries?: number) => Promise<T | null>;
  
  // Context creation
  createContext: (action: string, additionalData?: any) => ErrorContext;
}

export function useErrorHandling(options: UseErrorHandlingOptions = {}): UseErrorHandlingReturn {
  const {
    component = 'Unknown',
    enableToasts = true,
    enableLogging = true,
    defaultRetries = 3
  } = options;
  
  const { data: session } = useSession();
  const [error, setError] = useState<AppError | null>(null);
  
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  const createContext = useCallback((action: string, additionalData?: any): ErrorContext => {
    return createErrorContext(component, action, {
      userId: session?.user?.id,
      sessionId: session?.user?.username, // Using username as session identifier
      ...additionalData
    });
  }, [component, session]);
  
  const handleError = useCallback((error: Error | AppError, action = 'unknown', additionalContext?: any) => {
    const appError = error instanceof AppError ? error : new AppError({
      message: error.message,
      type: ErrorType.UNKNOWN,
      context: createContext(action, additionalContext),
      cause: error
    });
    
    setError(appError);
    
    if (enableLogging) {
      errorLogger.logError(appError);
    }
    
    if (enableToasts) {
      showErrorToast(appError);
    }
  }, [createContext, enableLogging, enableToasts]);
  
  const handleAsyncError = useCallback(async <T>(
    operation: () => Promise<T>,
    action = 'async_operation'
  ): Promise<T | null> => {
    return safeAsync(
      operation,
      createContext(action),
      enableToasts ? undefined : (error) => {
        setError(error);
        if (enableLogging) {
          errorLogger.logError(error);
        }
      }
    );
  }, [createContext, enableToasts, enableLogging]);
  
  const showError = useCallback((message: string, description?: string) => {
    if (enableToasts) {
      const error = new AppError({
        message,
        userMessage: message,
        context: createContext('manual_error')
      });
      showErrorToast(error);
    }
  }, [enableToasts, createContext]);
  
  const showSuccess = useCallback((message: string, description?: string) => {
    if (enableToasts) {
      showSuccessToast(message, description);
    }
  }, [enableToasts]);
  
  const retryOperation = useCallback(async <T>(
    operation: () => Promise<T>,
    maxRetries = defaultRetries
  ): Promise<T | null> => {
    try {
      return await retryWithBackoff(
        operation,
        maxRetries,
        1000,
        createContext('retry_operation')
      );
    } catch (error) {
      const appError = error instanceof AppError ? error : new AppError({
        message: error instanceof Error ? error.message : 'Retry operation failed',
        type: ErrorType.UNKNOWN,
        context: createContext('retry_failed'),
        cause: error instanceof Error ? error : undefined
      });
      
      handleError(appError, 'retry_failed');
      return null;
    }
  }, [defaultRetries, createContext, handleError]);
  
  return {
    // Error state
    error,
    isError: error !== null,
    clearError,
    
    // Error handling functions
    handleError,
    handleAsyncError,
    
    // Utility functions
    showError,
    showSuccess,
    
    // Retry functionality
    retryOperation,
    
    // Context creation
    createContext
  };
}

// Specialized hooks for common scenarios
export function useApiErrorHandling(component: string) {
  return useErrorHandling({
    component,
    enableToasts: true,
    enableLogging: true,
    defaultRetries: 2
  });
}

export function useFormErrorHandling(component: string) {
  return useErrorHandling({
    component,
    enableToasts: true,
    enableLogging: false, // Form errors are usually not critical
    defaultRetries: 0
  });
}

export function useCriticalErrorHandling(component: string) {
  return useErrorHandling({
    component,
    enableToasts: true,
    enableLogging: true,
    defaultRetries: 5
  });
}

export default useErrorHandling;