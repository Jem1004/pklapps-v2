import { z } from 'zod';

// Simple PIN-based absensi validation schema
export const pinAbsensiSchema = z.object({
  pin: z
    .string({
      required_error: 'PIN absensi diperlukan',
      invalid_type_error: 'PIN harus berupa string',
    })
    .min(1, 'PIN absensi tidak boleh kosong')
    .max(50, 'PIN terlalu panjang'),
  tipe: z.enum(['MASUK', 'PULANG'], {
    required_error: 'Tipe absensi diperlukan',
    invalid_type_error: 'Tipe absensi tidak valid',
  }),
});

// Simplified absensi filter validation schema
export const absensiFilterSchema = z.object({
  studentId: z.string().optional(),
  tempatPklId: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  search: z.string().max(100, 'Pencarian terlalu panjang').optional(),
}).refine((data) => {
  if (data.startDate && data.endDate) {
    return data.startDate <= data.endDate;
  }
  return true;
}, {
  message: 'Tanggal mulai harus sebelum atau sama dengan tanggal akhir',
  path: ['endDate'],
});

// Admin absensi creation schema (for manual entry if needed)
export const createAbsensiSchema = z.object({
  tanggal: z
    .date({
      required_error: 'Tanggal diperlukan',
      invalid_type_error: 'Format tanggal tidak valid',
    })
    .refine((date) => date <= new Date(), {
      message: 'Tanggal tidak boleh di masa depan',
    }),
  waktuMasuk: z
    .date({
      invalid_type_error: 'Format waktu masuk tidak valid',
    })
    .optional(),
  waktuPulang: z
    .date({
      invalid_type_error: 'Format waktu pulang tidak valid',
    })
    .optional(),
  tipe: z.enum(['MASUK', 'PULANG'], {
    required_error: 'Tipe absensi diperlukan',
    invalid_type_error: 'Tipe absensi tidak valid',
  }),
  studentId: z
    .string()
    .min(1, 'Student ID diperlukan'),
  tempatPklId: z
    .string()
    .min(1, 'Tempat PKL ID diperlukan'),
}).refine((data) => {
  // If waktuPulang is provided, it should be after waktuMasuk
  if (data.waktuMasuk && data.waktuPulang) {
    return data.waktuPulang > data.waktuMasuk;
  }
  return true;
}, {
  message: 'Waktu pulang harus setelah waktu masuk',
  path: ['waktuPulang'],
});

// Update absensi validation schema
export const updateAbsensiSchema = z.object({
  tanggal: z
    .date({
      invalid_type_error: 'Format tanggal tidak valid',
    })
    .refine((date) => date <= new Date(), {
      message: 'Tanggal tidak boleh di masa depan',
    })
    .optional(),
  waktuMasuk: z
    .date({
      invalid_type_error: 'Format waktu masuk tidak valid',
    })
    .optional(),
  waktuPulang: z
    .date({
      invalid_type_error: 'Format waktu pulang tidak valid',
    })
    .optional(),
  tipe: z.enum(['MASUK', 'PULANG']).optional(),
}).refine((data) => {
  // If waktuPulang is provided, it should be after waktuMasuk
  if (data.waktuMasuk && data.waktuPulang) {
    return data.waktuPulang > data.waktuMasuk;
  }
  return true;
}, {
  message: 'Waktu pulang harus setelah waktu masuk',
  path: ['waktuPulang'],
});

// Export types
export type PinAbsensiInput = z.infer<typeof pinAbsensiSchema>;
export type AbsensiFilterInput = z.infer<typeof absensiFilterSchema>;
export type CreateAbsensiInput = z.infer<typeof createAbsensiSchema>;
export type UpdateAbsensiInput = z.infer<typeof updateAbsensiSchema>;