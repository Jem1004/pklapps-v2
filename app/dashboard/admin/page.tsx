'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import MainLayoutAdmin from '@/components/layout/MainLayoutAdmin'
import UserManagement from '@/components/admin/UserManagement'
import TempatPklManagement from '@/components/admin/TempatPklManagement'
import StudentMapping from '@/components/admin/StudentMapping'
import ActivityMonitoring from '@/components/admin/ActivityMonitoring'
import ImportUsers from '@/components/admin/ImportUsers'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Users, Building, UserCheck, Activity, Upload, TrendingUp, Loader2, RefreshCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

type TabType = 'users' | 'tempat-pkl' | 'mapping' | 'monitoring' | 'import'

interface DashboardStats {
  totalUsers: { value: number; change: string; label: string }
  totalStudents: { value: number; change: string; label: string }
  totalTeachers: { value: number; change: string; label: string }
  totalTempatPkl: { value: number; change: string; label: string }
  activeTempatPkl: { value: number; change: string; label: string }
  activeStudents: { value: number; change: string; label: string }
  totalAbsensi: { value: number; change: string; label: string }
  totalJurnal: { value: number; change: string; label: string }
  todayActivity: { value: number; change: string; label: string }
  todayAbsensi: { value: number; change: string; label: string }
  todayJurnal: { value: number; change: string; label: string }
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<TabType>('users')
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/auth/login')
      return
    }
    
    if (session.user.role !== 'ADMIN') {
      router.push('/dashboard/guru')
      return
    }

    // Get tab from URL params
    const tab = searchParams.get('tab') as TabType
    if (tab && ['users', 'tempat-pkl', 'mapping', 'monitoring', 'import'].includes(tab)) {
      setActiveTab(tab)
    }

    // Load dashboard stats
    loadDashboardStats()
  }, [session, status, router, searchParams])

  const loadDashboardStats = async () => {
    try {
      setError(null)
      const response = await fetch('/api/admin/dashboard')
      const result = await response.json()
      
      if (result.success) {
        setDashboardStats(result.data)
      } else {
        throw new Error(result.error || 'Failed to load dashboard stats')
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error)
      setError('Gagal memuat statistik dashboard')
      toast.error('Gagal memuat statistik dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await loadDashboardStats()
      toast.success('Statistik berhasil diperbarui')
    } catch (error) {
      toast.error('Gagal memperbarui statistik')
    } finally {
      setIsRefreshing(false)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
          <p className="text-gray-600 font-medium">Memuat dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session || session.user.role !== 'ADMIN') {
    return null
  }

  // Dynamic stats cards based on API data
  const statsCards = dashboardStats ? [
    {
      title: dashboardStats.totalUsers.label,
      value: dashboardStats.totalUsers.value.toString(),
      change: dashboardStats.totalUsers.change,
      icon: Users,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: dashboardStats.activeTempatPkl.label,
      value: dashboardStats.activeTempatPkl.value.toString(),
      change: dashboardStats.activeTempatPkl.change,
      icon: Building,
      color: 'from-green-500 to-green-600'
    },
    {
      title: dashboardStats.activeStudents.label,
      value: dashboardStats.activeStudents.value.toString(),
      change: dashboardStats.activeStudents.change,
      icon: UserCheck,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: dashboardStats.todayActivity.label,
      value: dashboardStats.todayActivity.value.toString(),
      change: dashboardStats.todayActivity.change,
      icon: Activity,
      color: 'from-orange-500 to-orange-600'
    }
  ] : []

  return (
    <MainLayoutAdmin>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Dashboard Admin
            </h1>
            <p className="text-slate-600 mt-2 text-lg">
              Kelola sistem PKL dan monitoring aktivitas siswa
            </p>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            className="flex items-center space-x-2"
          >
            {isRefreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}
            <span>{isRefreshing ? 'Memperbarui...' : 'Refresh'}</span>
          </Button>
        </motion.div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-xl p-4"
          >
            <p className="text-red-800 font-medium">{error}</p>
          </motion.div>
        )}

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {statsCards.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-600 text-sm font-medium">{stat.title}</p>
                        <p className="text-3xl font-bold text-slate-800 mt-1">{stat.value}</p>
                        <div className="flex items-center mt-2">
                          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                          <span className="text-green-500 text-sm font-medium">{stat.change}</span>
                        </div>
                      </div>
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Additional Stats Row */}
        {dashboardStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-indigo-100">
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-indigo-600 text-sm font-medium">Total Absensi</p>
                  <p className="text-3xl font-bold text-indigo-800 mt-1">
                    {dashboardStats.totalAbsensi.value.toLocaleString()}
                  </p>
                  <p className="text-indigo-500 text-sm mt-1">{dashboardStats.totalAbsensi.change}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100">
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-emerald-600 text-sm font-medium">Total Jurnal</p>
                  <p className="text-3xl font-bold text-emerald-800 mt-1">
                    {dashboardStats.totalJurnal.value.toLocaleString()}
                  </p>
                  <p className="text-emerald-500 text-sm mt-1">{dashboardStats.totalJurnal.change}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg bg-gradient-to-br from-rose-50 to-rose-100">
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-rose-600 text-sm font-medium">Total Siswa</p>
                  <p className="text-3xl font-bold text-rose-800 mt-1">
                    {dashboardStats.totalStudents.value.toLocaleString()}
                  </p>
                  <p className="text-rose-500 text-sm mt-1">{dashboardStats.totalStudents.change}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabType)}>
            <TabsList className="grid w-full grid-cols-5 bg-white border border-slate-200 p-1 rounded-xl">
              <TabsTrigger 
                value="users" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-lg"
              >
                <Users className="w-4 h-4 mr-2" />
                Manajemen User
              </TabsTrigger>
              <TabsTrigger 
                value="tempat-pkl"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-lg"
              >
                <Building className="w-4 h-4 mr-2" />
                Tempat PKL
              </TabsTrigger>
              <TabsTrigger 
                value="mapping"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-lg"
              >
                <UserCheck className="w-4 h-4 mr-2" />
                Mapping Siswa
              </TabsTrigger>
              <TabsTrigger 
                value="monitoring"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-lg"
              >
                <Activity className="w-4 h-4 mr-2" />
                Monitoring
              </TabsTrigger>
              <TabsTrigger 
                value="import"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-lg"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import Data
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="mt-8">
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
                  <CardTitle className="text-slate-800 flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Manajemen User
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <UserManagement />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tempat-pkl" className="mt-8">
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b border-green-200">
                  <CardTitle className="text-slate-800 flex items-center">
                    <Building className="w-5 h-5 mr-2" />
                    Manajemen Tempat PKL
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <TempatPklManagement />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="mapping" className="mt-8">
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 border-b border-purple-200">
                  <CardTitle className="text-slate-800 flex items-center">
                    <UserCheck className="w-5 h-5 mr-2" />
                    Mapping Siswa ke Tempat PKL
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <StudentMapping />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="monitoring" className="mt-8">
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200">
                  <CardTitle className="text-slate-800 flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    Monitoring Aktivitas
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ActivityMonitoring />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="import" className="mt-8">
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100 border-b border-indigo-200">
                  <CardTitle className="text-slate-800 flex items-center">
                    <Upload className="w-5 h-5 mr-2" />
                    Import Data User
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ImportUsers />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </MainLayoutAdmin>
  )
}