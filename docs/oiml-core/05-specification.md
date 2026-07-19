# Chapter 5 — Specification

> *In this chapter:* Module D1 of the metamodel — the secondary tier made
> concrete. Recommendations, requirements, conformance tests, and test
> methods: what must be true, and how it will be checked — definitions
> only, bound to the subject, owning no facts.

---

## 5.1 Module D1: the specification layer

Module D1 (`conformity-specification` in
`ontology-remix/OIML Core Models/Ontology/oiml-core-ontology.yaml`) is where
a Recommendation stops being prose and becomes an executable constraint
system. Its purpose line is the whole discipline in one sentence:
*"Definitions only: what must be true, and how to check."* Two laws keep it
honest:

- **The dependency rule.** D1 depends on Module A (typed values) and
  Module C (the subject chain): it *binds to* instrument-description paths,
  never adds instrument facts, never references D2 or D3.
- **INV-3 (binding, not restating).** Every D1 element references
  attribute paths into instrument-description; nothing physical is defined
  in the specification layer. A number that belongs to the instrument is a
  primary value, or a limit in a table the requirement references.

Five classes carry the module — `Recommendation`, `Requirement`,
`ConformanceTest`, `TestMethod`, `TestStep`, plus `ReferenceMaterial` —
instantiated for R 60 in `data/r60/specification/` (`requirements/`,
`conformance/`, `tables.yaml`, `verdicts.yaml`).

## 5.2 Recommendation — one document, one subject type

A **Recommendation** is the regulatory document itself, and its defining
rule is unity of subject: a Recommendation governs **exactly one** subject
type. `subjectType` references a domain-profile subclass of
`MeasuringInstrumentModel` — for R 60, the `LoadCell` of
`data/r60/model/instrument.yaml` (VIML 4.06). Every requirement, test,
table and form it contains is a statement about that one type; a second
subject type is a second Recommendation, related by reference, never by
mixture.

The class is small: `id`, `title`, `version`, `subjectType`, the
`requirements` list, and an optional `supersedes` link. In the running
system the identity block of `data/r60/standard.yaml` plays this role ●;
the `supersedes` chain is carried as the edition list ◐ — first-class
supersession with validity windows is v3 package machinery (Volume I,
Chapter 13).

## 5.3 Requirement — a constraint over aspect paths

A **Requirement** is what must be true: a regulatory limit bound to the
subject. The metamodel fields: `bindsTo`, `statement`, `limit`
(`{ expression, uses }`), `appliesOver`, `formalizes`, `verifiedBy`, and an
optional `acceptance` decision rule. The R 60 anatomy
(`data/r60/specification/requirements/metrological.yaml` —
measuring-range-max, R 60-1 §5.2):

```yaml
- name: Maximum load of the measuring range
  identifier_fragment: measuring-range-max
  reference: "urn:oiml:pub:r:60-1:2021#clause-5.2"
  statement: "The value of the largest load applied to a load cell during test … shall not be greater than E_max."
  binds_to: [sample.test_context.d_max, model.parameters.e_max]
  limit:
    expression: "ocl{sample.test_context.d_max <= model.parameters.e_max}"
    uses: [sample.test_context.d_max, model.parameters.e_max]
  verification:
    method: definitional
```

Six parts, each with one job:

1. **Statement + reference** — the normative sentence and its clause-URN
   provenance. The text is a rendering; the model is the source of truth.
2. **`binds_to`** — the typed anchor set: `model|family|group.parameters.<attr>`,
   `*.classification.<dim>`, `sample.test_context.<attr>`, plus
   `observable:<symbol>` for test outputs (INV-3 made visible).
3. **`limit.expression`** — the machine-checkable OCL Boolean; `uses`
   lists every input (attribute paths, `observable:` ids,
   `formula:`/`table:`/`profile:` references). The linker fails the package
   on an unbound input.
