'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { motion } from 'framer-motion'
import MainLayoutAdmin from '@/components/layout/MainLayoutAdmin'
import UserManagement from '@/components/features/admin/UserManagement'
import TempatPklManagement from '@/components/features/admin/TempatPklManagement'
import StudentMapping from '@/components/features/admin/StudentMapping'
import ActivityMonitoring from '@/components/features/admin/ActivityMonitoring'
import ImportUsers from '@/components/features/admin/ImportUsers'
import StatsDashboard from '@/components/features/admin/StatsDashboard'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Users, Building, UserCheck, Activity, Upload, TrendingUp, Loader2, RefreshCcw, BarChart3, FileSpreadsheet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

type TabType = 'users' | 'tempat-pkl' | 'mapping' | 'monitoring' | 'import' | 'statistics'

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

// Komponen terpisah untuk menangani useSearchParams
function AdminDashboardContent() {
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('users')
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      console.log('Admin access denied: No session')
      router.push('/auth/login')
      return
    }
    
    if (session.user.role !== 'ADMIN') {
      console.log('Admin access denied:', { user: session.user, role: session.user.role })
      router.push('/dashboard/guru')
      return
    }

    // Get tab from URL params
    const tab = searchParams.get('tab') as TabType
    if (tab && ['users', 'tempat-pkl', 'mapping', 'monitoring', 'import', 'statistics'].includes(tab)) {
      setActiveTab(tab)
    }

    // Load dashboard stats
    loadDashboardStats()
  }, [session, status, router, searchParams])

  const loadDashboardStats = async () => {
    try {
      setError(null)
      const response = await fetch('/api/admin/dashboard')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (result.success) {
        setDashboardStats(result.data)
      } else {
        const errorMessage = typeof result.error === 'string' 
          ? result.error 
          : result.error?.message || 'Failed to load dashboard stats'
        throw new Error(errorMessage)
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error)
      
      // Handle different error types properly
      let errorMessage = 'Gagal memuat statistik dashboard'
      
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === 'string') {
        errorMessage = error
      } else if (error && typeof error === 'object') {
        errorMessage = JSON.stringify(error)
      }
      
      setError(errorMessage)
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

  const handleTabChange = (value: string) => {
    const newTab = value as TabType
    setActiveTab(newTab)
    
    // Update URL without page reload
    const url = new URL(window.location.href)
    url.searchParams.set('tab', newTab)
    window.history.replaceState({}, '', url.toString())
  }

  if (status === 'loading' || isLoading) {
    return (
      <MainLayoutAdmin>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
            <p className="text-gray-600">Memuat dashboard admin...</p>
          </div>
        </div>
      </MainLayoutAdmin>
    )
  }

  if (error) {
    return (
      <MainLayoutAdmin>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="text-red-500 text-lg font-medium">{error}</div>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCcw className="h-4 w-4 mr-2" />
              Coba Lagi
            </Button>
          </div>
        </div>
      </MainLayoutAdmin>
    )
  }

  // Rest of your component logic...
  // (Include all the existing JSX and logic from the original component)
  
  return (
    <MainLayoutAdmin>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
            <p className="text-gray-600 mt-1">Kelola sistem jurnal PKL</p>
          </div>
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCcw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Dashboard stats cards */}
        {dashboardStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats.totalUsers?.value || 0}</div>
                <p className="text-xs text-muted-foreground">{dashboardStats.totalUsers?.change || ''}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats.totalStudents?.value || 0}</div>
                <p className="text-xs text-muted-foreground">{dashboardStats.totalStudents?.change || ''}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tempat PKL</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats.totalTempatPkl?.value || 0}</div>
                <p className="text-xs text-muted-foreground">{dashboardStats.totalTempatPkl?.change || ''}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Aktivitas Hari Ini</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats.todayActivity?.value || 0}</div>
                <p className="text-xs text-muted-foreground">{dashboardStats.todayActivity?.change || ''}</p>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Tabs for different admin functions */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="tempat-pkl" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              <span className="hidden sm:inline">Tempat PKL</span>
            </TabsTrigger>
            <TabsTrigger value="mapping" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Mapping</span>
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Monitoring</span>
            </TabsTrigger>
            <TabsTrigger value="statistics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Statistik</span>
            </TabsTrigger>
            <TabsTrigger value="import" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Import</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>
          <TabsContent value="tempat-pkl">
            <TempatPklManagement />
          </TabsContent>
          <TabsContent value="mapping">
            <StudentMapping />
          </TabsContent>
          <TabsContent value="monitoring">
            <ActivityMonitoring />
          </TabsContent>
          <TabsContent value="statistics">
            <StatsDashboard />
          </TabsContent>
          <TabsContent value="import">
            <ImportUsers />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayoutAdmin>
  )
}

// Loading fallback component
function DashboardLoading() {
  return (
    <MainLayoutAdmin>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
          <p className="text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    </MainLayoutAdmin>
  )
}

// Main component dengan Suspense boundary
export default function AdminDashboard() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <AdminDashboardContent />
    </Suspense>
  )
}