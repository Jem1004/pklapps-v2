import { z } from 'zod';

// Jurnal creation validation schema
export const createJurnalSchema = z.object({
  tanggal: z
    .date({
      required_error: 'Tanggal is required',
      invalid_type_error: 'Invalid date format',
    })
    .refine((date) => date <= new Date(), {
      message: 'Tanggal cannot be in the future',
    }),
  kegiatan: z
    .string()
    .min(1, 'Kegiatan is required')
    .min(10, 'Kegiatan must be at least 10 characters')
    .max(1000, 'Kegiatan must be less than 1000 characters'),
  keterangan: z
    .string()
    .max(500, 'Keterangan must be less than 500 characters')
    .optional(),
  dokumentasi: z
    .union([
      z.string().url('Format URL tidak valid').max(500, 'URL dokumentasi terlalu panjang'),
      z.literal(''),
      z.null()
    ])
    .optional()
    .transform(val => val === '' || val === null ? null : val),
  studentId: z
    .string()
    .min(1, 'Student ID is required'),
});

// Jurnal update validation schema
export const updateJurnalSchema = z.object({
  tanggal: z
    .date({
      invalid_type_error: 'Invalid date format',
    })
    .refine((date) => date <= new Date(), {
      message: 'Tanggal cannot be in the future',
    })
    .optional(),
  kegiatan: z
    .string()
    .min(10, 'Kegiatan must be at least 10 characters')
    .max(1000, 'Kegiatan must be less than 1000 characters')
    .optional(),
  keterangan: z
    .string()
    .max(500, 'Keterangan must be less than 500 characters')
    .optional(),
  dokumentasi: z
    .union([
      z.string().url('Format URL tidak valid').max(500, 'URL dokumentasi terlalu panjang'),
      z.literal(''),
      z.null()
    ])
    .optional()
    .transform(val => val === '' || val === null ? null : val),
});

// Jurnal filter validation schema
export const jurnalFilterSchema = z.object({
  studentId: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  search: z.string().max(100).optional(),
}).refine((data) => {
  if (data.startDate && data.endDate) {
    return data.startDate <= data.endDate;
  }
  return true;
}, {
  message: 'Start date must be before or equal to end date',
  path: ['endDate'],
});

// Export types
export type CreateJurnalInput = z.infer<typeof createJurnalSchema>;
export type UpdateJurnalInput = z.infer<typeof updateJurnalSchema>;
export type JurnalFilterInput = z.infer<typeof jurnalFilterSchema>;