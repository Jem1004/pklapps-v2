// Interface untuk pengaturan waktu absensi
export interface WaktuAbsensiSetting {
  id: string;
  jamMasukMulai: string; // Format: "HH:mm:ss"
  jamMasukSelesai: string; // Format: "HH:mm:ss"
  jamPulangMulai: string; // Format: "HH:mm:ss"
  jamPulangSelesai: string; // Format: "HH:mm:ss"
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  version: number; // Optimistic locking
}

// Interface untuk validasi waktu
export interface TimeValidation {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

// Interface untuk periode absensi yang dinamis
export interface DynamicAbsensiPeriod {
  type: 'MASUK' | 'PULANG' | 'TUTUP';
  label: string;
  timeRange: string;
  color: string;
  bgColor: string;
  borderColor: string;
  isCustom: boolean;
}

// Interface untuk form input
export interface WaktuAbsensiFormData {
  jamMasukMulai: string; // Format: "HH:mm"
  jamMasukSelesai: string; // Format: "HH:mm"
  jamPulangMulai: string; // Format: "HH:mm"
  jamPulangSelesai: string; // Format: "HH:mm"
  isActive: boolean;
}

// Interface untuk response API
export interface WaktuAbsensiResponse {
  success: boolean;
  data?: WaktuAbsensiSetting;
  error?: string;
  message?: string;
}

// Interface untuk list response
export interface WaktuAbsensiListResponse {
  success: boolean;
  data?: WaktuAbsensiSetting[];
  error?: string;
  message?: string;
  total?: number;
}

// Interface untuk bulk operations (deprecated - no longer needed for global settings)
export interface BulkWaktuAbsensiOperation {
  jamMasukMulai: string;
  jamMasukSelesai: string;
  jamPulangMulai: string;
  jamPulangSelesai: string;
  isActive: boolean;
}

// Interface untuk cache (global setting)
export interface WaktuAbsensiCache {
  global?: WaktuAbsensiSetting;
}

// Interface untuk time range picker
export interface TimeRange {
  start: string; // Format: "HH:mm"
  end: string; // Format: "HH:mm"
}

// Interface untuk preview
export interface WaktuAbsensiPreview {
  currentSettings?: WaktuAbsensiSetting;
  newSettings: WaktuAbsensiFormData;
  changes: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
}