# Chapter 10 — Modelling Your Lab

> *In this chapter:* the reference/implementation pattern of Volume I,
> chapter 15 brought down to the laboratory floor — a test laboratory
> authors its own **implementation package**: its test SOPs as executable
> processes, its equipment register with calibration evidence, its own
> record forms, and a `.prm` mapping every step and record to the
> Recommendation's required methods. The coverage calculus — not prose —
> then answers *"is this lab's procedure a fulfilment of the method?"*
> The worked example is the pilot: **MTL Rhein Ruhr**, a fictional but
> complete Scheme-A load-cell laboratory mapped to R 60-2.

---

## 10.1 Why a lab model

Chapters 1–9 produced the **reference** side: the Recommendation's
required methods (chapter 4) with their abstract procedure steps,
acceptance criteria, run-validity preconditions and required report
forms (chapter 5). That is what the standards body publishes. But no
laboratory *executes* an abstract method — every accredited laboratory
executes **its own SOPs**: more granular, quality-system-flavoured,
equipment-bound procedures that claim to fulfil the method.

Today that claim lives in accreditation assessments and prose
cross-reference tables. The implementation package makes it computable,
exactly as Volume I, chapter 5's mapping discipline does for models in
general and the platform's PD-05 coverage gate (TODO.roadmap/16 —
`browser/build/pd05-coverage.ts`, the platform's certification workflow
mapped to the OIML-CS abstract process model) does for the certification
workflow:

```
lab's implementation model ──maps──▶ Recommendation (required methods)
```

The lab is the third publisher of the supply chain (Volume I, §15.1):
the package speaks for *the lab's operations*, it is authored once, and
the calculus answers per required method: **full / minimal / partial /
no cover** — with every fulfilment pair carrying the description and
justification an assessor would otherwise have to interview the quality
manager for.

## 10.2 The implementation package

A lab package is a directory `data/lab-<name>/` discovered through its
`implementation.yaml` manifest. It is deliberately **neither a standard
nor a composition layer**:

- **No `standard.yaml`** — the app build never discovers it; nothing of
  the lab leaks into a Recommendation's rendered content.
- **No `layer.yaml`** — nothing `uses:` it; its content never merges
  into a rec's effective tree. Layers are content Recommendations share;
  a lab's SOPs are *its own*, a peer of the rec in the supply chain.

The manifest declares the identity, the organization, and — the
decisive act — `maps_to`: the reference standard and the **required
methods** this package's SOPs fulfil:

```yaml
# data/lab-mtl-rhein/implementation.yaml
id: lab-mtl-rhein
kind: implementation
organization:
  name: MTL Rhein Ruhr GmbH
  role: test-laboratory
  scheme: A
  accreditation: "DAkkS D-PL-19283-01-00 — ISO/IEC 17025, … (fictional pilot)"
maps_to:
  standard: r60
  methods:
    - /conf/metrological-tests/creep      # R 60-2, 2.10.2
    - /conf/electronic-tests/esd          # R 60-2, 2.10.7.8
structure:
  processes: evaluation/processes.yaml    # the SOPs
  equipment: evaluation/equipment.yaml    # the equipment register
  forms: execution/forms                  # the lab's record forms
  mapping: lab-to-r60-2.prm               # the fulfilment pairs
```

## 10.3 SOPs as executable processes

