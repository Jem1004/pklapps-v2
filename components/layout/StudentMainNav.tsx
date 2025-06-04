'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Calendar, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

interface MainNavItem {
  icon: React.ComponentType<{ className?: string }>
  label: string
  href: string
  value: string
  pattern: RegExp
}

export default function StudentMainNav() {
  const router = useRouter()
  const pathname = usePathname()
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)

  const mainNavItems: MainNavItem[] = [
    {
      icon: Calendar,
      label: 'Absensi',
      href: '/absensi',
      value: 'absensi',
      pattern: /^\/absensi/
    },
    {
      icon: BookOpen,
      label: 'Jurnal',
      href: '/dashboard/jurnal',
      value: 'jurnal',
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

  // Get current active main tab based on pathname
  const getCurrentMainTab = () => {
    for (const item of mainNavItems) {
      if (item.pattern.test(pathname)) {
        return item.value
      }
    }
    return 'absensi'
  }

  const handleMainTabChange = (value: string) => {
    const item = mainNavItems.find(item => item.value === value)
    if (item) {
      router.push(item.href)
    }
  }

  return (
    <>
      {/* Desktop Main Navigation */}
      <div className="hidden md:block w-full bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <Tabs value={getCurrentMainTab()} onValueChange={handleMainTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-14 bg-gray-50 rounded-none">
              {mainNavItems.map((item) => {
                const Icon = item.icon
                return (
                  <TabsTrigger
                    key={item.value}
                    value={item.value}
                    className="flex items-center gap-3 text-base font-semibold data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm h-12"
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Mobile Main Navigation (Bottom Bar) */}
      <div className={cn(
        "fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg transition-transform duration-300 md:hidden",
        isKeyboardVisible ? "translate-y-full" : "translate-y-0"
      )}>
        <div className="grid grid-cols-2 h-16">
          {mainNavItems.map((item) => {
            const Icon = item.icon
            const isActive = item.pattern.test(pathname)
            
            return (
              <Button
                key={item.href}
                variant="ghost"
                size="sm"
                onClick={() => router.push(item.href)}
                className={cn(
                  "flex flex-col items-center justify-center h-full rounded-none border-0 gap-1 px-2 min-h-[64px]",
                  isActive 
                    ? "text-blue-600 bg-blue-50 border-t-2 border-blue-600" 
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                )}
              >
                <Icon className={cn(
                  "h-6 w-6",
                  isActive ? "text-blue-600" : "text-gray-600"
                )} />
                <span className={cn(
                  "text-sm font-semibold leading-tight text-center",
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