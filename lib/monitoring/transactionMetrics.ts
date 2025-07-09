// Transaction monitoring and metrics collection

import { TransactionConfig } from '@/lib/config/transactions'

export interface TransactionMetrics {
  totalTransactions: number
  successfulTransactions: number
  failedTransactions: number
  retriedTransactions: number
  averageExecutionTime: number
  maxExecutionTime: number
  minExecutionTime: number
  concurrencyErrors: number
  timeoutErrors: number
  deadlockErrors: number
  constraintViolationErrors: number
}

export interface TransactionEvent {
  id: string
  operation: string
  startTime: number
  endTime?: number
  duration?: number
  success: boolean
  retryCount: number
  errorType?: string
  errorMessage?: string
  metadata?: Record<string, any>
}

class TransactionMonitor {
  private metrics: TransactionMetrics = {
    totalTransactions: 0,
    successfulTransactions: 0,
    failedTransactions: 0,
    retriedTransactions: 0,
    averageExecutionTime: 0,
    maxExecutionTime: 0,
    minExecutionTime: Infinity,
    concurrencyErrors: 0,
    timeoutErrors: 0,
    deadlockErrors: 0,
    constraintViolationErrors: 0
  }

  private events: TransactionEvent[] = []
  private config: TransactionConfig
  private maxEvents = 1000 // Keep last 1000 events

  constructor(config: TransactionConfig) {
    this.config = config
  }

  startTransaction(operation: string, metadata?: Record<string, any>): string {
    const id = this.generateId()
    const event: TransactionEvent = {
      id,
      operation,
      startTime: Date.now(),
      success: false,
      retryCount: 0,
      metadata
    }

    this.events.push(event)
    this.metrics.totalTransactions++

    if (this.config.enableMetrics && this.config.logLevel === 'debug') {
      console.debug(`[Transaction] Started: ${operation} (${id})`, metadata)
    }

    return id
  }

  endTransaction(
    id: string, 
    success: boolean, 
    retryCount: number = 0, 
    error?: Error
  ): void {
    const event = this.events.find(e => e.id === id)
    if (!event) return

    const endTime = Date.now()
    const duration = endTime - event.startTime

    event.endTime = endTime
    event.duration = duration
    event.success = success
    event.retryCount = retryCount

    if (error) {
      event.errorType = error.constructor.name
      event.errorMessage = error.message
    }

    // Update metrics
    if (success) {
      this.metrics.successfulTransactions++
    } else {
      this.metrics.failedTransactions++
    }

    if (retryCount > 0) {
      this.metrics.retriedTransactions++
    }

    // Update timing metrics
    this.updateTimingMetrics(duration)

    // Update error metrics
    if (error) {
      this.updateErrorMetrics(error)
    }

    // Log based on configuration
    this.logTransactionEnd(event, error)

    // Cleanup old events
    this.cleanupEvents()
  }

  private updateTimingMetrics(duration: number): void {
    this.metrics.maxExecutionTime = Math.max(this.metrics.maxExecutionTime, duration)
    this.metrics.minExecutionTime = Math.min(this.metrics.minExecutionTime, duration)
    
    // Calculate running average
    const totalSuccessful = this.metrics.successfulTransactions
    if (totalSuccessful > 0) {
      this.metrics.averageExecutionTime = 
        (this.metrics.averageExecutionTime * (totalSuccessful - 1) + duration) / totalSuccessful
    }
  }

  private updateErrorMetrics(error: Error): void {
    const errorType = error.constructor.name.toLowerCase()
    const errorMessage = error.message.toLowerCase()

    if (errorType.includes('concurrency') || errorMessage.includes('concurrent')) {
      this.metrics.concurrencyErrors++
    } else if (errorType.includes('timeout') || errorMessage.includes('timeout')) {
      this.metrics.timeoutErrors++
    } else if (errorType.includes('deadlock') || errorMessage.includes('deadlock')) {
      this.metrics.deadlockErrors++
    } else if (errorType.includes('constraint') || errorMessage.includes('constraint')) {
      this.metrics.constraintViolationErrors++
    }
  }

