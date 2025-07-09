# Context Engineering: Upgrade Sistem Absensi

## 📋 Overview

Dokumen ini merupakan panduan context engineering untuk upgrade sistem absensi dengan fokus pada perbaikan fitur-fitur kritis yang telah diidentifikasi melalui analisis komprehensif sistem.

## 🎯 Scope Upgrade

Upgrade ini difokuskan pada beberapa area prioritas:
- **Immediate Actions (Critical Priority)**: Timezone handling dan cache strategy
- **Short Term (High Priority)**: PIN management dan data reliability
- **Long Term (Low Priority)**: UI/UX improvements

---

## 🚨 IMMEDIATE ACTIONS (Critical Priority)

### 1. Implementasi Timezone Handling

#### 📍 Current State
- Sistem menggunakan waktu lokal browser tanpa validasi timezone server
- Periode absensi hardcoded (7-10 dan 13-17) tanpa timezone consideration
- Tidak ada konversi timezone yang proper antara client-server

#### 🎯 Target Implementation

**A. Timezone Detection & Conversion**
```typescript
// lib/utils/timezone.ts
export interface TimezoneConfig {
  serverTimezone: string
  clientTimezone: string
  offset: number
}

export function detectClientTimezone(): string
export function convertToServerTime(clientTime: Date, config: TimezoneConfig): Date
export function convertToClientTime(serverTime: Date, config: TimezoneConfig): Date
export function validateTimezoneConsistency(client: string, server: string): boolean
```

**B. Server-Database Synchronization**
```typescript
// lib/database/timezone.ts
export async function syncServerTime(): Promise<Date>
export function getServerTimezone(): string
export function formatDateForDatabase(date: Date): string
```

**C. Timezone Validation**
```typescript
// lib/validations/timezone.ts
export function validateAttendanceTime(
  clientTime: Date,
  serverTime: Date,
  allowedOffset: number = 300000 // 5 minutes
): { isValid: boolean; message?: string }
```

#### 📂 Files to Modify/Create
- `lib/utils/timezone.ts` (NEW)
- `lib/database/timezone.ts` (NEW)
- `lib/validations/timezone.ts` (NEW)
- `lib/utils/absensi.ts` (MODIFY)
- `app/absensi/actions.ts` (MODIFY)
- `components/forms/AbsensiForm.tsx` (MODIFY)

#### 🔧 Implementation Steps
1. Create timezone utility functions
2. Integrate timezone detection in AbsensiForm
3. Update server actions to handle timezone conversion
4. Add timezone validation in attendance submission
5. Update database queries to use consistent timezone

---

### 2. Perbaiki Cache Strategy

#### 📍 Current State
- Menggunakan `revalidatePath()` yang mungkin tidak efektif untuk real-time updates
- Tidak ada proper cache invalidation strategy
- Cache staleness bisa menyebabkan data tidak ter-update

#### 🎯 Target Implementation

**A. Proper Cache Invalidation**
```typescript
// lib/cache/invalidation.ts
export interface CacheInvalidationConfig {
  tags: string[]
  paths: string[]
  strategy: 'immediate' | 'delayed' | 'background'
}

export async function invalidateAttendanceCache(userId: string): Promise<void>
export async function invalidateUserCache(userId: string): Promise<void>
export function createCacheKey(type: string, identifier: string): string
```

**B. Optimized Revalidation Strategy**
```typescript
// lib/cache/revalidation.ts
export async function revalidateAttendanceData(
  userId: string,
  strategy: 'soft' | 'hard' = 'soft'
): Promise<void>

export function scheduleRevalidation(
  path: string,
  delay: number = 0
): Promise<void>
```

#### 📂 Files to Modify/Create
- `lib/cache/invalidation.ts` (NEW)
- `lib/cache/revalidation.ts` (NEW)
- `lib/cache/strategy.ts` (MODIFY)
- `app/absensi/actions.ts` (MODIFY)
- `app/dashboard/absensi/actions.ts` (MODIFY)

#### 🔧 Implementation Steps
1. Create cache invalidation utilities
2. Implement optimized revalidation strategy
3. Update server actions to use new cache strategy
4. Add cache tags for better granular control
5. Implement background cache refresh

---

## ⚡ SHORT TERM (High Priority)

### 1. Enhance PIN Management

#### 📍 Current State
- Tidak ada localStorage untuk PIN
- PIN input tidak otomatis uppercase
- Validasi PIN terlalu sederhana

#### 🎯 Target Implementation

**A. localStorage dengan Encryption**
```typescript
// lib/storage/pin.ts
export interface EncryptedPinData {
  encryptedPin: string
  timestamp: number
  expiresAt: number
}

export async function storePinSecurely(pin: string, userId: string): Promise<void>
export async function retrieveStoredPin(userId: string): Promise<string | null>
export async function clearStoredPin(userId: string): Promise<void>
export function isPinExpired(data: EncryptedPinData): boolean
```

**B. Auto-uppercase PIN Input**
```typescript
// components/forms/PinInput.tsx
export interface PinInputProps {
  value: string
  onChange: (value: string) => void
  autoUppercase?: boolean
  maxLength?: number
}

export function PinInput({ autoUppercase = true, ...props }: PinInputProps)
```

#### 📂 Files to Modify/Create
- `lib/storage/pin.ts` (NEW)
- `lib/crypto/encryption.ts` (NEW)
- `components/forms/PinInput.tsx` (NEW)
- `components/forms/AbsensiForm.tsx` (MODIFY)
- `hooks/useLocalStorage.ts` (MODIFY)

