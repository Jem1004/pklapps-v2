/**
 * Offline storage utilities for jurnal system
 * Extends the attendance offline system for jurnal submissions
 */

export interface OfflineJurnalData {
  id: string
  studentId: string
  tanggal: Date
  kegiatan: string
  keterangan?: string
  dokumentasi?: string
  timestamp: number
  timezone: string
  retryCount: number
  lastRetry?: number
  status: 'pending' | 'syncing' | 'failed' | 'synced'
  deviceInfo: {
    userAgent: string
    platform: string
    language: string
  }
}

export interface JurnalSyncResult {
  success: boolean
  syncedCount: number
  failedCount: number
  errors: string[]
  duration: number
}

export interface OfflineJurnalConfig {
  maxQueueSize: number
  maxRetries: number
  retryDelay: number
  syncInterval: number
  storageKey: string
}

const DEFAULT_JURNAL_CONFIG: OfflineJurnalConfig = {
  maxQueueSize: 30, // Smaller than attendance since jurnal data is larger
  maxRetries: 3,
  retryDelay: 5000,
  syncInterval: 60000, // 1 minute
  storageKey: 'jurnal_offline_queue'
}

/**
 * Offline Storage Manager for jurnal data
 */
export class OfflineJurnalManager {
  private config: OfflineJurnalConfig
  private syncTimer: NodeJS.Timeout | null = null
  private isSyncing = false
  
  constructor(config: Partial<OfflineJurnalConfig> = {}) {
    this.config = { ...DEFAULT_JURNAL_CONFIG, ...config }
  }
  
  /**
   * Check if browser storage is available
   */
  isStorageAvailable(): boolean {
    if (typeof window === 'undefined') {
      return false
    }
    
    try {
      const test = '__jurnal_offline_test__'
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      return true
    } catch {
      return false
    }
  }
  
  /**
   * Check if device is online
   */
  isOnline(): boolean {
    return typeof navigator !== 'undefined' ? navigator.onLine : true
  }
  
  /**
   * Store jurnal data for offline sync
   */
  storeOfflineJurnal(jurnalData: Omit<OfflineJurnalData, 'id' | 'retryCount' | 'status' | 'deviceInfo'>): boolean {
    if (!this.isStorageAvailable()) {
      return false
    }
    
    try {
      const queue = this.getOfflineQueue()
      
      // Check queue size limit
      if (queue.length >= this.config.maxQueueSize) {
        // Remove oldest item
        queue.shift()
      }
      
      const offlineData: OfflineJurnalData = {
        ...jurnalData,
        id: this.generateId(),
        retryCount: 0,
        status: 'pending',
        deviceInfo: this.getDeviceInfo()
      }
      
      queue.push(offlineData)
      localStorage.setItem(this.config.storageKey, JSON.stringify(queue))
      
      console.info('Jurnal stored offline:', offlineData.id)
      return true
    } catch (error) {
      console.error('Failed to store jurnal offline:', error)
      return false
    }
  }
  
