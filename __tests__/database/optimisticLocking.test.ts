import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { PrismaClient } from '@prisma/client'
import {
  updateWithOptimisticLock,
  deleteWithOptimisticLock,
  createWithVersion,
  fetchWithVersion,
  compareAndSwap,
  batchUpdateWithOptimisticLock,
  ConflictResolution,
  resolveVersionConflict
} from '@/lib/database/optimisticLocking'
import { OptimisticLockError, ConcurrencyError } from '@/lib/errors/TransactionError'

// Mock Prisma Client
const mockPrisma = {
  $transaction: vi.fn(),
  absensi: {
    findUnique: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    create: vi.fn()
  },
  settingAbsensi: {
    findUnique: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    create: vi.fn()
  }
} as unknown as PrismaClient

// Mock Prisma instance
vi.mock('@/lib/prisma', () => ({
  default: mockPrisma
}))

describe('Optimistic Locking', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('updateWithOptimisticLock', () => {
    it('should update successfully with correct version', async () => {
      const existingRecord = {
        id: 1,
        studentId: 'student1',
        version: 1,
        tanggal: new Date(),
        tipe: 'MASUK'
      }
      
      const updatedRecord = {
        ...existingRecord,
        version: 2,
        waktuMasuk: new Date()
      }

      mockPrisma.$transaction.mockImplementation(async (callback) => {
        return callback({
          absensi: {
            findUnique: vi.fn().mockResolvedValue(existingRecord),
            update: vi.fn().mockResolvedValue(updatedRecord)
          }
        })
      })

      const result = await updateWithOptimisticLock(
        'absensi',
        { id: 1 },
        { waktuMasuk: new Date() },
        1
      )

      expect(result).toEqual(updatedRecord)
    })

    it('should throw OptimisticLockError on version mismatch', async () => {
      const existingRecord = {
        id: 1,
        studentId: 'student1',
        version: 2, // Different version
        tanggal: new Date(),
        tipe: 'MASUK'
      }

      mockPrisma.$transaction.mockImplementation(async (callback) => {
        return callback({
          absensi: {
            findUnique: vi.fn().mockResolvedValue(existingRecord),
            update: vi.fn()
          }
        })
      })

      await expect(
        updateWithOptimisticLock(
          'absensi',
          { id: 1 },
          { waktuMasuk: new Date() },
          1 // Expected version 1, but actual is 2
        )
      ).rejects.toThrow(OptimisticLockError)
    })

    it('should throw error if record not found', async () => {
      mockPrisma.$transaction.mockImplementation(async (callback) => {
        return callback({
          absensi: {
            findUnique: vi.fn().mockResolvedValue(null),
            update: vi.fn()
          }
        })
      })

      await expect(
        updateWithOptimisticLock(
          'absensi',
          { id: 999 },
          { waktuMasuk: new Date() },
          1
        )
      ).rejects.toThrow('Record not found')
    })

    it('should retry on version conflicts with RETRY strategy', async () => {
      const existingRecord1 = { id: 1, version: 2 }
      const existingRecord2 = { id: 1, version: 2 }
      const updatedRecord = { id: 1, version: 3 }

      let callCount = 0
      mockPrisma.$transaction.mockImplementation(async (callback) => {
        callCount++
        if (callCount === 1) {
          // First call - version mismatch
          return callback({
            absensi: {
              findUnique: vi.fn().mockResolvedValue(existingRecord1),
              update: vi.fn()
            }
          })
        } else {
          // Second call - success
          return callback({
            absensi: {
              findUnique: vi.fn().mockResolvedValue(existingRecord2),
              update: vi.fn().mockResolvedValue(updatedRecord)
            }
          })
        }
      })

      const result = await updateWithOptimisticLock(
        'absensi',
        { id: 1 },
        { waktuMasuk: new Date() },
        1, // Expected version 1, but actual is 2
        {
          maxRetries: 3,
          conflictResolution: ConflictResolution.RETRY
        }
      )

      expect(result).toEqual(updatedRecord)
      expect(callCount).toBe(2)
    })
  })

  describe('deleteWithOptimisticLock', () => {
    it('should delete successfully with correct version', async () => {
      const existingRecord = {
        id: 1,
        studentId: 'student1',
        version: 1
      }

      mockPrisma.$transaction.mockImplementation(async (callback) => {
        return callback({
          absensi: {
            findUnique: vi.fn().mockResolvedValue(existingRecord),
            delete: vi.fn().mockResolvedValue(existingRecord)
          }
        })
      })

      const result = await deleteWithOptimisticLock(
        'absensi',
        { id: 1 },
        1
      )

      expect(result).toEqual(existingRecord)
    })

    it('should throw OptimisticLockError on version mismatch', async () => {
      const existingRecord = {
        id: 1,
        studentId: 'student1',
        version: 2
      }

      mockPrisma.$transaction.mockImplementation(async (callback) => {
        return callback({
          absensi: {
            findUnique: vi.fn().mockResolvedValue(existingRecord),
            delete: vi.fn()
          }
        })
      })

      await expect(
        deleteWithOptimisticLock(
          'absensi',
          { id: 1 },
          1 // Expected version 1, but actual is 2
        )
      ).rejects.toThrow(OptimisticLockError)
    })
  })

  describe('createWithVersion', () => {
    it('should create record with initial version', async () => {
      const newRecord = {
        id: 1,
        studentId: 'student1',
        version: 1,
        tanggal: new Date(),
        tipe: 'MASUK'
      }

      mockPrisma.$transaction.mockImplementation(async (callback) => {
        return callback({
          absensi: {
            create: vi.fn().mockResolvedValue(newRecord)
          }
        })
      })

      const result = await createWithVersion(
        'absensi',
        {
          studentId: 'student1',
          tanggal: new Date(),
          tipe: 'MASUK'
        }
      )

      expect(result).toEqual(newRecord)
    })
  })

  describe('fetchWithVersion', () => {
    it('should fetch record with version', async () => {
      const record = {
        id: 1,
        studentId: 'student1',
        version: 1
      }

      mockPrisma.$transaction.mockImplementation(async (callback) => {
        return callback({
          absensi: {
            findUnique: vi.fn().mockResolvedValue(record)
          }
        })
      })

      const result = await fetchWithVersion(
        'absensi',
        { id: 1 }
      )

      expect(result).toEqual(record)
    })

    it('should return null if record not found', async () => {
      mockPrisma.$transaction.mockImplementation(async (callback) => {
        return callback({
          absensi: {
            findUnique: vi.fn().mockResolvedValue(null)
          }
        })
      })

      const result = await fetchWithVersion(
        'absensi',
        { id: 999 }
      )

      expect(result).toBeNull()
    })
  })

  describe('compareAndSwap', () => {
    it('should update if current value matches expected', async () => {
      const existingRecord = {
        id: 1,
        studentId: 'student1',
        version: 1,
        status: 'PENDING'
      }
      
      const updatedRecord = {
        ...existingRecord,
        version: 2,
        status: 'APPROVED'
      }

      mockPrisma.$transaction.mockImplementation(async (callback) => {
        return callback({
          absensi: {
            findUnique: vi.fn().mockResolvedValue(existingRecord),
            update: vi.fn().mockResolvedValue(updatedRecord)
          }
        })
      })

      const result = await compareAndSwap(
        'absensi',
        { id: 1 },
        'status',
        'PENDING',
        'APPROVED',
        1
      )

      expect(result.success).toBe(true)
      expect(result.data).toEqual(updatedRecord)
    })

    it('should fail if current value does not match expected', async () => {
      const existingRecord = {
        id: 1,
        studentId: 'student1',
        version: 1,
        status: 'APPROVED' // Different from expected
      }

      mockPrisma.$transaction.mockImplementation(async (callback) => {
        return callback({
          absensi: {
            findUnique: vi.fn().mockResolvedValue(existingRecord),
            update: vi.fn()
          }
        })
      })

      const result = await compareAndSwap(
        'absensi',
        { id: 1 },
        'status',
        'PENDING', // Expected PENDING, but actual is APPROVED
        'APPROVED',
        1
      )

      expect(result.success).toBe(false)
      expect(result.currentValue).toBe('APPROVED')
    })
  })

  describe('batchUpdateWithOptimisticLock', () => {
    it('should update multiple records successfully', async () => {
      const updates = [
        {
          where: { id: 1 },
          data: { status: 'APPROVED' },
          expectedVersion: 1
        },
        {
          where: { id: 2 },
          data: { status: 'REJECTED' },
          expectedVersion: 1
        }
      ]

      const existingRecords = [
        { id: 1, version: 1, status: 'PENDING' },
        { id: 2, version: 1, status: 'PENDING' }
      ]

      const updatedRecords = [
        { id: 1, version: 2, status: 'APPROVED' },
        { id: 2, version: 2, status: 'REJECTED' }
      ]

      mockPrisma.$transaction.mockImplementation(async (callback) => {
        return callback({
          absensi: {
            findUnique: vi.fn()
              .mockResolvedValueOnce(existingRecords[0])
              .mockResolvedValueOnce(existingRecords[1]),
            update: vi.fn()
              .mockResolvedValueOnce(updatedRecords[0])
              .mockResolvedValueOnce(updatedRecords[1])
          }
        })
      })

      const results = await batchUpdateWithOptimisticLock(
        'absensi',
        updates
      )

      expect(results).toEqual(updatedRecords)
    })

    it('should handle partial failures in batch update', async () => {
      const updates = [
        {
          where: { id: 1 },
          data: { status: 'APPROVED' },
          expectedVersion: 1
        },
        {
          where: { id: 2 },
          data: { status: 'REJECTED' },
          expectedVersion: 1
        }
      ]

      const existingRecords = [
        { id: 1, version: 1, status: 'PENDING' },
        { id: 2, version: 2, status: 'PENDING' } // Version mismatch
      ]

      mockPrisma.$transaction.mockImplementation(async (callback) => {
        return callback({
          absensi: {
            findUnique: vi.fn()
              .mockResolvedValueOnce(existingRecords[0])
              .mockResolvedValueOnce(existingRecords[1]),
            update: vi.fn()
          }
        })
      })

      await expect(
        batchUpdateWithOptimisticLock('absensi', updates)
      ).rejects.toThrow(OptimisticLockError)
    })
  })

  describe('resolveVersionConflict', () => {
    it('should resolve conflict with RETRY strategy', async () => {
      const currentData = { id: 1, version: 2, status: 'PENDING' }
      const newData = { status: 'APPROVED' }

      const result = await resolveVersionConflict(
        ConflictResolution.RETRY,
        currentData,
        newData
      )

      expect(result.shouldRetry).toBe(true)
      expect(result.mergedData).toEqual(newData)
      expect(result.newVersion).toBe(2)
    })

    it('should resolve conflict with MERGE strategy', async () => {
      const currentData = {
        id: 1,
        version: 2,
        status: 'PENDING',
        updatedAt: new Date('2023-01-01')
      }
      const newData = {
        status: 'APPROVED',
        notes: 'Approved by admin'
      }

      const result = await resolveVersionConflict(
        ConflictResolution.MERGE,
        currentData,
        newData
      )

      expect(result.shouldRetry).toBe(true)
      expect(result.mergedData).toEqual({
        status: 'APPROVED',
        notes: 'Approved by admin'
      })
      expect(result.newVersion).toBe(2)
    })

    it('should fail with FAIL strategy', async () => {
      const currentData = { id: 1, version: 2, status: 'PENDING' }
      const newData = { status: 'APPROVED' }

      const result = await resolveVersionConflict(
        ConflictResolution.FAIL,
        currentData,
        newData
      )

      expect(result.shouldRetry).toBe(false)
      expect(result.error).toBeInstanceOf(ConcurrencyError)
    })
  })
})