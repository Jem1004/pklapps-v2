# Coding Standards - Jurnal PKL SMK

## 📋 Konvensi Penamaan

### 1. File dan Folder
- **Komponen React**: PascalCase (`UserProfile.tsx`, `StudentLayout.tsx`)
- **Pages (App Router)**: lowercase (`page.tsx`, `layout.tsx`, `loading.tsx`)
- **Utilities**: camelCase (`formatDate.ts`, `validateForm.ts`)
- **Constants**: UPPER_SNAKE_CASE (`API_ENDPOINTS.ts`, `DEFAULT_VALUES.ts`)
- **Types**: PascalCase (`UserTypes.ts`, `ApiTypes.ts`)
- **Hooks**: camelCase dengan prefix 'use' (`useAuth.ts`, `useLocalStorage.ts`)

### 2. Variabel dan Fungsi
- **Variabel**: camelCase (`userName`, `isLoading`, `studentData`)
- **Fungsi**: camelCase (`handleSubmit`, `validateInput`, `fetchUserData`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`, `API_BASE_URL`)
- **Boolean**: prefix dengan 'is', 'has', 'can', 'should' (`isVisible`, `hasPermission`)

### 3. Komponen dan Interface
- **React Components**: PascalCase (`StudentCard`, `AbsensiForm`)
- **Interfaces**: PascalCase dengan suffix 'Props' atau deskriptif (`UserProps`, `ApiResponse`)
- **Types**: PascalCase (`UserRole`, `AbsensiStatus`)
- **Enums**: PascalCase (`UserRole`, `AbsensiType`)

## 🏗️ Struktur Komponen

### Template Komponen React
```typescript
'use client' // jika diperlukan

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
// External imports
// Internal imports
// UI components
// Utils
// Types

interface ComponentNameProps {
  // Props definition
}

export default function ComponentName({ prop1, prop2 }: ComponentNameProps) {
  // State declarations
  // Hooks
  // Event handlers
  // Effects
  // Render helpers
  
  return (
    // JSX
  )
}

// Named exports if needed
export { type ComponentNameProps }
```

## 📁 Struktur Folder

```
app/
├── (auth)/
│   ├── login/
│   └── register/
├── dashboard/
│   ├── admin/
│   ├── guru/
│   └── student/
└── api/

components/
├── ui/           # Shadcn components
├── layout/       # Layout components
├── forms/        # Form components
└── common/       # Reusable components

lib/
├── utils.ts      # Utility functions
├── auth.ts       # Auth configuration
├── db.ts         # Database connection
└── validations.ts # Zod schemas

types/
├── auth.ts       # Auth types
├── user.ts       # User types
└── api.ts        # API types
```

## 🎯 Best Practices

### 1. Import Organization
```typescript
// 1. React imports
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// 2. External library imports
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'

// 3. Internal imports (absolute paths)
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { UserRole } from '@/types/auth'

// 4. Relative imports
import './styles.css'
```

### 2. State Management
```typescript
// ✅ Good: Descriptive state names
const [isLoading, setIsLoading] = useState(false)
const [userData, setUserData] = useState<User | null>(null)
const [formErrors, setFormErrors] = useState<Record<string, string>>({})

// ❌ Bad: Generic names
const [data, setData] = useState(null)
const [loading, setLoading] = useState(false)
```

### 3. Event Handlers
```typescript
// ✅ Good: Descriptive handler names
const handleFormSubmit = async (data: FormData) => {
  // Implementation
}

const handleUserDelete = (userId: string) => {
  // Implementation
}

// ❌ Bad: Generic names
const onClick = () => {}
const onSubmit = () => {}
```

### 4. TypeScript Usage
```typescript
// ✅ Good: Proper typing
interface StudentProps {
  student: {
    id: string
    name: string
    email: string
    role: UserRole
  }
  onUpdate: (student: Student) => void
  className?: string
}

// ❌ Bad: Any types
interface StudentProps {
  student: any
  onUpdate: any
}
```

## 🌐 Bahasa dan Terminologi

### Konsistensi Bahasa
- **UI Text**: Bahasa Indonesia (`"Masuk"`, `"Daftar"`, `"Simpan"`)
- **Code**: Bahasa Inggris (`handleSubmit`, `isLoading`, `userData`)
- **Comments**: Bahasa Indonesia untuk business logic, Inggris untuk technical
- **Error Messages**: Bahasa Indonesia untuk user-facing, Inggris untuk developer

### Terminologi Standar
- **Absensi** (bukan Absen)
- **Jurnal** (bukan Journal)
- **Siswa** (bukan Student dalam UI)
- **Guru** (bukan Teacher dalam UI)
- **Admin** (konsisten)

## 🔧 ESLint Rules

### Aturan Wajib
- `@typescript-eslint/no-unused-vars`: Error
- `@typescript-eslint/no-explicit-any`: Warning
- `@typescript-eslint/strict-boolean-expressions`: Error
- `@typescript-eslint/no-unsafe-assignment`: Error
- `@typescript-eslint/no-unsafe-call`: Error
- `@typescript-eslint/no-unsafe-member-access`: Error
- `@typescript-eslint/no-unsafe-return`: Error
- `prefer-const`: Error
- `no-var`: Error
- `eqeqeq`: Error
- `@next/next/no-img-element`: Error
- `@next/next/no-html-link-for-pages`: Error

### Aturan Direkomendasikan
- Gunakan `const` untuk nilai yang tidak berubah
- Gunakan `let` untuk nilai yang berubah
- Hindari `var`
- Gunakan `===` dan `!==` instead of `==` dan `!=`
- Gunakan optional chaining (`?.`) dan nullish coalescing (`??`)
- Gunakan `Image` dari `next/image` instead of `<img>`
- Gunakan `Link` dari `next/link` untuk internal navigation
- Hindari `any` type, gunakan `unknown` jika diperlukan

### Next.js Specific Rules
- `@next/next/no-async-client-component`: Error
- `@next/next/no-before-interactive-script-outside-document`: Error
- `@next/next/no-css-tags`: Error
- `@next/next/no-head-element`: Error
- `@next/next/no-sync-scripts`: Error

## 📝 Dokumentasi

### JSDoc untuk Fungsi Kompleks
```typescript
/**
 * Menghitung total jam PKL berdasarkan data absensi
 * @param absensiData - Array data absensi siswa
 * @param startDate - Tanggal mulai perhitungan
 * @param endDate - Tanggal akhir perhitungan
 * @returns Total jam dalam format decimal
 */
function calculateTotalHours(
  absensiData: AbsensiRecord[],
  startDate: Date,
  endDate: Date
): number {
  // Implementation
}
```

### README untuk Setiap Feature
Setiap folder feature harus memiliki README.md yang menjelaskan:
- Tujuan feature
- Komponen utama
- API endpoints yang digunakan
- Dependencies

## ⚙️ TypeScript Configuration

### Strict Mode Configuration
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### Type Safety Best Practices
```typescript
// ✅ Good: Explicit typing
interface UserData {
  id: string
  name: string
  email: string | null
}

// ✅ Good: Type guards
function isString(value: unknown): value is string {
  return typeof value === 'string'
}

// ✅ Good: Utility types
type PartialUser = Partial<UserData>
type RequiredUser = Required<UserData>
type UserEmail = Pick<UserData, 'email'>

// ❌ Bad: Any types
const userData: any = fetchUser()

// ❌ Bad: Non-null assertion without checks
const email = user.email!
```

## 🏗️ Next.js App Router Best Practices

### Server vs Client Components
```typescript
// ✅ Server Component (default)
export default async function ServerPage() {
  const data = await fetch('https://api.example.com/data')
  return <div>{/* Server-rendered content */}</div>
}

// ✅ Client Component (when needed)
'use client'
import { useState } from 'react'

export default function ClientComponent() {
  const [state, setState] = useState(false)
  return <button onClick={() => setState(!state)}>Toggle</button>
}

// ✅ Server-only code protection
import 'server-only'

export async function getSecretData() {
  // This code will never run on client
  return process.env.SECRET_KEY
}
```

### Data Fetching Patterns
```typescript
// ✅ Server Component data fetching
async function getData() {
  const res = await fetch('https://api.example.com/data', {
    cache: 'no-store' // or 'force-cache' for static
  })
  
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  
  return res.json()
}

// ✅ Type-safe data fetching
interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

async function fetchTypedData<T>(): Promise<ApiResponse<T>> {
  // Implementation with proper error handling
}
```

### Loading and Error Handling
```typescript
// app/dashboard/loading.tsx
export default function Loading() {
  return <div>Loading dashboard...</div>
}

// app/dashboard/error.tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
```

## 🚀 Performance Guidelines

### 1. Component Optimization
- Gunakan `React.memo()` untuk komponen yang sering re-render
- Gunakan `useMemo()` dan `useCallback()` untuk expensive operations
- Lazy load komponen yang tidak immediately visible
- Gunakan `Suspense` boundaries untuk progressive loading

### 2. Bundle Optimization
- Dynamic imports untuk route-based code splitting
- Optimize images dengan Next.js Image component
- Minimize bundle size dengan tree shaking
- Gunakan `next/dynamic` untuk lazy loading components

### 3. Database Queries
- Gunakan Prisma select untuk field yang diperlukan saja
- Implement pagination untuk large datasets
- Use database indexes untuk frequently queried fields
- Implement proper caching strategies

### 4. Next.js Specific Optimizations
```typescript
// ✅ Image optimization
import Image from 'next/image'

<Image
  src="/profile.jpg"
  alt="Profile"
  width={500}
  height={300}
  priority // for above-the-fold images
/>

// ✅ Font optimization
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

// ✅ Dynamic imports
const DynamicComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false // if component should only render on client
})
```

## 🔒 Security Guidelines

### 1. Authentication
- Gunakan NextAuth.js untuk authentication
- Implement proper session management
- Validate user permissions pada setiap protected route
- Gunakan secure session cookies dengan proper flags

### 2. Data Validation
- Validate semua input dari client
- Gunakan Zod untuk schema validation
- Sanitize data sebelum database operations
- Implement rate limiting untuk API endpoints

### 3. Environment Variables
```typescript
// ✅ Server-side environment variables
const DATABASE_URL = process.env.DATABASE_URL
const JWT_SECRET = process.env.JWT_SECRET

