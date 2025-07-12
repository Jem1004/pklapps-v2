# Context Engineering - Fitur Pengelolaan Waktu Absensi

## Overview
Dokumen ini berisi panduan context engineering untuk pengembangan fitur **Pengelolaan Waktu Absensi** pada sistem PKL SMK. Fitur ini memungkinkan admin untuk mengatur waktu masuk dan pulang yang fleksibel per tempat PKL, menggantikan sistem waktu tetap yang saat ini digunakan.

---

## Analisis Sistem Saat Ini

### Current Implementation
- **Waktu Masuk**: Hard-coded 07:00 - 10:00
- **Waktu Pulang**: Hard-coded 13:00 - 17:00
- **Lokasi Logic**: `lib/utils/absensi.ts` dan `app/dashboard/absensi/actions.ts`
- **Validasi**: Function `isOutsideWorkingHours()` dan `getCurrentPeriod()`

### Limitations
- Tidak fleksibel untuk tempat PKL dengan jam kerja berbeda
- Tidak ada pengaturan per tempat PKL
- Admin tidak bisa mengubah waktu absensi
- Semua tempat PKL menggunakan waktu yang sama

---

## Fitur Pengelolaan Waktu Absensi

### Context & Requirements
- **Lokasi**: Dashboard Admin → Pengaturan Waktu Absensi
- **Tujuan**: Mengatur waktu masuk dan pulang per tempat PKL
- **Fleksibilitas**: Setiap tempat PKL dapat memiliki waktu berbeda
- **Validasi**: Waktu masuk harus lebih awal dari waktu pulang
- **Default**: Sistem tetap menggunakan waktu default jika belum diatur

### Technical Context
```typescript
// Interface untuk pengaturan waktu absensi
interface WaktuAbsensiSetting {
  id: string;
  tempatPklId: string;
  jamMasukMulai: string; // Format: "HH:mm" (e.g., "07:00")
  jamMasukSelesai: string; // Format: "HH:mm" (e.g., "10:00")
  jamPulangMulai: string; // Format: "HH:mm" (e.g., "13:00")
  jamPulangSelesai: string; // Format: "HH:mm" (e.g., "17:00")
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  version: number; // Optimistic locking
}

// Interface untuk validasi waktu
interface TimeValidation {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

// Interface untuk periode absensi yang dinamis
interface DynamicAbsensiPeriod {
  type: 'MASUK' | 'PULANG' | 'TUTUP';
  label: string;
  timeRange: string;
  color: string;
  bgColor: string;
  borderColor: string;
  isCustom: boolean;
}
```

### Database Schema Context
```sql
-- Tabel baru untuk pengaturan waktu absensi
CREATE TABLE waktu_absensi_settings (
  id VARCHAR(255) PRIMARY KEY,
  tempat_pkl_id VARCHAR(255) NOT NULL,
  jam_masuk_mulai TIME NOT NULL DEFAULT '07:00:00',
  jam_masuk_selesai TIME NOT NULL DEFAULT '10:00:00',
  jam_pulang_mulai TIME NOT NULL DEFAULT '13:00:00',
  jam_pulang_selesai TIME NOT NULL DEFAULT '17:00:00',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  version INT NOT NULL DEFAULT 1,
  
  FOREIGN KEY (tempat_pkl_id) REFERENCES tempat_pkl(id) ON DELETE CASCADE,
  UNIQUE KEY unique_tempat_pkl (tempat_pkl_id),
  INDEX idx_tempat_pkl_id (tempat_pkl_id),
  INDEX idx_is_active (is_active),
  INDEX idx_version (version)
);
```

### Prisma Schema Context
```prisma
// Model baru untuk pengaturan waktu absensi
model WaktuAbsensiSetting {
  id                String    @id @default(cuid())
  jamMasukMulai     String    @db.Time // Format: "HH:mm:ss"
  jamMasukSelesai   String    @db.Time
  jamPulangMulai    String    @db.Time
  jamPulangSelesai  String    @db.Time
  isActive          Boolean   @default(true)
  version           Int       @default(1) // Optimistic locking
  
  // Relasi ke TempatPkl (one-to-one)
  tempatPklId       String    @unique
  tempatPkl         TempatPkl @relation(fields: [tempatPklId], references: [id], onDelete: Cascade)
  
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  
  @@index([tempatPklId])
  @@index([isActive])
  @@index([version])
  @@map("waktu_absensi_settings")
}

// Update model TempatPkl untuk menambah relasi
model TempatPkl {
  // ... existing fields ...
  
  // Tambahkan relasi baru
  waktuAbsensiSetting WaktuAbsensiSetting?
  
  // ... existing relations ...
}
```

