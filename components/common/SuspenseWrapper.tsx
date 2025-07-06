'use client'

import { Suspense, ReactNode } from 'react'
import { ErrorBoundary } from './ErrorBoundary'

interface SuspenseWrapperProps {
  children: ReactNode
  fallback?: ReactNode
  errorFallback?: ReactNode
  className?: string
}

export function SuspenseWrapper({
  children,
  fallback,
  errorFallback,
  className
}: SuspenseWrapperProps) {
  const defaultFallback = (
    <div className={`flex items-center justify-center p-8 ${className || ''}`}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  )

  const defaultErrorFallback = (
    <div className={`flex items-center justify-center p-8 ${className || ''}`}>
      <div className="text-center">
        <p className="text-muted-foreground">Something went wrong</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 text-sm text-primary hover:underline"
        >
          Try again
        </button>
      </div>
    </div>
  )

  return (
    <ErrorBoundary fallback={(error, retry) => errorFallback || defaultErrorFallback}>
      <Suspense fallback={fallback || defaultFallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  )
}

// Progressive Loading Component
interface ProgressiveLoadingProps {
  children: ReactNode
  skeleton: ReactNode
  delay?: number
  className?: string
}

export function ProgressiveLoading({
  children,
  skeleton,
  delay = 200,
  className
}: ProgressiveLoadingProps) {
  return (
    <SuspenseWrapper
      fallback={
        <div className={className}>
          {skeleton}
        </div>
      }
      className={className}
    >
      {children}
    </SuspenseWrapper>
  )
}

// Lazy Loading Component for Heavy Components
interface LazyComponentProps {
  children: ReactNode
  threshold?: number
  rootMargin?: string
  className?: string
}

export function LazyComponent({
  children,
  threshold = 0.1,
  rootMargin = '50px',
  className
}: LazyComponentProps) {
  return (
    <div className={className}>
      <SuspenseWrapper>
        {children}
      </SuspenseWrapper>
    </div>
  )
}

// Data Loading Wrapper
interface DataLoadingWrapperProps {
  children: ReactNode
  isLoading?: boolean
  error?: Error | null
  skeleton?: ReactNode
  errorFallback?: ReactNode
  className?: string
}

export function DataLoadingWrapper({
  children,
  isLoading,
  error,
  skeleton,
  errorFallback,
  className
}: DataLoadingWrapperProps) {
  if (error) {
    return (
      <div className={className}>
        {errorFallback || (
          <div className="text-center p-8">
            <p className="text-destructive">Error loading data</p>
            <p className="text-sm text-muted-foreground mt-1">{error.message}</p>
          </div>
        )}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className={className}>
        {skeleton || (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={className}>
      {children}
    </div>
  )
}