4. **`appliesOver` (applicability)** — the classification filter scoping
   the requirement to subject configurations, e.g. `humidity_class: [CH]`.
5. **`verifiedBy` / targets** — the requirement ↔ test link, declared on
   both sides. A requirement with no verifying test is unverifiable.
6. **`verification.method`** — *how* conformity is established:

   | Method | Meaning | R 60 example |
   |---|---|---|
   | `definitional` | follows from the type definition; checkable against declared parameters | measuring-range-max (above) |
   | `computational` | evaluated by calculation over declared/derived values | classification computations (classification.yaml) |
   | `testing` | requires a physical conformance test | creep, MPE (metrological.yaml) |
   | `inspection` | verified by visual/documentation examination | markings, sealing (technical.yaml) |
   | `deferred` | no single test; established in the overall type evaluation | durability: "Assessed through the overall type evaluation process" |

A requirement may **formalize a Constraint** (`formalizes:` ref into
Module C): a Recommendation that turns an intrinsic validity rule into law
references the constraint rather than duplicating it (§5.5).

**Limits have exactly one home.** When several layers need the same
acceptance quantity, it is derived once in the VerdictQuantity registry
(`data/r60/specification/verdicts.yaml`) and referenced — the requirement
via `limit.accepts: { verdict: mdlo_normalized, op: lte, limit:
ocl{p_lc} }`. The registry entry carries the single canonical derivation
(`ocl{abs(c_m * t_f / delta_t * (d_max - d_min) / (n * v_min))}`, R 60-3
§2.1.4); requirements, tests and form fields all reference it, none
restate it. (Chapter 7 returns to how evaluation consumes this.)

## 5.4 Acceptance decision rules

A limit as written is not yet a decision. The optional `acceptance:` block
declares the rule applied before comparison: `rule: shared_risk` (default
— the limit applies as stated) or `guarded` (a `guard_band` narrows the
effective limit, registry-side); `criterion` (the R 91-2 §6.1 taxonomy
stamped on the verdict); `statistics` (the R 91-2 §4.4 justification).
R 60 runs under the default; the block exists for R 91 and R 144. ● in
the registry and linker, ◐ in population.

## 5.5 Constraint vs Requirement

The classic D1 confusion, and the reason `formalizes` exists. A
**Constraint** (Module C) is an OCL `inv` over attribute values — an
intrinsic coherence rule; a **Requirement** is a regulatory limit. The
test-setup geometry of R 60-1 Fig. 3 is the canonical case
(`oiml-r60-loadcell-profile.yaml` — constr:r60:fig3-2b): `ocl{0.9 *
self.E_max <= self.D_max and self.D_max <= self.E_max}`.

"The test was set up wrong" → constraint — checked at run time; a
violation invalidates the run *as a test* (Chapter 6). "The instrument
must be this good" → requirement — judged at evaluation time (Chapter 7).
One is a fact about the test, the other a judgment about the subject:
conflating them is how "invalid run" becomes "failed instrument".

## 5.6 ConformanceTest — an operation on the subject

A **ConformanceTest** is the secondary-tier operation: it constrains the
*inputs* (stimuli), the *environmental context* (conditions to enforce),
and the *state* (run-validity preconditions), then *observes outcomes* as
typed observables. Tests observe outcomes; only requirements constrain
them. The R 60 anatomy (`conformance/metrological.yaml` —
measurement-error-repeatability-mdlo, R 60-2 §2.10.1):

- **`targets`** — the requirements verified: `/req/metrological/mpe`,
  `/req/metrological/repeatability`, `/req/metrological/temperature-effect-mdlo`, …
- **`kind`** — the taxonomy `performance | influence | disturbance |
  durability | span-stability`, mapping to the error model (influence
  factors within rated → MPE; disturbances → fault limits). ◐ — R 60 tags
  tests `type: Testing | Inspection`; new packages fill `kind` per test.
