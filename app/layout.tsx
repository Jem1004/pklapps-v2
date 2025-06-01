import type { Metadata } from '../node_modules/next'
import NextAuthSessionProvider from '@/../components/providers/session-provider'
import '../src/app/globals.css'

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
        </NextAuthSessionProvider>
      </body>
    </html>
  )
}
