/**
 * cursor-closet.js
 * Sliding drawer with costume options that swap the page cursor.
 *
 * To add more image-based cursors, drop an image in the project
 * and add an entry to the `costumes` array below.
 */
(function () {
  'use strict';

  /**
   * Costume definition:
   *   name       {string}  display label
   *   preview    {string}  emoji or text shown in the grid tile
   *   previewImg {string}  (optional) path to image used as the tile preview
   *   cursor     {string}  CSS cursor value applied to <body>
   */
  const costumes = [
    {
      name: 'Potato',
      previewImg: 'Potato.webp',
      cursor: "url('Potato_64.png'), auto",
    },
    {
      name: 'Default',
      preview: '↖',
      cursor: 'default',
    },
    {
      name: 'Crosshair',
      preview: '⊕',
      cursor: 'crosshair',
    },
    {
      name: 'Magnify',
      preview: '🔍',
      cursor: 'zoom-in',
    },
    {
      name: 'Grab',
      preview: '✋',
      cursor: 'grab',
    },
    {
      name: 'Wand',
      preview: '🪄',
      cursor: 'cell',
    },
    // Add more here:
    // {
    //   name: 'My Thing',
    //   previewImg: 'cursors/my-thing.png',
    //   cursor: "url('cursors/my-thing.png') 16 16, auto",
    // },
  ];

  // Start on Potato
  let activeCostume = costumes.find((c) => c.name === 'Potato') || costumes[0];

  function init() {
    const drawer = document.getElementById('closet-drawer');
    const toggle = document.getElementById('closet-toggle');
    const grid = document.getElementById('costume-grid');
    if (!drawer || !toggle || !grid) return;

    applyCursor(activeCostume);
    buildGrid(grid, drawer);
    wireToggle(drawer, toggle);
  }

  // ---- Grid ----------------------------------------------------------

  function buildGrid(grid, drawer) {
    costumes.forEach((costume) => {
      const card = document.createElement('div');
      card.className = 'costume-card' + (costume === activeCostume ? ' active' : '');
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', 'Use ' + costume.name + ' cursor');

      const preview = document.createElement('div');
      preview.className = 'costume-preview';

      if (costume.previewImg) {
        const img = document.createElement('img');
        img.src = costume.previewImg;
        img.alt = costume.name;
        preview.appendChild(img);
      } else {
        preview.textContent = costume.preview || '?';
      }

      const nameEl = document.createElement('div');
      nameEl.className = 'costume-name';
      nameEl.textContent = costume.name;

      card.appendChild(preview);
      card.appendChild(nameEl);

      const pick = () => {
        activeCostume = costume;
        applyCursor(costume);
        grid.querySelectorAll('.costume-card').forEach((c) =>
          c.classList.remove('active')
        );
        card.classList.add('active');
        // Close the drawer after a beat
        setTimeout(() => closeDrawer(drawer), 280);
      };

      card.addEventListener('click', pick);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          pick();
        }
      });

      grid.appendChild(card);
    });
  }

  // ---- Drawer toggle -------------------------------------------------

  function wireToggle(drawer, toggle) {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation(); // prevent document click from immediately closing
      const isOpen = drawer.classList.contains('open');
      isOpen ? closeDrawer(drawer) : openDrawer(drawer);
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (drawer.classList.contains('open') && !drawer.contains(e.target)) {
        closeDrawer(drawer);
      }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        closeDrawer(drawer);
        toggle.focus();
      }
    });
  }

  function openDrawer(drawer) {
    drawer.classList.add('open');
    drawer.querySelector('.closet-toggle').setAttribute('aria-expanded', 'true');
    drawer.querySelector('.closet-content').setAttribute('aria-hidden', 'false');
    updateToggleLabel(drawer, true);
  }

  function closeDrawer(drawer) {
    drawer.classList.remove('open');
    drawer.querySelector('.closet-toggle').setAttribute('aria-expanded', 'false');
    drawer.querySelector('.closet-content').setAttribute('aria-hidden', 'true');
    updateToggleLabel(drawer, false);
  }

  function updateToggleLabel(drawer, isOpen) {
    const label = drawer.querySelector('.closet-tab-text');
    if (label) label.textContent = isOpen ? '✕ close closet' : '👗 Costume Closet';
  }

  // ---- Cursor --------------------------------------------------------

  function applyCursor(costume) {
    document.body.style.cursor = costume.cursor;
  }

  // ---- Boot ----------------------------------------------------------

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
