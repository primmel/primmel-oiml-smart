# Chapter 8 — Walkthrough: OIML R 60

> *In this chapter:* the methodology of Chapters 1–7 applied once, in
> full, to one Recommendation. OIML R 60 (load cells) is the worked
> example of this volume: every file cited below exists in
> `data/r60/`, and every decision is one the author of the next
> Recommendation will face in the same order.

---

## 8.1 From three documents to one running package

R 60 arrives as three source documents — R 60-1 (requirements),
R 60-2 (test procedures), R 60-3 (test report format), 2021 editions —
and leaves as a package: 107 YAML files under `data/r60/`, 40
attributes, 60 requirements, 62 conformance tests, 38 symbols,
17 calculations, 13 seeded evaluation flows, zero validation errors.
The mapping from documents to layers is the methodology's own:

| Source | Lands in | As |
|---|---|---|
| R 60-1 clause 3 (terms, taxonomy) | `model/` | subject type, variants, dimensions, attributes |
| R 60-1 clauses 5–6 (requirements) | `specification/requirements/` | bound OCL limits |
| R 60-2 (procedures) | `specification/conformance/` | tests with derived variables |
| R 60-3 (forms) | `execution/forms/` | bound evidence views |
| R 60-2 §2.4 + Annex D (selection) | `evaluation/sample-selection-rules.yaml` | the merit-walk as data |
| R 60-4 / PD-05 (evaluation) | `evaluation/` + `entities/workflow.yaml` | the judgment config of Chapter 6 |

The rest of this chapter walks the five decisions that make it a
*model* rather than a transcription, in authoring order.

## 8.2 The subject: LoadCell, four variants, five axes

The subject declaration (`data/r60/model/instrument.yaml` —
`subject_type`) is a subclass of the metamodel's
`MeasuringInstrumentModel` with its normative definition and clause
provenance (R 60-1, 3.1.3). The signal-processing taxonomy of 3.1.3 is
four **variants** — `analogue_passive`, `analogue_active`, `digital`,
`digital_with_processing` (3.1.3.1–3.1.3.4) — each with definition and
source clause. Variants change what the subject *is*; they are IS-level
structure, not classification.

Classification is five orthogonal dimension axes
(`classification_dimensions`), each scoped to the chain level where it
is *set*: `technology`, `humidity_class` and `construction` at family
scope; `accuracy_class` and `load_type` at group scope. The
`accuracy_class` axis shows why dimensions are data, not just enums:
each value carries the `n_lc_limits` payload of R 60-1 Table 1 —

```yaml
      - id: C
        n_lc_limits: { lower: 500, upper: 10000 }
```

— so "class C" is not a string but a machine-checkable claim: n_lc must
fall in [500, 10000], and the linker can test every group that declares
the class. Every axis is mirrored by an `is_dimension: true` attribute
in `attributes.yaml`, so requirement `applicability` blocks and
capability filters reference one uniform vocabulary.

## 8.3 The family matrix: criteria, groups, and the C6 label

R 60-1, 3.4.2 defines the load cell family by six criteria, transcribed
**verbatim** into `family_criteria` — same material, same measurement
technique, same strain-gauge attachment principle, same construction
method, same set of specifications, one or more groups of identical
metrological characteristics. The criterion is a *boundary rule*: a
candidate model violating any criterion is a different family — a
separate application, not another group.

Inside the family, `model_groups` declares what a group is: Models
having identical metrological characteristics —

```yaml
  identical_characteristics: [ metrological_class, n_lc, "y", z, temperature_rating ]
  identical_attributes: [ accuracy_class, n_lc, "y", z, t_min, t_max ]
```

— and each group carries a compact `group_label`: `'C6'` is class C
with n_lc 6000. Within a group, Models differ only by E_max (R 60-2,
Annex D), which is what makes the family a *matrix*: capacities ×
metrological characteristics, one cell per (group × capacity). The label
is not decorative — it is the same string the certificate template's
`dimension_labels` pattern composes (`{accuracy_class}{n_lc_thousands}`),
so the taxonomy and the certificate can never disagree about what was
approved. Sample selection runs per group, and R 60-2 §2.4 + Annex D's
merit walk (smallest E_max per group, 5–10× steps) is data in
`evaluation/sample-selection-rules.yaml`, e.g. rule
`D.2.2-smallest-per-group` with selector
`MIN(e_max) GROUP BY group_id`.

## 8.4 The attribute register: three decisions

The 40-entry register (`data/r60/model/attributes.yaml`) is the INV-2
schema layer: each attribute defined once — snake_case id, print
`symbol`, definition, clause source, quantity kind, unit, `origin`,
`scope`, `category` — then *valued* per chain level. Three entries
teach the decision table:

