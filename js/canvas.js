/**
 * canvas.js — Animación de fondo del hero
 * Partículas flotantes sutiles conectadas por líneas tenues.
 * Reacciona al movimiento del ratón con paralaje suave.
 */

(function () {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: -9999, y: -9999 };
  let animId;
  let W, H;

  /* ── Config ─────────────────────────────────────────── */

  const CFG = {
    count: 55,
    maxRadius: 2.5,
    minRadius: 0.8,
    maxSpeed: 0.35,
    connectionDist: 130,
    mouseRepelDist: 100,
    mouseRepelForce: 0.018,
  };

  /* ── Helpers ─────────────────────────────────────────── */

  function isDark() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  function particleColor(alpha) {
    return isDark()
      ? `rgba(107, 163, 216, ${alpha})`   // azul suave en dark
      : `rgba(43,  95,  168, ${alpha})`;   // azul en light
  }

  function lineColor(alpha) {
    return isDark()
      ? `rgba(107, 163, 216, ${alpha})`
      : `rgba(43,  95,  168, ${alpha})`;
  }

  /* ── Partícula ───────────────────────────────────────── */

  class Particle {
    constructor() { this.reset(true); }

    reset(initial = false) {
      this.x  = Math.random() * W;
      this.y  = initial ? Math.random() * H : -10;
      this.r  = CFG.minRadius + Math.random() * (CFG.maxRadius - CFG.minRadius);
      const angle = Math.random() * Math.PI * 2;
      const spd   = (0.05 + Math.random()) * CFG.maxSpeed;
      this.vx = Math.cos(angle) * spd;
      this.vy = Math.sin(angle) * spd;
      this.alpha = 0.15 + Math.random() * 0.45;
    }

    update() {
      // Repulsión por mouse
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.hypot(dx, dy);
      if (dist < CFG.mouseRepelDist && dist > 0) {
        const force = (CFG.mouseRepelDist - dist) / CFG.mouseRepelDist;
        this.vx += (dx / dist) * force * CFG.mouseRepelForce;
        this.vy += (dy / dist) * force * CFG.mouseRepelForce;
      }

      // Fricción
      this.vx *= 0.992;
      this.vy *= 0.992;

      this.x += this.vx;
      this.y += this.vy;

      // Rebote en bordes
      if (this.x < -10 || this.x > W + 10 || this.y < -10 || this.y > H + 10) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = particleColor(this.alpha);
      ctx.fill();
    }
  }

  /* ── Resize ──────────────────────────────────────────── */

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    W = canvas.offsetWidth;
    H = canvas.offsetHeight;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);
  }

  /* ── Init ────────────────────────────────────────────── */

  function init() {
    resize();
    particles = Array.from({ length: CFG.count }, () => new Particle());
  }

  /* ── Dibujado de conexiones ──────────────────────────── */

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < CFG.connectionDist) {
          const alpha = (1 - dist / CFG.connectionDist) * 0.12;
          ctx.beginPath();
          ctx.strokeStyle = lineColor(alpha);
          ctx.lineWidth   = 0.7;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
  }

  /* ── Loop principal ──────────────────────────────────── */

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    animId = requestAnimationFrame(loop);
  }

  /* ── Eventos ─────────────────────────────────────────── */

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      cancelAnimationFrame(animId);
      init();
      loop();
    }, 200);
  });

  // Pausar cuando no está visible (ahorro de batería)
  const hero = document.getElementById('hero');
  if (hero && 'IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        if (!animId) loop();
      } else {
        cancelAnimationFrame(animId);
        animId = null;
      }
    }, { threshold: 0.1 });
    obs.observe(hero);
  }

  /* ── Start ───────────────────────────────────────────── */
  init();
  loop();
})();
