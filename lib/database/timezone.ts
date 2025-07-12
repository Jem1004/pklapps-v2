/**
 * Database timezone utilities
 * Handles timezone synchronization between server and database
 */

/**
 * Synchronize server time with database
 * @returns Promise<Date> - Current server time
 */
export async function syncServerTime(): Promise<Date> {
  try {
    const serverTimezone = getServerTimezone()
    const now = new Date()
    
    // Convert current time to server timezone
    const serverTime = new Date(now.toLocaleString('en-US', { 
      timeZone: serverTimezone 
    }))
    
    return serverTime
  } catch (error) {
    console.error('Failed to sync server time:', error)
    return new Date() // Fallback to system time
  }
}

/**
 * Get server timezone configuration
 * @returns Server timezone string
 */
export function getServerTimezone(): string {
  return process.env.TZ || process.env.SERVER_TIMEZONE || 'Asia/Makassar'
}

/**
 * Format date for database storage with proper timezone handling
 * @param date - Date object to format
 * @returns Formatted date string for database
 */
export function formatDateForDatabase(date: Date): string {
  try {
    const serverTimezone = getServerTimezone()
    
    // Ensure date is in server timezone before storing
    const zonedDate = new Date(date.toLocaleString('en-US', { 
      timeZone: serverTimezone 
    }))
    
    return zonedDate.toISOString()
  } catch (error) {
    console.error('Failed to format date for database:', error)
    return date.toISOString()
  }
}

/**
 * Parse date from database with timezone consideration
 * @param dateString - Date string from database
 * @param targetTimezone - Target timezone for conversion
 * @returns Date object in target timezone
 */
export function parseDateFromDatabase(
  dateString: string, 
  targetTimezone?: string
): Date {
  try {
    const date = new Date(dateString)
    
    if (targetTimezone) {
      return new Date(date.toLocaleString('en-US', { 
        timeZone: targetTimezone 
      }))
    }
    
    return date
  } catch (error) {
    console.error('Failed to parse date from database:', error)
    return new Date(dateString) // Fallback to basic parsing
  }
}

/**
 * Get current timestamp for database operations
 * @returns ISO string timestamp in server timezone
 */
export async function getDatabaseTimestamp(): Promise<string> {
  const serverTime = await syncServerTime()
  return formatDateForDatabase(serverTime)
}

/**
 * Validate if a date is within acceptable range for database storage
 * @param date - Date to validate
 * @param maxFutureMinutes - Maximum minutes in the future allowed
 * @param maxPastHours - Maximum hours in the past allowed
 * @returns Validation result
 */
export function validateDatabaseDate(
  date: Date,
  maxFutureMinutes: number = 5,
  maxPastHours: number = 24
): { isValid: boolean; message?: string } {
  try {
    const now = new Date()
    const timeDiff = date.getTime() - now.getTime()
    
    // Check if date is too far in the future
    if (timeDiff > maxFutureMinutes * 60 * 1000) {
      return {
        isValid: false,
        message: `Tanggal tidak boleh lebih dari ${maxFutureMinutes} menit ke depan`
      }
    }
    
    // Check if date is too far in the past
    if (timeDiff < -maxPastHours * 60 * 60 * 1000) {
      return {
        isValid: false,
        message: `Tanggal tidak boleh lebih dari ${maxPastHours} jam yang lalu`
      }
    }
    
    return { isValid: true }
  } catch (error) {
    return {
      isValid: false,
      message: 'Gagal memvalidasi tanggal'
    }
  }
}

/**
 * Convert UTC date to server timezone for display
 * @param utcDate - UTC date from database
 * @returns Date in server timezone
 */
export function convertUTCToServerTime(utcDate: Date): Date {
  try {
    const serverTimezone = getServerTimezone()
    return new Date(utcDate.toLocaleString('en-US', { 
      timeZone: serverTimezone 
    }))
  } catch (error) {
    console.error('Failed to convert UTC to server time:', error)
    return utcDate
  }
}

/**
 * Get timezone offset in minutes
 * @param timezone - Timezone string
 * @returns Offset in minutes
 */
export function getTimezoneOffset(timezone: string): number {
  try {
    const now = new Date()
    const utc = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }))
    const target = new Date(now.toLocaleString('en-US', { timeZone: timezone }))
    
    return (target.getTime() - utc.getTime()) / (1000 * 60)
  } catch (error) {
    console.error('Failed to get timezone offset:', error)
    return 0
  }
}