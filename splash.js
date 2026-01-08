// splash.js - VERSÃO REFINADA
document.addEventListener('DOMContentLoaded', function() {
  const splashScreen = document.getElementById('splash-screen');
  const body = document.body;
  const iframe = document.querySelector('iframe');
  
  // 1. Esconde iframe inicialmente
  if (iframe) {
    iframe.style.display = 'none';
    iframe.style.visibility = 'hidden';
  }
  
  // 2. Verificar se é app instalado
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const isInWebView = navigator.userAgent.includes('wv') || 
                      navigator.userAgent.includes('WebView');
  
  // 3. Se for NAVEGADOR comum: sem splash
  if (!isStandalone && !isInWebView) {
    console.log('🌐 Navegador web - Sem splash');
    if (splashScreen) splashScreen.style.display = 'none';
    if (iframe) {
      iframe.style.display = 'block';
      iframe.style.visibility = 'visible';
    }
    body.classList.add('splash-complete');
    return;
  }
  
  // 4. Se for APP INSTALADO: mostrar splash refinada
  console.log('📱 App instalado - Mostrando splash refinada');
  
  // Configuração de tempos (em milissegundos)
  const TIMING = {
    PIN_FADE_IN: 400,      // 0.7s
    PAUSE_AFTER_PIN: 300,  // 0.5s
    TEXT_SLIDE_IN: 500,    // 0.5s
    DISPLAY_BOTH: 1000,    // 3.0s
    FADE_OUT: 400          // 0.4s
  };
  
  // Tempo total: 0.7 + 0.5 + 0.5 + 3.0 + 0.4 = 5.1 segundos
  const TOTAL_DURATION = 
    TIMING.PIN_FADE_IN + 
    TIMING.PAUSE_AFTER_PIN + 
    TIMING.TEXT_SLIDE_IN + 
    TIMING.DISPLAY_BOTH + 
    TIMING.FADE_OUT;
  
  // Inicia o processo
  setTimeout(() => {
    // Fade out da splash
    splashScreen.classList.add('splash-fade-out');
    
    // Após fade out, mostrar iframe
    setTimeout(() => {
      body.classList.add('splash-complete');
      
      // Remove splash do DOM
      if (splashScreen.parentNode) {
        setTimeout(() => {
          splashScreen.parentNode.removeChild(splashScreen);
        }, 100);
      }
      
      // Mostra iframe
      if (iframe) {
        iframe.style.display = 'block';
        iframe.style.visibility = 'visible';
        iframe.style.opacity = '0';
        iframe.style.transition = 'opacity 0.3s ease';
        
        // Fade in do iframe
        setTimeout(() => {
          iframe.style.opacity = '1';
        }, 50);
      }
      
    }, TIMING.FADE_OUT);
    
  }, TOTAL_DURATION - TIMING.FADE_OUT);
  
  // Fallback de segurança
  setTimeout(() => {
    if (!body.classList.contains('splash-complete')) {
      console.log('⚠️ Fallback de segurança ativado');
      body.classList.add('splash-complete');
      if (splashScreen && splashScreen.parentNode) {
        splashScreen.parentNode.removeChild(splashScreen);
      }
      if (iframe) {
        iframe.style.display = 'block';
        iframe.style.visibility = 'visible';
      }
    }
  }, TOTAL_DURATION + 2000); // 2 segundos extra de segurança
});
