'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
  Clock,
  Settings,
  Menu,
  X,
  LogOut,
  User,
  BarChart3,
  ClipboardList,
  Moon,
  Sun
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface NavigationProps {
  children: React.ReactNode
}

export default function Navigation({ children }: NavigationProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/auth/login' })
  }

  const getNavigationItems = () => {
    const baseItems = [
      {
        label: 'Jurnal',
        items: [
          { name: 'Buat Jurnal', href: '/dashboard/jurnal', icon: FileText },
          { name: 'Rekapan Jurnal', href: '/dashboard/jurnal?tab=list', icon: ClipboardList }
        ]
      },
      {
        label: 'Absensi',
        items: [
          { name: 'Halaman Absensi', href: '/absensi', icon: Clock },
          { name: 'Riwayat Absensi', href: '/dashboard/absensi', icon: BarChart3 }
        ]
      }
    ]

    if (session?.user?.role === 'ADMIN') {
      baseItems.push({
        label: 'Admin',
        items: [
          { name: 'Kelola PIN Tempat PKL', href: '/admin/absensi', icon: Settings },
          { name: 'Log Absensi', href: '/admin/absensi?tab=logs', icon: ClipboardList },
          { name: 'Laporan Absensi', href: '/admin/absensi/laporan', icon: BarChart3 }
        ]
      })
    }

    if (session?.user?.role === 'TEACHER') {
      baseItems.push({
        label: 'Guru',
        items: [
          { name: 'Absensi Siswa', href: '/guru/absensi', icon: ClipboardList }
        ]
      })
    }

    return baseItems
  }

  const isActive = (href: string) => {
    if (href.includes('?')) {
      return pathname === href.split('?')[0]
    }
    return pathname === href || pathname.startsWith(href + '/')
  }

  if (pathname === '/auth/login') {
    return children
  }

  return (
    <div className={`min-h-screen bg-background ${isDarkMode ? 'dark' : ''}`}>
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <Card className="flex grow flex-col gap-y-5 overflow-y-auto border-r bg-card px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <h1 className="text-xl font-bold text-primary">PKL System</h1>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              {getNavigationItems().map((section) => (
                <li key={section.label}>
                  <div className="text-xs font-semibold leading-6 text-muted-foreground">
                    {section.label}
                  </div>
                  <ul role="list" className="-mx-2 mt-2 space-y-1">
                    {section.items.map((item) => {
                      const Icon = item.icon
                      return (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors ${
                              isActive(item.href)
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                            }`}
                          >
                            <Icon className="h-5 w-5 shrink-0" />
                            {item.name}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </li>
              ))}
            </ul>
            <div className="mt-auto space-y-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
                className="w-full justify-start"
              >
                {isDarkMode ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </Button>
              <div className="flex items-center gap-x-4 px-2 py-3 text-sm font-semibold leading-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{session?.user?.name}</p>
                  <Badge variant="secondary" className="text-xs">
                    {session?.user?.role}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </nav>
        </Card>
      </div>

      {/* Mobile Header */}
      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-card px-4 py-4 shadow-sm sm:px-6 lg:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex-1 text-sm font-semibold leading-6">PKL System</div>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleDarkMode}
        >
          {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-full overflow-y-auto bg-card px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-border lg:hidden"
            >
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-primary">PKL System</h1>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="mt-6">
                <ul role="list" className="space-y-6">
                  {getNavigationItems().map((section) => (
                    <li key={section.label}>
                      <div className="text-xs font-semibold leading-6 text-muted-foreground">
                        {section.label}
                      </div>
                      <ul role="list" className="mt-2 space-y-1">
                        {section.items.map((item) => {
                          const Icon = item.icon
                          return (
                            <li key={item.name}>
                              <Link
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors ${
                                  isActive(item.href)
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                }`}
                              >
                                <Icon className="h-5 w-5 shrink-0" />
                                {item.name}
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 pt-6 border-t">
                  <div className="flex items-center gap-x-4 px-2 py-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                      <User className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{session?.user?.name}</p>
                      <Badge variant="secondary" className="text-xs">
                        {session?.user?.role}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="lg:pl-72">
        <main className="py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}