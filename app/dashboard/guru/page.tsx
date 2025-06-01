"use client"

import { useSession, signOut } from "../../../node_modules/next-auth/react"
import { useRouter } from "../../../node_modules/next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut, Users, FileText, UserCheck } from "lucide-react"
import JurnalGuruGroupedList from "@/components/guru/JurnalGuruGroupedList"
import JurnalGuruList from "@/components/guru/JurnalGuruList"
import StudentBimbinganList from "@/components/guru/StudentBimbinganList"

export default function GuruDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'students' | 'grouped' | 'list'>('students')

  useEffect(() => {
    if (status === "loading") return
    
    if (!session) {
      router.push("/auth/login")
      return
    }
    
    if (session.user.role !== "TEACHER") {
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

  if (!session || session.user.role !== "TEACHER") {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Guru</h1>
                <p className="text-sm text-gray-600">Kelola siswa bimbingan dan jurnal PKL</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{session.user.name}</p>
                <p className="text-xs text-gray-600">Guru</p>
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
        <div className="mb-6">
          <div className="flex gap-2">
            <Button
              variant={activeTab === 'students' ? 'default' : 'outline'}
              onClick={() => setActiveTab('students')}
              className="flex items-center gap-2"
            >
              <UserCheck className="h-4 w-4" />
              Siswa Bimbingan
            </Button>
            <Button
              variant={activeTab === 'grouped' ? 'default' : 'outline'}
              onClick={() => setActiveTab('grouped')}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Jurnal per Siswa
            </Button>
            <Button
              variant={activeTab === 'list' ? 'default' : 'outline'}
              onClick={() => setActiveTab('list')}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Semua Jurnal
            </Button>
          </div>
        </div>

        {activeTab === 'students' && <StudentBimbinganList />}
        {activeTab === 'grouped' && <JurnalGuruGroupedList />}
        {activeTab === 'list' && <JurnalGuruList />}
      </div>
    </div>
  )
}