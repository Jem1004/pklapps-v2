import { describe, it, expect } from 'vitest'
import { getServerTimezone } from '@/lib/utils/timezone'

describe('Timezone Improvements', () => {
  it('should use Asia/Makassar as default timezone', () => {
    const timezone = getServerTimezone()
    expect(timezone).toBe('Asia/Makassar')
  })
  
  it('should respect environment timezone override', () => {
    const originalTZ = process.env.TZ
    process.env.TZ = 'UTC'
    
    const timezone = getServerTimezone()
    expect(timezone).toBe('UTC')
    
    // Restore original
    if (originalTZ) {
      process.env.TZ = originalTZ
    } else {
      delete process.env.TZ
    }
  })
})