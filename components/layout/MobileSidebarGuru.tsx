'use client'

import { useSession, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home,
  Users,
  FileText,
  LogOut,
  X,
  GraduationCap,
  User
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface MobileSidebarGuruProps {
  open: boolean
  onClose: () => void
}

interface MenuItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  description?: string
}

const menuItems: MenuItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard/guru',
    icon: Home,
    description: 'Beranda'
  },
  {
    name: 'Absensi Siswa',
    href: '/dashboard/guru/absensi',
    icon: Users,
    description: 'Data Kehadiran'
  },
]

export default function MobileSidebarGuru({ open, onClose }: MobileSidebarGuruProps) {
  const { data: session } = useSession()
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href.includes('?')) {
      const basePath = href.split('?')[0]
      const params = new URLSearchParams(href.split('?')[1])
      const currentParams = new URLSearchParams(window.location.search)
      
      return pathname === basePath && params.get('tab') === currentParams.get('tab')
    }
    return pathname === href || pathname.startsWith(href + '/')
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/auth/login' })
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 z-50 h-full w-80 bg-white shadow-2xl lg:hidden"
          >
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex h-16 items-center justify-between px-4 border-b border-blue-100">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-gray-900">Dashboard</h1>
                    <p className="text-sm text-blue-600 font-medium">Guru</p>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* User Info */}
              <div className="p-4 border-b border-blue-100">
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {session?.user?.name || 'Guru'}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">Guru Pembimbing</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-6 space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.href)
                  
                  return (
                    <Link key={item.href} href={item.href} onClick={onClose}>
                      <motion.div
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                          "flex items-center px-4 py-4 rounded-xl transition-all duration-200",
                          active
                            ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md"
                            : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                        )}
                      >
                        <Icon className={cn(
                          "w-6 h-6 flex-shrink-0",
                          active ? "text-white" : "text-gray-500"
                        )} />
                        
                        <div className="ml-4">
                          <p className="font-medium text-base">{item.name}</p>
                          {item.description && (
                            <p className={cn(
                              "text-sm mt-0.5",
                              active ? "text-blue-100" : "text-gray-500"
                            )}>
                              {item.description}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    </Link>
                  )
                })}
              </nav>

              {/* Logout */}
              <div className="p-4 border-t border-blue-100">
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors rounded-xl py-4"
                >
                  <LogOut className="w-6 h-6 flex-shrink-0" />
                  <span className="ml-4 font-medium text-base">Logout</span>
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}