# Primmel v3 + OIML SMART — The Complete Documentation

This tree is the definitive documentation of **Primmel v3**, the executable
modelling language for SMART standards, and of the **OIML SMART system**
built on it. It is written as three courses — each volume is designed to
carry a semester's worth of teaching, in dependency order:

```
Volume I    primmel/      the language kernel — concepts, anatomy, grammar
Volume II   oiml-core/    the OIML metamodel — measuring-instrument modelling
Volume III  oiml-rec/     authoring OIML Recommendations — the methodology
Annexes     oiml-cs/      the OIML-CS certification-scheme reference package
            platform/     the SMART platform runtime (browser app, engines)
            shared/       glossary, alternatives audit, roadmap
```

**Prerequisites chain:** Volume I assumes nothing but literacy about
standards. Volume II assumes Volume I. Volume III assumes Volumes I–II.
The Annexes are reference material, readable out of order.

---

## How to read this documentation

### Reading tracks

- **Track A — language designer / tool implementer.** Read `primmel/` cover
  to cover, then `platform/`. You will learn every kernel concept, the
  grammar, the validation rules, and how the engines evaluate models.
- **Track B — metamodel maintainer (OIML core).** Read `primmel/`
  chapters 1–7, then `oiml-core/` cover to cover. You will learn how the
  subject chain, the measurement vocabulary, and the six metamodel modules
  are built from kernel primitives.
- **Track C — Recommendation author.** Read `primmel/` chapters 1–5,
  `oiml-core/` chapters 1–5, then `oiml-rec/` cover to cover. You will
  learn to author a complete, validated Recommendation package.

### Conventions

- **Status markers** — ● exists in the running system · ◐ partial ·
  ○ planned in v3. Chapters describe the v3 target; markers keep the gap
  honest.
- **Syntax blocks** tagged `prl` are Primmel v3 syntax. Where v3 grammar
  is still being finalized, the block is marked *(illustrative)* — the
  *concepts* are normative, the exact keywords may shift.
- **Diagrams** are hand-authored SVG in each volume's `diagrams/`
  directory, referenced relatively. Palette: slate structure, brand
  (indigo) subjects, green IS aspects, amber HAS aspects, red DOES
  aspects, violet relations.
- **References** to the running system use repo paths
  (`data/r60/…`, `ontology-remix/…`, `browser/…`) relative to the
  `oimlsmart/smart` repository.

### The concept foundation

