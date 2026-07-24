/**
 * remark-status-badges.mjs — render the tree's ● ◐ ○ status markers as badges.
 *
 * Authors write the plain Unicode markers in the docs/ sources (the tree's
 * convention, see docs/shared/keeping-current.md). This remark plugin wraps
 * each marker found in prose (never inside code, inline code, or raw HTML)
 * in a styled span at build time:
 *
 *   ●  →  <span class="status-badge status-badge--done"    title="…">●</span>
 *   ◐  →  <span class="status-badge status-badge--partial" title="…">◐</span>
 *   ○  →  <span class="status-badge status-badge--planned" title="…">○</span>
 *
 * The glyphs stay in the text (search keeps finding them); the spans only
 * add badge styling (src/styles/brand.css) and a tooltip/accessible name.
 */

const MARKERS = {
  '●': { mod: 'done', label: 'exists in the running system' },
  '◐': { mod: 'partial', label: 'partial — exists with a named gap' },
  '○': { mod: 'planned', label: 'planned in the v3 program' },
};

const MARKER_RE = new RegExp(`([${Object.keys(MARKERS).join('')}])`, 'g');

const badge = (glyph) => {
  const { mod, label } = MARKERS[glyph];
  return {
    type: 'html',
    value: `<span class="status-badge status-badge--${mod}" title="${label}" aria-label="status: ${label}">${glyph}</span>`,
  };
};

/** Split a text node into alternating text/html nodes around each marker. */
function splitMarkers(node) {
  const parts = [];
  let last = 0;
  for (const match of node.value.matchAll(MARKER_RE)) {
    if (match.index > last) parts.push({ type: 'text', value: node.value.slice(last, match.index) });
    parts.push(badge(match[1]));
    last = match.index + match[1].length;
  }
  if (parts.length === 0) return [node];
  if (last < node.value.length) parts.push({ type: 'text', value: node.value.slice(last) });
  return parts;
}

const SKIP = new Set(['code', 'inlineCode', 'html', 'math', 'inlineMath', 'definition', 'yaml']);

function walk(node) {
  if (!Array.isArray(node.children)) return;
  const next = [];
  for (const child of node.children) {
    if (child.type === 'text') next.push(...splitMarkers(child));
    else {
      if (!SKIP.has(child.type)) walk(child);
      next.push(child);
    }
  }
  node.children = next;
}

export default function remarkStatusBadges() {
  return (tree) => walk(tree);
}
