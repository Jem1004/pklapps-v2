import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/database'
import { z } from 'zod'
import { startOfDay, endOfDay, format, startOfWeek, endOfWeek } from 'date-fns'
import { eachWeekOfInterval } from 'date-fns/eachWeekOfInterval'
import { parseISO } from 'date-fns/parseISO'

// Validation schema
const querySchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
})

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: { message: 'Unauthorized' } },
        { status: 401 }
      )
    }

    // Parse and validate query parameters
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    if (!startDate || !endDate) {
      return NextResponse.json(
        { success: false, error: { message: 'startDate and endDate are required' } },
        { status: 400 }
      )
    }

    const validatedQuery = querySchema.parse({ startDate, endDate })
    
    const startDateTime = startOfDay(parseISO(validatedQuery.startDate))
    const endDateTime = endOfDay(parseISO(validatedQuery.endDate))
    const today = startOfDay(new Date())

    // Get total students count
    const totalStudents = await prisma.student.count({
      where: {
        tempatPklId: { not: null } // Only count mapped students
      }
    })

    // Get attendance data for the period
    const attendanceData = await prisma.absensi.findMany({
      where: {
        tanggal: {
          gte: startDateTime,
          lte: endDateTime
        },
        tipe: 'MASUK' // Only count morning attendance
      },
      include: {
        student: {
          include: {
            user: true
          }
        }
      }
    })

    // Get today's attendance
    const todayAttendance = await prisma.absensi.findMany({
      where: {
        tanggal: today,
        tipe: 'MASUK'
      }
    })

    const todayPresent = todayAttendance.length
    const todayAbsent = totalStudents - todayPresent

    // Calculate daily stats
    const dailyStatsMap = new Map()
    
    // Initialize all dates in range with zero values
    const currentDate = new Date(startDateTime)
    while (currentDate <= endDateTime) {
      const dateKey = format(currentDate, 'yyyy-MM-dd')
      dailyStatsMap.set(dateKey, {
        date: dateKey,
        present: 0,
        absent: 0,
        rate: 0
      })
      currentDate.setDate(currentDate.getDate() + 1)
    }

    // Fill in actual attendance data
    attendanceData.forEach(attendance => {
      const dateKey = format(attendance.tanggal, 'yyyy-MM-dd')
      if (dailyStatsMap.has(dateKey)) {
        const dayStats = dailyStatsMap.get(dateKey)
        dayStats.present += 1
      }
    })

    // Calculate absent and rate for each day
    dailyStatsMap.forEach(dayStats => {
      dayStats.absent = totalStudents - dayStats.present
      dayStats.rate = totalStudents > 0 ? (dayStats.present / totalStudents) * 100 : 0
    })

    const dailyStats = Array.from(dailyStatsMap.values()).sort((a, b) => a.date.localeCompare(b.date))

    // Calculate weekly stats
    const weeks = eachWeekOfInterval(
      { start: startDateTime, end: endDateTime },
      { weekStartsOn: 1 } // Monday
    )

    const weeklyStats = weeks.map((weekStart: Date) => {
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 })
      const weekLabel = `${format(weekStart, 'dd MMM')} - ${format(weekEnd, 'dd MMM')}`
      
      const weekAttendance = attendanceData.filter(attendance => {
        const attendanceDate = attendance.tanggal
        return attendanceDate >= weekStart && attendanceDate <= weekEnd
      })

      const weekPresent = weekAttendance.length
      const weekAbsent = (totalStudents * 7) - weekPresent // Assuming 7 days per week
      const weekRate = totalStudents > 0 ? (weekPresent / (totalStudents * 7)) * 100 : 0

      return {
        week: weekLabel,
        present: weekPresent,
        absent: weekAbsent,
        rate: weekRate
      }
    })

    // Calculate overall stats
    const totalPresent = attendanceData.length
    const totalAbsent = (totalStudents * dailyStats.length) - totalPresent
    const attendanceRate = totalStudents > 0 && dailyStats.length > 0 
      ? (totalPresent / (totalStudents * dailyStats.length)) * 100 
      : 0

    // Calculate monthly rate (current month)
    const currentMonth = new Date()
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
    
    const monthlyAttendance = await prisma.absensi.count({
      where: {
        tanggal: {
          gte: monthStart,
          lte: monthEnd
        },
        tipe: 'MASUK'
      }
    })

    const daysInMonth = monthEnd.getDate()
    const monthlyRate = totalStudents > 0 ? (monthlyAttendance / (totalStudents * daysInMonth)) * 100 : 0

    const stats = {
      totalStudents,
      totalPresent,
      totalAbsent,
      attendanceRate,
      dailyStats,
      weeklyStats,
      monthlyRate,
      todayPresent,
      todayAbsent
    }

    return NextResponse.json({
      success: true,
      data: stats
    })

  } catch (error) {
    console.error('Error fetching attendance stats:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            message: 'Invalid query parameters',
            details: error.errors
          } 
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        success: false, 
        error: { 
          message: 'Internal server error',
          details: error instanceof Error ? error.message : 'Unknown error'
        } 
      },
      { status: 500 }
    )
  }
}