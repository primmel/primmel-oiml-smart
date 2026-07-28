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
`data/<id>/` layout: **R 60** (the reference depth: subject model, 44
attribute definitions, requirements, conformance tests, R 60-3 forms
with 164 `bind:` paths, the full certification workflow, 13 seeded
real-certificate flows), **R 91** and **R 144** (new-layout trees with
model/entities/specification/execution/evaluation), and **R 129**
(migrated off the legacy tree). The legacy `data/oiml-r144/` tree is
archived read-only alongside `data/oiml-r129.legacy/` — both are
shadowed in discovery (never loaded), retained for provenance.

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

**The platform.** All command gates green as of `v3.1.0` (2026-07-28,
`3170207`: vue-tsc 0 errors; astro check 0 errors; vitest 3657/3657;
production build; validate 0 errors / 431 warnings — D8's honest close
removed the last R42 warning; e2e 55/55; ssot byte-clean — and the
from-packages proof WITH e2e: the same gates run
from the committed Primmel packages only, task 31). Feature-level ●
includes: the ONE applicability engine (dimension conditions,
`implies:`, `instances:`); the VerdictQuantity registry with
per-requirement verdict re-execution; preconditions (invalid ≠ fail),
modality (observation ≠ blocker) and the acceptance decision rule; the
form-context binding engine; state machines with declarative cascades;
dispatch derivation and capability-based lab selection; the
TestRun/EvidenceRecord runtime with custody; machine-checked reference
materials (R 144 CGMs); the certificate template and the PD-05
18-element checklist; the model linker with clause-referenced
allowlists; the BIML registration record and the public register at
`/app/register`; **the participant registry + approval pipeline + the
fail-closed issuance gate** (`/app/cs`); and
**the CS operations runtime** (utilization, appeals, post-issuance,
the register as the §15.8 validity source).

## 3. What is partial (◐)

| Concept | State today | The gap |
|---|---|---|
| **BIML registration** | record builder + idempotent register action + public register | true OIML-CS API integration (export feed) |

Former partials, closed since (the markers flipped when the gates went
green): **promises** (envelope-shaped claims on characteristics and
behavior with `verified_by` + the certificate print projection — task
08, C42–C44), **characteristics** (hoisted to the primary model with
symbol + derivation from behavior I/O, the specification referencing
them — task 10, C48–C50), **the designed/exhibited value duality** (the
`dual` kernel construct — task 06), **the quantity vocabulary**
(first-class `quantity_register` with unit kinds, SI factor/offset and
dimension vectors — task 06, C32–C34), **fragment provenance** (`.prd`
fragment-address bindings + the reconstruction congruence gate —
task 24).

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

- re-express the metamodel (`oiml-core-ontology.yaml`) as the
  OIML Core package on the v3 kernel — landed at **v0.6.1** with
  INV-1..14 as its laws (tasks 12/21);
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

### Phase 7 — the OIML-CS scheme (landed out of order)

The OIML-CS half of the core re-home arrived ahead of phases 3–6 as
its own program (tasks 39–45): the CASCO foundation packages, the
B 18:2025 framework, the documents corpus, the participant and
operations runtimes, and the unified coverage machinery — all told in
Volume IV.

### Phase 8 — executable-semantics enhancements

Driven by an external review of the R 60 SSOT pipeline (recorded as
`BUG.R60-SSOT.md` in the platform repo), phase 8 deepens the
executable semantics across kernel, core, and scheme layers:

- **testing-competence declarations** (task 48) — labs declare the
  competence kinds their test runs exercise, resolved against the
  competence-kind registry (linker rule R29);
- **the rec twin interface** (task 49) — conformance tests exposed as
  `endpoint`/`serve` bindings keyed endpoint::operation (D26), so a
  live instrument twin is probed straight from the rec model;
- **executable behavior anatomy** (task 50) — behaviors decompose into
  typed steps over registers with invariants (R30, D27); the R 60
  load-weight signal chain is calibrated against R 60-1's signal-path
  figure;
- **condition tiers** (task 53) — applicability conditions bind to
  tiered evaluation channels (R31); a skipped tier yields an
  indeterminate verdict, never a silent pass;
- **constraint entities** (task 51) — subject-intrinsic `inv` rules as
  first-class registered entities (R32, D28);
- **cascade transitions** (task 52) — declared workflow side-effects:
  a transition may emit follow-on transitions on other entities'
  state machines, with audit events (D29);
- **discrepancy records** (task 54) — recorded conflicts between
  corpus documents become first-class, coverage-visible objects;
- **the test hierarchy** (task 55) — Module-B marking / sealing /
  calibration records with lifecycle machines, the method facet, and
  single-home result shapes.

### Phase 9 — the R 60 SSOT viewer correspondence (landed 2026-07-26)

The driver is the educational viewer consuming the R 60 SSOT: its team
proposed seven content items it was maintaining as overlays
(`PROPOSAL.R60-SSOT-Phase9.md`), the model authors answered claim by
claim (`analysis/response-3-r60-ssot-phase9.md` — 4 adopted as
proposed, 2 adopted with corrected premises, 1 answered, no work
needed), and the follow-up round
(`PROPOSAL.R60-SSOT-Phase9.5.md` → `analysis/response-4-r60-ssot-phase9-5.md`)
added four more. Proposal → response → shipped, in one day:

