'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Home, Clock, BookOpen, User, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { useLocalStorage } from '@/hooks/useLocalStorage'

interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
  roles?: string[]
}

interface MobileBottomNavProps {
  userRole?: string
  className?: string
}

export function MobileBottomNav({ userRole = 'student', className }: MobileBottomNavProps) {
  const pathname = usePathname()
  const [queueCount] = useLocalStorage('offlineQueue', 0)
  
  const getNavItems = (): NavItem[] => {
    const baseItems: NavItem[] = [
      {
        href: '/dashboard',
        label: 'Beranda',
        icon: Home
      },
      {
        href: '/absensi',
        label: 'Absensi',
        icon: Clock,
        badge: queueCount > 0 ? queueCount : undefined
      },
      {
        href: '/jurnal',
        label: 'Jurnal',
        icon: BookOpen
      }
    ]
    
    // Add role-specific items
    if (userRole === 'admin' || userRole === 'teacher') {
      baseItems.push({
        href: '/admin',
        label: 'Admin',
        icon: BarChart3,
        roles: ['admin', 'teacher']
      })
    }
    
    baseItems.push({
      href: '/profile',
      label: 'Profil',
      icon: User
    })
    
    return baseItems
  }
  
  const navItems = getNavItems()
  
  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/' || pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }
  
  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 z-50",
      "bg-background/95 backdrop-blur-sm border-t border-border",
      "safe-bottom pb-safe-bottom",
      "md:hidden", // Hide on desktop
      className
    )}>
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center",
                "min-w-0 flex-1 px-2 py-2 rounded-lg",
                "text-xs font-medium transition-all duration-200",
                "touch-manipulation",
                "hover:bg-accent/50 active:bg-accent",
                "focus:outline-none focus:ring-2 focus:ring-primary/20",
                active
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="relative">
                <Icon className={cn(
                  "h-5 w-5 mb-1 transition-transform duration-200",
                  active && "scale-110"
                )} />
                
                {/* Badge for notifications/queue count */}
                {item.badge && item.badge > 0 && (
                  <Badge 
                    variant="destructive" 
                    className={cn(
                      "absolute -top-2 -right-2",
                      "h-5 w-5 p-0 text-xs",
                      "flex items-center justify-center",
                      "animate-pulse"
                    )}
                  >
                    {item.badge > 99 ? '99+' : item.badge}
                  </Badge>
                )}
              </div>
              
              <span className={cn(
                "truncate max-w-full leading-tight",
                active && "font-semibold"
              )}>
                {item.label}
              </span>
              
              {/* Active indicator */}
              {active && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
              )}
            </Link>
          )
        })}
      </div>
      
      {/* Safe area spacer for devices with home indicator */}
      <div className="h-safe-bottom" />
    </nav>
  )
}

// Hook to get navigation height for content padding
export function useMobileNavHeight() {
  // Standard mobile bottom nav height + safe area
  return 'pb-20 md:pb-0' // 80px (20 * 4) for mobile nav + safe area
}

// Component to add proper spacing for mobile nav
export function MobileNavSpacer({ className }: { className?: string }) {
  return (
    <div className={cn(
      "h-20 md:hidden", // 80px spacer only on mobile
      className
    )} />
  )
}