'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Calendar } from 'lucide-react'
import { DailyAttendance } from './StatsDashboard'

interface OverviewChartProps {
  data: DailyAttendance[]
}

export default function OverviewChart({ data }: OverviewChartProps) {
  // Format data untuk chart
  const chartData = data.map(item => ({
    date: new Date(item.date).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short'
    }),
    fullDate: item.date,
    Hadir: item.present,
    'Tidak Hadir': item.absent,
    'Tingkat Kehadiran': item.rate
  }))

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">
            {new Date(data.fullDate).toLocaleDateString('id-ID', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
          <div className="space-y-1">
            <p className="text-green-600">
              <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              Hadir: {data.Hadir} siswa
            </p>
            <p className="text-red-600">
              <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>
              Tidak Hadir: {data['Tidak Hadir']} siswa
            </p>
            <p className="text-blue-600 font-medium">
              Tingkat Kehadiran: {data['Tingkat Kehadiran'].toFixed(1)}%
            </p>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Overview Kehadiran Harian
        </CardTitle>
        <p className="text-sm text-gray-600">
          Grafik kehadiran siswa per hari dalam periode yang dipilih
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
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
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{
                  paddingTop: '20px'
                }}
              />
              <Bar 
                dataKey="Hadir" 
                fill="#10b981" 
                radius={[2, 2, 0, 0]}
                name="Hadir"
              />
              <Bar 
                dataKey="Tidak Hadir" 
                fill="#ef4444" 
                radius={[2, 2, 0, 0]}
                name="Tidak Hadir"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Summary */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {chartData.reduce((sum, item) => sum + item.Hadir, 0)}
              </div>
              <div className="text-gray-600">Total Hadir</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {chartData.reduce((sum, item) => sum + item['Tidak Hadir'], 0)}
              </div>
              <div className="text-gray-600">Total Tidak Hadir</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}