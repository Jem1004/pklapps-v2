'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
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

// Komponen terpisah untuk menangani useSearchParams
function AdminDashboardContent() {
  const { useSearchParams } = require('next/navigation')
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
            <p className="text-gray-600">Memuat dashboard...</p>
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
      {/* Your existing dashboard content */}
      <div className="space-y-6">
        {/* Dashboard stats cards */}
        {dashboardStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Stats cards implementation */}
          </div>
        )}
        
        {/* Tabs for different admin functions */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
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