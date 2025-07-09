/**
 * Offline storage utilities for attendance system
 * Handles offline data storage, synchronization, and queue management
 */

export interface OfflineAttendanceData {
  id: string
  userId: string
  pin: string
  type: 'masuk' | 'keluar'
  timestamp: number
  timezone: string
  location?: {
    latitude: number
    longitude: number
  }
  deviceInfo: {
    userAgent: string
    platform: string
    language: string
  }
  retryCount: number
  lastRetry?: number
  status: 'pending' | 'syncing' | 'failed' | 'synced'
}

export interface SyncResult {
  success: boolean
  syncedCount: number
  failedCount: number
  errors: string[]
  duration: number
}

export interface OfflineConfig {
  maxQueueSize: number
  maxRetries: number
  retryDelay: number
  syncInterval: number
  storageKey: string
}

const DEFAULT_CONFIG: OfflineConfig = {
  maxQueueSize: 50,
  maxRetries: 3,
  retryDelay: 5000,
  syncInterval: 30000,
  storageKey: 'attendance_offline_queue'
}

/**
 * Offline Storage Manager for attendance data
 */
export class OfflineStorageManager {
  private config: OfflineConfig
  private syncTimer: NodeJS.Timeout | null = null
  private isSyncing = false
  
  constructor(config: Partial<OfflineConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }
  
  /**
   * Check if browser storage is available
   * @returns boolean
   */
  isStorageAvailable(): boolean {
    if (typeof window === 'undefined') {
      return false
    }
    
    try {
      const test = '__offline_test__'
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      return true
    } catch {
      return false
    }
  }
  
  /**
   * Check if device is online
   * @returns boolean
   */
  isOnline(): boolean {
    return typeof navigator !== 'undefined' ? navigator.onLine : true
  }
  
