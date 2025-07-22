/**
 * Date serialization utilities for API responses
 * Handles proper date formatting to prevent timezone-related date shifts
 */

import { getServerTimezone } from './timezone'

/**
 * Serialize a Date object to YYYY-MM-DD format in server timezone
 * This prevents date shifting issues when sending dates through JSON
 * @param date - Date object to serialize
 * @returns Date string in YYYY-MM-DD format
 */
export function serializeDateForAPI(date: Date): string {
  try {
    const serverTimezone = getServerTimezone()
    
    // Format date in server timezone to prevent shifting
    const dateInServerTZ = new Date(date.toLocaleString('en-CA', {
      timeZone: serverTimezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }))
    
    // Extract YYYY-MM-DD format
    const year = dateInServerTZ.getFullYear()
    const month = String(dateInServerTZ.getMonth() + 1).padStart(2, '0')
    const day = String(dateInServerTZ.getDate()).padStart(2, '0')
    
    return `${year}-${month}-${day}`
  } catch (error) {
    console.error('Error serializing date for API:', error)
    // Fallback: use ISO date part
    return date.toISOString().split('T')[0]
  }
}

/**
 * Serialize a DateTime object to ISO string in server timezone
 * @param date - Date object to serialize
 * @returns ISO string in server timezone
 */
export function serializeDateTimeForAPI(date: Date): string {
  try {
    const serverTimezone = getServerTimezone()
    
    // Create date string in server timezone
    const dateTimeInServerTZ = date.toLocaleString('sv-SE', {
      timeZone: serverTimezone
    })
    
    // Convert to ISO format
    return new Date(dateTimeInServerTZ).toISOString()
  } catch (error) {
    console.error('Error serializing datetime for API:', error)
    return date.toISOString()
  }
}

/**
 * Parse a date string (YYYY-MM-DD) to Date object in server timezone
 * This ensures consistent date handling across the application
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns Date object in server timezone
 */
export function parseDateInServerTimezone(dateString: string): Date {
  // Validate date format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(dateString)) {
    throw new Error('Invalid date format. Expected YYYY-MM-DD')
  }
  
  const [year, month, day] = dateString.split('-').map(Number)
  
  // Create date in server timezone to avoid shifting
  const serverTimezone = getServerTimezone()
  
  try {
    // Create a date string that represents the date in server timezone
    const dateTimeString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T00:00:00`
    
    // Parse as if it's in server timezone
    const tempDate = new Date(dateTimeString)
    const offsetDate = new Date(tempDate.toLocaleString('en-US', { timeZone: serverTimezone }))
    
    // Adjust for timezone offset to get the correct date
    const timezoneOffset = tempDate.getTime() - offsetDate.getTime()
    const finalDate = new Date(tempDate.getTime() + timezoneOffset)
    
    if (isNaN(finalDate.getTime())) {
      throw new Error('Invalid date')
    }
    
    return finalDate
  } catch (error) {
    console.error('Error parsing date in server timezone:', error)
    // Fallback: create date using local timezone
    const fallbackDate = new Date(year, month - 1, day)
    if (isNaN(fallbackDate.getTime())) {
      throw new Error('Invalid date')
    }
    return fallbackDate
  }
}

/**
 * Transform journal data for API response
 * Ensures dates are properly serialized
 * @param jurnal - Journal data from database
 * @returns Journal data with properly serialized dates
 */
export function transformJurnalForAPI(jurnal: any): any {
  if (!jurnal) return jurnal
  
  const transformed = { ...jurnal }
  
  // Serialize tanggal field
  if (transformed.tanggal instanceof Date) {
    transformed.tanggal = serializeDateForAPI(transformed.tanggal)
  }
  
  // Serialize createdAt and updatedAt
  if (transformed.createdAt instanceof Date) {
    transformed.createdAt = serializeDateTimeForAPI(transformed.createdAt)
  }
  
  if (transformed.updatedAt instanceof Date) {
    transformed.updatedAt = serializeDateTimeForAPI(transformed.updatedAt)
  }
  
  // Handle comments array
  if (Array.isArray(transformed.comments)) {
    transformed.comments = transformed.comments.map((comment: any) => ({
      ...comment,
      createdAt: comment.createdAt instanceof Date 
        ? serializeDateTimeForAPI(comment.createdAt)
        : comment.createdAt
    }))
  }
  
  return transformed
}

/**
 * Transform array of journal data for API response
 * @param jurnals - Array of journal data from database
 * @returns Array of journal data with properly serialized dates
 */
export function transformJurnalsForAPI(jurnals: any[]): any[] {
  return jurnals.map(transformJurnalForAPI)
}