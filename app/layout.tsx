import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import NextAuthSessionProvider from '@/components/providers/session-provider'
import { Toaster } from 'sonner'

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
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/favicon.svg" />
        
        {/* Preload critical resources */}
        {/* Font Inter handled automatically by next/font/google */}
        
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      </head>
      <body className={inter.className}>
        <NextAuthSessionProvider>
          {children}
          <Toaster />
        </NextAuthSessionProvider>
      </body>
    </html>
  )
}
