# 📊 Migration Analysis Report - Jurnal PKL SMK

## 🎯 Executive Summary

This report provides a comprehensive analysis of the current folder structure and creates a detailed migration plan to implement the new structure defined in `CODING_STANDARDS.md` Phase 1.1.

**Key Findings:**
- 23 components need to be reorganized
- 4 library files need restructuring
- Missing custom hooks (0 currently, need 4+)
- Limited type definitions (1 file, need 5+)
- No validation schemas (need 4+)

---

## 📁 Current Structure Analysis

### Existing Folder Structure
```
Project Root/
├── app/                    # Next.js App Router (main)
│   ├── absensi/           # Attendance feature
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   └── dashboard/         # Dashboard pages
├── components/            # React components
│   ├── admin/             # Admin-specific (5 files)
│   ├── guru/              # Teacher-specific (4 files)
│   ├── layout/            # Layout components (21 files)
│   ├── providers/         # Context providers (1 file)
│   ├── ui/                # UI components (14 files)
│   ├── EditJurnalDialog.tsx
│   ├── JurnalList.tsx
│   └── PrintableJurnal.tsx
├── lib/                   # Utilities (4 files)
├── types/                 # Type definitions (1 file)
├── src/                   # Duplicate app structure
└── prisma/                # Database schema
```

### Issues Identified

#### 1. **Duplicate App Structure**
- Both `app/` and `src/app/` exist
- `src/app/` contains only basic files
- **Action**: Remove `src/app/` and use main `app/`

#### 2. **Component Organization Issues**
- Feature components mixed in root `components/`
- No clear separation between features
- Missing `features/`, `forms/`, `common/` folders

#### 3. **Missing Custom Hooks**
- No `hooks/` folder exists
- Logic embedded in components
- Need to extract: `useAuth`, `useAbsensi`, `useJurnal`, `useLocalStorage`

#### 4. **Limited Library Organization**
- All utilities in flat `lib/` structure
- Need subfolders: `auth/`, `database/`, `validations/`, `constants/`

#### 5. **Insufficient Type Definitions**
- Only `next-auth.d.ts` exists
- Need feature-specific types: `auth.ts`, `user.ts`, `absensi.ts`, `jurnal.ts`, `api.ts`

---

## 🗂️ Detailed File Migration Map

### Components to Move

#### Admin Components (5 files)
**From**: `components/admin/` → **To**: `components/features/admin/`
```
✓ ActivityMonitoring.tsx
✓ ImportUsers.tsx  
✓ StudentMapping.tsx
✓ TempatPklManagement.tsx
✓ UserManagement.tsx
```

#### Teacher Components (4 files)
**From**: `components/guru/` → **To**: `components/features/guru/`
```
✓ JurnalGuruGroupedList.tsx
✓ JurnalGuruList.tsx
✓ KomentarDialog.tsx
✓ StudentBimbinganList.tsx
```

#### Journal Components (3 files)
**From**: `components/` → **To**: `components/features/jurnal/`
```
✓ EditJurnalDialog.tsx
✓ JurnalList.tsx
✓ PrintableJurnal.tsx
```

#### Layout Components (21 files)
**Action**: Keep in `components/layout/` (already well organized)
```
✓ MainLayout.tsx
✓ MainLayoutAdmin.tsx
✓ MainLayoutGuru.tsx
✓ MobileSidebar.tsx
✓ MobileSidebarAdmin.tsx
✓ MobileSidebarGuru.tsx
✓ Navigation.tsx
✓ Sidebar.tsx
✓ SidebarAdmin.tsx
✓ SidebarGuru.tsx
✓ StudentBottomNav.tsx
✓ StudentHeader.tsx
✓ StudentLayout.tsx
✓ StudentMainNav.tsx
✓ StudentMainNavigation.tsx
✓ StudentMinimalLayout.tsx
✓ StudentNavigationLayout.tsx
✓ StudentSubNav.tsx
✓ Topbar.tsx
✓ TopbarAdmin.tsx
✓ TopbarGuru.tsx
```

#### UI Components (14 files)
**Action**: Keep in `components/ui/` (Shadcn components)
```
✓ accordion.tsx
✓ alert.tsx
✓ badge.tsx
✓ button.tsx
✓ card.tsx
✓ dialog.tsx
✓ dropdown-menu.tsx
✓ input.tsx
✓ label.tsx
✓ select.tsx
✓ table.tsx
✓ tabs.tsx
✓ textarea.tsx
```

### Library Files to Reorganize

#### Current Files (4 files)
```
lib/
├── auth.ts          → lib/auth/config.ts
├── password.ts      → lib/auth/password.ts
├── prisma.ts        → lib/database/client.ts
└── utils.ts         → Keep as lib/utils.ts
```

