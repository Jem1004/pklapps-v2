'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { WeeklyAttendance } from './StatsDashboard'

interface RateChartProps {
  data: WeeklyAttendance[]
  monthlyRate: number
}

export default function RateChart({ data, monthlyRate }: RateChartProps) {
  // Format data untuk chart
  const chartData = data.map(item => ({
    week: item.week,
    rate: item.rate,
    present: item.present,
    absent: item.absent
  }))

  // Hitung trend
  const calculateTrend = () => {
    if (chartData.length < 2) return { trend: 'stable', value: 0 }
    
    const firstRate = chartData[0].rate
    const lastRate = chartData[chartData.length - 1].rate
    const difference = lastRate - firstRate
    
    if (Math.abs(difference) < 1) {
      return { trend: 'stable', value: difference }
    } else if (difference > 0) {
      return { trend: 'up', value: difference }
    } else {
      return { trend: 'down', value: difference }
    }
  }

  const trend = calculateTrend()

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-blue-600">
              <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
              Tingkat Kehadiran: {data.rate.toFixed(1)}%
            </p>
            <p className="text-green-600">
              Hadir: {data.present} siswa
            </p>
            <p className="text-red-600">
              Tidak Hadir: {data.absent} siswa
            </p>
          </div>
        </div>
      )
    }
    return null
  }

  // Tentukan warna berdasarkan rate
  const getRateColor = (rate: number) => {
    if (rate >= 80) return '#10b981' // green
    if (rate >= 60) return '#f59e0b' // yellow
    return '#ef4444' // red
  }

  const getTrendIcon = () => {
    switch (trend.trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const getTrendText = () => {
    switch (trend.trend) {
      case 'up':
        return `Naik ${trend.value.toFixed(1)}%`
      case 'down':
        return `Turun ${Math.abs(trend.value).toFixed(1)}%`
      default:
        return 'Stabil'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Tingkat Kehadiran Mingguan
        </CardTitle>
        <p className="text-sm text-gray-600">
          Tren tingkat kehadiran siswa per minggu
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <defs>
                <linearGradient id="rateGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="week" 
                stroke="#666"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#666"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="rate"
                stroke="#3b82f6"
                strokeWidth={3}
                fill="url(#rateGradient)"
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {/* Summary */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {monthlyRate.toFixed(1)}%
              </div>
              <div className="text-gray-600 text-sm">Rata-rata Bulanan</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-lg font-medium">
                {getTrendIcon()}
                <span className={`${
                  trend.trend === 'up' ? 'text-green-600' : 
                  trend.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {getTrendText()}
                </span>
              </div>
              <div className="text-gray-600 text-sm">Tren Mingguan</div>
            </div>
          </div>
        </div>

        {/* Rate indicators */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Baik (≥80%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Cukup (60-79%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Kurang (&lt;60%)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}