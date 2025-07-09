# 🔄 Database Transactions Upgrade Guide

## 📋 Overview

Upgrade ini bertujuan untuk mengimplementasikan **Database Transactions** pada sistem absensi untuk memastikan **data integrity**, **consistency**, dan **concurrency control** yang lebih baik.

## 🎯 Tujuan Upgrade

### Masalah Saat Ini
- **Race Conditions**: Multiple queries tanpa transaction dapat menyebabkan data inconsistent
- **Partial Failures**: Jika salah satu operasi gagal, data bisa dalam state yang tidak valid
- **Concurrency Issues**: Multiple users submit absensi bersamaan dapat menyebabkan duplikasi
- **Data Integrity**: Tidak ada rollback mechanism jika terjadi error di tengah proses

### Solusi yang Akan Diimplementasikan
- **ACID Transactions**: Atomicity, Consistency, Isolation, Durability
- **Optimistic Locking**: Mencegah race conditions
- **Retry Mechanism**: Auto-retry untuk transient failures
- **Enhanced Error Handling**: Structured error handling dengan proper rollback

---

## 🔍 Analisis Kode Existing

### File yang Terpengaruh
```
app/absensi/actions.ts          # submitAbsensi() function
lib/errors/errorUtils.ts        # Error handling utilities
prisma/schema.prisma            # Database schema
```

### Operasi Database dalam submitAbsensi()

1. **Authentication Check** - `getServerSession()`
2. **Find TempatPkl** - `prisma.tempatPkl.findFirst()`
3. **Find Student** - `prisma.student.findFirst()`
4. **Check/Create Setting** - `prisma.settingAbsensi.findFirst()` + `create()`
5. **Check Existing Absensi** - `prisma.absensi.findFirst()`
6. **Create Absensi** - `prisma.absensi.create()`

### Potensi Race Conditions
```typescript
// MASALAH: Multiple queries tanpa transaction
const existingAbsensi = await prisma.absensi.findFirst({ ... })
// Jika ada concurrent request, bisa lolos check ini
if (existingAbsensi) { return error }

// Create bisa gagal karena unique constraint
const absensi = await prisma.absensi.create({ ... })
```

---

## 🛠️ Implementation Plan

### Phase 1: Core Transaction Implementation

#### 1.1 Enhanced submitAbsensi with Transaction
```typescript
// app/absensi/actions.ts
export async function submitAbsensi(pinAbsensi: string, tipe?: 'MASUK' | 'PULANG') {
  return await prisma.$transaction(async (tx) => {
    // All database operations within transaction
    const session = await getServerSession(authOptions)
    
    // Validation logic...
    
    // Find operations with transaction context
    const tempatPkl = await tx.tempatPkl.findFirst({ ... })
    const student = await tx.student.findFirst({ ... })
    
    // Atomic check and create
    const existingAbsensi = await tx.absensi.findFirst({ ... })
    if (existingAbsensi) {
      throw new BusinessLogicError('Sudah absen hari ini')
    }
    
    // Create with optimistic locking
    const absensi = await tx.absensi.create({ ... })
    
    return { success: true, data: absensi }
  }, {
    isolationLevel: 'ReadCommitted',
    timeout: 10000
  })
}
```

#### 1.2 Transaction Utility Functions
```typescript
// lib/database/transactions.ts
export async function withTransaction<T>(
  operation: (tx: PrismaTransaction) => Promise<T>,
  options?: TransactionOptions
): Promise<T> {
  return await prisma.$transaction(operation, {
    isolationLevel: options?.isolationLevel || 'ReadCommitted',
    timeout: options?.timeout || 10000,
    maxWait: options?.maxWait || 5000
  })
}

export async function withRetryTransaction<T>(
  operation: (tx: PrismaTransaction) => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  let lastError: Error
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await withTransaction(operation)
    } catch (error) {
      lastError = error as Error
      
      // Retry only for specific errors
      if (isRetryableError(error) && attempt < maxRetries) {
        await delay(attempt * 1000) // Exponential backoff
        continue
      }
      
      throw error
    }
  }
  
  throw lastError!
}
```