#### New Files to Create
```
lib/
├── auth/
│   ├── config.ts        # NextAuth configuration
│   ├── password.ts      # Password utilities
│   └── utils.ts         # Auth helper functions
├── database/
│   ├── client.ts        # Prisma client
│   ├── queries.ts       # Common queries
│   └── utils.ts         # Database utilities
├── validations/
│   ├── auth.ts          # Login/register schemas
│   ├── jurnal.ts        # Journal validation
│   ├── absensi.ts       # Attendance validation
│   └── admin.ts         # Admin forms validation
├── constants/
│   ├── api.ts           # API endpoints
│   ├── app.ts           # App constants
│   └── roles.ts         # User roles
└── utils.ts             # General utilities
```

---

## 🔧 Custom Hooks to Create

### 1. useAuth Hook
**File**: `hooks/useAuth.ts`
**Purpose**: Centralize authentication logic
**Extract from**: Various components using `useSession`

```typescript
export function useAuth() {
  const { data: session, status } = useSession()
  
  const isAuthenticated = status === 'authenticated'
  const isLoading = status === 'loading'
  const user = session?.user
  
  const login = async (credentials: LoginCredentials) => {
    // Login logic
  }
  
  const logout = async () => {
    await signOut()
  }
  
  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout
  }
}
```

### 2. useAbsensi Hook
**File**: `hooks/useAbsensi.ts`
**Purpose**: Manage attendance operations
**Extract from**: `app/absensi/page.tsx`, `app/absensi/actions.ts`

```typescript
export function useAbsensi() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [recentAbsensi, setRecentAbsensi] = useState<AbsensiRecord[]>([])
  
  const submitAbsensi = async (pin: string) => {
    // Submit attendance logic
  }
  
  const getRecentAbsensi = async () => {
    // Fetch recent attendance
  }
  
  return {
    isSubmitting,
    recentAbsensi,
    submitAbsensi,
    getRecentAbsensi
  }
}
```

### 3. useJurnal Hook
**File**: `hooks/useJurnal.ts`
**Purpose**: Manage journal operations
**Extract from**: Journal components

```typescript
export function useJurnal() {
  const [journals, setJournals] = useState<JurnalEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  const createJurnal = async (data: CreateJurnalData) => {
    // Create journal logic
  }
  
  const updateJurnal = async (id: string, data: UpdateJurnalData) => {
    // Update journal logic
  }
  
  const deleteJurnal = async (id: string) => {
    // Delete journal logic
  }
  
  return {
    journals,
    isLoading,
    createJurnal,
    updateJurnal,
    deleteJurnal
  }
}
```

### 4. useLocalStorage Hook
**File**: `hooks/useLocalStorage.ts`
**Purpose**: Generic local storage management

```typescript
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      return initialValue
    }
  })
  
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }
  
  return [storedValue, setValue] as const
}
```

---

## 📝 Type Definitions to Create

### 1. Auth Types
**File**: `types/auth.ts`
```typescript
export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthUser {
  id: string
  name: string
  username: string
  role: Role
}

export interface AuthSession {
  user: AuthUser
  expires: string
}
```

### 2. User Types
**File**: `types/user.ts`
```typescript
export interface UserProfile {
  id: string
  email: string
  username: string
  name: string
  role: Role
  createdAt: Date
  updatedAt: Date
}

export interface StudentProfile extends UserProfile {
  student: {
    nisn: string
    kelas: string
    jurusan: string
    tempatPkl?: TempatPkl
  }
}

export interface TeacherProfile extends UserProfile {
  teacher: {
    nip: string
  }
}
```

### 3. Absensi Types
**File**: `types/absensi.ts`
```typescript
export interface AbsensiRecord {
  id: string
  type: 'MASUK' | 'PULANG'
  timestamp: Date
  studentId: string
  tempatPklId: string
  createdAt: Date
}

export interface SubmitAbsensiData {
  pin: string
}

export interface AbsensiResponse {
  success: boolean
  message: string
  data?: AbsensiRecord
}
```

### 4. Jurnal Types
**File**: `types/jurnal.ts`
```typescript
export interface JurnalEntry {
  id: string
  tanggal: Date
  kegiatan: string
  dokumentasi?: string
  studentId: string
  comments: JurnalComment[]
  createdAt: Date
  updatedAt: Date
}

export interface JurnalComment {
  id: string
  comment: string
  teacherId: string
  teacher: {
    user: {
      name: string
    }
  }
  createdAt: Date
}

export interface CreateJurnalData {
  tanggal: Date
  kegiatan: string
  dokumentasi?: string
}

export interface UpdateJurnalData {
  kegiatan: string
  dokumentasi?: string
}
```

### 5. API Types
**File**: `types/api.ts`
```typescript
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ApiError {
  message: string
  code?: string
  statusCode: number
}
```

---

## 🔍 Validation Schemas to Create

### 1. Auth Validation
**File**: `lib/validations/auth.ts`
```typescript
import { z } from 'zod'

export const loginSchema = z.object({
  username: z.string().min(1, 'Username wajib diisi'),
  password: z.string().min(1, 'Password wajib diisi')
})

export const registerSchema = z.object({
  email: z.string().email('Email tidak valid'),
  username: z.string().min(3, 'Username minimal 3 karakter'),
  name: z.string().min(1, 'Nama wajib diisi'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  role: z.enum(['STUDENT', 'TEACHER', 'ADMIN'])
})

export type LoginData = z.infer<typeof loginSchema>
export type RegisterData = z.infer<typeof registerSchema>
```

