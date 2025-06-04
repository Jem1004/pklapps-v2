'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  Loader2,
  AlertTriangle,
  History,
  Wifi,
  WifiOff,
  RefreshCw
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { submitAbsensi, getRecentAbsensi } from '@/app/absensi/actions'
import { toast } from 'sonner'
import StudentMinimalLayout from '@/components/layout/StudentMinimalLayout'

interface RecentAbsensi {
  id: string
  tanggal: Date
  waktu: Date
  tipe: 'MASUK' | 'PULANG'
  tempatPkl: {
    nama: string
    alamat: string
  }
}

export default function AbsensiPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [pinAbsensi, setPinAbsensi] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [recentAbsensi, setRecentAbsensi] = useState<RecentAbsensi[]>([])
  const [isOnline, setIsOnline] = useState(true)
  const [hasTempatPkl, setHasTempatPkl] = useState(true)
  const [pinError, setPinError] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [activeSubmenu, setActiveSubmenu] = useState<'today' | 'history'>('today')

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Check online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Load recent absensi data
  useEffect(() => {
    const loadRecentAbsensi = async () => {
      try {
        const recentData = await getRecentAbsensi()
        setRecentAbsensi((recentData.data || []).map(item => ({
          id: item.id,
          tanggal: item.tanggal,
          waktu: item.waktuMasuk || item.waktuPulang || new Date(),
          tipe: item.tipe,
          tempatPkl: {
            nama: item.tempatPkl.nama,
            alamat: item.tempatPkl.alamat
          }
        })))
      } catch (error) {
        console.error('Error loading recent absensi:', error)
      }
    }
    
    if (session?.user) {
      loadRecentAbsensi()
    }
  }, [session])

  const getCurrentPeriod = () => {
    const hour = currentTime.getHours()
    const minute = currentTime.getMinutes()
    const time = hour + minute / 60

    if (time >= 7 && time <= 10) {
      return {
        type: 'MASUK',
        label: 'Waktu Absen Masuk',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        icon: CheckCircle
      }
    } else if (time >= 13 && time <= 17) {
      return {
        type: 'PULANG',
        label: 'Waktu Absen Pulang',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        icon: CheckCircle
      }
    } else {
      return {
        type: 'TUTUP',
        label: 'Di Luar Jam Absensi',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        icon: XCircle
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!pinAbsensi.trim()) {
      setPinError('PIN absensi harus diisi')
      return
    }
    
    if (pinAbsensi.length < 4) {
      setPinError('PIN absensi minimal 4 karakter')
      return
    }
    
    setPinError('')
    setIsLoading(true)
    
    try {
      const result = await submitAbsensi(pinAbsensi)
      
      if (result.success) {
        toast.success(result.message || 'Absensi berhasil dicatat!')
        setPinAbsensi('')
        
        // Refresh recent absensi data
        const recentData = await getRecentAbsensi()
        setRecentAbsensi((recentData.data || []).map(item => ({
          id: item.id,
          tanggal: item.tanggal,
          waktu: item.waktuMasuk || item.waktuPulang || new Date(),
          tipe: item.tipe,
          tempatPkl: {
            nama: item.tempatPkl.nama,
            alamat: item.tempatPkl.alamat
          }
        })))
      } else {
        toast.error(result.message || 'Gagal mencatat absensi')
        if (result.message?.includes('PIN')) {
          setPinError(result.message)
        }
      }
    } catch (error) {
      console.error('Error submitting absensi:', error)
      toast.error('Terjadi kesalahan saat mencatat absensi')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      const recentData = await getRecentAbsensi()
      setRecentAbsensi((recentData.data || []).map(item => ({
        id: item.id,
        tanggal: item.tanggal,
        waktu: item.waktuMasuk || item.waktuPulang || new Date(),
        tipe: item.tipe,
        tempatPkl: {
          nama: item.tempatPkl.nama,
          alamat: item.tempatPkl.alamat
        }
      })))
      toast.success('Data berhasil diperbarui')
    } catch (error) {
      toast.error('Gagal memperbarui data')
    } finally {
      setIsRefreshing(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 className="h-8 w-8 text-blue-600" />
        </motion.div>
      </div>
    )
  }

  if (!session?.user || session.user.role !== 'STUDENT') {
    return null
  }

  const period = getCurrentPeriod()
  const PeriodIcon = period.icon

  return (
    <StudentMinimalLayout>
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Submenu untuk Absensi */}
        <div className="mb-6">
          <div className="flex space-x-4 border-b border-gray-200 overflow-x-auto">
            <button 
              onClick={() => setActiveSubmenu('today')}
              className={`pb-2 px-1 border-b-2 font-medium whitespace-nowrap ${
                activeSubmenu === 'today' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-600 hover:text-blue-600'
              }`}
            >
              Absensi Hari Ini
            </button>
            <button 
              onClick={() => setActiveSubmenu('history')}
              className={`pb-2 px-1 border-b-2 font-medium whitespace-nowrap ${
                activeSubmenu === 'history' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-600 hover:text-blue-600'
              }`}
            >
              Riwayat Absensi
            </button>
          </div>
        </div>

        {activeSubmenu === 'today' && (
          <>
            {/* Connection Status */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4"
            >
              <div className="flex items-center justify-center gap-2 text-sm">
                {isOnline ? (
                  <>
                    <Wifi className="h-4 w-4 text-green-500" />
                    <span className="text-green-600 font-medium">Online</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="h-4 w-4 text-red-500" />
                    <span className="text-red-600 font-medium">Offline</span>
                  </>
                )}
              </div>
            </motion.div>

            {/* Status Waktu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Card className={`mb-6 ${period.bgColor} ${period.borderColor} border-2 shadow-sm`}>
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${period.bgColor}`}>
                        <PeriodIcon className={`h-6 w-6 md:h-7 md:w-7 ${period.color}`} />
                      </div>
                      <div>
                        <p className={`font-semibold text-sm md:text-base ${period.color}`}>
                          {period.label}
                        </p>
                        <p className="text-xs md:text-sm text-gray-600">
                          {currentTime.toLocaleTimeString('id-ID', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl md:text-2xl font-mono font-bold text-gray-900">
                        {currentTime.toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit'
                        })}
                      </p>
                      <p className="text-xs md:text-sm text-gray-500">
                        {currentTime.toLocaleDateString('id-ID', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short'
                        })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Form Absensi */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                    <Clock className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                    Catat Absensi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="pin" className="text-sm font-medium">
                        PIN Absensi
                      </Label>
                      <Input
                        id="pin"
                        type="password"
                        placeholder="Masukkan PIN absensi"
                        value={pinAbsensi}
                        onChange={(e) => {
                          setPinAbsensi(e.target.value)
                          setPinError('')
                        }}
                        className={`h-12 md:h-10 text-base md:text-sm ${
                          pinError ? 'border-red-500 focus:border-red-500' : ''
                        }`}
                        disabled={isLoading || !isOnline}
                      />
                      {pinError && (
                        <p className="text-sm text-red-600">{pinError}</p>
                      )}
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full h-12 md:h-10 text-base md:text-sm font-medium"
                      disabled={isLoading || !isOnline || period.type === 'TUTUP'}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Mencatat Absensi...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Catat Absensi {period.type === 'MASUK' ? 'Masuk' : period.type === 'PULANG' ? 'Pulang' : ''}
                        </>
                      )}
                    </Button>
                  </form>
                  
                  {period.type === 'TUTUP' && (
                    <Alert className="mt-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Absensi hanya dapat dilakukan pada jam 07:00-10:00 (masuk) dan 13:00-17:00 (pulang).
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {!isOnline && (
                    <Alert className="mt-4">
                      <WifiOff className="h-4 w-4" />
                      <AlertDescription>
                        Tidak ada koneksi internet. Pastikan perangkat terhubung ke internet untuk mencatat absensi.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}

        {activeSubmenu === 'history' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                    <History className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                    Riwayat Absensi
                  </CardTitle>
                  <Button
                    onClick={handleRefresh}
                    variant="outline"
                    size="sm"
                    disabled={isRefreshing}
                    className="h-9"
                  >
                    <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {recentAbsensi.length > 0 ? (
                  <div className="space-y-3">
                    {recentAbsensi.map((absen) => (
                      <div key={absen.id} className="p-4 border rounded-lg bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={absen.tipe === 'MASUK' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {absen.tipe}
                            </Badge>
                            <span className="text-sm font-medium">
                              {absen.tanggal.toLocaleDateString('id-ID')}
                            </span>
                          </div>
                          <span className="text-sm text-gray-600">
                            {absen.waktu.toLocaleTimeString('id-ID', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{absen.tempatPkl.nama}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Belum ada riwayat absensi</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </StudentMinimalLayout>
  )
}