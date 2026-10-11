// ============================================
// SERVICE WORKER - ECONOMIZEI (somente fallback offline)
// Push e notificações são nativos no app (FCM), não passam por aqui.
// ============================================

const CACHE_NAME = 'economizei-offline-v9'; // incrementar a cada mudança no offline.html
const OFFLINE_URL = '/offline.html';
const ALLOWED_ORIGIN = self.location.origin;

// Baixa o offline.html ignorando o cache HTTP e guarda uma cópia "limpa".
// (Cloudflare Pages pode redirecionar /offline.html -> /offline; resposta com
// redirected=true é rejeitada em navegação, então guardamos uma cópia nova.)
async function cacheOfflinePage(cache) {
  const res = await fetch(OFFLINE_URL, { cache: 'reload' });
  if (!res.ok) throw new Error('offline.html indisponível: ' + res.status);
  const tipo = res.headers.get('content-type') || '';
  if (!tipo.includes('text/html')) throw new Error('offline.html não é HTML: ' + tipo);
  const corpo = await res.blob();
  await cache.put(
    OFFLINE_URL,
    new Response(corpo, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } })
  );
}

const OFFLINE_FALLBACK_HTML = '<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">' +
  '<meta name="viewport" content="width=device-width,initial-scale=1"><title>Offline</title></head>' +
  '<body style="font-family:sans-serif;text-align:center;padding:40px;color:#1a3463">' +
  '<h2>Você está offline</h2><p>Verifique sua conexão e tente novamente.</p>' +
  '<button onclick="location.reload()" style="padding:10px 22px;border:0;border-radius:30px;background:#1a3463;color:#fff;font-weight:700">Tentar novamente</button>' +
  '</body></html>';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cacheOfflinePage(cache))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Só navegação do mesmo domínio; se falhar (offline), mostra a página offline.
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.mode === 'navigate' && url.origin === ALLOWED_ORIGIN) {
    event.respondWith(
      fetch(request).catch(async () => {
        const cached = await caches.match(OFFLINE_URL);
        return cached || new Response(OFFLINE_FALLBACK_HTML, {
          status: 503,
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
      })
    );
  }
});
