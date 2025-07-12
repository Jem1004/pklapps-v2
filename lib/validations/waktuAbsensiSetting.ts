import { z } from 'zod';

const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

export const waktuAbsensiSettingSchema = z.object({
  jamMasukMulai: z.string().regex(timeRegex, "Format waktu tidak valid (HH:mm)"),
  jamMasukSelesai: z.string().regex(timeRegex, "Format waktu tidak valid (HH:mm)"),
  jamPulangMulai: z.string().regex(timeRegex, "Format waktu tidak valid (HH:mm)"),
  jamPulangSelesai: z.string().regex(timeRegex, "Format waktu tidak valid (HH:mm)"),
  isActive: z.boolean()
}).refine((data) => {
  // Validasi bahwa jam masuk mulai < jam masuk selesai
  const masukMulai = data.jamMasukMulai.split(':').map(Number);
  const masukSelesai = data.jamMasukSelesai.split(':').map(Number);
  const masukMulaiMinutes = masukMulai[0] * 60 + masukMulai[1];
  const masukSelesaiMinutes = masukSelesai[0] * 60 + masukSelesai[1];
  
  return masukMulaiMinutes < masukSelesaiMinutes;
}, {
  message: "Jam masuk mulai harus lebih awal dari jam masuk selesai",
  path: ["jamMasukSelesai"]
}).refine((data) => {
  // Validasi bahwa jam pulang mulai < jam pulang selesai
  const pulangMulai = data.jamPulangMulai.split(':').map(Number);
  const pulangSelesai = data.jamPulangSelesai.split(':').map(Number);
  const pulangMulaiMinutes = pulangMulai[0] * 60 + pulangMulai[1];
  const pulangSelesaiMinutes = pulangSelesai[0] * 60 + pulangSelesai[1];
  
  return pulangMulaiMinutes < pulangSelesaiMinutes;
}, {
  message: "Jam pulang mulai harus lebih awal dari jam pulang selesai",
  path: ["jamPulangSelesai"]
}).refine((data) => {
  // Validasi bahwa jam masuk selesai <= jam pulang mulai (tidak overlap)
  const masukSelesai = data.jamMasukSelesai.split(':').map(Number);
  const pulangMulai = data.jamPulangMulai.split(':').map(Number);
  const masukSelesaiMinutes = masukSelesai[0] * 60 + masukSelesai[1];
  const pulangMulaiMinutes = pulangMulai[0] * 60 + pulangMulai[1];
  
  return masukSelesaiMinutes <= pulangMulaiMinutes;
}, {
  message: "Jam masuk selesai tidak boleh lebih dari jam pulang mulai",
  path: ["jamPulangMulai"]
});

export type WaktuAbsensiSettingInput = z.infer<typeof waktuAbsensiSettingSchema>;

// Base schema tanpa refinements untuk partial updates
const baseWaktuAbsensiSettingSchema = z.object({
  jamMasukMulai: z.string().regex(timeRegex, "Format waktu tidak valid (HH:mm)"),
  jamMasukSelesai: z.string().regex(timeRegex, "Format waktu tidak valid (HH:mm)"),
  jamPulangMulai: z.string().regex(timeRegex, "Format waktu tidak valid (HH:mm)"),
  jamPulangSelesai: z.string().regex(timeRegex, "Format waktu tidak valid (HH:mm)"),
  isActive: z.boolean()
});

// Schema untuk update (semua field optional kecuali version)
export const waktuAbsensiSettingUpdateSchema = baseWaktuAbsensiSettingSchema.partial().extend({
  version: z.number().min(1)
});

export type WaktuAbsensiSettingUpdateInput = z.infer<typeof waktuAbsensiSettingUpdateSchema>;