---

## Implementation Context

### Core Logic Updates

#### 1. Enhanced Time Validation
```typescript
// lib/utils/absensi.ts - Update existing functions

/**
 * Mendapatkan pengaturan waktu untuk tempat PKL tertentu
 */
export async function getWaktuAbsensiSetting(tempatPklId: string): Promise<WaktuAbsensiSetting | null> {
  return await prisma.waktuAbsensiSetting.findUnique({
    where: { tempatPklId },
    include: { tempatPkl: true }
  });
}

/**
 * Menentukan periode absensi berdasarkan waktu dan pengaturan tempat PKL
 */
export async function getCurrentPeriodDynamic(
  tempatPklId: string,
  currentTime: Date = new Date()
): Promise<DynamicAbsensiPeriod> {
  const setting = await getWaktuAbsensiSetting(tempatPklId);
  
  // Gunakan default jika tidak ada pengaturan khusus
  const jamMasukMulai = setting?.jamMasukMulai || "07:00:00";
  const jamMasukSelesai = setting?.jamMasukSelesai || "10:00:00";
  const jamPulangMulai = setting?.jamPulangMulai || "13:00:00";
  const jamPulangSelesai = setting?.jamPulangSelesai || "17:00:00";
  
  const currentTimeStr = formatTimeToString(currentTime);
  
  if (isTimeInRange(currentTimeStr, jamMasukMulai, jamMasukSelesai)) {
    return {
      type: 'MASUK',
      label: 'Waktu Absen Masuk',
      timeRange: `${jamMasukMulai.slice(0,5)} - ${jamMasukSelesai.slice(0,5)}`,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      isCustom: !!setting
    };
  }
  
  if (isTimeInRange(currentTimeStr, jamPulangMulai, jamPulangSelesai)) {
    return {
      type: 'PULANG',
      label: 'Waktu Absen Pulang',
      timeRange: `${jamPulangMulai.slice(0,5)} - ${jamPulangSelesai.slice(0,5)}`,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      isCustom: !!setting
    };
  }
  
  return {
    type: 'TUTUP',
    label: 'Di Luar Jam Absensi',
    timeRange: 'Tidak dalam periode absensi',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    isCustom: !!setting
  };
}

/**
 * Validasi apakah waktu absensi sesuai dengan pengaturan tempat PKL
 */
export async function isOutsideWorkingHoursDynamic(
  waktu: Date,
  tipe: TipeAbsensi,
  tempatPklId: string
): Promise<boolean> {
  const setting = await getWaktuAbsensiSetting(tempatPklId);
  
  const waktuStr = formatTimeToString(waktu);
  
  if (tipe === TipeAbsensi.MASUK) {
    const jamMulai = setting?.jamMasukMulai || "07:00:00";
    const jamSelesai = setting?.jamMasukSelesai || "10:00:00";
    return !isTimeInRange(waktuStr, jamMulai, jamSelesai);
  } else {
    const jamMulai = setting?.jamPulangMulai || "13:00:00";
    const jamSelesai = setting?.jamPulangSelesai || "17:00:00";
    return !isTimeInRange(waktuStr, jamMulai, jamSelesai);
  }
}

// Helper functions
function formatTimeToString(date: Date): string {
  return date.toTimeString().slice(0, 8); // "HH:mm:ss"
}

function isTimeInRange(currentTime: string, startTime: string, endTime: string): boolean {
  return currentTime >= startTime && currentTime <= endTime;
}
```

#### 2. Validation Schema
```typescript
// lib/validations/waktuAbsensi.ts
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
```

---

## File Structure Context

