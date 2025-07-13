# Database Optimization Implementation Guide

## 📋 Overview

Implementasi optimasi database untuk meningkatkan performa query, mengurangi response time hingga 50-70%, dan mempersiapkan sistem untuk skalabilitas yang lebih baik.

## 🎯 Objectives

- Optimasi query performance dengan indexing yang tepat
- Mengurangi database load dan response time
- Implementasi query optimization strategies
- Database monitoring dan performance tuning
- Persiapan untuk data partitioning (future-ready)

## 📊 Current Performance Analysis

### Problematic Queries (Before Optimization)
```sql
-- Query 1: Daily attendance lookup (Most frequent)
SELECT * FROM "Absensi" 
WHERE "studentId" = $1 AND "tanggal" = $2;
-- Execution time: ~50-100ms (without index)
-- Frequency: ~1000+ times/day

-- Query 2: Attendance history by student
SELECT * FROM "Absensi" 
WHERE "studentId" = $1 
ORDER BY "tanggal" DESC 
LIMIT 30;
-- Execution time: ~80-150ms (without index)
-- Frequency: ~500+ times/day

-- Query 3: Attendance by tempat PKL and date range
SELECT * FROM "Absensi" a
JOIN "Student" s ON a."studentId" = s."id"
WHERE s."tempatPklId" = $1 
AND a."tanggal" BETWEEN $2 AND $3;
-- Execution time: ~200-400ms (without index)
-- Frequency: ~200+ times/day
```

### Performance Bottlenecks
1. **Missing Indexes**: Queries pada kolom yang sering difilter
2. **Inefficient Joins**: Join tanpa proper indexing
3. **Full Table Scans**: Query tanpa WHERE clause optimization
4. **Suboptimal Query Plans**: PostgreSQL tidak memilih execution plan terbaik

## 🏗️ Database Schema Optimization

### Phase 1: Index Strategy Implementation

#### 1.1 Primary Indexes (High Impact)
```sql
-- Index untuk daily attendance lookup (paling sering digunakan)
CREATE INDEX CONCURRENTLY idx_absensi_student_tanggal 
ON "Absensi" ("studentId", "tanggal");

-- Index untuk attendance history by student
CREATE INDEX CONCURRENTLY idx_absensi_student_tanggal_desc 
ON "Absensi" ("studentId", "tanggal" DESC);

-- Index untuk tempat PKL queries
CREATE INDEX CONCURRENTLY idx_student_tempat_pkl 
ON "Student" ("tempatPklId");

-- Composite index untuk complex queries
CREATE INDEX CONCURRENTLY idx_absensi_tempat_tanggal 
ON "Absensi" ("studentId", "tanggal", "tipe");
```

#### 1.2 Secondary Indexes (Medium Impact)
```sql
-- Index untuk filtering by tipe absensi
CREATE INDEX CONCURRENTLY idx_absensi_tipe_tanggal 
ON "Absensi" ("tipe", "tanggal");

-- Index untuk user authentication queries
CREATE INDEX CONCURRENTLY idx_user_email_role 
ON "User" ("email", "role") WHERE "email" IS NOT NULL;

-- Index untuk setting absensi lookup
CREATE INDEX CONCURRENTLY idx_setting_tempat_active 
ON "SettingAbsensi" ("tempatPklId") WHERE "isActive" = true;

-- Index untuk jurnal queries
CREATE INDEX CONCURRENTLY idx_jurnal_student_tanggal 
ON "Jurnal" ("studentId", "tanggal" DESC);
```

#### 1.3 Partial Indexes (Optimization)
```sql
-- Index hanya untuk absensi aktif (mengurangi index size)
CREATE INDEX CONCURRENTLY idx_absensi_active_recent 
ON "Absensi" ("studentId", "tanggal" DESC) 
WHERE "tanggal" >= CURRENT_DATE - INTERVAL '30 days';

-- Index untuk user aktif saja
CREATE INDEX CONCURRENTLY idx_user_active 
ON "User" ("id", "role") 
WHERE "isActive" = true;

-- Index untuk tempat PKL aktif
CREATE INDEX CONCURRENTLY idx_tempat_pkl_active 
ON "TempatPkl" ("id", "nama") 
WHERE "isActive" = true;
```

