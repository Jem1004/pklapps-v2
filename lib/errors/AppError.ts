/**
 * Custom Application Error Classes
 * Provides structured error handling with context and recovery mechanisms
 */

export enum ErrorType {
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NOT_FOUND = 'NOT_FOUND',
  NETWORK = 'NETWORK',
  DATABASE = 'DATABASE',
  BUSINESS_LOGIC = 'BUSINESS_LOGIC',
  EXTERNAL_API = 'EXTERNAL_API',
  UNKNOWN = 'UNKNOWN'
}

export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface ErrorContext {
  userId?: string;
  sessionId?: string;
  component?: string;
  action?: string;
  operation?: string;
  timestamp?: Date;
  userAgent?: string;
  url?: string;
  metadata?: Record<string, any>;
  additionalData?: Record<string, any>;
}

export interface RecoveryAction {
  type: 'retry' | 'redirect' | 'refresh' | 'fallback' | 'custom';
  label: string;
  action: () => void | Promise<void>;
}

export class AppError extends Error {
  public readonly type: ErrorType;
  public readonly severity: ErrorSeverity;
  public readonly context: ErrorContext;
  public readonly userMessage: string;
  public readonly recoveryActions: RecoveryAction[];
  public readonly isRetryable: boolean;
  public readonly timestamp: Date;

  constructor({
    message,
    type = ErrorType.UNKNOWN,
    severity = ErrorSeverity.MEDIUM,
    context = {},
    userMessage,
    recoveryActions = [],
    isRetryable = false,
    cause
  }: {
    message: string;
    type?: ErrorType;
    severity?: ErrorSeverity;
    context?: ErrorContext;
    userMessage?: string;
    recoveryActions?: RecoveryAction[];
    isRetryable?: boolean;
    cause?: Error;
  }) {
    super(message);
    
    this.name = 'AppError';
    this.type = type;
    this.severity = severity;
    this.context = {
      ...context,
      timestamp: new Date()
    };
    this.userMessage = userMessage || this.getDefaultUserMessage();
    this.recoveryActions = recoveryActions;
    this.isRetryable = isRetryable;
    this.timestamp = new Date();
    
    if (cause) {
      this.cause = cause;
    }
    
    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }

  private getDefaultUserMessage(): string {
    switch (this.type) {
      case ErrorType.VALIDATION:
        return 'Data yang dimasukkan tidak valid. Silakan periksa kembali.';
      case ErrorType.AUTHENTICATION:
        return 'Sesi Anda telah berakhir. Silakan login kembali.';
      case ErrorType.AUTHORIZATION:
        return 'Anda tidak memiliki akses untuk melakukan tindakan ini.';
      case ErrorType.NOT_FOUND:
        return 'Data yang dicari tidak ditemukan.';
      case ErrorType.NETWORK:
        return 'Koneksi internet bermasalah. Silakan coba lagi.';
      case ErrorType.DATABASE:
        return 'Terjadi masalah pada sistem. Tim teknis sedang menangani.';
      case ErrorType.BUSINESS_LOGIC:
        return 'Operasi tidak dapat dilakukan karena aturan bisnis.';
      case ErrorType.EXTERNAL_API:
        return 'Layanan eksternal sedang bermasalah. Silakan coba lagi nanti.';
      default:
        return 'Terjadi kesalahan yang tidak terduga. Silakan coba lagi.';
    }
  }

  public toJSON() {
    return {
      name: this.name,
      message: this.message,
      type: this.type,
      severity: this.severity,
      context: this.context,
      userMessage: this.userMessage,
      isRetryable: this.isRetryable,
      timestamp: this.timestamp,
      stack: this.stack
    };
  }
}

// Specific Error Classes
export class ValidationError extends AppError {
  constructor(message: string, context?: ErrorContext, recoveryActions?: RecoveryAction[]) {
    super({
      message,
      type: ErrorType.VALIDATION,
      severity: ErrorSeverity.LOW,
      context,
      recoveryActions,
      isRetryable: false
    });
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string, context?: ErrorContext) {
    super({
      message,
      type: ErrorType.AUTHENTICATION,
      severity: ErrorSeverity.HIGH,
      context,
      recoveryActions: [
        {
          type: 'redirect',
          label: 'Login Ulang',
          action: () => { window.location.href = '/auth/login'; }
        }
      ],
      isRetryable: false
    });
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string, context?: ErrorContext) {
    super({
      message,
      type: ErrorType.AUTHORIZATION,
      severity: ErrorSeverity.MEDIUM,
      context,
      recoveryActions: [
        {
          type: 'redirect',
          label: 'Kembali ke Dashboard',
          action: () => { window.location.href = '/dashboard'; }
        }
      ],
      isRetryable: false
    });
  }
}

export class NetworkError extends AppError {
  constructor(message: string, context?: ErrorContext, retryAction?: () => Promise<void>) {
    const recoveryActions: RecoveryAction[] = [
      {
        type: 'refresh',
        label: 'Refresh Halaman',
        action: () => window.location.reload()
      }
    ];

    if (retryAction) {
      recoveryActions.unshift({
        type: 'retry',
        label: 'Coba Lagi',
        action: retryAction
      });
    }

    super({
      message,
      type: ErrorType.NETWORK,
      severity: ErrorSeverity.MEDIUM,
      context,
      recoveryActions,
      isRetryable: true
    });
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, context?: ErrorContext) {
    super({
      message,
      type: ErrorType.DATABASE,
      severity: ErrorSeverity.CRITICAL,
      context,
      recoveryActions: [
        {
          type: 'refresh',
          label: 'Refresh Halaman',
          action: () => window.location.reload()
        }
      ],
      isRetryable: false
    });
  }
}

export class BusinessLogicError extends AppError {
  constructor(message: string, userMessage: string, context?: ErrorContext, recoveryActions?: RecoveryAction[]) {
    super({
      message,
      type: ErrorType.BUSINESS_LOGIC,
      severity: ErrorSeverity.LOW,
      context,
      userMessage,
      recoveryActions,
      isRetryable: false
    });
  }
}