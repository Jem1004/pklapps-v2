'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Clock, History, Plus, List, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

interface SubNavItem {
  icon: React.ComponentType<{ className?: string }>
  label: string
  href: string
  value: string
}

interface SubNavConfig {
  [key: string]: SubNavItem[]
}

export default function StudentSubNav() {
  const router = useRouter()
  const pathname = usePathname()

  // Define sub navigation items for each main section
  const subNavConfig: SubNavConfig = {
    absensi: [
      {
        icon: Clock,
        label: 'Absensi Hari Ini',
        href: '/absensi',
        value: 'today'
      },
      {
        icon: History,
        label: 'Riwayat Absensi',
        href: '/dashboard/absensi',
        value: 'history'
      }
    ],
    jurnal: [
      {
        icon: Plus,
        label: 'Buat Jurnal',
        href: '/dashboard/jurnal',
        value: 'create'
      },
      {
        icon: List,
        label: 'Rekapan Jurnal',
        href: '/dashboard/jurnal?tab=list',
        value: 'recap'
      }
    ]
  }

  // Determine current main section
  const getCurrentMainSection = () => {
    if (pathname.startsWith('/absensi') || pathname === '/dashboard/absensi') {
      return 'absensi'
    }
    if (pathname.startsWith('/dashboard/jurnal')) {
      return 'jurnal'
    }
    return null
  }

  // Get current active sub tab
  const getCurrentSubTab = (section: string) => {
    const items = subNavConfig[section] || []
    
    for (const item of items) {
      if (pathname === item.href || 
          (item.href.includes('?tab=list') && pathname.includes('/jurnal') && pathname.includes('tab=list'))) {
        return item.value
      }
    }
    
    // Default to first item if no exact match
    return items[0]?.value || ''
  }

  const currentSection = getCurrentMainSection()
  
  if (!currentSection) {
    return null
  }

  const subNavItems = subNavConfig[currentSection]
  const currentSubTab = getCurrentSubTab(currentSection)

  const handleSubTabChange = (value: string) => {
    const item = subNavItems.find(item => item.value === value)
    if (item) {
      router.push(item.href)
    }
  }

  return (
    <>
      {/* Desktop Sub Navigation */}
      <div className="hidden md:block w-full bg-gray-50 border-b border-gray-200 sticky top-14 z-40">
        <div className="container mx-auto px-4">
          <Tabs value={currentSubTab} onValueChange={handleSubTabChange} className="w-full">
            <TabsList className={cn(
              "grid h-12 bg-transparent rounded-none border-0",
              subNavItems.length === 2 ? "grid-cols-2" : "grid-cols-3"
            )}>
              {subNavItems.map((item) => {
                const Icon = item.icon
                return (
                  <TabsTrigger
                    key={item.value}
                    value={item.value}
                    className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Mobile Sub Navigation (Horizontal Scroll) */}
      <div className="md:hidden w-full bg-gray-50 border-b border-gray-200 sticky top-0 z-40">
        <div className="flex overflow-x-auto scrollbar-hide px-4 py-2">
          <div className="flex space-x-2 min-w-max">
            {subNavItems.map((item) => {
              const Icon = item.icon
              const isActive = currentSubTab === item.value
              
              return (
                <Button
                  key={item.value}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => router.push(item.href)}
                  className={cn(
                    "flex items-center gap-2 whitespace-nowrap min-h-[44px] px-4",
                    isActive 
                      ? "bg-blue-600 text-white border-blue-600" 
                      : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}