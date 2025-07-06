import { z } from 'zod';

// Tempat PKL validation schemas
export const createTempatPklSchema = z.object({
  nama: z
    .string()
    .min(1, 'Nama tempat PKL is required')
    .min(3, 'Nama must be at least 3 characters')
    .max(100, 'Nama must be less than 100 characters'),
  alamat: z
    .string()
    .min(1, 'Alamat is required')
    .max(200, 'Alamat must be less than 200 characters'),
  kontak: z
    .string()
    .max(50, 'Kontak must be less than 50 characters')
    .optional(),
  pembimbing: z
    .string()
    .max(100, 'Pembimbing must be less than 100 characters')
    .optional(),
  kapasitas: z
    .number()
    .int('Kapasitas must be an integer')
    .min(1, 'Kapasitas must be at least 1')
    .max(100, 'Kapasitas must be less than 100')
    .optional(),
  deskripsi: z
    .string()
    .max(500, 'Deskripsi must be less than 500 characters')
    .optional(),
});

export const updateTempatPklSchema = createTempatPklSchema.partial();

// Student mapping validation schemas
const baseStudentMappingSchema = z.object({
  studentId: z
    .string()
    .min(1, 'Student ID is required'),
  tempatPklId: z
    .string()
    .min(1, 'Tempat PKL ID is required'),
  teacherId: z
    .string()
    .optional()
    .nullable(),
});

export const studentMappingSchema = baseStudentMappingSchema;

export const updateStudentMappingSchema = baseStudentMappingSchema.partial();

// Bulk student mapping validation
export const bulkStudentMappingSchema = z.object({
  mappings: z.array(
    z.object({
      studentId: z.string().min(1, 'Student ID is required'),
      tempatPklId: z.string().min(1, 'Tempat PKL ID is required'),
      teacherId: z.string().optional().nullable()
    })
  ).min(1, 'At least one mapping is required'),
});

// User import validation schemas
export const importUserSchema = z.object({
  users: z.array(
    z.object({
      username: z
        .string()
        .min(3, 'Username must be at least 3 characters')
        .max(50, 'Username must be less than 50 characters')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
      password: z
        .string()
        .min(6, 'Password must be at least 6 characters')
        .max(100, 'Password must be less than 100 characters'),
      role: z.enum(['ADMIN', 'GURU', 'SISWA']),
      name: z
        .string()
        .max(100, 'Name must be less than 100 characters')
        .optional(),
      email: z
        .string()
        .email('Invalid email format')
        .optional(),
      nis: z
        .string()
        .max(20, 'NIS must be less than 20 characters')
        .optional(),
      kelas: z
        .string()
        .max(10, 'Kelas must be less than 10 characters')
        .optional(),
    })
  ).min(1, 'At least one user is required'),
});

// Activity monitoring validation schemas
export const activityFilterSchema = z.object({
  userId: z.string().optional(),
  role: z.enum(['ADMIN', 'GURU', 'SISWA']).optional(),
  action: z.string().max(50).optional(),
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

// System settings validation schemas
export const systemSettingsSchema = z.object({
  siteName: z
    .string()
    .min(1, 'Site name is required')
    .max(100, 'Site name must be less than 100 characters'),
  siteDescription: z
    .string()
    .max(500, 'Site description must be less than 500 characters')
    .optional(),
  maxAbsensiPerDay: z
    .number()
    .int('Must be an integer')
    .min(1, 'Must be at least 1')
    .max(10, 'Must be less than 10'),
  maxJurnalPerDay: z
    .number()
    .int('Must be an integer')
    .min(1, 'Must be at least 1')
    .max(10, 'Must be less than 10'),
  allowWeekendAbsensi: z.boolean(),
  requireApprovalForAbsensi: z.boolean(),
  autoLogoutMinutes: z
    .number()
    .int('Must be an integer')
    .min(5, 'Must be at least 5 minutes')
    .max(480, 'Must be less than 8 hours'),
});

// Report generation validation schemas
export const reportFilterSchema = z.object({
  type: z.enum(['ABSENSI', 'JURNAL', 'ACTIVITY', 'USER_SUMMARY']),
  format: z.enum(['PDF', 'EXCEL', 'CSV']),
  startDate: z.date({
    required_error: 'Start date is required',
  }),
  endDate: z.date({
    required_error: 'End date is required',
  }),
  studentIds: z.array(z.string()).optional(),
  tempatPklIds: z.array(z.string()).optional(),
  includeDetails: z.boolean().default(true),
  groupBy: z.enum(['STUDENT', 'TEMPAT_PKL', 'DATE']).optional(),
}).refine((data) => {
  return data.endDate >= data.startDate;
}, {
  message: 'End date must be after or equal to start date',
  path: ['endDate'],
});

// Export types
export type CreateTempatPklInput = z.infer<typeof createTempatPklSchema>;
export type UpdateTempatPklInput = z.infer<typeof updateTempatPklSchema>;
export type StudentMappingInput = z.infer<typeof studentMappingSchema>;
export type StudentMappingFormData = z.infer<typeof studentMappingSchema>;
export type UpdateStudentMappingInput = z.infer<typeof updateStudentMappingSchema>;
export type BulkStudentMappingInput = z.infer<typeof bulkStudentMappingSchema>;
export type ImportUserInput = z.infer<typeof importUserSchema>;
export type ActivityFilterInput = z.infer<typeof activityFilterSchema>;
export type SystemSettingsInput = z.infer<typeof systemSettingsSchema>;
export type ReportFilterInput = z.infer<typeof reportFilterSchema>;