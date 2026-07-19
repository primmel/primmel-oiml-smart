# Roadmap — Status Map and the Path to v3

> *In this document:* what exists today (●), what is partial (◐), what
> is planned (○), and the v3 program grouped into phases with their
> dependencies — kernel first, then the OIML Core re-home, then
> Recommendation re-expression, then interop.

Sources: the concept frame (`docs/primmel-concepts.md`, incl. its
Appendix B) and the v2 delivery record (`docs/primmel-v2-plan.md`,
W1–W8 complete as of 2026-07-18), both in the `oimlsmart/smart`
repository. This page is the status map; when a marker here and the
running system disagree, the running system is right — fix this page.

---

## 1. How to read the markers

- **● exists in the running system** — backed by code and data you can
  run today, behind the command gates.
- **◐ partial** — the concept exists, but thin, declared-only, or living
  in the wrong home; the gap is named.
- **○ planned for v3** — a concept of the frame with no realization yet;
  each carries its driver (the Appendix B gap ids G1–G11 where one
  exists).

## 2. What exists today (●)

**The running packages.** Three Recommendations run in the new
`data/<id>/` layout: **R 60** (the reference depth: subject model, 38
attribute definitions, requirements, conformance tests, R 60-3 forms
with 182 `bind:` paths, the full certification workflow, 13 seeded
real-certificate flows), **R 91** and **R 144** (new-layout trees with
model/entities/specification/execution/evaluation). `data/oiml-r129/`
and the legacy `data/oiml-r144/` tree remain unmigrated.

**The Primmel v2 toolchain — W1–W8 complete.** Per the delivery record:

- W1 parser repair + v2 grammar (primmel-ts: 157 tests, fixpoint on
  R 60) — the colon-aware tokenizer that killed the v1 bug class;
- W2 the package convention + `loadPackage` (manifest-first merge,
  cross-file duplicate detection);
- W3/W4 the semantic round-trip converters (38/38 attribute fidelity);
- W5 the round-trip test kit, both directions, mutation-tested;
- W6 the SMART runtime plug: `SMART_STANDARDS_SOURCE=primmel` builds the
  full app from `primmel-packages/oiml-r60` with 0 validation errors and
  exact counts — the runtime cannot tell which source fed it;
- W7 `primmel-packages/oiml-r60/` — the Recommendation as `.prl`
  (oiml-r91 and oiml-r144 packages exist alongside it);
- W8 `primmel check` — the C1–C5 cross-layer linter, 0 errors on R 60.

**The platform.** All command gates green as of 2026-07-18 (vue-tsc 0
errors; astro check 0 errors; vitest 1408 tests; production build;
validate; e2e 19/19). Feature-level ● includes: the ONE applicability
engine (dimension conditions, `implies:`, `instances:`); the
VerdictQuantity registry with per-requirement verdict re-execution;
preconditions (invalid ≠ fail), modality (observation ≠ blocker) and the
acceptance decision rule; the form-context binding engine; state
machines with declarative cascades; dispatch derivation and
capability-based lab selection; the TestRun/EvidenceRecord runtime with
custody; machine-checked reference materials (R 144 CGMs); the
certificate template and the PD-05 18-element checklist; the model
linker with clause-referenced allowlists; the BIML registration record
and the public register at `/app/register`.

## 3. What is partial (◐)

| Concept | State today | The gap |
|---|---|---|
| **Promises** | parameter-valued claims only (`origin: declared`, the application matrix) | claims on *characteristics and behavior* — envelope-shaped, conditional, verified at evaluation and printed on the certificate — do not exist yet (G11) |
| **Characteristics** | defined specification-side as observables / VerdictQuantities | definitions must hoist into the primary model (symbol + derivation from behavior I/O), with the specification *referencing* them (INV-3 completeness) |
| **The workflow** | the certification workflow lives inside each rec package (`data/<id>/evaluation/`, byte-identical across recs) | it is an *implementation model* of the OIML-CS with no name: PD-05 clause refs in `approvals.yaml` are embryonic mappings with no mapping machinery around them (§4, phase 2) |
| **Designed/exhibited value duality** | `ConditionRole: [reference, rated, limiting, actual]` encodes it for conditions | the general duality (one value structure, two aspect roles) is not yet a kernel relation (as-found verification is the driver) |
| **BIML registration** | record builder + idempotent register action + public register | true OIML-CS API integration (export feed) |
| **Quantity vocabulary** | QuantityValue everywhere (INV-1); unit registry | quantity kinds are string ids at the domain layer; no first-class QuantityKind/Unit instance registry (dimension vectors, SI conversion) |
| **Provenance** | clause level everywhere (`source: { doc, clause }`) | fragment level (`.prd` bindings) is ○ (§4, phase 4) |

## 4. The v3 program, in phases

Dependency order is load-bearing: **kernel → core → recs → interop.**
Each item names its Appendix B driver.

### Phase 1 — the language kernel

The new primitives of the frame, added to the language before any
content is re-authored:

- **structure** (IS) — partOf / consists_of / connectsTo for composite
  and distributed instruments (G3; the metamodel slot exists,
  unrealized);
