# Documentation releases

> *In this page:* how this documentation is versioned — docs releases are
> git tags on this repository, pinned to the program milestones of the
> [roadmap](roadmap.md) — plus the release table and the tagging
> procedure. The discipline for keeping the content itself honest lives
> in [Keeping the docs current](keeping-current.md).

---

## 1. The scheme

A **docs release** is a git tag `docs-vX.Y.Z` on this repository. There
is one live site — it always serves the latest state of `main`; older
releases are reachable as tags, not as parallel hosted versions.

Releases are **pinned to program milestones**, not to calendar dates:
a major release freezes the volume(s) whose content the milestone
completes. Freezing a volume means its prose and its ●◐○ markers were
re-verified against the running system at the milestone — every ●
traced to a green command gate — not that the volume never changes
again (corrections land as patch releases).

- **major (X.0.0)** — a program milestone completes: the affected
  volume(s) freeze against the landed system.
- **minor (x.Y.0)** — content from a parallel phase (4: interop, 6:
  live twins) or a new volume/annex lands outside a major milestone.
- **patch (x.y.Z)** — corrections, marker flips from landed work,
  diagram and link fixes. No milestone required.

## 2. The release table

| Release | Pinned milestone | What it freezes | Status |
|---|---|---|---|
| `docs-v0.1.0` | **site launch** (roadmap task 30) | the site itself: all volumes navigable, search, status badges, CI gates (link check, markdown lint, SVG palette) | ● 2026-07-26 |
| `docs-v1.0.0` | **phase 1 — kernel done** | Volume 0 + Volume I against the landed kernel primitives (structure, promises, artifacts, operational state, duality, set-dimensions, process extensions, mapping calculus, `uses`) | ○ |
| `docs-v2.0.0` | **phase 2 — core done** | Volume II against the OIML Core re-home as a v3 package | ○ |
| `docs-v3.0.0` | **phase 3 — recs done** | Volume III against the v3-native R 60 and the R 91 / R 144 stress cases | ○ |
| `docs-v4.0.0` | **phase 5 — platform + release** | the whole tree at the v3 release, platform annex included | ○ |

Two milestones fall outside the major-release line:

- **phase 7 — the OIML-CS (●, landed 2026-07-22/23).** It shipped
  early, so its content (Volume IV) is part of the launch release
  `docs-v0.1.0` rather than a milestone of its own.
- **phases 4 and 6 (interop, live twins)** run in parallel with the
  main line; their content ships as minor releases as it lands.

## 3. Tagging procedure

When a milestone completes:

1. Re-verify the affected volumes against the running system — walk
   every ● marker to its gate, flip what drifted (see
   [Keeping the docs current](keeping-current.md)).
2. Land the gates green: `npm run lint:md`, `npm run check:svg`,
   `npm run build`, `npm run check:links`.
3. Update this page: the release row flips to ● with the tag date.
4. Tag: `git tag docs-vX.Y.Z` and push the tag. (Tags are cut by the
   program maintainer as part of the milestone close-out.)
