'use client'

import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Clock,
  FileText,
  Users,
  Building2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Settings
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
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
    title: "Management PKL",
    items: [
      {
        name: 'Management Absensi',
        href: '/dashboard/admin/absensi',
        icon: Clock,
        roles: ['ADMIN']
      },
      {
        name: 'Management Jurnal',
        href: '/dashboard/admin?tab=jurnal',
        icon: Settings,
        roles: ['ADMIN']
      }
    ]
  }
]

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
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

  const filteredSections = menuSections.map(section => ({
    ...section,
    items: section.items.filter(item => 
      item.roles.includes(session?.user?.role || '')
    )
  })).filter(section => section.items.length > 0)

  return (
    <motion.div
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 z-40 h-full bg-white border-r border-gray-100 shadow-sm"
    >
      <div className="flex h-full flex-col">
        {/* Logo Section */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-100">
          <motion.div
            initial={false}
            animate={{ opacity: collapsed ? 0 : 1 }}
            transition={{ duration: 0.2 }}
            className="flex items-center space-x-3"
          >
            {!collapsed && (
              <>
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-sm">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">PKL System</h1>
                  <p className="text-xs text-gray-500">Admin Panel</p>
                </div>
              </>
            )}
          </motion.div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="p-2 hover:bg-gray-50"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            )}
          </Button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-6 space-y-6 overflow-y-auto">
          {filteredSections.map((section, sectionIndex) => (
            <div key={section.title}>
              {/* Section Title */}
              <motion.div
                initial={false}
                animate={{ opacity: collapsed ? 0 : 1 }}
                transition={{ duration: 0.2 }}
                className="mb-3"
              >
                {!collapsed && (
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3">
                    {section.title}
                  </h3>
                )}
              </motion.div>
              
              {/* Menu Items */}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.href)
                  
                  return (
                    <Link key={item.name} href={item.disabled ? '#' : item.href}>
                      <motion.div
                        whileHover={!item.disabled ? { scale: 1.02 } : {}}
                        whileTap={!item.disabled ? { scale: 0.98 } : {}}
                        className={cn(
                          'flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer group relative',
                          active
                            ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100'
                            : item.disabled
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        )}
                      >
                        <Icon className={cn(
                          'w-5 h-5 flex-shrink-0',
                          active 
                            ? 'text-blue-700' 
                            : item.disabled 
                            ? 'text-gray-400'
                            : 'text-gray-500 group-hover:text-gray-700'
                        )} />
                        
                        <motion.div
                          initial={false}
                          animate={{ 
                            opacity: collapsed ? 0 : 1,
                            width: collapsed ? 0 : 'auto'
                          }}
                          transition={{ duration: 0.2 }}
                          className={cn(
                            'flex items-center justify-between flex-1 whitespace-nowrap overflow-hidden',
                            collapsed && 'w-0'
                          )}
                        >
                          <span className="font-medium text-sm">
                            {item.name}
                          </span>
                          {item.badge && (
                            <Badge variant="secondary" className="text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </motion.div>
                        
                        {/* Active Indicator */}
                        {active && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r"
                            transition={{ duration: 0.2 }}
                          />
                        )}
                      </motion.div>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </motion.div>
  )
}