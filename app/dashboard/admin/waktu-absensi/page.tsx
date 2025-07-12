'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Settings, List, BarChart3, AlertCircle } from 'lucide-react';
import { WaktuAbsensiList } from '@/components/features/admin/WaktuAbsensiList';
import WaktuAbsensiForm from '@/components/features/admin/WaktuAbsensiForm';
import WaktuAbsensiDetail from '@/components/features/admin/WaktuAbsensiDetail';
import type { WaktuAbsensiSetting } from '@/types/features/waktuAbsensi';

type ViewMode = 'list' | 'add' | 'edit' | 'detail';

export default function WaktuAbsensiPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedSetting, setSelectedSetting] = useState<WaktuAbsensiSetting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [globalSetting, setGlobalSetting] = useState<WaktuAbsensiSetting | null>(null);

  // Fetch global setting
  const fetchGlobalSetting = async () => {
    try {
      // Add cache-busting parameter to ensure fresh data
      const response = await fetch(`/api/admin/waktu-absensi?t=${Date.now()}`);
      const result = await response.json();
      
      console.log('API Response:', { response: response.ok, result });
      
      if (response.ok) {
        // API now returns array directly in result.data
        const settings = result.data;
        const setting = Array.isArray(settings) ? settings[0] : settings;
        console.log('Setting data:', setting);
        
        // Validate setting has required fields
        if (setting && !setting.id) {
          console.warn('Setting received without ID:', setting);
        }
        
        setGlobalSetting(setting || null);
      } else {
        console.error('API Error:', result);
        setError(result.error || 'Gagal memuat pengaturan');
      }
    } catch (err) {
      console.error('Failed to fetch global setting:', err);
      setError('Gagal memuat pengaturan waktu absensi');
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        await fetchGlobalSetting();
      } catch (err) {
        setError('Gagal memuat data awal');
      } finally {
        setLoading(false);
      }
    };
    
    initializeData();
  }, []);

  const handleAdd = () => {
    setSelectedSetting(null);
    setViewMode('add');
  };

  const handleEdit = (setting: WaktuAbsensiSetting) => {
    // Validate that setting has a valid ID before editing
    if (!setting || !setting.id) {
      console.error('Cannot edit setting without valid ID:', setting);
      setError('Pengaturan tidak memiliki ID yang valid untuk diedit');
      return;
    }
    setSelectedSetting(setting);
    setViewMode('edit');
  };

  const handleView = (setting: WaktuAbsensiSetting) => {
    setSelectedSetting(setting);
    setViewMode('detail');
  };

  const handleSuccess = async () => {
    setViewMode('list');
    setSelectedSetting(null);
    // Clear any error state
    setError(null);
    // Refresh global setting with a small delay to ensure server-side cache is updated
    setTimeout(() => {
      fetchGlobalSetting();
    }, 500);
  };

  const handleCancel = () => {
    setViewMode('list');
    setSelectedSetting(null);
  };

  const handleBack = () => {
    setViewMode('list');
    setSelectedSetting(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Clock className="h-8 w-8" />
            Pengaturan Waktu Absensi Global
          </h1>
          <p className="text-muted-foreground mt-1">
            Kelola pengaturan waktu absensi global untuk semua siswa
          </p>
        </div>
      </div>

      {/* Global Setting Status - Only show in list view */}
      {viewMode === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status Pengaturan</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${globalSetting ? 'text-green-600' : 'text-orange-600'}`}>
                {globalSetting ? 'Terkonfigurasi' : 'Belum Terkonfigurasi'}
              </div>
              <p className="text-xs text-muted-foreground">
                {globalSetting ? 'Pengaturan global aktif' : 'Perlu membuat pengaturan'}
              </p>
            </CardContent>
          </Card>
          
          {globalSetting && (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Status Aktif</CardTitle>
                  <div className={`h-4 w-4 rounded-full ${globalSetting.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${globalSetting.isActive ? 'text-green-600' : 'text-gray-600'}`}>
                    {globalSetting.isActive ? 'Aktif' : 'Tidak Aktif'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {globalSetting.isActive ? 'Sedang digunakan' : 'Tidak digunakan'}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Jam Masuk</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {(globalSetting.jamMasukMulai || '').slice(0, 5)} - {(globalSetting.jamMasukSelesai || '').slice(0, 5)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Waktu masuk kerja
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      )}

      {/* Main Content */}
      <div className="space-y-6">
        {viewMode === 'list' && (
          <Tabs defaultValue="list" className="space-y-4">
            <TabsList>
              <TabsTrigger value="list" className="flex items-center gap-2">
                <List className="h-4 w-4" />
                Daftar Pengaturan
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="list" className="space-y-4">
              <WaktuAbsensiList
                globalSetting={globalSetting}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onView={handleView}
              />
            </TabsContent>
          </Tabs>
        )}

        {viewMode === 'add' && (
          <Card>
            <CardHeader>
              <CardTitle>Buat Pengaturan Waktu Absensi Global</CardTitle>
              <CardDescription>
                Buat pengaturan waktu absensi global untuk semua siswa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WaktuAbsensiForm
                onSuccess={handleSuccess}
                onCancel={handleCancel}
              />
            </CardContent>
          </Card>
        )}

        {viewMode === 'edit' && selectedSetting && (
          <Card>
            <CardHeader>
              <CardTitle>Edit Pengaturan Waktu Absensi Global</CardTitle>
              <CardDescription>
                Ubah pengaturan waktu absensi global untuk semua siswa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WaktuAbsensiForm
                initialData={selectedSetting}
                onSuccess={handleSuccess}
                onCancel={handleCancel}
              />
            </CardContent>
          </Card>
        )}

        {viewMode === 'detail' && selectedSetting && (
          <WaktuAbsensiDetail
            setting={selectedSetting}
            onEdit={handleEdit}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  );
}