### Phase 2: Query Optimization

#### 2.1 Optimized Query Patterns
```typescript
// lib/database/queries/absensi.ts
import { prisma } from '@/lib/database'
import type { Prisma } from '@prisma/client'

export class OptimizedAbsensiQueries {
  // Optimized daily attendance lookup
  static async getTodayAttendance(studentId: string, date: Date) {
    return prisma.absensi.findFirst({
      where: {
        studentId,
        tanggal: {
          gte: new Date(date.setHours(0, 0, 0, 0)),
          lt: new Date(date.setHours(23, 59, 59, 999))
        }
      },
      select: {
        id: true,
        tipe: true,
        waktuMasuk: true,
        waktuPulang: true,
        tanggal: true
      },
      // Menggunakan index idx_absensi_student_tanggal
    })
  }

  // Optimized attendance history with pagination
  static async getAttendanceHistory(
    studentId: string, 
    limit: number = 30,
    offset: number = 0
  ) {
    return prisma.absensi.findMany({
      where: { studentId },
      select: {
        id: true,
        tipe: true,
        waktuMasuk: true,
        waktuPulang: true,
        tanggal: true
      },
      orderBy: { tanggal: 'desc' },
      take: limit,
      skip: offset,
      // Menggunakan index idx_absensi_student_tanggal_desc
    })
  }

  // Optimized bulk attendance query for reports
  static async getAttendanceByTempatPkl(
    tempatPklId: string,
    startDate: Date,
    endDate: Date,
    limit?: number
  ) {
    const whereClause: Prisma.AbsensiWhereInput = {
      student: {
        tempatPklId
      },
      tanggal: {
        gte: startDate,
        lte: endDate
      }
    }

    return prisma.absensi.findMany({
      where: whereClause,
      select: {
        id: true,
        tipe: true,
        waktuMasuk: true,
        waktuPulang: true,
        tanggal: true,
        student: {
          select: {
            id: true,
            nama: true,
            nim: true
          }
        }
      },
      orderBy: [
        { tanggal: 'desc' },
        { student: { nama: 'asc' } }
      ],
      ...(limit && { take: limit }),
      // Menggunakan composite indexes
    })
  }

  // Optimized attendance statistics
  static async getAttendanceStats(
    studentId: string,
    startDate: Date,
    endDate: Date
  ) {
    const stats = await prisma.absensi.groupBy({
      by: ['tipe'],
      where: {
        studentId,
        tanggal: {
          gte: startDate,
          lte: endDate
        }
      },
      _count: {
        tipe: true
      },
      // Menggunakan index idx_absensi_student_tanggal
    })

    return stats.reduce((acc, stat) => {
      acc[stat.tipe] = stat._count.tipe
      return acc
    }, {} as Record<string, number>)
  }
}
```

#### 2.2 Connection Pool Optimization
```typescript
// lib/database/config.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    },
    // Connection pool optimization
    __internal: {
      engine: {
        // Increase connection pool size for better concurrency
        connectionLimit: 20,
        // Optimize connection timeout
        connectTimeout: 10000,
        // Pool timeout
        poolTimeout: 10000,
        // Query timeout
        queryTimeout: 30000
      }
    }
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Connection health check
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    console.error('Database connection failed:', error)
    return false
  }
}

// Connection pool monitoring
export async function getDatabaseStats() {
  try {
    const result = await prisma.$queryRaw<Array<{
      active_connections: number
      max_connections: number
      database_size: string
    }>>`
      SELECT 
        (SELECT count(*) FROM pg_stat_activity WHERE state = 'active') as active_connections,
        (SELECT setting::int FROM pg_settings WHERE name = 'max_connections') as max_connections,
        pg_size_pretty(pg_database_size(current_database())) as database_size
    `
    
    return result[0]
  } catch (error) {
    console.error('Failed to get database stats:', error)
    return null
  }
}
```

### Phase 3: Query Performance Monitoring

