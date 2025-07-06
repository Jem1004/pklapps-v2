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
  enableLocalStorage: boolean;
  maxLocalStorageEntries: number;
  remoteEndpoint?: string;
  apiKey?: string;
  environment: 'development' | 'staging' | 'production';
}

class ErrorLoggerService {
  private config: ErrorLoggerConfig;
  private logQueue: LogEntry[] = [];
  private isOnline: boolean = navigator.onLine;

  constructor(config: Partial<ErrorLoggerConfig> = {}) {
    this.config = {
      enableConsoleLogging: true,
      enableRemoteLogging: false,
      enableLocalStorage: true,
      maxLocalStorageEntries: 100,
      environment: 'development',
      ...config
    };

    // Listen for online/offline events (only in browser)
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline = true;
        this.flushQueuedLogs();
      });

      window.addEventListener('offline', () => {
        this.isOnline = false;
      });
    }
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

    // Local storage logging
    if (this.config.enableLocalStorage) {
      this.logToLocalStorage(logEntry);
    }

    // Remote logging
    if (this.config.enableRemoteLogging) {
      if (this.isOnline) {
        this.logToRemote(logEntry);
      } else {
        this.queueLogEntry(logEntry);
      }
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

  private logToLocalStorage(logEntry: LogEntry): void {
    if (typeof localStorage === 'undefined') {
      return; // Skip localStorage in server-side environment
    }
    
    try {
      const existingLogs = this.getLocalStorageLogs();
      const updatedLogs = [logEntry, ...existingLogs].slice(0, this.config.maxLocalStorageEntries);
      
      localStorage.setItem('app_error_logs', JSON.stringify(updatedLogs));
    } catch (error) {
      console.warn('Failed to save log to localStorage:', error);
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
      console.warn('Failed to send log to remote endpoint:', error);
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

  public getLocalStorageLogs(): LogEntry[] {
    if (typeof localStorage === 'undefined') {
      return []; // Return empty array in server-side environment
    }
    
    try {
      const logs = localStorage.getItem('app_error_logs');
      return logs ? JSON.parse(logs) : [];
    } catch (error) {
      console.warn('Failed to retrieve logs from localStorage:', error);
      return [];
    }
  }

  public clearLocalStorageLogs(): void {
    if (typeof localStorage === 'undefined') {
      return; // Skip localStorage in server-side environment
    }
    
    try {
      localStorage.removeItem('app_error_logs');
    } catch (error) {
      console.warn('Failed to clear logs from localStorage:', error);
    }
  }

  public exportLogs(): string {
    const logs = this.getLocalStorageLogs();
    return JSON.stringify(logs, null, 2);
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