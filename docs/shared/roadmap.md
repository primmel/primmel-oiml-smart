# Roadmap — Status Map and the Path to v3

> *In this document:* what exists today (●), what is partial (◐), what
> is planned (○), and the v3 program grouped into phases with their
> dependencies — kernel first, then the OIML Core re-home, then
> Recommendation re-expression, then interop, then platform and release
> — with the live-twin program free to run in parallel once its
> interface primitives land.

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

**The running packages.** Four Recommendations run in the new
`data/<id>/` layout: **R 60** (the reference depth: subject model, 40
attribute definitions, requirements, conformance tests, R 60-3 forms
with 164 `bind:` paths, the full certification workflow, 13 seeded
real-certificate flows), **R 91** and **R 144** (new-layout trees with
model/entities/specification/execution/evaluation), and **R 129**
(migrated off the legacy tree). The legacy `data/oiml-r144/` tree
remains unmigrated.

**The OIML-CS full implementation (phase 7, tasks 39–45,
2026-07-22/23).** The certification system is now modelled, executed
and audited end to end — Volume IV is the full treatment:

- **the CASCO foundation packages** (`data/iso-iec-17000/`, `-17065/`,
  `-17025/`, `-17067/`) — each standard's vocabulary and model as its
  own reference package, composed first into every rec; the facet trio
  `activity_kind` (the 17000 activity-archetype register),
  `segregation:` (machine-checkable non-involvement), `scheme_type:`
  (the oiml-cs layer's `type_1a` self-classification);
- **the B 18:2025 framework model** (`data/oiml-cs/framework/`) —
  participants, schemes (the per-category B→A two-year lifecycle),
  declarations (the PD-08 signing gate), documents, governance;
- **the documents corpus** (`data/oiml-cs/documents/<doc>/`) — eleven
  per-document modules (PD-01…PD-09 bar PD-05, CID-01, OD-01/02), 105
  clause-anchored provisions, plus PD-05's full clause coverage (34
  provisions + the coverage header table);
- **the participant runtime** — the registry, the approval pipeline
  with the MC 80 % tally, and **the PD-08 issuance gate enforced on
  both issuance paths, failing closed**;
- **the CS operations runtime** — Scheme A MTL/ANR discipline, PD-06
  utilization with the denial discipline, PD-01 appeals windows as
  model content, post-issuance revision/parallel/deregistration, and
  the public register as the B 18 §15.8 validity source (SHA-256
  registered copies);
- **the coverage machinery** — four `.prm` maps folded into one
  unified, mutation-proven report: 152 of 200 mandatory components
  covered, 48 justified named gaps, zero errors.

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

**The platform.** All command gates green as of 2026-07-23 (vue-tsc 0
errors; astro check 0 errors; vitest 2788 tests; production build;
validate; e2e 39/39). Feature-level ● includes: the ONE applicability
engine (dimension conditions, `implies:`, `instances:`); the
VerdictQuantity registry with per-requirement verdict re-execution;
preconditions (invalid ≠ fail), modality (observation ≠ blocker) and the
acceptance decision rule; the form-context binding engine; state
machines with declarative cascades; dispatch derivation and
capability-based lab selection; the TestRun/EvidenceRecord runtime with
custody; machine-checked reference materials (R 144 CGMs); the
certificate template and the PD-05 18-element checklist; the model
linker with clause-referenced allowlists; the BIML registration record
and the public register at `/app/register`; **the participant registry
+ approval pipeline + the fail-closed issuance gate** (`/app/cs`); and
**the CS operations runtime** (utilization, appeals, post-issuance,
the register as the §15.8 validity source).

## 3. What is partial (◐)

