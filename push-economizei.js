// push-economizei.js - Funciona SEM backend
if ('serviceWorker' in navigator && 'PushManager' in window) {
  
  // Botão para ativar
  const btn = document.createElement('button');
  btn.innerHTML = '🔔 Ativar Notificações';
  btn.style.cssText = `
    position:fixed; bottom:20px; right:20px;
    background:#f4c430; color:white; border:none;
    padding:12px 20px; border-radius:30px;
    font-weight:bold; cursor:pointer; z-index:10000;
    box-shadow:0 4px 12px rgba(244,196,48,0.3);
  `;
  
  btn.onclick = async () => {
    try {
      // Registrar Service Worker
      const reg = await navigator.serviceWorker.register('/sw-push.js');
      
      // Pedir permissão
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        // Inscrição para push (usando chave pública de teste)
        const sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: 'BKYvJLwQ9gQcKJvK7vL8cT7HJkLp09gFcVbN7mKjL9hTqW8zXcVbN7mKjL9hTqW8zXc'
        });
        
        btn.innerHTML = '✅ Ativado!';
        btn.style.background = '#4CAF50';
        
        // Salvar localmente
        localStorage.setItem('push-enabled', 'true');
        localStorage.setItem('push-subscription', JSON.stringify(sub));
        
        console.log('✅ Notificações ativadas!');
      }
    } catch (err) {
      console.error('❌ Erro:', err);
      btn.innerHTML = '❌ Erro - Tente novamente';
    }
  };
  
  // Mostrar botão se não ativado
  if (!localStorage.getItem('push-enabled')) {
    document.body.appendChild(btn);
  }
}