- **Variables = derived parameters + observables.** Each has a `source`:
  `declared` (subject parameter), `measured` (run input), `derived` (OCL),
  `computed` (table lookup). The defining discipline: test parameters are
  **computed from the requirement limits and the subject's parameters —
  never restated by hand**:

```yaml
      - name: e_r
        unit: v
        source: derived
        derivation: "ocl{(max(runs->collect(r | r.indication)) - min(runs->collect(r | r.indication))) / conversion_factor_f}"
      - name: mpe
        unit: v
        source: computed
        derivation: "ocl{lookupMPE(test_load, accuracy_class, p_lc)}"
```

  `mpe` is not a number written into the test; it is the requirement's
  limit, looked up at the test point. Change the MPE table and every test
  changes with it.
- **`preconditions`** — run-validity rules evaluated **before** any limit,
  e.g. `temperature-stability` (R 60-2 §2.7.3.1): `ocl{temperature_variation
  <= min(2, 0.2 * (family.parameters.t_max - family.parameters.t_min))}`.
  A violation makes the run's verdicts **`invalid`, never `fail`** — it
  voids the run, never the instrument; missing inputs never fire.
- **`instances`** — runtime class-driven instantiation: run counts resolve
  from the subject's classification — `by: accuracy_class`, A/B → 5,
  C/D → 3 (R 60-2 §2.10.1.12); the applicability engine expands per subject.
- **`method`** — the reusable procedure (§5.7). **Acceptance criteria** —
  composite OCL over observables, each item targeted at a requirement:
  `pass_if: "ocl{mpe_criterion and repeatability_criterion and
  mdlo_criterion}"`.

**Class inheritance.** Generic procedures are defined once; per-class
aggregations inherit via `inherits_from`, restating **only deltas**
(`conformance/class-specific.yaml` — Class A re-targets
`/req/class-a/mpe`, narrows `applicability: { accuracy_class: [A] }`).

## 5.7 TestMethod and TestStep

The **TestMethod** is the reusable procedure a ConformanceTest references:
`inputs` (stimuli — `{ name, kind, at?, traceable }`),
`conditionsToEnforce` (refs to `InfluenceQuantity`), ordered `steps`, and
`outputs` — typed observables `{ name, quantityKind, unit }`. The outputs
are the execution contract: **a method's outputs become the run's
data-input requirements in D2** — the slots evidence must fill (Chapter 6).

A **TestStep** is one ordered step: `order`, `action`, optional
`stimulus`, `capture`, `holdCondition`. R 60 declares steps with
`input_variables` / `output_variables` per step ●; explicit TestStep
entities with stimuli and hold conditions are the executable form layered
on when simulation demands it ◐.

## 5.8 ReferenceMaterial — machine-checked references

Certified references a standard's tests rely on (the R 144 certified gas
mixtures) are declared as data: identity fields (certified value,
uncertainty, traceability) plus normative **constraints** as OCL rules
bound to evidence fields via `evidence:` maps — e.g. U:MPE ≤ 1:3 with an
issuing-authority 1:2 override (R 144-1 §7.2.2.2). A test links materials
via `referenceMaterials: [<id>]`; a violated `on_violation: invalidate`
constraint voids the run before any verdict. ● for R 144, ○ for R 60.

## 5.9 Grammar sketch *(illustrative v3 syntax)*