| Concept | State today | The gap |
|---|---|---|
| **Promises** | parameter-valued claims only (`origin: declared`, the application matrix) | claims on *characteristics and behavior* — envelope-shaped, conditional, verified at evaluation and printed on the certificate — do not exist yet (G11) |
| **Characteristics** | defined specification-side as observables / VerdictQuantities | definitions must hoist into the primary model (symbol + derivation from behavior I/O), with the specification *referencing* them (INV-3 completeness) |
| **Designed/exhibited value duality** | `ConditionRole: [reference, rated, limiting, actual]` encodes it for conditions | the general duality (one value structure, two aspect roles) is not yet a kernel relation (as-found verification is the driver) |
| **BIML registration** | record builder + idempotent register action + public register | true OIML-CS API integration (export feed) |
| **Quantity vocabulary** | QuantityValue everywhere (INV-1); unit registry | quantity kinds are string ids at the domain layer; no first-class QuantityKind/Unit instance registry (dimension vectors, SI conversion) |
| **Provenance** | clause level everywhere (`source: { doc, clause }`) | fragment level (`.prd` bindings) is ○ (§4, phase 4) |

## 4. The v3 program, in phases

Dependency order is load-bearing: **kernel → core → recs → interop →
platform/release**, with the twin program (phase 6) free to run in
parallel once task 32 lands. Each item names its Appendix B driver —
phase 6's drivers are Volume I, chapters 14–15.

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
- ● (phase 7) — publish **the OIML-CS as its own reference package**:
  the scheme content out of the rec packages — the B 18:2025 framework
  model, the twelve-document corpus, PD-05's 34 provisions — composed
  into every rec after the four CASCO foundation packages (Volume IV).
  The framework/documents content is YAML-only for the PRL codecs so
  far (the `provides` tokens sit in `UNSHIPPED_PROVIDES`);
- ● (phase 7) — re-home the certification workflow as **implementation
  content mapping to the scheme**: the concrete processes live in
  `data/core/` and map to the abstract scheme model via
  `platform-to-oiml-cs.prm` — the ◐ of §3 closed, and the unified
  coverage report answering "how much of PD-05 does this platform
  fulfil?" (42 mandatory, 37 covered, 5 justified named gaps);
- ● — the seven shared modules (emc-disturbances, env-iec60068,
  software-d31, reference-materials, specimen-governance,
  report-headers, examination-docs) cut as layer-2b packages
  (`data/modules/<name>/` with `provides:`/`requires:`/`with_slots:`;
  recs consume them via `{ module: …, with: … }` entries).

### Phase 3 — Recommendation re-expression

Depends on phase 2 (recs sit on the core):

- **R 60 re-authored v3-native** — the worked example end to end
  (promises, characteristics, artifacts where R 60 has them);
- **R 91 and R 144 as the stress cases** — set-valued dimensions,
  verification processes, simulator test kinds, statistics blocks: the
  features that forced the kernel's hand, exercised on real content;
- ● **R 129 migration** off the legacy tree (`data/r129/` runs the
  gates alongside the other three recs);
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

### Phase 5 — platform + release

Depends on phases 2–3, and — for the monitor adoption — on phase 6's
tasks 32–34; the release itself is last by definition:

- **platform runtime v3** (task 29) — the app adopts every landed v3
  primitive: subject anatomy, promises, artifacts, operational state,
  `uses` composition, the mapping calculus, the twin interface;
- **documentation site** (task 30) — this docs tree, published as a
  site; can start any time after the tree stabilizes;
- **gates and release** (task 31) — every command gate green from v3
  sources, then the release ships.

### Phase 6 — live twins + continuous compliance

The twin direction of Volume I, chapters 14–15, as executable tasks.
Task 32 depends only on kernel pieces (the subject construct,
instantiation, quantities, operational state), so phase 6 can run in
parallel with phases 2–4 once it lands:

- **twin interface primitives** (task 32) — `endpoint` (operations,
  access scopes), `serve` bindings, connector profiles, freshness
  windows: the integration language of chapter 14, §14.4;
- **API gateway** (task 33, depends on 32) — the connector layer:
  external sources bind to the implementation model's registers with
  authentication by role and freshness semantics — the 2021 plugin
  pattern generalized (chapter 14, §14.7);
