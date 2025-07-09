-- Add version fields for optimistic locking

-- Add version field to Absensi table
ALTER TABLE "absensis" ADD COLUMN "version" INTEGER NOT NULL DEFAULT 1;

-- Add version field to SettingAbsensi table
ALTER TABLE "setting_absensis" ADD COLUMN "version" INTEGER NOT NULL DEFAULT 1;

-- Create indexes for version fields
CREATE INDEX "absensis_version_idx" ON "absensis"("version");
CREATE INDEX "setting_absensis_version_idx" ON "setting_absensis"("version");

-- Update existing records to have version 1
UPDATE "absensis" SET "version" = 1 WHERE "version" IS NULL;
UPDATE "setting_absensis" SET "version" = 1 WHERE "version" IS NULL;