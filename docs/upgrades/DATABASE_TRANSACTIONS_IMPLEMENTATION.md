# Database Transactions Implementation Guide

## Overview
Panduan implementasi lengkap untuk upgrade Database Transactions pada sistem absensi PKL. Dokumen ini menjelaskan langkah-langkah untuk menjalankan, menguji, dan memverifikasi implementasi.

## Files Created/Modified

### Core Transaction Files
- `lib/database/transactions.ts` - Utilities untuk database transactions
- `lib/database/optimisticLocking.ts` - Implementasi optimistic locking
- `lib/errors/TransactionError.ts` - Error classes untuk transactions
- `lib/config/transactions.ts` - Konfigurasi transactions
- `lib/monitoring/transactionMetrics.ts` - Monitoring dan metrics

### Updated Application Files
- `prisma/schema.prisma` - Added version fields to Absensi and SettingAbsensi
- `app/absensi/actions.ts` - Updated submitAbsensi with transactions
- `hooks/useAbsensi.ts` - Updated to support new API
- `types/features/absensi.ts` - Updated types for TipeAbsensi
- `components/forms/AbsensiForm.tsx` - Updated form to use FormData

### Test Files
- `__tests__/database/transactions.test.ts` - Tests for transaction utilities
- `__tests__/database/optimisticLocking.test.ts` - Tests for optimistic locking
- `__tests__/actions/submitAbsensi.test.ts` - Tests for submitAbsensi action

### Migration Files
- `prisma/migrations/20241220_add_version_fields/migration.sql` - Database migration

## Implementation Steps

### 1. Database Migration

```bash
# Apply the database migration
npx prisma migrate deploy

# Or for development
npx prisma migrate dev

# Verify migration
npx prisma db pull
```

### 2. Install Dependencies (if needed)

```bash
# Ensure all dependencies are installed
npm install

# Install testing dependencies if not present
npm install -D vitest @vitest/ui
```

### 3. Environment Configuration

Add to your `.env` file:

```env
# Transaction Configuration
TRANSACTION_TIMEOUT=10000
TRANSACTION_MAX_RETRIES=3
TRANSACTION_BASE_DELAY=100
TRANSACTION_ENABLE_METRICS=true

# Monitoring
TRANSACTION_METRICS_ENABLED=true
TRANSACTION_LOG_LEVEL=info
```

### 4. Run Tests

```bash
# Run all transaction-related tests
npm run test __tests__/database/
npm run test __tests__/actions/submitAbsensi.test.ts

# Run with coverage
npm run test:coverage

# Run specific test suites
npm run test transactions.test.ts
npm run test optimisticLocking.test.ts
```

### 5. Build and Start Application

```bash
# Build the application
npm run build

# Start in production mode
npm start

# Or start in development mode
npm run dev
```

## Verification Checklist

### ✅ Database Schema
- [ ] `version` field added to `Absensi` table
- [ ] `version` field added to `SettingAbsensi` table
- [ ] Indexes created for version fields
- [ ] Migration applied successfully

### ✅ Transaction Implementation
- [ ] `withTransaction` function works correctly
- [ ] `withRetryTransaction` handles retries properly
- [ ] `withBatchTransaction` processes multiple operations
- [ ] Error handling works for all transaction types

### ✅ Optimistic Locking
- [ ] `updateWithOptimisticLock` prevents concurrent modifications
- [ ] Version conflicts are detected and handled
- [ ] Retry mechanisms work for version conflicts
- [ ] Batch updates handle partial failures correctly

### ✅ Error Handling
- [ ] `TransactionError` classes are properly defined
- [ ] Specific error types (Deadlock, Concurrency, etc.) work
- [ ] Error categorization and retry logic function correctly
- [ ] User-friendly error messages are displayed

### ✅ Configuration
- [ ] Transaction timeouts are configurable
- [ ] Retry strategies can be customized
- [ ] Environment-based configuration works
- [ ] Different configurations for different operations

### ✅ Monitoring
- [ ] Transaction metrics are collected
- [ ] Performance monitoring works
- [ ] Error tracking functions properly
- [ ] Health status reporting is accurate

### ✅ Application Integration
- [ ] `submitAbsensi` uses new transaction system
- [ ] Form submission works with FormData
- [ ] UI components handle new API correctly
- [ ] Type safety is maintained throughout

