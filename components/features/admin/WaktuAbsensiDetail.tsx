'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Clock, 
  MapPin, 
  Calendar, 
  Edit, 
  ArrowLeft, 
  CheckCircle, 
  XCircle,
  Info
} from 'lucide-react';
import { convertTimeToDisplayFormat } from '@/lib/utils/absensi';
import type { WaktuAbsensiSetting } from '@/types/features/waktuAbsensi';

interface WaktuAbsensiDetailProps {
  setting: WaktuAbsensiSetting;
  onEdit?: (setting: WaktuAbsensiSetting) => void;
  onBack?: () => void;
}

export default function WaktuAbsensiDetail({ setting, onEdit, onBack }: WaktuAbsensiDetailProps) {
  const [currentTime] = useState(new Date());

  const formatDateTime = (date: string | Date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCurrentPeriodStatus = () => {
    const now = currentTime.toTimeString().slice(0, 5); // HH:MM format
    const jamMasukMulai = convertTimeToDisplayFormat(setting.jamMasukMulai);
    const jamMasukSelesai = convertTimeToDisplayFormat(setting.jamMasukSelesai);
    const jamPulangMulai = convertTimeToDisplayFormat(setting.jamPulangMulai);
    const jamPulangSelesai = convertTimeToDisplayFormat(setting.jamPulangSelesai);

    if (now >= jamMasukMulai && now <= jamMasukSelesai) {
      return { period: 'masuk', status: 'active', label: 'Waktu Absen Masuk' };
    } else if (now >= jamPulangMulai && now <= jamPulangSelesai) {
      return { period: 'pulang', status: 'active', label: 'Waktu Absen Pulang' };
    } else {
      return { period: 'none', status: 'inactive', label: 'Di Luar Jam Absen' };
    }
  };

  const currentStatus = getCurrentPeriodStatus();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Clock className="h-6 w-6" />
              Detail Pengaturan Waktu Absensi Global
            </h1>
            <p className="text-muted-foreground mt-1">
              Informasi lengkap pengaturan waktu absensi global untuk semua siswa
            </p>
          </div>
        </div>
        <Button onClick={() => onEdit?.(setting)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Pengaturan
        </Button>
      </div>

      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Status Saat Ini
          </CardTitle>
          <CardDescription>
            Status berdasarkan waktu sekarang: {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            {currentStatus.status === 'active' ? (
              <CheckCircle className="h-6 w-6 text-green-600" />
            ) : (
              <XCircle className="h-6 w-6 text-gray-400" />
            )}
            <div>
              <div className="font-medium">{currentStatus.label}</div>
              <div className="text-sm text-muted-foreground">
                {currentStatus.status === 'active' 
                  ? `Siswa dapat melakukan absen ${currentStatus.period}`
                  : 'Siswa tidak dapat melakukan absen saat ini'
                }
              </div>
            </div>
            <Badge 
              variant={currentStatus.status === 'active' ? 'default' : 'secondary'}
              className="ml-auto"
            >
              {currentStatus.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6">
        {/* Setting Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Informasi Pengaturan Global
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="text-sm font-medium text-muted-foreground">Status Pengaturan</label>
                <div className="mt-2">
                  <Badge variant={setting.isActive ? 'default' : 'secondary'} className="text-sm">
                    {setting.isActive ? 'Aktif' : 'Tidak Aktif'}
                  </Badge>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="text-sm font-medium text-muted-foreground">Dibuat</label>
                <p className="text-sm mt-1">{formatDateTime(setting.createdAt)}</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="text-sm font-medium text-muted-foreground">Terakhir Diupdate</label>
                <p className="text-sm mt-1">{formatDateTime(setting.updatedAt)}</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="text-sm font-medium text-muted-foreground">Versi</label>
                <p className="text-sm font-mono mt-1">v{setting.version}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Waktu Masuk */}
        <Card>
          <CardHeader>
            <CardTitle className="text-green-700">Waktu Absen Masuk</CardTitle>
            <CardDescription>
              Rentang waktu untuk absensi masuk
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div>
                  <div className="text-sm font-medium text-green-700">Jam Mulai</div>
                  <div className="text-2xl font-bold text-green-800">
                    {convertTimeToDisplayFormat(setting.jamMasukMulai)}
                  </div>
                </div>
                <div className="text-green-600">
                  <Clock className="h-8 w-8" />
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div>
                  <div className="text-sm font-medium text-green-700">Jam Selesai</div>
                  <div className="text-2xl font-bold text-green-800">
                    {convertTimeToDisplayFormat(setting.jamMasukSelesai)}
                  </div>
                </div>
                <div className="text-green-600">
                  <Clock className="h-8 w-8" />
                </div>
              </div>
              
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-muted-foreground">Durasi Waktu Absen</div>
                <div className="font-medium">
                  {(() => {
                    const start = convertTimeToDisplayFormat(setting.jamMasukMulai);
                    const end = convertTimeToDisplayFormat(setting.jamMasukSelesai);
                    const startMinutes = parseInt(start.split(':')[0]) * 60 + parseInt(start.split(':')[1]);
                    const endMinutes = parseInt(end.split(':')[0]) * 60 + parseInt(end.split(':')[1]);
                    const duration = endMinutes - startMinutes;
                    const hours = Math.floor(duration / 60);
                    const minutes = duration % 60;
                    return `${hours} jam ${minutes} menit`;
                  })()} 
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Waktu Pulang */}
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-700">Waktu Absen Pulang</CardTitle>
            <CardDescription>
              Rentang waktu untuk absensi pulang
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div>
                  <div className="text-sm font-medium text-blue-700">Jam Mulai</div>
                  <div className="text-2xl font-bold text-blue-800">
                    {convertTimeToDisplayFormat(setting.jamPulangMulai)}
                  </div>
                </div>
                <div className="text-blue-600">
                  <Clock className="h-8 w-8" />
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div>
                  <div className="text-sm font-medium text-blue-700">Jam Selesai</div>
                  <div className="text-2xl font-bold text-blue-800">
                    {convertTimeToDisplayFormat(setting.jamPulangSelesai)}
                  </div>
                </div>
                <div className="text-blue-600">
                  <Clock className="h-8 w-8" />
                </div>
              </div>
              
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-muted-foreground">Durasi Waktu Absen</div>
                <div className="font-medium">
                  {(() => {
                    const start = convertTimeToDisplayFormat(setting.jamPulangMulai);
                    const end = convertTimeToDisplayFormat(setting.jamPulangSelesai);
                    const startMinutes = parseInt(start.split(':')[0]) * 60 + parseInt(start.split(':')[1]);
                    const endMinutes = parseInt(end.split(':')[0]) * 60 + parseInt(end.split(':')[1]);
                    const duration = endMinutes - startMinutes;
                    const hours = Math.floor(duration / 60);
                    const minutes = duration % 60;
                    return `${hours} jam ${minutes} menit`;
                  })()} 
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Timeline Absensi Harian</CardTitle>
          <CardDescription>
            Visualisasi waktu absensi dalam satu hari
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline bar */}
            <div className="flex items-center h-12 bg-gray-100 rounded-lg relative overflow-hidden">
              {/* Waktu Masuk */}
              <div 
                className="absolute bg-green-400 h-full flex items-center justify-center text-white text-xs font-medium"
                style={{
                  left: `${(parseInt(convertTimeToDisplayFormat(setting.jamMasukMulai).split(':')[0]) * 60 + parseInt(convertTimeToDisplayFormat(setting.jamMasukMulai).split(':')[1])) / (24 * 60) * 100}%`,
                  width: `${((parseInt(convertTimeToDisplayFormat(setting.jamMasukSelesai).split(':')[0]) * 60 + parseInt(convertTimeToDisplayFormat(setting.jamMasukSelesai).split(':')[1])) - (parseInt(convertTimeToDisplayFormat(setting.jamMasukMulai).split(':')[0]) * 60 + parseInt(convertTimeToDisplayFormat(setting.jamMasukMulai).split(':')[1]))) / (24 * 60) * 100}%`
                }}
              >
                Masuk
              </div>
              
              {/* Waktu Pulang */}
              <div 
                className="absolute bg-blue-400 h-full flex items-center justify-center text-white text-xs font-medium"
                style={{
                  left: `${(parseInt(convertTimeToDisplayFormat(setting.jamPulangMulai).split(':')[0]) * 60 + parseInt(convertTimeToDisplayFormat(setting.jamPulangMulai).split(':')[1])) / (24 * 60) * 100}%`,
                  width: `${((parseInt(convertTimeToDisplayFormat(setting.jamPulangSelesai).split(':')[0]) * 60 + parseInt(convertTimeToDisplayFormat(setting.jamPulangSelesai).split(':')[1])) - (parseInt(convertTimeToDisplayFormat(setting.jamPulangMulai).split(':')[0]) * 60 + parseInt(convertTimeToDisplayFormat(setting.jamPulangMulai).split(':')[1]))) / (24 * 60) * 100}%`
                }}
              >
                Pulang
              </div>
            </div>
            
            {/* Time labels */}
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>24:00</span>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-400 rounded"></div>
              <span>Waktu Absen Masuk: {convertTimeToDisplayFormat(setting.jamMasukMulai)} - {convertTimeToDisplayFormat(setting.jamMasukSelesai)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-400 rounded"></div>
              <span>Waktu Absen Pulang: {convertTimeToDisplayFormat(setting.jamPulangMulai)} - {convertTimeToDisplayFormat(setting.jamPulangSelesai)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}