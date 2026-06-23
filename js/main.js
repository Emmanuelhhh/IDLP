/**
 * main.js — Inicialización general y efectos misceláneos
 * - Smooth scroll en links internos
 * - Parallax sutil del contenido del hero
 * - Botón "Volver arriba" con aparición/desaparición
 * - Newsletter form handler (validación + estado de éxito)
 * - Micro-interacciones menores
 */

(function () {

  /* ── Smooth scroll para links internos ───────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80; // altura del navbar sticky
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── Parallax sutil del contenido del hero ───────────── */
  const heroContent = document.querySelector('.hero__content');
  const heroScroll  = document.querySelector('.hero__scroll');

  if (heroContent) {
    let rafParallax;
    window.addEventListener('scroll', () => {
      if (!rafParallax) {
        rafParallax = requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const limit   = window.innerHeight;
          if (scrollY < limit) {
            const t = scrollY / limit;
            heroContent.style.transform = `translateY(${t * 40}px)`;
            heroContent.style.opacity   = String(Math.max(0, 1 - t * 1.2));
            if (heroScroll) {
              heroScroll.style.opacity = String(Math.max(0, 1 - t * 3));
            }
          }
          rafParallax = null;
        });
      }
    }, { passive: true });
  }

  /* ── Botón Volver Arriba ─────────────────────────────── */
  const backToTop = document.getElementById('backToTop');

  if (backToTop) {
    const SHOW_THRESHOLD = 420; // px desde el top para mostrar el botón

    // Mostrar/ocultar según scroll
    let rafBtt;
    window.addEventListener('scroll', () => {
      if (!rafBtt) {
        rafBtt = requestAnimationFrame(() => {
          if (window.scrollY > SHOW_THRESHOLD) {
            backToTop.classList.add('visible');
          } else {
            backToTop.classList.remove('visible');
          }
          rafBtt = null;
        });
      }
    }, { passive: true });

    // Scroll suave al top
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Estado inicial
    if (window.scrollY > SHOW_THRESHOLD) {
      backToTop.classList.add('visible');
    }
  }

  /* ── Newsletter Form (MailerLite) ────────────────────── */
  const ML_ACCOUNT = '2464268';
  // Crea un formulario en MailerLite → Forms → Embedded y pega su ID aquí:
  const ML_FORM_ID = '191022997885158971';

  const form        = document.getElementById('newsletterForm');
  const emailInput  = document.getElementById('newsletterEmail');
  const errorMsg    = document.getElementById('newsletterError');
  const successBox  = document.getElementById('newsletterSuccess');

  if (form && emailInput) {

    emailInput.addEventListener('input', () => {
      emailInput.classList.remove('error');
      if (errorMsg) {
        errorMsg.hidden = true;
        errorMsg.textContent = 'Por favor ingresa un correo electrónico válido.';
      }
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const email = emailInput.value.trim();
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!valid) {
        emailInput.classList.add('error');
        if (errorMsg) errorMsg.hidden = false;
        emailInput.focus();
        return;
      }

      const submitBtn = form.querySelector('[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      const body = new FormData();
      body.append('fields[email]', email);
      body.append('ml_submit', '1');
      body.append('anticsrf', 'true');

      fetch(
        `https://assets.mailerlite.com/jsonp/${ML_ACCOUNT}/forms/${ML_FORM_ID}/subscribe`,
        { method: 'POST', body }
      )
        .then((res) => (res.ok ? res.json() : Promise.reject()))
        .then((data) => {
          if (data && data.success) {
            mostrarExito();
          } else {
            throw new Error();
          }
        })
        .catch(() => {
          if (submitBtn) submitBtn.disabled = false;
          emailInput.classList.add('error');
          if (errorMsg) {
            errorMsg.textContent = 'No se pudo completar la suscripción. Inténtalo de nuevo.';
            errorMsg.hidden = false;
          }
        });
    });

    function mostrarExito() {
      form.style.transition = 'opacity 300ms ease, transform 300ms ease';
      form.style.opacity    = '0';
      form.style.transform  = 'translateY(-8px)';

      setTimeout(() => {
        form.hidden = true;
        form.style.cssText = '';
        if (successBox) {
          successBox.hidden = false;
          successBox.focus();
        }
      }, 320);
    }
  }

  /* ── Foco en tarjetas de dimensión (accesibilidad) ────── */
  document.querySelectorAll('.aspect-card').forEach((card) => {
    card.addEventListener('focusin', () => {
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });

  /* ── Easter egg en el logo IP ────────────────────────── */
  const logoMark = document.querySelector('.navbar__logo-mark');
  if (logoMark) {
    let clicks = 0;
    let resetTimer;
    logoMark.addEventListener('click', (e) => {
      e.preventDefault();
      clicks++;
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => { clicks = 0; }, 1500);
      if (clicks >= 5) {
        clicks = 0;
        logoMark.style.background = 'linear-gradient(135deg, var(--c-violet), var(--c-rose))';
        setTimeout(() => { logoMark.style.background = ''; }, 1200);
      }
    });
  }

  /* ── Marcar carga completa ───────────────────────────── */
  window.addEventListener('load', () => {
    document.body.classList.add('loaded');
  });

})();
