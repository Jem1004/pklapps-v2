/**
 * Caching strategy implementation for improved application performance
 * This module provides various caching mechanisms for different data types
 */

interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number // Time to live in milliseconds
}

class MemoryCache {
  private cache = new Map<string, CacheItem<any>>()
  private maxSize: number
  private cleanupInterval: NodeJS.Timeout

  constructor(maxSize = 1000, cleanupIntervalMs = 5 * 60 * 1000) {
    this.maxSize = maxSize
    
    // Cleanup expired items every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, cleanupIntervalMs)
  }

  set<T>(key: string, data: T, ttlMs = 5 * 60 * 1000): void {
    // Remove oldest items if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value
      if (firstKey) {
        this.cache.delete(firstKey)
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs
    })
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key)
    
    if (!item) {
      return null
    }

    // Check if item has expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.data as T
  }

  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  private cleanup(): void {
    const now = Date.now()
    const keysToDelete: string[] = []

    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        keysToDelete.push(key)
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key))
    
    if (keysToDelete.length > 0) {
      console.log(`Cache cleanup: removed ${keysToDelete.length} expired items`)
    }
  }

  getStats(): {
    size: number
    maxSize: number
    hitRate: number
  } {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: 0 // Would need to track hits/misses for accurate calculation
    }
  }

  destroy(): void {
    clearInterval(this.cleanupInterval)
    this.cache.clear()
  }
}

// Global cache instance
const globalCache = new MemoryCache()

// Cache key generators
export const cacheKeys = {
  dashboard: () => 'dashboard:stats',
  students: (filters?: { kelas?: string; page?: number; limit?: number }) => {
    const filterStr = filters ? JSON.stringify(filters) : 'all'
    return `students:${filterStr}`
  },
  student: (id: string) => `student:${id}`,
  jurnals: (filters?: { studentId?: string; startDate?: string; endDate?: string; page?: number }) => {
    const filterStr = filters ? JSON.stringify(filters) : 'all'
    return `jurnals:${filterStr}`
  },
  jurnal: (id: string) => `jurnal:${id}`,
  absensi: (filters?: { studentId?: string; startDate?: string; endDate?: string; page?: number }) => {
    const filterStr = filters ? JSON.stringify(filters) : 'all'
    return `absensi:${filterStr}`
  },
  tempatPkl: () => 'tempat-pkl:all',
  teachers: () => 'teachers:all',
  userProfile: (userId: string) => `user:profile:${userId}`
}

// Cache TTL configurations (in milliseconds)
export const cacheTTL = {
  dashboard: 2 * 60 * 1000,      // 2 minutes
  students: 5 * 60 * 1000,       // 5 minutes
  student: 10 * 60 * 1000,       // 10 minutes
  jurnals: 1 * 60 * 1000,        // 1 minute
  jurnal: 5 * 60 * 1000,         // 5 minutes
  absensi: 1 * 60 * 1000,        // 1 minute
  tempatPkl: 30 * 60 * 1000,     // 30 minutes
  teachers: 15 * 60 * 1000,      // 15 minutes
  userProfile: 10 * 60 * 1000    // 10 minutes
}

// Cache wrapper function
export async function withCache<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl?: number
): Promise<T> {
  // Try to get from cache first
  const cached = globalCache.get<T>(key)
  if (cached !== null) {
    return cached
  }

  // Fetch fresh data
  const data = await fetchFn()
  
  // Store in cache
  globalCache.set(key, data, ttl)
  
  return data
}

// Cache invalidation helpers
export const cacheInvalidation = {
  // Invalidate all student-related caches
  invalidateStudents(): void {
    const keysToDelete: string[] = []
    
    // This is a simplified approach - in production, you might want to use patterns
    for (const key of ['students:', 'student:', 'dashboard:']) {
      keysToDelete.push(key)
    }
    
    keysToDelete.forEach(key => globalCache.delete(key))
  },

  // Invalidate jurnal-related caches
  invalidateJurnals(studentId?: string): void {
    globalCache.delete(cacheKeys.jurnals())
    globalCache.delete(cacheKeys.dashboard())
    
    if (studentId) {
      globalCache.delete(cacheKeys.student(studentId))
    }
  },

  // Invalidate absensi-related caches
  invalidateAbsensi(studentId?: string): void {
    globalCache.delete(cacheKeys.absensi())
    globalCache.delete(cacheKeys.dashboard())
    
    if (studentId) {
      globalCache.delete(cacheKeys.student(studentId))
    }
  },

  // Invalidate dashboard cache
  invalidateDashboard(): void {
    globalCache.delete(cacheKeys.dashboard())
  },

  // Clear all caches
  clearAll(): void {
    globalCache.clear()
  }
}

// Cached query helpers
export const cachedQueries = {
  // Dashboard with caching
  async getDashboardStats(fetchFn: () => Promise<any>) {
    return withCache(
      cacheKeys.dashboard(),
      fetchFn,
      cacheTTL.dashboard
    )
  },

  // Students with caching
  async getStudents(
    fetchFn: () => Promise<any>,
    filters?: { kelas?: string; page?: number; limit?: number }
  ) {
    return withCache(
      cacheKeys.students(filters),
      fetchFn,
      cacheTTL.students
    )
  },

  // Single student with caching
  async getStudent(id: string, fetchFn: () => Promise<any>) {
    return withCache(
      cacheKeys.student(id),
      fetchFn,
      cacheTTL.student
    )
  },

  // Jurnals with caching
  async getJurnals(
    fetchFn: () => Promise<any>,
    filters?: { studentId?: string; startDate?: string; endDate?: string; page?: number }
  ) {
    return withCache(
      cacheKeys.jurnals(filters),
      fetchFn,
      cacheTTL.jurnals
    )
  },

  // Absensi with caching
  async getAbsensi(
    fetchFn: () => Promise<any>,
    filters?: { studentId?: string; startDate?: string; endDate?: string; page?: number }
  ) {
    return withCache(
      cacheKeys.absensi(filters),
      fetchFn,
      cacheTTL.absensi
    )
  },

  // Tempat PKL with caching
  async getTempatPkl(fetchFn: () => Promise<any>) {
    return withCache(
      cacheKeys.tempatPkl(),
      fetchFn,
      cacheTTL.tempatPkl
    )
  },

  // Teachers with caching
  async getTeachers(fetchFn: () => Promise<any>) {
    return withCache(
      cacheKeys.teachers(),
      fetchFn,
      cacheTTL.teachers
    )
  },

  // User profile with caching
  async getUserProfile(userId: string, fetchFn: () => Promise<any>) {
    return withCache(
      cacheKeys.userProfile(userId),
      fetchFn,
      cacheTTL.userProfile
    )
  }
}

// Export cache instance for direct access if needed
export { globalCache }

// Cache monitoring
export const cacheMonitoring = {
  getStats() {
    return globalCache.getStats()
  },
  
  logStats() {
    const stats = globalCache.getStats()
    console.log('Cache Stats:', {
      size: stats.size,
      maxSize: stats.maxSize,
      usage: `${((stats.size / stats.maxSize) * 100).toFixed(1)}%`
    })
  }
}

// Cleanup on process exit
process.on('beforeExit', () => {
  globalCache.destroy()
})