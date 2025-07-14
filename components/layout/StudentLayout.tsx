'use client'

import { useSession } from 'next-auth/react'
import StudentHeader from './StudentHeader'
import StudentMainNav from './StudentMainNav'
import { MobileBottomNav, MobileNavSpacer } from '../mobile/MobileBottomNav'
import { MobileContainer } from './MobileOptimizedLayout'
import { cn } from '@/lib/utils'

interface StudentLayoutProps {
  children: React.ReactNode
  showNav?: boolean
  className?: string
}

export default function StudentLayout({ 
  children, 
  showNav = true, 
  className 
}: StudentLayoutProps) {
  const { data: session } = useSession()
  const userRole = session?.user?.role || 'student'

  return (
    <div className={cn(
      "min-h-screen bg-gray-50",
      "min-h-screen-safe", // Use safe area height
      className
    )}>
      {/* Desktop Header */}
      <div className="hidden md:block">
        <StudentHeader />
        {showNav && <StudentMainNav />}
      </div>
      
      {/* Mobile Optimized Content */}
      <main className={cn(
        "pb-4 md:pb-8",
        "md:pt-0 pt-safe-top", // Add safe area padding for mobile
        "pb-20 md:pb-8" // Extra padding for mobile bottom nav
      )}>
        <MobileContainer className="md:container md:mx-auto">
          {children}
        </MobileContainer>
      </main>
      
      {/* Mobile Bottom Navigation */}
      {showNav && (
        <MobileBottomNav 
          userRole={userRole}
          className="md:hidden" 
        />
      )}
      
      {/* Spacer for mobile nav */}
      <MobileNavSpacer />
    </div>
  )
}