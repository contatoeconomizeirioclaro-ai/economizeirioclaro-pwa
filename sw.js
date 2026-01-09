const CACHE_NAME = 'economizei-offline-v4'; // Mudei para v4
const OFFLINE_URL = '/offline.html';
const ALLOWED_ORIGIN = self.location.origin;

self.addEventListener('install', event => {
  console.log('✅ Service Worker instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.add(OFFLINE_URL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('✅ Service Worker ativando...');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => {
            console.log('🗑️ Removendo cache:', key);
            return caches.delete(key);
          })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // ❗ Para outros domínios, deixa o navegador cuidar
  if (url.origin !== ALLOWED_ORIGIN) {
    console.log('🌐 Ignorando domínio externo:', url.origin);
    return;
  }

  // Apenas páginas (navegação)
  if (request.mode === 'navigate') {
    console.log('🌐 Navegação para:', request.url);
    
    event.respondWith(
      (async () => {
        try {
          // Tentar fetch primeiro
          const response = await fetch(request);
          return response;
        } catch (error) {
          console.log('📴 Offline, mostrando página offline');
          // Retornar página offline do cache
          const cache = await caches.open(CACHE_NAME);
          const cachedResponse = await cache.match(OFFLINE_URL);
          return cachedResponse;
        }
      })()
    );
  }
  
  // Para outros recursos (CSS, JS, imagens), ignora
  console.log('📦 Recurso não navegacional:', request.url);
});

// Adicionar mensagem para controle
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
