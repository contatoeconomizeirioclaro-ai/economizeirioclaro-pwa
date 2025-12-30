self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('economizei-v1').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.json'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match('/index.html'))
  );
});