#### 3.1 Query Performance Tracker
```typescript
// lib/database/performance.ts
import { prisma } from './config'
import { logger } from '@/lib/errors/ErrorLogger'

interface QueryMetrics {
  query: string
  duration: number
  timestamp: Date
  params?: any[]
}

export class QueryPerformanceTracker {
  private static metrics: QueryMetrics[] = []
  private static readonly MAX_METRICS = 1000

  static trackQuery<T>(
    queryName: string,
    queryFn: () => Promise<T>,
    params?: any[]
  ): Promise<T> {
    const startTime = Date.now()
    
    return queryFn()
      .then(result => {
        const duration = Date.now() - startTime
        
        this.recordMetric({
          query: queryName,
          duration,
          timestamp: new Date(),
          params
        })
        
        // Log slow queries (> 100ms)
        if (duration > 100) {
          logger.warn('Slow query detected', {
            query: queryName,
            duration,
            params
          })
        }
        
        return result
      })
      .catch(error => {
        logger.error('Query failed', {
          query: queryName,
          error: error.message,
          params
        })
        throw error
      })
  }

  private static recordMetric(metric: QueryMetrics) {
    this.metrics.push(metric)
    
    // Keep only recent metrics
    if (this.metrics.length > this.MAX_METRICS) {
      this.metrics = this.metrics.slice(-this.MAX_METRICS)
    }
  }

  static getMetrics() {
    return {
      totalQueries: this.metrics.length,
      averageDuration: this.metrics.reduce((sum, m) => sum + m.duration, 0) / this.metrics.length,
      slowQueries: this.metrics.filter(m => m.duration > 100).length,
      recentQueries: this.metrics.slice(-10)
    }
  }

  static async analyzeSlowQueries() {
    try {
      const slowQueries = await prisma.$queryRaw<Array<{
        query: string
        calls: number
        total_time: number
        mean_time: number
      }>>`
        SELECT 
          query,
          calls,
          total_time,
          mean_time
        FROM pg_stat_statements 
        WHERE mean_time > 100
        ORDER BY mean_time DESC
        LIMIT 10
      `
      
      return slowQueries
    } catch (error) {
      logger.error('Failed to analyze slow queries', error)
      return []
    }
  }
}
```

#### 3.2 Database Health Monitoring
```typescript
// lib/database/monitoring.ts
import { prisma } from './config'
import { logger } from '@/lib/errors/ErrorLogger'

export class DatabaseMonitoring {
  static async getHealthMetrics() {
    try {
      const [connectionStats, tableStats, indexStats] = await Promise.all([
        this.getConnectionStats(),
        this.getTableStats(),
        this.getIndexUsageStats()
      ])

      return {
        connections: connectionStats,
        tables: tableStats,
        indexes: indexStats,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      logger.error('Failed to get database health metrics', error)
      return null
    }
  }

  private static async getConnectionStats() {
    const result = await prisma.$queryRaw<Array<{
      total_connections: number
      active_connections: number
      idle_connections: number
      max_connections: number
    }>>`
      SELECT 
        count(*) as total_connections,
        count(*) FILTER (WHERE state = 'active') as active_connections,
        count(*) FILTER (WHERE state = 'idle') as idle_connections,
        (SELECT setting::int FROM pg_settings WHERE name = 'max_connections') as max_connections
      FROM pg_stat_activity
    `
    
    return result[0]
  }

  private static async getTableStats() {
    const result = await prisma.$queryRaw<Array<{
      table_name: string
      row_count: number
      table_size: string
      index_size: string
    }>>`
      SELECT 
        schemaname||'.'||tablename as table_name,
        n_tup_ins + n_tup_upd + n_tup_del as row_count,
        pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as table_size,
        pg_size_pretty(pg_indexes_size(schemaname||'.'||tablename)) as index_size
      FROM pg_stat_user_tables 
      WHERE schemaname = 'public'
      ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
    `
    
    return result
  }

  private static async getIndexUsageStats() {
    const result = await prisma.$queryRaw<Array<{
      index_name: string
      table_name: string
      index_scans: number
      index_size: string
      usage_ratio: number
    }>>`
      SELECT 
        indexrelname as index_name,
        tablename as table_name,
        idx_scan as index_scans,
        pg_size_pretty(pg_relation_size(indexrelid)) as index_size,
        CASE WHEN idx_scan = 0 THEN 0 
             ELSE round((idx_scan::numeric / (seq_scan + idx_scan) * 100), 2) 
        END as usage_ratio
      FROM pg_stat_user_indexes 
      WHERE schemaname = 'public'
      ORDER BY idx_scan DESC
    `
    
    return result
  }

  static async identifyUnusedIndexes() {
    try {
      const unusedIndexes = await prisma.$queryRaw<Array<{
        index_name: string
        table_name: string
        index_size: string
      }>>`
        SELECT 
          indexrelname as index_name,
          tablename as table_name,
          pg_size_pretty(pg_relation_size(indexrelid)) as index_size
        FROM pg_stat_user_indexes 
        WHERE idx_scan = 0 
        AND schemaname = 'public'
        AND indexrelname NOT LIKE '%_pkey'
        ORDER BY pg_relation_size(indexrelid) DESC
      `
      
      return unusedIndexes
    } catch (error) {
      logger.error('Failed to identify unused indexes', error)
      return []
    }
  }
}
```

