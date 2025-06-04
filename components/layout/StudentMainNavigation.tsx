'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Calendar, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

interface NavItem {
  icon: React.ComponentType<{ className?: string }>
  label: string
  href: string
  pattern: RegExp
}

export default function StudentMainNavigation() {
  const router = useRouter()
  const pathname = usePathname()
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)

  const navItems: NavItem[] = [
    {
      icon: Calendar,
      label: 'Absen',
      href: '/absensi',
      pattern: /^\/absensi/
    },
    {
      icon: BookOpen,
      label: 'Jurnal',
      href: '/dashboard/jurnal',
      pattern: /^\/dashboard\/jurnal/
    }
  ]

  // Detect keyboard visibility on mobile
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        const isKeyboard = window.innerHeight < window.screen.height * 0.75
        setIsKeyboardVisible(isKeyboard)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isActive = (pattern: RegExp) => pattern.test(pathname)

  return (
    <>
      {/* Desktop Navigation - Centered Below Header */}
      <div className="hidden md:block bg-white border-b border-gray-200 sticky top-16 z-40 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-14">
            <nav className="flex items-center bg-gray-50 rounded-full p-1 shadow-inner">
              {navItems.map((item, index) => {
                const Icon = item.icon
                const active = isActive(item.pattern)
                
                return (
                  <Button
                    key={item.href}
                    variant="ghost"
                    onClick={() => router.push(item.href)}
                    className={cn(
                      "flex items-center gap-2 h-10 px-6 rounded-full transition-all duration-200 font-medium",
                      active
                        ? "text-white bg-blue-600 shadow-md hover:bg-blue-700"
                        : "text-gray-600 hover:text-blue-600 hover:bg-white hover:shadow-sm"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                )
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Bottom Sticky */}
      <div className={cn(
        "fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg transition-transform duration-300 md:hidden",
        isKeyboardVisible ? "translate-y-full" : "translate-y-0"
      )}>
        <div className="grid grid-cols-2 h-16">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.pattern)
            
            return (
              <Button
                key={item.href}
                variant="ghost"
                onClick={() => router.push(item.href)}
                className={cn(
                  "flex flex-col items-center justify-center h-full rounded-none border-0 gap-1 min-h-[64px] transition-colors duration-200",
                  active
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                )}
              >
                <Icon className={cn(
                  "h-5 w-5 transition-transform duration-200",
                  active ? "scale-110" : "scale-100"
                )} />
                <span className={cn(
                  "text-xs font-medium transition-all duration-200",
                  active ? "text-blue-600" : "text-gray-600"
                )}>
                  {item.label}
                </span>
                {active && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-600 rounded-b-full" />
                )}
              </Button>
            )
          })}
        </div>
      </div>
    </>
  )
}