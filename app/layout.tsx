import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import NextAuthSessionProvider from '@/components/providers/session-provider'
import { Toaster } from 'sonner'
import { PWAInstallPrompt, PWAUpdatePrompt } from '@/components/mobile/PWAInstallPrompt'
import PWAErrorBoundary from '@/components/common/PWAErrorBoundary'

const inter = Inter({ subsets: ['latin'] })

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
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Absensi PKL',
    'apple-web-app-capable': 'yes',
    'apple-web-app-status-bar-style': 'default',
    'apple-web-app-title': 'Absensi PKL',
    'application-name': 'Absensi PKL',
    'msapplication-TileColor': '#3b82f6',
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
        <link rel="icon" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.svg" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.svg" />
        <link rel="apple-touch-icon" sizes="144x144" href="/icons/icon-144x144.svg" />
        <link rel="apple-touch-icon" sizes="128x128" href="/icons/icon-128x128.svg" />
        <link rel="apple-touch-icon" sizes="96x96" href="/icons/icon-96x96.svg" />
        <link rel="apple-touch-icon" sizes="72x72" href="/icons/icon-72x72.svg" />
        
        {/* Preload critical resources */}
        {/* Font Inter handled automatically by next/font/google */}
        
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      </head>
      <body className={inter.className}>
        <PWAErrorBoundary>
          <NextAuthSessionProvider>
            {children}
            <PWAInstallPrompt />
            <PWAUpdatePrompt />
            <Toaster />
          </NextAuthSessionProvider>
        </PWAErrorBoundary>
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
