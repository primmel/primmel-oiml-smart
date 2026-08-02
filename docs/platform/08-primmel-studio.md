# 08 — Primmel Studio: the authoring tool

> *A runtime chapter of the [Platform volume](README.md).*

**Status:** ● exists (the `primmel/editor` repo, deployed standalone at
`localhost:5173` in development).

---

## What it is

Primmel Studio is the editing and review environment for `.prl`
packages — the full port of the Paneron MMEL Editor/Viewer/Mapper
lineage onto the Primmel v3 kernel. The platform chapters are about
EXECUTING models; the Studio is about AUTHORING them: the canvas,
the inspectors, the mapper, the diff, the simulation.

It lives in its own repository (`primmel/editor`) and pins the local
kernel package — the same parser, linter, coverage calculus, and
model-diff that drive the app's runtime, so an edit in the Studio is
semantically identical to an edit by hand, with the machine checking
every step.

## The three laws it shares with the platform

1. **The AST is the single source of truth.** Every mutation is a
   typed Command (apply + revert) — undo/redo is exact, and every
   projection (tree, canvas, code, inspector, mapper, diff) renders
   one store. This is design principle 1 (the model is the source of
   truth) applied to the editor itself.
2. **The kernel owns the semantics.** Coverage tints are the kernel's
   computeCoverage, the diff view is the kernel's diffStandards, the
   datatype vocabulary is the kernel's type-expr. The Studio bridges,
   never reimplements — so it cannot drift from the runtime.
3. **Programs plug in, they don't branch the kernel.** The OIML
   SMART layer is a plugin (the rec palettes, the certificate
   preview) registered at boot — the same doctrine as [07 — the
   program config seam](07-the-program-config.md), at the editor
   layer.

## What it carries (the waves)

| Wave | Contents |
|---|---|
| model workspace | canvas drag/connect with the discipline, the palette, per-type inspectors, subprocess pages, comments, measurements, the process simulation (ephemeral) |
| mapping | REF⇄IMP pairs over the v3 MapProfile, the KERNEL coverage overlay with the C23 conflict marker, the multi-reference lens with the seed review list, document mapping with clause URNs, automap with provenance |
| review | the model-diff view with facet before/after, the save panel (review-before-commit, download or write-to-file with `.bak`) |
| migration | the legacy .mmel import — PAS2060/ISO 27001 convert natively with the honest report |

## The proof

```bash
cd ~/src/primmel/editor
npx vue-tsc --noEmit && npx vitest run && npm run build
./e2e/run-all.sh   # 17 puppeteer legs against npm run dev
```

The e2e legs walk the real workflows end to end (create → edit →
serialize; map with coverage; seed a second reference; map document
statements; automap confirm/reject; diff; simulate; comment;
measure; import legacy; the plugin layer; save with the diff
preview).

## Read next

- The Studio chapter in the architecture site:
  [`oimlsmart/smart` docs/architecture/21-primmel-studio.md](https://github.com/oimlsmart/smart/blob/main/docs/architecture/21-primmel-studio.md).
- The repo's own `README.md` (the feature map) and `CLAUDE.md` (the
  laws + the gotchas).
