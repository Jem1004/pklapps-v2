import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { PrismaClient } from '@prisma/client'

// Mock transaction monitor first
vi.mock('@/lib/monitoring/transactionMetrics', () => ({
  getTransactionMonitor: vi.fn(() => ({
    startTransaction: vi.fn(),
    endTransaction: vi.fn(),
    recordError: vi.fn(),
    getMetrics: vi.fn(() => ({
      total: 0,
      successful: 0,
      failed: 0,
      retried: 0,
      averageExecutionTime: 0,
      errorsByType: {}
    }))
  }))
}))

// Mock Prisma instance
vi.mock('@/lib/prisma', () => {
  const mockPrisma = {
    $transaction: vi.fn(),
    user: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn()
    },
    absensi: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn()
    }
  }
  return {
    default: mockPrisma,
    prisma: mockPrisma
  }
})

// Import after mocking
import { withTransaction, withRetryTransaction, withBatchTransaction } from '@/lib/database/transactions'
import { TransactionError, ConcurrencyError, DeadlockError } from '@/lib/errors/TransactionError'
import { getTransactionMonitor } from '@/lib/monitoring/transactionMetrics'
import { prisma } from '@/lib/prisma'

const mockPrisma = prisma as any

describe('Database Transactions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('withTransaction', () => {
    it('should execute transaction successfully', async () => {
      const mockResult = { id: 1, name: 'Test User' }
      mockPrisma.$transaction.mockResolvedValue(mockResult)

      const operation = vi.fn().mockResolvedValue(mockResult)
      const result = await withTransaction(operation)

      expect(mockPrisma.$transaction).toHaveBeenCalledWith(operation, {
        timeout: 10000
      })
      expect(result).toEqual(mockResult)
    })

    it('should handle transaction errors', async () => {
      const error = new Error('Transaction failed')
      mockPrisma.$transaction.mockRejectedValue(error)

      const operation = vi.fn()
      
      await expect(withTransaction(operation)).rejects.toThrow('Transaction failed')
    })

    it('should use custom timeout', async () => {
      const mockResult = { id: 1 }
      mockPrisma.$transaction.mockResolvedValue(mockResult)

      const operation = vi.fn().mockResolvedValue(mockResult)
      await withTransaction(operation, { timeout: 5000 })

      expect(mockPrisma.$transaction).toHaveBeenCalledWith(operation, {
        timeout: 5000
      })
    })
  })

  describe('withRetryTransaction', () => {
    it('should succeed on first attempt', async () => {
      const mockResult = { id: 1, name: 'Test User' }
      mockPrisma.$transaction.mockResolvedValue(mockResult)

      const operation = vi.fn().mockResolvedValue(mockResult)
      const result = await withRetryTransaction(operation, {
        maxRetries: 3,
        baseDelay: 100
      })

      expect(operation).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockResult)
    })

    it('should retry on retryable errors', async () => {
      const mockResult = { id: 1, name: 'Test User' }
      const deadlockError = new DeadlockError('Deadlock detected')
      
      mockPrisma.$transaction
        .mockRejectedValueOnce(deadlockError)
        .mockRejectedValueOnce(deadlockError)
        .mockResolvedValue(mockResult)

      const operation = vi.fn()
        .mockRejectedValueOnce(deadlockError)
        .mockRejectedValueOnce(deadlockError)
        .mockResolvedValue(mockResult)

      const result = await withRetryTransaction(operation, {
        maxRetries: 3,
        baseDelay: 10 // Reduced for testing
      })

      expect(operation).toHaveBeenCalledTimes(3)
      expect(result).toEqual(mockResult)
    })

    it('should fail after max retries', async () => {
      const deadlockError = new DeadlockError('test_operation')
      mockPrisma.$transaction.mockRejectedValue(deadlockError)

      const operation = vi.fn().mockRejectedValue(deadlockError)

      await expect(
        withRetryTransaction(operation, {
          maxRetries: 2,
          baseDelay: 10
        })
      ).rejects.toThrow('Deadlock detected in test_operation')

      expect(operation).toHaveBeenCalledTimes(2) // Initial + 1 retry
    })

    it('should not retry non-retryable errors', async () => {
      const validationError = new Error('Validation failed')
      mockPrisma.$transaction.mockRejectedValue(validationError)

      const operation = vi.fn().mockRejectedValue(validationError)

      await expect(
        withRetryTransaction(operation, {
          maxRetries: 3,
          baseDelay: 10
        })
      ).rejects.toThrow('Validation failed')

      expect(operation).toHaveBeenCalledTimes(1) // No retries
    })

    it('should record metrics when enabled', async () => {
      const mockResult = { id: 1 }
      const mockMonitor = {
        startTransaction: vi.fn(),
        endTransaction: vi.fn(),
        recordError: vi.fn()
      }
      
      vi.mocked(getTransactionMonitor).mockReturnValue(mockMonitor as any)
      mockPrisma.$transaction.mockResolvedValue(mockResult)

      const operation = vi.fn().mockResolvedValue(mockResult)
      
      await withRetryTransaction(operation, {
        maxRetries: 3,
        baseDelay: 10
      }, {
        operation: 'test_operation',
        enableMetrics: true
      })

      expect(mockMonitor.startTransaction).toHaveBeenCalledWith('test_operation', expect.any(Object))
      expect(mockMonitor.endTransaction).toHaveBeenCalled()
    })
  })

  describe('withBatchTransaction', () => {
    it('should execute multiple operations in batch', async () => {
      const mockResults = [
        { id: 1, name: 'User 1' },
        { id: 2, name: 'User 2' }
      ]
      
      mockPrisma.$transaction.mockImplementation(async (operations: Array<(tx: any) => Promise<any>>) => {
        return Promise.all(operations.map((op: (tx: any) => Promise<any>) => op(mockPrisma)))
      })

      const operations = [
        vi.fn().mockResolvedValue(mockResults[0]),
        vi.fn().mockResolvedValue(mockResults[1])
      ]

      const results = await withBatchTransaction(operations)

      expect(results).toEqual(mockResults)
      expect(operations[0]).toHaveBeenCalled()
      expect(operations[1]).toHaveBeenCalled()
    })

    it('should handle batch transaction errors', async () => {
      const error = new Error('Batch operation failed')
      mockPrisma.$transaction.mockRejectedValue(error)

      const operations = [
        vi.fn().mockResolvedValue({ id: 1 }),
        vi.fn().mockRejectedValue(error)
      ]

      await expect(withBatchTransaction(operations)).rejects.toThrow('Batch operation failed')
    })
  })

  describe('Error Handling', () => {
    it('should wrap unknown errors in TransactionError', async () => {
      const unknownError = new Error('Unknown database error')
      mockPrisma.$transaction.mockRejectedValue(unknownError)

      const operation = vi.fn().mockRejectedValue(unknownError)

      await expect(withTransaction(operation)).rejects.toThrow('Unknown database error')
    })

    it('should preserve specific transaction errors', async () => {
      const concurrencyError = new ConcurrencyError('Concurrent modification detected')
      mockPrisma.$transaction.mockRejectedValue(concurrencyError)

      const operation = vi.fn().mockRejectedValue(concurrencyError)

      await expect(withTransaction(operation)).rejects.toBeInstanceOf(ConcurrencyError)
    })
  })

  describe('Performance', () => {
    it('should complete simple transaction within timeout', async () => {
      const mockResult = { id: 1 }
      mockPrisma.$transaction.mockImplementation(async (op: (tx: any) => Promise<any>) => {
        // Simulate fast operation
        await new Promise(resolve => setTimeout(resolve, 50))
        return op(mockPrisma)
      })

      const operation = vi.fn().mockResolvedValue(mockResult)
      const startTime = Date.now()
      
      const result = await withTransaction(operation, { timeout: 1000 })
      const endTime = Date.now()

      expect(result).toEqual(mockResult)
      expect(endTime - startTime).toBeLessThan(1000)
    })
  })
})