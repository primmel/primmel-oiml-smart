# Learn OIML SMART — the layered curriculum

The curriculum for the whole system, in the system's own layered shape: each
tier is learnable on its own and opens into the next. Every tier has a
real **assessment gate** — a gate of the system you reproduce, never a
quiz.

- **Tier 0 — the one-hour concept**: [00 — the concept](00-the-concept.md).
  Eight terms, three claim forms, the three-layer twin story, and why a
  Primmel twin is not an admin shell.
- **Tier 1 — the half-day hands-on**: [01 — the hands-on](01-the-hands-on.md).
  Boot a sim, read `/twin`, place a load, watch a verdict flip — then
  the lying-twin exercise.
- **Tier 2 — the week-long authoring course** *(planned, TODO.v3/06)*:
  write a product reference package and get its twin certified. The
  gate: your own package passes `primmel check --strict --audit` + the
  coverage gate + the twin-cert flow.
- **Tier 3 — the semester** *(planned, TODO.v3/06)*: the formal system
  (the IS–HAS–DOES proofs), the coverage calculus, the conformance
  machinery, monitors, twin certification, hierarchical twins. The
  capstone: model a new subject domain in Primmel.
- **Tier 4 — the reference shelf**: the published volumes
  ([primmel](../primmel/01-philosophy-and-tiers.md),
  [oiml-core](../oiml-core/01-measurement-vocabulary.md),
  [oiml-rec](../oiml-rec/01-methodology.md)) — the post-course
  companions.

**Before you start:** run the [demo manual's bootstrap](../oiml-rec/13-running-the-demo.md)
(2 minutes) and, if you want the machine to prove the chain for you
first, `npm run orient` from the app's `browser/` directory.
