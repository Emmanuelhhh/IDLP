/**
 * quiz.js — Autoevaluación: ¿Cuál dimensión necesitas más?
 *
 * Depende de: js/data/dimensions.js  →  window.DIMENSIONES
 * Persiste:   localStorage 'ip-quiz-scores'
 *
 * Flujo:
 *   1. Renderiza 14 ítems en #quizGrid (dot + nombre + 5 segmentos + etiqueta)
 *   2. Cada clic actualiza el ítem y la barra de progreso
 *   3. Al completar las 14 → aparece el botón "Ver mi diagnóstico"
 *   4. Al enviar → muestra resultados: card prioritaria + gráfico de barras
 *   5. "Volver a evaluar" → resetea todo
 */

(function () {

  /* ── Guardia ─────────────────────────────────────────────── */

  const DIMS = window.DIMENSIONES;
  if (!Array.isArray(DIMS) || DIMS.length === 0) return;

  /* ── Historial de evaluaciones ──────────────────────────── */

  const HISTORY_KEY   = 'ip-quiz-history';
  const MAX_SNAPSHOTS = 10;

  function loadHistory() {
    try {
      const raw = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
      return Array.isArray(raw) ? raw : [];
    } catch (_) { return []; }
  }

  function saveSnapshot() {
    const h = loadHistory();
    h.push({ ts: Date.now(), scores: [...scores] });
    if (h.length > MAX_SNAPSHOTS) h.splice(0, h.length - MAX_SNAPSHOTS);
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(h)); } catch (_) { /* noop */ }
  }

  /** Devuelve el HTML del badge de delta (↑+2 / ↓-1 / —) */
  function deltaTag(d) {
    if (d === null) return '';
    if (d > 0) return `<span class="results__delta results__delta--up" aria-label="Subió ${d}">+${d}</span>`;
    if (d < 0) return `<span class="results__delta results__delta--down" aria-label="Bajó ${Math.abs(d)}">${d}</span>`;
    return `<span class="results__delta results__delta--same" aria-label="Sin cambio">—</span>`;
  }

  const gridEl       = document.getElementById('quizGrid');
  const resultsEl    = document.getElementById('quizResults');
  const submitEl     = document.getElementById('quizSubmit');
  const progressFill = document.getElementById('quizProgressFill');
  const progressText = document.getElementById('quizProgressText');
  const progressTrack = document.querySelector('.quiz__progress-track');
  const quizWrap     = document.getElementById('quiz');

  if (!gridEl || !resultsEl || !quizWrap) return;

  /* ── Estado ──────────────────────────────────────────────── */

  const scores = new Array(DIMS.length).fill(0);

  const LABELS = [
    '',
    'Descuidada',
    'Básica',
    'En desarrollo',
    'Sólida',
    'Floreciente',
  ];

  /* Restaurar sesión previa */
  try {
    const saved = JSON.parse(localStorage.getItem('ip-quiz-scores') || 'null');
    if (Array.isArray(saved)) {
      saved.forEach((s, i) => {
        if (i < scores.length && Number.isInteger(s) && s >= 0 && s <= 5) {
          scores[i] = s;
        }
      });
    }
  } catch (_) { /* noop */ }

  /* ── Plantilla de ítem ───────────────────────────────────── */

  function itemHTML(dim, idx) {
    const s = scores[idx];
    return `
      <div class="quiz__item${s ? ' answered' : ''}"
           data-idx="${idx}"
           style="--item-color: var(--c-${dim.color})">

        <div class="quiz__item-label">
          <span class="quiz__dot" aria-hidden="true"></span>
          <span class="quiz__item-name">${dim.title}</span>
        </div>

        <div class="quiz__item-right">
          <div class="quiz__scale"
               role="group"
               aria-label="Nivel en ${dim.title}">
            ${[1, 2, 3, 4, 5].map((n) => `
              <button class="quiz__seg${s >= n ? ' filled' : ''}"
                      data-score="${n}"
                      aria-label="${LABELS[n]}"
                      aria-pressed="${String(s === n)}"
                      title="${LABELS[n]}"></button>
            `).join('')}
          </div>
          <span class="quiz__lbl${s ? ' quiz__lbl--active' : ''}">
            ${s ? LABELS[s] : 'Sin evaluar'}
          </span>
        </div>

      </div>`;
  }

  /* ── Render completo del grid ────────────────────────────── */

  function renderItems() {
    gridEl.innerHTML = DIMS.map(itemHTML).join('');
  }

  /* ── Actualizar un único ítem (sin re-renderizar todo) ────── */

  function updateItem(idx) {
    const item = gridEl.querySelector(`.quiz__item[data-idx="${idx}"]`);
    if (!item) return;
    const s = scores[idx];

    item.classList.toggle('answered', s > 0);

    item.querySelectorAll('.quiz__seg').forEach((seg) => {
      const n = parseInt(seg.dataset.score, 10);
      seg.classList.toggle('filled', s >= n);
      seg.setAttribute('aria-pressed', String(s === n));
    });

    const lbl = item.querySelector('.quiz__lbl');
    if (lbl) {
      lbl.textContent = s ? LABELS[s] : 'Sin evaluar';
      lbl.classList.toggle('quiz__lbl--active', s > 0);
    }
  }

  /* ── Barra de progreso ───────────────────────────────────── */

  function updateProgress() {
    const done    = scores.filter(Boolean).length;
    const total   = DIMS.length;
    const pct     = (done / total) * 100;
    const allDone = done === total;

    if (progressFill) progressFill.style.width = pct + '%';

    if (progressText) {
      progressText.textContent = allDone
        ? '¡Listo! Puedes ver tu diagnóstico ahora.'
        : `${done} / ${total} dimensiones evaluadas`;
    }

    if (progressTrack) {
      progressTrack.setAttribute('aria-valuenow', String(done));
    }

    /* Botón submit: clase + inert + aria-hidden */
    if (submitEl) {
      submitEl.classList.toggle('ready', allDone);
      if (allDone) {
        submitEl.removeAttribute('inert');
        submitEl.removeAttribute('aria-hidden');
      } else {
        submitEl.setAttribute('inert', '');
        submitEl.setAttribute('aria-hidden', 'true');
      }
    }
  }

  /* ── Registrar puntuación ────────────────────────────────── */

  function handleScore(idx, n) {
    /* Click en el mismo segmento → deseleccionar */
    scores[idx] = (scores[idx] === n) ? 0 : n;
    updateItem(idx);
    updateProgress();
    try {
      localStorage.setItem('ip-quiz-scores', JSON.stringify(scores));
    } catch (_) { /* noop */ }
  }

  /* ── Renderizar resultados ───────────────────────────────── */

  function renderResults() {
    /* ── Historial: leer ANTES de guardar para comparar ─────── */
    const history    = loadHistory();
    const prev       = history.length > 0 ? history[history.length - 1] : null;
    const prevScores = prev ? prev.scores : null;

    const getDelta = (origIdx) =>
      prevScores ? scores[origIdx] - (prevScores[origIdx] ?? 0) : null;

    /* Guardar snapshot de esta evaluación en el historial */
    saveSnapshot();

    /* ── Ordenar ascendente: menor puntuación = mayor necesidad */
    const sorted = DIMS
      .map((dim, i) => ({ dim, score: scores[i], origIdx: i }))
      .sort((a, b) => a.score - b.score);

    const top = sorted[0];

    /* ── Banner de comparación con evaluación anterior ───────── */
    let historyBanner = '';
    if (prev) {
      const date = new Date(prev.ts).toLocaleDateString('es', {
        day: 'numeric', month: 'long', year: 'numeric',
      });
      const improved = scores.filter((s, i) => s > (prevScores[i] ?? 0)).length;
      const declined = scores.filter((s, i) => s < (prevScores[i] ?? 0)).length;
      const same     = DIMS.length - improved - declined;

      const avgRaw     = scores.reduce((a, b) => a + b, 0) / scores.length;
      const prevAvgRaw = prevScores.reduce((a, b) => a + b, 0) / prevScores.length;
      const avgDelta   = avgRaw - prevAvgRaw;

      historyBanner = `
        <div class="results__history-banner">
          <div class="results__history-header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
                 stroke-linecap="round" stroke-linejoin="round" width="16" height="16" aria-hidden="true">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
            <span>Comparado con tu evaluación del <strong>${date}</strong></span>
          </div>
          <div class="results__history-stats">
            ${improved > 0 ? `<span class="results__hstat results__hstat--up">↑ ${improved} mejoraron</span>` : ''}
            ${declined > 0 ? `<span class="results__hstat results__hstat--down">↓ ${declined} bajaron</span>` : ''}
            ${same      > 0 ? `<span class="results__hstat results__hstat--same">→ ${same} igual</span>` : ''}
            <span class="results__hstat results__hstat--avg">
              Promedio ${prevAvgRaw.toFixed(1)} → <strong>${avgRaw.toFixed(1)}</strong>
              <em>${avgDelta > 0 ? `+${avgDelta.toFixed(1)}` : avgDelta < 0 ? avgDelta.toFixed(1) : '='}</em>
            </span>
          </div>
        </div>`;
    } else {
      historyBanner = `
        <div class="results__history-banner results__history-banner--first">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
               stroke-linecap="round" stroke-linejoin="round" width="16" height="16" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>Primera evaluación guardada. Vuelve en una semana para ver tu evolución.</span>
        </div>`;
    }

    resultsEl.innerHTML = `
      ${historyBanner}

      <!-- ▸ Card prioridad #1 -->
      <div class="results__priority"
           style="--priority-color: var(--c-${top.dim.color})">

        <span class="results__priority-badge">Tu prioridad #1</span>

        <div class="results__priority-color-bar" aria-hidden="true"></div>

        <div class="results__priority-body">
          <div class="results__priority-dot" aria-hidden="true"></div>
          <div class="results__priority-text">
            <h3 class="results__priority-title">${top.dim.title}</h3>
            <p class="results__priority-quote">"${top.dim.quote}"</p>
            <p class="results__priority-desc">${top.dim.desc}</p>
          </div>
        </div>

        <a href="#aspects" class="btn btn--primary results__priority-cta">
          Explorar esta dimensión
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
               width="16" height="16" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </a>
      </div>

      <!-- ▸ Gráfico completo -->
      <div class="results__chart-header">
        <h4 class="results__chart-title">Tu panorama completo</h4>
        <p class="results__chart-sub">
          Las tres primeras son tu foco inicial —
          no todo a la vez, pero sí con intención.
        </p>
      </div>

      <div class="results__chart"
           role="list"
           aria-label="Puntuaciones por dimensión, de menor a mayor">
        ${sorted.map(({ dim, score, origIdx }, rank) => `
          <div class="results__row${rank < 3 ? ' results__row--focus' : ''}"
               role="listitem"
               style="--item-color: var(--c-${dim.color})">
            <div class="results__row-label">
              <span class="quiz__dot" aria-hidden="true"></span>
              <span class="results__row-name">${dim.title}</span>
              ${rank < 3 ? '<span class="results__focus-tag" aria-label="dimensión de foco">foco</span>' : ''}
            </div>
            <div class="results__bar-track"
                 role="progressbar"
                 aria-valuenow="${score}"
                 aria-valuemin="0"
                 aria-valuemax="5"
                 aria-label="${dim.title}: ${score} de 5 puntos">
              <div class="results__bar-fill"
                   data-w="${score * 20}"
                   style="width: 0%"></div>
            </div>
            <span class="results__row-score">
              ${score}<span class="results__row-max">/5</span>
            </span>
            ${deltaTag(getDelta(origIdx))}
          </div>
        `).join('')}
      </div>

      <!-- ▸ Acciones -->
      <div class="results__actions">
        <button class="btn btn--ghost" id="quizReset">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
               width="16" height="16" aria-hidden="true">
            <polyline points="1 4 1 10 7 10"/>
            <path d="M3.51 15a9 9 0 1 0 .49-4.7"/>
          </svg>
          Volver a evaluar
        </button>
        <a href="#aspects" class="btn btn--primary">Ver las 14 dimensiones</a>
      </div>
    `;

    /* Ocultar quiz, mostrar resultados */
    quizWrap.hidden = true;
    resultsEl.removeAttribute('hidden');

    /* Animar barras (doble rAF garantiza layout completo antes de transición) */
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        resultsEl.querySelectorAll('.results__bar-fill').forEach((bar) => {
          bar.style.width = bar.dataset.w + '%';
        });
      });
    });

    /* Scroll suave al inicio de la sección de resultados */
    const section = resultsEl.closest('.section');
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    /* Listener del botón reset */
    document.getElementById('quizReset')?.addEventListener('click', reset);
  }

  /* ── Reset ───────────────────────────────────────────────── */

  function reset() {
    scores.fill(0);
    try { localStorage.removeItem('ip-quiz-scores'); } catch (_) { /* noop */ }

    resultsEl.setAttribute('hidden', '');
    quizWrap.hidden = false;

    renderItems();
    updateProgress();

    quizWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ── Listeners ───────────────────────────────────────────── */

  /* Clic en segmento — event delegation */
  gridEl.addEventListener('click', (e) => {
    const seg  = e.target.closest('.quiz__seg');
    if (!seg) return;
    const item = seg.closest('.quiz__item');
    if (!item) return;
    handleScore(
      parseInt(item.dataset.idx, 10),
      parseInt(seg.dataset.score,  10)
    );
  });

  /* Teclado: ← → ajustan la puntuación del ítem en foco */
  gridEl.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    const seg = e.target.closest('.quiz__seg');
    if (!seg) return;
    e.preventDefault();
    const item  = seg.closest('.quiz__item');
    const idx   = parseInt(item.dataset.idx, 10);
    const delta = e.key === 'ArrowRight' ? 1 : -1;
    const next  = Math.max(1, Math.min(5, (scores[idx] || 0) + delta));
    handleScore(idx, next);
    /* Mover foco al segmento correcto */
    item.querySelectorAll('.quiz__seg')[next - 1]?.focus();
  });

  /* Botón "Ver mi diagnóstico" */
  submitEl?.addEventListener('click', renderResults);

  /* ── Inicialización ──────────────────────────────────────── */

  renderItems();
  updateProgress();

})();
