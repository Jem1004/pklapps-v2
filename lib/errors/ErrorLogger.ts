/**
 * Error Logging Service
 * Handles error reporting with context and different logging levels
 */

import { AppError, ErrorSeverity, ErrorType, ErrorContext } from './AppError';

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'error' | 'warn' | 'info' | 'debug';
  message: string;
  error?: AppError | Error;
  context: ErrorContext;
  userAgent?: string;
  url?: string;
  userId?: string;
  sessionId?: string;
}

export interface ErrorLoggerConfig {
  enableConsoleLogging: boolean;
  enableRemoteLogging: boolean;

  remoteEndpoint?: string;
  apiKey?: string;
  environment: 'development' | 'staging' | 'production';
}

class ErrorLoggerService {
  private config: ErrorLoggerConfig;
  private logQueue: LogEntry[] = [];


  constructor(config: Partial<ErrorLoggerConfig> = {}) {
    this.config = {
      enableConsoleLogging: true,
      enableRemoteLogging: false,

      environment: 'development',
      ...config
    };


  }

  public logError(error: AppError | Error, additionalContext?: Partial<ErrorContext>): void {
    const logEntry = this.createLogEntry('error', error.message, error, additionalContext);
    this.processLogEntry(logEntry);
  }

  public logWarning(message: string, context?: Partial<ErrorContext>): void {
    const logEntry = this.createLogEntry('warn', message, undefined, context);
    this.processLogEntry(logEntry);
  }

  public logInfo(message: string, context?: Partial<ErrorContext>): void {
    const logEntry = this.createLogEntry('info', message, undefined, context);
    this.processLogEntry(logEntry);
  }

  public logDebug(message: string, context?: Partial<ErrorContext>): void {
    if (this.config.environment === 'development') {
      const logEntry = this.createLogEntry('debug', message, undefined, context);
      this.processLogEntry(logEntry);
    }
  }

  private createLogEntry(
    level: LogEntry['level'],
    message: string,
    error?: AppError | Error,
    additionalContext?: Partial<ErrorContext>
  ): LogEntry {
    const context: ErrorContext = {
      timestamp: new Date(),
      url: typeof window !== 'undefined' ? window.location.href : 'server-side',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server-side',
      component: additionalContext?.component,
      action: additionalContext?.action,
      userId: additionalContext?.userId,
      sessionId: additionalContext?.sessionId,
      additionalData: additionalContext?.additionalData
    };

    return {
      id: this.generateLogId(),
      timestamp: new Date(),
      level,
      message,
      error,
      context,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server-side',
      url: typeof window !== 'undefined' ? window.location.href : 'server-side',
      userId: context.userId,
      sessionId: context.sessionId
    };
  }

  private processLogEntry(logEntry: LogEntry): void {
    // Console logging
    if (this.config.enableConsoleLogging) {
      this.logToConsole(logEntry);
    }



    // Remote logging
    if (this.config.enableRemoteLogging) {
      this.logToRemote(logEntry);
    }
  }

  private logToConsole(logEntry: LogEntry): void {
    const { level, message, error, context } = logEntry;
    const logMethod = console[level] || console.log;
    
    if (error instanceof AppError) {
      logMethod(
        `[${level.toUpperCase()}] ${message}`,
        '\n📋 Error Details:', {
          type: error.type,
          severity: error.severity,
          userMessage: error.userMessage,
          isRetryable: error.isRetryable
        },
        '\n🔍 Context:', context,
        '\n📚 Stack:', error.stack
      );
    } else if (error) {
      logMethod(
        `[${level.toUpperCase()}] ${message}`,
        '\n🔍 Context:', context,
        '\n📚 Error:', error
      );
    } else {
      logMethod(
        `[${level.toUpperCase()}] ${message}`,
        '\n🔍 Context:', context
      );
    }
  }



  private async logToRemote(logEntry: LogEntry): Promise<void> {
    if (!this.config.remoteEndpoint) {
      return;
    }

    try {
      const response = await fetch(this.config.remoteEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` })
        },
        body: JSON.stringify({
          ...logEntry,
          environment: this.config.environment
        })
      });

      if (!response.ok) {
        throw new Error(`Remote logging failed: ${response.status}`);
      }
    } catch (error) {
      // Queue for retry when connection is restored
      this.queueLogEntry(logEntry);
    }
  }

  private queueLogEntry(logEntry: LogEntry): void {
    this.logQueue.push(logEntry);
    // Limit queue size to prevent memory issues
    if (this.logQueue.length > 50) {
      this.logQueue = this.logQueue.slice(-50);
    }
  }

  private async flushQueuedLogs(): Promise<void> {
    if (this.logQueue.length === 0) {
      return;
    }

    const logsToFlush = [...this.logQueue];
    this.logQueue = [];

    for (const logEntry of logsToFlush) {
      await this.logToRemote(logEntry);
    }
  }

  private generateLogId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }



  public updateConfig(newConfig: Partial<ErrorLoggerConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

// Create singleton instance
export const errorLogger = new ErrorLoggerService({
  environment: process.env.NODE_ENV as 'development' | 'staging' | 'production' || 'development',
  enableRemoteLogging: process.env.NODE_ENV === 'production',
  remoteEndpoint: process.env.NEXT_PUBLIC_ERROR_LOGGING_ENDPOINT,
  apiKey: process.env.NEXT_PUBLIC_ERROR_LOGGING_API_KEY
});

export default ErrorLoggerService;