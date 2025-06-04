'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Home, BookOpen, Calendar, BarChart3, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface NavItem {
  icon: React.ComponentType<{ className?: string }>
  label: string
  href: string
  active?: boolean
}

export default function StudentBottomNav() {
  const router = useRouter()
  const pathname = usePathname()

  const navItems: NavItem[] = [
    {
      icon: Home,
      label: 'Dashboard',
      href: '/dashboard',
    },
    {
      icon: Calendar,
      label: 'Absensi',
      href: '/absensi',
    },
    {
      icon: BookOpen,
      label: 'Jurnal',
      href: '/dashboard/jurnal',
    },


  ]

  return (
    <>
      {/* Bottom Navigation - Mobile Only */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg md:hidden">
        <div className="grid grid-cols-5 h-16">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Button
                key={item.href}
                variant="ghost"
                size="sm"
                onClick={() => router.push(item.href)}
                className={cn(
                  "flex flex-col items-center justify-center h-full rounded-none border-0 gap-1 px-1",
                  isActive 
                    ? "text-blue-600 bg-blue-50" 
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                )}
              >
                <Icon className={cn(
                  "h-5 w-5",
                  isActive ? "text-blue-600" : "text-gray-600"
                )} />
                <span className={cn(
                  "text-xs font-medium",
                  isActive ? "text-blue-600" : "text-gray-600"
                )}>
                  {item.label}
                </span>
              </Button>
            )
          })}
        </div>
      </div>
      
      {/* Spacer for bottom nav on mobile */}
      <div className="h-16 md:hidden" />
    </>
  )
}