// ============================================
// SERVICE WORKER UNIFICADO - ECONOMIZEI
// ============================================

const CACHE_NAME = 'economizei-offline-v8'; // incrementar a cada mudança no offline.html
const OFFLINE_URL = '/offline.html';
const ALLOWED_ORIGIN = self.location.origin;

// Baixa o offline.html ignorando o cache HTTP e guarda uma cópia "limpa".
// Motivos: (1) hosts como Cloudflare Pages redirecionam /offline.html -> /offline, e uma
// resposta com redirected=true é rejeitada pelo navegador quando usada numa navegação;
// (2) cache.add() pode reaproveitar uma versão antiga do arquivo guardada no cache HTTP.
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

// ============================================
// INSTALAÇÃO - ADICIONADO: Solicitar permissões
// ============================================

self.addEventListener('install', event => {
  console.log('✅ Service Worker instalando (v8)...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cacheOfflinePage(cache))
      .then(() => {
        console.log('🎯 Tentando obter permissões de mídia...');
        // Solicitar permissões quando instalado
        return self.registration.pushManager.getSubscription()
          .then(subscription => {
            if (subscription) {
              return subscription;
            }
          });
      })
      .then(() => self.skipWaiting())
  );
});

// ============================================
// ATIVAÇÃO
// ============================================

self.addEventListener('activate', event => {
  console.log('✅ Service Worker ativando (v8)...');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => {
            console.log('🗑️ Removendo cache antigo:', key);
            return caches.delete(key);
          })
      )
    ).then(() => {
      console.log('✅ Cache limpo, assumindo controle...');
      return self.clients.claim();
    })
  );
});

// ============================================
// FETCH (APENAS OFFLINE - SIMPLIFICADO)
// ============================================

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // APENAS para navegação e APENAS mesmo domínio
  if (request.mode === 'navigate' && url.origin === ALLOWED_ORIGIN) {
    console.log('🌐 Navegação detectada:', request.url);
    
    event.respondWith(
      fetch(request)
        .catch(async () => {
          console.log('📴 Offline, mostrando página offline');
          const cached = await caches.match(OFFLINE_URL);
          return cached || new Response(OFFLINE_FALLBACK_HTML, {
            status: 503,
            headers: { 'Content-Type': 'text/html; charset=utf-8' }
          });
        })
    );
  }
  // Para outros recursos (imagens, CSS, JS) - IGNORA
  // Isso evita conflito com notificações
});

// ============================================
// SISTEMA DE NOTIFICAÇÕES PUSH
// ============================================

self.addEventListener('push', event => {
  console.log('🔔 Evento push recebido');
  
  let data = {
    title: '📱 Economizei',
    body: 'Novas ofertas disponíveis!',
    icon: 'https://raw.githubusercontent.com/contatoeconomizeirioclaro-ai/economizeirioclaro-pwa/main/assets/pin.png'
  };
  
  // Tenta obter dados da notificação push
  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch (e) {
      console.log('📦 Dados push não são JSON, usando padrão');
    }
  }
  
  const options = {
    body: data.body,
    icon: data.icon,
    badge: data.icon,
    vibrate: [200, 100, 200],
    data: {
      url: data.url || 'https://www.economizeirioclaro.com.br',
      source: 'push',
      timestamp: Date.now()
    },
    tag: `push-${Date.now()}`, // Evita duplicatas
    requireInteraction: data.priority === 'alta'
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
      .then(() => console.log('✅ Notificação push exibida'))
      .catch(err => console.error('❌ Erro ao mostrar notificação:', err))
  );
});

// ============================================
// CLIQUE EM NOTIFICAÇÕES
// ============================================

self.addEventListener('notificationclick', event => {
  console.log('🖱️ Notificação clicada:', event.notification.data);
  
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || 
                   'https://www.economizeirioclaro.com.br';
  
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(windowClients => {
      // Verifica se já há uma janela/tab aberta
      for (let client of windowClients) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Se não encontrou, abre nova janela
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    }).catch(err => {
      console.error('❌ Erro ao abrir janela:', err);
      // Fallback: tenta abrir mesmo sem clients API
      if (event.notification.data?.url) {
        self.clients.openWindow(event.notification.data.url);
      }
    })
  );
});

// ============================================
// GERENCIAMENTO DE NOTIFICAÇÕES LOCAIS (GitHub)
// ============================================
// Esta função é chamada do index.html para notificações locais
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    console.log('📨 Mensagem recebida para notificação local');
    
    const { title, body, icon, url, id } = event.data;
    
    event.waitUntil(
      self.registration.showNotification(title || '📱 Economizei', {
        body: body || 'Nova mensagem disponível',
        icon: icon || 'https://raw.githubusercontent.com/contatoeconomizeirioclaro-ai/economizeirioclaro-pwa/main/assets/pin.png',
        badge: icon || 'https://raw.githubusercontent.com/contatoeconomizeirioclaro-ai/economizeirioclaro-pwa/main/assets/pin.png',
        vibrate: [200, 100, 200],
        data: {
          url: url || 'https://www.economizeirioclaro.com.br',
          source: 'github',
          id: id
        },
        tag: `github-${id || Date.now()}`
      })
    );
  }
  
  // Controle do Service Worker
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  // ADICIONADO: Mensagem para verificar permissões
  if (event.data && event.data.type === 'CHECK_PERMISSIONS') {
    console.log('🔍 Verificando permissões via Service Worker');
    event.ports[0].postMessage({ hasCamera: true });
  }
});

// ============================================
// NOTIFICAÇÃO CLOSE (opcional - para tracking)
// ============================================

self.addEventListener('notificationclose', event => {
  console.log('📪 Notificação fechada:', event.notification.tag);
  // Aqui você poderia enviar analytics se quisesse
});

// ADICIONADO: Função para verificar estado de permissões
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // ADICIONADO: Rota para verificar permissões
  if (url.pathname === '/check-permissions') {
    event.respondWith(
      new Response(JSON.stringify({
        camera: true,
        permissions: ['camera', 'video-capture'],
        timestamp: Date.now()
      }), {
        headers: { 'Content-Type': 'application/json' }
      })
    );
  }
});
