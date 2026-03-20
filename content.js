/**
 * ============================================================
 *  Timeline Content — add your entries here!
 * ============================================================
 *
 *  Each entry is an object with these fields:
 *
 *   date   {string}   'YYYY-MM-DD'  — when it happened (required)
 *   title  {string}                 — headline (required)
 *   body   {string}                 — description; basic HTML ok (required)
 *   tags   {string[]}               — used for tag filtering (optional)
 *   link   {object}   { text, url } — a call-to-action link (optional)
 *   type   {string}   one of:       (optional, default: 'note')
 *                       'note'      — a thought, observation
 *                       'project'   — something you made
 *                       'post'      — a longer piece of writing
 *                       'milestone' — a moment worth marking
 *
 *  Entries are sorted by date (newest first) automatically.
 *  Tags are collected automatically — just invent them as you go.
 * ============================================================
 */

const timelineContent = [
  {
    date: '2026-03-20',
    title: 'Hello, world 🌱',
    body: 'Planted this little corner of the internet. Not sure what it\'ll grow into — that feels like the point.',
    tags: ['meta', 'web'],
    type: 'milestone',
  },
  {
    date: '2026-02-14',
    title: 'A thing I made',
    body: 'Placeholder for the cool stuff to come. Tags up top let you sort through the chaos.',
    tags: ['making'],
    link: { text: 'See it', url: '#' },
    type: 'project',
  },
  {
    date: '2026-01-05',
    title: 'A thought I had',
    body: 'Sometimes a note is just a note. Not everything needs to be a thread.',
    tags: ['thinking'],
    type: 'note',
  },
];
