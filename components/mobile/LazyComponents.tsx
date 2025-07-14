'use client'

import { lazy, Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'

// Lazy load heavy components
export const LazyAbsensiHistory = lazy(() =>
  import('@/app/dashboard/absensi/components/AbsensiCard').then(module => ({
    default: module.default
  }))
)

export const LazyJurnalForm = lazy(() =>
  import('@/components/forms/JurnalForm').then(module => ({
    default: module.JurnalForm
  }))
)

export const LazyDashboardCharts = lazy(() =>
  import('@/components/features/admin/OverviewChart').then(module => ({
    default: module.default
  }))
)

export const LazyAdminPanel = lazy(() =>
  import('@/components/features/admin/UserManagement').then(module => ({
    default: module.default
  }))
)

// Skeleton components for loading states
export function AbsensiHistorySkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-32" />
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
            <Skeleton className="h-6 w-16" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function JurnalFormSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <Skeleton className="h-6 w-40" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-32 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-12 w-full" />
      </CardContent>
    </Card>
  )
}

export function DashboardChartsSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('grid gap-4 md:grid-cols-2 lg:grid-cols-3', className)}>
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-48 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function AdminPanelSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-6', className)}>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-8 w-8" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-6 w-12" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-8 w-24" />
            </div>
            <div className="space-y-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Generic loading skeleton
export function GenericSkeleton({ 
  lines = 3, 
  className 
}: { 
  lines?: number
  className?: string 
}) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          className={cn(
            'h-4',
            i === lines - 1 ? 'w-2/3' : 'w-full'
          )} 
        />
      ))}
    </div>
  )
}

// Wrapper components with Suspense
export function LazyAbsensiHistoryWithSuspense(props: any) {
  return (
    <Suspense fallback={<AbsensiHistorySkeleton />}>
      <LazyAbsensiHistory {...props} />
    </Suspense>
  )
}

export function LazyJurnalFormWithSuspense(props: any) {
  return (
    <Suspense fallback={<JurnalFormSkeleton />}>
      <LazyJurnalForm {...props} />
    </Suspense>
  )
}

export function LazyDashboardChartsWithSuspense(props: any) {
  return (
    <Suspense fallback={<DashboardChartsSkeleton />}>
      <LazyDashboardCharts {...props} />
    </Suspense>
  )
}

export function LazyAdminPanelWithSuspense(props: any) {
  return (
    <Suspense fallback={<AdminPanelSkeleton />}>
      <LazyAdminPanel {...props} />
    </Suspense>
  )
}

// Mobile-optimized lazy loading with intersection observer
export function MobileLazyWrapper({ 
  children, 
  fallback, 
  className,
  rootMargin = '50px'
}: {
  children: React.ReactNode
  fallback: React.ReactNode
  className?: string
  rootMargin?: string
}) {
  return (
    <div className={cn('min-h-[200px]', className)}>
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </div>
  )
}