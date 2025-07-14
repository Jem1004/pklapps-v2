'use client'

import { useState, useEffect } from 'react'
import { X, Download, Smartphone } from 'lucide-react'
import { TouchOptimizedButton } from './TouchOptimizedForm'
import { cn } from '@/lib/utils'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isAndroid, setIsAndroid] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    const checkIfInstalled = () => {
      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches
      const isIOSStandalone = (window.navigator as any).standalone === true
      const isInstalled = isStandaloneMode || isIOSStandalone
      setIsStandalone(isStandaloneMode || isIOSStandalone)
      setIsInstalled(isInstalled)
      return isInstalled
    }

    const checkIfIOS = () => {
      const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent)
      setIsIOS(isIOSDevice)
      return isIOSDevice
    }

    const checkIfAndroid = () => {
      const isAndroidDevice = /Android/.test(navigator.userAgent)
      setIsAndroid(isAndroidDevice)
      return isAndroidDevice
    }

    const isCurrentlyInstalled = checkIfInstalled()
    const isCurrentlyIOS = checkIfIOS()
    const isCurrentlyAndroid = checkIfAndroid()
    
    if (isCurrentlyInstalled) return
    if (sessionStorage.getItem('pwa-install-dismissed')) return
    
    const isMobile = isCurrentlyAndroid || isCurrentlyIOS
    const fallbackTimeout = isMobile ? 1000 : 3000
    
    if (isMobile) {
      setTimeout(() => setShowInstallPrompt(true), 500)
    }
    
    const fallbackTimer = setTimeout(() => {
      if (!deferredPrompt && !isCurrentlyInstalled) setShowInstallPrompt(true)
    }, fallbackTimeout)

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      const promptEvent = e as BeforeInstallPromptEvent
      setDeferredPrompt(promptEvent)
      if (!isCurrentlyInstalled) {
        setTimeout(() => setShowInstallPrompt(true), 1000)
      }
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowInstallPrompt(false)
      setDeferredPrompt(null)
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Aplikasi berhasil diinstall!', {
          body: 'Sekarang Anda dapat mengakses aplikasi dari home screen.',
          icon: '/icons/icon-192x192.svg'
        })
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
      clearTimeout(fallbackTimer)
    }
  }, [isInstalled])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return
    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      setDeferredPrompt(null)
      setShowInstallPrompt(false)
    } catch (error) {
      console.error('Error during installation:', error)
    }
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
    sessionStorage.setItem('pwa-install-dismissed', 'true')
  }

  if (isInstalled || isStandalone) return null
  if (typeof window !== 'undefined' && sessionStorage.getItem('pwa-install-dismissed')) return null
  
  const isCurrentlyAndroid = typeof window !== 'undefined' ? /Android/.test(navigator.userAgent) : false
  const isCurrentlyIOS = typeof window !== 'undefined' ? /iPad|iPhone|iPod/.test(navigator.userAgent) : false
  const shouldShowPrompt = showInstallPrompt || deferredPrompt || isIOS || isAndroid || isCurrentlyAndroid || isCurrentlyIOS
  
  if (!shouldShowPrompt) return null
  
  if (typeof window !== 'undefined' && window.location.pathname.includes('/dashboard')) {
    const shouldShowOnDashboard = sessionStorage.getItem('pwa-dashboard-prompt-allowed')
    if (!shouldShowOnDashboard) {
      setTimeout(() => sessionStorage.setItem('pwa-dashboard-prompt-allowed', 'true'), 3000)
      return null
    }
  }

  return (
    <>
      {(deferredPrompt || (isCurrentlyAndroid && !isStandalone) || (isAndroid && !isStandalone) || (!isIOS && !isAndroid && !isCurrentlyAndroid && !isCurrentlyIOS && !isStandalone)) && (
        <div className="fixed bottom-4 left-4 right-4 z-40 animate-slide-up">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900">
                  Install Aplikasi Absensi PKL
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Akses lebih cepat dan mudah dari home screen Anda
                </p>
                {!deferredPrompt && (
                  <div className="mt-2 p-2 bg-blue-50 rounded-md">
                    <p className="text-xs text-blue-800 font-medium mb-1">Instruksi Manual:</p>
                    <ol className="text-xs text-blue-700 space-y-0.5">
                      <li>1. Buka menu browser (⋮)</li>
                      <li>2. Pilih "Add to Home Screen" atau "Install App"</li>
                      <li>3. Ikuti instruksi untuk menginstall</li>
                    </ol>
                  </div>
                )}
                <div className="flex space-x-2 mt-3">
                  {deferredPrompt ? (
                    <TouchOptimizedButton
                      size="sm"
                      onClick={handleInstallClick}
                      className="flex items-center space-x-1"
                    >
                      <Download className="w-4 h-4" />
                      <span>Install</span>
                    </TouchOptimizedButton>
                  ) : (
                    <TouchOptimizedButton
                      size="sm"
                      onClick={handleDismiss}
                      className="flex items-center space-x-1"
                    >
                      <span>Mengerti</span>
                    </TouchOptimizedButton>
                  )}
                  <TouchOptimizedButton
                    size="sm"
                    variant="secondary"
                    onClick={handleDismiss}
                  >
                    Nanti
                  </TouchOptimizedButton>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
      {isIOS && !isStandalone && (
        <div className="fixed bottom-4 left-4 right-4 z-40 animate-slide-up">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900">
                  Install Aplikasi ke Home Screen
                </h3>
                <div className="text-sm text-gray-500 mt-1 space-y-1">
                  <p>1. Tap tombol Share di Safari</p>
                  <p>2. Pilih "Add to Home Screen"</p>
                  <p>3. Tap "Add" untuk menginstall</p>
                </div>
                <div className="flex space-x-2 mt-3">
                  <TouchOptimizedButton
                    size="sm"
                    variant="secondary"
                    onClick={handleDismiss}
                  >
                    Mengerti
                  </TouchOptimizedButton>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export function PWAUpdatePrompt() {
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false)
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => window.location.reload())
      navigator.serviceWorker.ready.then((registration) => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setWaitingWorker(newWorker)
                setShowUpdatePrompt(true)
              }
            })
          }
        })
      })
    }
  }, [])

  const handleUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' })
      setShowUpdatePrompt(false)
    }
  }

  const handleDismiss = () => setShowUpdatePrompt(false)

  if (!showUpdatePrompt) return null

  return (
    <div className="fixed top-4 left-4 right-4 z-40 animate-slide-down">
      <div className="bg-blue-600 text-white rounded-lg shadow-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-sm font-medium">Update Tersedia</h3>
            <p className="text-sm opacity-90 mt-1">Versi baru aplikasi sudah tersedia</p>
          </div>
          <div className="flex space-x-2 ml-4">
            <TouchOptimizedButton
              size="sm"
              variant="secondary"
              onClick={handleUpdate}
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              Update
            </TouchOptimizedButton>
            <button
              onClick={handleDismiss}
              className="p-1 text-white hover:text-gray-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}