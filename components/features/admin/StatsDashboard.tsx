'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RefreshCcw, TrendingUp, Users, Calendar, Clock } from 'lucide-react'
import { toast } from 'sonner'
import OverviewChart from './OverviewChart'
import RateChart from './RateChart'
import StatsCards from './StatsCards'

export interface AttendanceStats {
  totalStudents: number
  totalPresent: number
  totalAbsent: number
  attendanceRate: number
  dailyStats: DailyAttendance[]
  weeklyStats: WeeklyAttendance[]
  monthlyRate: number
  todayPresent: number
  todayAbsent: number
}

export interface DailyAttendance {
  date: string
  present: number
  absent: number
  rate: number
}

export interface WeeklyAttendance {
  week: string
  present: number
  absent: number
  rate: number
}

interface StatsDashboardProps {
  className?: string
}

export default function StatsDashboard({ className }: StatsDashboardProps) {
  const [stats, setStats] = useState<AttendanceStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
    endDate: new Date().toISOString().split('T')[0] // today
  })

  const loadStats = async () => {
    try {
      setError(null)
      const response = await fetch(
        `/api/admin/attendance-stats?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`
      )
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (result.success) {
        setStats(result.data)
      } else {
        throw new Error(result.error?.message || 'Failed to load attendance stats')
      }
    } catch (error) {
      console.error('Error loading attendance stats:', error)
      const errorMessage = error instanceof Error ? error.message : 'Gagal memuat statistik absensi'
      setError(errorMessage)
      toast.error('Gagal memuat statistik absensi')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await loadStats()
      toast.success('Statistik berhasil diperbarui')
    } catch (error) {
      toast.error('Gagal memperbarui statistik')
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleDateRangeChange = (field: 'startDate' | 'endDate', value: string) => {
    setDateRange(prev => ({ ...prev, [field]: value }))
  }

  const applyDateFilter = () => {
    setIsLoading(true)
    loadStats()
  }

  useEffect(() => {
    loadStats()
  }, [])

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Dashboard Statistik Absensi</h2>
          <Button disabled variant="outline">
            <RefreshCcw className="h-4 w-4 mr-2 animate-spin" />
            Memuat...
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Dashboard Statistik Absensi</h2>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCcw className="h-4 w-4 mr-2" />
            Coba Lagi
          </Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="text-red-500 text-lg font-medium">{error}</div>
              <Button onClick={handleRefresh} variant="outline">
                <RefreshCcw className="h-4 w-4 mr-2" />
                Coba Lagi
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Dashboard Statistik Absensi</h2>
        <div className="flex items-center gap-2">
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            disabled={isRefreshing}
            size="sm"
          >
            <RefreshCcw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Date Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Filter Periode
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Tanggal Mulai</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Tanggal Akhir</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button onClick={applyDateFilter} disabled={isLoading}>
              Terapkan Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      {stats && <StatsCards stats={stats} />}

      {/* Charts */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <OverviewChart data={stats.dailyStats} />
          <RateChart data={stats.weeklyStats} monthlyRate={stats.monthlyRate} />
        </div>
      )}
    </div>
  )
}