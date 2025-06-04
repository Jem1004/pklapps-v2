'use client'

import { useSession, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Home,
  Users,
  FileText,
  LogOut,
  ChevronLeft,
  ChevronRight,
  GraduationCap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SidebarGuruProps {
  collapsed: boolean
  onToggle: () => void
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
  }
]

export default function SidebarGuru({ collapsed, onToggle }: SidebarGuruProps) {
  const { data: session } = useSession()
  const pathname = usePathname()

  const isActive = (href: string) => {
    // Handle exact match for dashboard
    if (href === '/dashboard/guru') {
      return pathname === '/dashboard/guru'
    }
    
    // Handle other routes
    return pathname.startsWith(href)
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/auth/login' })
  }

  return (
    <motion.div
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 z-40 h-full bg-white/95 backdrop-blur-sm border-r border-blue-100 shadow-lg"
    >
      <div className="flex h-full flex-col">
        {/* Logo Section */}
        <div className="flex h-20 items-center justify-between px-4 border-b border-blue-100">
          <motion.div
            initial={false}
            animate={{ opacity: collapsed ? 0 : 1 }}
            transition={{ duration: 0.2 }}
            className="flex items-center space-x-3"
          >
            {!collapsed && (
              <>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">Dashboard</h1>
                  <p className="text-sm text-blue-600 font-medium">Guru</p>
                </div>
              </>
            )}
          </motion.div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            )}
          </Button>
        </div>

        {/* Navigation - Fixed active state */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "block rounded-xl transition-all",
                  active && "bg-gradient-to-r from-blue-500 to-indigo-500 shadow-md"
                )}
              >
                <motion.div
                  whileHover={{ scale: active ? 1 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "flex items-center px-3 py-3 rounded-xl",
                    active
                      ? "text-white"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                  )}
                >
                  <Icon className={cn(
                    "w-5 h-5 flex-shrink-0",
                    active ? "text-white" : "text-gray-500 group-hover:text-blue-600"
                  )} />
                  
                  <motion.div
                    initial={false}
                    animate={{ 
                      opacity: collapsed ? 0 : 1,
                      width: collapsed ? 0 : 'auto'
                    }}
                    transition={{ duration: 0.2 }}
                    className="ml-3 overflow-hidden"
                  >
                    {!collapsed && (
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        {item.description && (
                          <p className={cn(
                            "text-xs mt-0.5",
                            active ? "text-blue-100" : "text-gray-500 group-hover:text-blue-500"
                          )}>
                            {item.description}
                          </p>
                        )}
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              </Link>
            )
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-blue-100">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl"
            >
              <p className="text-sm font-semibold text-gray-900 truncate">
                {session?.user?.name || 'Guru'}
              </p>
              <p className="text-xs text-blue-600 mt-1">Guru Pembimbing</p>
            </motion.div>
          )}
          
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={cn(
              "w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors rounded-xl",
              collapsed ? "px-3" : "px-3"
            )}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="ml-3 font-medium">Logout</span>}
          </Button>
        </div>
      </div>
    </motion.div>
  )
}