# Chapter 1 — The Authoring Method

> *In this chapter:* the end-to-end method — seven moves, the validation
> gates, and the pitfalls the R 60 build paid for so you do not have to.

---

## 1.1 What authoring is

Authoring a Recommendation means transcribing a published text — prose, tables,
formulas, forms — into a package the platform can validate, query, execute, and
reason about (Volume I, chapter 1). Three commitments frame everything:

- **YAML is the single source of truth.** All content lives in `data/<rec>/`;
  the app's TypeScript is generated from it; services contain no domain content
  — adding a requirement, an attribute, or a form is a YAML edit.
- **A new Recommendation is data, not schema.** The metamodel (Volume II) is
  schema only; the R 60 profile states the rule: "a new profile file; zero
  schema changes."
- **OCL is the only rule language** (INV-9). Constraints are OCL `inv`,
  derivations OCL `derive`; the same statement executes identically in testing
  and in evaluation (`ocl{...}`).

The method below is the R 60 build's authoring checklist reorganized into seven
moves; each move names the chapter that develops it. Two disciplines apply at
every move: vocabulary is *anchored* (`vocab_ref` into the VIML/VIM registers),
and every element carries `source: { doc, clause }` provenance.

## 1.2 Move 1 — Model the subject *(chapter 2)*

All of it lives in `data/<rec>/model/`, in order:

1. **Subject type and variants.** Declare the subject as a subclass of
   `MeasuringInstrumentModel` with definition + clause ref (R 60: `LoadCell`, R
   60-1 §3.1.3); each variant gets id, name, definition, source clause (R 60
   has four, §3.1.3.1–4).
2. **Classification dimensions.** The axes that drive applicability; enum
   values + scope — `accuracy_class` (group), `humidity_class` (family),
   `load_type` (group) — per-value payload on entries (`n_lc_limits`, R 60-1
   Table 1). Mirror each as an attribute (`is_dimension: true` + `enum:`).
3. **Family criteria.** What stays constant across the family, transcribed
   verbatim (R 60-1 §3.4.2 (a)–(f)); a candidate violating any criterion is a
   *different family*, not another group.
4. **Model groups.** If the Recommendation defines an "inner family", declare
   the matrix (`identical_characteristics` / `identical_attributes`) with a
   compact `group_label` (`C6`) doubling as the certificate dimension label.
   Family criteria hold ⇒ groups; any differs ⇒ separate family — never paper
   over a criterion change.
5. **Attributes.** Define each once (INV-2): snake_case id from the symbol
   (`E_max → e_max`; print symbol in `symbol`), definition, source clause,
   `quantity_kind` + `unit`, `value_type`, **origin**
   (`design-fixed`/`test-dependent`/`declared`), **scope**
   (`family`/`group`/`model`/`sample`), **category** (metrological | electrical
   | dimensional | material | administrative), `irdi`. Add one when a
   requirement binds it, a form captures it, a calculation consumes it, or the
   certificate prints it — not for narrative. Derived: `v_min: "(self.e_max -
   self.e_min) / self.y"`.
6. **Capabilities (the mixin model).** `has_parameters`,
   `satisfies_requirements`, `verified_by_tests`; composition via `extends` /
   `requires` / `abstract`. New variant = new capability = zero schema change.
7. **Behaviors.** Response characteristics with `kind: static | dynamic |
   temporal | influence-response` and `verified_by` test links. Declare one
   even with no test yet — R 60's `durability` deliberately has none.
8. **Operating conditions.** The three VIM tiers — `reference`, `rated`,
   `limiting` — plus `common_test_conditions`, each a named set of
   influence-quantity values.
9. **Twin readiness (○).** Declare the subject so it can later be
   *served*: the endpoint declaration (operations, access scopes,
   connector profile) as one more IS-level fact, promises stated so an
   engine can check them, and characteristics whose derivations a monitor
   can re-run — the same OCL the lab will use (Volume I, chapter 14).

Item 9 is additive and entirely ○ — nothing executes it today. But the
endpoint is part of the type definition, like a software identification:
retrofitting one means re-opening the subject model, declaring one at
authoring time is a stanza. Chapter 2, §2.11 shows the declaration;
Volume I, chapter 14 shows what it wakes up.

## 1.3 Move 2 — Situate the taxonomy

- **Family** (VIML 4.02) — one manufactured type sharing design features and
  metrological principles; its values are inherited defaults.
