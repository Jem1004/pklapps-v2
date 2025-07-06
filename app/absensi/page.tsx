'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Clock,
  MapPin,
  AlertTriangle,
  History,
  Wifi,
  WifiOff,
  RefreshCw,
  Calendar,
  User,
  Building2
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { useAbsensi } from '@/hooks/useAbsensi'
import { getCurrentPeriod, formatTime, formatDate } from '@/lib/utils/absensi'
import { toast } from 'sonner'
import StudentMinimalLayout from '@/components/layout/StudentMinimalLayout'
import { AbsensiForm } from '@/components/forms'

export default function AbsensiPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isOnline, setIsOnline] = useState(true)
  const [error, setError] = useState('')
  const [activeSubmenu, setActiveSubmenu] = useState<'today' | 'history'>('today')
  
  // Callback functions dengan useCallback untuk mencegah re-creation
  const handleSubmitSuccess = useCallback(() => {
    setError('')
  }, [])

  const handleSubmitError = useCallback((errorMessage: string) => {
    setError(errorMessage)
  }, [])

  const handleLoadError = useCallback((errorMessage: string) => {
     console.error('Error loading absensi:', errorMessage)
   }, [])

  // Menggunakan custom hook untuk state management absensi
  const {
    isSubmitting,
    recentAbsensi,
    isRefreshing,
    hasTempatPkl,
    submitAbsensi: submitAbsensiHook,
    refreshRecentAbsensi,
    loadRecentAbsensi
  } = useAbsensi({
    onSubmitSuccess: handleSubmitSuccess,
    onSubmitError: handleSubmitError,
    onLoadError: handleLoadError
  })

  // Callback untuk form submit success - dideklarasi setelah hook
  const handleFormSubmitSuccess = useCallback(() => {
    setError('')
    loadRecentAbsensi()
  }, [loadRecentAbsensi])

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

  // Tidak perlu useEffect tambahan karena useAbsensi sudah auto-load

  const handleRefresh = useCallback(async () => {
    await refreshRecentAbsensi()
  }, [refreshRecentAbsensi])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <RefreshCw className="h-8 w-8 text-blue-600" />
        </motion.div>
      </div>
    )
  }

  if (!session?.user || session.user.role !== 'STUDENT') {
    return null
  }

  const period = getCurrentPeriod(currentTime)
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
                          {formatTime(currentTime)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl md:text-2xl font-mono font-bold text-gray-900">
                        {formatTime(currentTime, { includeSeconds: true })}
                      </p>
                      <p className="text-xs md:text-sm text-gray-500">
                         {formatDate(currentTime, { includeWeekday: true })}
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
              <AbsensiForm 
                 period={period}
                 isOnline={isOnline}
                 onSubmitSuccess={handleFormSubmitSuccess}
                 onSubmitError={handleSubmitError}
               />
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
                              {formatDate(absen.tanggal)}
                            </span>
                          </div>
                          <span className="text-sm text-gray-600">
                            {formatTime(absen.waktu)}
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