Each SOP is an executable process: ordered **steps**, each with an
**executor** (the lab's internal role) and the **equipment** it uses
(register ids). SOPs are *more granular than the reference method but
compatible*: the method's ten abstract procedure steps become thirteen
concrete lab steps — the extra ones being quality-system practice
(calibration verification, four-eyes review) that the method never
required and the mapping records honestly.

```yaml
sops:
  - id: sop_mtl_012_creep
    label: Creep test of load cells (R 60-2, 2.10.2)
    document: { number: MTL-SOP-012, revision: "3.2",
                approved_by: quality_manager, approved_on: "2026-03-14" }
    actor: test_laboratory
    obligation: shall
    implements: /conf/metrological-tests/creep   # documentary only
    produces: [mtl_f_042_creep_record]           # the evidence output
    steps:
      - id: apply_dmax_within_envelope
        order: 8
        action: >
          Select D_max within 92–98 % of E_max, record D_max and E_max
          on the test record, and apply D_max …
        executor: lab_technician
        equipment: [mtl_f_001, mtl_daq_101]
        exceeds: true
        exceeds_note: >
          The lab envelope 92–98 % of E_max is stricter than the
          required 90–100 % (R 60-2, 2.10.2) — A ⇒ B without B ⇒ A.
```

Two disciplines live here:

- **`implements` is documentary; the `.prm` is formal.** The single home
  of the fulfilment relation is the mapping file — never inline fields
  the calculus cannot check.
- **Stricter steps are declared, never silent.** A step tighter than the
  reference practice it fulfils carries `exceeds: true` +
  `exceeds_note`: the lab's practice *implies* the required practice
  (A ⇒ B) but not the converse — exactly the asymmetry the task
  demands be explicit. The gate cross-checks that the step's `.prm`
  pair says "stricter" in its description.

## 10.4 The equipment register

One register per lab; every instrument an SOP step uses, with its
ISO/IEC 17025 calibration evidence:

```yaml
equipment:
  - id: mtl_f_001
    label: Deadweight force standard machine, 600 kN
    inventory_number: MTL-F-001
    calibration:
      certificate: "PTB calibration certificate KA-2025-1187"
      calibrated_on: "2025-11-03"
      due_on: "2026-11-02"
      traceable_to: "PTB national force standard"
```

Step references must resolve (the gate), and the end-to-end flow check
requires calibration to be **in date at the moment a step executes** —
metrological traceability as a runtime assertion, not a binder tab.

## 10.5 The lab's record forms

The lab keeps its **own** forms — that is the point. Implementation
evidence can satisfy reference evidence requirements: each lab form
declares the required report form it fulfils (`fulfils_form` — an R 60-3
form id from the method's `result_forms`), and each field declares the
three links of the evidence chain:

```yaml
lab_form:
  id: mtl_f_042_creep_record
  fulfils_form: creep-dr                          # r60-3/table-6.8
  fulfils_conformance_test: /conf/metrological-tests/creep
  fields:
    - name: dmax_applied
      label: Maximum test load D_max applied (92–98 % of E_max)
      type: number
      unit: kg
      recorded_at: apply_dmax_within_envelope     # the producing step
      maps_to: dmax                               # the required-form field
      variable: d_max                             # the method's run input
      required: true
```

- `recorded_at` — **step ⇒ field**: which SOP step records it;
- `maps_to` — **field ⇒ required field**: the dot-path into the
  required form's field tree (repeatable-group entries as
  `direct_application.indication`);
- `variable` — **field ⇒ run input**: the method's variable (chapter 4)
  the field captures.

Fields without `maps_to` are lab-internal records *beyond* the required
form (calibration certificates, the four-eyes sign-off, finer-grained
readings) — the lab records more, and the model says so.

When a lab field's type differs from the required-form field it
satisfies, the reduction is **declared on the field, never silent** —
the gate checks scalar compatibility on every `maps_to` pair (identical
types, or `integer` ⇒ `number` widening, pass as-is):

- `coerce: int-bool` — the lab records a **count** (integer) where the
  required form asks **applied/not-applied** (boolean): a positive count
  coerces to true. The pilot's `contact_discharge_count` and
  `air_discharge_count` fulfil the esd form's
  `discharge_types.contact_discharges` / `.air_discharges` booleans this
  way.
- `mapping:` — a **multi-valued or free-text** recording reducing to a
  **single-valued** required field (an enum, or any scalar): the note
  states how. The pilot's `polarity_applied` records 'positive' /
  'negative' / 'both' (R 60-2 requires both polarities) where the
  required form models one enum value; the note fixes the transcription
  convention.

## 10.6 The `.prm` — the fulfilment made formal

The mapping file is the standalone `.prm` serialization of Volume I,
chapter 5 (the same format the platform-to-OIML-CS mapping uses). The
reference tree per mapped method spans the whole meaning of "the
method":

```
/conf/metrological-tests/creep                     ← the method (root)
  …/step/<abstract procedure step>                 ← the procedure
  …/criterion/<acceptance criterion>               ← the acceptance
  /req/<targeted requirement>                      ← the verdict points
  …/precondition/<run-validity precondition>       ← the run validity
  …/form/<result form>                             ← the evidence output
```

Every pair binds a lab element (SOP, step, record form) to a component
with **description + justification** — how the fulfilment works, and why
the claim holds:

```json
"sop_mtl_012_creep/apply_dmax_within_envelope": {
  "r60#/conf/metrological-tests/creep/precondition/creep-load-envelope": {
    "description": "STRICTER THAN REFERENCE: D_max within 92–98 % of
                    E_max — tighter than the required 90–100 % envelope
                    (A ⇒ B without B ⇒ A), and the envelope inputs are
                    always recorded …",
    "justification": "… the lab's tighter selection interval is a subset
                      of the required envelope and the inputs it resolves
                      are mandatory record fields."
  }
}
```

The `coverage` block at the end asserts the expected level of **every**
component — the regression tripwire: computed ≠ asserted fails the gate.

## 10.7 The coverage gate

`npm run validate` computes the report (`browser/build/lab-coverage.ts`)
with the real task-04 engine — `@primmel/primmel` `computeCoverage`,
the same calculus the PD-05 gate uses, not a re-implementation — and
enforces seven rules:

0. **no shared targets** — two mapped methods of one package may not
   declare the same `/req/*` target URN (§10.9 explains why);
1. every pair carries description **and** justification;
2. no dangling pairs — targets resolve against the method forest,
   sources are declared SOPs/steps/forms;
3. the coverage tripwire — the `.prm` asserts every component, computed
   equals asserted, no stale assertions;
4. **full cover by construction** — every component of every declared
   method is *directly* mapped. The pair *is* the fulfilment
   documentation: an inherited-only cover documents nothing, and
   inheritance masks dropped pairs (the PD-05 gate's design rule,
   tightened — a lab package asserts full cover, so there is no
   named-gaps escape hatch);
5. SOP integrity — unique ids/orders, equipment refs resolve, exactly
   one SOP per mapped method, `recorded_at` / `maps_to` / `variable` /
   `fulfils_form` resolve, every `maps_to` pair is **type-compatible**
   (scalar vs scalar: identical or `integer` ⇒ `number`; anything else
   only via a declared `coerce: int-bool` or `mapping:` note), and
   **every measured/declared run input of the method is captured by ≥1
   lab field across the UNION of the method's forms** (the SOP *can*
   produce the required evidence — a form insufficient on its own
   warns; read standalone it is a partial record of the run);