```
app/dashboard/admin/waktu-absensi/
├── page.tsx                    # Main page untuk pengaturan waktu
├── actions.ts                  # Server actions untuk CRUD
└── components/
    ├── WaktuAbsensiForm.tsx    # Form pengaturan waktu
    ├── WaktuAbsensiList.tsx    # List pengaturan per tempat PKL
    └── TimeRangePicker.tsx     # Component untuk memilih range waktu

components/features/admin/
├── WaktuAbsensiManager.tsx     # Main component manager
├── WaktuAbsensiCard.tsx        # Card untuk menampilkan pengaturan
└── WaktuAbsensiPreview.tsx     # Preview pengaturan waktu

lib/validations/
└── waktuAbsensi.ts             # Validation schemas

lib/utils/
├── absensi.ts                  # Update existing functions
└── timeUtils.ts                # New utility functions for time

app/api/admin/waktu-absensi/
├── route.ts                    # GET, POST endpoints
├── [id]/
│   └── route.ts               # PUT, DELETE endpoints
└── bulk/
    └── route.ts               # Bulk operations

types/features/
└── waktuAbsensi.ts            # TypeScript interfaces
```

---

## API Endpoints Context

### REST API Structure
```typescript
// app/api/admin/waktu-absensi/route.ts

// GET /api/admin/waktu-absensi
// Mendapatkan semua pengaturan waktu absensi
export async function GET(request: Request) {
  // Implementation
}

// POST /api/admin/waktu-absensi
// Membuat pengaturan waktu absensi baru
export async function POST(request: Request) {
  // Implementation with validation
}

// app/api/admin/waktu-absensi/[id]/route.ts

// PUT /api/admin/waktu-absensi/[id]
// Update pengaturan waktu absensi
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  // Implementation with optimistic locking
}

// DELETE /api/admin/waktu-absensi/[id]
// Hapus pengaturan waktu absensi
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  // Implementation
}
```

---

## UI/UX Context

### Admin Dashboard Integration
```typescript
// app/dashboard/admin/page.tsx - Update existing tabs

const adminTabs = [
  'overview',
  'students',
  'tempat-pkl',
  'student-mapping',
  'waktu-absensi', // New tab
  'print-pin-cards'
] as const;

// Add new tab trigger and content
<TabsTrigger value="waktu-absensi" className="flex items-center gap-2">
  <Clock className="h-4 w-4" />
  Waktu Absensi
</TabsTrigger>

<TabsContent value="waktu-absensi">
  <WaktuAbsensiManager />
</TabsContent>
```

### Form Component Context
```typescript
// components/features/admin/WaktuAbsensiForm.tsx

interface WaktuAbsensiFormProps {
  tempatPklId?: string;
  initialData?: WaktuAbsensiSetting;
  onSuccess?: () => void;
  onCancel?: () => void;
}

// Features:
// - Time picker components
// - Real-time validation
// - Preview of time ranges
// - Conflict detection
// - Save/Cancel actions
```

---

## Migration Context

### Database Migration
```sql
-- Migration: Add waktu_absensi_settings table
-- File: prisma/migrations/add_waktu_absensi_settings/migration.sql

CREATE TABLE `waktu_absensi_settings` (
    `id` VARCHAR(191) NOT NULL,
    `tempat_pkl_id` VARCHAR(191) NOT NULL,
    `jam_masuk_mulai` TIME NOT NULL DEFAULT '07:00:00',
    `jam_masuk_selesai` TIME NOT NULL DEFAULT '10:00:00',
    `jam_pulang_mulai` TIME NOT NULL DEFAULT '13:00:00',
    `jam_pulang_selesai` TIME NOT NULL DEFAULT '17:00:00',
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `version` INTEGER NOT NULL DEFAULT 1,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `waktu_absensi_settings_tempat_pkl_id_key`(`tempat_pkl_id`),
    INDEX `waktu_absensi_settings_tempat_pkl_id_idx`(`tempat_pkl_id`),
    INDEX `waktu_absensi_settings_is_active_idx`(`is_active`),
    INDEX `waktu_absensi_settings_version_idx`(`version`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Add foreign key constraint
ALTER TABLE `waktu_absensi_settings` ADD CONSTRAINT `waktu_absensi_settings_tempat_pkl_id_fkey` FOREIGN KEY (`tempat_pkl_id`) REFERENCES `tempat_pkl`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
```

### Data Seeding
```typescript
// prisma/seed.ts - Add default settings for existing tempat PKL

async function seedWaktuAbsensiSettings() {
  const tempatPklList = await prisma.tempatPkl.findMany();
  
  for (const tempatPkl of tempatPklList) {
    await prisma.waktuAbsensiSetting.upsert({
      where: { tempatPklId: tempatPkl.id },
      update: {},
      create: {
        tempatPklId: tempatPkl.id,
        jamMasukMulai: "07:00:00",
        jamMasukSelesai: "10:00:00",
        jamPulangMulai: "13:00:00",
        jamPulangSelesai: "17:00:00",
        isActive: true
      }
    });
  }
}
```

