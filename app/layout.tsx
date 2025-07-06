import type { Metadata } from 'next'
import NextAuthSessionProvider from '@/components/providers/session-provider'
import '../src/app/globals.css'
import { Toaster } from "sonner"

export const metadata: Metadata = {
  title: 'Jurnal PKL SMK',
  description: 'Sistem Jurnal Praktik Kerja Lapangan',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <NextAuthSessionProvider>
          {children}
          <Toaster position="top-center" richColors />
        </NextAuthSessionProvider>
      </body>
    </html>
  )
}
