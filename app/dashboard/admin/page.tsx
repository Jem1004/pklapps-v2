"use client"

import { useSession, signOut } from "../../../node_modules/next-auth/react"
import { useRouter } from "../../../node_modules/next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/../components/ui/button"
import { LogOut, Users, Building, UserCheck, BarChart3, Upload } from "lucide-react"
import UserManagement from "@/../components/admin/UserManagement"
import TempatPklManagement from "@/../components/admin/TempatPklManagement"
import StudentMapping from "@/../components/admin/StudentMapping"
import ActivityMonitoring from "@/../components/admin/ActivityMonitoring"
import ImportUsers from "@/../components/admin/ImportUsers"

type TabType = 'users' | 'tempat-pkl' | 'mapping' | 'monitoring' | 'import'

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('users')

  useEffect(() => {
    if (status === "loading") return
    
    if (!session) {
      router.push("/auth/login")
      return
    }
    
    if (session.user.role !== "ADMIN") {
      router.push("/dashboard/jurnal")
      return
    }
  }, [session, status, router])

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/auth/login" })
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session || session.user.role !== "ADMIN") {
    return null
  }

  const tabs = [
    { id: 'users' as TabType, label: 'Manajemen User', icon: Users },
    { id: 'tempat-pkl' as TabType, label: 'Tempat PKL', icon: Building },
    { id: 'mapping' as TabType, label: 'Mapping Siswa', icon: UserCheck },
    { id: 'monitoring' as TabType, label: 'Monitoring', icon: BarChart3 },
    { id: 'import' as TabType, label: 'Import Users', icon: Upload },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
                <p className="text-sm text-gray-600">Kelola sistem Jurnal PKL SMK</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{session.user.name}</p>
                <p className="text-xs text-gray-600">Administrator</p>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'default' : 'outline'}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </Button>
              )
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'tempat-pkl' && <TempatPklManagement />}
          {activeTab === 'mapping' && <StudentMapping />}
          {activeTab === 'monitoring' && <ActivityMonitoring />}
          {activeTab === 'import' && <ImportUsers />}
        </div>
      </div>
    </div>
  )
}