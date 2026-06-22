/**
 * theme.js — Modo oscuro / claro
 * Persiste la preferencia en localStorage.
 * El HTML ya cargó data-theme antes de este script (inline en <head>).
 */

(function () {
  const STORAGE_KEY = 'ip-theme';
  const btn = document.getElementById('themeToggle');

  function getTheme() {
    return document.documentElement.getAttribute('data-theme') || 'light';
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    if (btn) {
      btn.setAttribute('aria-label',
        theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'
      );
    }
  }

  function toggle() {
    setTheme(getTheme() === 'dark' ? 'light' : 'dark');
  }

  if (btn) {
    btn.addEventListener('click', toggle);
  }

  // Respetar preferencia del sistema si no hay preferencia guardada
  if (!localStorage.getItem(STORAGE_KEY)) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) setTheme('dark');
  }

  // Escuchar cambios en la preferencia del sistema
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    // Solo actualizar si el usuario no ha elegido manualmente
    if (!localStorage.getItem(STORAGE_KEY)) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });
})();