The design dialogue this documentation realizes is consolidated in
`docs/primmel-concepts.md` of the `oimlsmart/smart` repo (the "concepts
document"). Where prose here and there disagree, this tree is the
developed form; the concepts document is the negotiation record.

---

## Volume I — `primmel/` — the language kernel

*What Primmel v3 is: the tier system, the subject anatomy, processes,
mappings, data and values, packages, and the cross-cutting machinery.*

| # | Chapter | Contents |
|---|---|---|
| 00 | `README.md` | volume overview, the v2→v3 delta |
| 01 | `01-philosophy-and-tiers.md` | executable standards; design principles; the tier system; model kinds; artifact kinds (.prl/.prd/.prm/.pws) |
| 02 | `02-subjects.md` | the Subject; IS/HAS/DOES discriminators; the full aspect catalog; duality; characteristics; universal anatomy |
| 03 | `03-instantiation.md` | definition vs instance; the subject chain; Sample; delegation; the uniform duality |
| 04 | `04-processes.md` | abstract vs executable processes; step vocabulary; executors; state; evidence I/O; repetition |
| 05 | `05-mappings.md` | reference vs implementation models; mapping semantics; the coverage calculus; justification; discovery |
| 06 | `06-data-and-values.md` | registries vs data classes; variables and sources; quantities/units/uncertainty; tables/profiles; time |
| 07 | `07-expressions.md` | OCL as the one rule language; stereotypes; binding; table functions |
| 08 | `08-packages.md` | manifests; `uses` composition; layering rules; modules; versioning |
| 09 | `09-provenance.md` | clause and fragment provenance; `.prd`; document reconstruction and congruence |
| 10 | `10-multilingual.md` | ISO 24229 spelling codes; multilingual content sets; rendering |
| 11 | `11-validation.md` | schemas, the linker, `primmel check`; coverage audits; text coverage |
| 12 | `12-interop.md` | ReqIF projection; RDF/OWL projection; OpenCDD integration |
| 13 | `13-diff-and-lifecycle.md` | model diff; editions as lifecycle packaging; change audit |

## Volume II — `oiml-core/` — the OIML metamodel

*How the kernel is specialized for legal metrology: the measurement
vocabulary, the subject chain, the six modules, the shared modules.*

| # | Chapter | Contents |
|---|---|---|
| 00 | `README.md` | volume overview; the 4-layer architecture |
| 01 | `01-measurement-vocabulary.md` | Module A: QuantityKind, Unit, QuantityValue, uncertainty, Measurand, InfluenceQuantity, Conditions, MeasurementResult, TraceabilityChain |
| 02 | `02-subject-chain.md` | Module C core: Family → Group → Model → Sample; VIML anchoring; classification; instantiation; delegation |
| 03 | `03-instrument-aspects.md` | Module C aspects: attributes/parameters, dimensions, capabilities, behaviors, conditions, characteristics; the IS/HAS/DOES instrument catalog |
| 04 | `04-identity-and-provenance.md` | Module B: Manufacturer, SoftwareComponent, Marking, Sealing, CalibrationRecord, Certificate |
| 05 | `05-specification.md` | Module D1: Recommendation, Requirement, ConformanceTest, TestMethod, TestStep; binding discipline |
| 06 | `06-test-execution.md` | Module D2: TestRun, EvidenceRecord, admissibility, ConstraintCheck, TestReport — facts only |
| 07 | `07-evaluation.md` | Module D3: SampleEvaluation, Verdict, TypeEvaluation, EvaluationReport, TypeApprovalDecision |
| 08 | `08-parties-and-workflow.md` | parties, roles, the certification workflow entities, lifecycle state machines |
| 09 | `09-invariants.md` | INV-1..10 and beyond: the metamodel's laws, each with rationale and checks |
| 10 | `10-shared-modules.md` | the seven shared modules (emc-disturbances, env-iec60068, software-d31, reference-materials, specimen-governance, report-headers, examination-docs) |

## Volume III — `oiml-rec/` — authoring OIML Recommendations

*The methodology: from Recommendation text to a validated package.*

| # | Chapter | Contents |
|---|---|---|
| 00 | `README.md` | volume overview; the package contract |
| 01 | `01-methodology.md` | the end-to-end authoring method; the checklist; validation gates |
| 02 | `02-modelling-the-subject.md` | subject types, variants, dimensions, attributes (origin/scope/category), capabilities, behaviors, conditions |
| 03 | `03-requirements.md` | anatomy; binding; OCL limits; applicability; verification methods; tables and profiles |
| 04 | `04-conformance-tests.md` | variables and sources; steps; conditions; acceptance criteria; inheritance; instances; kinds and obligation |
| 05 | `05-forms-and-reports.md` | bind paths; measurement methods; pass/fail; the test-report skeleton; checklists; omissions |
| 06 | `06-evaluation.md` | determinations, verdicts, model evaluation, decision; certificate template; approvals |
| 07 | `07-packaging.md` | the package layout; `uses` composition; sample data; registration |
| 08 | `08-walkthrough-r60.md` | the R 60 worked example, end to end |
| 09 | `09-walkthrough-r91-r144.md` | speed meters and gas analyzers: the stress cases |

## Annexes

| Dir | Contents |
|---|---|
| `oiml-cs/` | the OIML-CS (PD-05) certification-scheme reference package: the 7-step workflow, determinations, evaluation reports, certificates, BIML registration — as a *reference model* implementation packages map to |
| `platform/` | the SMART platform: the browser app architecture, the engines (applicability, verdict, form-context, state-walk), stores, role consoles |
| `shared/` | `glossary.md` (every term, one definition), `alternatives-audit.md` (DIN DKE SPEC 99200 / ReqIF and IEC-ISO Core Ontology compared), `roadmap.md` (status ●◐○ and the path to v3) |

---

*Documentation status: scaffold + Volume I exemplar chapters. Remaining
chapters are being written in dependency order; unwritten entries in the
tables above are planned, not stubs.*
