import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  updateWithOptimisticLock,
  deleteWithOptimisticLock,
  createWithVersion,
  fetchWithVersion,
  compareAndSwap,
  batchUpdateWithOptimisticLock,
  ConflictResolution,
  resolveVersionConflict,
  VersionedModel
} from '@/lib/database/optimisticLocking'
import { OptimisticLockError } from '@/lib/errors/TransactionError'

// Mock transaction type
const mockTx = {
  testModel: {
    updateMany: vi.fn(),
    findUnique: vi.fn(),
    deleteMany: vi.fn(),
    create: vi.fn()
  }
} as any

interface TestModel extends VersionedModel {
  name: string
}

describe('Optimistic Locking', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('updateWithOptimisticLock', () => {
    it('should update record successfully', async () => {
      const updatedRecord: TestModel = {
        id: '1',
        name: 'Updated Name',
        version: 2,
        updatedAt: new Date()
      }

      mockTx.testModel.updateMany.mockResolvedValue({ count: 1 })
      mockTx.testModel.findUnique.mockResolvedValue(updatedRecord)

      const result = await updateWithOptimisticLock<TestModel>(
        mockTx,
        'testModel',
        '1',
        1,
        { name: 'Updated Name' }
      )

      expect(result).toEqual(updatedRecord)
      expect(mockTx.testModel.updateMany).toHaveBeenCalledWith({
        where: { id: '1', version: 1 },
        data: expect.objectContaining({
          name: 'Updated Name',
          version: 2
        })
      })
    })

    it('should throw OptimisticLockError when version conflict occurs', async () => {
      mockTx.testModel.updateMany.mockResolvedValue({ count: 0 })
      mockTx.testModel.findUnique.mockResolvedValue(null)

      await expect(
        updateWithOptimisticLock<TestModel>(
          mockTx,
          'testModel',
          '1',
          1,
          { name: 'Updated Name' }
        )
      ).rejects.toThrow(OptimisticLockError)
    })
  })

  describe('deleteWithOptimisticLock', () => {
    it('should delete record successfully', async () => {
      mockTx.testModel.deleteMany.mockResolvedValue({ count: 1 })

      const result = await deleteWithOptimisticLock(
        mockTx,
        'testModel',
        '1',
        1
      )

      expect(result).toBe(true)
      expect(mockTx.testModel.deleteMany).toHaveBeenCalledWith({
        where: { id: '1', version: 1 }
      })
    })

    it('should throw OptimisticLockError when version conflict occurs', async () => {
      mockTx.testModel.deleteMany.mockResolvedValue({ count: 0 })

      await expect(
        deleteWithOptimisticLock(mockTx, 'testModel', '1', 1)
      ).rejects.toThrow(OptimisticLockError)
    })
  })

  describe('createWithVersion', () => {
    it('should create record with initial version', async () => {
      const createdRecord: TestModel = {
        id: '1',
        name: 'Test Name',
        version: 1,
        updatedAt: new Date()
      }

      mockTx.testModel.create.mockResolvedValue(createdRecord)

      const result = await createWithVersion<TestModel>(
        mockTx,
        'testModel',
        { name: 'Test Name' }
      )

      expect(result).toEqual(createdRecord)
      expect(mockTx.testModel.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: 'Test Name',
          version: 1
        })
      })
    })
  })

  describe('fetchWithVersion', () => {
    it('should fetch record successfully', async () => {
      const record: TestModel = {
        id: '1',
        name: 'Test Name',
        version: 1,
        updatedAt: new Date()
      }

      mockTx.testModel.findUnique.mockResolvedValue(record)

      const result = await fetchWithVersion<TestModel>(
        mockTx,
        'testModel',
        '1'
      )

      expect(result).toEqual(record)
      expect(mockTx.testModel.findUnique).toHaveBeenCalledWith({
        where: { id: '1' }
      })
    })
  })

  describe('resolveVersionConflict', () => {
    it('should throw error for FAIL_FAST strategy', async () => {
      await expect(
        resolveVersionConflict<TestModel>(
          mockTx,
          'testModel',
          '1',
          1,
          { name: 'Updated Name' },
          ConflictResolution.FAIL_FAST
        )
      ).rejects.toThrow(OptimisticLockError)
    })

    it('should throw error for MERGE_CHANGES strategy', async () => {
      await expect(
        resolveVersionConflict<TestModel>(
          mockTx,
          'testModel',
          '1',
          1,
          { name: 'Updated Name' },
          ConflictResolution.MERGE_CHANGES
        )
      ).rejects.toThrow('Merge changes strategy not implemented')
    })
  })
})