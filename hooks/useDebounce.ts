import { useState, useEffect } from 'react'

/**
 * Custom hook untuk debouncing nilai
 * Mencegah re-render berlebihan pada form input
 * 
 * @param value - Nilai yang akan di-debounce
 * @param delay - Delay dalam milliseconds (default: 300)
 * @returns Debounced value
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}