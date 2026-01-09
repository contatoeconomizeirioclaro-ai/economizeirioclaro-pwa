// sw-push.js - Service Worker funcional
self.addEventListener('push', e => {
  const data = e.data.json();
  self.registration.showNotification(data.title, {
    body: data.body || 'Economizei Rio Claro',
    icon: 'https://raw.githubusercontent.com/contatoeconomizeirioclaro-ai/economizeirioclaro-pwa/main/assets/pin.png',
    badge: 'https://raw.githubusercontent.com/contatoeconomizeirioclaro-ai/economizeirioclaro-pwa/main/assets/pin.png',
    vibrate: [200, 100, 200],
    data: { url: 'https://www.economizeirioclaro.com.br' }
  });
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow(e.notification.data.url));
});
