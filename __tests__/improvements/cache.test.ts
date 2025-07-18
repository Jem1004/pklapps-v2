import { describe, it, expect, beforeEach } from 'vitest'
import { 
  invalidateGlobalWaktuAbsensiCache, 
  getWaktuAbsensiCacheStats,
  cleanExpiredWaktuAbsensiCache
} from '@/lib/cache/waktuAbsensi'

describe('Cache Improvements', () => {
  beforeEach(() => {
    invalidateGlobalWaktuAbsensiCache()
  })
  
  it('should invalidate cache properly', () => {
    invalidateGlobalWaktuAbsensiCache()
    const stats = getWaktuAbsensiCacheStats()
    
    expect(stats.cached).toBe(false)
    expect(stats.expiry).toBe(null)
    expect(stats.setting).toBe(null)
  })
  
  it('should clean expired cache', () => {
    cleanExpiredWaktuAbsensiCache()
    const stats = getWaktuAbsensiCacheStats()
    
    expect(stats.cached).toBe(false)
  })
})