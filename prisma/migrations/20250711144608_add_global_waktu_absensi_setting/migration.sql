-- AlterTable
ALTER TABLE "absensis" ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "jurnals" ADD COLUMN     "keterangan" TEXT;

-- AlterTable
ALTER TABLE "setting_absensis" ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "waktu_absensi_settings" (
    "id" TEXT NOT NULL,
    "jamMasukMulai" TEXT NOT NULL,
    "jamMasukSelesai" TEXT NOT NULL,
    "jamPulangMulai" TEXT NOT NULL,
    "jamPulangSelesai" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "waktu_absensi_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "waktu_absensi_settings_isActive_idx" ON "waktu_absensi_settings"("isActive");

-- CreateIndex
CREATE INDEX "waktu_absensi_settings_version_idx" ON "waktu_absensi_settings"("version");

-- CreateIndex
CREATE INDEX "absensis_tanggal_idx" ON "absensis"("tanggal");

-- CreateIndex
CREATE INDEX "absensis_studentId_idx" ON "absensis"("studentId");

-- CreateIndex
CREATE INDEX "absensis_tempatPklId_idx" ON "absensis"("tempatPklId");

-- CreateIndex
CREATE INDEX "absensis_tipe_idx" ON "absensis"("tipe");

-- CreateIndex
CREATE INDEX "absensis_tanggal_studentId_idx" ON "absensis"("tanggal", "studentId");

-- CreateIndex
CREATE INDEX "absensis_tanggal_tipe_idx" ON "absensis"("tanggal", "tipe");

-- CreateIndex
CREATE INDEX "absensis_createdAt_idx" ON "absensis"("createdAt");

-- CreateIndex
CREATE INDEX "absensis_version_idx" ON "absensis"("version");

-- CreateIndex
CREATE INDEX "jurnals_tanggal_idx" ON "jurnals"("tanggal");

-- CreateIndex
CREATE INDEX "jurnals_studentId_idx" ON "jurnals"("studentId");

-- CreateIndex
CREATE INDEX "jurnals_createdAt_idx" ON "jurnals"("createdAt");

-- CreateIndex
CREATE INDEX "jurnals_tanggal_studentId_idx" ON "jurnals"("tanggal", "studentId");

-- CreateIndex
CREATE INDEX "setting_absensis_version_idx" ON "setting_absensis"("version");

-- CreateIndex
CREATE INDEX "students_kelas_idx" ON "students"("kelas");

-- CreateIndex
CREATE INDEX "students_jurusan_idx" ON "students"("jurusan");

-- CreateIndex
CREATE INDEX "students_tempatPklId_idx" ON "students"("tempatPklId");

-- CreateIndex
CREATE INDEX "students_teacherId_idx" ON "students"("teacherId");

-- CreateIndex
CREATE INDEX "students_kelas_jurusan_idx" ON "students"("kelas", "jurusan");

-- CreateIndex
CREATE INDEX "students_createdAt_idx" ON "students"("createdAt");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_createdAt_idx" ON "users"("createdAt");

-- CreateIndex
CREATE INDEX "users_name_idx" ON "users"("name");
