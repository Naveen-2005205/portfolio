// Robust Service Worker (Clean Cache-Bypassing and Safe Fallback Version)
const CACHE_NAME = 'portfolio-cache-v2';

// Install Event - Skip waiting to activate immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activate Event - Clean up stale caches from previous local development on the same port
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting obsolete cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[Service Worker] Activated and took control.');
      return self.clients.claim();
    })
  );
});

// Fetch Event - Handle page requests safely with robust error containment
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Bypass service worker interception completely for localhost development if needed,
  // or use a clean network-first strategy with safe promise containment.
  if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
    event.respondWith(
      fetch(event.request).catch((err) => {
        console.warn('[Service Worker] Local host fetch failed, returning graceful network fallback:', err);
        // Safely try to find in cache, otherwise return a clean 503 response instead of throwing
        return caches.match(event.request).then((cachedResponse) => {
          return cachedResponse || new Response('Network offline.', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({ 'Content-Type': 'text/plain' })
          });
        });
      })
    );
    return;
  }

  // Production or non-localhost Network-First caching logic
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Do not cache failed or invalid responses
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Cache the successful response cloned
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      })
      .catch((error) => {
        console.warn('[Service Worker] Production fetch failed, searching offline cache:', error);
        // Clean matching check
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Safe fallback page/Response instead of crashing or returning undefined
          if (event.request.mode === 'navigate') {
            return new Response('<h3>Website is currently offline. Please check your connection.</h3>', {
              status: 503,
              statusText: 'Offline',
              headers: new Headers({ 'Content-Type': 'text/html' })
            });
          }
          return new Response('Asset offline.', {
            status: 404,
            statusText: 'Not Found',
            headers: new Headers({ 'Content-Type': 'text/plain' })
          });
        });
      })
  );
});