- **electronic behaviors + R37** (task 56, ● f51c5a9) — `behaviors.prl`
  grows to 21: `dead-load-output-return` plus the nine
  electronic/influence responses (warm-up, humidity cyclic/steady, and
  the six `response-to-*` disturbance responses), each clause-anchored
  with `verified_by`; R37 `behavior-coverage` pins every
  stimulus-response test to ≥1 behavior (Volume III, §4.9);
- **the INV registry + R38** (task 57, ● same merge) — INV-1..10 as
  first-class typed data (`oiml-smart-core/specification/
  invariants.prl`, the note-family construct) with the enforcement
  crosswalk; R38 `invariant-crosswalk` proves every claim names real
  machinery — or the invariant declares itself aspirational (Volume II,
  §9.12);
- **test sequences + R39** (task 60, ● a98039e) — required orderings as
  data (`mdlo-creep-dr`, `temperature-cycling`), runtime enforcement
  through the admissibility path: out-of-order ⇒ INVALIDATED, never a
  fail (Volume III, §4.10);
- **the 7 workflow lifecycle machines + R42** (task 61, ● 6a9484b) —
  declarative, machine-routed: every service mutation delegates to the
  walker, behavior preserved (zero assertion changes); R42
  `state-machine-integrity` checks the declarations against their
  entity classes (Volume II, §8.5);
- **item 3 (mappings)** — folded into task 35: the R 60 → DPP mapping
  rides the existing `.prm` primitive (`r60-to-dpp.prm` + the coverage
  gate, §14.6);
- **item 4 (curated model-diff records)** — adopted shape recorded
  (machine-verified summary counts + authored rationale on the existing
  `primmel diff` primitive); ○ not yet landed;
- **item 7 (capability decomposition)** — answered: already decomposed
  upstream with `requires`/`satisfies` obligations; the viewer deleted
  its overlay (Volume III, §2.8).

Phase 9.5 (the viewer's four contributions, accepted with one
duplicate declined and one semantic correction — formulas are
test-side, never process-side):

- **capability construction parameters** (9.5-a, ● 4a9b5db) —
  `gauge_type`/`bridge_type` on `strain-gauge`, `signal_bandwidth` on
  the two concrete electronics capabilities; engineering vocabulary
  honestly marked, `excitation_voltage` declined as a duplicate of
  `recommended_excitation` (Volume III, §2.8);
- **structured runs-per-class + R40** (9.5-b, ● same merge) — the
  `instances:` map keyed for every applicable class (R40
  `instance-coverage`) and pinned congruent with the normative method
  prose (Volume III, §4.11);
- **`formulas_used` + R41** (9.5-c, ● same merge) — the per-test
  evaluation-formula trace, `c_m` honestly closed by the new
  `mdloStepChange` calculation (Volume III, §4.12).

## 5. The consolidated status table