- **promises** (IS) — claims on characteristics and behavior (G11);
- **artifact definitions + instances** (IS / HAS) — required outputs of
  the subject with content contract + produced-when (G2; the R 91
  evidence file);
- **operational state machine** (HAS) — off/warming/ready/measuring/
  fault, transitions fired by DOES processes, tests gating via
  preconditions (warm-up, state-gating);
- **characteristics hoisted to the primary model** (HAS) — closes the
  ◐ above;
- **the designed-vs-exhibited value duality** (IS↔HAS) — one structure,
  two roles, as a kernel relation;
- **set-valued dimensions** (HAS) — R 144 multi-component gas mixtures
  (G9);
- **process extensions** — verification processes (initial / subsequent
  / in-service; R 91 clause 8, G1, with timer-driven recurrence), test
  kinds (field / simulation / software) + obligation (R 91-2, G4/G5),
  the statistics block on tests (R 91-2 4.4/4.7, G6);
- **the mapping primitive + coverage calculus** — A ⇒ B with
  description + justification; full / minimal / partial / no cover;
  inheritance down, aggregation up, transitivity at process level
  (v2 serialization ●: `map_profile` / `.prm`; the calculus is ○);
- **`uses` composition** — multi-package, topologically merged, no
  redefinition of upstream ids (v2's single `extends` is insufficient).

### Phase 2 — the OIML Core re-home

Depends on phase 1 (the core is re-expressed *in* the new kernel):

- re-express the metamodel (`oiml-core-ontology.yaml` v0.5.0) as the
  OIML Core package on the v3 kernel, keeping INV-1..10 as its laws;
- publish **OIML-CS (PD-05 / PD-02) as its own reference package** —
  the scheme content out of the rec packages (Annex A);
- re-home the certification workflow as **implementation packages**
  mapping to the scheme — the ◐ of §3 closed by construction, and the
  coverage calculus answering "how much of PD-05 does this platform
  fulfil?";
- the seven shared modules (emc-disturbances, env-iec60068,
  software-d31, reference-materials, specimen-governance,
  report-headers, examination-docs) re-cut as layer-2b packages.

### Phase 3 — Recommendation re-expression

Depends on phase 2 (recs sit on the core):

- **R 60 re-authored v3-native** — the worked example end to end
  (promises, characteristics, artifacts where R 60 has them);
- **R 91 and R 144 as the stress cases** — set-valued dimensions,
  verification processes, simulator test kinds, statistics blocks: the
  features that forced the kernel's hand, exercised on real content;
- **R 129 migration** off the legacy tree;
- per-lab implementation models of R 60-2 / R 91-2 test methods become
  possible (SOPs mapped to required methods).

### Phase 4 — interop and cross-cutting machinery

Mostly parallel after phase 1; fragment provenance feeds phase 3's
re-authoring, and text coverage depends on it:

- **fragment provenance + document reconstruction** — `.prd` extracts,
  fragment-address bindings, the emitted fragment stream, the
  congruence check (coverage + order + text identity);
- **ISO 24229 multilinguality** — spelling codes on all prose, one
  content set per model (extends the registers' `spelling:` practice);
- **the normative-text coverage metric** in `primmel check` — 100%
  sentence coverage, 0 semantic duplicates, per package;
- **interop projections** — ReqIF export, RDF/OWL + SHACL projection
  onto the IEC-ISO Core Ontology vocabulary, OpenCDD IRDI resolution
  on attribute definitions (lossy-but-useful, never the kernel);
- **model diff + lifecycle packaging** — structural diff (elements and
  mappings added/removed/changed) powering edition comparison, change
  audit and clause-drift detection; 'edition' packages built on top.

## 5. The consolidated status table

| Area | Marker | Where it stands |
|---|---|---|
| R 60 / R 91 / R 144 packages (new layout) | ● | running, gates green |
| Primmel v2 toolchain (W1–W8) | ● | parser, packages, round-trip, plug, linter |
| App command gates | ● | 0/0 errors, 1408 tests, 19/19 e2e (2026-07-18) |
| Applicability / verdict / form / state / dispatch engines | ● | `browser/src/data`, `browser/src/services` |
| Promises, characteristics, workflow-as-implementation | ◐ | §3 — closed in phases 1–2 |
| Kernel primitives (structure, artifacts, state, duality, set-dimensions, process extensions, mapping calculus, uses) | ○ | phase 1 |
| OIML Core re-home + OIML-CS reference package | ○ | phase 2 |
| Rec re-expression (R 60 native; R 91/R 144 stress; R 129) | ○ | phase 3 |
| Fragment provenance, ISO 24229, text coverage, projections, model diff | ○ | phase 4 |

## 6. Summary

- The system runs today: three Recommendations in the new layout, the
  v2 toolchain complete (W1–W8), all gates green.
- The honest partials are three: promises declared-only, characteristics
  specification-side, the workflow an unnamed implementation model.
- The v3 program is phased by dependency: kernel primitives first, then
  the OIML Core re-home (with OIML-CS as its own reference package),
  then Recommendation re-expression, then interop.
- Every ○ item traces to the concept frame's Appendix B; every ● item
  traces to a gate. Nothing here is aspiration without an address.

*Next: [Volume I — Primmel, the language kernel](../primmel/README.md):
the concepts this roadmap realizes.*