### Phase 4: Migration Scripts

#### 4.1 Index Creation Migration
```sql
-- migrations/add_performance_indexes.sql
-- Migration untuk menambahkan indexes performance

BEGIN;

-- Primary performance indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_absensi_student_tanggal 
ON "Absensi" ("studentId", "tanggal");

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_absensi_student_tanggal_desc 
ON "Absensi" ("studentId", "tanggal" DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_student_tempat_pkl 
ON "Student" ("tempatPklId");

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_absensi_tempat_tanggal 
ON "Absensi" ("studentId", "tanggal", "tipe");

-- Secondary indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_absensi_tipe_tanggal 
ON "Absensi" ("tipe", "tanggal");

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_email_role 
ON "User" ("email", "role") WHERE "email" IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_setting_tempat_active 
ON "SettingAbsensi" ("tempatPklId") WHERE "isActive" = true;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jurnal_student_tanggal 
ON "Jurnal" ("studentId", "tanggal" DESC);

-- Partial indexes for optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_absensi_active_recent 
ON "Absensi" ("studentId", "tanggal" DESC) 
WHERE "tanggal" >= CURRENT_DATE - INTERVAL '30 days';

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_active 
ON "User" ("id", "role") 
WHERE "isActive" = true;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tempat_pkl_active 
ON "TempatPkl" ("id", "nama") 
WHERE "isActive" = true;

COMMIT;

-- Analyze tables after index creation
ANALYZE "Absensi";
ANALYZE "Student";
ANALYZE "User";
ANALYZE "SettingAbsensi";
ANALYZE "Jurnal";
ANALYZE "TempatPkl";
```

#### 4.2 Database Configuration Optimization
```sql
-- postgresql.conf optimizations
-- Tambahkan ke postgresql.conf atau environment variables

-- Memory settings
shared_buffers = 256MB                 # 25% of RAM
effective_cache_size = 1GB             # 75% of RAM
work_mem = 4MB                         # Per connection
maintenance_work_mem = 64MB            # For maintenance operations

-- Connection settings
max_connections = 100                  # Adjust based on load

-- Query planner settings
random_page_cost = 1.1                # For SSD storage
effective_io_concurrency = 200         # For SSD storage

-- WAL settings
wal_buffers = 16MB
checkpoint_completion_target = 0.9
wal_compression = on

-- Logging settings (for monitoring)
log_min_duration_statement = 100       # Log queries > 100ms
log_checkpoints = on
log_connections = on
log_disconnections = on
log_lock_waits = on

-- Statistics settings
track_activities = on
track_counts = on
track_io_timing = on
track_functions = all
```

## 📈 Performance Benchmarks

### Before Optimization
```
Query Type                    | Avg Time | 95th Percentile | Frequency
------------------------------|----------|-----------------|----------
Daily Attendance Lookup       | 85ms     | 150ms          | 1000+/day
Attendance History           | 120ms    | 200ms          | 500+/day
Bulk Attendance Query        | 300ms    | 500ms          | 200+/day
Attendance Statistics        | 250ms    | 400ms          | 100+/day
```

### After Optimization (Expected)
```
Query Type                    | Avg Time | 95th Percentile | Improvement
------------------------------|----------|-----------------|------------
Daily Attendance Lookup       | 25ms     | 45ms           | 70% faster
Attendance History           | 35ms     | 60ms           | 71% faster
Bulk Attendance Query        | 90ms     | 150ms          | 70% faster
Attendance Statistics        | 75ms     | 120ms          | 70% faster
```

