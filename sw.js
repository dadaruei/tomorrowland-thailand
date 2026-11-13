// Tomorrowland Thailand — offline shell v3
const CACHE = 'tml-journey-offline-v3';
const APP_SHELL = ['./', './index.html', './tailwind.css', './data.json'];
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // CSS/HTML are essential. Do not activate an incomplete offline shell.
    await cache.addAll(['./index.html', './tailwind.css']);
    // The JSON may be briefly unavailable during a sync; preserve the existing
    // localStorage copy in that case and retry when online.
    await Promise.allSettled(['./', './data.json'].map(url => cache.add(url)));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith('tml-journey-') && k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (!url.pathname.startsWith(new URL('./', self.registration.scope).pathname)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      const response = await fetch(request);
      if (response.ok && response.type === 'basic') {
        // Keep only one canonical copy of data.json, ignoring ?ts= cache-busters.
        const key = url.pathname.endsWith('/data.json') ? new URL('./data.json', self.registration.scope).href : request;
        await cache.put(key, response.clone());
      }
      return response;
    } catch (_) {
      const key = url.pathname.endsWith('/data.json') ? new URL('./data.json', self.registration.scope).href : request;
      return await cache.match(key, {ignoreSearch: true}) ||
        (request.mode === 'navigate' ? await cache.match('./index.html') : undefined) ||
        Response.error();
    }
  })());
});
