// sw-push.js - Versão funcional completa
self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {
    title: '📱 Economizei',
    body: 'Novas ofertas disponíveis!',
    icon: 'https://raw.githubusercontent.com/contatoeconomizeirioclaro-ai/economizeirioclaro-pwa/main/assets/pin.png'
  };
  
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      badge: data.icon,
      vibrate: [200, 100, 200],
      data: { url: 'https://www.economizeirioclaro.com.br' }
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow(e.notification.data.url));
});

// Instalação básica
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => self.clients.claim());