// ✅ Client-side environment variables (public)
const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL

// ✅ Environment validation
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  NEXT_PUBLIC_API_URL: z.string().url(),
})

const env = envSchema.parse(process.env)

// ❌ Bad: Exposing secrets to client
const API_KEY = process.env.API_KEY // This will be undefined on client
```

### 4. Server Actions Security
```typescript
// ✅ Secure server action
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function deletePost(formData: FormData) {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/login')
  }
  
  const postId = formData.get('postId') as string
  
  // Validate ownership
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { authorId: true }
  })
  
  if (post?.authorId !== session.user.id) {
    throw new Error('Unauthorized')
  }
  
  await prisma.post.delete({ where: { id: postId } })
}
```

### 5. Middleware Security
```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Security headers
  const response = NextResponse.next()
  
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  
  // Authentication check
  const token = request.cookies.get('session-token')
  
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```

### 6. API Route Security
```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'

export async function GET(request: NextRequest) {
  // Rate limiting
  const identifier = request.ip ?? 'anonymous'
  const { success } = await rateLimit.limit(identifier)
  
  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    )
  }
  
  // Authentication
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  // Implementation
}
```

## 🚀 Roadmap Upgrade Sistem

### Phase 1: Foundation & Structure (Prioritas Tinggi)

#### 1.1 Reorganisasi Folder Structure
```
app/
├── (auth)/
│   └── login/
├── (dashboard)/
│   ├── admin/
│   ├── guru/
│   └── student/
├── absensi/
├── jurnal/
└── api/
    ├── auth/
    ├── absensi/
    ├── jurnal/
    └── admin/

