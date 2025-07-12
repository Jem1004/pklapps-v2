'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { 
  Clock, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  AlertCircle,
  RefreshCw,
  Download
} from 'lucide-react';
import { convertTimeToDisplayFormat } from '@/lib/utils/absensi';
import type { WaktuAbsensiSetting } from '@/types/features/waktuAbsensi';

interface WaktuAbsensiListProps {
  globalSetting: WaktuAbsensiSetting | null;
  loading?: boolean;
  error?: string | null;
  onAdd?: () => void;
  onEdit?: (setting: WaktuAbsensiSetting) => void;
  onView?: (setting: WaktuAbsensiSetting) => void;
  onDelete?: (id: string) => void;
  onRefresh?: () => void;
}

export function WaktuAbsensiList({ 
  globalSetting,
  loading = false,
  error = null,
  onAdd, 
  onEdit, 
  onView,
  onDelete,
  onRefresh 
}: WaktuAbsensiListProps) {
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  
  // Debug logging
  console.log('WaktuAbsensiList received globalSetting:', globalSetting);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; setting: WaktuAbsensiSetting | null }>({ open: false, setting: null });
  const [deleting, setDeleting] = useState(false);

  // Filter global setting based on status
  const shouldShowSetting = useMemo(() => {
    if (!globalSetting) return false;
    if (statusFilter === 'all') return true;
    return statusFilter === 'active' ? globalSetting.isActive : !globalSetting.isActive;
  }, [globalSetting, statusFilter]);

  const fetchGlobalSetting = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.setting || !onDelete) return;
    
    try {
      setDeleting(true);
      await onDelete(deleteDialog.setting.id);
      setDeleteDialog({ open: false, setting: null });
    } catch (err) {
      console.error('Failed to delete setting:', err);
    } finally {
      setDeleting(false);
    }
  };

  const exportToCSV = () => {
    if (!globalSetting) return;
    
    const headers = ['Jam Masuk', 'Jam Pulang', 'Status', 'Dibuat', 'Diupdate'];
    const csvData = [[
      `${convertTimeToDisplayFormat(globalSetting.jamMasukMulai)} - ${convertTimeToDisplayFormat(globalSetting.jamMasukSelesai)}`,
      `${convertTimeToDisplayFormat(globalSetting.jamPulangMulai)} - ${convertTimeToDisplayFormat(globalSetting.jamPulangSelesai)}`,
      globalSetting.isActive ? 'Aktif' : 'Tidak Aktif',
      new Date(globalSetting.createdAt).toLocaleDateString('id-ID'),
      new Date(globalSetting.updatedAt).toLocaleDateString('id-ID')
    ]];
    
    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `waktu-absensi-global-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Clock className="h-6 w-6" />
            Pengaturan Waktu Absensi Global
          </h1>
          <p className="text-muted-foreground mt-1">
            Kelola waktu absensi global untuk semua siswa
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToCSV} disabled={loading || !globalSetting}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          {!globalSetting && (
            <Button onClick={onAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Buat Pengaturan
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">

            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={(value: 'all' | 'active' | 'inactive') => setStatusFilter(value)}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="inactive">Tidak Aktif</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={fetchGlobalSetting} disabled={loading}>
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Pengaturan Waktu Absensi Global</CardTitle>
          <CardDescription>
            {globalSetting 
              ? `Pengaturan global saat ini ${globalSetting.isActive ? 'aktif' : 'tidak aktif'}`
              : 'Belum ada pengaturan waktu absensi global'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              <span className="ml-2">Memuat data...</span>
            </div>
          ) : !shouldShowSetting ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {!globalSetting ? 'Belum ada pengaturan' : 'Tidak ada pengaturan yang sesuai filter'}
              </h3>
              <p className="text-gray-500 mb-4">
                {!globalSetting 
                  ? 'Belum ada pengaturan waktu absensi global'
                  : `Tidak ada pengaturan dengan status ${statusFilter === 'active' ? 'aktif' : 'tidak aktif'}`
                }
              </p>
              {!globalSetting && (
                <Button onClick={onAdd}>
                  <Plus className="h-4 w-4 mr-2" />
                  Buat Pengaturan Global
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pengaturan</TableHead>
                    <TableHead>Waktu Masuk</TableHead>
                    <TableHead>Waktu Pulang</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Terakhir Diupdate</TableHead>
                    <TableHead className="w-[70px]">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {globalSetting && (
                    <TableRow key={globalSetting.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">Pengaturan Global</div>
                          <div className="text-sm text-muted-foreground">Berlaku untuk semua siswa</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium text-green-600">
                            {convertTimeToDisplayFormat(globalSetting.jamMasukMulai)} - {convertTimeToDisplayFormat(globalSetting.jamMasukSelesai)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium text-blue-600">
                            {convertTimeToDisplayFormat(globalSetting.jamPulangMulai)} - {convertTimeToDisplayFormat(globalSetting.jamPulangSelesai)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={globalSetting.isActive ? 'default' : 'secondary'}>
                          {globalSetting.isActive ? 'Aktif' : 'Tidak Aktif'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {new Date(globalSetting.updatedAt).toLocaleDateString('id-ID', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onView?.(globalSetting)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Lihat Detail
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => {
                                if (globalSetting?.id) {
                                  onEdit?.(globalSetting);
                                } else {
                                  console.error('Cannot edit setting without valid ID');
                                }
                              }}
                              disabled={!globalSetting?.id}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => setDeleteDialog({ open: true, setting: globalSetting })}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, setting: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus pengaturan waktu absensi global?
              <br />
              <span className="text-red-600 text-sm mt-2 block">
                Tindakan ini tidak dapat dibatalkan dan akan mempengaruhi semua siswa.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialog({ open: false, setting: null })}
              disabled={deleting}
            >
              Batal
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Menghapus...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Hapus
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}