---

## Testing Context

### Unit Tests
```typescript
// __tests__/utils/waktuAbsensi.test.ts

describe('WaktuAbsensi Utils', () => {
  test('should validate time ranges correctly', () => {
    // Test time validation logic
  });
  
  test('should determine correct period based on custom settings', () => {
    // Test dynamic period detection
  });
  
  test('should handle default settings when no custom settings exist', () => {
    // Test fallback to default times
  });
});
```

### Integration Tests
```typescript
// __tests__/api/waktuAbsensi.test.ts

describe('Waktu Absensi API', () => {
  test('should create new time settings', () => {
    // Test POST endpoint
  });
  
  test('should update existing settings with optimistic locking', () => {
    // Test PUT endpoint with version control
  });
  
  test('should validate time conflicts', () => {
    // Test validation logic
  });
});
```

---

## Performance Considerations

### Caching Strategy
```typescript
// lib/cache/waktuAbsensi.ts

// Cache pengaturan waktu absensi untuk mengurangi database queries
const waktuAbsensiCache = new Map<string, WaktuAbsensiSetting>();

export async function getCachedWaktuAbsensiSetting(tempatPklId: string): Promise<WaktuAbsensiSetting | null> {
  // Check cache first
  if (waktuAbsensiCache.has(tempatPklId)) {
    return waktuAbsensiCache.get(tempatPklId) || null;
  }
  
  // Fetch from database and cache
  const setting = await getWaktuAbsensiSetting(tempatPklId);
  if (setting) {
    waktuAbsensiCache.set(tempatPklId, setting);
  }
  
  return setting;
}

// Invalidate cache when settings are updated
export function invalidateWaktuAbsensiCache(tempatPklId: string) {
  waktuAbsensiCache.delete(tempatPklId);
}
```

### Database Optimization
```sql
-- Indexes untuk optimasi query
CREATE INDEX idx_waktu_absensi_tempat_pkl_active ON waktu_absensi_settings(tempat_pkl_id, is_active);
CREATE INDEX idx_waktu_absensi_created_at ON waktu_absensi_settings(created_at);
```

---

## Security Context

### Authorization
```typescript
// middleware/waktuAbsensiAuth.ts

export async function validateWaktuAbsensiAccess(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized: Only admin can manage attendance time settings');
  }
  
  return session;
}
```

### Input Validation
```typescript
// Strict validation untuk mencegah injection dan data corruption
// Gunakan Zod schema yang sudah didefinisikan
// Validasi format waktu dengan regex
// Sanitize input sebelum database operations
```

---

## Deployment Checklist

### Pre-deployment
- [ ] Database migration tested
- [ ] Seed data prepared
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] Performance tests completed
- [ ] Security audit completed

### Post-deployment
- [ ] Monitor database performance
- [ ] Check cache hit rates
- [ ] Validate time calculations
- [ ] Monitor error rates
- [ ] User acceptance testing

---

## Future Enhancements

### Phase 2 Features
- **Timezone Support**: Support untuk multiple timezone
- **Holiday Management**: Pengaturan hari libur per tempat PKL
- **Flexible Schedules**: Jadwal berbeda per hari dalam seminggu
- **Notification System**: Notifikasi perubahan waktu absensi
- **Audit Trail**: Log perubahan pengaturan waktu

### Integration Opportunities
- **Mobile App**: Sync pengaturan waktu ke mobile app
- **External Systems**: API untuk integrasi dengan sistem eksternal
- **Reporting**: Laporan berdasarkan pengaturan waktu custom

---

## Development Guidelines

### Code Standards
- Follow existing TypeScript patterns
- Use Zod for validation schemas
- Implement proper error handling
- Add comprehensive logging
- Follow existing naming conventions

### Documentation
- Update API documentation
- Add inline code comments
- Create user manual for admin
- Document configuration options

### Version Control
- Use feature branches
- Write descriptive commit messages
- Tag releases appropriately
- Maintain changelog

---

*Dokumen ini akan diupdate seiring dengan perkembangan implementasi fitur.*