  /**
   * Get offline queue
   */
  getOfflineQueue(): OfflineJurnalData[] {
    if (!this.isStorageAvailable()) {
      return []
    }
    
    try {
      const stored = localStorage.getItem(this.config.storageKey)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }
  
  /**
   * Update offline queue
   */
  private updateOfflineQueue(queue: OfflineJurnalData[]): boolean {
    if (!this.isStorageAvailable()) {
      return false
    }
    
    try {
      localStorage.setItem(this.config.storageKey, JSON.stringify(queue))
      return true
    } catch {
      return false
    }
  }
  
  /**
   * Remove item from offline queue
   */
  removeFromQueue(id: string): boolean {
    const queue = this.getOfflineQueue()
    const filteredQueue = queue.filter(item => item.id !== id)
    return this.updateOfflineQueue(filteredQueue)
  }
  
  /**
   * Clear offline queue
   */
  clearQueue(): boolean {
    if (!this.isStorageAvailable()) {
      return false
    }
    
    try {
      localStorage.removeItem(this.config.storageKey)
      return true
    } catch {
      return false
    }
  }
  
  /**
   * Sync offline jurnal data with server
   */
  async syncOfflineData(
    syncFunction: (data: OfflineJurnalData) => Promise<boolean>
  ): Promise<JurnalSyncResult> {
    if (this.isSyncing) {
      return {
        success: false,
        syncedCount: 0,
        failedCount: 0,
        errors: ['Sync already in progress'],
        duration: 0
      }
    }
    
    if (!this.isOnline()) {
      return {
        success: false,
        syncedCount: 0,
        failedCount: 0,
        errors: ['Device is offline'],
        duration: 0
      }
    }
    
    this.isSyncing = true
    const startTime = Date.now()
    const result: JurnalSyncResult = {
      success: true,
      syncedCount: 0,
      failedCount: 0,
      errors: [],
      duration: 0
    }
    
    try {
      const queue = this.getOfflineQueue()
      const pendingItems = queue.filter(item => item.status === 'pending' || item.status === 'failed')
      
      for (const item of pendingItems) {
        try {
          // Update status to syncing
          item.status = 'syncing'
          this.updateOfflineQueue(queue)
          
          const success = await syncFunction(item)
          
          if (success) {
            item.status = 'synced'
            result.syncedCount++
            
            // Remove synced item from queue
            this.removeFromQueue(item.id)
          } else {
            item.status = 'failed'
            item.retryCount++
            item.lastRetry = Date.now()
            result.failedCount++
            
            if (item.retryCount >= this.config.maxRetries) {
              result.errors.push(`Max retries exceeded for jurnal ${item.id}`)
            }
          }
        } catch (error) {
          item.status = 'failed'
          item.retryCount++
          item.lastRetry = Date.now()
          result.failedCount++
          result.errors.push(`Sync failed for jurnal ${item.id}: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
        
        this.updateOfflineQueue(queue)
      }
    } catch (error) {
      result.success = false
      result.errors.push(`Sync process failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      this.isSyncing = false
      result.duration = Date.now() - startTime
    }
    
    return result
  }
  
  /**
   * Start automatic sync
   */
  startAutoSync(syncFunction: (data: OfflineJurnalData) => Promise<boolean>): void {
    if (this.syncTimer) {
      this.stopAutoSync()
    }
    
    this.syncTimer = setInterval(async () => {
      if (this.isOnline() && !this.isSyncing) {
        const queue = this.getOfflineQueue()
        const pendingItems = queue.filter(item => item.status === 'pending' || item.status === 'failed')
        
        if (pendingItems.length > 0) {
          console.info('Auto-syncing', pendingItems.length, 'jurnal items')
          await this.syncOfflineData(syncFunction)
        }
      }
    }, this.config.syncInterval)
  }
  
  /**
   * Stop automatic sync
   */
  stopAutoSync(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer)
      this.syncTimer = null
    }
  }
  
  /**
   * Get sync statistics
   */
  getSyncStats() {
    const queue = this.getOfflineQueue()
    
    return {
      totalItems: queue.length,
      pendingItems: queue.filter(item => item.status === 'pending').length,
      syncingItems: queue.filter(item => item.status === 'syncing').length,
      failedItems: queue.filter(item => item.status === 'failed').length,
      syncedItems: queue.filter(item => item.status === 'synced').length,
      oldestItem: queue.length > 0 ? new Date(Math.min(...queue.map(item => item.timestamp))) : null,
      newestItem: queue.length > 0 ? new Date(Math.max(...queue.map(item => item.timestamp))) : null,
      isOnline: this.isOnline(),
      isSyncing: this.isSyncing,
      autoSyncEnabled: this.syncTimer !== null
    }
  }
  
  /**
   * Generate unique ID for offline items
   */
  private generateId(): string {
    return `jurnal_offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
  
  /**
   * Get device information
   */
  private getDeviceInfo() {
    if (typeof navigator === 'undefined') {
      return {
        userAgent: 'Unknown',
        platform: 'Unknown',
        language: 'Unknown'
      }
    }
    
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language
    }
  }
}

/**
 * Default offline jurnal manager instance
 */
export const offlineJurnalStorage = new OfflineJurnalManager()

/**
 * Hook for offline jurnal functionality
 */
export function useOfflineJurnal() {
  const storeOfflineJurnal = (data: Omit<OfflineJurnalData, 'id' | 'retryCount' | 'status' | 'deviceInfo'>) => 
    offlineJurnalStorage.storeOfflineJurnal(data)
  
  const getOfflineQueue = () => offlineJurnalStorage.getOfflineQueue()
  const clearQueue = () => offlineJurnalStorage.clearQueue()
  const getSyncStats = () => offlineJurnalStorage.getSyncStats()
  const isOnline = () => offlineJurnalStorage.isOnline()
  const isStorageAvailable = () => offlineJurnalStorage.isStorageAvailable()
  
  return {
    storeOfflineJurnal,
    getOfflineQueue,
    clearQueue,
    getSyncStats,
    isOnline,
    isStorageAvailable,
    syncOfflineData: offlineJurnalStorage.syncOfflineData.bind(offlineJurnalStorage),
    startAutoSync: offlineJurnalStorage.startAutoSync.bind(offlineJurnalStorage),
    stopAutoSync: offlineJurnalStorage.stopAutoSync.bind(offlineJurnalStorage)
  }
}