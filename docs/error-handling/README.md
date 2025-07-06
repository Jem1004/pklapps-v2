# Centralized Error Handling System

Sistem penanganan error terpusat yang menyediakan error handling yang konsisten, logging dengan context, pesan error yang user-friendly, dan mekanisme recovery di seluruh aplikasi.

## 📋 Overview

Sistem error handling ini terdiri dari beberapa komponen utama:

- **AppError Classes**: Custom error types untuk berbagai skenario
- **ErrorLogger**: Service untuk logging error dengan context
- **ErrorBoundary**: React component untuk menangkap error di component tree
- **Error Utilities**: Helper functions untuk handling error umum
- **useErrorHandling Hook**: React hook untuk error handling

## 🏗️ Architecture

```
lib/errors/
├── AppError.ts          # Custom error classes
├── ErrorLogger.ts       # Error logging service
├── errorUtils.ts        # Utility functions
└── index.ts            # Module exports

components/common/
└── ErrorBoundary.tsx    # Error boundary component

hooks/
└── useErrorHandling.ts  # Error handling hook
```

## 🚀 Quick Start

### 1. Basic Error Handling

```typescript
import { useErrorHandling } from '@/hooks';
import { AppError, ErrorType } from '@/lib/errors';

function MyComponent() {
  const { handleError, showError, showSuccess } = useErrorHandling({
    component: 'MyComponent'
  });

  const handleSubmit = async () => {
    try {
      await submitData();
      showSuccess('Data berhasil disimpan!');
    } catch (error) {
      handleError(error, 'submit_data');
    }
  };

  return (
    <button onClick={handleSubmit}>
      Submit
    </button>
  );
}
```

### 2. Using Error Boundary

```typescript
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary level="page" maxRetries={3}>
      <MyComponent />
    </ErrorBoundary>
  );
}
```

### 3. API Error Handling

```typescript
import { handleApiError, safeAsync } from '@/lib/errors';

async function fetchData() {
  const response = await fetch('/api/data');
  
  if (!response.ok) {
    await handleApiError(response, {
      component: 'DataFetcher',
      action: 'fetch_data'
    });
  }
  
  return response.json();
}

// Or using safeAsync
const data = await safeAsync(
  () => fetchData(),
  { component: 'DataFetcher', action: 'fetch_data' }
);
```

## 📚 API Reference

### AppError Classes

#### Base AppError
```typescript
class AppError extends Error {
  constructor({
    message: string;
    type?: ErrorType;
    severity?: ErrorSeverity;
    context?: ErrorContext;
    userMessage?: string;
    recoveryActions?: RecoveryAction[];
    isRetryable?: boolean;
    cause?: Error;
  })
}
```

#### Specialized Error Classes
- `ValidationError`: For form validation errors
- `AuthenticationError`: For authentication failures
- `AuthorizationError`: For permission denied errors
- `NetworkError`: For network-related errors
- `DatabaseError`: For database operation errors
- `BusinessLogicError`: For business rule violations

### Error Types
```typescript
enum ErrorType {
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NOT_FOUND = 'NOT_FOUND',
  NETWORK = 'NETWORK',
  DATABASE = 'DATABASE',
  BUSINESS_LOGIC = 'BUSINESS_LOGIC',
  EXTERNAL_API = 'EXTERNAL_API',
  UNKNOWN = 'UNKNOWN'
}
```

### Error Severity
```typescript
enum ErrorSeverity {
  LOW = 'LOW',        // Minor issues, warnings
  MEDIUM = 'MEDIUM',  // Standard errors
  HIGH = 'HIGH',      // Serious errors
  CRITICAL = 'CRITICAL' // System-critical errors
}
```

### useErrorHandling Hook

```typescript
const {
  error,              // Current error state
  isError,            // Boolean error state
  clearError,         // Clear current error
  handleError,        // Handle any error
  handleAsyncError,   // Handle async operations
  showError,          // Show error toast
  showSuccess,        // Show success toast
  retryOperation,     // Retry with backoff
  createContext       // Create error context
} = useErrorHandling({
  component: 'ComponentName',
  enableToasts: true,
  enableLogging: true,
  defaultRetries: 3
});
```

