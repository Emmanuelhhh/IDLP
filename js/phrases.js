/**
 * phrases.js — Rotación automática de frases inspiradoras
 * Cambia la quote activa cada 5 segundos con transición suave.
 * El usuario puede navegar manualmente con los dots.
 */

(function () {
  const track   = document.getElementById('quotesTrack');
  const dotsEl  = document.getElementById('quotesDots');
  if (!track || !dotsEl) return;

  const items = track.querySelectorAll('.quote-item');
  const dots  = dotsEl.querySelectorAll('.quote-dot');
  const INTERVAL_MS = 5000;

  let current  = 0;
  let timer    = null;
  let paused   = false;

  function goTo(index) {
    items[current].classList.remove('active');
    dots[current].classList.remove('active');
    dots[current].setAttribute('aria-selected', 'false');

    current = (index + items.length) % items.length;

    items[current].classList.add('active');
    dots[current].classList.add('active');
    dots[current].setAttribute('aria-selected', 'true');
  }

  function next() {
    goTo(current + 1);
  }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
      if (!paused) next();
    }, INTERVAL_MS);
  }

  // Navegación por dots
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      goTo(Number(dot.dataset.index));
      startTimer(); // reiniciar timer al navegar manualmente
    });
  });

  // Pausar al hover (permite leer con calma)
  const rotator = document.querySelector('.quotes-rotator');
  if (rotator) {
    rotator.addEventListener('mouseenter', () => { paused = true; });
    rotator.addEventListener('mouseleave', () => { paused = false; });
    rotator.addEventListener('focusin',   () => { paused = true; });
    rotator.addEventListener('focusout',  () => { paused = false; });
  }

  // Touch swipe para móvil
  let touchStartX = null;
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  track.addEventListener('touchend', (e) => {
    if (touchStartX === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 40) {
      goTo(delta < 0 ? current + 1 : current - 1);
      startTimer();
    }
    touchStartX = null;
  }, { passive: true });

  startTimer();
})();
