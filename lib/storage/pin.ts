/**
 * PIN storage utilities for browser-based PIN management
 * Handles secure PIN storage, validation, and auto-completion
 */

export interface PinStorageConfig {
  maxPins: number
  expiryDays: number
  encryptionKey?: string
  storageType: 'localStorage' | 'sessionStorage'
}

export interface StoredPin {
  pin: string
  userId: string
  timestamp: number
  expiresAt: number
  isEncrypted: boolean
}

export interface PinValidationResult {
  isValid: boolean
  pin?: string
  errors: string[]
  suggestions: string[]
}

const DEFAULT_CONFIG: PinStorageConfig = {
  maxPins: 5,
  expiryDays: 30,
  storageType: 'localStorage'
}

const STORAGE_KEY = 'attendance_pins'
const ENCRYPTION_KEY = 'attendance_pin_key'

/**
 * Simple encryption/decryption for PIN storage
 * Note: This is basic obfuscation, not cryptographically secure
 */
class PinCrypto {
  private static encode(text: string, key: string): string {
    let result = ''
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      result += String.fromCharCode(charCode)
    }
    return btoa(result)
  }
  
  private static decode(encoded: string, key: string): string {
    try {
      const text = atob(encoded)
      let result = ''
      for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
        result += String.fromCharCode(charCode)
      }
      return result
    } catch {
      return ''
    }
  }
  
  static encrypt(pin: string, key: string = ENCRYPTION_KEY): string {
    return this.encode(pin, key)
  }
  
  static decrypt(encryptedPin: string, key: string = ENCRYPTION_KEY): string {
    return this.decode(encryptedPin, key)
  }
}

/**
 * PIN Storage Manager
 */
export class PinStorageManager {
  private config: PinStorageConfig
  private storage: Storage | null
  
  constructor(config: Partial<PinStorageConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      this.storage = this.config.storageType === 'localStorage' 
        ? localStorage 
        : sessionStorage
    } else {
      this.storage = null
    }
  }
  
  /**
   * Check if browser storage is available
   * @returns boolean
   */
  isStorageAvailable(): boolean {
    if (!this.storage) {
      return false
    }
    
    try {
      const test = '__storage_test__'
      this.storage.setItem(test, test)
      this.storage.removeItem(test)
      return true
    } catch {
      return false
    }
  }
  
  /**
   * Store a PIN for a user
   * @param pin - PIN to store
   * @param userId - User ID
   * @returns boolean - Success status
   */
  storePin(pin: string, userId: string): boolean {
    if (!this.isStorageAvailable() || !this.storage) {
      return false
    }
    
    try {
      const normalizedPin = this.normalizePin(pin)
      const storedPins = this.getStoredPins()
      
      // Remove existing PIN for this user
      const filteredPins = storedPins.filter(p => p.userId !== userId)
      
      // Create new stored PIN
      const newStoredPin: StoredPin = {
        pin: this.config.encryptionKey ? PinCrypto.encrypt(normalizedPin, this.config.encryptionKey) : normalizedPin,
        userId,
        timestamp: Date.now(),
        expiresAt: Date.now() + (this.config.expiryDays * 24 * 60 * 60 * 1000),
        isEncrypted: !!this.config.encryptionKey
      }
      
      // Add new PIN and maintain max limit
      filteredPins.unshift(newStoredPin)
      const finalPins = filteredPins.slice(0, this.config.maxPins)
      
      this.storage.setItem(STORAGE_KEY, JSON.stringify(finalPins))
      return true
    } catch {
      return false
    }
  }
  
  /**
   * Retrieve stored PIN for a user
   * @param userId - User ID
   * @returns string | null - Retrieved PIN or null if not found
   */
  getStoredPin(userId: string): string | null {
    if (!this.isStorageAvailable()) {
      return null
    }
    
    try {
      const storedPins = this.getStoredPins()
      const userPin = storedPins.find(p => p.userId === userId)
      
      if (!userPin) {
        return null
      }
      
      // Check if PIN has expired
      if (Date.now() > userPin.expiresAt) {
        this.removePin(userId)
        return null
      }
      
      // Decrypt if encrypted
      if (userPin.isEncrypted && this.config.encryptionKey) {
        return PinCrypto.decrypt(userPin.pin, this.config.encryptionKey)
      }
      
      return userPin.pin
    } catch {
      return null
    }
  }
  
  /**
   * Remove stored PIN for a user
   * @param userId - User ID
   * @returns boolean - Success status
   */
  removePin(userId: string): boolean {
    if (!this.isStorageAvailable() || !this.storage) {
      return false
    }
    
    try {
      const storedPins = this.getStoredPins()
      const filteredPins = storedPins.filter(p => p.userId !== userId)
      
      this.storage.setItem(STORAGE_KEY, JSON.stringify(filteredPins))
      return true
    } catch {
      return false
    }
  }
  
  /**
   * Clear all stored PINs
   * @returns boolean - Success status
   */
  clearAllPins(): boolean {
    if (!this.isStorageAvailable() || !this.storage) {
      return false
    }
    
    try {
      this.storage.removeItem(STORAGE_KEY)
      return true
    } catch {
      return false
    }
  }
  
  /**
   * Get all stored PINs
   * @returns StoredPin[] - Array of stored PINs
   */
  private getStoredPins(): StoredPin[] {
    if (!this.storage) {
      return []
    }
    
    try {
      const stored = this.storage.getItem(STORAGE_KEY)
      if (!stored) {
        return []
      }
      
      const pins: StoredPin[] = JSON.parse(stored)
      
      // Filter out expired PINs
      const validPins = pins.filter(pin => Date.now() <= pin.expiresAt)
      
      // Update storage if any PINs were expired
      if (validPins.length !== pins.length) {
        this.storage.setItem(STORAGE_KEY, JSON.stringify(validPins))
      }
      
      return validPins
    } catch {
      return []
    }
  }
  
  /**
   * Normalize PIN format (uppercase, trim)
   * @param pin - Raw PIN input
   * @returns string - Normalized PIN
   */
  private normalizePin(pin: string): string {
    return pin.trim().toUpperCase()
  }
  
  /**
   * Get PIN suggestions based on stored PINs
   * @param userId - User ID
   * @param partialPin - Partial PIN input
   * @returns string[] - Array of PIN suggestions
   */
  getPinSuggestions(userId: string, partialPin: string = ''): string[] {
    const storedPin = this.getStoredPin(userId)
    if (!storedPin) {
      return []
    }
    
    const normalizedPartial = this.normalizePin(partialPin)
    
    if (normalizedPartial === '' || storedPin.startsWith(normalizedPartial)) {
      return [storedPin]
    }
    
    return []
  }
  
  /**
   * Validate PIN format and provide suggestions
   * @param pin - PIN to validate
   * @param userId - User ID
   * @returns PinValidationResult
   */
  validatePin(pin: string, userId?: string): PinValidationResult {
    const result: PinValidationResult = {
      isValid: true,
      errors: [],
      suggestions: []
    }
    
    const normalizedPin = this.normalizePin(pin)
    
    // Basic validation
    if (!normalizedPin) {
      result.isValid = false
      result.errors.push('PIN tidak boleh kosong')
      return result
    }
    
    if (normalizedPin.length < 4) {
      result.isValid = false
      result.errors.push('PIN minimal 4 karakter')
    }
    
    if (normalizedPin.length > 20) {
      result.isValid = false
      result.errors.push('PIN maksimal 20 karakter')
    }
    
    // Check for valid characters (alphanumeric)
    if (!/^[A-Z0-9]+$/.test(normalizedPin)) {
      result.isValid = false
      result.errors.push('PIN hanya boleh mengandung huruf dan angka')
    }
    
    // Add suggestions if userId provided
    if (userId && result.isValid) {
      const suggestions = this.getPinSuggestions(userId, normalizedPin)
      result.suggestions = suggestions
      result.pin = normalizedPin
    }
    
    return result
  }
  
  /**
   * Get storage statistics
   * @returns Object with storage statistics
   */
  getStorageStats() {
    const storedPins = this.getStoredPins()
    
    return {
      totalPins: storedPins.length,
      maxPins: this.config.maxPins,
      storageType: this.config.storageType,
      isEncrypted: !!this.config.encryptionKey,
      oldestPin: storedPins.length > 0 ? new Date(Math.min(...storedPins.map(p => p.timestamp))) : null,
      newestPin: storedPins.length > 0 ? new Date(Math.max(...storedPins.map(p => p.timestamp))) : null,
      expiryDays: this.config.expiryDays
    }
  }
}