components/
├── ui/              # Shadcn components
├── layout/          # Layout components
├── features/        # Feature-specific components
│   ├── absensi/
│   ├── jurnal/
│   ├── admin/
│   └── guru/
├── forms/           # Reusable form components
└── common/          # Shared components

lib/
├── auth/            # Auth utilities
├── database/        # Database utilities
├── validations/     # Zod schemas
├── constants/       # App constants
└── utils/           # General utilities

hooks/
├── useAuth.ts
├── useAbsensi.ts
├── useJurnal.ts
└── useLocalStorage.ts

types/
├── auth.ts
├── user.ts
├── absensi.ts
├── jurnal.ts
└── api.ts
```

#### 1.2 Custom Hooks Implementation
```typescript
// hooks/useAbsensi.ts
export function useAbsensi() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [recentAbsensi, setRecentAbsensi] = useState<AbsensiRecord[]>([])
  
  const submitAbsensi = async (pin: string) => {
    // Implementation with proper error handling
  }
  
  return { isSubmitting, recentAbsensi, submitAbsensi }
}

// hooks/useJurnal.ts
export function useJurnal() {
  const [journals, setJournals] = useState<JurnalRecord[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  const createJurnal = async (data: CreateJurnalData) => {
    // Implementation
  }
  
  return { journals, isLoading, createJurnal }
}
```

#### 1.3 Centralized Error Handling
```typescript
// lib/errors/errorHandler.ts
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
  }
}

// components/common/ErrorBoundary.tsx
export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  // Implementation with proper error logging
}
```

### Phase 2: Performance & UX Enhancement (Prioritas Sedang)

#### 2.1 Loading States & Skeleton UI
```typescript
// components/ui/skeleton.tsx
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