### Phase 2: Enhanced Error Handling

#### 2.1 Transaction-Specific Error Types
```typescript
// lib/errors/TransactionError.ts
export class TransactionError extends AppError {
  constructor(
    message: string,
    public readonly operation: string,
    context?: ErrorContext,
    cause?: Error
  ) {
    super({
      message,
      type: ErrorType.DATABASE,
      context,
      cause,
      userMessage: 'Terjadi kesalahan saat menyimpan data. Silakan coba lagi.'
    })
  }
}

export class ConcurrencyError extends TransactionError {
  constructor(operation: string, context?: ErrorContext) {
    super(
      `Concurrency conflict in ${operation}`,
      operation,
      context
    )
    this.userMessage = 'Data sedang diproses oleh pengguna lain. Silakan coba lagi.'
  }
}
```

#### 2.2 Retry Logic for Transient Failures
```typescript
// lib/database/retryUtils.ts
export function isRetryableError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase()
    return (
      message.includes('timeout') ||
      message.includes('connection') ||
      message.includes('deadlock') ||
      message.includes('serialization')
    )
  }
  return false
}

export async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
```

### Phase 3: Optimistic Locking

#### 3.1 Version-Based Locking
```typescript
// Add version field to critical models
model Absensi {
  // ... existing fields
  version Int @default(1)
  
  @@map("absensis")
}

model SettingAbsensi {
  // ... existing fields
  version Int @default(1)
  
  @@map("setting_absensis")
}
```

#### 3.2 Optimistic Update Implementation
```typescript
// lib/database/optimisticLocking.ts
export async function updateWithOptimisticLock<T>(
  tx: PrismaTransaction,
  model: string,
  id: string,
  currentVersion: number,
  updateData: any
): Promise<T> {
  const result = await (tx as any)[model].updateMany({
    where: {
      id,
      version: currentVersion
    },
    data: {
      ...updateData,
      version: currentVersion + 1
    }
  })
  
  if (result.count === 0) {
    throw new ConcurrencyError(`Update ${model}`)
  }
  
  return result
}
```

---

## 📝 Implementation Steps

### Step 1: Create Transaction Utilities
```bash
# Create new files
touch lib/database/transactions.ts
touch lib/database/retryUtils.ts
touch lib/database/optimisticLocking.ts
touch lib/errors/TransactionError.ts
```

### Step 2: Update Prisma Schema
```sql
-- Add version fields for optimistic locking
ALTER TABLE "absensis" ADD COLUMN "version" INTEGER DEFAULT 1;
ALTER TABLE "setting_absensis" ADD COLUMN "version" INTEGER DEFAULT 1;
```

### Step 3: Refactor submitAbsensi Function
- Wrap all database operations in transaction
- Add retry mechanism
- Implement proper error handling
- Add optimistic locking where needed

### Step 4: Update Error Handling
- Integrate transaction-specific errors
- Add user-friendly error messages
- Implement proper logging

### Step 5: Testing
- Unit tests for transaction utilities
- Integration tests for concurrent scenarios
- Load testing for performance validation

---

## 🧪 Testing Strategy

### Unit Tests
```typescript
// tests/database/transactions.test.ts
describe('Transaction Utilities', () => {
  test('should rollback on error', async () => {
    await expect(
      withTransaction(async (tx) => {
        await tx.absensi.create({ ... })
        throw new Error('Simulated error')
      })
    ).rejects.toThrow()
    
    // Verify no data was created
    const count = await prisma.absensi.count()
    expect(count).toBe(0)
  })
  
  test('should retry on transient failures', async () => {
    let attempts = 0
    
    const result = await withRetryTransaction(async (tx) => {
      attempts++
      if (attempts < 3) {
        throw new Error('timeout')
      }
      return 'success'
    })
    
    expect(result).toBe('success')
    expect(attempts).toBe(3)
  })
})
```

