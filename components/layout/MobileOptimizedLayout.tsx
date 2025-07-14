import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface MobileOptimizedLayoutProps {
  children: ReactNode
  className?: string
  withSafeArea?: boolean
  fullHeight?: boolean
}

export function MobileOptimizedLayout({
  children,
  className,
  withSafeArea = true,
  fullHeight = false
}: MobileOptimizedLayoutProps) {
  return (
    <div 
      className={cn(
        'w-full mx-auto',
        // Mobile-first responsive container
        'px-4 sm:px-6 lg:px-8',
        // Safe area handling
        withSafeArea && 'pt-safe-top pb-safe-bottom pl-safe-left pr-safe-right',
        // Full height handling
        fullHeight && 'min-h-screen-safe',
        className
      )}
    >
      {children}
    </div>
  )
}

// Mobile-optimized card component
export function MobileCard({
  children,
  className,
  padding = 'default'
}: {
  children: ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'default' | 'lg'
}) {
  const paddingClasses = {
    none: '',
    sm: 'p-3 sm:p-4',
    default: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8'
  }

  return (
    <div 
      className={cn(
        'bg-white rounded-lg shadow-sm border border-gray-200',
        'mobile:rounded-none mobile:border-x-0', // Full width on mobile
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  )
}

// Mobile-optimized container
export function MobileContainer({
  children,
  className,
  maxWidth = 'lg'
}: {
  children: ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
}) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full'
  }

  return (
    <div 
      className={cn(
        'w-full mx-auto',
        'px-4 mobile:px-2',
        maxWidthClasses[maxWidth],
        className
      )}
    >
      {children}
    </div>
  )
}

// Mobile-optimized grid
export function MobileGrid({
  children,
  className,
  cols = 1,
  gap = 4
}: {
  children: ReactNode
  className?: string
  cols?: 1 | 2 | 3 | 4
  gap?: 2 | 3 | 4 | 6 | 8
}) {
  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
  }

  const gapClasses = {
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8'
  }

  return (
    <div 
      className={cn(
        'grid',
        colClasses[cols],
        gapClasses[gap],
        className
      )}
    >
      {children}
    </div>
  )
}