// splash-clean.js - Versão sem iframe (genérica)
(function() {
  'use strict';

  // Executa quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    console.log('🔧 Iniciando limpeza de splash...');

    // 1. Remove o elemento splash se existir
    const splash = document.getElementById('splash-screen');
    if (splash) {
      splash.style.transition = 'none'; // remove animações
      splash.style.display = 'none';
      // Remove do DOM (opcional, mas seguro)
      setTimeout(() => {
        if (splash.parentNode) splash.parentNode.removeChild(splash);
      }, 100);
      console.log('✅ Splash removida.');
    } else {
      console.log('ℹ️ Nenhum elemento splash encontrado.');
    }

    // 2. Remove classes do body que possam esconder conteúdo
    document.body.classList.remove('splash-active', 'splash-visible', 'loading');
    document.body.classList.add('splash-complete');

    // 3. Garante que o conteúdo principal fique visível
    //    (opcional: força visibilidade em contêineres comuns)
    const mainContent = document.querySelector('#main-wrapper, #outer-wrapper, main, .main-content, .site-content');
    if (mainContent) {
      mainContent.style.visibility = 'visible';
      mainContent.style.opacity = '1';
    }

    // 4. Remove qualquer overlay genérico que possa estar bloqueando
    const overlays = document.querySelectorAll('.overlay, .modal, .popup');
    overlays.forEach(el => {
      if (el.id !== 'splash-screen') { // evita remover duas vezes
        el.style.display = 'none';
      }
    });

    // 5. Força reflow em elementos escondidos (para garantir que apareçam)
    document.body.style.display = 'none';
    document.body.offsetHeight; // força reflow
    document.body.style.display = '';

    console.log('✅ Splash limpa. Pronto para exibir conteúdo.');
  }
})();
