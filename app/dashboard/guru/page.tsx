'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import MainLayoutGuru from '@/components/layout/MainLayoutGuru'
import JurnalGuruGroupedList from '@/components/guru/JurnalGuruGroupedList'
import JurnalGuruList from '@/components/guru/JurnalGuruList'
import StudentBimbinganList from '@/components/guru/StudentBimbinganList'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Users, FileText, Calendar, TrendingUp, Loader2 } from 'lucide-react'

interface DashboardData {
  totalStudents: number
  totalAbsensi: number
  todayAbsensi: number
  recentActivity: Array<{
    studentName: string
    date: Date
    type: string
  }>
  studentsActivity: Array<{
    name: string
    lastAttendance: Date | null
  }>
}

export default function GuruDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'students' | 'grouped' | 'list'>('students')
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/auth/login')
      return
    }
    
    if (session.user.role !== 'TEACHER') {
      router.push('/dashboard/admin')
      return
    }

    // Load dashboard data
    loadDashboardData()
  }, [session, status, router])

  const loadDashboardData = async () => {
    try {
      const response = await fetch('/api/guru/dashboard')
      const result = await response.json()
      
      if (result.success) {
        setDashboardData(result.data)
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
          <p className="text-gray-600 font-medium">Memuat dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session || session.user.role !== 'TEACHER') {
    return null
  }

  return (
    <MainLayoutGuru>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="space-y-2">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
          >
            Dashboard Guru
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 text-lg"
          >
            Monitoring jurnal dan aktivitas siswa bimbingan
          </motion.p>
        </div>

        {/* Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Siswa</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboardData?.totalStudents || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-600">Absen Hari Ini</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboardData?.todayAbsensi || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-600">Total Absensi</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboardData?.totalAbsensi || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'students' | 'grouped' | 'list')}>
            <TabsList className="grid w-full grid-cols-3 bg-white shadow-md border border-gray-200 rounded-xl p-1">
              <TabsTrigger 
                value="students" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white rounded-lg font-medium transition-all duration-200"
              >
                <Users className="w-4 h-4 mr-2" />
                Siswa Bimbingan
              </TabsTrigger>
              <TabsTrigger 
                value="grouped" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white rounded-lg font-medium transition-all duration-200"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Jurnal Tergrup
              </TabsTrigger>
              <TabsTrigger 
                value="list" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white rounded-lg font-medium transition-all duration-200"
              >
                <FileText className="w-4 h-4 mr-2" />
                Daftar Jurnal
              </TabsTrigger>
            </TabsList>

            <TabsContent value="students" className="mt-8">
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-blue-600" />
                    Daftar Siswa Bimbingan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <StudentBimbinganList />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="grouped" className="mt-8">
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-green-600" />
                    Jurnal Siswa (Tergrup)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <JurnalGuruGroupedList />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="list" className="mt-8">
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-purple-600" />
                    Semua Jurnal Siswa
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <JurnalGuruList />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </MainLayoutGuru>
  )
}