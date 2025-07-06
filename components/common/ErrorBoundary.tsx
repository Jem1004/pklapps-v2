/**
 * Error Boundary Component
 * Catches JavaScript errors in the component tree and provides recovery mechanisms
 */

'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AppError, ErrorType, ErrorSeverity, RecoveryAction } from '@/lib/errors/AppError';
import { errorLogger } from '@/lib/errors/ErrorLogger';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, Home, ArrowLeft, Bug, AlertTriangle } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: AppError | Error | null;
  errorId: string | null;
  retryCount: number;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: AppError | Error, retry: () => void) => ReactNode;
  onError?: (error: AppError | Error, errorInfo: ErrorInfo) => void;
  maxRetries?: number;
  showErrorDetails?: boolean;
  level?: 'page' | 'section' | 'component';
}

class ErrorBoundaryClass extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorId: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Convert regular errors to AppError if needed
    const appError = error instanceof AppError ? error : new AppError({
      message: error.message,
      type: ErrorType.UNKNOWN,
      severity: ErrorSeverity.HIGH,
      context: {
        component: 'ErrorBoundary',
        timestamp: new Date()
      },
      cause: error
    });

    return {
      hasError: true,
      error: appError,
      errorId: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const appError = this.state.error || error;
    
    // Log the error
    errorLogger.logError(appError, {
      component: 'ErrorBoundary',
      action: 'componentDidCatch',
      additionalData: {
        componentStack: errorInfo.componentStack,
        boundaryName: this.constructor.name,
        level: this.props.level || 'component'
      }
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(appError, errorInfo);
    }
  }

  private handleRetry = () => {
    const maxRetries = this.props.maxRetries || 3;
    
    if (this.state.retryCount < maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorId: null,
        retryCount: prevState.retryCount + 1
      }));

      // Auto-retry with exponential backoff for retryable errors
      if (this.state.error instanceof AppError && this.state.error.isRetryable) {
        const delay = Math.pow(2, this.state.retryCount) * 1000; // 1s, 2s, 4s, 8s...
        this.retryTimeoutId = setTimeout(() => {
          this.handleRetry();
        }, delay);
      }
    }
  };

  private handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  private handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.handleGoHome();
    }
  };

  private handleRefresh = () => {
    window.location.reload();
  };

  private handleReportError = () => {
    const errorData = {
      errorId: this.state.errorId,
      error: this.state.error?.message,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    // Copy error details to clipboard
    navigator.clipboard.writeText(JSON.stringify(errorData, null, 2)).then(() => {
      alert('Detail error telah disalin ke clipboard. Silakan kirim ke tim teknis.');
    }).catch(() => {
      // Fallback: show error details in alert
      alert(`Detail Error:\n${JSON.stringify(errorData, null, 2)}`);
    });
  };

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  render() {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleRetry);
      }

      const error = this.state.error;
      const isAppError = error instanceof AppError;
      const maxRetries = this.props.maxRetries || 3;
      const canRetry = this.state.retryCount < maxRetries;

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                {isAppError && error.severity === ErrorSeverity.CRITICAL ? (
                  <Bug className="w-6 h-6 text-red-600" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                )}
              </div>
              <CardTitle className="text-xl font-semibold text-gray-900">
                {isAppError && error.severity === ErrorSeverity.CRITICAL
                  ? 'Terjadi Kesalahan Sistem'
                  : 'Ups, Ada Masalah!'}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {isAppError ? error.userMessage : 'Terjadi kesalahan yang tidak terduga.'}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Recovery Actions */}
              <div className="space-y-2">
                {isAppError && error.recoveryActions.length > 0 ? (
                  error.recoveryActions.map((action, index) => (
                    <Button
                      key={index}
                      onClick={action.action}
                      variant={index === 0 ? 'default' : 'outline'}
                      className="w-full"
                    >
                      {action.label}
                    </Button>
                  ))
                ) : (
                  <>
                    {canRetry && (
                      <Button onClick={this.handleRetry} className="w-full">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Coba Lagi ({maxRetries - this.state.retryCount} tersisa)
                      </Button>
                    )}
                    <Button onClick={this.handleRefresh} variant="outline" className="w-full">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh Halaman
                    </Button>
                    <Button onClick={this.handleGoBack} variant="outline" className="w-full">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Kembali
                    </Button>
                    <Button onClick={this.handleGoHome} variant="outline" className="w-full">
                      <Home className="w-4 h-4 mr-2" />
                      Ke Dashboard
                    </Button>
                  </>
                )}
              </div>

              {/* Error Details (Development/Debug) */}
              {(this.props.showErrorDetails || process.env.NODE_ENV === 'development') && (
                <Alert>
                  <AlertDescription className="text-xs">
                    <details>
                      <summary className="cursor-pointer font-medium mb-2">
                        Detail Error (ID: {this.state.errorId})
                      </summary>
                      <div className="space-y-2 text-xs">
                        <div><strong>Pesan:</strong> {error.message}</div>
                        {isAppError && (
                          <>
                            <div><strong>Tipe:</strong> {error.type}</div>
                            <div><strong>Tingkat:</strong> {error.severity}</div>
                            <div><strong>Dapat Diulang:</strong> {error.isRetryable ? 'Ya' : 'Tidak'}</div>
                          </>
                        )}
                        <div><strong>Waktu:</strong> {new Date().toLocaleString('id-ID')}</div>
                      </div>
                    </details>
                  </AlertDescription>
                </Alert>
              )}

              {/* Report Error Button */}
              <Button
                onClick={this.handleReportError}
                variant="ghost"
                size="sm"
                className="w-full text-xs"
              >
                📋 Salin Detail Error
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// HOC wrapper for easier usage
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
}

// Hook for manual error reporting
export function useErrorHandler() {
  const { data: session } = useSession();

  const reportError = React.useCallback((error: Error | AppError, context?: any) => {
    const appError = error instanceof AppError ? error : new AppError({
      message: error.message,
      type: ErrorType.UNKNOWN,
      context: {
        userId: session?.user?.id,
        component: context?.component,
        action: context?.action,
        additionalData: context
      },
      cause: error
    });

    errorLogger.logError(appError);
    throw appError; // Re-throw to trigger error boundary
  }, [session]);

  return { reportError };
}

export const ErrorBoundary = ErrorBoundaryClass;
export default ErrorBoundary;