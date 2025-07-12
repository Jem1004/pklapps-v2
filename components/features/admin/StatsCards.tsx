'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, UserCheck, UserX, TrendingUp, Calendar, Clock } from 'lucide-react'
import { AttendanceStats } from './StatsDashboard'

interface StatsCardsProps {
  stats: AttendanceStats
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const statsCards = [
    {
      title: 'Total Siswa',
      value: stats.totalStudents.toLocaleString(),
      icon: Users,
      description: 'Siswa terdaftar',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Hadir Hari Ini',
      value: stats.todayPresent.toLocaleString(),
      icon: UserCheck,
      description: 'Siswa hadir hari ini',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Tidak Hadir Hari Ini',
      value: stats.todayAbsent.toLocaleString(),
      icon: UserX,
      description: 'Siswa tidak hadir hari ini',
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Tingkat Kehadiran',
      value: formatPercentage(stats.attendanceRate),
      icon: TrendingUp,
      description: 'Rata-rata kehadiran periode ini',
      color: stats.attendanceRate >= 80 ? 'text-green-600' : stats.attendanceRate >= 60 ? 'text-yellow-600' : 'text-red-600',
      bgColor: stats.attendanceRate >= 80 ? 'bg-green-50' : stats.attendanceRate >= 60 ? 'bg-yellow-50' : 'bg-red-50'
    },
    {
      title: 'Total Kehadiran',
      value: stats.totalPresent.toLocaleString(),
      icon: Calendar,
      description: 'Total absensi hadir periode ini',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Tingkat Bulanan',
      value: formatPercentage(stats.monthlyRate),
      icon: Clock,
      description: 'Kehadiran bulan ini',
      color: stats.monthlyRate >= 80 ? 'text-green-600' : stats.monthlyRate >= 60 ? 'text-yellow-600' : 'text-red-600',
      bgColor: stats.monthlyRate >= 80 ? 'bg-green-50' : stats.monthlyRate >= 60 ? 'bg-yellow-50' : 'bg-red-50'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statsCards.map((card, index) => {
        const IconComponent = card.icon
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <IconComponent className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${card.color} mb-1`}>
                {card.value}
              </div>
              <p className="text-xs text-gray-500">
                {card.description}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}