**`e_max` — design-fixed, model scope.** The maximum capacity
distinguishes one catalogue model from another; it is set by design and
stated per Model:

```yaml
  - id: e_max
    symbol: E_max
    source: { doc: urn:oiml:pub:r:60-1:2021, clause: "3.5.5" }
    origin: design-fixed
    scope: model
```

**`d_min` — test-dependent, sample scope.** The smallest load actually
applied during test is chosen under test, differs per physical unit,
and is never inherited: it lives on the sample's `test_context`:

```yaml
  - id: d_min
    symbol: D_min
    origin: test-dependent
    scope: sample
```

**`dr` — the scope/origin puzzle.** Minimum dead load output return is
`origin: test-dependent` (its value is verified per sample by the DR
test) but `scope: group` (it is *stated* as a declared group
characteristic), with a `derived` fallback
`(self.e_max - self.e_min) / (2 * self.z)` and a note making the split
explicit: "Declared group characteristic (verified per sample by the DR
test); the measured value is a D2 MeasurementResult." Origin says where
the value comes from; scope says where it is stated. The two align
often enough to lull you — `dr` is the register's reminder to decide
them independently.

## 8.5 Requirements walk: definitional and lookup

**A definitional requirement** (`/req/metrological/measuring-range-max`,
R 60-1, 5.2) shows the full anatomy in six lines of substance:

```yaml
      binds_to:
      - sample.test_context.d_max
      - model.parameters.e_max
      limit:
        expression: "ocl{sample.test_context.d_max <= model.parameters.e_max}"
        uses:
        - sample.test_context.d_max
        - model.parameters.e_max
      verification:
        method: definitional
```

Statement + clause URN carry the normative text; `binds_to` anchors the
two aspect paths (a HAS test-context value against an IS design
parameter — the duality made executable); `limit` is the machine-check;
`verification.method: definitional` says honestly that the type
definition itself is checked, no lab needed. The legacy
`acceptance_criteria` block stays for provenance, but binds/limit is
canonical — an unbound requirement judges nothing.

**A lookup requirement** (`/req/metrological/creep`, R 60-1, 5.5.1)
shows the table discipline: the limit is computed from data, never
restated —

```
ocl{abs(c_c) <= 0.7 * abs(lookupMPE(sample.test_context.d_max,
    group.classification.accuracy_class, 0.7))
    and sample.test_context.d_max >= 0.9 * model.parameters.e_max
    and sample.test_context.d_max <= model.parameters.e_max}
```

Three facts are modelled, not hidden in prose: the observable `c_c`
(creep, a characteristic derived from behavior I/O) is judged against
0.7 × MPE; the MPE itself comes from `mpe_tiers` in `tables.yaml` via
`lookupMPE` (Recommendation tables are data — never bake tiers into
OCL); and the creep clause's own rule that p_LC is *always* 0.7 here is
the literal `0.7` argument, not the manufacturer's declared p_LC. The
conjoined `0.9 * e_max <= d_max <= e_max` carries the test-geometry
validity condition in the same statement.

## 8.6 Tests walk: variables, instances, inheritance

The central metrological test,
`/conf/metrological-tests/measurement-error-repeatability-mdlo`
(R 60-2, 2.10.1), targets three requirements and shows the variable
discipline. Every variable has a `source`: `measured` run inputs,
`derived` OCL over inputs, `computed` table lookups —

```yaml
      - name: e_r
        source: derived
        derivation: "ocl{(max(runs->collect(r | r.indication)) - min(runs->collect(r | r.indication))) / conversion_factor_f}"
      - name: mpe
        source: computed
        derivation: "ocl{lookupMPE(test_load, accuracy_class, p_lc)}"
```

— all *derived from* the requirement limits and subject parameters,
never restated by hand (INV-3 for tests).

Two author-facing mechanisms deserve attention:

- **`instances:` — runtime class-driven instantiation.** The run count
  is not a constant: A/B run 5 applications, C/D run 3 (R 60-2,
  2.10.1.12). The test declares it once —

  ```yaml
      instances:
        by: accuracy_class
        values:
          A: { n_runs: 5 }
          B: { n_runs: 5 }
          C: { n_runs: 3 }
          D: { n_runs: 3 }
  ```

  — and the applicability engine expands it per subject at runtime.
  The comment in the file records the bug this replaced: a hardcoded
  `n_runs: 3` had silently materialized class A/B forms with 3 runs.
