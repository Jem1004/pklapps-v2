#!/usr/bin/env node

/**
 * PWA Test Checklist Script
 * Verifies PWA implementation according to PWA_MOBILE_IMPLEMENTATION.md
 */

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

interface TestResult {
  name: string
  status: 'PASS' | 'FAIL' | 'WARN'
  message: string
}

class PWATestRunner {
  private results: TestResult[] = []
  private projectRoot: string

  constructor() {
    this.projectRoot = process.cwd()
  }

  private addResult(name: string, status: 'PASS' | 'FAIL' | 'WARN', message: string) {
    this.results.push({ name, status, message })
  }

  private fileExists(filePath: string): boolean {
    return fs.existsSync(path.join(this.projectRoot, filePath))
  }

  private readFile(filePath: string): string {
    try {
      return fs.readFileSync(path.join(this.projectRoot, filePath), 'utf-8')
    } catch {
      return ''
    }
  }

  private parseJSON(content: string): any {
    try {
      return JSON.parse(content)
    } catch {
      return null
    }
  }

  // Test 1: Manifest.json validation
  testManifest() {
    console.log('🔍 Testing PWA Manifest...')
    
    if (!this.fileExists('public/manifest.json')) {
      this.addResult('Manifest File', 'FAIL', 'manifest.json not found in public directory')
      return
    }

    const manifestContent = this.readFile('public/manifest.json')
    const manifest = this.parseJSON(manifestContent)

    if (!manifest) {
      this.addResult('Manifest Parse', 'FAIL', 'manifest.json is not valid JSON')
      return
    }

    // Required fields
    const requiredFields = ['name', 'short_name', 'start_url', 'display', 'theme_color', 'icons']
    const missingFields = requiredFields.filter(field => !manifest[field])

    if (missingFields.length > 0) {
      this.addResult('Manifest Required Fields', 'FAIL', `Missing fields: ${missingFields.join(', ')}`)
    } else {
      this.addResult('Manifest Required Fields', 'PASS', 'All required fields present')
    }

    // Icons validation
    if (manifest.icons && Array.isArray(manifest.icons)) {
      const hasRequiredSizes = manifest.icons.some((icon: any) => 
        icon.sizes === '192x192' || icon.sizes === '512x512'
      )
      
      if (hasRequiredSizes) {
        this.addResult('Manifest Icons', 'PASS', 'Required icon sizes present')
      } else {
        this.addResult('Manifest Icons', 'WARN', 'Missing recommended icon sizes (192x192, 512x512)')
      }
    } else {
      this.addResult('Manifest Icons', 'FAIL', 'No icons defined in manifest')
    }
  }

  // Test 2: Service Worker validation
  testServiceWorker() {
    console.log('🔍 Testing Service Worker...')
    
    if (!this.fileExists('public/sw.js')) {
      this.addResult('Service Worker File', 'FAIL', 'sw.js not found in public directory')
      return
    }

    const swContent = this.readFile('public/sw.js')
    
    // Check for essential SW features
    const hasInstallEvent = swContent.includes('install')
    const hasActivateEvent = swContent.includes('activate')
    const hasFetchEvent = swContent.includes('fetch')
    
    if (hasInstallEvent && hasActivateEvent && hasFetchEvent) {
      this.addResult('Service Worker Events', 'PASS', 'Essential SW events implemented')
    } else {
      const missing = []
      if (!hasInstallEvent) missing.push('install')
      if (!hasActivateEvent) missing.push('activate')
      if (!hasFetchEvent) missing.push('fetch')
      this.addResult('Service Worker Events', 'FAIL', `Missing events: ${missing.join(', ')}`)
    }

    // Check for caching strategy
    const hasCaching = swContent.includes('cache') || swContent.includes('Cache')
    if (hasCaching) {
      this.addResult('Service Worker Caching', 'PASS', 'Caching strategy implemented')
    } else {
      this.addResult('Service Worker Caching', 'WARN', 'No caching strategy detected')
    }
  }

  // Test 3: Mobile responsiveness
  testMobileResponsiveness() {
    console.log('🔍 Testing Mobile Responsiveness...')
    
    // Check Tailwind config for mobile breakpoints
    if (this.fileExists('tailwind.config.js')) {
      const tailwindContent = this.readFile('tailwind.config.js')
      
      const hasMobileBreakpoints = tailwindContent.includes('mobile') || 
                                   tailwindContent.includes('xs') ||
                                   tailwindContent.includes('sm')
      
      if (hasMobileBreakpoints) {
        this.addResult('Mobile Breakpoints', 'PASS', 'Mobile breakpoints configured')
      } else {
        this.addResult('Mobile Breakpoints', 'WARN', 'No custom mobile breakpoints detected')
      }
    }

    // Check for mobile components
    const mobileComponents = [
      'components/mobile/MobileBottomNav.tsx',
      'components/mobile/TouchOptimizedForm.tsx',
      'components/layout/MobileOptimizedLayout.tsx'
    ]

    const existingComponents = mobileComponents.filter(comp => this.fileExists(comp))
    
    if (existingComponents.length === mobileComponents.length) {
      this.addResult('Mobile Components', 'PASS', 'All mobile components present')
    } else {
      const missing = mobileComponents.filter(comp => !this.fileExists(comp))
      this.addResult('Mobile Components', 'WARN', `Missing components: ${missing.join(', ')}`)
    }
  }

