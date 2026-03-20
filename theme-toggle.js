(function () {
  'use strict';

  const STORAGE_KEY = 'johnb-theme';
  const DARKER = 'darker';

  const btn = document.getElementById('theme-toggle');
  const icon = document.getElementById('theme-toggle-icon');
  const label = document.getElementById('theme-toggle-label');

  function applyTheme(theme) {
    if (theme === DARKER) {
      document.documentElement.setAttribute('data-theme', DARKER);
      icon.textContent = '🌑';
      label.textContent = 'Even Darker Mode';
      btn.setAttribute('aria-label', 'Switch to dark mode');
    } else {
      document.documentElement.removeAttribute('data-theme');
      icon.textContent = '🌙';
      label.textContent = 'Dark Mode';
      btn.setAttribute('aria-label', 'Switch to even darker mode');
    }
  }

  function toggle() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === DARKER ? 'dark' : DARKER;
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  }

  // Restore saved preference
  const saved = localStorage.getItem(STORAGE_KEY);
  applyTheme(saved === DARKER ? DARKER : 'dark');

  btn.addEventListener('click', toggle);
})();