#### 🔧 Implementation Steps
1. Create PIN encryption utilities
2. Implement secure localStorage for PIN
3. Create PinInput component with auto-uppercase
4. Update AbsensiForm to use new PIN management
5. Add PIN expiration and cleanup logic

---

### 2. Improve Data Reliability

#### 📍 Current State
- Error handling terbatas untuk network issues
- Tidak ada retry mechanism untuk failed submissions
- Transaction rollback mechanisms belum optimal

#### 🎯 Target Implementation

**A. Proper Error Handling**
```typescript
// lib/errors/attendance.ts
export class AttendanceError extends AppError {
  constructor(
    message: string,
    public code: AttendanceErrorCode,
    public retryable: boolean = false
  )
}

export enum AttendanceErrorCode {
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEZONE_MISMATCH = 'TIMEZONE_MISMATCH',
  PIN_INVALID = 'PIN_INVALID',
  OUTSIDE_HOURS = 'OUTSIDE_HOURS',
  ALREADY_SUBMITTED = 'ALREADY_SUBMITTED'
}
```

**B. Transaction Rollback Mechanisms**
```typescript
// lib/database/attendance-transactions.ts
export async function submitAttendanceWithRollback(
  data: AttendanceSubmissionData
): Promise<AttendanceResult>

export async function rollbackAttendanceSubmission(
  submissionId: string
): Promise<void>

export function createAttendanceTransaction(
  operations: AttendanceOperation[]
): Promise<TransactionResult>
```

#### 📂 Files to Modify/Create
- `lib/errors/attendance.ts` (NEW)
- `lib/database/attendance-transactions.ts` (NEW)
- `lib/retry/mechanism.ts` (NEW)
- `app/absensi/actions.ts` (MODIFY)
- `hooks/useAbsensi.ts` (MODIFY)

#### 🔧 Implementation Steps
1. Create attendance-specific error classes
2. Implement retry mechanism for failed submissions
3. Enhance transaction rollback capabilities
4. Update server actions with better error handling
5. Add proper error feedback in UI components

---

## 🎨 LONG TERM (Low Priority)

### 1. UI/UX Improvements

#### 📍 Current State
- Beberapa komponen tidak memiliki loading state yang jelas
- Feedback untuk user action masih terbatas

#### 🎯 Target Implementation

**A. Better Loading States**
```typescript
// components/ui/loading-states.tsx
export interface LoadingStateProps {
  type: 'spinner' | 'skeleton' | 'pulse'
  size: 'sm' | 'md' | 'lg'
  message?: string
}

export function AttendanceLoadingState(props: LoadingStateProps)
export function PinInputLoadingState(props: LoadingStateProps)
```

**B. Enhanced Feedback System**
```typescript
// components/feedback/attendance-feedback.tsx
export interface FeedbackProps {
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function AttendanceFeedback(props: FeedbackProps)
```

#### 📂 Files to Modify/Create
- `components/ui/loading-states.tsx` (NEW)
- `components/feedback/attendance-feedback.tsx` (NEW)
- `components/forms/AbsensiForm.tsx` (MODIFY)
- `hooks/useAbsensi.ts` (MODIFY)

#### 🔧 Implementation Steps
1. Create loading state components
2. Implement feedback system
3. Update AbsensiForm with better UX
4. Add loading states to all async operations
5. Enhance user feedback throughout the flow

---

## 📊 Implementation Timeline

### Phase 1: Critical Fixes (Week 1-2)
- [ ] Timezone handling implementation
- [ ] Cache strategy optimization
- [ ] Basic error handling improvements

### Phase 2: High Priority Features (Week 3-4)
- [ ] PIN management enhancement
- [ ] Data reliability improvements
- [ ] Transaction rollback mechanisms

### Phase 3: UX Enhancements (Week 5-6)
- [ ] Loading states implementation
- [ ] Feedback system enhancement
- [ ] Overall UX polish

---

## 🧪 Testing Strategy

### Unit Tests
- Timezone conversion functions
- PIN encryption/decryption
- Cache invalidation logic
- Error handling mechanisms

### Integration Tests
- Attendance submission flow
- Cache revalidation process
- Transaction rollback scenarios
- Timezone consistency validation

### E2E Tests
- Complete attendance flow
- Error recovery scenarios
- Cross-timezone submissions
- PIN management workflow

---

## 📈 Success Metrics

### Performance Metrics
- Attendance submission success rate: >99%
- Cache hit ratio: >85%
- Average response time: <500ms
- Error recovery rate: >95%

### User Experience Metrics
- PIN input error rate: <5%
- Timezone-related issues: <1%
- User satisfaction score: >4.5/5
- Support ticket reduction: >50%

---

## 🔄 Rollback Plan

Setiap fase implementasi harus memiliki rollback plan:

1. **Database migrations**: Reversible migrations
2. **Feature flags**: Gradual rollout dengan toggle
3. **Cache strategy**: Fallback ke strategy lama
4. **Error handling**: Graceful degradation

---

## 📚 Documentation Updates

Setelah implementasi, update dokumentasi berikut:
- API documentation
- User manual
- Developer guide
- Troubleshooting guide

---

*Dokumen ini akan diupdate seiring dengan progress implementasi upgrade sistem absensi.*