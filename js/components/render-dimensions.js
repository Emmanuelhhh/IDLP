/**
 * render-dimensions.js — Genera las 14 tarjetas de dimensión y su acordeón de libros
 *
 * Depende de: js/data/dimensions.js (debe cargarse primero → window.DIMENSIONES)
 * Absorbe la lógica de resources.js (ya no es necesario cargar ese archivo).
 *
 * Flujo:
 *   1. Lee window.DIMENSIONES
 *   2. Genera el HTML de cada tarjeta + acordeón de lecturas
 *   3. Inyecta en #aspects-grid
 *   4. Registra los listeners de toggle (event delegation) y teclado (Escape)
 */

(function () {

  /* ══════════════════════════════════════════════════════════
     ÍCONOS SVG — paths inline para cero peticiones de red
  ══════════════════════════════════════════════════════════ */

  /**
   * Contenido interno de cada ícono SVG (sin la etiqueta <svg> exterior).
   * La etiqueta exterior la añade iconoSVG() con los atributos correctos.
   */
  const ICONOS = {

    activity: `<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>`,

    brain: `
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>
      <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>
      <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/>`,

    sun: `
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>`,

    trendingUp: `
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
      <polyline points="17 6 23 6 23 12"/>`,

    home: `
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>`,

    heart: `
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>`,

    bookOpen: `
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>`,

    zap: `<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>`,

    compass: `
      <circle cx="12" cy="12" r="10"/>
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>`,

    briefcase: `
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>`,

    moon: `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>`,

    refresh: `
      <polyline points="1 4 1 10 7 10"/>
      <polyline points="23 20 23 14 17 14"/>
      <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>`,

    clock: `
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>`,

    gift: `
      <polyline points="20 12 20 22 4 22 4 12"/>
      <rect x="2" y="7" width="20" height="5"/>
      <line x1="12" y1="22" x2="12" y2="7"/>
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>`,

  };

  /* ══════════════════════════════════════════════════════════
     SVG HELPERS
  ══════════════════════════════════════════════════════════ */

  /** Envuelve los paths del ícono en la etiqueta SVG correcta */
  function iconoSVG(name) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
      aria-hidden="true">${ICONOS[name] || ''}</svg>`;
  }

  /** Ícono libro abierto para las tarjetas de recursos */
  const SVG_BOOK = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>`;

  /** Chevron para el botón de acordeón */
  const SVG_CHEVRON = `<svg class="card-resources__chevron" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
    stroke-linejoin="round" aria-hidden="true">
    <polyline points="6 9 12 15 18 9"/>
  </svg>`;

  /* ══════════════════════════════════════════════════════════
     PLANTILLAS HTML
  ══════════════════════════════════════════════════════════ */

  /** Genera el HTML de un enlace de libro.
   *  tabindex="-1" por defecto → accesible solo cuando el acordeón está abierto. */
  function libroHTML(libro) {
    return `
        <a class="card-resource" href="${libro.href}"
          target="_blank" rel="noopener noreferrer"
          tabindex="-1"
          aria-label="Leer más sobre ${libro.title} de ${libro.author}">
          <div class="card-resource__icon">${SVG_BOOK}</div>
          <div class="card-resource__info">
            <span class="card-resource__title">${libro.title}</span>
            <span class="card-resource__author">${libro.author}</span>
          </div>
        </a>`;
  }

  /** Genera el bloque de lecturas recomendadas (acordeón) */
  function recursosHTML(libros, resId) {
    if (!libros || libros.length === 0) return '';
    return `
      <div class="card-resources-section">
        <button class="card-resources__toggle"
          aria-expanded="false"
          aria-controls="${resId}">
          <span>Lecturas recomendadas</span>
          ${SVG_CHEVRON}
        </button>
        <div class="card-resources" id="${resId}" aria-hidden="true">
          <div class="card-resources__inner">
            ${libros.map(libroHTML).join('')}
          </div>
        </div>
      </div>`;
  }

  /** Clases de delay para escalonar las animaciones de entrada (grupos de 4) */
  const DELAYS = ['', ' delay-1', ' delay-2', ' delay-3'];

  /** Genera el HTML completo de una tarjeta de dimensión */
  function tarjetaHTML(dim, idx) {
    const delay  = DELAYS[idx % 4];
    const resId  = `res-${idx}`;
    return `
    <article class="aspect-card reveal${delay}" data-color="${dim.color}">
      <div class="aspect-card__icon" aria-hidden="true">
        ${iconoSVG(dim.icon)}
      </div>
      <h3 class="aspect-card__title">${dim.title}</h3>
      <p class="aspect-card__quote">“${dim.quote}”</p>
      <p class="aspect-card__desc">${dim.desc}</p>
      <ul class="aspect-card__tips">
        ${dim.tips.map((t) => `<li>${t}</li>`).join('\n        ')}
      </ul>
      ${recursosHTML(dim.libros, resId)}
    </article>`;
  }

  /* ══════════════════════════════════════════════════════════
     RENDER — inyecta las 14 tarjetas en el DOM
  ══════════════════════════════════════════════════════════ */

  const grid = document.getElementById('aspects-grid');
  if (!grid) return;

  const dims = window.DIMENSIONES;
  if (!Array.isArray(dims) || dims.length === 0) return;

  grid.innerHTML = dims.map(tarjetaHTML).join('\n');

  /* ══════════════════════════════════════════════════════════
     INTERACCIÓN — acordeón de lecturas recomendadas
     Event delegation: un solo listener para todas las tarjetas
  ══════════════════════════════════════════════════════════ */

  grid.addEventListener('click', (e) => {
    const toggle = e.target.closest('.card-resources__toggle');
    if (!toggle) return;

    const resourcesEl = document.getElementById(
      toggle.getAttribute('aria-controls')
    );
    if (!resourcesEl) return;

    const isOpen = resourcesEl.classList.toggle('open');

    /* Actualizar atributos ARIA */
    toggle.setAttribute('aria-expanded', String(isOpen));
    resourcesEl.setAttribute('aria-hidden', String(!isOpen));

    /* Hacer links tabulables solo cuando el acordeón está abierto */
    resourcesEl.querySelectorAll('.card-resource').forEach((link) => {
      link.setAttribute('tabindex', isOpen ? '0' : '-1');
    });
  });

  /* Soporte de teclado: cerrar acordeón con Escape */
  grid.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const toggle = e.target
      .closest('.card-resources-section')
      ?.querySelector('.card-resources__toggle[aria-expanded="true"]');
    if (!toggle) return;
    toggle.click();
    toggle.focus();
  });

})();
