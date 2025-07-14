import { useState, useRef } from 'react'
import { cn } from '@/lib/utils'

interface TouchOptimizedButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset'
}

export function TouchOptimizedButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className,
  type = 'button'
}: TouchOptimizedButtonProps) {
  const [isPressed, setIsPressed] = useState(false)
  
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
    danger: 'bg-red-600 hover:bg-red-700 text-white'
  }
  
  const sizes = {
    sm: 'px-4 py-2 text-sm min-h-[40px]',
    md: 'px-6 py-3 text-base min-h-[48px]',
    lg: 'px-8 py-4 text-lg min-h-[56px]'
  }
  
  return (
    <button
      type={type}
      className={cn(
        'rounded-lg font-medium transition-all duration-150',
        'active:scale-95 active:shadow-inner',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
        // Touch-friendly sizing
        'touch-manipulation select-none',
        variants[variant],
        sizes[size],
        isPressed && 'scale-95 shadow-inner',
        className
      )}
      disabled={disabled || loading}
      onClick={onClick}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current" />
          <span className="ml-2">Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  )
}

// Touch-optimized input component
export function TouchOptimizedInput({
  label,
  error,
  className,
  ...props
}: {
  label?: string
  error?: string
  className?: string
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mobile:text-base">
          {label}
        </label>
      )}
      <input
        className={cn(
          'w-full px-4 py-3 border border-gray-300 rounded-lg',
          'focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
          'mobile:text-base mobile:py-4', // Larger on mobile
          'transition-colors duration-150',
          error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600 mobile:text-base">{error}</p>
      )}
    </div>
  )
}

// Touch-optimized select component
export function TouchOptimizedSelect({
  label,
  error,
  children,
  className,
  ...props
}: {
  label?: string
  error?: string
  children: React.ReactNode
  className?: string
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mobile:text-base">
          {label}
        </label>
      )}
      <select
        className={cn(
          'w-full px-4 py-3 border border-gray-300 rounded-lg',
          'focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
          'mobile:text-base mobile:py-4', // Larger on mobile
          'transition-colors duration-150',
          'bg-white',
          error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="text-sm text-red-600 mobile:text-base">{error}</p>
      )}
    </div>
  )
}

// Touch-optimized textarea component
export function TouchOptimizedTextarea({
  label,
  error,
  className,
  ...props
}: {
  label?: string
  error?: string
  className?: string
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mobile:text-base">
          {label}
        </label>
      )}
      <textarea
        className={cn(
          'w-full px-4 py-3 border border-gray-300 rounded-lg',
          'focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
          'mobile:text-base mobile:py-4', // Larger on mobile
          'transition-colors duration-150',
          'resize-vertical',
          error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600 mobile:text-base">{error}</p>
      )}
    </div>
  )
}

// Touch-optimized checkbox component
export function TouchOptimizedCheckbox({
  label,
  error,
  className,
  ...props
}: {
  label?: string
  error?: string
  className?: string
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          className={cn(
            'h-5 w-5 text-blue-600 border-gray-300 rounded',
            'focus:ring-2 focus:ring-blue-500',
            'mobile:h-6 mobile:w-6', // Larger on mobile
            'transition-colors duration-150',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
        {label && (
          <label className="text-sm font-medium text-gray-700 mobile:text-base">
            {label}
          </label>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-600 mobile:text-base">{error}</p>
      )}
    </div>
  )
}