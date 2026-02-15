// splash.js - VERSÃO SEM SPLASH (otimizado)
(function() {
  'use strict';

  // Função para garantir que o conteúdo principal seja exibido
  function showMainContent() {
    // Tenta encontrar o iframe (se for o conteúdo principal)
    const iframe = document.querySelector('iframe');
    if (iframe) {
      // Aplica estilos diretamente para garantir visibilidade
      iframe.style.display = 'block';
      iframe.style.visibility = 'visible';
      iframe.style.opacity = '1';
    }

    // Alternativa: se o conteúdo principal for outro elemento (ex.: #main-wrapper)
    // podemos também garantir que ele esteja visível
    const mainContent = document.getElementById('main-wrapper') || document.querySelector('main');
    if (mainContent) {
      mainContent.style.display = 'block'; // ou o valor original
      // Se houver classes de ocultação, removê-las
      mainContent.classList.remove('hidden', 'splash-hidden');
    }
  }

  // Remove o elemento splash se existir
  function removeSplash() {
    const splash = document.getElementById('splash-screen');
    if (splash && splash.parentNode) {
      splash.parentNode.removeChild(splash);
    }
  }

  // Limpa classes fantasmas no body
  function cleanBodyClasses() {
    document.body.classList.remove('splash-active');
    // Adiciona classe de conclusão se for útil para outros scripts
    document.body.classList.add('splash-complete');
  }

  // Executa quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      showMainContent();
      removeSplash();
      cleanBodyClasses();
    });
  } else {
    // DOM já está carregado
    showMainContent();
    removeSplash();
    cleanBodyClasses();
  }
})();