- **Compliance Engine — the monitor runtime** (task 34, depends on
  02 + 32 + 33) — continuous evaluation as a service: trigger → fetch →
  freshness → the same OCL (INV-9) → verdict → time-stamped evidence →
  escalation (chapter 14, §14.5);
- **DPP projection** (task 35, depends on 08 + 32) — the model-native
  passport in its two modes (abstract / live), answering ESPR and
  JTC24's eight areas (chapter 14, §14.6);
- **product reference packages** (task 36, depends on 04 + 05 + 15 +
  16) — the manufacturer's `product_reference` kind: the product model
  mapped aspect-by-aspect to the Recommendation, consumed by abstract
  import or live integration (chapter 15);
- **live-twin pilot** (task 37, depends on 18 + 32–36) — ACME LC-500
  into the quarry's belt scale, end to end (chapter 15, §15.7): author,
  map, certify, import, go live, audit.

## 5. The consolidated status table

| Area | Marker | Where it stands |
|---|---|---|
| R 60 / R 91 / R 144 / R 129 packages (new layout) | ● | running, gates green |
| Primmel v2 toolchain (W1–W8) | ● | parser, packages, round-trip, plug, linter |
| App command gates | ● | 0/0 errors, 2788 tests, 39/39 e2e (2026-07-23) |
| Applicability / verdict / form / state / dispatch engines | ● | `browser/src/data`, `browser/src/services` |
| CASCO foundation packages + facet trio | ● | phase 7, tasks 39a–d — Volume IV, ch. 2 |
| OIML-CS reference package (framework + corpus + PD-05) | ● | phase 7, tasks 40–43 — Volume IV, ch. 1/3/4 |
| Participant + operations runtimes, unified coverage | ● | phase 7, tasks 44–45 — Volume IV, ch. 5–7 |
| Promises, characteristics | ◐ | §3 — closed in phases 1–2 |
| Kernel primitives (structure, artifacts, state, duality, set-dimensions, process extensions, mapping calculus, uses) | ○ | phase 1 |
| OIML Core re-home (metamodel as a v3 package) | ○ | phase 2 |
| Rec re-expression (R 60 native; R 91/R 144 stress) | ○ | phase 3 (R 129 migration ●) |
| Fragment provenance, ISO 24229, text coverage, projections, model diff | ○ | phase 4 |
| Platform runtime v3, documentation site, gates & release | ○ | phase 5, tasks 29–31 |
| Twin interface primitives (endpoint, serve, connector profiles, freshness) | ○ | phase 6, task 32 (Volume I, ch 14 §14.4) |
| API gateway + Compliance Engine monitor runtime | ○ | phase 6, tasks 33–34 (ch 14 §14.5/§14.7) |
| Passport projection, product reference packages, live-twin pilot | ○ | phase 6, tasks 35–37 (ch 14 §14.6, ch 15) |

## 6. Summary

- The system runs today: four Recommendations in the new layout, the
  v2 toolchain complete (W1–W8), the OIML-CS fully implemented (phase
  7: CASCO foundation, B 18 framework, the documents corpus, both
  runtimes, the unified coverage report), all gates green.
- The honest partials are two: promises declared-only, characteristics
  specification-side. (The third former partial — the workflow as an
  unnamed implementation model — closed in phase 7: the OIML-CS is its
  own reference package, the concrete processes map to it by `.prm`.)
- The v3 program is phased by dependency: kernel primitives first, then
  the OIML Core re-home (whose OIML-CS half landed early, as phase 7),
  then Recommendation re-expression, then interop; the platform release
  (phase 5) ships it, and the twin program (phase 6 — endpoint / serve /
  freshness, the gateway, the monitor runtime, the passport projection,
  product reference packages, the LC-500 → quarry pilot, all ○) takes
  the standard to the product, continuously.
- Every ○ item traces to the concept frame's Appendix B or to the twin
  chapters (Volume I, 14–15); every ● item traces to a gate. Nothing
  here is aspiration without an address.

*Next: [Volume I — Primmel, the language kernel](../primmel/README.md):
the concepts this roadmap realizes.*