```prl
recommendation R60 {
  title        "Metrological and technical requirements for load cells"
  version      "2021"
  subject_type LoadCell                      # exactly one
  supersedes   R60:2017

  requirement /req/metrological/measuring-range-max {
    statement  "The largest load applied during test shall not be greater than E_max."
    source     "urn:oiml:pub:r:60-1:2021#clause-5.2"
    binds_to   [sample.test_context.d_max, model.parameters.e_max]
    limit      ocl{sample.test_context.d_max <= model.parameters.e_max}
    uses       [sample.test_context.d_max, model.parameters.e_max]
    verified_by [/conf/metrological-tests/measurement-error-repeatability-mdlo]
    verification { method: definitional }
  }

  requirement /req/metrological/temperature-effect-mdlo {
    binds_to   [family.parameters.p_lc, group.parameters.v_min, group.classification.accuracy_class]
    limit accepts { verdict: mdlo_normalized, op: lte, limit: ocl{p_lc} }
  }

  conformance_test /conf/metrological-tests/measurement-error-repeatability-mdlo {
    kind       performance
    verifies   [/req/metrological/mpe, /req/metrological/repeatability, /req/metrological/temperature-effect-mdlo]
    derived_parameters {
      e_r : v = ocl{(max(runs->collect(r | r.indication)) - min(runs->collect(r | r.indication))) / conversion_factor_f}
      mpe : v = ocl{lookupMPE(test_load, accuracy_class, p_lc)}   # from the limit, never restated
    }
    observables [e_l : v, e_r : v, c_m : v]
    preconditions {                              # violation => run invalid, never fail
      temperature-stability: ocl{temperature_variation <= min(2, 0.2 * (family.parameters.t_max - family.parameters.t_min))}
    }
    instances by accuracy_class { A: { n_runs: 5 }, B: { n_runs: 5 }, C: { n_runs: 3 }, D: { n_runs: 3 } }
    method r60-2/2.10.1 {                        # TestMethod
      inputs   [test_load : mass { traceable: true }]
      steps { 1 "Determine f from 75% load" -> [conversion_factor_f]
              2 "Apply test loads at 20 °C reference" -> [e_l, e_r, mpe] }
      outputs  [e_l : v, e_r : v, c_m : v]       # the run's data-input requirements
    }
  }

  conformance_test /conf/class-a/measurement-error
      inherits_from /conf/metrological-tests/measurement-error-repeatability-mdlo {
    applicability { accuracy_class: [A] }        # restate only deltas
    verifies [/req/class-a/mpe]
  }
}
```

## 5.10 Validation rules

The linker and `primmel check` enforce, for D1:

- every requirement `binds_to` / `uses` path resolves to a declared
  attribute at a scope-appropriate level (no `sample.test_context.e_max`);
- every `observable:`, `formula:`, `table:`, `profile:` input resolves;
  `lookupMPE`/`lookupProfile` tables exist in `tables.yaml`;
- every requirement has a `verification.method`; every test `targets`
  resolves; `verifiedBy` is the inverse edge of some test's `targets`;
- every `accepts.verdict` resolves to the VerdictQuantity registry; no
  derivation is restated inline (`verdict-inputs-resolve`,
  `verdict-no-shadow`, `verdict-restatement`);
- every `applicability` value exists on its dimension enum; an
  `inherits_from` child declares deltas only;
- precondition `check` expressions are Boolean OCL with all inputs bound;
  no D1 element references D2/D3 classes (the dependency rule).

## 5.11 Summary

- Module D1 is definitions only: what must be true (requirements) and how
  to check (tests, methods) — bound to the subject, owning no facts (INV-3).
- A Recommendation governs exactly one subject type; editions relate by
  `supersedes`.
- A requirement is statement + provenance + `binds_to` + OCL `limit` +
  `uses` + applicability + verification method; it may formalize a Module-C
  Constraint — validity rule vs regulatory limit.
- Acceptance quantities are derived once in the VerdictQuantity registry
  and referenced everywhere (`limit.accepts`) — never restated.
- A conformance test derives its parameters from requirement limits and
  subject parameters; preconditions void runs (`invalid`, never `fail`);
  `inherits_from` children restate deltas only; a method's typed outputs
  are the run's data-input requirements — the seam where Chapter 6 begins.

*Next: [Chapter 6 — Test Execution](06-test-execution.md): Module D2 —
runs, evidence, admissibility, and the fact/judgment firewall.*
