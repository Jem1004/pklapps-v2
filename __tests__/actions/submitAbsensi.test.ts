import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { submitAbsensi } from '@/app/absensi/actions'
import { getServerSession } from 'next-auth'
import { TransactionError, ConstraintViolationError } from '@/lib/errors/TransactionError'
import { withRetryTransaction } from '@/lib/database/transactions'
import { TipeAbsensi } from '@prisma/client'

// Mock dependencies
vi.mock('next-auth', () => ({
  getServerSession: vi.fn()
}))

vi.mock('@/lib/database/transactions', () => ({
  withRetryTransaction: vi.fn()
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn()
}))

vi.mock('@/lib/config/transactions', () => ({
  absensiTransactionConfig: {
    maxRetries: 3,
    baseDelay: 100,
    timeout: 10000,
    enableMetrics: true
  }
}))

const mockSession = {
  user: {
    id: 'user123',
    email: 'student@test.com',
    role: 'STUDENT'
  }
}

const mockTempatPkl = {
  id: 'tempat1',
  pinAbsensi: '1234',
  isActive: true,
  nama: 'PT Test Company'
}

const mockStudent = {
  id: 'student1',
  userId: 'user123',
  tempatPklId: 'tempat1',
  nama: 'John Doe'
}

const mockSettingAbsensi = {
  id: 'setting1',
  tempatPklId: 'tempat1',
  modeAbsensi: 'MASUK_PULANG',
  version: 1
}

