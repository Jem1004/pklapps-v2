# Progressive Web App (PWA) Mobile Implementation Guide

## 📋 Overview

Implementasi Progressive Web App (PWA) yang dioptimalkan untuk perangkat mobile dengan fokus pada installability, responsive design, dan user experience yang native-like tanpa sistem offline dan notifikasi.

## 🎯 Objectives

- Membuat web app yang dapat diinstall di perangkat mobile
- Optimasi UI/UX untuk mobile devices
- Implementasi responsive design yang konsisten
- Meningkatkan mobile engagement hingga 2-3x
- Fast loading dan smooth navigation
- Native-like app experience

## 🏗️ PWA Architecture

### Core PWA Components
```
┌─────────────────────────────────────────────────────────────┐
│                    PWA Architecture                        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   App       │  │   Service   │  │   Web App           │ │
│  │  Manifest   │  │   Worker    │  │   Manifest          │ │
│  │             │  │             │  │                     │ │
│  │ • Metadata  │  │ • Caching   │  │ • Install Prompt    │ │
│  │ • Icons     │  │ • Background│  │ • Splash Screen     │ │
│  │ • Theme     │  │ • Updates   │  │ • Standalone Mode   │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                    Mobile Optimizations                    │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │  Responsive │  │   Touch     │  │   Performance       │ │
│  │   Design    │  │ Optimized   │  │   Optimization      │ │
│  │             │  │             │  │                     │ │
│  │ • Breakpts  │  │ • Gestures  │  │ • Code Splitting    │ │
│  │ • Flexbox   │  │ • Touch     │  │ • Lazy Loading      │ │
│  │ • Grid      │  │ • Haptics   │  │ • Image Optimization│ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 📱 Mobile-First Design System

### Phase 1: Responsive Breakpoints

#### 1.1 Tailwind Config Enhancement
```typescript
// tailwind.config.js (Enhanced)
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        'xs': '375px',      // Small phones
        'sm': '640px',      // Large phones
        'md': '768px',      // Tablets
        'lg': '1024px',     // Small laptops
        'xl': '1280px',     // Large laptops
        '2xl': '1536px',    // Desktops
        // Custom mobile breakpoints
        'mobile': {'max': '767px'},
        'tablet': {'min': '768px', 'max': '1023px'},
        'desktop': {'min': '1024px'},
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      height: {
        'screen-safe': 'calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
        'dvh': '100dvh', // Dynamic viewport height
      },
      minHeight: {
        'screen-safe': 'calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
      },
      fontSize: {
        // Mobile-optimized font sizes
        'xs-mobile': ['12px', { lineHeight: '16px' }],
        'sm-mobile': ['14px', { lineHeight: '20px' }],
        'base-mobile': ['16px', { lineHeight: '24px' }],
        'lg-mobile': ['18px', { lineHeight: '28px' }],
        'xl-mobile': ['20px', { lineHeight: '32px' }],
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
        'bounce-gentle': 'bounceGentle 0.6s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        bounceGentle: {
          '0%, 20%, 53%, 80%, 100%': { transform: 'translate3d(0,0,0)' },
          '40%, 43%': { transform: 'translate3d(0, -8px, 0)' },
          '70%': { transform: 'translate3d(0, -4px, 0)' },
          '90%': { transform: 'translate3d(0, -2px, 0)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
```

#### 1.2 Mobile-Optimized Layout Components
```typescript
// components/layout/MobileOptimizedLayout.tsx
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface MobileOptimizedLayoutProps {
  children: ReactNode
  className?: string
  withSafeArea?: boolean
  fullHeight?: boolean
}

export function MobileOptimizedLayout({
  children,
  className,
  withSafeArea = true,
  fullHeight = false
}: MobileOptimizedLayoutProps) {
  return (
    <div 
      className={cn(
        'w-full mx-auto',
        // Mobile-first responsive container
        'px-4 sm:px-6 lg:px-8',
        // Safe area handling
        withSafeArea && 'pt-safe-top pb-safe-bottom pl-safe-left pr-safe-right',
        // Full height handling
        fullHeight && 'min-h-screen-safe',
        className
      )}
    >
      {children}
    </div>
  )
}

// Mobile-optimized card component
export function MobileCard({
  children,
  className,
  padding = 'default'
}: {
  children: ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'default' | 'lg'
}) {
  const paddingClasses = {
    none: '',
    sm: 'p-3 sm:p-4',
    default: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8'
  }

  return (
    <div 
      className={cn(
        'bg-white rounded-lg shadow-sm border border-gray-200',
        'mobile:rounded-none mobile:border-x-0', // Full width on mobile
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  )
}
```

### Phase 2: PWA Manifest Implementation

#### 2.1 Web App Manifest
```json
// public/manifest.json
{
  "name": "Jurnal Absensi PKL SMK Mutu",
  "short_name": "Absensi PKL",
  "description": "Aplikasi absensi untuk siswa PKL SMK Mutu",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3b82f6",
  "orientation": "portrait-primary",
  "scope": "/",
  "lang": "id",
  "dir": "ltr",
  "categories": ["education", "productivity"],
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable any"
    }
  ],
  "screenshots": [
    {
      "src": "/screenshots/mobile-home.png",
      "sizes": "390x844",
      "type": "image/png",
      "form_factor": "narrow",
      "label": "Halaman utama aplikasi"
    },
    {
      "src": "/screenshots/mobile-absensi.png",
      "sizes": "390x844",
      "type": "image/png",
      "form_factor": "narrow",
      "label": "Form absensi"
    },
    {
      "src": "/screenshots/desktop-dashboard.png",
      "sizes": "1280x720",
      "type": "image/png",
      "form_factor": "wide",
      "label": "Dashboard desktop"
    }
  ],
  "shortcuts": [
    {
      "name": "Absensi Masuk",
      "short_name": "Masuk",
      "description": "Langsung ke form absensi masuk",
      "url": "/absensi?type=masuk",
      "icons": [
        {
          "src": "/icons/shortcut-masuk.png",
          "sizes": "96x96"
        }
      ]
    },
    {
      "name": "Absensi Pulang",
      "short_name": "Pulang",
      "description": "Langsung ke form absensi pulang",
      "url": "/absensi?type=pulang",
      "icons": [
        {
          "src": "/icons/shortcut-pulang.png",
          "sizes": "96x96"
        }
      ]
    },
    {
      "name": "Riwayat Absensi",
      "short_name": "Riwayat",
      "description": "Lihat riwayat absensi",
      "url": "/dashboard/absensi",
      "icons": [
        {
          "src": "/icons/shortcut-history.png",
          "sizes": "96x96"
        }
      ]
    }
  ]
}
```

#### 2.2 Service Worker Implementation
```typescript
// public/sw.js
const CACHE_NAME = 'absensi-pwa-v1'
const STATIC_CACHE_URLS = [
  '/',
  '/absensi',
  '/dashboard',
  '/manifest.json',
  // Add critical CSS and JS files
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching static assets')
        return cache.addAll(STATIC_CACHE_URLS)
      })
      .then(() => {
        console.log('Service Worker installed successfully')
        return self.skipWaiting()
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME)
            .map((cacheName) => caches.delete(cacheName))
        )
      })
      .then(() => {
        console.log('Service Worker activated')
        return self.clients.claim()
      })
  )
})