6. stricter steps are never silent (`exceeds` ⇔ a "stricter" pair
   description).

The pilot's report, computed by the calculus:

```
lab-mtl-rhein (data/lab-mtl-rhein/lab-to-r60-2.prm)
  ● full    /conf/metrological-tests/creep ⇐ sop_mtl_012_creep
  ● full    …/step/check_test_conditions ⇐ …/verify_environment, …/verify_equipment_calibration
  …         (35 components: 17 creep + root, 16 esd + root)
  ● full    /conf/electronic-tests/esd/form/esd ⇐ …/complete_and_review_record, mtl_f_017_esd_record

  Summary — full: 35, minimal: 0, partial: 0, none: 0 (35 components)
  Methods at full cover — 2/2 (/conf/metrological-tests/creep, /conf/electronic-tests/esd)
```

## 10.8 The end-to-end flow

Coverage answers *"is the procedure a fulfilment?"*; the flow test
(`browser/src/__tests__/lab-implementation.test.ts`) answers *"does the
SOP produce the required evidence?"* — by **executing** the SOP model:

1. walk the steps in order at the pilot run date (2026-06-08): every
   step has its executor; every equipment used is in calibration on that
   date;
2. each step produces the record fields whose `recorded_at` names it;
3. the produced record must satisfy **every required field** of the
   required R 60-3 form (through `maps_to`) and capture **every
   measured/declared variable** of the method (through `variable`);