### ErrorBoundary Props

```typescript
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: AppError | Error, retry: () => void) => ReactNode;
  onError?: (error: AppError | Error, errorInfo: ErrorInfo) => void;
  maxRetries?: number;
  showErrorDetails?: boolean;
  level?: 'page' | 'section' | 'component';
}
```

## 🛠️ Usage Examples

### 1. Form Validation

```typescript
import { useFormErrorHandling } from '@/hooks';
import { ValidationError } from '@/lib/errors';

function LoginForm() {
  const { handleError, clearError } = useFormErrorHandling('LoginForm');
  
  const validateForm = (data: LoginData) => {
    const errors: Record<string, string[]> = {};
    
    if (!data.email) {
      errors.email = ['Email wajib diisi'];
    }
    
    if (!data.password) {
      errors.password = ['Password wajib diisi'];
    }
    
    if (Object.keys(errors).length > 0) {
      throw new ValidationError(
        'Form validation failed',
        { component: 'LoginForm', action: 'validate' }
      );
    }
  };
  
  const handleSubmit = async (data: LoginData) => {
    try {
      clearError();
      validateForm(data);
      await login(data);
    } catch (error) {
      handleError(error, 'submit_login');
    }
  };
}
```

### 2. API Integration

```typescript
import { useApiErrorHandling } from '@/hooks';
import { retryWithBackoff } from '@/lib/errors';

function DataComponent() {
  const { handleAsyncError, retryOperation } = useApiErrorHandling('DataComponent');
  const [data, setData] = useState(null);
  
  const fetchData = async () => {
    const result = await handleAsyncError(
      () => fetch('/api/data').then(res => res.json()),
      'fetch_data'
    );
    
    if (result) {
      setData(result);
    }
  };
  
  const retryFetch = () => {
    retryOperation(fetchData, 3);
  };
  
  useEffect(() => {
    fetchData();
  }, []);
}
```

### 3. Critical Operations

```typescript
import { useCriticalErrorHandling } from '@/hooks';
import { DatabaseError } from '@/lib/errors';

function PaymentComponent() {
  const { handleError, retryOperation } = useCriticalErrorHandling('PaymentComponent');
  
  const processPayment = async (paymentData: PaymentData) => {
    try {
      const result = await retryOperation(
        () => submitPayment(paymentData),
        5 // More retries for critical operations
      );
      
      if (result) {
        // Handle success
      }
    } catch (error) {
      // Critical errors are automatically logged and shown
      handleError(error, 'process_payment');
    }
  };
}
```

### 4. Custom Error Boundary

```typescript
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

function CustomErrorFallback(error: AppError, retry: () => void) {
  return (
    <div className="error-container">
      <h2>Oops! Something went wrong</h2>
      <p>{error.userMessage}</p>
      <button onClick={retry}>Try Again</button>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary
      level="page"
      maxRetries={3}
      fallback={CustomErrorFallback}
      onError={(error, errorInfo) => {
        // Custom error handling
        console.log('Custom error handler:', error);
      }}
    >
      <MyApp />
    </ErrorBoundary>
  );
}
```

## 🔧 Configuration

### Environment Variables

```env
# Error logging configuration
NEXT_PUBLIC_ERROR_LOGGING_ENDPOINT=https://api.example.com/errors
NEXT_PUBLIC_ERROR_LOGGING_API_KEY=your-api-key

# Environment
NODE_ENV=production
```

### Error Logger Configuration

```typescript
import { errorLogger } from '@/lib/errors';

// Update configuration
errorLogger.updateConfig({
  enableRemoteLogging: true,
  remoteEndpoint: 'https://your-logging-service.com/api/errors',
  apiKey: 'your-api-key',
  maxLocalStorageEntries: 200
});
```

## 🧪 Testing

### Testing Error Handling