- **Group** — not VIML: the Recommendation's own level (R 60's "load cell
  group") — identical metrological characteristics; the unit of sample
  selection.
- **Model** (VIML 4.06, "type") — the centre of conformity: Recommendations
  target it, samples instantiate it, type approval certifies it — never a unit.
- **Sample** (VIML 4.09) — one physical unit; carries test-dependent values in
  `test_context`; delegates everything else upward (INV-10).

Decide `scope` and `origin` independently — `dr`: origin test-dependent, scope
group; origin = where the value comes from, scope = where it is stated:

| scope | rule | R 60 examples |
|---|---|---|
| family | constant for every model (family criteria, shared specs) | e_min, p_lc, t_min/t_max, rated_output, impedances; dims technology, humidity_class |
| group | identical across one matrix sub-family | accuracy_class, n_lc, v_min, y, z, dr, mpe; dim load_type |
| model | distinguishes one catalog model | e_max, mr_max, warm_up_time, software_identification |
| sample | chosen under test — never inherited | d_min, d_max, v, n, mr, conversion_factor_f |

The payoff: sample selection becomes data, not code — R 60 encodes R 60-2 §2.4
+ Annex D as selection rules (smallest `e_max` per group, the merit walk, 5–10×
steps, de-duplication, partial-evaluation flags).

## 1.4 Move 3 — Model the requirements *(chapter 3)*

Requirements live in `specification/requirements/`, scoped `/req/<area>`; the
full id is scope + `identifier_fragment`. The anatomy (INV-3):

- `statement` + `reference` — the normative "shall" sentence + clause URN;
- `binds_to` — canonical paths: `model|family|group.parameters.<attr>`,
  `*.classification.<dim>`, `sample.test_context.<attr>`,
  `model.identity.<slot>` / `model.aspects.<aspect>` (§2.12),
  `model.capabilities|characteristics|behaviors.<id>`;
  `observable:<symbol>` belongs to `limit.uses`;
- `limit.expression` — machine-checkable OCL; `uses` lists every input
  (attribute paths, observables, `formula:` / `table:` references);
  `applicability` filters by classification (`humidity_class: [CH]`);
- `verification.method` — `definitional | computational | testing | inspection
  | deferred` (durability is `deferred`);
- `acceptance_criteria` — legacy human-readable form, provenance only; never
  author it without the machine-checkable pair;
- **register the shared vocabulary** — symbols (`kind: attribute | formula |
  observable`) and calculation primitives go in `symbols.yaml` /
  `calculations.yaml` with clause refs, so the `observable:` / `formula:` ids
  every limit cites have one home (checklist item 21).

**Constraint vs requirement.** A Constraint is an intrinsic *validity* rule
(OCL `inv`) — test-setup geometry like `constr:r60:fig3-2b` (`0.9 * E_max <=
D_max <= E_max`), whose violation invalidates the run *as a test*. A
Requirement is a regulatory *limit*, judged at evaluation. "The test was set up
wrong" → constraint; "the instrument must be this good" → requirement.

**Tables are data.** Tiered limits go in `tables.yaml` (the `mpe_tiers`
profile: class × load range → limit factor), served by `lookupMPE` /
`lookupProfile`. When the Recommendation hands you a table, model the table —
never bake its numbers into OCL.

## 1.5 Move 4 — Model the conformance tests *(chapter 4)*

Tests live in `specification/conformance/`, scoped `/conf/<area>`:

- **targets** — the requirements verified (the requirement ↔ test link is
  declared both ways);
- **variables** — derived parameters + observables, each with `source: declared
  | measured | derived | computed` — computed from requirement limits and
  subject parameters, never restated (e.g. `e_r` = `(max(indications) -
  min(indications)) / conversion_factor_f`);
- **method/steps** — ordered actions with input/output variables; repetitions
  explicit, parameterized per class via `instances:` (R 60: `n_runs` 5 for A/B,
  3 for C/D, resolved from `accuracy_class` at runtime);
- **conditions + equipment** — tiers from `model/conditions.yaml` plus
  `common_test_conditions`; per-run equipment with calibration references;
- **acceptance_criteria** — composite OCL over observables, each `item`
  targeted at a requirement;
- **result_forms** — the report forms this test's evidence lands in.