  // Test 4: Performance optimization
  testPerformanceOptimization() {
    console.log('🔍 Testing Performance Optimization...')
    
    // Check for lazy loading components
    if (this.fileExists('components/mobile/LazyComponents.tsx')) {
      this.addResult('Lazy Loading', 'PASS', 'Lazy loading components implemented')
    } else {
      this.addResult('Lazy Loading', 'WARN', 'No lazy loading components detected')
    }

    // Check Next.js config for optimizations
    if (this.fileExists('next.config.ts') || this.fileExists('next.config.js')) {
      const configFile = this.fileExists('next.config.ts') ? 'next.config.ts' : 'next.config.js'
      const configContent = this.readFile(configFile)
      
      const hasImageOptimization = configContent.includes('images')
      const hasExperimentalFeatures = configContent.includes('experimental')
      
      if (hasImageOptimization) {
        this.addResult('Image Optimization', 'PASS', 'Image optimization configured')
      } else {
        this.addResult('Image Optimization', 'WARN', 'No image optimization detected')
      }
      
      if (hasExperimentalFeatures) {
        this.addResult('Experimental Features', 'PASS', 'Experimental optimizations enabled')
      } else {
        this.addResult('Experimental Features', 'WARN', 'No experimental optimizations detected')
      }
    }
  }

  // Test 5: PWA installability
  testInstallability() {
    console.log('🔍 Testing PWA Installability...')
    
    // Check for PWA install prompt component
    if (this.fileExists('components/mobile/PWAInstallPrompt.tsx')) {
      this.addResult('Install Prompt', 'PASS', 'PWA install prompt component present')
    } else {
      this.addResult('Install Prompt', 'WARN', 'No PWA install prompt component detected')
    }

    // Check layout.tsx for PWA meta tags
    if (this.fileExists('app/layout.tsx')) {
      const layoutContent = this.readFile('app/layout.tsx')
      
      const hasManifestLink = layoutContent.includes('manifest')
      const hasAppleWebApp = layoutContent.includes('apple-web-app')
      const hasThemeColor = layoutContent.includes('theme-color')
      
      if (hasManifestLink && hasAppleWebApp && hasThemeColor) {
        this.addResult('PWA Meta Tags', 'PASS', 'Essential PWA meta tags present')
      } else {
        const missing = []
        if (!hasManifestLink) missing.push('manifest link')
        if (!hasAppleWebApp) missing.push('apple-web-app meta')
        if (!hasThemeColor) missing.push('theme-color')
        this.addResult('PWA Meta Tags', 'WARN', `Missing: ${missing.join(', ')}`)
      }
    }
  }

  // Run all tests
  async runAllTests() {
    console.log('🚀 Starting PWA Test Suite\n')
    
    this.testManifest()
    this.testServiceWorker()
    this.testMobileResponsiveness()
    this.testPerformanceOptimization()
    this.testInstallability()
    
    this.printResults()
  }

  // Print test results
  private printResults() {
    console.log('\n📊 PWA Test Results:')
    console.log('=' .repeat(50))
    
    const passed = this.results.filter(r => r.status === 'PASS').length
    const failed = this.results.filter(r => r.status === 'FAIL').length
    const warnings = this.results.filter(r => r.status === 'WARN').length
    
    this.results.forEach(result => {
      const icon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⚠️'
      console.log(`${icon} ${result.name}: ${result.message}`)
    })
    
    console.log('\n📈 Summary:')
    console.log(`✅ Passed: ${passed}`)
    console.log(`❌ Failed: ${failed}`)
    console.log(`⚠️  Warnings: ${warnings}`)
    console.log(`📊 Total: ${this.results.length}`)
    
    if (failed > 0) {
      console.log('\n❗ Please fix the failed tests before deploying to production.')
      process.exit(1)
    } else if (warnings > 0) {
      console.log('\n⚠️  Consider addressing the warnings for optimal PWA experience.')
    } else {
      console.log('\n🎉 All PWA tests passed! Your app is ready for PWA deployment.')
    }
  }
}

// Run tests if called directly
if (require.main === module) {
  const runner = new PWATestRunner()
  runner.runAllTests().catch(console.error)
}

export { PWATestRunner }