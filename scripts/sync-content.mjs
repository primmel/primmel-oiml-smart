#!/usr/bin/env node
/**
 * sync-content.mjs — copy the docs/ source tree into src/content/docs/ for Starlight.
 *
 * docs/ is the single source of truth and is never modified. This script:
 *   1. wipes src/content/docs/
 *   2. copies every .md and .svg from docs/ preserving relative paths
 *      (relative image refs like `diagrams/x.svg` keep working — Astro content
 *      collections resolve relative assets next to the markdown file)
 *   3. renames every README.md to index.md
 *   4. injects frontmatter into each markdown file:
 *        ---
 *        title: "<first H1 text, stripped of '# ' and of any 'Chapter N — ' prefix>"
 *        ---
 *      For index.md (former README.md) files the title is the volume name.
 *   5. optimizes SVGs with SVGO on the way in (docs/ sources stay
 *      hand-authored; the shipped copies are minified). The config keeps
 *      viewBox, hand-authored ids (marker cross-references) and shape
 *      elements (the full-bleed background rect must stay a valid rect).
 *   6. rewrites relative .md links to base-relative Starlight route paths
 *      (docs/ uses file links like `](07-evaluation.md)`; the site needs
 *      `](../../oiml-core/07-evaluation/)` so any deploy base works).
 *      Broken upstream links are left untouched and reported on stdout.
 */
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { optimize } from 'svgo';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'docs');
const OUT = path.join(ROOT, 'src', 'content', 'docs');

/** Volume landing-page titles, keyed by first path segment ('' = tree root). */
const VOLUME_TITLES = {
  '': 'Overview',
  foundation: 'Volume 0: Foundation',
  primmel: 'Volume I: Primmel Kernel',
  platform: 'Annex: Platform',
  shared: 'Annex: Shared',
};

const toPosix = (p) => p.split(path.sep).join('/');

/** Recursively collect files under dir, returning absolute paths. */
async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (entry.isFile()) out.push(full);
  }
  return out;
}

/** Route path for a docs/-relative markdown path, e.g. `primmel/README.md` → `/primmel/`. */
function routeFor(rel) {
  const dir = path.posix.dirname(rel);
  const base = path.posix.basename(rel, '.md');
  if (base === 'README' || base === 'index') return dir === '.' ? '/' : `/${dir}/`;
  return `/${rel.slice(0, -'.md'.length)}/`;
}