4. every executed step must be a mapping source — the fulfilment chain
   is complete end to end.

## 10.9 Authoring your own lab — the moves

1. **Inventory the methods.** Pick the `/conf/*` methods your lab is
   accredited for; they are the `maps_to` list.
2. **Write the SOPs as they are performed** — your real steps,
   executors and instruments, not the method restated. Granularity
   mismatch is expected; the mapping absorbs it.
3. **Register the equipment** with its calibration evidence.
4. **Model your record forms** and link every field (`recorded_at`,
   `maps_to`, `variable`). Fields with no counterpart in the required
   form stay unmapped-by-`maps_to` — they are your extra evidence.
5. **Write the `.prm`** pair by pair — description *how*, justification
   *why*. Where your practice is tighter, declare `exceeds` on the step
   and say "stricter" in the pair. A method component you cannot map is
   the finding: either your SOP has a hole, or the pair you are missing
   is the accreditation discussion you needed to have anyway.
6. **Run the gate.** `npm run validate` computes the cover; the
   end-to-end test executes the SOPs. Full cover by calculus, evidence
   by execution — then invite the assessor to read the `.prm`.

**One target, one method.** Two methods in one package's `maps_to`
may not declare the same `/req/*` target URN — the gate errors and names
the shared target and both methods. The reason is not bureaucratic:
component ids in the coverage tree are global, so one pair to the shared
target would silently cover *both* methods' occurrences of it — and that
is precisely what must not happen. One SOP step may well *enforce* a
requirement (your ESD generator verifies the disturbances clause every
time it fires), but each **method's judgment** of that requirement is
distinct: R 60-2's esd, bursts, surge, emc-susceptibility and
short-time-power tests all target `/req/electronic/disturbances`, yet
each method reaches its own verdict on it from its own severity, its own
evidence, its own acceptance criterion. A single pair claiming all five
judgments documents none of them. The pilot therefore maps each method
as its own coverage; if your lab genuinely covers two such methods,
model them as **separate coverages** (two packages, one per method
family) or **split the SOP** so each method's disturbance verdict has
its own documented pair. (Scoping shared targets per method root inside
one package is the calculus's planned generalization — until then the
gate keeps the sharing impossible.)

## 10.10 Validation rules (summary)

- an implementation package declares `kind: implementation` and a
  `maps_to` method list; unmapped declared methods fail the gate;
- two mapped methods may not share a `/req/*` target URN — one pair
  cannot fulfil two methods' distinct judgments of the same requirement;
- every reference component is *directly* mapped at full cover — the
  calculus, never prose;
- `exceeds: true` ⇔ a "stricter" pair description (A ⇒ B without
  B ⇒ A is never silent);
- lab evidence fields resolve (`recorded_at` → step, `maps_to` →
  required-form field, `variable` → method variable);
- a `maps_to` pair whose field types differ is legal only with the
  reduction declared — `coerce: int-bool` (count ⇒ applied/not-applied)
  or a `mapping:` note (multi-value/free-text ⇒ single value);
- every measured/declared run input of a mapped method is captured by a
  lab field — across the UNION of the method's forms (a form
  insufficient alone warns);
- equipment calibration is in date when a step executes.

*Next: the [Annexes](../README.md#annexes) — the OIML-CS
certification-scheme reference package and the platform runtime the
packages run on.*
