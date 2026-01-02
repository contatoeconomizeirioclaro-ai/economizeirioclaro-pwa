const CACHE_NAME = 'economizei-offline-v2'; // 🔥 versão nova para forçar update
const OFFLINE_URL = '/offline.html';
const ALLOWED_ORIGIN = self.location.origin;

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([OFFLINE_URL]);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  // ✅ NÃO intercepta outros domínios
  if (url.origin !== ALLOWED_ORIGIN) {
    return;
  }

  // ✅ Apenas navegação de páginas
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match(OFFLINE_URL);
      })
    );
  }
});