### Concurrency Tests
```typescript
// tests/integration/concurrency.test.ts
describe('Concurrent Absensi Submission', () => {
  test('should prevent duplicate absensi', async () => {
    const promises = Array(10).fill(null).map(() => 
      submitAbsensi('test-pin', 'MASUK')
    )
    
    const results = await Promise.allSettled(promises)
    const successful = results.filter(r => r.status === 'fulfilled')
    
    expect(successful).toHaveLength(1)
  })
})
```

---

## 📊 Performance Impact

### Expected Improvements
- **Data Consistency**: 100% (eliminasi race conditions)
- **Error Recovery**: 95% (dengan retry mechanism)
- **Concurrent Safety**: 100% (dengan proper locking)

### Potential Overhead
- **Latency**: +50-100ms per request (acceptable untuk data integrity)
- **Database Load**: +10-15% (due to locking mechanisms)
- **Memory Usage**: +5-10% (transaction context)

---

## 🚀 Deployment Plan

### Pre-Deployment
1. **Database Migration**: Add version columns
2. **Code Review**: Peer review untuk transaction logic
3. **Testing**: Comprehensive testing di staging environment

### Deployment
1. **Blue-Green Deployment**: Zero-downtime deployment
2. **Feature Flag**: Gradual rollout dengan feature toggle
3. **Monitoring**: Real-time monitoring untuk transaction performance

### Post-Deployment
1. **Performance Monitoring**: Track transaction metrics
2. **Error Monitoring**: Monitor transaction failures
3. **User Feedback**: Collect feedback untuk UX improvements

---

## 🔧 Configuration

### Environment Variables
```env
# Transaction settings
DB_TRANSACTION_TIMEOUT=10000
DB_MAX_RETRIES=3
DB_RETRY_DELAY=1000
DB_ISOLATION_LEVEL=ReadCommitted

# Monitoring
TRANSACTION_MONITORING_ENABLED=true
TRANSACTION_LOG_LEVEL=info
```

### Prisma Configuration
```typescript
// lib/prisma.ts
export const prisma = new PrismaClient({
  log: [
    { level: 'query', emit: 'event' },
    { level: 'error', emit: 'event' },
    { level: 'info', emit: 'event' },
    { level: 'warn', emit: 'event' },
  ],
  errorFormat: 'pretty',
  transactionOptions: {
    timeout: parseInt(process.env.DB_TRANSACTION_TIMEOUT || '10000'),
    isolationLevel: 'ReadCommitted'
  }
})
```

---

## 📈 Success Metrics

### Technical Metrics
- **Transaction Success Rate**: > 99.5%
- **Average Transaction Time**: < 200ms
- **Concurrent Request Handling**: 100 requests/second
- **Data Consistency**: 100% (zero duplicate absensi)

### Business Metrics
- **User Error Rate**: < 0.1%
- **Data Accuracy**: 100%
- **System Reliability**: 99.9% uptime
- **User Satisfaction**: > 95%

---

## 🔄 Rollback Plan

Jika terjadi masalah serius:

1. **Immediate Rollback**: Revert ke versi sebelumnya
2. **Database Cleanup**: Remove version columns jika diperlukan
3. **Monitoring**: Monitor system stability
4. **Root Cause Analysis**: Analisis penyebab masalah
5. **Fix and Redeploy**: Perbaikan dan deployment ulang

---

## 📚 References

- [Prisma Transactions Documentation](https://www.prisma.io/docs/concepts/components/prisma-client/transactions)
- [Database Transaction Best Practices](https://docs.microsoft.com/en-us/sql/relational-databases/sql-server-transaction-locking-and-row-versioning-guide)
- [Optimistic Locking Patterns](https://martinfowler.com/eaaCatalog/optimisticOfflineLock.html)
- [Error Handling in Distributed Systems](https://aws.amazon.com/builders-library/implementing-health-checks/)

---

**Status**: 📋 Ready for Implementation  
**Priority**: 🔥 Critical  
**Estimated Effort**: 2-3 Sprint (4-6 weeks)  
**Risk Level**: 🟡 Medium (dengan proper testing)