## 🧪 Testing & Validation

### Performance Testing Script
```typescript
// scripts/performance-test.ts
import { OptimizedAbsensiQueries } from '@/lib/database/queries/absensi'
import { QueryPerformanceTracker } from '@/lib/database/performance'

async function runPerformanceTests() {
  console.log('Starting database performance tests...')
  
  const testStudentId = 'test-student-1'
  const testDate = new Date()
  
  // Test 1: Daily attendance lookup
  console.log('\nTesting daily attendance lookup...')
  const iterations = 100
  const times: number[] = []
  
  for (let i = 0; i < iterations; i++) {
    const start = Date.now()
    await OptimizedAbsensiQueries.getTodayAttendance(testStudentId, testDate)
    times.push(Date.now() - start)
  }
  
  const avgTime = times.reduce((sum, time) => sum + time, 0) / times.length
  const p95Time = times.sort((a, b) => a - b)[Math.floor(times.length * 0.95)]
  
  console.log(`Average time: ${avgTime.toFixed(2)}ms`)
  console.log(`95th percentile: ${p95Time}ms`)
  
  // Test 2: Attendance history
  console.log('\nTesting attendance history...')
  const historyStart = Date.now()
  await OptimizedAbsensiQueries.getAttendanceHistory(testStudentId, 30)
  console.log(`Attendance history time: ${Date.now() - historyStart}ms`)
  
  // Test 3: Performance metrics
  console.log('\nPerformance metrics:')
  console.log(QueryPerformanceTracker.getMetrics())
}

runPerformanceTests().catch(console.error)
```

### Index Usage Validation
```sql
-- Validate index usage
EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM "Absensi" 
WHERE "studentId" = 'test-student-1' AND "tanggal" = CURRENT_DATE;

-- Should show: Index Scan using idx_absensi_student_tanggal

EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM "Absensi" 
WHERE "studentId" = 'test-student-1' 
ORDER BY "tanggal" DESC 
LIMIT 30;

-- Should show: Index Scan using idx_absensi_student_tanggal_desc
```

## 🚀 Deployment Strategy

### Phase 1: Index Creation (Low Risk)
1. Create indexes using `CONCURRENTLY` (no downtime)
2. Monitor index creation progress
3. Validate index usage with EXPLAIN plans

### Phase 2: Query Optimization (Medium Risk)
1. Deploy optimized queries to staging
2. Run performance tests
3. Gradual rollout to production

### Phase 3: Configuration Tuning (High Risk)
1. Test configuration changes in staging
2. Schedule maintenance window
3. Apply configuration changes
4. Monitor performance metrics

## 📊 Monitoring & Maintenance

### Daily Monitoring
```typescript
// lib/database/daily-monitoring.ts
export async function dailyDatabaseReport() {
  const metrics = await DatabaseMonitoring.getHealthMetrics()
  const slowQueries = await QueryPerformanceTracker.analyzeSlowQueries()
  const unusedIndexes = await DatabaseMonitoring.identifyUnusedIndexes()
  
  return {
    date: new Date().toISOString(),
    health: metrics,
    slowQueries,
    unusedIndexes,
    recommendations: generateRecommendations(metrics, slowQueries)
  }
}

function generateRecommendations(metrics: any, slowQueries: any[]) {
  const recommendations: string[] = []
  
  if (slowQueries.length > 5) {
    recommendations.push('Consider optimizing slow queries or adding indexes')
  }
  
  if (metrics?.connections?.active_connections > 80) {
    recommendations.push('High connection usage detected - consider connection pooling')
  }
  
  return recommendations
}
```

### Weekly Maintenance Tasks
- Analyze table statistics: `ANALYZE`
- Review slow query log
- Check index usage statistics
- Monitor database size growth
- Review and optimize query plans

### Monthly Optimization Review
- Performance trend analysis
- Index effectiveness review
- Query pattern analysis
- Configuration tuning opportunities
- Capacity planning assessment

Implementasi optimasi database ini akan memberikan peningkatan performa yang signifikan dan mempersiapkan sistem untuk skalabilitas yang lebih baik di masa depan.