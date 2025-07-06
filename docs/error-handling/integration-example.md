# Error Handling Integration Example

Contoh implementasi sistem error handling pada komponen yang sudah ada.

## 📋 Before & After Comparison

### Before: Manual Error Handling

```typescript
// app/absensi/page.tsx (Before)
'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { submitAbsensi, getRecentAbsensi } from './actions';

export default function AbsensiPage() {
  const [pin, setPin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [recentAbsensi, setRecentAbsensi] = useState([]);
  
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError('');
      
      if (!pin) {
        setError('PIN wajib diisi');
        return;
      }
      
      const result = await submitAbsensi(pin);
      
      if (result.success) {
        toast.success('Absensi berhasil!');
        setPin('');
        loadRecentAbsensi();
      } else {
        setError(result.message || 'Gagal submit absensi');
        toast.error(result.message || 'Gagal submit absensi');
      }
    } catch (error) {
      console.error('Submit absensi error:', error);
      const errorMessage = 'Terjadi kesalahan saat submit absensi';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const loadRecentAbsensi = async () => {
    try {
      const result = await getRecentAbsensi();
      if (result.success) {
        setRecentAbsensi(result.data);
      } else {
        console.error('Failed to load recent absensi:', result.message);
        toast.error('Gagal memuat data absensi');
      }
    } catch (error) {
      console.error('Load recent absensi error:', error);
      toast.error('Gagal memuat data absensi');
    }
  };
  
  useEffect(() => {
    loadRecentAbsensi();
  }, []);
  
  return (
    <div>
      {error && (
        <div className="text-red-500 mb-4">{error}</div>
      )}
      {/* Rest of component */}
    </div>
  );
}
```

### After: Using Error Handling System

```typescript
// app/absensi/page.tsx (After)
'use client';

import { useState, useEffect } from 'react';
import { useAbsensi } from '@/hooks';
import { useApiErrorHandling } from '@/hooks';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { ValidationError, BusinessLogicError } from '@/lib/errors';

function AbsensiContent() {
  const [pin, setPin] = useState('');
  
  const {
    handleError,
    handleAsyncError,
    showSuccess,
    clearError,
    createContext
  } = useApiErrorHandling('AbsensiPage');
  
  const {
    isSubmitting,
    recentAbsensi,
    isRefreshing,
    submitAbsensi,
    refreshRecentAbsensi,
    loadRecentAbsensi
  } = useAbsensi({
    onSubmitSuccess: () => {
      showSuccess('Absensi berhasil disimpan!');
      setPin('');
      clearError();
    },
    onSubmitError: (error) => {
      handleError(error, 'submit_absensi');
    },
    onLoadError: (error) => {
      handleError(error, 'load_recent_absensi');
    }
  });
  
  const handleSubmit = async () => {
    // Validation with proper error handling
    if (!pin.trim()) {
      const validationError = new ValidationError(
        'PIN is required',
        createContext('validate_pin'),
        [{
          type: 'fallback',
          label: 'Focus PIN Input',
          action: () => {
            const pinInput = document.querySelector('[name="pin"]') as HTMLInputElement;
            if (pinInput) pinInput.focus();
          }
        }]
      );
      handleError(validationError, 'validate_pin');
      return;
    }
    
    if (pin.length !== 6) {
      const validationError = new ValidationError(
        'PIN must be 6 digits',
        createContext('validate_pin_length')
      );
      handleError(validationError, 'validate_pin_length');
      return;
    }
    
    // Submit with error handling built into the hook
    await submitAbsensi(pin);
  };
  
  const handleRefresh = async () => {
    await handleAsyncError(
      () => refreshRecentAbsensi(),
      'refresh_absensi'
    );
  };
  
  useEffect(() => {
    loadRecentAbsensi();
  }, [loadRecentAbsensi]);
  
  return (
    <div>
      {/* Component content with better error handling */}
      <button 
        onClick={handleSubmit} 
        disabled={isSubmitting}
        className="btn-primary"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Absensi'}
      </button>
      
      <button 
        onClick={handleRefresh} 
        disabled={isRefreshing}
        className="btn-secondary"
      >
        {isRefreshing ? 'Refreshing...' : 'Refresh'}
      </button>
      
      {/* Recent absensi list */}
    </div>
  );
}

export default function AbsensiPage() {
  return (
    <ErrorBoundary 
      level="page" 
      maxRetries={3}
      onError={(error, errorInfo) => {
        // Custom page-level error handling
        console.log('Page-level error in AbsensiPage:', error);
      }}
    >
      <AbsensiContent />
    </ErrorBoundary>
  );
}
```

