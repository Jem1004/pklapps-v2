'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { RefreshCcw, AlertTriangle } from 'lucide-react'

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class PWAErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('PWA Error Boundary caught an error:', error, errorInfo)
    
    // Log to session storage for debugging
    if (typeof window !== 'undefined') {
      const errorLog = {
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent
      }
      sessionStorage.setItem('pwa-error-log', JSON.stringify(errorLog))
    }
  }

  handleReload = () => {
    if (typeof window !== 'undefined') {
      // Clear PWA cache and reload
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          registrations.forEach(registration => {
            registration.unregister()
          })
        })
      }
      
      // Clear caches
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            caches.delete(name)
          })
        })
      }
      
      // Clear session storage
      sessionStorage.clear()
      
      // Reload page
      window.location.reload()
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">
                Terjadi Kesalahan
              </h1>
              <p className="text-gray-600">
                Aplikasi mengalami masalah setelah update PWA. Silakan refresh untuk memperbaiki.
              </p>
            </div>
            
            {this.state.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left">
                <p className="text-sm text-red-800 font-mono">
                  {this.state.error.message}
                </p>
              </div>
            )}
            
            <div className="space-y-3">
              <Button 
                onClick={this.handleReload}
                className="w-full flex items-center justify-center gap-2"
              >
                <RefreshCcw className="w-4 h-4" />
                Refresh & Clear Cache
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => this.setState({ hasError: false })}
                className="w-full"
              >
                Coba Lagi
              </Button>
            </div>
            
            <p className="text-xs text-gray-500">
              Jika masalah berlanjut, silakan hubungi administrator.
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default PWAErrorBoundary