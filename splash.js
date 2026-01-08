// splash.js
document.addEventListener('DOMContentLoaded', function() {
  const splashScreen = document.getElementById('splash-screen');
  const body = document.body;
  
  // Verifica se está rodando como app instalado
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const isInWebView = navigator.userAgent.includes('wv') || 
                      navigator.userAgent.includes('WebView');
  
  // Mostra splash apenas se for app instalado (não navegador comum)
  if (isStandalone || isInWebView) {
    console.log('📱 App instalado - Mostrando splash screen');
    
    // Configuração dos tempos (em milissegundos)
    const SPLASH_DURATION = 2500; // 2.5 segundos no total
    const FADE_OUT_DURATION = 500; // 0.5 segundos para desaparecer
    
    // Inicia a contagem
    setTimeout(() => {
      // Adiciona classe para fade out
      splashScreen.classList.add('fade-out');
      
      // Após o fade out, mostra o iframe
      setTimeout(() => {
        body.classList.add('splash-complete');
        
        // Remove completamente o elemento splash
        setTimeout(() => {
          if (splashScreen.parentNode) {
            splashScreen.parentNode.removeChild(splashScreen);
          }
        }, 100);
        
      }, FADE_OUT_DURATION);
      
    }, SPLASH_DURATION);
    
  } else {
    // Se for navegador comum, esconde splash imediatamente
    console.log('🌐 Navegador web - Escondendo splash');
    body.classList.add('splash-complete');
    if (splashScreen.parentNode) {
      splashScreen.parentNode.removeChild(splashScreen);
    }
  }
  
  // Fallback: Se algo der errado, remove splash após 5 segundos
  setTimeout(() => {
    if (!body.classList.contains('splash-complete')) {
      body.classList.add('splash-complete');
      if (splashScreen.parentNode) {
        splashScreen.parentNode.removeChild(splashScreen);
      }
    }
  }, 5000);
});
