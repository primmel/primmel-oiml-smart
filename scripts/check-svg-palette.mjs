#!/usr/bin/env node
/**
 * check-svg-palette.mjs — the dark-mode-safety gate for diagrams (CI).
 *
 * The site renders both light and dark themes; diagrams are served as
 * <img> assets, so page CSS cannot adapt them. The contract that keeps
 * every diagram readable in both themes:
 *
 *   1. every docs/**​/diagrams/*.svg starts with a full-bleed background
 *      rect (<rect width="100%" height="100%" fill="…"/>) as its first
 *      rendered child — the diagram is a self-contained card;
 *   2. the background fill is light (relative luminance ≥ 0.8), because
 *      the diagram palette draws dark text and strokes on top of it.
 *
 * Fix violations by running `node scripts/normalize-svg-backgrounds.mjs`
 * (idempotent) or by adding the rect by hand. Exit code 1 on any violation.
 */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { hasBackgroundRect } from './normalize-svg-backgrounds.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = path.join(ROOT, 'docs');
const MIN_LUMINANCE = 0.8;

const NAMED_LIGHT = new Set(['white', 'ivory', 'snow', 'seashell', 'floralwhite', 'ghostwhite', 'whitesmoke', 'cornsilk', 'linen', 'beige', 'aliceblue', 'honeydew', 'mintcream', 'azure', 'lavenderblush', 'oldlace', 'papayawhip']);

async function* walkSvgs(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walkSvgs(full);
    else if (entry.isFile() && entry.name.endsWith('.svg') && path.basename(dir) === 'diagrams') yield full;
  }
}

function parseColor(raw) {
  const c = raw.trim().toLowerCase();
  let m = c.match(/^#([0-9a-f]{3})$/) ?? c.match(/^#([0-9a-f]{6})$/);
  if (m) {
    let hex = m[1];
    if (hex.length === 3) hex = [...hex].map((ch) => ch + ch).join('');
    return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  }
  m = c.match(/^rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/);
  if (m) return [m[1], m[2], m[3]].map((v) => parseInt(v, 10) / 255);
  if (NAMED_LIGHT.has(c)) return [1, 1, 1]; // named light colors pass; unknown names fail closed
  return null;
}

/** WCAG relative luminance of an sRGB triple. */
function luminance([r, g, b]) {
  const lin = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function backgroundFill(svg) {
  const open = svg.match(/<svg\b[^>]*>/);
  if (!open) return null;
  const rest = svg.slice(open.index + open[0].length);
  const m = rest.match(/^\s*(?:<!--[\s\S]*?-->\s*)?<rect\b([^>]*)>/);
  if (!m) return null;
  const fill = m[1].match(/fill\s*=\s*"([^"]*)"/);
  return fill?.[1] ?? null;
}

async function main() {
  const violations = [];
  let count = 0;
  for await (const file of walkSvgs(DOCS)) {
    count++;
    const rel = path.relative(ROOT, file);
    const svg = await readFile(file, 'utf8');
    if (!hasBackgroundRect(svg)) {
      violations.push(`${rel}: no full-bleed background rect as first rendered child`);
      continue;
    }
    const fill = backgroundFill(svg);
    const rgb = fill ? parseColor(fill) : null;
    if (!rgb) {
      violations.push(`${rel}: background fill "${fill}" is not a plain color (use hex/rgb/named light)`);
      continue;
    }
    const lum = luminance(rgb);
    if (lum < MIN_LUMINANCE) {
      violations.push(`${rel}: background fill "${fill}" is too dark (luminance ${lum.toFixed(2)} < ${MIN_LUMINANCE})`);
    }
  }

  console.log(`check-svg: ${count} diagrams checked`);
  if (violations.length > 0) {
    console.log(`check-svg: ${violations.length} violation(s):`);
    for (const v of violations) console.log(`  ${v}`);
    console.log('check-svg: run `node scripts/normalize-svg-backgrounds.mjs` to fix missing backgrounds');
    process.exit(1);
  }
  console.log('check-svg: OK — every diagram carries a light full-bleed background');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
