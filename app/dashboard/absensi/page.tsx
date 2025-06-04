"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Calendar, 
  Search, 
  AlertTriangle, 
  Clock, 
  User, 
  Loader2,
  RefreshCw,
  FileText
} from "lucide-react"
import { getAbsensiData, AbsensiData } from "./actions"
import AbsensiCard from "./components/AbsensiCard"
import { toast } from "sonner"
import StudentNavigationLayout from '@/components/layout/StudentNavigationLayout'

export default function DashboardAbsensiPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [absensiData, setAbsensiData] = useState<AbsensiData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sudahAbsenHariIni, setSudahAbsenHariIni] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMonth, setSelectedMonth] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Redirect jika bukan student
  useEffect(() => {
    if (status === "loading") return
    
    if (!session?.user) {
      router.push("/auth/login")
      return
    }

    if (session.user.role !== "STUDENT") {
      router.push("/dashboard")
      return
    }
  }, [session, status, router])

  // Load data absensi
  const loadAbsensiData = async (bulan?: string) => {
    try {
      setIsLoading(true)
      const result = await getAbsensiData(bulan)
      
      if (result.success && result.data) {
        setAbsensiData(result.data)
        setSudahAbsenHariIni(result.sudahAbsenHariIni)
      } else {
        toast.error(result.message || "Gagal memuat data absensi")
      }
    } catch (error) {
      console.error("Error loading absensi data:", error)
      toast.error("Terjadi kesalahan saat memuat data")
    } finally {
      setIsLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    if (session?.user?.role === "STUDENT") {
      loadAbsensiData()
    }
  }, [session])

  // Handle filter bulan
  const handleMonthFilter = async () => {
    if (selectedMonth) {
      await loadAbsensiData(selectedMonth)
    } else {
      await loadAbsensiData()
    }
  }

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true)
    await loadAbsensiData(selectedMonth || undefined)
    setIsRefreshing(false)
  }

  // Filter data berdasarkan search term
  const filteredData = absensiData.filter(absensi => {
    if (!searchTerm) return true
    
    const searchLower = searchTerm.toLowerCase()
    const tanggal = new Date(absensi.tanggal).toLocaleDateString('id-ID')
    const tempatPkl = absensi.tempatPkl.nama.toLowerCase()
    const tipe = absensi.tipe.toLowerCase()
    
    return tanggal.includes(searchLower) || 
           tempatPkl.includes(searchLower) || 
           tipe.includes(searchLower)
  })

  // Loading state
  if (status === "loading" || (isLoading && absensiData.length === 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-gray-600">Memuat data absensi...</p>
        </div>
      </div>
    )
  }

  // Jika bukan student, tidak render apapun (akan redirect)
  if (!session?.user || session.user.role !== "STUDENT") {
    return null
  }

  return (
    <StudentNavigationLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header with Navigation */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Riwayat Absensi</h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Selamat datang, {session.user.name}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                onClick={() => router.push('/dashboard/jurnal')}
                variant="outline"
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Jurnal PKL
              </Button>
              <Button 
                onClick={() => router.push('/absensi')}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                Absensi Harian
              </Button>
              <Button 
                onClick={() => router.push('/dashboard')}
                variant="outline"
                className="flex items-center gap-2"
              >
                Dashboard
              </Button>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Riwayat Absensi</h1>
                <p className="text-gray-600 mt-1">Pantau kehadiran PKL Anda</p>
              </div>
              <Button 
                onClick={handleRefresh} 
                disabled={isRefreshing}
                variant="outline"
                size="sm"
              >
                {isRefreshing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
            </div>
  
            {/* User Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{session.user.name}</p>
                    <p className="text-sm text-gray-600">@{session.user.username}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
  
          {/* Notifikasi hari ini */}
          {!sudahAbsenHariIni && (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="font-medium text-orange-800">
                      ⚠️ Anda belum melakukan absensi hari ini
                    </p>
                    <p className="text-sm text-orange-700 mt-1">
                      Jangan lupa untuk melakukan absensi masuk dan pulang
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
  
          {/* Filter dan Search */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="h-5 w-5" />
                <span>Filter & Pencarian</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <div className="space-y-2">
                  <Label htmlFor="search">Cari</Label>
                  <Input
                    id="search"
                    placeholder="Cari tanggal, tempat, atau status..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                {/* Filter Bulan */}
                <div className="space-y-2">
                  <Label htmlFor="month">Filter Bulan</Label>
                  <Input
                    id="month"
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  />
                </div>
                
                {/* Button Filter */}
                <div className="space-y-2">
                  <Label>&nbsp;</Label>
                  <div className="flex space-x-2">
                    <Button onClick={handleMonthFilter} className="flex-1">
                      <Calendar className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSelectedMonth("")
                        setSearchTerm("")
                        loadAbsensiData()
                      }}
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
  
          {/* Data Absensi */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                <p className="text-gray-600">Memuat data...</p>
              </div>
            ) : filteredData.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Tidak ada data absensi
                  </h3>
                  <p className="text-gray-600">
                    {searchTerm || selectedMonth 
                      ? "Tidak ada data yang sesuai dengan filter" 
                      : "Anda belum memiliki riwayat absensi"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Daftar Absensi ({filteredData.length})
                  </h2>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>Diurutkan dari terbaru</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {filteredData.map((absensi) => (
                    <AbsensiCard key={absensi.id} absensi={absensi} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </StudentNavigationLayout>
  )
}