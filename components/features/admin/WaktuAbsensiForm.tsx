'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Clock, Save, X, AlertCircle, CheckCircle } from 'lucide-react';
import { waktuAbsensiSettingSchema, type WaktuAbsensiSettingInput } from '@/lib/validations/waktuAbsensiSetting';
import { convertTimeToDisplayFormat } from '@/lib/utils/absensi';
import type { WaktuAbsensiSetting } from '@/types/features/waktuAbsensi';

interface WaktuAbsensiFormProps {
  initialData?: WaktuAbsensiSetting;
  onSuccess?: (data: WaktuAbsensiSetting) => void;
  onCancel?: () => void;
}

export default function WaktuAbsensiForm({
  initialData,
  onSuccess,
  onCancel
}: WaktuAbsensiFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<WaktuAbsensiSettingInput | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
    reset
  } = useForm<WaktuAbsensiSettingInput>({
    resolver: zodResolver(waktuAbsensiSettingSchema),
    mode: 'onChange',
    defaultValues: {
      jamMasukMulai: initialData ? convertTimeToDisplayFormat(initialData.jamMasukMulai) : '07:00',
      jamMasukSelesai: initialData ? convertTimeToDisplayFormat(initialData.jamMasukSelesai) : '10:00',
      jamPulangMulai: initialData ? convertTimeToDisplayFormat(initialData.jamPulangMulai) : '13:00',
      jamPulangSelesai: initialData ? convertTimeToDisplayFormat(initialData.jamPulangSelesai) : '17:00',
      isActive: initialData?.isActive ?? true
    }
  });

  const watchedValues = watch();

  // Update preview when form values change
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (isValid && value) {
        setPreviewData(value as WaktuAbsensiSettingInput);
      } else {
        setPreviewData(null);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, isValid]);

  const onSubmit = async (data: WaktuAbsensiSettingInput) => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate that we have a valid ID for edit mode
      if (initialData && !initialData.id) {
        console.error('Invalid initialData for edit mode:', initialData);
        throw new Error('ID pengaturan tidak valid untuk mode edit');
      }

      const url = initialData 
        ? `/api/admin/waktu-absensi/${initialData.id}`
        : '/api/admin/waktu-absensi';
      
      const method = initialData ? 'PUT' : 'POST';
      const body = initialData 
        ? { ...data, version: initialData.version }
        : data;

      console.log('Submitting data:', { url, method, body });

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const result = await response.json();
      console.log('Submit response:', { status: response.status, result });

      if (!response.ok) {
        throw new Error(result.error || 'Gagal menyimpan pengaturan');
      }

      // Success callback with updated data
      onSuccess?.(result.data);
    } catch (err) {
      console.error('Form submission error:', err);
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    reset();
    setError(null);
    setPreviewData(null);
  };



  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {initialData ? 'Edit Pengaturan Waktu Absensi Global' : 'Pengaturan Waktu Absensi Global'}
          </CardTitle>
          <CardDescription>
            {initialData 
              ? 'Ubah pengaturan waktu absensi global untuk semua siswa'
              : 'Atur waktu masuk dan pulang yang berlaku untuk semua siswa'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">


            {/* Time Settings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Waktu Masuk */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-green-700">Waktu Absen Masuk</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="jamMasukMulai">Jam Mulai *</Label>
                  <Input
                    id="jamMasukMulai"
                    type="time"
                    {...register('jamMasukMulai')}
                    className="w-full"
                  />
                  {errors.jamMasukMulai && (
                    <p className="text-sm text-red-600">{errors.jamMasukMulai.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jamMasukSelesai">Jam Selesai *</Label>
                  <Input
                    id="jamMasukSelesai"
                    type="time"
                    {...register('jamMasukSelesai')}
                    className="w-full"
                  />
                  {errors.jamMasukSelesai && (
                    <p className="text-sm text-red-600">{errors.jamMasukSelesai.message}</p>
                  )}
                </div>
              </div>

              {/* Waktu Pulang */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-blue-700">Waktu Absen Pulang</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="jamPulangMulai">Jam Mulai *</Label>
                  <Input
                    id="jamPulangMulai"
                    type="time"
                    {...register('jamPulangMulai')}
                    className="w-full"
                  />
                  {errors.jamPulangMulai && (
                    <p className="text-sm text-red-600">{errors.jamPulangMulai.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jamPulangSelesai">Jam Selesai *</Label>
                  <Input
                    id="jamPulangSelesai"
                    type="time"
                    {...register('jamPulangSelesai')}
                    className="w-full"
                  />
                  {errors.jamPulangSelesai && (
                    <p className="text-sm text-red-600">{errors.jamPulangSelesai.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Status Active */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={watchedValues.isActive || false}
                onCheckedChange={(checked) => {
                  setValue('isActive', !!checked, { shouldValidate: true });
                }}
              />
              <Label htmlFor="isActive" className="text-sm font-medium">
                Aktif
              </Label>
            </div>

            {/* Error Display */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Form Actions */}
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel || handleReset}
                disabled={isLoading}
              >
                <X className="h-4 w-4 mr-2" />
                {onCancel ? 'Batal' : 'Reset'}
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !isValid}
                className="min-w-[120px]"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Menyimpan...
                  </div>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {initialData ? 'Update' : 'Simpan'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Preview */}
      {previewData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Preview Pengaturan
            </CardTitle>
            <CardDescription>
              Pratinjau pengaturan waktu absensi global
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-700 mb-2">Waktu Absen Masuk</h4>
                <p className="text-sm text-green-600">
                  {previewData.jamMasukMulai} - {previewData.jamMasukSelesai}
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-700 mb-2">Waktu Absen Pulang</h4>
                <p className="text-sm text-blue-600">
                  {previewData.jamPulangMulai} - {previewData.jamPulangSelesai}
                </p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                Status: <span className={previewData.isActive ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                  {previewData.isActive ? 'Aktif' : 'Tidak Aktif'}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}