## 🔄 Step-by-Step Migration

### Step 1: Wrap with ErrorBoundary

```typescript
// Add ErrorBoundary at page level
export default function MyPage() {
  return (
    <ErrorBoundary level="page">
      <MyPageContent />
    </ErrorBoundary>
  );
}
```

### Step 2: Replace Manual Error State

```typescript
// Before
const [error, setError] = useState('');
const [isLoading, setIsLoading] = useState(false);

// After
const { 
  handleError, 
  handleAsyncError, 
  showSuccess, 
  clearError 
} = useApiErrorHandling('ComponentName');
```

### Step 3: Replace Try-Catch Blocks

```typescript
// Before
try {
  setIsLoading(true);
  const result = await apiCall();
  if (result.success) {
    toast.success('Success!');
  } else {
    setError(result.message);
    toast.error(result.message);
  }
} catch (error) {
  console.error(error);
  setError('Something went wrong');
  toast.error('Something went wrong');
} finally {
  setIsLoading(false);
}

// After
const result = await handleAsyncError(
  () => apiCall(),
  'api_call_action'
);

if (result) {
  showSuccess('Success!');
}
```

### Step 4: Add Proper Validation

```typescript
// Before
if (!formData.email) {
  setError('Email is required');
  return;
}

// After
if (!formData.email) {
  const validationError = new ValidationError(
    'Email is required',
    createContext('validate_email'),
    [{
      type: 'fallback',
      label: 'Focus Email Field',
      action: () => {
        const emailInput = document.querySelector('[name="email"]') as HTMLInputElement;
        if (emailInput) emailInput.focus();
      }
    }]
  );
  handleError(validationError, 'validate_email');
  return;
}
```

### Step 5: Handle Business Logic Errors

```typescript
// Before
if (user.role !== 'admin') {
  toast.error('Access denied');
  return;
}

// After
if (user.role !== 'admin') {
  const authError = new AuthorizationError(
    'User does not have admin role',
    createContext('check_admin_role', { userRole: user.role })
  );
  handleError(authError, 'check_admin_role');
  return;
}
```

## 🎯 Advanced Integration Examples

### Form Component with Validation

```typescript
import { useFormErrorHandling } from '@/hooks';
import { ValidationError } from '@/lib/errors';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter')
});

function LoginForm() {
  const { handleError, showSuccess, createContext } = useFormErrorHandling('LoginForm');
  const [formData, setFormData] = useState({ email: '', password: '' });
  
  const validateForm = (data: typeof formData) => {
    try {
      loginSchema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string[]> = {};
        error.errors.forEach(err => {
          const field = err.path[0] as string;
          if (!fieldErrors[field]) fieldErrors[field] = [];
          fieldErrors[field].push(err.message);
        });
        
        const validationError = new ValidationError(
          'Form validation failed',
          createContext('validate_form', { fieldErrors }),
          Object.keys(fieldErrors).map(field => ({
            type: 'fallback' as const,
            label: `Focus ${field}`,
            action: () => {
              const input = document.querySelector(`[name="${field}"]`) as HTMLInputElement;
              if (input) input.focus();
            }
          }))
        );
        
        throw validationError;
      }
      throw error;
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      validateForm(formData);
      
      const result = await handleAsyncError(
        () => login(formData),
        'submit_login'
      );
      
      if (result) {
        showSuccess('Login berhasil!');
        // Redirect or update state
      }
    } catch (error) {
      handleError(error, 'submit_login');
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

### API Service with Error Handling

```typescript
// services/apiService.ts
import { 
  handleApiError, 
  NetworkError, 
  retryWithBackoff,
  createErrorContext 
} from '@/lib/errors';