describe('submitAbsensi Action', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getServerSession).mockResolvedValue(mockSession as any)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Authentication', () => {
    it('should return error if user not authenticated', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null)
      
      const formData = new FormData()
      formData.append('pin', '1234')
      formData.append('tipe', 'MASUK')

      const result = await submitAbsensi(formData)

      expect(result.success).toBe(false)
      expect(result.message).toBe('Anda harus login terlebih dahulu')
    })

    it('should return error if user is not a student', async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        ...mockSession,
        user: { ...mockSession.user, role: 'TEACHER' }
      } as any)
      
      const formData = new FormData()
      formData.append('pin', '1234')
      formData.append('tipe', 'MASUK')

      const result = await submitAbsensi(formData)

      expect(result.success).toBe(false)
      expect(result.message).toBe('Hanya siswa yang dapat melakukan absensi')
    })
  })

  describe('Input Validation', () => {
    it('should return error if PIN is missing', async () => {
      const formData = new FormData()
      formData.append('tipe', 'MASUK')

      const result = await submitAbsensi(formData)

      expect(result.success).toBe(false)
      expect(result.message).toBe('PIN dan tipe absensi harus diisi')
    })

    it('should return error if tipe is missing', async () => {
      const formData = new FormData()
      formData.append('pin', '1234')

      const result = await submitAbsensi(formData)

      expect(result.success).toBe(false)
      expect(result.message).toBe('PIN dan tipe absensi harus diisi')
    })

    it('should return error if tipe is invalid', async () => {
      const formData = new FormData()
      formData.append('pin', '1234')
      formData.append('tipe', 'INVALID')

      const result = await submitAbsensi(formData)

      expect(result.success).toBe(false)
      expect(result.message).toBe('Tipe absensi tidak valid')
    })
  })

  describe('Successful Attendance', () => {
    it('should successfully submit MASUK attendance', async () => {
      const mockTransaction = vi.fn().mockImplementation(async (callback) => {
        const mockTx = {
          tempatPkl: {
            findFirst: vi.fn().mockResolvedValue(mockTempatPkl)
          },
          student: {
            findUnique: vi.fn().mockResolvedValue(mockStudent)
          },
          settingAbsensi: {
            findUnique: vi.fn().mockResolvedValue(mockSettingAbsensi)
          },
          absensi: {
            findUnique: vi.fn().mockResolvedValue(null), // No existing attendance
            create: vi.fn().mockResolvedValue({
              id: 'absensi1',
              studentId: 'student1',
              tempatPklId: 'tempat1',
              tanggal: new Date(),
              tipe: 'MASUK',
              waktuMasuk: new Date(),
              waktuPulang: null,
              version: 1
            })
          }
        }
        return callback(mockTx)
      })

      vi.mocked(withRetryTransaction).mockImplementation(mockTransaction as any)

      const formData = new FormData()
      formData.append('pin', '1234')
      formData.append('tipe', 'MASUK')

      const result = await submitAbsensi(formData)

      expect(result.success).toBe(true)
      expect(result.message).toContain('Absensi masuk berhasil dicatat')
      expect(withRetryTransaction).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({
          maxRetries: 3,
          baseDelay: 100,
          timeout: 10000,
          operation: 'submitAbsensi_MASUK',
          enableMetrics: true
        })
      )
    })

    it('should successfully submit PULANG attendance', async () => {
      const mockTransaction = vi.fn().mockImplementation(async (callback) => {
        const mockTx = {
          tempatPkl: {
            findFirst: vi.fn().mockResolvedValue(mockTempatPkl)
          },
          student: {
            findUnique: vi.fn().mockResolvedValue(mockStudent)
          },
          settingAbsensi: {
            findUnique: vi.fn().mockResolvedValue(mockSettingAbsensi)
          },
          absensi: {
            findUnique: vi.fn()
              .mockResolvedValueOnce(null) // No existing PULANG attendance
              .mockResolvedValueOnce({ // Existing MASUK attendance
                id: 'absensi1',
                studentId: 'student1',
                tipe: 'MASUK',
                waktuMasuk: new Date()
              }),
            create: vi.fn().mockResolvedValue({
              id: 'absensi2',
              studentId: 'student1',
              tempatPklId: 'tempat1',
              tanggal: new Date(),
              tipe: 'PULANG',
              waktuMasuk: null,
              waktuPulang: new Date(),
              version: 1
            })
          }
        }
        return callback(mockTx)
      })

      vi.mocked(withRetryTransaction).mockImplementation(mockTransaction as any)

      const formData = new FormData()
      formData.append('pin', '1234')
      formData.append('tipe', 'PULANG')

      const result = await submitAbsensi(formData)

      expect(result.success).toBe(true)
      expect(result.message).toContain('Absensi pulang berhasil dicatat')
    })
  })

  describe('Business Logic Validation', () => {
    it('should return error if PIN is invalid', async () => {
      const mockTransaction = vi.fn().mockImplementation(async (callback) => {
        const mockTx = {
          tempatPkl: {
            findFirst: vi.fn().mockResolvedValue(null) // Invalid PIN
          }
        }
        return callback(mockTx)
      })

      vi.mocked(withRetryTransaction).mockRejectedValue(
        new Error('PIN tidak valid atau tempat PKL tidak aktif')
      )

      const formData = new FormData()
      formData.append('pin', '9999')
      formData.append('tipe', 'MASUK')

      const result = await submitAbsensi(formData)

      expect(result.success).toBe(false)
      expect(result.message).toBe('PIN tidak valid atau tempat PKL tidak aktif')
    })

    it('should return error if student not found', async () => {
      const mockTransaction = vi.fn().mockImplementation(async (callback) => {
        const mockTx = {
          tempatPkl: {
            findFirst: vi.fn().mockResolvedValue(mockTempatPkl)
          },
          student: {
            findUnique: vi.fn().mockResolvedValue(null) // Student not found
          }
        }
        return callback(mockTx)
      })

      vi.mocked(withRetryTransaction).mockRejectedValue(
        new Error('Data siswa tidak ditemukan')
      )

      const formData = new FormData()
      formData.append('pin', '1234')
      formData.append('tipe', 'MASUK')

      const result = await submitAbsensi(formData)

      expect(result.success).toBe(false)
      expect(result.message).toBe('Data siswa tidak ditemukan')
    })

    it('should return error if student not registered at tempat PKL', async () => {
      const mockTransaction = vi.fn().mockImplementation(async (callback) => {
        const mockTx = {
          tempatPkl: {
            findFirst: vi.fn().mockResolvedValue(mockTempatPkl)
          },
          student: {
            findUnique: vi.fn().mockResolvedValue({
              ...mockStudent,
              tempatPklId: 'different_tempat' // Different tempat PKL
            })
          }
        }
        return callback(mockTx)
      })

      vi.mocked(withRetryTransaction).mockRejectedValue(
        new Error('Anda tidak terdaftar di tempat PKL ini')
      )

      const formData = new FormData()
      formData.append('pin', '1234')
      formData.append('tipe', 'MASUK')

      const result = await submitAbsensi(formData)

      expect(result.success).toBe(false)
      expect(result.message).toBe('Anda tidak terdaftar di tempat PKL ini')
    })

    it('should return error if trying PULANG in MASUK_SAJA mode', async () => {
      const mockTransaction = vi.fn().mockImplementation(async (callback) => {
        const mockTx = {
          tempatPkl: {
            findFirst: vi.fn().mockResolvedValue(mockTempatPkl)
          },
          student: {
            findUnique: vi.fn().mockResolvedValue(mockStudent)
          },
          settingAbsensi: {
            findUnique: vi.fn().mockResolvedValue({
              ...mockSettingAbsensi,
              modeAbsensi: 'MASUK_SAJA'
            })
          }
        }
        return callback(mockTx)
      })

      vi.mocked(withRetryTransaction).mockRejectedValue(
        new Error('Tempat PKL ini hanya menggunakan absensi masuk')
      )

      const formData = new FormData()
      formData.append('pin', '1234')
      formData.append('tipe', 'PULANG')

      const result = await submitAbsensi(formData)

      expect(result.success).toBe(false)
      expect(result.message).toBe('Tempat PKL ini hanya menggunakan absensi masuk')
    })

    it('should return error if already attended today', async () => {
      const mockTransaction = vi.fn().mockImplementation(async (callback) => {
        const mockTx = {
          tempatPkl: {
            findFirst: vi.fn().mockResolvedValue(mockTempatPkl)
          },
          student: {
            findUnique: vi.fn().mockResolvedValue(mockStudent)
          },
          settingAbsensi: {
            findUnique: vi.fn().mockResolvedValue(mockSettingAbsensi)
          },
          absensi: {
            findUnique: vi.fn().mockResolvedValue({
              id: 'existing_absensi',
              studentId: 'student1',
              tipe: 'MASUK',
              tanggal: new Date()
            })
          }
        }
        return callback(mockTx)
      })

      vi.mocked(withRetryTransaction).mockRejectedValue(
        new ConstraintViolationError(
          'Anda sudah melakukan absensi masuk hari ini',
          'DUPLICATE_ATTENDANCE'
        )
      )

      const formData = new FormData()
      formData.append('pin', '1234')
      formData.append('tipe', 'MASUK')

      const result = await submitAbsensi(formData)

      expect(result.success).toBe(false)
      expect(result.message).toBe('Anda sudah melakukan absensi masuk hari ini')
    })

    it('should return error if trying PULANG without MASUK', async () => {
      const mockTransaction = vi.fn().mockImplementation(async (callback) => {
        const mockTx = {
          tempatPkl: {
            findFirst: vi.fn().mockResolvedValue(mockTempatPkl)
          },
          student: {
            findUnique: vi.fn().mockResolvedValue(mockStudent)
          },
          settingAbsensi: {
            findUnique: vi.fn().mockResolvedValue(mockSettingAbsensi)
          },
          absensi: {
            findUnique: vi.fn()
              .mockResolvedValueOnce(null) // No existing PULANG attendance
              .mockResolvedValueOnce(null) // No existing MASUK attendance
          }
        }
        return callback(mockTx)
      })

      vi.mocked(withRetryTransaction).mockRejectedValue(
        new Error('Anda harus absen masuk terlebih dahulu')
      )

      const formData = new FormData()
      formData.append('pin', '1234')
      formData.append('tipe', 'PULANG')

      const result = await submitAbsensi(formData)

      expect(result.success).toBe(false)
      expect(result.message).toBe('Anda harus absen masuk terlebih dahulu')
    })
  })

  describe('Error Handling', () => {
    it('should handle transaction errors gracefully', async () => {
      vi.mocked(withRetryTransaction).mockRejectedValue(
        new TransactionError('Database connection failed')
      )

      const formData = new FormData()
      formData.append('pin', '1234')
      formData.append('tipe', 'MASUK')

      const result = await submitAbsensi(formData)

      expect(result.success).toBe(false)
      expect(result.message).toBe('Database connection failed')
    })

    it('should handle constraint violation errors', async () => {
      vi.mocked(withRetryTransaction).mockRejectedValue(
        new ConstraintViolationError(
          'Duplicate attendance record',
          'DUPLICATE_ATTENDANCE'
        )
      )

      const formData = new FormData()
      formData.append('pin', '1234')
      formData.append('tipe', 'MASUK')

      const result = await submitAbsensi(formData)

      expect(result.success).toBe(false)
      expect(result.message).toBe('Duplicate attendance record')
    })

    it('should handle unexpected errors', async () => {
      vi.mocked(withRetryTransaction).mockRejectedValue(
        new Error('Unexpected error')
      )

      const formData = new FormData()
      formData.append('pin', '1234')
      formData.append('tipe', 'MASUK')

      const result = await submitAbsensi(formData)

      expect(result.success).toBe(false)
      expect(result.message).toBe('Unexpected error')
    })
  })
})