## Testing Scenarios

### 1. Basic Functionality
```bash
# Test normal attendance submission
curl -X POST http://localhost:3000/api/absensi \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "pin=1234&tipe=MASUK"
```

### 2. Concurrency Testing
```javascript
// Simulate concurrent attendance submissions
const promises = Array.from({ length: 10 }, () => 
  fetch('/api/absensi', {
    method: 'POST',
    body: new FormData({
      pin: '1234',
      tipe: 'MASUK'
    })
  })
)

const results = await Promise.allSettled(promises)
console.log('Concurrent results:', results)
```

### 3. Error Simulation
```javascript
// Test with invalid PIN
const invalidResult = await fetch('/api/absensi', {
  method: 'POST',
  body: new FormData({
    pin: '9999',
    tipe: 'MASUK'
  })
})

// Test duplicate attendance
const duplicateResult = await fetch('/api/absensi', {
  method: 'POST',
  body: new FormData({
    pin: '1234',
    tipe: 'MASUK'
  })
})
```

## Performance Monitoring

### 1. Transaction Metrics
```javascript
import { getTransactionMonitor } from '@/lib/monitoring/transactionMetrics'

const monitor = getTransactionMonitor()
const metrics = monitor.getMetrics()

console.log('Transaction Metrics:', {
  total: metrics.total,
  successful: metrics.successful,
  failed: metrics.failed,
  retried: metrics.retried,
  averageExecutionTime: metrics.averageExecutionTime,
  errorsByType: metrics.errorsByType
})
```

### 2. Health Check
```javascript
const healthStatus = monitor.getHealthStatus()
console.log('Health Status:', {
  isHealthy: healthStatus.isHealthy,
  successRate: healthStatus.successRate,
  averageResponseTime: healthStatus.averageResponseTime,
  issues: healthStatus.issues
})
```

## Troubleshooting

### Common Issues

1. **Migration Fails**
   ```bash
   # Reset and reapply migration
   npx prisma migrate reset
   npx prisma migrate deploy
   ```

2. **Version Conflicts**
   ```javascript
   // Check for version mismatches in logs
   console.log('OptimisticLockError: Version conflict detected')
   // Verify retry logic is working
   ```

3. **Transaction Timeouts**
   ```javascript
   // Increase timeout in configuration
   const config = {
     timeout: 20000, // Increase from 10000
     maxRetries: 5   // Increase retries
   }
   ```

4. **Performance Issues**
   ```javascript
   // Monitor transaction execution times
   const metrics = getTransactionMonitor().getMetrics()
   if (metrics.averageExecutionTime > 1000) {
     console.warn('Slow transactions detected')
   }
   ```

### Debug Mode

Enable debug logging:

```env
NODE_ENV=development
TRANSACTION_LOG_LEVEL=debug
TRANSACTION_ENABLE_METRICS=true
```

## Rollback Plan

If issues occur, follow these steps:

1. **Disable New Features**
   ```javascript
   // Temporarily disable transaction features
   const USE_TRANSACTIONS = false
   ```

2. **Revert Database Changes**
   ```sql
   -- Remove version columns if needed
   ALTER TABLE "absensis" DROP COLUMN "version";
   ALTER TABLE "setting_absensis" DROP COLUMN "version";
   ```

3. **Restore Previous Code**
   ```bash
   git revert <commit-hash>
   npm run build
   npm start
   ```

## Success Metrics

- ✅ 100% data consistency (no partial updates)
- ✅ 95%+ error recovery rate
- ✅ 100% concurrent operation safety
- ✅ <500ms average transaction time
- ✅ <1% transaction failure rate
- ✅ Zero data corruption incidents

## Next Steps

1. **Monitor Production**
   - Track transaction metrics
   - Monitor error rates
   - Analyze performance impact

2. **Optimize Performance**
   - Fine-tune retry strategies
   - Optimize database queries
   - Implement connection pooling

3. **Extend to Other Features**
   - Apply transactions to journal operations
   - Implement for user management
   - Add to reporting features

## Support

For issues or questions:
- Check logs in `/logs/transactions.log`
- Review metrics dashboard
- Contact development team
- Refer to Prisma documentation for advanced transaction features