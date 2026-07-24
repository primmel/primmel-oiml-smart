#!/usr/bin/env node
/**
 * check-links.mjs — zero broken internal refs over the built site (dist/).
 *
 * Crawls every .html file in dist/, extracts href/src attributes, and verifies:
 *   1. internal page links resolve to a built page (root-absolute or relative,
 *      with or without trailing slash, `…/index.html` style included);
 *   2. asset references (img/src, links to .svg/.xml/etc.) exist on disk;
 *   3. fragment anchors (#id) exist in the target page (id="…" or name="…").
 *
 * External links (http:, https:, mailto:, …) are skipped — CI stays offline.
 *
 * Usage: node scripts/check-links.mjs [base]
 *   base — optional deploy base path (e.g. /primmel-oiml-smart/); stripped
 *   from root-absolute URLs before resolving, so a project-page build
 *   (`astro build --base …`) checks clean too.
 *
 * Exit code 1 with a per-file report if anything is broken.
 */
import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const BASE = process.argv[2] ?? '/';

const toPosix = (p) => p.split(path.sep).join('/');

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (entry.isFile()) out.push(full);
  }
  return out;
}

/** Extract href="…" / src="…" attribute values from raw HTML. */
function extractRefs(html) {
  const refs = [];
  const re = /\s(?:href|src)\s*=\s*"([^"]*)"/g;
  let m;
  while ((m = re.exec(html)) !== null) refs.push(m[1]);
  return refs;
}

/** All id="…" / name="…" values in a page, for anchor checking. */
function extractAnchors(html) {
  const ids = new Set();
  const re = /\s(?:id|name)\s*=\s*"([^"]*)"/g;
  let m;
  while ((m = re.exec(html)) !== null) ids.add(m[1]);
  return ids;
}

/**
 * Resolve a link target to a dist/-relative file path, or null if the target
 * is out of scope (external, protocol-relative, data:, javascript:, tel:).
 * `pageDirUrl` is the URL directory of the referring page, e.g. '/oiml-core/'.
 */
function resolveTarget(raw, pageDirUrl) {
  if (!raw || raw.startsWith('#')) return { self: raw };
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(raw)) return null; // scheme or //host

  const [withoutHash, hash = ''] = raw.split('#', 2);
  let pathname = withoutHash.split('?', 1)[0];
  if (pathname === '') return { self: `#${hash}` };
  // Strip the deploy base from root-absolute URLs (framework-generated links).
  if (BASE !== '/' && pathname.startsWith(BASE)) pathname = pathname.slice(BASE.length - 1);

  const urlPath = pathname.startsWith('/')
    ? path.posix.normalize(pathname)
    : path.posix.normalize(path.posix.join(pageDirUrl, pathname));

  // Non-page asset (has an extension other than .html): dist file directly.
  if (/\.[a-z0-9]+$/i.test(urlPath) && !/\.html?$/i.test(urlPath)) {
    return { file: path.join(DIST, urlPath), hash, kind: 'asset' };
  }
  // Page: <path>/index.html, <path>.html, or the file itself.
  const asDir = path.join(DIST, urlPath, 'index.html');
  const asHtml = path.join(DIST, `${urlPath}.html`);
  const asFile = path.join(DIST, urlPath);
  if (existsSync(asDir)) return { file: asDir, hash, kind: 'page' };
  if (existsSync(asHtml)) return { file: asHtml, hash, kind: 'page' };
  if (existsSync(asFile)) return { file: asFile, hash, kind: 'asset' };
  return { file: asDir, hash, kind: 'missing' }; // report against the canonical form
}

async function main() {
  if (!existsSync(DIST)) {
    console.error('check-links: dist/ not found — run `npm run build` first.');
    process.exit(2);
  }

  const htmlFiles = (await walk(DIST)).filter((f) => f.endsWith('.html'));
  const anchorCache = new Map(); // file → Set(anchors)
  const anchorsFor = async (file) => {
    if (!anchorCache.has(file)) anchorCache.set(file, extractAnchors(await readFile(file, 'utf8')));
    return anchorCache.get(file);
  };

  const broken = [];
  let checked = 0;

  for (const file of htmlFiles) {
    const rel = toPosix(path.relative(DIST, file));
    // URL directory of this page: 'oiml-core/07-evaluation/index.html' → '/oiml-core/07-evaluation/'
    const pageDirUrl = `/${toPosix(path.posix.dirname(rel))}/`.replace(/\/\.\//g, '/').replace(/^\/\.$/, '/');
    const html = await readFile(file, 'utf8');

    for (const raw of extractRefs(html)) {
      const target = resolveTarget(raw, pageDirUrl === '/./' ? '/' : pageDirUrl);
      if (target === null) continue; // external
      checked++;

      if (target.self !== undefined) {
        // same-page fragment
        if (target.self.length > 1) {
          const anchors = await anchorsFor(file);
          if (!anchors.has(decodeURIComponent(target.self.slice(1)))) {
            broken.push({ file: rel, target: raw, why: 'missing same-page anchor' });
          }
        }
        continue;
      }

      if (target.kind === 'missing' || !existsSync(target.file)) {
        broken.push({ file: rel, target: raw, why: 'no such page or asset' });
        continue;
      }
      if (target.kind === 'page' && target.hash) {
        const anchors = await anchorsFor(target.file);
        if (!anchors.has(decodeURIComponent(target.hash))) {
          broken.push({ file: rel, target: raw, why: `missing anchor #${target.hash} in ${toPosix(path.relative(DIST, target.file))}` });
        }
      }
    }
  }

  console.log(`check-links: ${htmlFiles.length} pages, ${checked} internal refs checked`);
  if (broken.length > 0) {
    console.log(`check-links: ${broken.length} broken:`);
    for (const b of broken) console.log(`  ${b.file}\n    -> ${b.target}  (${b.why})`);
    process.exit(1);
  }
  console.log('check-links: OK — zero broken internal refs');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