/**
 * Default PIN storage manager instance
 */
export const pinStorage = new PinStorageManager()

/**
 * Hook for PIN auto-completion
 * @param userId - User ID
 * @returns Object with PIN utilities
 */
export function usePinStorage(userId: string) {
  const storePin = (pin: string) => pinStorage.storePin(pin, userId)
  const getStoredPin = () => pinStorage.getStoredPin(userId)
  const removePin = () => pinStorage.removePin(userId)
  const validatePin = (pin: string) => pinStorage.validatePin(pin, userId)
  const getPinSuggestions = (partialPin: string) => pinStorage.getPinSuggestions(userId, partialPin)
  
  return {
    storePin,
    getStoredPin,
    removePin,
    validatePin,
    getPinSuggestions,
    isStorageAvailable: pinStorage.isStorageAvailable()
  }
}

/**
 * Utility functions for PIN management
 */
export const PinUtils = {
  /**
   * Format PIN for display (mask characters)
   * @param pin - PIN to format
   * @param showLast - Number of last characters to show
   * @returns string - Formatted PIN
   */
  formatPinForDisplay(pin: string, showLast: number = 2): string {
    if (pin.length <= showLast) {
      return '*'.repeat(pin.length)
    }
    
    const masked = '*'.repeat(pin.length - showLast)
    const visible = pin.slice(-showLast)
    return masked + visible
  },
  
  /**
   * Generate PIN strength score
   * @param pin - PIN to analyze
   * @returns number - Strength score (0-100)
   */
  getPinStrength(pin: string): number {
    let score = 0
    
    // Length bonus
    if (pin.length >= 6) score += 20
    if (pin.length >= 8) score += 20
    
    // Character variety bonus
    if (/[A-Z]/.test(pin)) score += 15
    if (/[0-9]/.test(pin)) score += 15
    if (/[A-Z].*[0-9]|[0-9].*[A-Z]/.test(pin)) score += 20
    
    // Pattern penalty
    if (/^(.)\1+$/.test(pin)) score -= 30 // All same character
    if (/^(012|123|234|345|456|567|678|789|890|ABC|BCD|CDE)/.test(pin)) score -= 20 // Sequential
    
    return Math.max(0, Math.min(100, score))
  },
  
  /**
   * Check if PIN is commonly used
   * @param pin - PIN to check
   * @returns boolean - True if commonly used
   */
  isCommonPin(pin: string): boolean {
    const commonPins = [
      '1234', '0000', '1111', '2222', '3333', '4444', '5555', '6666', '7777', '8888', '9999',
      'ABCD', 'TEST', 'USER', 'ADMIN', '1122', '1212', '2121'
    ]
    
    return commonPins.includes(pin.toUpperCase())
  }
}