| Area | Marker | Where it stands |
|---|---|---|
| R 60 / R 91 / R 144 / R 129 packages (new layout) | ● | running, gates green |
| Primmel v2 toolchain (W1–W8) | ● | parser, packages, round-trip, plug, linter |
| App command gates | ● | vitest 3657/3657, validate 0 errors/431 warnings, e2e 55/55, ssot byte-clean (v3.1.0 `3170207`, 2026-07-28) |
| Applicability / verdict / form / state / dispatch engines | ● | `browser/src/data`, `browser/src/services` |
| CASCO foundation packages + facet trio | ● | phase 7, tasks 39a–d — Volume IV, ch. 2 |
| OIML-CS reference package (framework + corpus + PD-05) | ● | phase 7, tasks 40–43 — Volume IV, ch. 1/3/4 |
| Participant + operations runtimes, unified coverage | ● | phase 7, tasks 44–45 — Volume IV, ch. 5–7 |
| Clause-number reconciliation (official-PDF numbering) | ● | task 46 (c1e14ac, 2026-07-25) — every clause cite in the swept surfaces verified against the 11 official PDFs |
| Promises, characteristics | ● | tasks 08, 10 (C42–C44, C48–C50) — §3 |
| Kernel primitives (structure, artifacts, state, duality, set-dimensions, process extensions, mapping calculus, uses) | ● | phase 1, tasks 01–11 (+ 38) |
| OIML Core re-home (metamodel as a v3 package) | ● | phase 2, tasks 12–16; the OIML-CS half landed as phase 7 |
| Rec re-expression (R 60 native; R 91/R 144 stress; R 129 migration) | ● | phase 3, tasks 18–22 |
| Fragment provenance, text coverage, model diff | ● | phase 4, tasks 24, 26, 28 |
| ISO 24229 multilinguality | ● | task 25 (2026-07-26, smart 8de8f4d + 8ef2752, kernel 14cf10d) — the `text` construct + C89, the vendored register snapshot + R43, the English-first migration of every tree (19 manifests, 978 legacy sites recoded), per-string selection; the acceptance: 44/44 pages byte-identical English on two servers, certificates byte-equal 5/5; translations out — Volume I, ch 10 |
| Interop projections (ReqIF, RDF/OWL + SHACL, OpenCDD IRDI) | ● | task 27 (2026-07-26): 27a R36 + the pinned snapshot, 27b 180 requirements/62 tests/128 relations/0 dropped, 27c 4,252 triples SHACL-clean + C85 |
| Platform runtime v3, gates & release | ● | tasks 29, 31 — the from-packages proof green (2026-07-24) |
| Documentation site | ◐ | task 30 — site launched; tagged `docs-v0.2.0` (2026-07-27); content patch cycles follow the audit |
| Twin interface primitives (endpoint, serve, connector profiles, freshness) | ● | phase 6, task 32 (Volume I, ch 14 §14.4) |
| API gateway + Compliance Engine monitor runtime | ● | phase 6, tasks 33–34 (ch 14 §14.5/§14.7) |
| Passport (DPP) projection | ● | phase 6, task 35 (2026-07-26) — kernel `passport` construct + projection engine with fail-closed access classes, C86–C88, `r60-to-dpp.prm` + coverage gate, the JTC24 alignment record (ch 14 §14.6, ch 12 §12.5) |
| Product reference packages, live-twin pilot | ● | phase 6, tasks 36–37 — ACME LC-500 → quarry, six pilot steps asserted (ch 15) |
| Twin certification program (TCD-1/2/3 + TW-1 backfill) | ◐ | TODO.v2/01 — the `oiml-twin-cert` package (kind `certification_program`, type 5), the probe channel, the verdict chain + twin certificate, the TW-1 governing document with cite-integrity (ch 17); surveillance monitor binding (TCD-4) + the acceptance suite (TCD-5) in flight |
| Phase-8 executable-semantics program | ● | tasks 48–55 merged at review-SHIP — driver `BUG.R60-SSOT.md` |
| Phase-9/9.5 SSOT-correspondence program | ● | tasks 56–61 + 9.5-a/b/c (2026-07-26) — electronic behaviors + R37, INV registry + R38, test sequences + R39, lifecycle machines + R42, capability parameters, R40/R41 — driver `PROPOSAL.R60-SSOT-Phase9(.5)` → Response 3/4 |
| The gap-close program (architecture-gaps-2026-07) | ● | 2026-07-27/28 — the construct quartet both legs (invariant C90/C91, test_sequence C92/C93, formulas_used C94, via cascades C95 + R44), D8 EvaluationReport honest close, G18 practice flows → real forms, B1/B2 twin freshness + fault leg, E13 nested text addressing, E14 PD-05 Ed-6 recodes, E15 INV-8 TestReport pin, C4 R 91 honest coverage (65.0%) — smart `v3.1.0` (`3170207`), kernel `bb1e13b` (C1–C96) |

## 6. Summary

- The system runs today: four Recommendations in the new layout, the
  v2 toolchain complete (W1–W8), the OIML-CS fully implemented (phase
  7: CASCO foundation, B 18 framework, the documents corpus, both
  runtimes, the unified coverage report), all gates green.
- The v3 program's phases 1–4 have landed (kernel, core re-home, rec
  re-expression, and interop — fragment provenance, text coverage,
  model diff, the ReqIF / RDF-OWL / OpenCDD projections with task
  27, and ISO 24229 multilinguality with task 25), and phase 5's
  platform runtime + release gates are ●:
  the from-packages proof builds the whole system from the committed
  Primmel packages with every gate green (task 31). The SSOT flip
  landed on top of it (task 31b): the packages are now THE source of
  truth — the `data/<rec>/` YAML trees regenerate from them
  (`npm run gen:data`), authoring is Primmel-native with the YAML-draft
  aid for migration, and the drift guard (`npm run test:ssot`) holds
  both directions byte-clean. The one honest
  partial left: the BIML registration's true OIML-CS API integration
  (export feed). (Two earlier partials — the workflow as an unnamed
  implementation model, and promises/characteristics — closed in
  phase 7 and in tasks 08/10.)
- The v3 program is phased by dependency: kernel primitives first, then
  the OIML Core re-home (whose OIML-CS half landed early, as phase 7),
  then Recommendation re-expression, then interop; the platform release
  (phase 5) ships it, and the twin program (phase 6 — endpoint / serve /
  freshness, the gateway, the monitor runtime, the product reference
  packages, and the LC-500 → quarry pilot all ●; the passport
  projection landed 2026-07-26 with task 35) takes the standard to the
  product, continuously. Phase 8's executable-semantics enhancements
  (tasks 48–55, driven by the external SSOT review) have landed on top,
  and phase 9/9.5 (tasks 56–61 + 9.5-a/b/c — the viewer correspondence:
  proposal → Response 3/4 → shipped, one day) closed the review's last
  content items with linker rules R37–R42.
- Every ○ item traces to the concept frame's Appendix B or to the twin
  chapters (Volume I, 14–15); every ● item traces to a gate. Nothing
  here is aspiration without an address.

*Next: [Volume I — Primmel, the language kernel](../primmel/README.md):
the concepts this roadmap realizes.*