/** Fence-state tracker: feed lines, returns true while inside a fenced code block. */
function makeFenceTracker() {
  let fence = null;
  return (line) => {
    const m = line.match(/^\s*(`{3,}|~{3,})/);
    if (!m) return fence !== null;
    if (fence === null) fence = m[1][0];
    else if (m[1].startsWith(fence[0])) fence = null;
    return true; // fence delimiter lines are never processed themselves
  };
}

/** First ATX H1 (`# …`) outside fenced code blocks, or undefined. */
function firstH1(lines) {
  const inFence = makeFenceTracker();
  for (const line of lines) {
    if (inFence(line)) continue;
    const h1 = line.match(/^#\s+(.+?)\s*$/);
    if (h1) return h1[1];
  }
  return undefined;
}

/** Escape a string for use inside a double-quoted YAML scalar. */
const yamlDoubleQuoted = (s) => s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

/**
 * Rewrite relative .md links in one line to base-relative route paths.
 * Only runs on lines outside fenced code blocks. Image/asset links (.svg etc.)
 * and absolute/anchor links are untouched. Routes are emitted relative to the
 * current page's route (../../oiml-core/07-evaluation/ style) so the site
 * works under any deploy base without rewriting.
 */
function rewriteLinks(line, rel, routes, broken) {
  const fromRoute = routes.get(rel) ?? '/';
  return line.replace(/]\((<)?([^)\s>]+)(>)?\)/g, (match, _open, target, _close) => {
    if (/^(#|[a-z][a-z0-9+.-]*:)/i.test(target)) return match; // anchor or scheme (http:, mailto:)
    const m = target.match(/^(.+?\.md)(#.*)?$/i);
    if (!m) return match; // not a markdown link (e.g. diagrams/x.svg)
    const [, targetPath, anchor = ''] = m;
    const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(rel), targetPath));
    const route = routes.get(resolved);
    if (!route) {
      broken.push({ file: rel, target });
      return match; // leave untouched; reported upstream
    }
    let relRoute = path.posix.relative(fromRoute, route);
    if (relRoute === '') relRoute = '.';
    if (route.endsWith('/') && !relRoute.endsWith('/')) relRoute += '/';
    return `](${relRoute}${anchor})`;
  });
}

/** SVGO: minify shipped SVGs; keep viewBox, hand-authored ids, and shape elements. */
const SVGO_PLUGINS = [
  {
    name: 'preset-default',
    params: {
      overrides: {
        removeViewBox: false, // diagrams scale via viewBox — dropping it breaks sizing
        cleanupIds: false, // keep hand-authored ids (marker/arrow cross-references)
        convertShapeToPath: false, // keep the full-bleed background <rect> a valid rect
      },
    },
  },
];

async function main() {
  // 1. wipe the build-output content dir
  await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });

  const files = (await walk(SRC)).filter((f) => /\.(md|svg)$/i.test(f));
  const mdFiles = files.filter((f) => /\.md$/i.test(f));

  // 2. route map keyed by ORIGINAL docs/-relative paths (links resolve against these)
  const routes = new Map(mdFiles.map((f) => [toPosix(path.relative(SRC, f)), routeFor(toPosix(path.relative(SRC, f)))]));

  const broken = [];
  let copiedMd = 0;
  let copiedSvg = 0;
  let svgBefore = 0;
  let svgAfter = 0;

  for (const file of files) {
    const rel = toPosix(path.relative(SRC, file));
    const isReadme = /^README\.md$/i.test(path.basename(file));
    const outRel = isReadme ? path.posix.join(path.posix.dirname(rel) === '.' ? '' : path.posix.dirname(rel), 'index.md') : rel;
    const dest = path.join(OUT, outRel);
    await mkdir(path.dirname(dest), { recursive: true });

    if (/\.svg$/i.test(file)) {
      const svg = await readFile(file, 'utf8');
      const result = optimize(svg, { path: file, plugins: SVGO_PLUGINS, multipass: true });
      await writeFile(dest, result.data);
      svgBefore += svg.length;
      svgAfter += result.data.length;
      copiedSvg++;
      continue;
    }

    const original = await readFile(file, 'utf8');
    const lines = original.split('\n');

    // title: volume name for README→index pages, else first H1 minus 'Chapter N — '
    let title;
    if (isReadme) {
      const volume = rel.includes('/') ? rel.slice(0, rel.indexOf('/')) : '';
      title = VOLUME_TITLES[volume] ?? firstH1(lines) ?? volume;
    } else {
      title = (firstH1(lines) ?? path.basename(file, '.md')).replace(/^Chapter\s+\d+\s*—\s*/, '');
    }

    const inFence = makeFenceTracker();
    const body = lines
      .map((line) => (inFence(line) ? line : rewriteLinks(line, rel, routes, broken)))
      .join('\n');

    await writeFile(dest, `---\ntitle: "${yamlDoubleQuoted(title)}"\n---\n\n${body}`);
    copiedMd++;
  }

  console.log(`sync: copied ${copiedMd} .md (README.md → index.md) and ${copiedSvg} .svg into ${path.relative(ROOT, OUT)}/`);
  if (copiedSvg > 0) {
    console.log(`sync: svgo ${copiedSvg} svg(s), ${(svgBefore / 1024).toFixed(1)} kB → ${(svgAfter / 1024).toFixed(1)} kB`);
  }
  if (broken.length > 0) {
    console.log(`sync: ${broken.length} unresolved upstream .md link(s) (left untouched):`);
    for (const b of broken) console.log(`  ${b.file} -> ${b.target}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
