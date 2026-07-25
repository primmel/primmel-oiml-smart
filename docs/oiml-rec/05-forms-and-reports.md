# Chapter 5 — Forms and Reports

> *In this chapter:* the form — an evidence view that fills the models —
> and the report skeleton that composes forms into the lab's deliverable:
> bind paths, per-field measurement methods, calculation-binding
> discipline, form wiring, the pass/fail block, required/conditional
> applicability, the PD-05 checklist, and partial coverage with
> omissions.

---

## 5.1 Forms are evidence views

The third secondary model kind is the **form**: a fill-in template that
**fills the models**. A form is a view projecting the subject graph into
a record — bound fields prefill from the resolved chain and write through
on submit, unbound fields are the raw evidence slots. The
template/instance split is INV-2 discipline applied to evidence: the form
as authored is an evidence *schema*; the FormInstance a lab produces is
the *evidence*. Forms live in `data/<rec>/execution/forms/` (shared
headers first, then per report section), and the form-context engine
(`browser/src/data/form-context.ts`) is the pure interpreter — all
binding content is in the YAML.

Two consequences follow from "view, not document". A form owns no facts:
its bound fields display subject values resolved by delegation
(Family ← Group ← Model ← Sample), and submitting writes through to the
proper chain level rather than into a form-local copy. And a form owns no
judgments: the form-level result is the lab's recorded determination,
while the IA's per-requirement verdict is computed independently at
evaluation — the fact/judgment firewall (INV-4).

## 5.2 The bind vocabulary

Bound fields use the same canonical paths as requirement `binds_to`
(§3.3), plus read-only identity paths for the record's heading (●
`data/r60/execution/forms/shared/headers.yaml` — `r60-3/header-a`):

```yaml
      - name: application_no
        bind: application.application_number     # identity — read-only
        type: string
        required: true
      - name: load_cell_model
        bind: model.model_designation            # identity — read-only
        type: string
        required: true
      - name: serial_no
        bind: sample.serial_number               # identity — read-only
        type: string
        required: true
      - name: emax
        bind: model.parameters.e_max             # parameter — prefill + write-through
        type: number
        unit: g, kg, or t
        required: true
      - name: dmax
        bind: sample.test_context.d_max          # sample test context
        type: number
        unit: g, kg, or t
        required: true
```

The full vocabulary: `model|family|group.parameters.<attr>`,
`*.classification.<dim>`, `sample.test_context.<attr>`, and the identity
paths `application.application_number`, `model.model_designation`,
`sample.serial_number`. Scope discipline is identical to chapter 3 — a
`bind:` path resolves to an attribute declared at that scope, and
`sample.test_context.e_max` is a linker error. Fields **without** `bind:`
are the run's evidence — `force_generating_system`,
`indicating_instrument`, the `conditions` block (dates, temperatures,
humidity, pressure at start and end) — stored on the FormInstance, never
written back into the subject chain.

## 5.3 measurement_method: where each field's value comes from

Every field declares a `measurement_method` — the source typing of the
field, parallel to the test-variable sources of §4.3 (●
`data/r60/execution/forms/sec-6-performance-tests/creep-dr.yaml`):

| method | meaning | creep-dr.yaml example |
|---|---|---|
| `declared` | a subject/chain value, bound or stated | `n_lc`, `dmin`, `dmax`, `plc_for_creep` (default 0.7) |
| `direct` | measured at the bench | `reference_indication_75pct`, `indication_at_dmin`, `actual_time_s` |
| `computed` | a declared calculation with bindings | `conversion_factor_f` via `calculation: conversionFactor` |
| `derived` | an inline OCL `derivation` over sibling fields | `max_creep_change_v` = `ocl{creep_readings->collect(r \| r.change_v)->max()}` |
| `lookup` | a table/profile lookup via a calculation | `mpe_at_dmax` via `calculation: mpe` |
| `evaluated` | a Boolean from an OCL `evaluation.rule` | `creep_30min_result` (Pass/Fail labels) |

The `evaluated` method deserves its example in full — it is how a form
displays a limit check *without* becoming a verdict:

```yaml
    - name: creep_30min_result
      type: boolean
      measurement_method: evaluated
      evaluation:
        rule: ocl{abs(max_creep_change_v) <= 0.7 * abs(mpe_at_dmax)}
        condition: "|C_C(30 min)| <= 0.7 x |MPE|"
        specification_reference: R 60-1, 5.5.1
      true_label: Pass
      false_label: Fail
```

The `condition` and `specification_reference` keep the human rendering
and the clause anchor next to the machine rule. Array fields model
series: `creep_readings` is `type: array` with a `series` block naming
its numeric axis (`elapsed_min`, unit min, role time) and cell
(`change_v`, unit v) — verdict expressions address readings *by the
axis* (`reading_at(window(…), 'elapsed_min', 30, …)` per R 60-3 §2.1.5.2),
never by string matching or extreme value.

## 5.4 calculation_bindings: the key discipline

Computed and lookup fields name a declared calculation and bind its
inputs to sibling fields:

```yaml
    - name: conversion_factor_f
      measurement_method: computed
      calculation: conversionFactor
      calculation_bindings:
        avgIndicationAt75pct: reference_indication_75pct
        indicationAtDmin: indication_at_dmin
        "n": n_test_intervals
```

**The keys of `calculation_bindings` are the calculation's declared
input names — not field names, not attribute ids, not renamed
conveniences.** `conversionFactor` declares inputs
`avgIndicationAt75pct`, `indicationAtDmin`, `n` (●
`data/r60/specification/calculations.yaml`), so those exact strings are
the keys; the *values* are this form's field names (`"n":
n_test_intervals` maps the calc's input `n` to a dedicated derived
field — `ocl{(emax - emin) / vmin}`, the intervals of the tested range
per R 60-3 §2.1.2.4 — not to the sibling `y` field it coincides with
when the test spans the classified range). The R 60 build's
**binding-key drift** pitfall was exactly this: a form binding `n_lc`
where the calc declared `n` — the engine silently gets an unbound input.
The linker now checks every binding key against the calc's declared
inputs; author to the calc, never to habit.

## 5.5 Wiring: tests, requirements, calculation context

A form declares its place in the closure (● creep-dr.yaml header block):

```yaml
  identifier: r60-3/table-6.8
  header: r60-3/header-a
  conformance_test:
    - /conf/metrological-tests/creep
    - /conf/metrological-tests/dr
  requirements:
    - /req/metrological/creep
    - /req/metrological/creep-20-30
    - /req/metrological/dr
  calculation_context:
    dimensions: true
    tables:
      - mpe_tiers
  references:
    - { urn: urn:oiml:pub:r:60-1:2021#clause-5.5.1, role: requirement }
    - { urn: urn:oiml:pub:r:60-2:2021#clause-2.10.2, role: test-procedure }
    - { urn: urn:oiml:pub:r:60-3:2021#clause-2.1.5,  role: calculation }
```

- `header` composes a shared header schema — author headers once
  (§5.2's `r60-3/header-a` for load tests, `header-b` for humidity,
  `header-c` for EMC), never per form.
- `conformance_test` links back to §4's tests (their `result_forms`
  point here); `requirements` lists the requirements whose evidence this
  form captures. The linker walks both directions: test → form →
  requirement.
- `calculation_context` declares what the form's calculations may read:
  `dimensions: true` exposes the classification dimensions; `tables`
  whitelists lookup data (`mpe_tiers` for the creep MPE).
- `references` carries typed clause provenance — requirement clauses,
  test-procedure clauses, calculation clauses, each with its role.

One direction of that wiring is load-bearing, and since task 55 it has
exactly one home (● smart ce10a43): **the test's `result_forms` IS the
test's evidence contract.** Report-completeness derivations — the form
programme, `services/program.service.ts formProgramFor` — read the
contract *from the test node* (`evidenceContractFor` is the queryable
accessor). The form's own `conformance_test:` field survives as the
form-side answer to one question only — "which test does this form
instance serve?" (test-run pinning) — and is never a second
completeness source. Adding a form to a test's programme means authoring
it into the test's `result_forms` (in the PRL package), never patching
the form side; the rule already paid for itself when it exposed the R 60
`load-test` omission in the MDLO test's programme.

## 5.6 The pass_fail block

A form closes with its acceptance display:

```yaml
  pass_fail:
    criteria: |
      30-min creep C_C(t) <= 0.7 * |MPE|;
      20-30 min difference C_C(30-20) <= 0.15 * |MPE|;
      C_DR <= 0.5 v (if time intervals met)
    pass_if: ocl{creep_30min_result and creep_20_30_result and dr_half_v_result}
```

`criteria` is the human-readable rendering for the printed report;
`pass_if` is OCL over the form's `evaluated` fields. What this result
*is* matters: it is the **lab's recorded determination** on this form —
a fact about what the lab concluded, stored with the FormInstance. It is
not a verdict. The IA's per-requirement verdicts are re-executed at
evaluation from the requirement limits against the same evidence (INV-5);
the two agree when the model is coherent, and the evaluation path is the
authoritative one when they diverge. Authoring rule: `pass_if` composes
the form's evaluated fields; it never introduces a new limit — limits
live in requirements (chapter 3) or the VerdictQuantity registry (§3.7),
and forms reference them.

## 5.7 The test-report skeleton

`execution/test-report.yaml` structures the lab's deliverable as sections
of forms, each marked `required: always | conditional` with
`applicability` carrying the condition (●
`data/r60/execution/test-report.yaml`):

- **clause 4 "Evaluation Report"** — administrative and descriptive:
  issuing authority, synopsis, manufacturer/applicant/laboratories, type
  information, sample selection, equipment — all `required: always`.
- **clause 5 "Examinations"** — marking, suitability, documentation
  (`always`); software examination `conditional` on
  `technology: [analogue-active, digital]`.
- **clause 6 "Performance Tests"** — summary plus subsections: *Base
  Metrological Tests* (load-cell-errors, repeatability, temperature-mdlo,
  creep-dr `always`; load-test `conditional` per class; barometric-pressure
  `conditional` with a note — required unless the manufacturer
  demonstrates pressure-insensitivity, R 60-3 §2.1.6 footnote); *Humidity
  Tests* (`conditional` on `humidity_class: [CH]` / `[SH]`); *Electronic
  Load Cell Tests* — the whole subsection carries
  `applicability: { technology: [analogue-active, digital] }`, with
  span-stability further conditioned on `accuracy_class: [B, C, D]`.

Applicability may sit at form level or subsection level; the
applicability engine evaluates both. R 60 deliberately uses **no third
"optional" tier**: a form that never applies to a classification is
simply not required for it; a deliberately skipped in-scope form is an
omission (§5.8).

The skeleton is also where the OIML-CS becomes machine-checkable: PD-05
§4.4.3's 18 required report elements (a)–(r) are declared per element
with obligation and source/validation paths (●
`data/r60/execution/test-report-checklist.yaml`) — title, laboratory,
unique report id, applicant, Recommendation reference, category, type
designation, samples, dates, place, personnel, environmental conditions,
facility, setup, adjustments, results-with-uncertainty (`may`), per-test
conclusion, authorizing signature. Report compilation validates against
the list; an element with no source path is a gap the author closes in
the skeleton, not in the lab.

## 5.8 Partial coverage and omissions

Real evaluations split work across laboratories. The granularity of the
split is **form × sample × lab**, recorded as TestAssignment entities (●
`data/r60/entities/workflow.yaml` — `TestAssignment`): the IA creates
the tuples at dispatch, different labs may receive different subsets of
(form, sample) pairs even for one application, and each assignment
produces zero or one FormInstance. Each lab's TestReport therefore
carries exactly the forms its specialization covers — lab matching itself
is data (`lab-selection-criteria.yaml`: `humidity_symbol=CH` →
"humidity-testing").

A form that is in scope but deliberately not filled is not silence — it
is a declared **FormOmission** with justification (● same file):

```yaml
      - name: form_id
        description: "R 60-3 form identifier being omitted (e.g. 'humidity-sh')"
      - name: reason
        description: "Justification, e.g. 'Not applicable — CH humidity class, SH test not required'"
      - name: decided_by
        enum_values: [ia, test_lab]
```

This is the difference between *absence by applicability* (the skeleton
computed the form away), *absence by assignment* (another lab's report
carries it), and *absence by decision* (someone with authority said why).
Only the third needs a reason — and always needs one, because the
completeness side of evaluation (required vs covered forms) counts all
three.

## 5.9 Grammar sketch *(illustrative v3 syntax)*

```prl
form r60-3/table-6.8 {
  is {
    name "Creep DR"  source "urn:oiml:pub:r:60-3:2021#clause-6.8"
    header r60-3/header-a
  }
  has {
    conformance_test [ /conf/metrological-tests/creep,
                       /conf/metrological-tests/dr ]
    requirements     [ /req/metrological/creep, /req/metrological/creep-20-30,
                       /req/metrological/dr ]
    calculation_context { dimensions true  tables [ mpe_tiers ] }
    fields {
      emax : number  bind model.parameters.e_max      required
      dmax : number  bind sample.test_context.d_max   required  method declared
      reference_indication_75pct : number[counts]     method direct
      conversion_factor_f : number[counts/v]          method computed
        calc conversionFactor { avgIndicationAt75pct: reference_indication_75pct
                                indicationAtDmin: indication_at_dmin
                                n: n_test_intervals }  # keys = calc's inputs
      creep_readings : array  series { axis elapsed_min[min]  cell change_v[v] }
      max_creep_change_v : number[v]                method derived
        derive ocl{ creep_readings->collect(r | r.change_v)->max() }
      mpe_at_dmax : number[v]                       method lookup
        calc mpe { load: dmax, accuracy_class: accuracy_class, p_lc: plc_for_creep }
      creep_30min_result : boolean                  method evaluated
        rule ocl{ abs(max_creep_change_v) <= 0.7 * abs(mpe_at_dmax) }
        labels { true: Pass  false: Fail }
    }
  }
  does {
    pass_fail {
      pass_if ocl{ creep_30min_result and creep_20_30_result and dr_half_v_result }
    }
  }
}

test_report r60-3/test-report {
  section "6" "Performance Tests" {
    subsection "Humidity Tests" {
      form humidity-ch  required conditional  applicability { humidity_class: [CH] }
      form humidity-sh  required conditional  applicability { humidity_class: [SH] }
    }
    subsection "Electronic Load Cell Tests"
               applicability { technology: [analogue-active, digital] } { … }
  }
  checklist pd05-4.4.3   # 18 elements, each with obligation + source path
}
```

## 5.10 Validation rules

- every `bind:` path resolves to a declared attribute at a
  scope-appropriate level, or to a declared read-only identity path;
  unbound fields are evidence by construction;
- every field declares a `measurement_method`; `computed`/`lookup` fields
  name a declared calculation whose **every** input appears as a
  `calculation_bindings` key (no drift, no orphan keys); `derived` and
  `evaluated` fields carry OCL reading sibling fields and bound paths
  only;
- every `conformance_test`, `requirements`, `header`, and
  `calculation_context.tables` reference resolves; test `result_forms`
  and form `identifier` agree in both directions;
- `pass_if` reads only the form's evaluated fields; no limit is
  introduced at form level (registry or requirement references only);
- every skeleton `applicability` value is a declared enum value of its
  dimension; every checklist element carries an obligation and a
  resolvable source or validation path;
- every TestAssignment's `form_id` resolves to a skeleton form; every
  FormOmission carries `reason` and `decided_by`.

## 5.11 Summary

- A form is an evidence view: bound fields prefill from the delegated
  chain and write through on submit; unbound fields are the run's
  evidence. The form is the schema; the FormInstance is the evidence.
- Bind vocabulary = the requirement bind vocabulary plus read-only
  identity paths; scope discipline is the same, enforced by the linker.
- Every field's value has a declared source: `declared | direct |
  computed | derived | lookup | evaluated`. `calculation_bindings` keys
  are the calc's declared inputs — author to the calc.
- Forms wire to tests, requirements, and a calculation context;
  `pass_fail` is the lab's determination, firewalled from the IA's
  re-executed verdicts.
- The test-report skeleton composes forms with `required: always |
  conditional` + applicability (form or subsection level); the PD-05
  18-element checklist is machine-checkable data.
- Work splits at form × sample × lab (TestAssignment); deliberate
  non-coverage is a justified FormOmission — applicability computes
  absence, assignment distributes it, decisions explain it.

*Next: [Chapter 6 — Evaluation](06-evaluation.md): determinations,
verdicts, model evaluation, the decision, and the certificate template.*
