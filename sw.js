// Tomorrowland Thailand — offline shell v11
const CACHE = 'tml-journey-offline-v14-production-sync';
const APP_SHELL = ['./', './index.html', './tailwind.css', './cover-background.jpg', './cover-emblem.png', './data.json', './collection.json', './shopping.json', './tera_rex_bangkok_guide.html'];
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(['./index.html', './tailwind.css', './cover-background.jpg', './cover-emblem.png']);
    await Promise.allSettled(['./', './data.json', './collection.json', './shopping.json', './tera_rex_bangkok_guide.html'].map(url => cache.add(url)));
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
        const key = (url.pathname.endsWith('/data.json') || (/\/(?:collection|shopping)\.json$/.test(url.pathname))) ? new URL('./'+url.pathname.split('/').pop(), self.registration.scope).href : request;
        await cache.put(key, response.clone());
      }
      return response;
    } catch (_) {
      const key = (url.pathname.endsWith('/data.json') || (/\/(?:collection|shopping)\.json$/.test(url.pathname))) ? new URL('./'+url.pathname.split('/').pop(), self.registration.scope).href : request;
      return await cache.match(key, {ignoreSearch: true}) ||
        (request.mode === 'navigate' ? await cache.match('./index.html') : undefined) ||
        Response.error();
    }
  })());
});