Generic procedures are defined once; per-class aggregations `inherits_from` and
restate only deltas (run counts, MDLO increment, span-stability exclusion). Tag
each test's `kind` from the metamodel taxonomy (`performance | influence |
disturbance | durability | span-stability`) — the R 60 data still tags `type:
Testing | Inspection` (◐); fill `kind` from the start.

## 1.6 Move 5 — Define the test lab report *(chapter 5)*

Forms are fill-in templates that **fill the models** — views onto the entity
graph, not data-duplicating documents:

- **Bind paths.** Bound fields prefill from the resolved subject chain and
  write through on submit: `model.parameters.e_max`,
  `sample.test_context.d_max`, plus read-only identity paths
  (`model.model_designation`, `sample.serial_number`,
  `application.application_number`). Unbound fields are the raw evidence.
- **Wiring.** Each form names its `conformance_test:`, its `requirements:`, and
  its `calculation_context` (dimensions, tables). Fields declare
  `measurement_method`: `declared | direct | computed / derived | lookup |
  evaluated`.
- **pass_fail.** The form-level result is the lab's recorded *determination*;
  the IA's per-requirement verdict is computed independently at evaluation
  (INV-4).
- **The skeleton.** `execution/test-report.yaml` structures the sections with
  `required: always | conditional` + `applicability`. No third "optional" tier:
  a form that never applies is not required; a skipped in-scope form is an
  omission. The 18 report elements (PD-05 §4.4.3) are machine-checkable.
- **Partial coverage and omissions.** Work splits at (form × sample × lab) via
  TestAssignment; each lab's report carries exactly the forms its
  specialization covers (`CH` → humidity testing). Omissions are declared with
  `reason` + `decided_by` (FormOmission).

## 1.7 Move 6 — Define the evaluation *(chapter 6)*

Evaluation is a three-level synthesis, not checkbox aggregation:

- **Level 1 — admissibility (per report).** Each test report gets a
  determination: ACCEPTED / REJECTED / CONDITIONALLY_ACCEPTED — all required
  before finalization.
- **Level 2 — verdict re-execution (per requirement × sample).** Each
  applicable requirement's OCL limit is re-evaluated against the bound
  evidence: `pass | fail | indeterminate` (indeterminate = real outcome, reason
  recorded); overrides are recorded, never silent (INV-5).
- **Level 2b — cross-sample synthesis (per model).** Evidence gathers across
  the accepted reports of all contributing labs; completeness plus failures
  derive the decision: PASS / FAIL / CONDITIONAL / INCOMPLETE (INV-6 — type
  conformity exists only here).
- **Level 3 — overall decision.** All PASS → APPROVED; any FAIL → REJECTED;
  mixed or indeterminate → CONDITIONALLY_APPROVED; any INCOMPLETE → PENDING.

On APPROVED the IA issues the certificate, scoped to the application's matrix
as amended; number and labels come from the certificate template
(`number_format`, `dimension_labels`); the approval chain (IA sign, BIML
register) is data. The workflow entities it runs on (Application → TestRequest
→ TestAssignment → TestReport → EvaluationReport → Certificate) are Volume II,
chapter 8, and Volume IV.

## 1.8 Move 7 — Package and validate *(chapter 7)*

1. Mirror the directory contract (the volume README); register every file in
   `standard.yaml` — identity block, `structure:` registry, Metanorma
   `source:`. A file not registered does not exist as far as the build is
   concerned.
2. Author the layer-1 domain profile (subject taxonomy, attribute definitions,
   formulas, constraints, error model) and JSON Schemas for any new file kinds.
3. Seed one full flow in `sample-data.yaml`: family → group → model → sample →
   application → request → report → evaluation → certificate.
4. Run the gates; fix at the YAML layer, never in generated code.

## 1.9 Validation gates

```
cd browser && npm run validate   # JSON-Schema + semantic (x-refs, anchors) + sample-data
cd browser && npm run build      # full codegen; YAML errors fail here
cd browser && npx vitest run     # unit tests over the generated data
```

- every `binds_to` / form `bind:` path resolves to a declared attribute id at a
  scope-appropriate level (no `sample.test_context.e_max`); every `/req/...`
  referenced by a capability or test exists; every test `targets` resolves;
- every OCL `uses` entry is bound somewhere; every `lookupMPE`/`lookupProfile`
  table exists in `tables.yaml`; every form `calculation_bindings` key matches
  a declared calculation input name;
- every enum value used in `applicability` exists on its dimension; every unit
  is a `value-types.yaml` unit id.

## 1.10 The pitfalls catalog

Nine ways the R 60 build went wrong — what it is, the gate, the fix.

1. **Clause-number drift between editions.** *What:* legacy data carried R
   60-1:2017 numbering; the 2021 edition renumbered (barometric-pressure 2.10.3
   → 2.10.4; vMin 3.7.5 → 3.5.11). *Gate:* none mechanical — provenance review
   against the edition in `standard.yaml` (text-coverage audit ○ closes this).
   *Fix:* verify every clause ref; record fixes in the header.
2. **Scope/origin confusion.** *What:* `dr` — origin test-dependent, scope
   group. *Gate:* semantic validation of bind paths and the sample-scope
   inheritance rule. *Fix:* decide the two independently (Move 2's table).
3. **Naming.** *What:* legacy camelCase (`emax`, `n_LC`); a `construction`
   attribute colliding with the `construction` dimension. *Gate:* the linker —
   unresolved ids after re-keying fail. *Fix:* snake_case of the symbol; print
   symbol in `symbol`; rename (`construction_type`).
4. **Value vs unit.** *What:* the attribute `v_min` used as a *unit* on eight
   form fields (INV-1). *Gate:* schema — unit slots validate against the unit
   register. *Fix:* unit ids only (`v`, `counts/v`, `degC`).
5. **Unbound requirements.** *What:* a requirement with only human-readable
   `acceptance_criteria` judges nothing and cannot be re-executed. *Gate:* the
   coverage audit — no `binds_to` + `limit` = unverifiable. *Fix:* bind paths +
   OCL limit + `uses`; prose stays as provenance.
6. **Legacy contradictions.** *What:* legacy p_LC range 0.3–1.0 vs R 60-1:2021
   §5.3.2's 0.3–0.8. *Gate:* none — audit. *Fix:* preserve and annotate; fix at
   the canonical layer (0.3–0.8 canonical, legacy kept with a note).
7. **Formula drift.** *What:* conversion-factor divisor corrected `0.75 * n_LC
   → 0.75 * n` (R 60-3 §2.1.2.4); repeatability re-parenthesized `(max − min) /
   f`. *Gate:* unit tests; re-derivation against the source's formula. *Fix:*
   check derivations against the source.
8. **Binding-key drift.** *What:* form `calculation_bindings` keys must equal
   the calculation's declared inputs — `creep-dr.yaml` bound `n_lc` vs declared
   `n`. *Gate:* the linker. *Fix:* align keys with declared input names.
9. **Table shape traps.** *What:* `mpe_tiers` tier-3 rows unbounded above
   (`null`) — equivalent to R 60-1 Table 4 only within the n_LC class limits.
   *Gate:* none mechanical; table review. *Fix:* annotate equivalences; never
   "fix" legacy shapes silently.

## 1.11 Grammar sketch *(illustrative v3 syntax)*

```prl
# a Recommendation package, sketched in authoring order
package oiml-r60 {
  uses: [oiml-core]      # + shared modules where they apply
  subject LoadCell extends MeasuringInstrumentModel {        # move 1–2
    source: "urn:oiml:pub:r:60-1:2021#clause-3.1.3"
    attributes { e_max : mass origin design-fixed  scope model
                 d_max : mass origin test-dependent scope sample }
  }
  requirement /req/metrological/measuring-range-max {        # move 3
    binds_to: [sample.test_context.d_max, model.parameters.e_max]
    limit: ocl{ sample.test_context.d_max <= model.parameters.e_max }
  }
  conformance_test /conf/metrological-tests/creep {          # move 4
    targets: [/req/metrological/creep]
    instances: { by: accuracy_class, values: { A: {n_runs: 5}, C: {n_runs: 3} } }
  }
  # move 5 — forms  ·  move 6 — evaluation  ·  move 7 — package
}
```

## 1.12 Summary

- Authoring is transcription into an executable package: YAML is the truth, a
  new Recommendation is data not schema, OCL is the only rule language.
- Seven moves: subject → taxonomy → requirements → tests → report → evaluation
  → package + validate; the authoring checklist lives inside them.
- The gates are three commands; the self-check list is six properties of the
  cross-layer graph. Both run before "done" is sayable.
- The nine pitfalls are paid-for knowledge — the catalog above is the
  pre-flight briefing.

*Next: [Chapter 2 — Modelling the subject](02-modelling-the-subject.md):
variants, dimensions, attributes, capabilities, behaviors, conditions.*