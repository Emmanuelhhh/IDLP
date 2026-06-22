/**
 * resources.js — Recursos recomendados por dimensión
 *
 * Genera dinámicamente secciones de libros en cada tarjeta de aspecto.
 * Para actualizar o agregar libros: edita solo el objeto LIBROS.
 * Para agregar un enlace real: reemplaza '#' por la URL del libro.
 *
 * Estructura de cada entrada:
 *   title  — Título del libro
 *   author — Autor(es)
 *   href   — URL (Amazon, Bookshop.org, etc.) — '#' si aún no definida
 */

(function () {

  /* ══════════════════════════════════════════════════════════
     DATOS — Edita aquí para actualizar los libros
  ══════════════════════════════════════════════════════════ */

  const LIBROS = {

    'Salud Física': [
      {
        title:  'Outlive: The Science and Art of Longevity',
        author: 'Peter Attia',
        href:   '#',
      },
      {
        title:  'Why We Sleep',
        author: 'Matthew Walker',
        href:   '#',
      },
    ],

    'Salud Mental': [
      {
        title:  'Feeling Good: The New Mood Therapy',
        author: 'David D. Burns',
        href:   '#',
      },
      {
        title:  'The Body Keeps the Score',
        author: 'Bessel van der Kolk',
        href:   '#',
      },
    ],

    'Espiritualidad': [
      {
        title:  'El poder del ahora',
        author: 'Eckhart Tolle',
        href:   '#',
      },
      {
        title:  'Meditaciones',
        author: 'Marco Aurelio',
        href:   '#',
      },
    ],

    'Finanzas': [
      {
        title:  'The Psychology of Money',
        author: 'Morgan Housel',
        href:   '#',
      },
      {
        title:  'I Will Teach You to Be Rich',
        author: 'Ramit Sethi',
        href:   '#',
      },
    ],

    'Familia': [
      {
        title:  'Los 5 lenguajes del amor',
        author: 'Gary Chapman',
        href:   '#',
      },
      {
        title:  'Padres conscientes',
        author: 'Shefali Tsabary',
        href:   '#',
      },
    ],

    'Relaciones': [
      {
        title:  'Comunicación no violenta',
        author: 'Marshall B. Rosenberg',
        href:   '#',
      },
      {
        title:  'Attached',
        author: 'Amir Levine & Rachel Heller',
        href:   '#',
      },
    ],

    'Aprendizaje': [
      {
        title:  'Ultralearning',
        author: 'Scott Young',
        href:   '#',
      },
      {
        title:  'Make It Stick',
        author: 'Peter C. Brown',
        href:   '#',
      },
    ],

    'Disciplina': [
      {
        title:  'The War of Art',
        author: 'Steven Pressfield',
        href:   '#',
      },
      {
        title:  "Can't Hurt Me",
        author: 'David Goggins',
        href:   '#',
      },
    ],

    'Propósito': [
      {
        title:  'El hombre en busca de sentido',
        author: 'Viktor E. Frankl',
        href:   '#',
      },
      {
        title:  'Start with Why',
        author: 'Simon Sinek',
        href:   '#',
      },
    ],

    'Trabajo y Profesión': [
      {
        title:  'Deep Work',
        author: 'Cal Newport',
        href:   '#',
      },
      {
        title:  "So Good They Can't Ignore You",
        author: 'Cal Newport',
        href:   '#',
      },
    ],

    'Descanso': [
      {
        title:  'Rest',
        author: 'Alex Soojung-Kim Pang',
        href:   '#',
      },
      {
        title:  'Do Nothing',
        author: 'Celeste Headlee',
        href:   '#',
      },
    ],

    'Hábitos': [
      {
        title:  'Atomic Habits',
        author: 'James Clear',
        href:   '#',
      },
      {
        title:  'The Power of Habit',
        author: 'Charles Duhigg',
        href:   '#',
      },
    ],

    'Tiempo': [
      {
        title:  'Esencialismo',
        author: 'Greg McKeown',
        href:   '#',
      },
      {
        title:  'Four Thousand Weeks',
        author: 'Oliver Burkeman',
        href:   '#',
      },
    ],

    'Contribución': [
      {
        title:  'Give and Take',
        author: 'Adam Grant',
        href:   '#',
      },
      {
        title:  'Los dones de la imperfección',
        author: 'Brené Brown',
        href:   '#',
      },
    ],

  };

  /* ══════════════════════════════════════════════════════════
     ÍCONOS SVG (inline para evitar peticiones de red)
  ══════════════════════════════════════════════════════════ */

  /** Ícono libro abierto (Feather BookOpen) */
  const SVG_BOOK = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>`;

  /** Chevron hacia abajo */
  const SVG_CHEVRON = `<svg class="card-resources__chevron" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
    stroke-linejoin="round" aria-hidden="true">
    <polyline points="6 9 12 15 18 9"/>
  </svg>`;

  /* ══════════════════════════════════════════════════════════
     GENERACIÓN DEL HTML
  ══════════════════════════════════════════════════════════ */

  /**
   * Genera el HTML de un enlace de libro individual.
   * tabindex="-1" mientras el acordeón está cerrado (accesibilidad).
   */
  function bookHTML(libro) {
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

  /**
   * Construye y adjunta la sección de recursos a una tarjeta.
   */
  function agregarRecursos(card, libros, id) {
    const section = document.createElement('div');
    section.className = 'card-resources-section';
    section.innerHTML = `
      <button class="card-resources__toggle"
        aria-expanded="false"
        aria-controls="${id}">
        <span>Lecturas recomendadas</span>
        ${SVG_CHEVRON}
      </button>
      <div class="card-resources" id="${id}" aria-hidden="true">
        <div class="card-resources__inner">
          ${libros.map(bookHTML).join('')}
        </div>
      </div>`;
    card.appendChild(section);
  }

  /* ══════════════════════════════════════════════════════════
     INICIALIZACIÓN — Recorre las 14 tarjetas y agrega recursos
  ══════════════════════════════════════════════════════════ */

  let idx = 0;

  document.querySelectorAll('.aspect-card').forEach((card) => {
    const titleEl = card.querySelector('.aspect-card__title');
    if (!titleEl) return;

    const titulo = titleEl.textContent.trim();
    const libros = LIBROS[titulo];
    if (!libros || libros.length === 0) return;

    agregarRecursos(card, libros, `res-${idx++}`);
  });

  /* ══════════════════════════════════════════════════════════
     INTERACCIÓN — Toggle expand / collapse
     Event delegation en el grid (un solo listener para 14 tarjetas)
  ══════════════════════════════════════════════════════════ */

  document.querySelector('.aspects__grid')?.addEventListener('click', (e) => {
    const toggle = e.target.closest('.card-resources__toggle');
    if (!toggle) return;

    const resourcesEl = document.getElementById(
      toggle.getAttribute('aria-controls')
    );
    if (!resourcesEl) return;

    const isOpen = resourcesEl.classList.toggle('open');

    /* Actualizar ARIA */
    toggle.setAttribute('aria-expanded', String(isOpen));
    resourcesEl.setAttribute('aria-hidden',  String(!isOpen));

    /* Hacer links tabulables solo cuando el acordeón está abierto */
    resourcesEl.querySelectorAll('.card-resource').forEach((link) => {
      link.setAttribute('tabindex', isOpen ? '0' : '-1');
    });
  });

  /* Soporte de teclado: cerrar con Escape mientras el foco está dentro */
  document.querySelector('.aspects__grid')?.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const toggle = e.target.closest('.card-resources-section')
      ?.querySelector('.card-resources__toggle[aria-expanded="true"]');
    if (!toggle) return;
    toggle.click();
    toggle.focus();
  });

})();
