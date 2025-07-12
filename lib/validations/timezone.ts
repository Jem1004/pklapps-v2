/**
 * Timezone validation utilities
 * Handles validation of timezone-related data for attendance system
 */

import { z } from 'zod'
import { getClientTimezone, getServerTimezone } from '@/lib/utils/timezone'

export interface TimezoneValidationResult {
  isValid: boolean
  message?: string
  serverTime?: Date
  clientTime?: Date
  offset?: number
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
        clientTime,
        offset: timeDifference
      }
    }
    
    return {
      isValid: false,
      message: `Perbedaan waktu terlalu besar: ${Math.round(timeDifference / 1000)} detik. Maksimal ${Math.round(allowedOffset / 1000)} detik.`,
      serverTime,
      clientTime,
      offset: timeDifference
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
 * Validate timezone string format
 * @param timezone - Timezone string to validate
 * @returns Boolean indicating if timezone is valid
 */
export function validateTimezoneFormat(timezone: string): boolean {
  try {
    // Test if timezone is valid by trying to use it
    new Date().toLocaleString('en-US', { timeZone: timezone })
    return true
  } catch (error) {
    return false
  }
}

/**
 * Validate attendance submission time
 * @param submissionTime - Time when attendance was submitted
 * @param clientTimezone - Client timezone
 * @param serverTimezone - Server timezone
 * @returns Validation result
 */
export function validateAttendanceSubmissionTime(
  submissionTime: Date,
  clientTimezone?: string,
  serverTimezone?: string
): TimezoneValidationResult {
  try {
    const client = clientTimezone || getClientTimezone()
    const server = serverTimezone || getServerTimezone()
    
    // Validate timezone formats
    if (!validateTimezoneFormat(client) || !validateTimezoneFormat(server)) {
      return {
        isValid: false,
        message: 'Format timezone tidak valid'
      }
    }
    
    // Convert submission time to both timezones
    const clientTime = new Date(submissionTime.toLocaleString('en-US', { 
      timeZone: client 
    }))
    const serverTime = new Date(submissionTime.toLocaleString('en-US', { 
      timeZone: server 
    }))
    
    // Validate time difference
    return validateAttendanceTime(clientTime, serverTime)
  } catch (error) {
    return {
      isValid: false,
      message: 'Gagal memvalidasi waktu pengiriman absensi'
    }
  }
}

/**
 * Validate if current time is within attendance period
 * @param currentTime - Current time to check
 * @param attendancePeriod - Attendance period configuration
 * @param timezone - Timezone to use for validation
 * @returns Validation result
 */
export function validateAttendancePeriod(
  currentTime: Date,
  attendancePeriod: {
    start: { hour: number; minute: number }
    end: { hour: number; minute: number }
  },
  timezone?: string
): TimezoneValidationResult {
  try {
    const tz = timezone || getServerTimezone()
    
    // Convert current time to specified timezone
    const zonedTime = new Date(currentTime.toLocaleString('en-US', { 
      timeZone: tz 
    }))
    
    const currentHour = zonedTime.getHours()
    const currentMinute = zonedTime.getMinutes()
    const currentTimeInMinutes = currentHour * 60 + currentMinute
    
    const startTimeInMinutes = attendancePeriod.start.hour * 60 + attendancePeriod.start.minute
    const endTimeInMinutes = attendancePeriod.end.hour * 60 + attendancePeriod.end.minute
    
    if (currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes <= endTimeInMinutes) {
      return {
        isValid: true,
        serverTime: zonedTime,
        clientTime: currentTime
      }
    }
    
    const startTime = `${attendancePeriod.start.hour.toString().padStart(2, '0')}:${attendancePeriod.start.minute.toString().padStart(2, '0')}`
    const endTime = `${attendancePeriod.end.hour.toString().padStart(2, '0')}:${attendancePeriod.end.minute.toString().padStart(2, '0')}`
    
    return {
      isValid: false,
      message: `Absensi hanya dapat dilakukan antara ${startTime} - ${endTime}`,
      serverTime: zonedTime,
      clientTime: currentTime
    }
  } catch (error) {
    return {
      isValid: false,
      message: 'Gagal memvalidasi periode absensi'
    }
  }
}

/**
 * Zod schema for timezone validation
 */
export const timezoneSchema = z.object({
  clientTimezone: z.string().refine(validateTimezoneFormat, {
    message: 'Format timezone client tidak valid'
  }),
  serverTimezone: z.string().refine(validateTimezoneFormat, {
    message: 'Format timezone server tidak valid'
  }),
  submissionTime: z.date(),
  allowedOffset: z.number().min(0).max(600000).optional() // Max 10 minutes
})

/**
 * Zod schema for attendance time validation
 */
export const attendanceTimeSchema = z.object({
  submissionTime: z.date(),
  clientTimezone: z.string().optional(),
  serverTimezone: z.string().optional(),
  attendancePeriod: z.object({
    start: z.object({
      hour: z.number().min(0).max(23),
      minute: z.number().min(0).max(59)
    }),
    end: z.object({
      hour: z.number().min(0).max(23),
      minute: z.number().min(0).max(59)
    })
  }).optional()
})

/**
 * Validate attendance data with timezone considerations
 * @param data - Attendance data to validate
 * @returns Validation result
 */
export function validateAttendanceData(data: z.infer<typeof attendanceTimeSchema>): TimezoneValidationResult {
  try {
    // Validate schema first
    const validatedData = attendanceTimeSchema.parse(data)
    
    // Validate submission time
    const submissionResult = validateAttendanceSubmissionTime(
      validatedData.submissionTime,
      validatedData.clientTimezone,
      validatedData.serverTimezone
    )
    
    if (!submissionResult.isValid) {
      return submissionResult
    }
    
    // Validate attendance period if provided
    if (validatedData.attendancePeriod) {
      const periodResult = validateAttendancePeriod(
        validatedData.submissionTime,
        validatedData.attendancePeriod,
        validatedData.serverTimezone
      )
      
      if (!periodResult.isValid) {
        return periodResult
      }
    }
    
    return {
      isValid: true,
      serverTime: submissionResult.serverTime,
      clientTime: submissionResult.clientTime
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        message: `Validasi data gagal: ${error.errors.map(e => e.message).join(', ')}`
      }
    }
    
    return {
      isValid: false,
      message: 'Gagal memvalidasi data absensi'
    }
  }
}

/**
 * Get default attendance periods
 * @returns Default attendance periods configuration
 */
export function getDefaultAttendancePeriods() {
  return {
    masuk: {
      start: { hour: 7, minute: 0 },
      end: { hour: 10, minute: 0 }
    },
    pulang: {
      start: { hour: 13, minute: 0 },
      end: { hour: 17, minute: 0 }
    }
  }
}