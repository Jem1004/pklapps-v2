import type { WaktuAbsensiSetting } from '@/types/features/waktuAbsensi';
import { prisma } from '@/lib/prisma';

// Cache pengaturan waktu absensi global untuk mengurangi database queries
let globalWaktuAbsensiCache: WaktuAbsensiSetting | null = null;
let cacheExpiry: number | null = null;

// Cache TTL: 1 menit (dalam milliseconds) - optimized for real-time consistency
const CACHE_TTL = 1 * 60 * 1000;

/**
 * Mendapatkan pengaturan waktu absensi global dengan caching
 */
export async function getCachedGlobalWaktuAbsensiSetting(): Promise<WaktuAbsensiSetting | null> {
  // Check cache first
  if (globalWaktuAbsensiCache && cacheExpiry) {
    // Check if cache is still valid
    if (Date.now() < cacheExpiry) {
      return globalWaktuAbsensiCache;
    } else {
      // Cache expired, remove it
      globalWaktuAbsensiCache = null;
      cacheExpiry = null;
    }
  }
  
  // Fetch from database and cache
  try {
    const setting = await prisma.waktuAbsensiSetting.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });
    
    if (setting) {
      globalWaktuAbsensiCache = setting;
      cacheExpiry = Date.now() + CACHE_TTL;
    }
    
    return setting;
  } catch (error) {
    console.error('Error fetching global waktu absensi setting from cache:', error);
    return null;
  }
}

/**
 * Invalidate global cache when settings are updated
 * Enhanced with immediate cache cleanup and broadcast capability
 */
export function invalidateGlobalWaktuAbsensiCache(): void {
  globalWaktuAbsensiCache = null;
  cacheExpiry = null;
  
  // Force immediate cache cleanup
  cleanExpiredWaktuAbsensiCache();
  
  // Log cache invalidation for debugging
  console.info('Global waktu absensi cache invalidated at:', new Date().toISOString());
}



/**
 * Get cache statistics
 */
export function getWaktuAbsensiCacheStats(): {
  cached: boolean;
  expiry: number | null;
  setting: WaktuAbsensiSetting | null;
} {
  return {
    cached: globalWaktuAbsensiCache !== null,
    expiry: cacheExpiry,
    setting: globalWaktuAbsensiCache
  };
}

/**
 * Preload global cache
 */
export async function preloadGlobalWaktuAbsensiCache(): Promise<void> {
  if (!globalWaktuAbsensiCache) {
    await getCachedGlobalWaktuAbsensiSetting();
  }
}

/**
 * Clean expired cache entries
 */
export function cleanExpiredWaktuAbsensiCache(): void {
  const now = Date.now();
  
  if (cacheExpiry && now >= cacheExpiry) {
    globalWaktuAbsensiCache = null;
    cacheExpiry = null;
  }
}

// Auto cleanup expired cache every 10 minutes
setInterval(cleanExpiredWaktuAbsensiCache, 10 * 60 * 1000);