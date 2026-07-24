#!/usr/bin/env node
/**
 * normalize-svg-backgrounds.mjs — give every diagram an explicit background.
 *
 * The docs tree renders in both light and dark themes. The hand-authored
 * diagrams are drawn in a light palette (dark slate text, pastel fills) and
 * historically had transparent backgrounds — which let the dark theme's
 * navy page show through and made standalone dark text unreadable.
 *
 * The contract (enforced in CI by scripts/check-svg-palette.mjs): every
 * docs/**​/diagrams/*.svg starts with a full-bleed background rect as its
 * first rendered child, so the diagram is a self-contained card that reads
 * identically in both themes.
 *
 * This script is idempotent: diagrams that already carry a full-bleed rect
 * are left untouched. Run it when adding new diagrams, or let check:svg
 * tell you to.
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = path.join(ROOT, 'docs');
const BACKGROUND = '<rect width="100%" height="100%" fill="#ffffff"/>';

async function* walkSvgs(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walkSvgs(full);
    else if (entry.isFile() && entry.name.endsWith('.svg') && path.basename(dir) === 'diagrams') yield full;
  }
}

/** First rendered child element after the opening <svg …> tag (skipping <defs>, comments, whitespace). */
function firstRenderedChild(svg) {
  const open = svg.match(/<svg\b[^>]*>/);
  if (!open) return null;
  let rest = svg.slice(open.index + open[0].length);
  for (;;) {
    rest = rest.replace(/^\s+/, '').replace(/^<!--[\s\S]*?-->/, '').replace(/^\s+/, '');
    if (rest.startsWith('<defs')) return null; // defs before background: treat as no background
    const m = rest.match(/^<([a-zA-Z][\w:-]*)\b([^>]*)>/);
    if (!m) return null;
    return { tag: m[1], attrs: m[2] };
  }
}

export function hasBackgroundRect(svg) {
  const first = firstRenderedChild(svg);
  if (!first || first.tag !== 'rect') return false;
  return /width\s*=\s*"100%"/.test(first.attrs) && /height\s*=\s*"100%"/.test(first.attrs);
}

async function main() {
  let fixed = 0;
  let skipped = 0;
  for await (const file of walkSvgs(DOCS)) {
    const svg = await readFile(file, 'utf8');
    if (hasBackgroundRect(svg)) {
      skipped++;
      continue;
    }
    const open = svg.match(/<svg\b[^>]*>/);
    if (!open) {
      console.warn(`normalize: no <svg> tag found in ${path.relative(ROOT, file)} — skipped`);
      continue;
    }
    const at = open.index + open[0].length;
    const next = svg.slice(at).match(/^\s*/)[0];
    const indent = next.includes('\n') ? next.slice(next.lastIndexOf('\n') + 1) : '  ';
    const updated = `${svg.slice(0, at)}\n${indent || '  '}${BACKGROUND}${svg.slice(at)}`;
    await writeFile(file, updated);
    console.log(`normalize: + background rect → ${path.relative(ROOT, file)}`);
    fixed++;
  }
  console.log(`normalize: ${fixed} updated, ${skipped} already compliant`);
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