- **Class inheritance.** Per-class aggregations in
  `conformance/class-specific.yaml` inherit the generic procedure and
  restate only deltas: `inherits_from:
  /conf/metrological-tests/measurement-error-repeatability-mdlo` under
  scope `applicability: { accuracy_class: [A] }`, with class-scoped
  targets (`/req/class-a/mpe`), its run count and its 2 °C MDLO
  increment. Nothing about the procedure is copied.

Run validity is a precondition, not a verdict: the test's
`preconditions:` carry the temperature-stability rule of R 60-2,
2.7.3.1, evaluated before the limit — a violated precondition yields an
`invalid` run (void), never a `fail`.

## 8.7 Forms walk: binds and the binding-key drift

Forms are views onto the entity graph. The shared header
`r60-3/header-a` (`execution/forms/shared/headers.yaml`) shows all
three bind families in one place:

```yaml
      - name: application_no
        bind: application.application_number     # read-only identity
      - name: emax
        bind: model.parameters.e_max             # IS design parameter
      - name: dmax
        bind: sample.test_context.d_max          # HAS test-context value
```

Bound fields prefill from the resolved chain and write through on
submit; unbound fields (`force_generating_system`, the conditions
block) are the run's raw evidence. One header, and the subject chain's
whole delegation is exercised.

The creep/DR form (`execution/forms/sec-6-performance-tests/creep-dr.yaml`,
`r60-3/table-6.8`) shows a form wired end-to-end: `header:
r60-3/header-a`; `conformance_test: [/conf/metrological-tests/creep,
/conf/metrological-tests/dr]`; `requirements: [/req/metrological/creep,
…]`; `calculation_context: { dimensions: true, tables: [mpe_tiers] }`;
per-field `measurement_method` (`declared`, `direct`, `computed` +
`calculation`/`calculation_bindings`, `derived` OCL, `evaluated` with
`evaluation.rule`); and a closing `pass_fail.pass_if` over the three
evaluated results.

It also carries the register's most instructive defect. The
`conversionFactor` calculation declares an input named `n` — the
verification intervals *of the tested range*: `(E_max − E_min)/v_min`
when the test spans the classified range (R 60-3, 2.1.2.4), equal to Y
in that case. The form's sibling field `n_lc` is a different quantity:
the manufacturer's declared *maximum* intervals
(`group.parameters.n_lc`). The methodology's pitfall register (§9.4,
item 8) records the drift — the form bound `n_lc` where the calc
declares `n` — and the repaired binding is what ships:

```yaml
      calculation: conversionFactor
      calculation_bindings:
        avgIndicationAt75pct: reference_indication_75pct
        indicationAtDmin: indication_at_dmin
        "n": n_test_intervals                    # calc input n ← dedicated derived field
```

Two lessons in one line: binding *keys* must equal the calc's declared
input names, and easy-to-confuse integer quantities (`n_lc` vs `n` vs
`y`) are different semantics — the linker rule
("`calculation_bindings` key matches a declared calc input") exists
because this exact drift shipped green once.

## 8.8 Evaluation walk: thirteen flows to a certificate

`data/r60/sample-data.yaml` seeds thirteen complete flows compiled from
fifteen real certificate PDFs — the DE1/PTB Hottinger HLCi family among
them: one manufacturer → one family (`technology: digital`,
`humidity_symbol: CH`, `construction: strain-gauge`, parameters p_LC
0.7, t_min −10 °C, t_max +40 °C…) → groups by classification label
(`grp-hbk-hlci-d1` with `group_label: "D1"`, n_lc 6000, Y 20000,
Z 6000, DR 0.03 kg) → models → 1–2 samples with `test_context` →
application → test request → test report with form instances →
evaluation → ACTIVE certificate. The full Chapter 6 synthesis runs over
this evidence: TestReportDeterminations at the admissibility gate,
per-requirement verdict re-execution rendered as the verdict matrix
(`VerdictMatrix.vue`), ModelEvaluations per model, the overall decision,
and a certificate whose classification labels (`C6`) are the groups'
own labels.

The seed is the package's proof of life: it exercises every layer in
order — delegation through the chain, applicability over the five axes,
calculations over bound evidence, the verdict chain — and it fails the
build when any layer drifts.

## 8.9 The twin angle: this package, switched on (○)

Everything above built the package for the laboratory. Volume I,
[chapter 14](../primmel/14-live-twins.md), §14.9 shows the same package
*switched on*: ACME ships LC-500 units with the endpoint `lc500_api`
declared on the subject (chapter 2, §2.11 of this volume), a quarry's
belt scale integrates one, and the IA's Compliance Engine subscribes to
`watch_state` and runs an hourly monitor over the served values.

