/*
  Warnings:

  - You are about to drop the column `email` on the `tempat_pkl` table. All the data in the column will be lost.
  - You are about to drop the column `namaContact` on the `tempat_pkl` table. All the data in the column will be lost.
  - You are about to drop the column `telepon` on the `tempat_pkl` table. All the data in the column will be lost.
  - The required column `pinAbsensi` was added to the `tempat_pkl` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- CreateEnum
CREATE TYPE "TipeAbsensi" AS ENUM ('MASUK', 'PULANG');

-- CreateEnum
CREATE TYPE "ModeAbsensi" AS ENUM ('MASUK_SAJA', 'MASUK_PULANG');

-- AlterTable
ALTER TABLE "tempat_pkl" DROP COLUMN "email",
DROP COLUMN "namaContact",
DROP COLUMN "telepon",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "pinAbsensi" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "absensis" (
    "id" TEXT NOT NULL,
    "tanggal" DATE NOT NULL,
    "waktuMasuk" TIMESTAMP(3),
    "waktuPulang" TIMESTAMP(3),
    "tipe" "TipeAbsensi" NOT NULL,
    "studentId" TEXT NOT NULL,
    "tempatPklId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "absensis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "setting_absensis" (
    "id" TEXT NOT NULL,
    "modeAbsensi" "ModeAbsensi" NOT NULL,
    "tempatPklId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "setting_absensis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "absensis_studentId_tanggal_tipe_key" ON "absensis"("studentId", "tanggal", "tipe");

-- CreateIndex
CREATE UNIQUE INDEX "setting_absensis_tempatPklId_key" ON "setting_absensis"("tempatPklId");

-- AddForeignKey
ALTER TABLE "absensis" ADD CONSTRAINT "absensis_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "absensis" ADD CONSTRAINT "absensis_tempatPklId_fkey" FOREIGN KEY ("tempatPklId") REFERENCES "tempat_pkl"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "setting_absensis" ADD CONSTRAINT "setting_absensis_tempatPklId_fkey" FOREIGN KEY ("tempatPklId") REFERENCES "tempat_pkl"("id") ON DELETE CASCADE ON UPDATE CASCADE;
