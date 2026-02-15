// splash.js - VERSÃO SEM SPLASH
document.addEventListener('DOMContentLoaded', function() {
  // Mostra o iframe (conteúdo principal) imediatamente
  const iframe = document.querySelector('iframe');
  if (iframe) {
    iframe.style.display = 'block';
    iframe.style.visibility = 'visible';
    iframe.style.opacity = '1'; // se houver transição
  }

  // Remove qualquer elemento que seja a splash (caso exista)
  const splash = document.getElementById('splash-screen');
  if (splash && splash.parentNode) {
    splash.parentNode.removeChild(splash);
  }

  // Remove classes que possam esconder conteúdo
  document.body.classList.remove('splash-active');
  document.body.classList.add('splash-complete');
});
