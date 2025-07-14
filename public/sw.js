const CACHE_NAME = 'absensi-pwa-v1'
const STATIC_CACHE_URLS = [
  '/',
  '/absensi',
  '/dashboard',
  '/manifest.json',
  // Add critical CSS and JS files
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching static assets')
        return cache.addAll(STATIC_CACHE_URLS)
      })
      .then(() => {
        console.log('Service Worker installed successfully')
        return self.skipWaiting()
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME)
            .map((cacheName) => caches.delete(cacheName))
        )
      })
      .then(() => {
        console.log('Service Worker activated')
        return self.clients.claim()
      })
  )
})

// Fetch event - serve from cache when possible
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return
  }

  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return
  }

  // Skip API requests and authentication routes from caching
  if (event.request.url.includes('/api/') || 
      event.request.url.includes('/auth/') ||
      event.request.url.includes('/_next/static/chunks/')) {
    event.respondWith(fetch(event.request))
    return
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // For navigation requests, always try network first
        if (event.request.mode === 'navigate') {
          return fetch(event.request)
            .then((fetchResponse) => {
              if (fetchResponse.status === 200) {
                const responseClone = fetchResponse.clone()
                caches.open(CACHE_NAME)
                  .then((cache) => {
                    cache.put(event.request, responseClone)
                  })
              }
              return fetchResponse
            })
            .catch(() => {
              // Return cached version if network fails
              return response || caches.match('/')
            })
        }
        
        // For other requests, return cached version or fetch from network
        return response || fetch(event.request)
          .then((fetchResponse) => {
            // Cache successful responses
            if (fetchResponse.status === 200) {
              const responseClone = fetchResponse.clone()
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseClone)
                })
            }
            return fetchResponse
          })
      })
      .catch(() => {
        // Return offline page for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/offline') || caches.match('/')
        }
      })
  )
})

// Handle background sync (for future use)
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag)
})

// Handle push notifications (for future use)
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event)
})