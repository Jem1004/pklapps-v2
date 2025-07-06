import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { handleApiError } from "@/lib/api/response"
import { dashboardQueries, queryPerformance } from "@/lib/database/queryOptimization"
import { jurnalQueries } from "@/lib/database/queryOptimization"
import { cachedQueries } from "@/lib/cache/strategy"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const handleGetDashboard = async () => {
      // Use cached dashboard stats with optimized queries
      return await cachedQueries.getDashboardStats(async () => {
        const [dashboardStats, recentJurnals] = await Promise.all([
          queryPerformance.withTiming(
            'dashboard-stats',
            () => dashboardQueries.getDashboardStats()
          ),
          queryPerformance.withTiming(
            'recent-jurnals',
            () => jurnalQueries.getRecentJurnals(1, 5)
          )
        ])

        const totalUsers = Object.values(dashboardStats.users).reduce((sum, count) => sum + count, 0)
        const totalStudents = dashboardStats.users.student || 0
        const totalTeachers = dashboardStats.users.teacher || 0
        const totalAbsensi = dashboardStats.absensis.total
        const totalJurnal = dashboardStats.jurnals.total
        const todayAbsensi = dashboardStats.absensis.today
        const todayJurnal = dashboardStats.jurnals.today
        const activeStudents = dashboardStats.students.total

        return {
          totalUsers: { value: totalUsers, change: "+0%", label: "Total Users" },
          totalStudents: { value: totalStudents, change: "+0%", label: "Total Students" },
          totalTeachers: { value: totalTeachers, change: "+0%", label: "Total Teachers" },
          totalTempatPkl: { value: 0, change: "+0%", label: "Total Tempat PKL" },
          activeTempatPkl: { value: 0, change: "+0%", label: "Active Tempat PKL" },
          activeStudents: { value: activeStudents, change: "+0%", label: "Active Students" },
          totalAbsensi: { value: totalAbsensi, change: "+0%", label: "Total Absensi" },
          totalJurnal: { value: totalJurnal, change: "+0%", label: "Total Jurnal" },
          todayActivity: { value: todayAbsensi + todayJurnal, change: "+0%", label: "Today Activity" },
          todayAbsensi: { value: todayAbsensi, change: "+0%", label: "Today Absensi" },
          todayJurnal: { value: todayJurnal, change: "+0%", label: "Today Jurnal" },
          recentJurnals: recentJurnals.jurnals
        }
      })
    }

    const dashboardData = await handleGetDashboard()
    return NextResponse.json({ success: true, data: dashboardData })
  } catch (error) {
    return handleApiError(error as Error)
  }
}