  /**
   * Store attendance data for offline sync
   * @param attendanceData - Attendance data to store
   * @returns boolean - Success status
   */
  storeOfflineAttendance(attendanceData: Omit<OfflineAttendanceData, 'id' | 'retryCount' | 'status'>): boolean {
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
      
      const offlineData: OfflineAttendanceData = {
        ...attendanceData,
        id: this.generateId(),
        retryCount: 0,
        status: 'pending'
      }
      
      queue.push(offlineData)
      localStorage.setItem(this.config.storageKey, JSON.stringify(queue))
      
      return true
    } catch {
      return false
    }
  }
  
  /**
   * Get offline queue
   * @returns OfflineAttendanceData[]
   */
  getOfflineQueue(): OfflineAttendanceData[] {
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
   * @param queue - Updated queue
   * @returns boolean - Success status
   */
  private updateOfflineQueue(queue: OfflineAttendanceData[]): boolean {
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
   * @param id - Item ID to remove
   * @returns boolean - Success status
   */
  removeFromQueue(id: string): boolean {
    const queue = this.getOfflineQueue()
    const filteredQueue = queue.filter(item => item.id !== id)
    return this.updateOfflineQueue(filteredQueue)
  }
  
  /**
   * Clear offline queue
   * @returns boolean - Success status
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
   * Sync offline data with server
   * @param syncFunction - Function to sync individual items
   * @returns Promise<SyncResult>
   */
  async syncOfflineData(
    syncFunction: (data: OfflineAttendanceData) => Promise<boolean>
  ): Promise<SyncResult> {
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
    const result: SyncResult = {
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
              result.errors.push(`Max retries exceeded for item ${item.id}`)
              // Keep failed item in queue for manual review
            }
          }
        } catch (error) {
          item.status = 'failed'
          item.retryCount++
          item.lastRetry = Date.now()
          result.failedCount++
          result.errors.push(`Sync failed for item ${item.id}: ${error instanceof Error ? error.message : 'Unknown error'}`)
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
   * @param syncFunction - Function to sync individual items
   */
  startAutoSync(syncFunction: (data: OfflineAttendanceData) => Promise<boolean>): void {
    if (this.syncTimer) {
      this.stopAutoSync()
    }
    
    this.syncTimer = setInterval(async () => {
      if (this.isOnline() && !this.isSyncing) {
        const queue = this.getOfflineQueue()
        const pendingItems = queue.filter(item => item.status === 'pending' || item.status === 'failed')
        
        if (pendingItems.length > 0) {
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
   * @returns Object with sync statistics
   */
  getSyncStats() {
    const queue = this.getOfflineQueue()
    
    const stats = {
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
    
    return stats
  }
  
  /**
   * Generate unique ID for offline items
   * @returns string
   */
  private generateId(): string {
    return `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
  
  /**
   * Get device information
   * @returns Object with device info
   */
  getDeviceInfo() {
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
  
  /**
   * Export offline data for backup
   * @returns string - JSON string of offline data
   */
  exportOfflineData(): string {
    const queue = this.getOfflineQueue()
    const stats = this.getSyncStats()
    
    return JSON.stringify({
      queue,
      stats,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    }, null, 2)
  }
  
  /**
   * Import offline data from backup
   * @param jsonData - JSON string of offline data
   * @returns boolean - Success status
   */
  importOfflineData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData)
      
      if (data.queue && Array.isArray(data.queue)) {
        return this.updateOfflineQueue(data.queue)
      }
      
      return false
    } catch {
      return false
    }
  }
}

/**
 * Default offline storage manager instance
 */
export const offlineStorage = new OfflineStorageManager()

/**
 * Hook for offline functionality
 * @returns Object with offline utilities
 */
export function useOfflineStorage() {
  const storeOfflineAttendance = (data: Omit<OfflineAttendanceData, 'id' | 'retryCount' | 'status'>) => 
    offlineStorage.storeOfflineAttendance(data)
  
  const getOfflineQueue = () => offlineStorage.getOfflineQueue()
  const clearQueue = () => offlineStorage.clearQueue()
  const getSyncStats = () => offlineStorage.getSyncStats()
  const isOnline = () => offlineStorage.isOnline()
  const isStorageAvailable = () => offlineStorage.isStorageAvailable()
  
  return {
    storeOfflineAttendance,
    getOfflineQueue,
    clearQueue,
    getSyncStats,
    isOnline,
    isStorageAvailable,
    syncOfflineData: offlineStorage.syncOfflineData.bind(offlineStorage),
    startAutoSync: offlineStorage.startAutoSync.bind(offlineStorage),
    stopAutoSync: offlineStorage.stopAutoSync.bind(offlineStorage)
  }
}

/**
 * Network status utilities
 */
export const NetworkUtils = {
  /**
   * Check network status
   * @returns Promise<boolean> - True if online
   */
  async checkNetworkStatus(): Promise<boolean> {
    if (typeof navigator === 'undefined') {
      return true // Assume online in server environment
    }
    
    if (!navigator.onLine) {
      return false
    }
    
    try {
      const response = await fetch('/api/ping', {
        method: 'HEAD',
        cache: 'no-cache',
        signal: AbortSignal.timeout(5000) // 5 second timeout
      })
      return response.ok
    } catch {
      return false
    }
  },
  /**
   * Add online/offline event listeners
   * @param onOnline - Callback for online event
   * @param onOffline - Callback for offline event
   */
  addNetworkListeners(
    onOnline: () => void,
    onOffline: () => void
  ): () => void {
    if (typeof window === 'undefined') {
      return () => {}
    }
    
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    
    // Return cleanup function
    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    }
  },
  
  /**
   * Check network connection quality
   * @returns Promise<'fast' | 'slow' | 'offline'>
   */
  async checkConnectionQuality(): Promise<'fast' | 'slow' | 'offline'> {
    if (!navigator.onLine) {
      return 'offline'
    }
    
    try {
      const startTime = Date.now()
      const response = await fetch('/api/ping', {
        method: 'HEAD',
        cache: 'no-cache'
      })
      const endTime = Date.now()
      
      if (!response.ok) {
        return 'offline'
      }
      
      const latency = endTime - startTime
      return latency < 1000 ? 'fast' : 'slow'
    } catch {
      return 'offline'
    }
  },
  
  /**
   * Get connection information
   * @returns Object with connection info
   */
  getConnectionInfo() {
    if (typeof navigator === 'undefined' || !('connection' in navigator)) {
      return {
        effectiveType: 'unknown',
        downlink: 0,
        rtt: 0,
        saveData: false
      }
    }
    
    const connection = (navigator as any).connection
    
    return {
      effectiveType: connection.effectiveType || 'unknown',
      downlink: connection.downlink || 0,
      rtt: connection.rtt || 0,
      saveData: connection.saveData || false
    }
  }
}