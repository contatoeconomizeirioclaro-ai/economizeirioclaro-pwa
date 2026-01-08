/* splash.css - VERSÃO REFINADA */
#splash-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #FFFFFF;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  opacity: 1;
  transition: opacity 0.4s ease;
}

body.splash-complete #splash-screen {
  opacity: 0;
  pointer-events: none;
  display: none;
}

.splash-container {
  text-align: center;
  width: 100%;
  max-width: 300px;
  padding: 20px;
}

/* PIN aumentado para 150px */
#splash-pin {
  width: 150px;
  height: 150px;
  margin: 0 auto 5px; /* Espaço de 5px abaixo */
  display: block;
  opacity: 0;
  transform: scale(0.9);
  animation: pinFadeIn 0.4s ease-out forwards;
}

/* TEXTO mantido 250px */
#splash-text {
  width: 250px;
  max-width: 90%;
  height: auto;
  display: block;
  margin: 0 auto;
  opacity: 0;
  transform: translateX(-40px);
  animation: textSlideIn 0.5s ease-out 0.7s forwards;
}

/* Animações ajustadas */
@keyframes pinFadeIn {
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes textSlideIn {
  0% {
    opacity: 0;
    transform: translateX(-40px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Fade out refinado */
.splash-fade-out {
  animation: splashFadeOut 0.4s ease-out forwards !important;
}

@keyframes splashFadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

/* Ajustes responsivos */
@media (min-width: 768px) {
  .splash-container {
    max-width: 400px;
  }
  
  #splash-pin {
    width: 180px;
    height: 180px;
  }
  
  #splash-text {
    width: 300px;
  }
}

/* Para telas muito altas (iPhone, etc) */
@media (max-height: 700px) {
  #splash-pin {
    width: 130px;
    height: 130px;
  }
  
  #splash-text {
    width: 220px;
  }
}