  private logTransactionEnd(event: TransactionEvent, error?: Error): void {
    if (!this.config.enableMetrics) return

    const { operation, duration, success, retryCount } = event
    const logData = {
      operation,
      duration,
      success,
      retryCount,
      error: error?.message
    }

    if (success && this.config.logLevel === 'debug') {
      console.debug(`[Transaction] Completed: ${operation}`, logData)
    } else if (!success) {
      if (this.config.logLevel === 'error' || this.config.logLevel === 'warn') {
        console.error(`[Transaction] Failed: ${operation}`, logData)
      }
    }
  }

  private cleanupEvents(): void {
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents)
    }
  }

  private generateId(): string {
    return `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  getMetrics(): TransactionMetrics {
    return { ...this.metrics }
  }

  getRecentEvents(limit: number = 50): TransactionEvent[] {
    return this.events.slice(-limit)
  }

  getFailedTransactions(limit: number = 20): TransactionEvent[] {
    return this.events
      .filter(e => !e.success)
      .slice(-limit)
  }

  getSlowTransactions(thresholdMs: number = 5000, limit: number = 20): TransactionEvent[] {
    return this.events
      .filter(e => e.duration && e.duration > thresholdMs)
      .sort((a, b) => (b.duration || 0) - (a.duration || 0))
      .slice(0, limit)
  }

  reset(): void {
    this.metrics = {
      totalTransactions: 0,
      successfulTransactions: 0,
      failedTransactions: 0,
      retriedTransactions: 0,
      averageExecutionTime: 0,
      maxExecutionTime: 0,
      minExecutionTime: Infinity,
      concurrencyErrors: 0,
      timeoutErrors: 0,
      deadlockErrors: 0,
      constraintViolationErrors: 0
    }
    this.events = []
  }

  // Health check for transaction system
  getHealthStatus(): {
    status: 'healthy' | 'warning' | 'critical'
    issues: string[]
    metrics: TransactionMetrics
  } {
    const issues: string[] = []
    let status: 'healthy' | 'warning' | 'critical' = 'healthy'

    const { totalTransactions, failedTransactions, averageExecutionTime } = this.metrics
    
    if (totalTransactions > 0) {
      const failureRate = failedTransactions / totalTransactions
      
      if (failureRate > 0.1) { // More than 10% failure rate
        issues.push(`High failure rate: ${(failureRate * 100).toFixed(1)}%`)
        status = 'critical'
      } else if (failureRate > 0.05) { // More than 5% failure rate
        issues.push(`Elevated failure rate: ${(failureRate * 100).toFixed(1)}%`)
        status = status === 'healthy' ? 'warning' : status
      }
    }

    if (averageExecutionTime > 10000) { // More than 10 seconds average
      issues.push(`Slow average execution time: ${averageExecutionTime.toFixed(0)}ms`)
      status = 'critical'
    } else if (averageExecutionTime > 5000) { // More than 5 seconds average
      issues.push(`Elevated execution time: ${averageExecutionTime.toFixed(0)}ms`)
      status = status === 'healthy' ? 'warning' : status
    }

    if (this.metrics.deadlockErrors > 0) {
      issues.push(`Deadlock errors detected: ${this.metrics.deadlockErrors}`)
      status = 'warning'
    }

    return {
      status,
      issues,
      metrics: this.getMetrics()
    }
  }
}

// Global transaction monitor instance
let globalMonitor: TransactionMonitor | null = null

export function getTransactionMonitor(config?: TransactionConfig): TransactionMonitor {
  if (!globalMonitor && config) {
    globalMonitor = new TransactionMonitor(config)
  }
  
  if (!globalMonitor) {
    throw new Error('Transaction monitor not initialized. Call with config first.')
  }
  
  return globalMonitor
}

export function initializeTransactionMonitor(config: TransactionConfig): TransactionMonitor {
  globalMonitor = new TransactionMonitor(config)
  return globalMonitor
}

export { TransactionMonitor }