Nothing in §8.2–§8.8 changes to make that possible — that is the
point. The monitor evaluates the §8.5 requirements' own
`lookupMPE(...)` against a live indication; a unit reporting `fault`
yields `invalid` through the same precondition semantics as §8.6; the
quarterly creep re-derivation is §8.6's characteristic computed over a
streamed series instead of a lab run; and the freshness rule (stale ⇒
`indeterminate`, never a silent pass) guards every served value. The
package authored once judges the Tuesday in the lab — and every day
after it. (Endpoint, monitor and engine are ○ in v3; the model they
consume is the one this chapter just walked.)

## 8.10 Grammar sketch *(illustrative v3 syntax)*

The whole walkthrough as one closure slice — each secondary element
anchoring the primary tier, each judgment referencing one derivation:

```prl
subject LoadCell {
  is { design_parameters { e_max : mass, origin design-fixed, scope model } }
  has {
    dimensions  { accuracy_class : group ∈ {A,B,C,D}
                  values { C { n_lc_limits { lower 500, upper 10000 } } } }
    attributes  { d_min : mass, origin test-dependent, scope sample }
    characteristics { c_c : creep = Δindication over 30 min at constant load }
  }
  does { behavior creep { in force, time -> out indication } }
}

requirement /req/metrological/creep {
  binds_to [observable c_c, sample.test_context.d_max,
            group.classification.accuracy_class, model.parameters.e_max]
  limit ocl{ abs(c_c) <= 0.7 * abs(lookupMPE(sample.test_context.d_max,
              group.classification.accuracy_class, 0.7)) }
  source "urn:oiml:pub:r:60-1:2021#clause-5.5.1"
}

conformance /conf/metrological-tests/creep {
  targets   [/req/metrological/creep]
  instances by accuracy_class { A:{n_runs 5} B:{n_runs 5} C:{n_runs 3} D:{n_runs 3} }
  preconditions { temperature_stability :
    ocl{ temperature_variation <= min(2, 0.2 * (t_max - t_min)) } }   # invalid, not fail
}

form r60-3/table-6.8 {
  header  r60-3/header-a
  fields  { emax bind model.parameters.e_max
            dmax bind sample.test_context.d_max
            f    computed conversionFactor { n <- n_test_intervals } }  # key = calc input
  pass_if ocl{ creep_30min_result and creep_20_30_result
               and dr_half_v_result }
}
```

## 8.11 Validation rules

The walkthrough exercises, concretely, the checks the author of the
next Recommendation should run first:

- every `binds_to` / `bind:` path resolves to a declared attribute at a
  scope-appropriate level (`model.parameters.e_max` yes;
  `sample.test_context.e_max` no);
- every dimension enum value used in `applicability` / `instances:`
  exists on the axis, and payload constraints hold (a group declaring
  class C with n_lc 12000 violates `n_lc_limits`);
- every `lookupMPE` table exists in `tables.yaml`; every
  `calculation_bindings` key equals a declared calc input;
- every test `targets` resolves; every class-specific aggregation's
  `inherits_from` resolves and its scope narrows the parent's;
- every clause reference resolves against the editions declared in
  `standard.yaml` (the 2017 → 2021 renumbering is recorded per file
  header: barometric-pressure `2.10.3 → 2.10.4`, humidity
  `2.10.4 → 2.10.5/6`);
- the seed compiles: every flow's chain (family → … → certificate)
  has all FKs resolving and `standard_id: oiml-r60` throughout.

## 8.12 Summary

- R 60 is the methodology executed once: three source documents → one
  package of 107 files, with each clause landing in its tier's layer.
- The subject is four IS variants over five HAS classification axes;
  dimension values carry machine-checkable payloads (`n_lc_limits`).
- The family matrix is criteria (verbatim) + groups (identical
  characteristics) + labels (`C6`) that the certificate reuses —
  taxonomy and certificate cannot drift apart.
- The attribute register's hard cases are the lessons: `e_max`
  (design/model) vs `d_min` (test/sample) vs `dr` (origin ≠ scope).
- Requirements bind and look up; tests derive variables and instantiate
  per class; forms bind into the chain and their binding keys are
  checked names, not suggestions; thirteen seeded flows carry the whole
  synthesis to a certificate.
- Switched on, nothing is re-modelled: Volume I, chapter 14, §14.9 runs
  *this* package — the `lc500_api` endpoint, the hourly monitor, the
  same `lookupMPE` — as its live-twin worked example (○).

*Next: [Chapter 9 — Walkthrough: R 91 and R 144](09-walkthrough-r91-r144.md):
two Recommendations of different kinds — and what modelling them forced
into the frame.*
