# Contributing to Primmel + OIML SMART Documentation

Thank you for your interest in improving this documentation. This
guide covers the two kinds of contribution we need most.

## Contributing content (chapters, diagrams, fixes)

The documentation source lives in `docs/` as markdown. The build
pipeline syncs it into the Astro site.

### Quick edit

1. Click the "Edit this page" link at the bottom of any chapter.
   This opens the GitHub editor for that file.
2. Make your change.
3. Submit a pull request.

### Local development

```bash
git clone https://github.com/primmel/primmel-oiml-smart.git
cd primmel-oiml-smart
npm install
npm run dev
```

The dev server runs at `http://localhost:4321/primmel-oiml-smart/`.

### Chapter conventions

- **Status markers** — ● exists in the running system · ◐ partial ·
  ○ planned. Use these honestly.
- **Syntax blocks** — tag Primmel syntax with `prl`.
- **Diagrams** — hand-authored SVG, 900×600 viewBox, in each volume's
  `diagrams/` directory. Palette: slate structure, indigo subjects,
  green IS, amber HAS, red DOES, violet relations.
- **Math** — KaTeX is available. Use `$...$` for inline, `$$...$$`
  for display.
- **Code blocks** — every `<pre>` auto-enhances with a language label
  and copy-to-clipboard button.

### Diagram style guide

| Element | Color |
|---|---|
| Structure / connectors | slate `#475569`, `#94a3b8` |
| Subjects / brand | indigo `#4f46e5`, `#3730a3` |
| IS aspects | green `#16a34a`, `#14532d` |
| HAS aspects | amber `#d97706`, `#78350f` |
| DOES aspects | red `#dc2626`, `#7f1d1d` |
| Kernel / Tier-0 | teal `#0d9488`, `#115e59` |
| Relations | violet |

All SVGs: 900×600 viewBox, `font-family="ui-sans-serif, system-ui,
sans-serif"`, rounded rectangles (rx=12), 1.6px stroke for connectors.

### The sync pipeline

`npm run sync` runs before every `dev` and `build`. It:
1. Wipes `src/content/docs/`
2. Copies every `.md` and `.svg` from `docs/`
3. Renames `README.md` → `index.md`
4. Injects frontmatter titles from H1s
5. Rewrites `.md` links to route paths
6. Optimizes SVGs with svgo

**Never edit `src/content/docs/` directly.** Edit `docs/` and re-sync.

## Contributing design / infrastructure

The design system is in `src/styles/brand.css` (~1900 lines, Tailwind
4 + hand-written component CSS). Custom components live in
`src/components/`. Enhancement scripts in `src/scripts/`.

To add a new enhancement script:
1. Write it as a plain `.js` file in `src/scripts/`
2. Import it in `src/components/PageFrame.astro`'s `<script>` block
3. Add any CSS to `brand.css`

## Pull request checklist

- [ ] `npm run sync` completes with no broken links
- [ ] `npm run check` passes (0 errors)
- [ ] `npm run build` succeeds
- [ ] Status markers are honest (● ◐ ○)
- [ ] No technology brand names in user-visible content (no "Astro",
      "Vue", "Tailwind" in the rendered site)
- [ ] Diagrams follow the style guide
- [ ] Commit messages are descriptive (no AI attribution)

## Questions?

Open a [GitHub Discussion](https://github.com/primmel/primmel-oiml-smart/discussions)
or an issue. We respond.
