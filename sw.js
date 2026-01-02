const CACHE_NAME = 'economizei-offline-v3';
const OFFLINE_URL = '/offline.html';
const ALLOWED_ORIGIN = self.location.origin;

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.add(OFFLINE_URL))
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
  const { request } = event;
  const url = new URL(request.url);

  // ❗ Para outros domínios, deixa o navegador cuidar
  if (url.origin !== ALLOWED_ORIGIN) {
    return;
  }

  // Apenas páginas (navegação)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match(OFFLINE_URL))
    );
  }
});
