# Documentation releases

> *In this page:* how this documentation is versioned, docs releases are
> git tags on this repository, pinned to the program milestones of the
> [roadmap](roadmap.md), plus the release table and the tagging
> procedure. The discipline for keeping the content itself honest lives
> in [Keeping the docs current](keeping-current.md).

---

## 1. The scheme

A **docs release** is a git tag `docs-vX.Y.Z` on this repository. There
is one live site, it always serves the latest state of `main`; older
releases are reachable as tags, not as parallel hosted versions.

Releases are **pinned to program milestones**, not to calendar dates:
a major release freezes the volume(s) whose content the milestone
completes. Freezing a volume means its prose and its ●◐○ markers were
re-verified against the running system at the milestone, every ●
traced to a green command gate, not that the volume never changes
again (corrections land as patch releases).

- **major (X.0.0)**, a program milestone completes: the affected
  volume(s) freeze against the landed system.
- **minor (x.Y.0)**, content from a parallel phase (4: interop, 6:
  live twins) or a new volume/annex lands outside a major milestone.
- **patch (x.y.Z)**, corrections, marker flips from landed work,
  diagram and link fixes. No milestone required.

## 2. The release table

| Release | Pinned milestone | What it freezes | Status |
|---|---|---|---|
| `docs-v0.1.0` | **site launch** (roadmap task 30) | the site itself: all volumes navigable, search, status badges, CI gates (link check, markdown lint, SVG palette) | ● 2026-07-26 |
| `docs-v0.2.0` | **the v3 program, documented end to end** | every volume re-verified against the landed system: kernel, core, recs (phases 1–3), interop (phase 4, fragment provenance, text coverage, model diff, ReqIF / RDF-OWL / OpenCDD, task 27), **ISO 24229 multilinguality** (task 25, chapter 10 rewritten to the shipped machinery: `text` + C89, the vendored register, R43, the byte-identical acceptance), the twin program (phase 6), the OIML-CS (phase 7), executable semantics (phase 8), the SSOT correspondence (phases 9/9.5), and the simulated-instruments annex. Smart gates at `8de8f4d` + `8ef2752`: vitest 3556/3556, validate 0 errors/435 warnings, e2e 55/55, ssot byte-clean, pilot 6/6, round-trip PASS, kernel `14cf10d`: 912/912 | ● 2026-07-27 |
| `docs-v0.2.1` | **smart v3.1.0, the gap-close release, documented** | the construct quartet in the rule index (C1–C96), via-routed cascades (oiml-core/08 §8.5), the gap-close status row + gate counts (3657/431/e2e 55), the `oiml-rec/12` sidebar slug, smart `v3.1.0` (`3170207`), kernel `bb1e13b` | ● 2026-07-28 |
| `docs-v0.3.0` | **smart v3.2.0, the digital-twin stack + the instrument library, documented** | the three-layer twin framing (full twin IS / the standard GOVERNS / certification PROVES, primmel/14 §14.3 + the projection-map diagram), the §17.1 projection flip to shipped, the twin-certification program chapter (primmel/17), the roadmap's digital-twin-stack row + the two stale markers corrected, smart `v3.2.0` (`e84acc3`), kernel `37e660e` (26 packages), sim four families | ● 2026-07-29 |
| `docs-v1.0.0` | **phase 1, kernel done** | Volume 0 + Volume I against the landed kernel primitives (structure, promises, artifacts, operational state, duality, set-dimensions, process extensions, mapping calculus, `uses`) | ○ |
| `docs-v2.0.0` | **phase 2, core done** | Volume II against the OIML Core re-home as a v3 package | ○ |
| `docs-v3.0.0` | **phase 3, recs done** | Volume III against the v3-native R 60 and the R 91 / R 144 stress cases | ○ |
| `docs-v4.0.0` | **phase 5, platform + release** | the whole tree at the v3 release, platform annex included | ○ |

Two milestones fall outside the major-release line:

- **phase 7, the OIML-CS (●, landed 2026-07-22/23).** It shipped
  early, so its content (Volume IV) is part of the launch release
  `docs-v0.1.0` rather than a milestone of its own.
- **phases 4 and 6 (interop, live twins)** run in parallel with the
  main line; their content ships as minor releases as it lands.

## 3. Tagging procedure

When a milestone completes:

1. Re-verify the affected volumes against the running system, walk
   every ● marker to its gate, flip what drifted (see
   [Keeping the docs current](keeping-current.md)).
2. Land the gates green: `npm run lint:md`, `npm run check:svg`,
   `npm run build`, `npm run check:links`.
3. Update this page: the release row flips to ● with the tag date.
4. Tag: `git tag docs-vX.Y.Z` and push the tag. (Tags are cut by the
   program maintainer as part of the milestone close-out.)
