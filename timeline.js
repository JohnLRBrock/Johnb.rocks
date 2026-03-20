/**
 * timeline.js
 * Reads `timelineContent` from content.js, renders the timeline,
 * and wires up tag-based filtering.
 */
(function () {
  'use strict';

  // Tags currently active in the filter (empty = show all)
  const activeTags = new Set();

  function init() {
    const controlsEl = document.getElementById('timeline-controls');
    const timelineEl = document.getElementById('timeline');
    if (!controlsEl || !timelineEl) return;

    // Sort newest-first
    const items = [...timelineContent].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    // Collect all unique tags (preserving first-seen order)
    const allTags = [...new Set(items.flatMap((item) => item.tags || []))];

    renderFilters(controlsEl, allTags, items);
    renderTimeline(timelineEl, items);
  }

  // ---- Filters -------------------------------------------------------

  function renderFilters(container, tags, items) {
    if (tags.length === 0) return;

    const label = document.createElement('p');
    label.className = 'filters-label';
    label.textContent = 'Filter by tag';
    container.appendChild(label);

    const filtersRow = document.createElement('div');
    filtersRow.className = 'tag-filters';
    filtersRow.id = 'tag-filters';
    container.appendChild(filtersRow);

    // "All" clears the filter
    const allBtn = makeTagButton('✦ all', 'all-btn', () => {
      activeTags.clear();
      syncFilterButtons(filtersRow);
      filterTimeline();
    });
    filtersRow.appendChild(allBtn);

    tags.forEach((tag) => {
      const btn = makeTagButton('#' + tag, '', () => {
        if (activeTags.has(tag)) {
          activeTags.delete(tag);
        } else {
          activeTags.add(tag);
        }
        syncFilterButtons(filtersRow);
        filterTimeline();
      });
      btn.dataset.tag = tag;
      filtersRow.appendChild(btn);
    });

    syncFilterButtons(filtersRow);
  }

  function makeTagButton(label, extraClass, onClick) {
    const btn = document.createElement('button');
    btn.className = 'tag-btn' + (extraClass ? ' ' + extraClass : '');
    btn.textContent = label;
    btn.addEventListener('click', onClick);
    return btn;
  }

  function syncFilterButtons(filtersRow) {
    filtersRow.querySelectorAll('.tag-btn:not(.all-btn)').forEach((btn) => {
      btn.classList.toggle('active', activeTags.has(btn.dataset.tag));
    });
    const allBtn = filtersRow.querySelector('.all-btn');
    if (allBtn) {
      allBtn.classList.toggle('active', activeTags.size === 0);
    }
  }

  // ---- Timeline rendering --------------------------------------------

  function renderTimeline(container, items) {
    container.innerHTML = '';

    if (!items || items.length === 0) {
      container.innerHTML = '<p class="no-content">Nothing here yet — check back soon.</p>';
      return;
    }

    items.forEach((item) => {
      container.appendChild(buildItem(item));
    });
  }

  function buildItem(item) {
    const article = document.createElement('article');
    article.className = 'timeline-item';
    if (item.type) article.dataset.type = item.type;
    article.dataset.tags = JSON.stringify(item.tags || []);

    // Date
    const dateEl = document.createElement('div');
    dateEl.className = 'timeline-date';
    dateEl.textContent = formatDate(item.date);
    article.appendChild(dateEl);

    // Card
    const card = document.createElement('div');
    card.className = 'timeline-card';
    article.appendChild(card);

    const title = document.createElement('h3');
    title.textContent = item.title;
    card.appendChild(title);

    const body = document.createElement('div');
    body.className = 'card-body';
    body.innerHTML = item.body; // allows basic inline HTML
    card.appendChild(body);

    if (item.link) {
      const linkEl = document.createElement('a');
      linkEl.className = 'card-link';
      linkEl.href = item.link.url;
      linkEl.textContent = item.link.text + ' →';
      if (!item.link.url.startsWith('#')) {
        linkEl.target = '_blank';
        linkEl.rel = 'noopener noreferrer';
      }
      card.appendChild(linkEl);
    }

    if (item.music) {
      const playerEl = document.createElement('div');
      playerEl.className = 'music-player';
      playerEl.dataset.src = item.music;
      playerEl.dataset.title = item.title;
      card.appendChild(playerEl);
    }

    if (item.tags && item.tags.length) {
      const tagsEl = document.createElement('div');
      tagsEl.className = 'card-tags';
      item.tags.forEach((tag) => {
        const tagEl = document.createElement('span');
        tagEl.className = 'card-tag';
        tagEl.textContent = '#' + tag;
        tagEl.dataset.tag = tag;
        tagEl.addEventListener('click', () => activateTag(tag));
        tagsEl.appendChild(tagEl);
      });
      card.appendChild(tagsEl);
    }

    return article;
  }

  // ---- Filtering -----------------------------------------------------

  function activateTag(tag) {
    activeTags.add(tag);
    const filtersRow = document.getElementById('tag-filters');
    if (filtersRow) syncFilterButtons(filtersRow);
    filterTimeline();
  }

  function filterTimeline() {
    const items = document.querySelectorAll('#timeline .timeline-item');
    items.forEach((item) => {
      if (activeTags.size === 0) {
        item.classList.remove('hidden');
        return;
      }
      const itemTags = JSON.parse(item.dataset.tags || '[]');
      const matches = [...activeTags].some((t) => itemTags.includes(t));
      item.classList.toggle('hidden', !matches);
    });
  }

  // ---- Utilities -----------------------------------------------------

  function formatDate(dateStr) {
    // Append time to avoid UTC midnight shifting the date
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  // ---- Boot ----------------------------------------------------------

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
