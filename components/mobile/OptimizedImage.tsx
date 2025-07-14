'use client'

import { useState, useCallback } from 'react'
import Image, { ImageProps } from 'next/image'
import { cn } from '@/lib/utils'
import { ImageIcon, AlertCircle } from 'lucide-react'

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  fallbackSrc?: string
  showLoadingPlaceholder?: boolean
  loadingClassName?: string
  errorClassName?: string
  containerClassName?: string
  onLoadComplete?: () => void
  onError?: () => void
}

export function OptimizedImage({
  src,
  alt,
  fallbackSrc,
  showLoadingPlaceholder = true,
  loadingClassName,
  errorClassName,
  containerClassName,
  className,
  onLoadComplete,
  onError,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(src)

  const handleLoad = useCallback(() => {
    setIsLoading(false)
    setHasError(false)
    onLoadComplete?.()
  }, [onLoadComplete])

  const handleError = useCallback(() => {
    setIsLoading(false)
    setHasError(true)
    onError?.()
    
    // Try fallback image if available
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc)
      setIsLoading(true)
      setHasError(false)
    }
  }, [fallbackSrc, currentSrc, onError])

  return (
    <div className={cn('relative overflow-hidden', containerClassName)}>
      {/* Loading Placeholder */}
      {isLoading && showLoadingPlaceholder && (
        <div className={cn(
          'absolute inset-0 flex items-center justify-center',
          'bg-muted animate-pulse',
          loadingClassName
        )}>
          <ImageIcon className="h-8 w-8 text-muted-foreground" />
        </div>
      )}

      {/* Error State */}
      {hasError && !isLoading && (
        <div className={cn(
          'absolute inset-0 flex flex-col items-center justify-center',
          'bg-muted text-muted-foreground',
          errorClassName
        )}>
          <AlertCircle className="h-8 w-8 mb-2" />
          <span className="text-sm text-center px-2">
            Gagal memuat gambar
          </span>
        </div>
      )}

      {/* Optimized Image */}
      <Image
        src={currentSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          hasError && 'opacity-0',
          className
        )}
        {...props}
      />
    </div>
  )
}