```typescript
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { AppError, ErrorType } from '@/lib/errors';

function ThrowError() {
  throw new AppError({
    message: 'Test error',
    type: ErrorType.VALIDATION,
    userMessage: 'Test user message'
  });
}

test('ErrorBoundary catches and displays errors', () => {
  render(
    <ErrorBoundary>
      <ThrowError />
    </ErrorBoundary>
  );
  
  expect(screen.getByText('Test user message')).toBeInTheDocument();
});
```

### Testing useErrorHandling Hook

```typescript
import { renderHook, act } from '@testing-library/react';
import { useErrorHandling } from '@/hooks';
import { AppError, ErrorType } from '@/lib/errors';

test('useErrorHandling handles errors correctly', () => {
  const { result } = renderHook(() => useErrorHandling({
    component: 'TestComponent'
  }));
  
  const testError = new AppError({
    message: 'Test error',
    type: ErrorType.VALIDATION
  });
  
  act(() => {
    result.current.handleError(testError, 'test_action');
  });
  
  expect(result.current.isError).toBe(true);
  expect(result.current.error).toBe(testError);
});
```

## 📊 Monitoring & Analytics

### Error Metrics

Sistem error handling menyediakan metrics berikut:

- **Error Rate**: Jumlah error per periode waktu
- **Error Types**: Distribusi jenis error
- **Error Severity**: Distribusi tingkat keparahan
- **Recovery Success Rate**: Tingkat keberhasilan recovery actions
- **User Impact**: Error yang mempengaruhi user experience

### Accessing Logs

```typescript
import { errorLogger } from '@/lib/errors';

// Get local logs
const logs = errorLogger.getLocalStorageLogs();

// Export logs
const exportedLogs = errorLogger.exportLogs();

// Clear logs
errorLogger.clearLocalStorageLogs();
```

## 🔒 Security Considerations

1. **Sensitive Data**: Jangan log informasi sensitif dalam error context
2. **Error Messages**: Pastikan error messages tidak mengekspos informasi sistem internal
3. **Remote Logging**: Gunakan HTTPS dan authentication untuk remote logging
4. **Rate Limiting**: Implementasi rate limiting untuk mencegah spam error logs

## 🚀 Best Practices

1. **Consistent Error Handling**: Gunakan sistem ini di seluruh aplikasi
2. **Meaningful Context**: Sediakan context yang berguna untuk debugging
3. **User-Friendly Messages**: Tulis pesan error yang mudah dipahami user
4. **Recovery Actions**: Sediakan cara untuk user recover dari error
5. **Monitoring**: Monitor error patterns untuk improvement
6. **Testing**: Test error scenarios secara regular

## 🔄 Migration Guide

### From Manual Error Handling

```typescript
// Before
try {
  await operation();
} catch (error) {
  console.error(error);
  toast.error('Something went wrong');
}

// After
const { handleAsyncError } = useErrorHandling({ component: 'MyComponent' });

const result = await handleAsyncError(
  () => operation(),
  'operation_name'
);
```

### Adding Error Boundaries

```typescript
// Wrap components with ErrorBoundary
<ErrorBoundary level="section">
  <MyComponent />
</ErrorBoundary>
```

## 📝 Contributing

Untuk menambah atau memodifikasi error handling:

1. Tambah error types baru di `AppError.ts`
2. Update utility functions di `errorUtils.ts`
3. Test perubahan dengan comprehensive test cases
4. Update dokumentasi

## 🔗 Related Files

- [`lib/errors/AppError.ts`](../lib/errors/AppError.ts) - Custom error classes
- [`lib/errors/ErrorLogger.ts`](../lib/errors/ErrorLogger.ts) - Error logging service
- [`lib/errors/errorUtils.ts`](../lib/errors/errorUtils.ts) - Utility functions
- [`components/common/ErrorBoundary.tsx`](../components/common/ErrorBoundary.tsx) - Error boundary component
- [`hooks/useErrorHandling.ts`](../hooks/useErrorHandling.ts) - Error handling hook