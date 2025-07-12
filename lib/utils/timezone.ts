/**
 * Timezone utilities for attendance system
 * Handles timezone detection, conversion, and validation
 */

export interface TimezoneConfig {
  serverTimezone: string
  clientTimezone: string
  offset: number
}

export interface TimezoneValidationResult {
  isValid: boolean
  message?: string
  serverTime?: Date
  clientTime?: Date
}

/**
 * Detect client timezone using Intl API
 * @returns Client timezone string (e.g., 'Asia/Makassar')
 */
export function detectClientTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  } catch (error) {
    console.warn('Failed to detect timezone, falling back to UTC:', error)
    return 'UTC'
  }
}

/**
 * Get server timezone from environment or default to Asia/Makassar
 * @returns Server timezone string
 */
export function getServerTimezone(): string {
  return process.env.TZ || process.env.SERVER_TIMEZONE || 'Asia/Makassar'
}

/**
 * Convert client time to server timezone
 * @param clientTime - Date object from client
 * @param config - Timezone configuration
 * @returns Date object in server timezone
 */
export function convertToServerTime(clientTime: Date, config: TimezoneConfig): Date {
  try {
    // Create a new date with timezone conversion
    const serverTime = new Date(clientTime.toLocaleString('en-US', {
      timeZone: config.serverTimezone
    }))
    
    return serverTime
  } catch (error) {
    console.error('Failed to convert to server time:', error)
    return clientTime // Fallback to original time
  }
}

/**
 * Convert server time to client timezone
 * @param serverTime - Date object from server
 * @param config - Timezone configuration
 * @returns Date object in client timezone
 */
export function convertToClientTime(serverTime: Date, config: TimezoneConfig): Date {
  try {
    const clientTime = new Date(serverTime.toLocaleString('en-US', {
      timeZone: config.clientTimezone
    }))
    
    return clientTime
  } catch (error) {
    console.error('Failed to convert to client time:', error)
    return serverTime // Fallback to original time
  }
}

/**
 * Validate timezone consistency between client and server
 * @param clientTimezone - Client timezone string
 * @param serverTimezone - Server timezone string
 * @returns Boolean indicating if timezones are consistent
 */
export function validateTimezoneConsistency(
  clientTimezone: string, 
  serverTimezone: string
): boolean {
  try {
    // Check if both timezones are valid
    const clientDate = new Date().toLocaleString('en-US', { timeZone: clientTimezone })
    const serverDate = new Date().toLocaleString('en-US', { timeZone: serverTimezone })
    
    return clientDate !== 'Invalid Date' && serverDate !== 'Invalid Date'
  } catch (error) {
    console.error('Timezone validation failed:', error)
    return false
  }
}

/**
 * Validate attendance time considering timezone differences
 * @param clientTime - Time from client
 * @param serverTime - Time from server
 * @param allowedOffset - Allowed time difference in milliseconds (default: 5 minutes)
 * @returns Validation result with details
 */
export function validateAttendanceTime(
  clientTime: Date,
  serverTime: Date,
  allowedOffset: number = 300000 // 5 minutes
): TimezoneValidationResult {
  try {
    const timeDifference = Math.abs(clientTime.getTime() - serverTime.getTime())
    
    if (timeDifference <= allowedOffset) {
      return {
        isValid: true,
        serverTime,
        clientTime
      }
    }
    
    return {
      isValid: false,
      message: `Perbedaan waktu terlalu besar: ${Math.round(timeDifference / 1000)} detik. Maksimal ${Math.round(allowedOffset / 1000)} detik.`,
      serverTime,
      clientTime
    }
  } catch (error) {
    return {
      isValid: false,
      message: 'Gagal memvalidasi waktu absensi',
      serverTime,
      clientTime
    }
  }
}

/**
 * Create timezone configuration object
 * @param clientTimezone - Client timezone (optional, will be detected if not provided)
 * @param serverTimezone - Server timezone (optional, will use default if not provided)
 * @returns TimezoneConfig object
 */
export function createTimezoneConfig(
  clientTimezone?: string,
  serverTimezone?: string
): TimezoneConfig {
  const client = clientTimezone || detectClientTimezone()
  const server = serverTimezone || getServerTimezone()
  
  // Calculate offset between timezones
  const now = new Date()
  const clientTime = new Date(now.toLocaleString('en-US', { timeZone: client }))
  const serverTime = new Date(now.toLocaleString('en-US', { timeZone: server }))
  const offset = serverTime.getTime() - clientTime.getTime()
  
  return {
    clientTimezone: client,
    serverTimezone: server,
    offset
  }
}

/**
 * Format date for database storage with timezone info
 * @param date - Date object to format
 * @param timezone - Timezone to use for formatting
 * @returns ISO string with timezone information
 */
export function formatDateForDatabase(date: Date, timezone?: string): string {
  try {
    if (timezone) {
      // Convert to specified timezone first
      const zonedDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }))
      return zonedDate.toISOString()
    }
    
    return date.toISOString()
  } catch (error) {
    console.error('Failed to format date for database:', error)
    return date.toISOString() // Fallback to original ISO string
  }
}

/**
 * Get current time in server timezone
 * @returns Date object in server timezone
 */
export async function getCurrentServerTime(): Promise<Date> {
  try {
    // Try to get server time from API endpoint
    const response = await fetch('/api/server-time')
    if (response.ok) {
      const data = await response.json()
      return new Date(data.timestamp)
    }
  } catch (error) {
    console.warn('Failed to fetch server time from API, using fallback:', error)
  }
  
  // Fallback: use current time with server timezone
  const serverTimezone = getServerTimezone()
  const now = new Date()
  
  // Create a proper date object in server timezone
  const serverTimeString = now.toLocaleString('sv-SE', { timeZone: serverTimezone })
  return new Date(serverTimeString)
}

/**
 * Get client timezone (alias for detectClientTimezone)
 * @returns Client timezone string
 */
export function getClientTimezone(): string {
  return detectClientTimezone()
}

/**
 * Sync server time with client time for validation
 * @param clientTime - Client time
 * @param clientTimezone - Client timezone
 * @returns Object with server time and validation info
 */
export async function syncServerTime(clientTime: Date, clientTimezone: string): Promise<{
  serverTime: Date
  isValid: boolean
  timeDifference: number
}> {
  try {
    const serverTime = await getCurrentServerTime()
    const timeDifference = Math.abs(serverTime.getTime() - clientTime.getTime())
    const isValid = timeDifference <= 300000 // 5 minutes tolerance
    
    return {
      serverTime,
      isValid,
      timeDifference
    }
  } catch (error) {
    console.error('Failed to sync server time:', error)
    return {
      serverTime: new Date(),
      isValid: false,
      timeDifference: 0
    }
  }
}

/**
 * Check if current time is within attendance hours considering timezone
 * @param config - Timezone configuration
 * @param attendanceHours - Object with start and end hours
 * @returns Boolean indicating if within attendance hours
 */
export async function isWithinAttendanceHours(
  config: TimezoneConfig,
  attendanceHours: { start: number; end: number }
): Promise<boolean> {
  try {
    const serverTime = await getCurrentServerTime()
    const hour = serverTime.getHours() + serverTime.getMinutes() / 60
    
    return hour >= attendanceHours.start && hour <= attendanceHours.end
  } catch (error) {
    console.error('Failed to check attendance hours:', error)
    return false
  }
}