### 2. Jurnal Validation
**File**: `lib/validations/jurnal.ts`
```typescript
import { z } from 'zod'

export const createJurnalSchema = z.object({
  tanggal: z.date(),
  kegiatan: z.string().min(10, 'Kegiatan minimal 10 karakter').max(1000, 'Kegiatan maksimal 1000 karakter')
})

export const updateJurnalSchema = z.object({
  kegiatan: z.string().min(10, 'Kegiatan minimal 10 karakter').max(1000, 'Kegiatan maksimal 1000 karakter')
})

export const commentSchema = z.object({
  comment: z.string().min(1, 'Komentar wajib diisi').max(500, 'Komentar maksimal 500 karakter')
})

export type CreateJurnalData = z.infer<typeof createJurnalSchema>
export type UpdateJurnalData = z.infer<typeof updateJurnalSchema>
export type CommentData = z.infer<typeof commentSchema>
```

### 3. Absensi Validation
**File**: `lib/validations/absensi.ts`
```typescript
import { z } from 'zod'

export const submitAbsensiSchema = z.object({
  pin: z.string().length(6, 'PIN harus 6 digit')
})

export type SubmitAbsensiData = z.infer<typeof submitAbsensiSchema>
```

### 4. Admin Validation
**File**: `lib/validations/admin.ts`
```typescript
import { z } from 'zod'

export const createUserSchema = z.object({
  email: z.string().email('Email tidak valid'),
  username: z.string().min(3, 'Username minimal 3 karakter'),
  name: z.string().min(1, 'Nama wajib diisi'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  role: z.enum(['STUDENT', 'TEACHER', 'ADMIN']),
  // Student specific
  nisn: z.string().optional(),
  kelas: z.string().optional(),
  jurusan: z.string().optional(),
  // Teacher specific
  nip: z.string().optional()
})

export const createTempatPklSchema = z.object({
  nama: z.string().min(1, 'Nama tempat PKL wajib diisi'),
  alamat: z.string().min(1, 'Alamat wajib diisi'),
  telepon: z.string().optional(),
  email: z.string().email('Email tidak valid').optional(),
  namaContact: z.string().optional()
})

export type CreateUserData = z.infer<typeof createUserSchema>
export type CreateTempatPklData = z.infer<typeof createTempatPklSchema>
```

---

## 🚀 Implementation Priority

### Phase 1: Critical (Week 1)
1. **Create folder structure** (Day 1)
2. **Move components** (Day 2)
3. **Update import paths** (Day 3)
4. **Test functionality** (Day 4)

### Phase 2: High Priority (Week 2)
1. **Create custom hooks** (Day 1-2)
2. **Create type definitions** (Day 3)
3. **Create validation schemas** (Day 4)
4. **Reorganize lib files** (Day 5)

### Phase 3: Testing & Optimization (Week 3)
1. **Comprehensive testing**
2. **Performance optimization**
3. **Code review**
4. **Documentation update**

---

## 📊 Impact Assessment

### Files Affected
- **Components**: 32 files (12 to move, 20+ to update imports)
- **Library files**: 4 files to reorganize + 8 new files
- **Type files**: 1 existing + 5 new files
- **Hook files**: 0 existing + 4 new files
- **Validation files**: 0 existing + 4 new files

### Import Updates Required
- **Admin dashboard pages**: ~5 files
- **Teacher dashboard pages**: ~4 files
- **Student pages**: ~3 files
- **API routes**: ~10 files
- **Layout components**: ~21 files

### Risk Assessment
- **Low Risk**: Moving components (clear dependencies)
- **Medium Risk**: Reorganizing lib files (shared utilities)
- **High Risk**: Creating custom hooks (logic extraction)

---

## 🎯 Success Criteria

### Functional Requirements
- [ ] All existing features work correctly
- [ ] No broken imports or missing dependencies
- [ ] Build process completes successfully
- [ ] All tests pass

### Code Quality Requirements
- [ ] All components in appropriate feature folders
- [ ] Consistent import organization (absolute paths)
- [ ] Comprehensive type definitions
- [ ] Proper validation schemas
- [ ] Reusable custom hooks

### Performance Requirements
- [ ] No performance regression
- [ ] Bundle size maintained or reduced
- [ ] Fast development server startup

---

## 📞 Next Steps

1. **Review this analysis** with the development team
2. **Start with Phase 1** using the detailed migration plan
3. **Use AI assistance** for import path updates
4. **Test incrementally** after each major change
5. **Document lessons learned** for future migrations

---

**Generated**: 2024-01-15
**Estimated Effort**: 15-20 hours
**Risk Level**: Medium
**Priority**: Critical (Phase 1.1)

> 💡 **Recommendation**: Execute this migration in small, testable increments. Use the provided `FOLDER_MIGRATION_PLAN.md` for step-by-step implementation guidance.