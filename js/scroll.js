/**
 * scroll.js — Efectos de scroll
 * - Barra de progreso de lectura
 * - Navbar: scroll state + link activo
 * - Reveal de elementos al entrar en viewport
 * - Animación del anillo de disciplina y contador
 * - Hamburger (menú móvil)
 */

(function () {

  /* ── Progreso de lectura ──────────────────────────────── */

  const progressBar = document.getElementById('progressBar');

  function updateProgress() {
    if (!progressBar) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = Math.min(pct, 100) + '%';
  }

  /* ── Navbar scroll state ─────────────────────────────── */

  const navbar = document.getElementById('navbar');

  function updateNavbar() {
    if (!navbar) return;
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  /* ── Link activo según sección visible ───────────────── */

  const navLinks = document.querySelectorAll('.navbar__link');
  const sections = document.querySelectorAll('section[id]');

  function updateActiveLink() {
    let current = '';
    sections.forEach((sec) => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) {
        current = sec.getAttribute('id');
      }
    });
    navLinks.forEach((link) => {
      const href = link.getAttribute('href').replace('#', '');
      link.classList.toggle('is-active', href === current);
    });
  }

  /* ── Scroll handler principal ────────────────────────── */

  let scrollTicking = false;

  function onScroll() {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        updateProgress();
        updateNavbar();
        updateActiveLink();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // Estado inicial
  updateProgress();
  updateNavbar();
  updateActiveLink();

  /* ── Reveal al entrar en viewport ────────────────────── */

  const reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && reveals.length) {
    const revealObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObs.unobserve(entry.target); // dispara solo una vez
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    reveals.forEach((el) => revealObs.observe(el));
  } else {
    // Fallback: mostrar todos
    reveals.forEach((el) => el.classList.add('visible'));
  }

  /* ── Animación del anillo y contador de disciplina ────── */

  const ring    = document.getElementById('disciplineRing');
  const counter = document.getElementById('statCounter');

  if (ring && 'IntersectionObserver' in window) {
    // Inyectar definición de gradiente en el SVG del ring
    const svg = ring.closest('svg');
    if (svg) {
      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      defs.innerHTML = `
        <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stop-color="var(--accent)" />
          <stop offset="100%" stop-color="var(--c-teal)" />
        </linearGradient>
      `;
      svg.insertBefore(defs, svg.firstChild);
      ring.setAttribute('stroke', 'url(#ringGradient)');
    }

    const ringObs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animateRing();
          ringObs.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    ringObs.observe(ring.closest('.discipline__ring-card') || ring);
  }

  function animateRing() {
    // r=50 → circunferencia = 2π×50 ≈ 314.16
    const CIRCUMFERENCE = 314.16;
    const TARGET_FILL   = 0.92; // 92% del anillo lleno
    const DURATION_MS   = 1500;
    const TARGET_OFFSET = CIRCUMFERENCE * (1 - TARGET_FILL);

    const startTime  = performance.now();
    const startCount = 0;
    const endCount   = 365;

    function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

    function frame(now) {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / DURATION_MS, 1);
      const eased    = easeOut(progress);

      // Anillo
      if (ring) {
        ring.style.strokeDashoffset = CIRCUMFERENCE - (CIRCUMFERENCE - TARGET_OFFSET) * eased;
      }

      // Contador numérico
      if (counter) {
        counter.textContent = Math.round(startCount + (endCount - startCount) * eased);
      }

      if (progress < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  /* ── Hamburger (menú móvil) ──────────────────────────── */

  const hamburger = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('navLinks');

  if (hamburger && navLinksEl) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinksEl.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Cerrar menú al hacer clic en un link
    navLinksEl.querySelectorAll('.navbar__link').forEach((link) => {
      link.addEventListener('click', () => {
        navLinksEl.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Cerrar menú con Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinksEl.classList.contains('open')) {
        navLinksEl.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        hamburger.focus();
      }
    });
  }

})();