// app/dashboard/loading.tsx
export default function DashboardLoading() {
  return <DashboardSkeleton />
}
```

#### 2.2 Optimistic Updates
```typescript
// hooks/useOptimisticJurnal.ts
export function useOptimisticJurnal() {
  const [optimisticJournals, addOptimisticJournal] = useOptimistic(
    journals,
    (state, newJournal) => [...state, newJournal]
  )
  
  return { optimisticJournals, addOptimisticJournal }
}
```

#### 2.3 Real-time Updates dengan WebSocket
```typescript
// lib/websocket/client.ts
export class WebSocketClient {
  private ws: WebSocket | null = null
  
  connect(userId: string) {
    // WebSocket connection for real-time updates
  }
  
  subscribe(event: string, callback: (data: any) => void) {
    // Event subscription
  }
}
```

### Phase 3: Advanced Features (Prioritas Rendah)

#### 3.1 Offline Support dengan PWA
```typescript
// lib/offline/syncManager.ts
export class SyncManager {
  private queue: SyncItem[] = []
  
  addToQueue(item: SyncItem) {
    // Add to sync queue when offline
  }
  
  syncWhenOnline() {
    // Sync queued items when back online
  }
}
```

#### 3.2 Advanced Analytics
```typescript
// lib/analytics/tracker.ts
export class AnalyticsTracker {
  track(event: string, properties?: Record<string, any>) {
    // Track user interactions and system usage
  }
  
  trackPageView(page: string) {
    // Track page views
  }
}
```

#### 3.3 Notification System
```typescript
// lib/notifications/manager.ts
export class NotificationManager {
  async requestPermission() {
    // Request browser notification permission
  }
  
  sendNotification(title: string, options?: NotificationOptions) {
    // Send browser notifications
  }
}
```

### Phase 4: Security & Monitoring (Ongoing)

#### 4.1 Enhanced Security
```typescript
// middleware.ts - Enhanced
export function middleware(request: NextRequest) {
  // Rate limiting
  // CSRF protection
  // Security headers
  // Request logging
}

// lib/security/rateLimiter.ts
export class RateLimiter {
  async checkLimit(identifier: string, limit: number, window: number) {
    // Implement rate limiting logic
  }
}
```

#### 4.2 Monitoring & Logging
```typescript
// lib/monitoring/logger.ts
export class Logger {
  info(message: string, meta?: Record<string, any>) {
    // Structured logging
  }
  
  error(error: Error, context?: Record<string, any>) {
    // Error logging with context
  }
}

// lib/monitoring/metrics.ts
export class MetricsCollector {
  recordMetric(name: string, value: number, tags?: Record<string, string>) {
    // Collect application metrics
  }
}
```

## 🎯 Implementation Priority

### Critical (Segera)
1. **Folder Structure Reorganization** - Pindahkan file sesuai struktur baru
2. **Custom Hooks** - Extract logic dari komponen ke hooks
3. **Error Handling** - Implement centralized error handling
4. **Type Safety** - Perbaiki semua `any` types

### High (1-2 Minggu)
1. **Loading States** - Tambahkan skeleton UI dan loading indicators
2. **Form Validation** - Standardisasi dengan Zod schemas
3. **API Response Standardization** - Uniform API response format
4. **Database Optimization** - Add indexes dan optimize queries

### Medium (1 Bulan)
1. **Performance Optimization** - Implement React.memo, useMemo, useCallback
2. **Real-time Features** - WebSocket untuk live updates
3. **Offline Support** - Basic PWA functionality
4. **Advanced UI Components** - Rich text editor, file upload, etc.

### Low (Future)
1. **Analytics Integration** - User behavior tracking
2. **Advanced Notifications** - Push notifications
3. **Mobile App** - React Native atau Capacitor
4. **Advanced Reporting** - Charts dan export features

## 📊 Success Metrics

### Performance
- **Page Load Time**: < 2 detik
- **First Contentful Paint**: < 1.5 detik
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3 detik

### User Experience
- **Error Rate**: < 1%
- **User Satisfaction**: > 4.5/5
- **Task Completion Rate**: > 95%
- **Mobile Usability**: 100% responsive

### Code Quality
- **Test Coverage**: > 80%
- **TypeScript Coverage**: 100%
- **ESLint Errors**: 0
- **Bundle Size**: < 500KB gzipped

---

**Note**: Dokumen ini akan diupdate seiring dengan perkembangan proyek. Pastikan untuk mengikuti standar ini dalam semua kontribusi kode.