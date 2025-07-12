'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, Plus, Settings, Building, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import type { WaktuAbsensiSetting } from '@/types/features/waktuAbsensi'
import type { TempatPkl } from '@prisma/client'

interface WaktuAbsensiStats {
  hasGlobalSetting: boolean
  isGlobalSettingActive: boolean
  lastUpdated?: Date
}

type ViewMode = 'list' | 'form' | 'detail'

export default function WaktuAbsensiManager() {
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [globalSetting, setGlobalSetting] = useState<WaktuAbsensiSetting | null>(null)
  const [stats, setStats] = useState<WaktuAbsensiStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Load global attendance setting
      const settingsResponse = await fetch('/api/admin/waktu-absensi')

      if (!settingsResponse.ok) {
        throw new Error('Gagal memuat data')
      }

      const settingsResult = await settingsResponse.json()

      if (settingsResult.success) {
        // Get the global setting from the response
        const settingsData = settingsResult.data
        const globalSettingData = settingsData.length > 0 ? settingsData[0] : null
        
        setGlobalSetting(globalSettingData)
        
        // Calculate stats
        setStats({
          hasGlobalSetting: !!globalSettingData,
          isGlobalSettingActive: globalSettingData?.isActive || false,
          lastUpdated: globalSettingData?.updatedAt ? new Date(globalSettingData.updatedAt) : undefined
        })
      } else {
        console.error('API response not successful:', settingsResult)
        throw new Error('Gagal memuat data')
      }
    } catch (error) {
      console.error('Error loading data:', error)
      setError(error instanceof Error ? error.message : 'Terjadi kesalahan')
      toast.error('Gagal memuat data waktu absensi')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = () => {
    setViewMode('form')
  }

  const handleEdit = () => {
    setViewMode('form')
  }

  const handleView = () => {
    setViewMode('detail')
  }

  const handleSuccess = () => {
    setViewMode('list')
    loadData()
    toast.success('Pengaturan waktu absensi global berhasil disimpan')
  }

  const handleCancel = () => {
    setViewMode('list')
  }

  const handleBack = () => {
    setViewMode('list')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
          <p className="text-gray-600">Memuat data waktu absensi...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="text-red-500 text-lg font-medium">{error}</div>
          <Button onClick={loadData} variant="outline">
            <Clock className="h-4 w-4 mr-2" />
            Coba Lagi
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pengelolaan Waktu Absensi Global</h1>
          <p className="text-gray-600 mt-1">
            Kelola pengaturan waktu masuk dan pulang global untuk semua tempat PKL
          </p>
        </div>
        {viewMode === 'list' && !stats?.hasGlobalSetting && (
          <Button onClick={handleCreate} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Buat Pengaturan Global
          </Button>
        )}
      </div>

      {/* Statistics Cards */}
      {stats && viewMode === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Status Pengaturan Global</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {stats.hasGlobalSetting ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <span className={`text-sm font-medium ${
                  stats.hasGlobalSetting ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stats.hasGlobalSetting ? 'Terkonfigurasi' : 'Belum Terkonfigurasi'}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Status Aktif</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {stats.isGlobalSettingActive ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-gray-400" />
                )}
                <span className={`text-sm font-medium ${
                  stats.isGlobalSettingActive ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {stats.isGlobalSettingActive ? 'Aktif' : 'Tidak Aktif'}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Terakhir Diperbarui</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600">
                {stats.lastUpdated 
                  ? stats.lastUpdated.toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  : 'Belum pernah diperbarui'
                }
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Content based on view mode */}
      <motion.div
        key={viewMode}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {viewMode === 'list' && (
          <WaktuAbsensiList
            onAdd={handleCreate}
            onEdit={handleEdit}
            onView={handleView}
            globalSetting={globalSetting}
          />
        )}

        {viewMode === 'form' && (
          <WaktuAbsensiForm
            initialData={globalSetting || undefined}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        )}

        {viewMode === 'detail' && globalSetting && (
          <WaktuAbsensiDetail
            setting={globalSetting}
            onEdit={handleEdit}
            onBack={handleBack}
          />
        )}
      </motion.div>
    </div>
  )
}

// Import komponen yang diperlukan
import { WaktuAbsensiList } from './WaktuAbsensiList'
import WaktuAbsensiForm from './WaktuAbsensiForm'
import WaktuAbsensiDetail from './WaktuAbsensiDetail'