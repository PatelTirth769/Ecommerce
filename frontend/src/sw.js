// Minimal offline-caching service worker for the Sale24x7 shop storefront.
// Hand-rolled instead of @angular/service-worker to avoid pulling in a build
// schematic that rewrites angular.json/environment files.

const CACHE_VERSION = 'sale24x7-shop-v1';
const STATIC_CACHE = `${CACHE_VERSION}-static`;

const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.ico',
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-512.png',
  '/assets/images/logo.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);
      await cache.addAll(APP_SHELL);

      // The build's JS/CSS bundle filenames are content-hashed and change on
      // every production build, so they can't be hardcoded above. Discover
      // them straight from index.html and precache those too - otherwise the
      // app itself never gets cached and offline mode shows a blank page.
      try {
        const html = await (await fetch('/index.html')).text();
        const bundleUrls = [...new Set(
          [...html.matchAll(/(?:src|href)="([^"]+\.(?:js|css))"/g)]
            .map((m) => m[1])
            .filter((url) => !url.startsWith('http'))
        )];
        await cache.addAll(bundleUrls);
      } catch (err) {
        // Best-effort: app-shell precache above still succeeds without this.
      }

      await self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key.startsWith('sale24x7-shop-') && key !== STATIC_CACHE)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

// Only cache same-origin static assets. API/backend/Firebase/CDN calls are
// left untouched so they always hit the network with fresh data.
const CACHEABLE_DESTINATIONS = new Set(['style', 'script', 'image', 'font', 'manifest']);

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);
  const isSameOrigin = url.origin === self.location.origin;

  // App-shell navigation: network-first, falling back to cached index.html offline.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(STATIC_CACHE).then((cache) => cache.put('/index.html', copy));
          return response;
        })
        .catch(async () => {
          const cached = await caches.match('/index.html');
          if (!cached) return Response.error();
          if (!cached.redirected) return cached;
          // Chrome refuses to satisfy a navigation request with a Response
          // that has redirected=true (some static hosts redirect /index.html
          // to /). Rebuild a clean Response from the same body so the
          // offline fallback actually renders instead of failing outright.
          const body = await cached.blob();
          return new Response(body, {
            status: cached.status,
            statusText: cached.statusText,
            headers: cached.headers,
          });
        })
    );
    return;
  }

  if (!isSameOrigin || !CACHEABLE_DESTINATIONS.has(request.destination)) {
    return;
  }

  // Static assets: cache-first, populate/refresh cache in the background.
  event.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);

      return cached || networkFetch;
    })
  );
});
