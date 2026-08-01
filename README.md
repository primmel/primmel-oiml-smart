# primmel-smart-docs — the Primmel SMART documentation federation

The published documentation for **Primmel** (the executable modelling
language kernel) and **OIML SMART** (the legal-metrology system built on
it): five volumes plus annexes, rendered as an Astro + Starlight site
with search, status badges, and hand-authored SVG diagrams.

> **Where am I?** This repo is the published documentation of the **OIML SMART platform** (`oimlsmart/smart`). The full system map — every component, what it owns, and its proof command — is one hop away: [`docs/architecture/for-agents.md`](https://github.com/oimlsmart/smart/blob/v2/docs/architecture/for-agents.md).

## Quickstart

```bash
npm ci
npm run dev        # sync docs/ → src/content/docs/, then astro dev
npm run build      # sync + production build into dist/
npm run preview    # serve the production build locally
```

## Layout

- `docs/` — the single source of truth (markdown + SVG diagrams,
  organized by volume: `foundation/`, `primmel/`, `oiml-core/`,
  `oiml-rec/`, `oiml-cs/`, plus `platform/` and `shared/` annexes).
- `scripts/sync-content.mjs` — copies `docs/` into
  `src/content/docs/` (README.md → index.md, frontmatter titles,
  `.md` links rewritten to base-relative routes, SVGs SVGO-optimized).
  Generated output is never edited by hand.
- `src/` — Starlight components (`SiteTitle`, `PageFrame`), the brand
  stylesheet, and the remark plugin that renders ● ◐ ○ markers as badges.
- `.github/workflows/` — `check.yml` (PR/push gates) and `deploy.yml`
  (gated build + GitHub Pages deploy).

## The gates

CI runs the same commands on every pull request and push; the deploy
workflow refuses to publish when any gate is red:

```bash
npm run check         # astro check (types for components + scripts)
npm run lint:md       # markdown lint over docs/
npm run check:svg     # diagram background + dark-mode palette contract
npm run build         # sync + Astro build (Pagefind search, sitemap)
npm run check:links   # zero broken internal refs over dist/
```

## Keeping the docs current

The status-marker discipline (●◐○ lifecycle, who updates what and when)
and the docs-release scheme (tags pinned to program milestones) are part
of the published documentation itself:
[Keeping the docs current](docs/shared/keeping-current.md) ·
[Documentation releases](docs/shared/releases.md).

## Deploy

GitHub Pages, via `.github/workflows/deploy.yml` (build artifact →
`actions/deploy-pages`). One-time setup: repo **Settings → Pages →
Build and deployment → Source: "GitHub Actions"**.

The site builds base-relative links throughout and deploys as a project
page at `https://primmel.github.io/primmel-smart-docs/` — `site` and
`base` in `astro.config.mjs` already match (no custom domain).
