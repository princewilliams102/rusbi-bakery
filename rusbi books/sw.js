// Rusbi Books Service Worker (PWA Shell Caching & Offline Shortcut Support)
const CACHE_NAME = 'rusbi-books-v4.8';
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './styles/main.css?v=4.8',
  './scripts/app.js?v=4.8',
  './manifest.json?v=4.8',
  './assets/rusbi-icon.png',
  './assets/rusbi-icon-192.png',
  './assets/rusbi-icon-512.png',
  './assets/rusbi-icon-maskable.png',
  './assets/apple-touch-icon.png',
  './assets/rusbi-leaves.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('PWA Precache warning (non-fatal):', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Let API database network requests pass through cleanly without interfering with sync
  if (event.request.url.includes('/api/')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch in background to update cache (stale-while-revalidate for assets)
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && event.request.method === 'GET') {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
        }).catch(() => {});
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});
