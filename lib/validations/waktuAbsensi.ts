import { z } from 'zod';

const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

export const waktuAbsensiSettingSchema = z.object({
  tempatPklId: z.string().min(1, "Tempat PKL harus dipilih"),
  jamMasukMulai: z.string().regex(timeRegex, "Format waktu tidak valid (HH:mm)"),
  jamMasukSelesai: z.string().regex(timeRegex, "Format waktu tidak valid (HH:mm)"),
  jamPulangMulai: z.string().regex(timeRegex, "Format waktu tidak valid (HH:mm)"),
  jamPulangSelesai: z.string().regex(timeRegex, "Format waktu tidak valid (HH:mm)"),
  isActive: z.boolean().default(true)
}).refine((data) => {
  // Validasi: jam masuk selesai harus lebih besar dari jam masuk mulai
  return data.jamMasukSelesai > data.jamMasukMulai;
}, {
  message: "Jam masuk selesai harus lebih besar dari jam masuk mulai",
  path: ["jamMasukSelesai"]
}).refine((data) => {
  // Validasi: jam pulang selesai harus lebih besar dari jam pulang mulai
  return data.jamPulangSelesai > data.jamPulangMulai;
}, {
  message: "Jam pulang selesai harus lebih besar dari jam pulang mulai",
  path: ["jamPulangSelesai"]
}).refine((data) => {
  // Validasi: jam pulang mulai harus lebih besar dari jam masuk selesai
  return data.jamPulangMulai > data.jamMasukSelesai;
}, {
  message: "Jam pulang harus setelah jam masuk selesai",
  path: ["jamPulangMulai"]
});

export type WaktuAbsensiSettingInput = z.infer<typeof waktuAbsensiSettingSchema>;

// Schema untuk update (semua field opsional kecuali id)
export const updateWaktuAbsensiSettingSchema = z.object({
  id: z.string().min(1, "ID harus ada"),
  jamMasukMulai: z.string().regex(timeRegex, "Format waktu tidak valid (HH:mm)").optional(),
  jamMasukSelesai: z.string().regex(timeRegex, "Format waktu tidak valid (HH:mm)").optional(),
  jamPulangMulai: z.string().regex(timeRegex, "Format waktu tidak valid (HH:mm)").optional(),
  jamPulangSelesai: z.string().regex(timeRegex, "Format waktu tidak valid (HH:mm)").optional(),
  isActive: z.boolean().optional(),
  version: z.number().int().min(1, "Version harus valid")
}).refine((data) => {
  // Hanya validasi jika semua field waktu ada
  if (data.jamMasukMulai && data.jamMasukSelesai && data.jamPulangMulai && data.jamPulangSelesai) {
    return data.jamMasukSelesai > data.jamMasukMulai &&
           data.jamPulangSelesai > data.jamPulangMulai &&
           data.jamPulangMulai > data.jamMasukSelesai;
  }
  return true;
}, {
  message: "Waktu tidak valid: pastikan urutan waktu benar",
  path: ["jamMasukSelesai"]
});

export type UpdateWaktuAbsensiSettingInput = z.infer<typeof updateWaktuAbsensiSettingSchema>;