class ApiService {
  private baseUrl: string;
  
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }
  
  async request<T>(
    endpoint: string, 
    options: RequestInit = {},
    context?: { component: string; action: string }
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const errorContext = context ? createErrorContext(
      context.component,
      context.action,
      { endpoint, method: options.method || 'GET' }
    ) : undefined;
    
    try {
      const response = await retryWithBackoff(
        () => fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            ...options.headers
          },
          ...options
        }),
        3, // maxRetries
        1000, // baseDelay
        errorContext
      );
      
      if (!response.ok) {
        await handleApiError(response, errorContext);
      }
      
      return await response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new NetworkError(
          `Network error: ${error.message}`,
          errorContext,
          () => this.request(endpoint, options, context)
        );
      }
      throw error;
    }
  }
  
  async get<T>(endpoint: string, context?: { component: string; action: string }): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' }, context);
  }
  
  async post<T>(endpoint: string, data: any, context?: { component: string; action: string }): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    }, context);
  }
}

export const apiService = new ApiService('/api');
```

### Custom Hook with Error Handling

```typescript
// hooks/useData.ts
import { useState, useEffect } from 'react';
import { useApiErrorHandling } from '@/hooks';
import { apiService } from '@/services/apiService';

interface UseDataOptions {
  endpoint: string;
  autoLoad?: boolean;
  dependencies?: any[];
}

export function useData<T>(options: UseDataOptions) {
  const { endpoint, autoLoad = true, dependencies = [] } = options;
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { handleAsyncError, retryOperation } = useApiErrorHandling('useData');
  
  const loadData = async () => {
    setIsLoading(true);
    
    const result = await handleAsyncError(
      () => apiService.get<T>(endpoint, {
        component: 'useData',
        action: 'load_data'
      }),
      'load_data'
    );
    
    if (result) {
      setData(result);
    }
    
    setIsLoading(false);
  };
  
  const retryLoad = () => {
    retryOperation(loadData, 3);
  };
  
  const refreshData = () => {
    setData(null);
    loadData();
  };
  
  useEffect(() => {
    if (autoLoad) {
      loadData();
    }
  }, dependencies);
  
  return {
    data,
    isLoading,
    loadData,
    retryLoad,
    refreshData
  };
}
```

## 📊 Benefits of Migration

### Before Migration
- ❌ Inconsistent error handling
- ❌ Manual error state management
- ❌ No error logging
- ❌ Poor user experience on errors
- ❌ Difficult to debug issues
- ❌ No recovery mechanisms

### After Migration
- ✅ Consistent error handling across app
- ✅ Automatic error state management
- ✅ Comprehensive error logging with context
- ✅ User-friendly error messages
- ✅ Easy debugging with detailed logs
- ✅ Built-in recovery mechanisms
- ✅ Better error monitoring
- ✅ Improved code maintainability

## 🚀 Next Steps

1. **Migrate Critical Components**: Start with components that handle important user actions
2. **Add Error Boundaries**: Wrap major sections with ErrorBoundary components
3. **Update API Calls**: Replace manual error handling with the new system
4. **Add Monitoring**: Set up error monitoring and alerting
5. **Train Team**: Ensure team understands the new error handling patterns

## 📝 Checklist for Migration

- [ ] Wrap page/section with ErrorBoundary
- [ ] Replace manual error state with useErrorHandling hook
- [ ] Update try-catch blocks to use handleAsyncError
- [ ] Add proper validation with ValidationError
- [ ] Implement recovery actions where appropriate
- [ ] Add error context for better debugging
- [ ] Test error scenarios
- [ ] Update documentation
- [ ] Monitor error logs