// Fetch event - serve from cache when possible
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return
  }

  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request)
          .then((fetchResponse) => {
            // Cache successful responses
            if (fetchResponse.status === 200) {
              const responseClone = fetchResponse.clone()
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseClone)
                })
            }
            return fetchResponse
          })
      })
      .catch(() => {
        // Return offline page for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/offline')
        }
      })
  )
})

// Handle background sync (for future use)
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag)
})

// Handle push notifications (for future use)
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event)
})
```

#### 2.3 PWA Integration in Next.js
```typescript
// app/layout.tsx (Enhanced)
import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Jurnal Absensi PKL SMK Mutu',
    template: '%s | Absensi PKL'
  },
  description: 'Aplikasi absensi untuk siswa PKL SMK Mutu',
  keywords: ['absensi', 'pkl', 'smk', 'mutu', 'siswa'],
  authors: [{ name: 'SMK Mutu' }],
  creator: 'SMK Mutu',
  publisher: 'SMK Mutu',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Absensi PKL',
    startupImage: [
      {
        url: '/splash/iphone5_splash.png',
        media: '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)'
      },
      {
        url: '/splash/iphone6_splash.png',
        media: '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)'
      },
      {
        url: '/splash/iphoneplus_splash.png',
        media: '(device-width: 621px) and (device-height: 1104px) and (-webkit-device-pixel-ratio: 3)'
      },
      {
        url: '/splash/iphonex_splash.png',
        media: '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)'
      },
      {
        url: '/splash/iphonexr_splash.png',
        media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)'
      },
      {
        url: '/splash/iphonexsmax_splash.png',
        media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)'
      },
      {
        url: '/splash/ipad_splash.png',
        media: '(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)'
      }
    ]
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Absensi PKL',
    'application-name': 'Absensi PKL',
    'msapplication-TileColor': '#3b82f6',
    'msapplication-config': '/browserconfig.xml',
    'theme-color': '#3b82f6',
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#3b82f6' },
    { media: '(prefers-color-scheme: dark)', color: '#1e40af' }
  ],
  viewportFit: 'cover'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <head>
        {/* PWA Meta Tags */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      </head>
      <body className="font-sans antialiased bg-gray-50">
        <PWAInstallPrompt />
        {children}
        <PWAUpdatePrompt />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `
          }}
        />
      </body>
    </html>
  )
}
```

### Phase 3: Mobile-Optimized Components

#### 3.1 Touch-Optimized Form Components
```typescript
// components/mobile/TouchOptimizedForm.tsx
import { useState, useRef } from 'react'
import { cn } from '@/lib/utils'

interface TouchOptimizedButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  className?: string
}

export function TouchOptimizedButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className
}: TouchOptimizedButtonProps) {
  const [isPressed, setIsPressed] = useState(false)
  
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
    danger: 'bg-red-600 hover:bg-red-700 text-white'
  }
  
  const sizes = {
    sm: 'px-4 py-2 text-sm min-h-[40px]',
    md: 'px-6 py-3 text-base min-h-[48px]',
    lg: 'px-8 py-4 text-lg min-h-[56px]'
  }
  
  return (
    <button
      className={cn(
        'rounded-lg font-medium transition-all duration-150',
        'active:scale-95 active:shadow-inner',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
        // Touch-friendly sizing
        'touch-manipulation select-none',
        variants[variant],
        sizes[size],
        isPressed && 'scale-95 shadow-inner',
        className
      )}
      disabled={disabled || loading}
      onClick={onClick}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current" />
          <span className="ml-2">Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  )
}

// Touch-optimized input component
export function TouchOptimizedInput({
  label,
  error,
  className,
  ...props
}: {
  label?: string
  error?: string
  className?: string
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mobile:text-base">
          {label}
        </label>
      )}
      <input
        className={cn(
          'w-full px-4 py-3 border border-gray-300 rounded-lg',
          'focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
          'mobile:text-base mobile:py-4', // Larger on mobile
          'transition-colors duration-150',
          error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600 mobile:text-base">{error}</p>
      )}
    </div>
  )
}
```

#### 3.2 Mobile-Optimized Absensi Form
```typescript
// components/mobile/MobileAbsensiForm.tsx
import { useState, useEffect } from 'react'
import { TouchOptimizedButton, TouchOptimizedInput } from './TouchOptimizedForm'
import { MobileCard } from '../layout/MobileOptimizedLayout'
import { useAbsensi } from '@/hooks/useAbsensi'
import { TipeAbsensi } from '@prisma/client'

export function MobileAbsensiForm() {
  const [pin, setPin] = useState('')
  const [tipe, setTipe] = useState<TipeAbsensi>('MASUK')
  const { submitAbsensi, isLoading, error } = useAbsensi()
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await submitAbsensi({ pin, tipe })
  }
  
  return (
    <MobileCard className="max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 mobile:text-2xl">
          Form Absensi
        </h2>
        <p className="text-gray-600 mt-2 mobile:text-lg">
          Pilih jenis absensi dan masukkan PIN
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tipe Absensi Selector */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 mobile:text-base">
            Jenis Absensi
          </label>
          <div className="grid grid-cols-2 gap-3">
            <TouchOptimizedButton
              type="button"
              variant={tipe === 'MASUK' ? 'primary' : 'secondary'}
              onClick={() => setTipe('MASUK')}
              className="w-full"
            >
              <div className="flex flex-col items-center py-2">
                <span className="text-2xl mb-1">🏢</span>
                <span>Masuk</span>
              </div>
            </TouchOptimizedButton>
            
            <TouchOptimizedButton
              type="button"
              variant={tipe === 'PULANG' ? 'primary' : 'secondary'}
              onClick={() => setTipe('PULANG')}
              className="w-full"
            >
              <div className="flex flex-col items-center py-2">
                <span className="text-2xl mb-1">🏠</span>
                <span>Pulang</span>
              </div>
            </TouchOptimizedButton>
          </div>
        </div>
        
        {/* PIN Input */}
        <TouchOptimizedInput
          label="PIN Absensi"
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="Masukkan PIN absensi"
          error={error}
          maxLength={6}
          inputMode="numeric"
          pattern="[0-9]*"
        />
        
        {/* Submit Button */}
        <TouchOptimizedButton
          type="submit"
          size="lg"
          disabled={!pin || pin.length < 4}
          loading={isLoading}
          className="w-full"
        >
          {isLoading ? 'Memproses...' : `Absen ${tipe}`}
        </TouchOptimizedButton>
      </form>
      
      {/* Current Time Display */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="text-center text-sm text-gray-600 mobile:text-base">
          <CurrentTimeDisplay />
        </div>
      </div>
    </MobileCard>
  )
}

function CurrentTimeDisplay() {
  const [currentTime, setCurrentTime] = useState(new Date())
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])
  
  return (
    <div>
      <div className="font-mono text-lg mobile:text-xl">
        {currentTime.toLocaleTimeString('id-ID')}
      </div>
      <div className="text-xs mobile:text-sm mt-1">
        {currentTime.toLocaleDateString('id-ID', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </div>
    </div>
  )
}
```

#### 3.3 PWA Install Prompt
```typescript
// components/pwa/PWAInstallPrompt.tsx
import { useState, useEffect } from 'react'
import { TouchOptimizedButton } from '../mobile/TouchOptimizedForm'
import { X, Download } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  
  useEffect(() => {
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    const isInWebAppiOS = (window.navigator as any).standalone === true
    
    if (isStandalone || isInWebAppiOS) {
      setIsInstalled(true)
      return
    }
    
    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      
      // Show prompt after a delay
      setTimeout(() => {
        setShowPrompt(true)
      }, 3000)
    }
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    
    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true)
      setShowPrompt(false)
      setDeferredPrompt(null)
    })
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])
  
  const handleInstallClick = async () => {
    if (!deferredPrompt) return
    
    deferredPrompt.prompt()
    
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt')
    } else {
      console.log('User dismissed the install prompt')
    }
    
    setDeferredPrompt(null)
    setShowPrompt(false)
  }
  
  const handleDismiss = () => {
    setShowPrompt(false)
    // Don't show again for this session
    sessionStorage.setItem('pwa-prompt-dismissed', 'true')
  }
  
  // Don't show if already installed or dismissed
  if (isInstalled || !showPrompt || !deferredPrompt) {
    return null
  }
  
  // Check if already dismissed this session
  if (sessionStorage.getItem('pwa-prompt-dismissed')) {
    return null
  }
  
  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mobile:bottom-safe-bottom">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 animate-slide-up">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <Download className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Install Aplikasi</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Install aplikasi Absensi PKL untuk akses yang lebih cepat dan mudah
            </p>
            <div className="flex space-x-2">
              <TouchOptimizedButton
                size="sm"
                onClick={handleInstallClick}
                className="flex-1"
              >
                Install
              </TouchOptimizedButton>
              <TouchOptimizedButton
                size="sm"
                variant="secondary"
                onClick={handleDismiss}
                className="px-3"
              >
                Nanti
              </TouchOptimizedButton>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="ml-2 p-1 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
```

### Phase 4: Performance Optimization

#### 4.1 Image Optimization
```typescript
// components/mobile/OptimizedImage.tsx
import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  placeholder = 'empty',
  blurDataURL
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  
  return (
    <div className={cn('relative overflow-hidden', className)}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      
      {hasError ? (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400 text-sm">Gambar tidak dapat dimuat</span>
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
          className={cn(
            'transition-opacity duration-300',
            isLoading ? 'opacity-0' : 'opacity-100'
          )}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false)
            setHasError(true)
          }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      )}
    </div>
  )
}
```

#### 4.2 Code Splitting & Lazy Loading
```typescript
// components/mobile/LazyComponents.tsx
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Lazy load heavy components
export const LazyAbsensiHistory = dynamic(
  () => import('../features/AbsensiHistory').then(mod => ({ default: mod.AbsensiHistory })),
  {
    loading: () => <AbsensiHistorySkeleton />,
    ssr: false
  }
)

export const LazyJurnalForm = dynamic(
  () => import('../forms/JurnalForm'),
  {
    loading: () => <JurnalFormSkeleton />,
    ssr: false
  }
)

export const LazyDashboardCharts = dynamic(
  () => import('../features/DashboardCharts'),
  {
    loading: () => <ChartsSkeleton />,
    ssr: false
  }
)

// Skeleton components
function AbsensiHistorySkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-24" />
              <div className="h-3 bg-gray-200 rounded w-32" />
            </div>
            <div className="h-6 bg-gray-200 rounded w-16" />
          </div>
        </div>
      ))}
    </div>
  )
}

function JurnalFormSkeleton() {
  return (
    <div className="bg-white rounded-lg p-6 animate-pulse">
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded w-32" />
        <div className="h-32 bg-gray-200 rounded" />
        <div className="h-10 bg-gray-200 rounded" />
      </div>
    </div>
  )
}

function ChartsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-32 mb-4" />
          <div className="h-48 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  )
}
```

## 📱 Mobile Navigation Enhancement

### Bottom Navigation for Mobile
```typescript
// components/mobile/MobileBottomNav.tsx
import { useRouter } from 'next/navigation'
import { Home, Calendar, FileText, User } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  icon: React.ComponentType<{ className?: string }>
  label: string
  href: string
  badge?: number
}

const navItems: NavItem[] = [
  { icon: Home, label: 'Beranda', href: '/' },
  { icon: Calendar, label: 'Absensi', href: '/absensi' },
  { icon: FileText, label: 'Jurnal', href: '/dashboard/jurnal' },
  { icon: User, label: 'Profil', href: '/dashboard' },
]

export function MobileBottomNav() {
  const router = useRouter()
  const currentPath = router.pathname
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe-bottom z-40 mobile:block hidden">
      <div className="grid grid-cols-4">
        {navItems.map((item) => {
          const isActive = currentPath === item.href
          const Icon = item.icon
          
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={cn(
                'flex flex-col items-center justify-center py-2 px-1 min-h-[60px]',
                'transition-colors duration-150',
                isActive
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              <div className="relative">
                <Icon className={cn(
                  'h-6 w-6 mb-1',
                  isActive && 'text-blue-600'
                )} />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={cn(
                'text-xs font-medium',
                isActive && 'text-blue-600'
              )}>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
```

## 🚀 Deployment & Testing

### PWA Testing Checklist
```typescript
// scripts/pwa-test.ts
export const PWATestChecklist = {
  manifest: {
    'Valid manifest.json': false,
    'All required fields present': false,
    'Icons in multiple sizes': false,
    'Start URL accessible': false,
    'Display mode set to standalone': false
  },
  serviceWorker: {
    'Service worker registered': false,
    'Service worker activated': false,
    'Caching strategy implemented': false,
    'Offline fallback working': false
  },
  mobile: {
    'Responsive design working': false,
    'Touch targets >= 48px': false,
    'Viewport meta tag present': false,
    'Safe area handling': false,
    'Mobile navigation working': false
  },
  performance: {
    'First Contentful Paint < 2s': false,
    'Largest Contentful Paint < 2.5s': false,
    'Cumulative Layout Shift < 0.1': false,
    'First Input Delay < 100ms': false
  },
  installability: {
    'Install prompt appears': false,
    'App can be installed': false,
    'App launches in standalone mode': false,
    'App shortcuts working': false
  }
}

export async function runPWATests() {
  console.log('Running PWA tests...')
  
  // Test manifest
  try {
    const manifestResponse = await fetch('/manifest.json')
    const manifest = await manifestResponse.json()
    
    PWATestChecklist.manifest['Valid manifest.json'] = manifestResponse.ok
    PWATestChecklist.manifest['All required fields present'] = 
      manifest.name && manifest.short_name && manifest.start_url && manifest.display
    PWATestChecklist.manifest['Icons in multiple sizes'] = 
      manifest.icons && manifest.icons.length >= 2
    PWATestChecklist.manifest['Display mode set to standalone'] = 
      manifest.display === 'standalone'
  } catch (error) {
    console.error('Manifest test failed:', error)
  }
  
  // Test service worker
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration()
      PWATestChecklist.serviceWorker['Service worker registered'] = !!registration
      PWATestChecklist.serviceWorker['Service worker activated'] = 
        registration?.active?.state === 'activated'
    } catch (error) {
      console.error('Service worker test failed:', error)
    }
  }
  
  // Test mobile responsiveness
  const viewport = document.querySelector('meta[name="viewport"]')
  PWATestChecklist.mobile['Viewport meta tag present'] = !!viewport
  
  // Test touch targets
  const buttons = document.querySelectorAll('button, a, input')
  let validTouchTargets = 0
  buttons.forEach(button => {
    const rect = button.getBoundingClientRect()
    if (rect.width >= 48 && rect.height >= 48) {
      validTouchTargets++
    }
  })
  PWATestChecklist.mobile['Touch targets >= 48px'] = 
    validTouchTargets / buttons.length > 0.8
  
  return PWATestChecklist
}
```

## 📈 Performance Metrics

### Expected Improvements
```
Metric                    | Before PWA | After PWA  | Improvement
--------------------------|------------|------------|------------
First Contentful Paint   | 2.5s       | 1.2s       | 52% faster
Largest Contentful Paint | 3.2s       | 1.8s       | 44% faster
Time to Interactive      | 4.1s       | 2.3s       | 44% faster
Cumulative Layout Shift  | 0.15       | 0.05       | 67% better
Mobile Usability Score   | 75         | 95         | 27% better
Install Rate             | 0%         | 15-25%     | New metric
Return Visit Rate        | 35%        | 60%        | 71% better
```

### Monitoring Setup
```typescript
// lib/monitoring/pwa-metrics.ts
export class PWAMetrics {
  static trackInstallPrompt() {
    // Track when install prompt is shown
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'pwa_install_prompt_shown', {
        event_category: 'PWA',
        event_label: 'Install Prompt'
      })
    }
  }
  
  static trackInstallAccepted() {
    // Track when user accepts install
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'pwa_install_accepted', {
        event_category: 'PWA',
        event_label: 'Install Accepted'
      })
    }
  }
  
  static trackStandaloneUsage() {
    // Track usage in standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    const isInWebAppiOS = (window.navigator as any).standalone === true
    
    if (isStandalone || isInWebAppiOS) {
      if (typeof window !== 'undefined' && 'gtag' in window) {
        (window as any).gtag('event', 'pwa_standalone_usage', {
          event_category: 'PWA',
          event_label: 'Standalone Mode'
        })
      }
    }
  }
}
```

Implementasi PWA ini akan memberikan pengalaman mobile yang jauh lebih baik dengan installability, performa yang optimal, dan user experience yang native-like tanpa kompleksitas sistem offline dan notifikasi.