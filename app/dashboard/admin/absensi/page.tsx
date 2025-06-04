'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import MainLayoutAdmin from '@/components/layout/MainLayoutAdmin'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ClipboardCopy,
  Eye,
  Trash2,
  RefreshCcw,
  QrCode,
  MapPin,
  Users,
  Calendar,
  Clock,
  Filter,
  Search,
  Settings,
  Save,
  AlertCircle,
  Key,
  Building,
  Copy,
  Edit,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  CheckCircle,
  XCircle,
  FileText,
  Shuffle
} from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'

interface TempatPkl {
  id: string
  nama: string
  alamat: string
  pinAbsensi: string
  isActive: boolean
  _count: {
    students: number
  }
}

interface AbsensiData {
  id: string
  tanggal: string
  jamMasuk: string | null
  jamKeluar: string | null
  status: string
  student: {
    user: {
      name: string
    }
    tempatPkl?: {
      nama: string
      alamat: string
    }
  }
  tempatPkl?: {
    nama: string
    alamat: string
  }
}

export default function AdminAbsensiPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('data')
  const [absensiData, setAbsensiData] = useState<AbsensiData[]>([])
  const [filteredData, setFilteredData] = useState<AbsensiData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null })
  const [viewDialog, setViewDialog] = useState({ open: false, data: null })

  // PIN Settings state
  const [tempatPklList, setTempatPklList] = useState<TempatPkl[]>([])
  const [pinDialog, setPinDialog] = useState({ open: false, tempatPkl: null as TempatPkl | null })
  const [newPin, setNewPin] = useState('')
  const [pinLoading, setPinLoading] = useState(false)
  const [settingsLoading, setSettingsLoading] = useState(false)

  // Auth check
  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/login')
      return
    }

    if (session.user.role !== 'ADMIN') {
      router.push('/dashboard')
      return
    }

    loadAbsensiData()
    loadTempatPklList()
  }, [session, status, router])

  // Filter data when search term, filter status, or date range changes
  useEffect(() => {
    filterData()
  }, [absensiData, searchTerm, filterStatus, dateRange])

  const loadAbsensiData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/absensi')
      if (response.ok) {
        const data = await response.json()
        setAbsensiData(data.data || [])
      } else {
        toast.error('Gagal memuat data absensi')
      }
    } catch (error) {
      console.error('Error loading absensi data:', error)
      toast.error('Terjadi kesalahan saat memuat data')
    } finally {
      setLoading(false)
    }
  }

  const loadTempatPklList = async () => {
    try {
      setSettingsLoading(true)
      const response = await fetch('/api/admin/tempat-pkl')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setTempatPklList(data.data || [])
        }
      } else {
        toast.error('Gagal memuat data tempat PKL')
      }
    } catch (error) {
      console.error('Error loading tempat PKL:', error)
      toast.error('Terjadi kesalahan saat memuat data tempat PKL')
    } finally {
      setSettingsLoading(false)
    }
  }

  const filterData = () => {
    let filtered = [...absensiData]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item => {
        const studentName = item.student?.user?.name?.toLowerCase() || ''
        const tempatPklName = (item.tempatPkl?.nama || item.student?.tempatPkl?.nama || '').toLowerCase()
        return studentName.includes(searchTerm.toLowerCase()) || tempatPklName.includes(searchTerm.toLowerCase())
      })
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(item => {
        const status = item.status?.toLowerCase() || ''
        return status === filterStatus.toLowerCase()
      })
    }

    // Date range filter
    if (dateRange.start) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.tanggal)
        const startDate = new Date(dateRange.start)
        return itemDate >= startDate
      })
    }

    if (dateRange.end) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.tanggal)
        const endDate = new Date(dateRange.end)
        return itemDate <= endDate
      })
    }

    setFilteredData(filtered)
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/absensi/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await loadAbsensiData()
        setDeleteDialog({ open: false, id: null })
        toast.success('Data absensi berhasil dihapus')
      } else {
        toast.error('Gagal menghapus data absensi')
      }
    } catch (error) {
      console.error('Error deleting absensi:', error)
      toast.error('Gagal menghapus data absensi')
    }
  }

  const handleView = (data: any) => {
    setViewDialog({ open: true, data })
  }

  const handleUpdatePin = async () => {
    if (!pinDialog.tempatPkl || !newPin.trim()) {
      toast.error('PIN tidak boleh kosong')
      return
    }

    if (newPin.trim().length < 4) {
      toast.error('PIN minimal 4 karakter')
      return
    }

    try {
      setPinLoading(true)
      const response = await fetch('/api/admin/tempat-pkl/update-pin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tempatPklId: pinDialog.tempatPkl.id,
          newPin: newPin.trim()
        }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        await loadTempatPklList()
        setPinDialog({ open: false, tempatPkl: null })
        setNewPin('')
        toast.success('PIN berhasil diperbarui')
      } else {
        toast.error(result.message || 'Gagal memperbarui PIN')
      }
    } catch (error) {
      console.error('Error updating PIN:', error)
      toast.error('Terjadi kesalahan saat memperbarui PIN')
    } finally {
      setPinLoading(false)
    }
  }

  const handleToggleStatus = async (tempatPklId: string, currentStatus: boolean) => {
    try {
      const response = await fetch('/api/admin/tempat-pkl/toggle-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tempatPklId,
          isActive: !currentStatus
        }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        await loadTempatPklList()
        toast.success(`Tempat PKL berhasil ${!currentStatus ? 'diaktifkan' : 'dinonaktifkan'}`)
      } else {
        toast.error(result.message || 'Gagal mengubah status tempat PKL')
      }
    } catch (error) {
      console.error('Error toggling status:', error)
      toast.error('Gagal mengubah status tempat PKL')
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('PIN berhasil disalin ke clipboard')
  }

  const generateNewPin = () => {
    const pin = Math.random().toString(36).substring(2, 8).toUpperCase()
    setNewPin(pin)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'HADIR':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Hadir</Badge>
      case 'TERLAMBAT':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Terlambat</Badge>
      case 'TIDAK_HADIR':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Tidak Hadir</Badge>
      default:
        return <Badge variant="secondary">-</Badge>
    }
  }

  const formatTime = (timeString: string | null) => {
    if (!timeString) return '-'
    return new Date(timeString).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-600 font-medium">Memuat dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session || session.user.role !== 'ADMIN') {
    return null
  }

  return (
    <MainLayoutAdmin>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Manajemen Absensi
          </h1>
          <p className="text-slate-600 mt-2 text-lg">
            Kelola data absensi siswa PKL dan pengaturan PIN
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            {
              title: 'Total Absensi',
              value: filteredData.length,
              change: '+12.5%',
              icon: ClipboardCopy,
              color: 'from-blue-500 to-blue-600'
            },
            {
              title: 'Hadir',
              value: filteredData.filter((item: any) => item.status === 'HADIR').length,
              change: '+8.2%',
              icon: CheckCircle,
              color: 'from-green-500 to-green-600'
            },
            {
              title: 'Terlambat',
              value: filteredData.filter((item: any) => item.status === 'TERLAMBAT').length,
              change: '+2.1%',
              icon: Clock,
              color: 'from-orange-500 to-orange-600'
            },
            {
              title: 'Tidak Hadir',
              value: filteredData.filter((item: any) => item.status === 'TIDAK_HADIR').length,
              change: '-5.3%',
              icon: XCircle,
              color: 'from-red-500 to-red-600'
            }
          ].map((stat, index) => {
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

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 bg-white border border-slate-200 p-1 rounded-xl">
              <TabsTrigger
                value="data"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-lg"
              >
                <ClipboardCopy className="w-4 h-4 mr-2" />
                Data Absensi
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-lg"
              >
                <Settings className="w-4 h-4 mr-2" />
                Pengaturan PIN
              </TabsTrigger>
            </TabsList>

            <TabsContent value="data" className="mt-8">
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    <div>
                      <CardTitle className="text-slate-800 flex items-center">
                        <ClipboardCopy className="w-5 h-5 mr-2" />
                        Data Absensi Siswa
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Kelola dan monitor data absensi siswa PKL
                      </CardDescription>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input
                          placeholder="Cari siswa..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 w-full sm:w-64"
                        />
                      </div>
                      <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-full sm:w-40">
                          <SelectValue placeholder="Filter Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Semua Status</SelectItem>
                          <SelectItem value="hadir">Hadir</SelectItem>
                          <SelectItem value="terlambat">Terlambat</SelectItem>
                          <SelectItem value="tidak_hadir">Tidak Hadir</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        onClick={() => loadAbsensiData()}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                        disabled={loading}
                      >
                        <RefreshCcw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center space-y-4">
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="text-slate-600">Memuat data absensi...</p>
                      </div>
                    </div>
                  ) : filteredData.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-slate-600 mb-2">Tidak ada data absensi</h3>
                      <p className="text-slate-500">Belum ada data absensi yang tersedia atau sesuai dengan filter yang dipilih.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tanggal</TableHead>
                            <TableHead>Nama Siswa</TableHead>
                            <TableHead>Tempat PKL</TableHead>
                            <TableHead>Jam Masuk</TableHead>
                            <TableHead>Jam Keluar</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredData.map((item) => (
                            <TableRow key={item.id} className="hover:bg-slate-50">
                              <TableCell className="font-medium">
                                {formatDate(item.tanggal)}
                              </TableCell>
                              <TableCell>{item.student?.user?.name || 'N/A'}</TableCell>
                              <TableCell>
                                <div>
                                  <div className="font-medium">
                                    {item.tempatPkl?.nama || item.student?.tempatPkl?.nama || 'N/A'}
                                  </div>
                                  <div className="text-sm text-slate-500">
                                    {item.tempatPkl?.alamat || item.student?.tempatPkl?.alamat || ''}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{formatTime(item.jamMasuk)}</TableCell>
                              <TableCell>{formatTime(item.jamKeluar)}</TableCell>
                              <TableCell>{getStatusBadge(item.status)}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleView(item)}
                                    className="hover:bg-blue-50 hover:border-blue-200"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="mt-8">
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b border-green-200">
                  <CardTitle className="text-slate-800 flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    Pengaturan PIN Absensi
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Kelola PIN absensi untuk setiap tempat PKL
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {settingsLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center space-y-4">
                        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="text-slate-600">Memuat data tempat PKL...</p>
                      </div>
                    </div>
                  ) : tempatPklList.length === 0 ? (
                    <div className="text-center py-12">
                      <Building className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-slate-600 mb-2">Tidak ada tempat PKL</h3>
                      <p className="text-slate-500">Belum ada tempat PKL yang terdaftar dalam sistem.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {tempatPklList.map((tempatPkl) => (
                        <Card key={tempatPkl.id} className="border border-slate-200">
                          <CardContent className="p-6">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                                    <Building className="w-5 h-5 text-white" />
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-slate-800">{tempatPkl.nama}</h3>
                                    <p className="text-sm text-slate-500">{tempatPkl.alamat}</p>
                                    <div className="flex items-center space-x-4 mt-2">
                                      <div className="flex items-center space-x-2">
                                        <Users className="w-4 h-4 text-slate-400" />
                                        <span className="text-sm text-slate-600">
                                          {tempatPkl._count.students} siswa
                                        </span>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Key className="w-4 h-4 text-slate-400" />
                                        <span className="text-sm font-mono bg-slate-100 px-2 py-1 rounded">
                                          {tempatPkl.pinAbsensi || 'Belum diset'}
                                        </span>
                                        {tempatPkl.pinAbsensi && (
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => copyToClipboard(tempatPkl.pinAbsensi)}
                                            className="p-1 h-auto"
                                          >
                                            <Copy className="w-3 h-3" />
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-3">
                                <Button
                                  variant="outline"
                                  onClick={() => handleToggleStatus(tempatPkl.id, tempatPkl.isActive)}
                                  className={`${tempatPkl.isActive
                                      ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
                                      : 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
                                    }`}
                                >
                                  {tempatPkl.isActive ? (
                                    <>
                                      <ToggleRight className="w-4 h-4 mr-2" />
                                      Aktif
                                    </>
                                  ) : (
                                    <>
                                      <ToggleLeft className="w-4 h-4 mr-2" />
                                      Nonaktif
                                    </>
                                  )}
                                </Button>
                                <Button
                                  onClick={() => {
                                    setPinDialog({ open: true, tempatPkl })
                                    setNewPin(tempatPkl.pinAbsensi || '')
                                  }}
                                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit PIN
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Dialog untuk Edit PIN */}
      <Dialog open={pinDialog.open} onOpenChange={(open) => {
        if (!open) {
          setPinDialog({ open: false, tempatPkl: null })
          setNewPin('')
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Key className="w-5 h-5 mr-2" />
              Edit PIN Absensi
            </DialogTitle>
            <DialogDescription>
              Ubah PIN absensi untuk {pinDialog.tempatPkl?.nama}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="pin">PIN Baru</Label>
              <div className="flex space-x-2 mt-1">
                <Input
                  id="pin"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="Masukkan PIN baru"
                  className="flex-1"
                  maxLength={10}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={generateNewPin}
                  className="px-3"
                >
                  <Shuffle className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                PIN minimal 4 karakter
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setPinDialog({ open: false, tempatPkl: null })
                setNewPin('')
              }}
            >
              Batal
            </Button>
            <Button
              onClick={handleUpdatePin}
              disabled={pinLoading || !newPin.trim() || newPin.trim().length < 4}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              {pinLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Simpan PIN
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog untuk View Detail */}
      <Dialog open={viewDialog.open} onOpenChange={(open) => {
        if (!open) {
          setViewDialog({ open: false, data: null })
        }
      }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Eye className="w-5 h-5 mr-2" />
              Detail Absensi
            </DialogTitle>
          </DialogHeader>
          {viewDialog.data && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-slate-600">Nama Siswa</Label>
                  <p className="text-slate-800">{(viewDialog.data as any).student?.user?.name || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-600">Tanggal</Label>
                  <p className="text-slate-800">{formatDate((viewDialog.data as any).tanggal)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-600">Jam Masuk</Label>
                  <p className="text-slate-800">{formatTime((viewDialog.data as any).jamMasuk)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-600">Jam Keluar</Label>
                  <p className="text-slate-800">{formatTime((viewDialog.data as any).jamKeluar)}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-slate-600">Status</Label>
                <div className="mt-1">
                  {getStatusBadge((viewDialog.data as any).status)}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-slate-600">Tempat PKL</Label>
                <div className="mt-1">
                  <p className="font-medium text-slate-800">
                    {(viewDialog.data as any).tempatPkl?.nama || (viewDialog.data as any).student?.tempatPkl?.nama || 'N/A'}
                  </p>
                  <p className="text-sm text-slate-500">
                    {(viewDialog.data as any).tempatPkl?.alamat || (viewDialog.data as any).student?.tempatPkl?.alamat || ''}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setViewDialog({ open: false, data: null })}
            >
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog untuk Konfirmasi Hapus */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => {
        if (!open) {
          setDeleteDialog({ open: false, id: null })
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              <AlertCircle className="w-5 h-5 mr-2" />
              Konfirmasi Hapus
            </DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus data absensi ini? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, id: null })}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteDialog.id && handleDelete(deleteDialog.id)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayoutAdmin>
  )
}