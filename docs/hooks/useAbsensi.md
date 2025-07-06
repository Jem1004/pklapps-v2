# useAbsensi Hook

Custom hook untuk mengelola state dan operasi absensi dalam aplikasi Jurnal PKL SMK.

## Overview

Hook `useAbsensi` mengekstrak semua logic state management dan API calls yang berkaitan dengan fitur absensi dari komponen React, memberikan interface yang bersih dan reusable.

## Features

- ✅ State management untuk absensi (isSubmitting, recentAbsensi, dll)
- ✅ API calls untuk submit dan load data absensi
- ✅ Error handling dan loading states
- ✅ Auto-refresh data setelah submit
- ✅ Callback functions untuk custom handling
- ✅ TypeScript support dengan type safety

## Usage

### Basic Usage

```typescript
import { useAbsensi } from '@/hooks/useAbsensi'

function AbsensiComponent() {
  const {
    isSubmitting,
    recentAbsensi,
    isRefreshing,
    hasTempatPkl,
    submitAbsensi,
    refreshRecentAbsensi,
    loadRecentAbsensi
  } = useAbsensi()

  const handleSubmit = async (pin: string) => {
    const result = await submitAbsensi(pin)
    if (result.success) {
      console.log('Absensi berhasil!')
    }
  }

  return (
    // Your component JSX
  )
}
```

### With Options

```typescript
const {
  isSubmitting,
  recentAbsensi,
  submitAbsensi,
  refreshRecentAbsensi
} = useAbsensi({
  autoLoad: true, // Auto-load data saat mount (default: true)
  onSubmitSuccess: (result) => {
    console.log('Submit berhasil:', result)
    // Custom logic setelah submit berhasil
  },
  onSubmitError: (error) => {
    console.error('Submit gagal:', error)
    // Custom error handling
  },
  onLoadError: (error) => {
    console.error('Load data gagal:', error)
    // Custom load error handling
  }
})
```

## API Reference

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `options` | `UseAbsensiOptions` | `{}` | Konfigurasi opsional untuk hook |

#### UseAbsensiOptions

```typescript
interface UseAbsensiOptions {
  autoLoad?: boolean // Auto-load data saat mount
  onSubmitSuccess?: (result: AbsensiSubmitResult) => void
  onSubmitError?: (error: string) => void
  onLoadError?: (error: string) => void
}
```

### Return Value

```typescript
interface UseAbsensiReturn {
  // State
  isSubmitting: boolean
  recentAbsensi: RecentAbsensi[]
  isRefreshing: boolean
  hasTempatPkl: boolean
  
  // Actions
  submitAbsensi: (pin: string) => Promise<AbsensiSubmitResult>
  refreshRecentAbsensi: () => Promise<void>
  loadRecentAbsensi: () => Promise<void>
}
```

#### State Properties

- **`isSubmitting`**: Boolean yang menunjukkan apakah sedang dalam proses submit absensi
- **`recentAbsensi`**: Array data absensi terbaru (5 data terakhir)
- **`isRefreshing`**: Boolean yang menunjukkan apakah sedang refresh data
- **`hasTempatPkl`**: Boolean yang menunjukkan apakah user memiliki tempat PKL

#### Action Functions

- **`submitAbsensi(pin: string)`**: Submit absensi dengan PIN
  - Parameter: `pin` - PIN absensi (string)
  - Return: `Promise<AbsensiSubmitResult>`
  - Validasi otomatis untuk PIN (minimal 4 karakter)
  - Auto-refresh data setelah submit berhasil

- **`refreshRecentAbsensi()`**: Refresh data absensi dengan loading indicator
  - Return: `Promise<void>`
  - Menampilkan toast notification

- **`loadRecentAbsensi()`**: Load data absensi tanpa loading indicator
  - Return: `Promise<void>`
  - Digunakan untuk initial load atau background refresh

## Types

### RecentAbsensi

```typescript
interface RecentAbsensi {
  id: string
  tanggal: Date
  waktu: Date
  tipe: 'MASUK' | 'PULANG'
  tempatPkl: {
    nama: string
    alamat: string
  }
}
```

### AbsensiSubmitResult

```typescript
interface AbsensiSubmitResult {
  success: boolean
  message: string
  data?: {
    tipe: 'MASUK' | 'PULANG'
    tempatPkl: string
    waktu: Date
  }
}
```

## Error Handling

Hook ini menangani error secara otomatis:

1. **Validasi Input**: PIN kosong atau kurang dari 4 karakter
2. **Network Errors**: Koneksi gagal atau timeout
3. **API Errors**: Error dari server (PIN salah, duplikasi, dll)
4. **Loading Errors**: Gagal memuat data absensi

Semua error akan:
- Ditampilkan via toast notification
- Diteruskan ke callback functions jika disediakan
- Di-log ke console untuk debugging

## Dependencies

- `react` - useState, useEffect, useCallback
- `next-auth/react` - useSession untuk autentikasi
- `sonner` - toast notifications
- `@/app/absensi/actions` - API functions
- `@/types/features/absensi` - TypeScript types

## Best Practices

1. **Gunakan callback functions** untuk custom handling:
   ```typescript
   const { submitAbsensi } = useAbsensi({
     onSubmitSuccess: () => {
       // Reset form, navigate, dll
     },
     onSubmitError: (error) => {
       // Custom error display
     }
   })
   ```

2. **Handle loading states** di UI:
   ```typescript
   const { isSubmitting, isRefreshing } = useAbsensi()
   
   return (
     <Button disabled={isSubmitting}>
       {isSubmitting ? 'Submitting...' : 'Submit'}
     </Button>
   )
   ```

3. **Gunakan auto-load** untuk komponen yang membutuhkan data langsung:
   ```typescript
   const { recentAbsensi } = useAbsensi({ autoLoad: true })
   ```

## Migration Guide

### Before (Component with inline logic)

```typescript
function AbsensiPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [recentAbsensi, setRecentAbsensi] = useState([])
  
  const handleSubmit = async (pin: string) => {
    setIsSubmitting(true)
    try {
      const result = await submitAbsensi(pin)
      // Handle result...
    } catch (error) {
      // Handle error...
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const loadData = async () => {
    // Load logic...
  }
  
  useEffect(() => {
    loadData()
  }, [])
  
  // Component JSX...
}
```

### After (Using useAbsensi hook)

```typescript
function AbsensiPage() {
  const {
    isSubmitting,
    recentAbsensi,
    submitAbsensi
  } = useAbsensi({
    onSubmitSuccess: () => {
      // Custom success handling
    }
  })
  
  const handleSubmit = async (pin: string) => {
    await submitAbsensi(pin)
  }
  
  // Component JSX...
}
```

## Related Files

- `hooks/useAbsensi.ts` - Hook implementation
- `types/features/absensi.ts` - TypeScript types
- `lib/utils/absensi.ts` - Utility functions
- `app/absensi/actions.ts` - API functions
- `app/absensi/page.tsx` - Example usage