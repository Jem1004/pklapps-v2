'use client'

import { useSession, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  LayoutDashboard,
  Clock,
  Settings,
  FileText,
  Users,
  Building2,
  LogOut,
  Calendar
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface MobileSidebarProps {
  open: boolean
  onClose: () => void
}

interface MenuItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  roles: string[]
  disabled?: boolean
  badge?: string
}

interface MenuSection {
  title: string
  items: MenuItem[]
}

const menuSections: MenuSection[] = [
  {
    title: "Management Absensi",
    items: [
      {
        name: 'Data Absensi Siswa',
        href: '/dashboard/admin/absensi',
        icon: Clock,
        roles: ['ADMIN']
      },
      {
        name: 'Setting Absensi',
        href: '/dashboard/admin?tab=mapping',
        icon: Settings,
        roles: ['ADMIN']
      }
    ]
  },
  {
    title: "Management Jurnal",
    items: [
      {
        name: 'Rekap Jurnal Siswa',
        href: '/dashboard/admin?tab=monitoring',
        icon: FileText,
        roles: ['ADMIN']
      },
      {
        name: 'Mapping Siswa',
        href: '/dashboard/admin?tab=users',
        icon: Users,
        roles: ['ADMIN']
      },
      {
        name: 'Tempat PKL',
        href: '/dashboard/admin?tab=tempat-pkl',
        icon: Building2,
        roles: ['ADMIN']
      }
    ]
  }
]

export default function MobileSidebar({ open, onClose }: MobileSidebarProps) {
  const { data: session } = useSession()
  const pathname = usePathname()

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/auth/login' })
  }

  const isActive = (href: string) => {
    if (href.includes('?')) {
      const basePath = href.split('?')[0]
      const params = new URLSearchParams(href.split('?')[1])
      const currentParams = new URLSearchParams(window.location.search)
      
      return pathname === basePath && params.get('tab') === currentParams.get('tab')
    }
    return pathname === href || pathname.startsWith(href + '/')
  }

  const filteredSections = menuSections.map(section => ({
    ...section,
    items: section.items.filter(item => 
      item.roles.includes(session?.user?.role || '')
    )
  })).filter(section => section.items.length > 0)

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
            className="fixed inset-0 z-50 bg-black/50 lg:hidden"
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed left-0 top-0 z-50 h-full w-80 bg-white shadow-xl lg:hidden"
          >
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex h-16 items-center justify-between px-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-sm">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-gray-900">PKL System</h1>
                    <p className="text-xs text-gray-500">Admin Panel</p>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="p-2"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
                {filteredSections.map((section) => (
                  <div key={section.title}>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                      {section.title}
                    </h3>
                    
                    <div className="space-y-1">
                      {section.items.map((item) => {
                        const Icon = item.icon
                        const active = isActive(item.href)
                        
                        return (
                          <Link key={item.name} href={item.disabled ? '#' : item.href} onClick={onClose}>
                            <div className={cn(
                              'flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 cursor-pointer',
                              active
                                ? 'bg-blue-50 text-blue-700 border border-blue-100'
                                : item.disabled
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            )}>
                              <Icon className={cn(
                                'w-5 h-5 flex-shrink-0',
                                active ? 'text-blue-700' : item.disabled ? 'text-gray-400' : 'text-gray-500'
                              )} />
                              
                              <div className="flex items-center justify-between flex-1">
                                <span className="font-medium text-sm">
                                  {item.name}
                                </span>
                                {item.badge && (
                                  <Badge variant="secondary" className="text-xs">
                                    {item.badge}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </nav>

              {/* User Info & Logout */}
              <div className="px-4 py-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {session?.user?.name?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {session?.user?.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {session?.user?.role === 'ADMIN' ? 'Administrator' : 'Guru'}
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="p-2 hover:bg-red-50 hover:text-red-600"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}