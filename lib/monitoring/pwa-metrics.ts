'use client'

/**
 * PWA Metrics Monitoring
 * Tracks PWA-specific events and performance metrics
 */

interface PWAMetric {
  name: string
  value: number
  timestamp: number
  metadata?: Record<string, any>
}

interface PWAInstallEvent {
  type: 'prompt_shown' | 'prompt_accepted' | 'prompt_dismissed' | 'installed' | 'uninstalled'
  timestamp: number
  userAgent?: string
  platform?: string
}

interface PWAUsageEvent {
  type: 'standalone_launch' | 'browser_launch' | 'offline_usage' | 'online_usage'
  timestamp: number
  sessionId: string
}

class PWAMetrics {
  private metrics: PWAMetric[] = []
  private installEvents: PWAInstallEvent[] = []
  private usageEvents: PWAUsageEvent[] = []
  private sessionId: string
  private isStandalone: boolean

  constructor() {
    this.sessionId = this.generateSessionId()
    this.isStandalone = this.detectStandaloneMode()
    this.initializeTracking()
  }

  private generateSessionId(): string {
    return `pwa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private detectStandaloneMode(): boolean {
    if (typeof window === 'undefined') return false
    
    // Check if running in standalone mode
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://')
    )
  }

  private initializeTracking() {
    if (typeof window === 'undefined') return

    // Track app launch type
    this.trackUsageEvent(this.isStandalone ? 'standalone_launch' : 'browser_launch')

    // Track online/offline status
    this.trackConnectivityEvents()

    // Track install prompt events
    this.trackInstallPromptEvents()

    // Track performance metrics
    this.trackPerformanceMetrics()

    // Track app installed event
    this.trackAppInstalledEvent()
  }

  private trackConnectivityEvents() {
    const updateConnectivity = () => {
      this.trackUsageEvent(navigator.onLine ? 'online_usage' : 'offline_usage')
    }

    window.addEventListener('online', updateConnectivity)
    window.addEventListener('offline', updateConnectivity)
  }

  private trackInstallPromptEvents() {
    // Track beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      this.trackInstallEvent('prompt_shown', {
        userAgent: navigator.userAgent,
        platform: navigator.platform
      })
    })
  }

  private trackAppInstalledEvent() {
    window.addEventListener('appinstalled', () => {
      this.trackInstallEvent('installed', {
        userAgent: navigator.userAgent,
        platform: navigator.platform
      })
    })
  }

  private trackPerformanceMetrics() {
    // Track Core Web Vitals
    this.trackWebVitals()

    // Track PWA-specific metrics
    this.trackPWASpecificMetrics()
  }

  private trackWebVitals() {
    // First Contentful Paint (FCP)
    this.observePerformanceEntry('paint', (entries) => {
      const fcp = entries.find(entry => entry.name === 'first-contentful-paint')
      if (fcp) {
        this.addMetric('FCP', fcp.startTime)
      }
    })

    // Largest Contentful Paint (LCP)
    this.observePerformanceEntry('largest-contentful-paint', (entries) => {
      const lcp = entries[entries.length - 1]
      if (lcp) {
        this.addMetric('LCP', lcp.startTime)
      }
    })

    // First Input Delay (FID)
    this.observePerformanceEntry('first-input', (entries) => {
      const fid = entries[0]
      if (fid) {
        this.addMetric('FID', (fid as PerformanceEventTiming).processingStart - fid.startTime)
      }
    })

    // Cumulative Layout Shift (CLS)
    let clsValue = 0
    this.observePerformanceEntry('layout-shift', (entries) => {
      for (const entry of entries) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value
        }
      }
      this.addMetric('CLS', clsValue)
    })
  }

  private trackPWASpecificMetrics() {
    // Service Worker registration time
    if ('serviceWorker' in navigator) {
      const swStart = performance.now()
      navigator.serviceWorker.ready.then(() => {
        const swTime = performance.now() - swStart
        this.addMetric('SW_Registration_Time', swTime)
      })
    }

    // Cache hit rate (if implemented)
    this.trackCacheMetrics()

    // App shell load time
    window.addEventListener('load', () => {
      const loadTime = performance.now()
      this.addMetric('App_Shell_Load_Time', loadTime)
    })
  }

  private trackCacheMetrics() {
    // This would be implemented based on your caching strategy
    // For now, we'll track basic cache API usage
    if ('caches' in window) {
      const originalFetch = window.fetch
      let cacheHits = 0
      let cacheMisses = 0

      window.fetch = async (...args) => {
        const response = await originalFetch(...args)
        
        // Simple heuristic: if response is from cache, it's usually faster
        if (response.headers.get('cache-control')?.includes('max-age')) {
          cacheHits++
        } else {
          cacheMisses++
        }

        const hitRate = cacheHits / (cacheHits + cacheMisses)
        this.addMetric('Cache_Hit_Rate', hitRate * 100)

        return response
      }
    }
  }

  private observePerformanceEntry(type: string, callback: (entries: PerformanceEntry[]) => void) {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          callback(list.getEntries())
        })
        observer.observe({ type, buffered: true })
      } catch (e) {
        // Fallback for unsupported entry types
        console.warn(`Performance observer for ${type} not supported`)
      }
    }
  }

  // Public methods
  addMetric(name: string, value: number, metadata?: Record<string, any>) {
    this.metrics.push({
      name,
      value,
      timestamp: Date.now(),
      metadata
    })

    // Limit stored metrics to prevent memory issues
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-500)
    }
  }

  trackInstallEvent(type: PWAInstallEvent['type'], metadata?: Record<string, any>) {
    this.installEvents.push({
      type,
      timestamp: Date.now(),
      ...metadata
    })
  }

  trackUsageEvent(type: PWAUsageEvent['type']) {
    this.usageEvents.push({
      type,
      timestamp: Date.now(),
      sessionId: this.sessionId
    })
  }

  // Analytics methods
  getMetrics(): PWAMetric[] {
    return [...this.metrics]
  }

  getInstallEvents(): PWAInstallEvent[] {
    return [...this.installEvents]
  }

  getUsageEvents(): PWAUsageEvent[] {
    return [...this.usageEvents]
  }

  getSessionInfo() {
    return {
      sessionId: this.sessionId,
      isStandalone: this.isStandalone,
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine
    }
  }

  // Export data for analytics
  exportData() {
    return {
      session: this.getSessionInfo(),
      metrics: this.getMetrics(),
      installEvents: this.getInstallEvents(),
      usageEvents: this.getUsageEvents(),
      timestamp: Date.now()
    }
  }

  // Send data to analytics endpoint (implement based on your needs)
  async sendToAnalytics(endpoint?: string) {
    if (!endpoint) return

    try {
      const data = this.exportData()
      await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
    } catch (error) {
      console.warn('Failed to send PWA metrics:', error)
    }
  }

  // Clear stored data
  clearData() {
    this.metrics = []
    this.installEvents = []
    this.usageEvents = []
  }
}

// Singleton instance
let pwaMetricsInstance: PWAMetrics | null = null

export function getPWAMetrics(): PWAMetrics {
  if (typeof window === 'undefined') {
    // Return a mock instance for SSR
    return {
      addMetric: () => {},
      trackInstallEvent: () => {},
      trackUsageEvent: () => {},
      getMetrics: () => [],
      getInstallEvents: () => [],
      getUsageEvents: () => [],
      getSessionInfo: () => ({}),
      exportData: () => ({}),
      sendToAnalytics: async () => {},
      clearData: () => {}
    } as any
  }

  if (!pwaMetricsInstance) {
    pwaMetricsInstance = new PWAMetrics()
  }

  return pwaMetricsInstance
}

// React hook for using PWA metrics
export function usePWAMetrics() {
  const metrics = getPWAMetrics()

  const trackInstallPromptShown = () => {
    metrics.trackInstallEvent('prompt_shown')
  }

  const trackInstallPromptAccepted = () => {
    metrics.trackInstallEvent('prompt_accepted')
  }

  const trackInstallPromptDismissed = () => {
    metrics.trackInstallEvent('prompt_dismissed')
  }

  const trackCustomMetric = (name: string, value: number, metadata?: Record<string, any>) => {
    metrics.addMetric(name, value, metadata)
  }

  return {
    trackInstallPromptShown,
    trackInstallPromptAccepted,
    trackInstallPromptDismissed,
    trackCustomMetric,
    getSessionInfo: () => metrics.getSessionInfo(),
    exportData: () => metrics.exportData()
  }
}

export { PWAMetrics }