# Chapter 11, Validation

> *In this chapter:* the validation stack, JSON Schema per file kind,
> the model linker with its allowlist discipline, `primmel check` and
> its cross-layer invariants, the coverage audits, the normative-text
> coverage metric, and the pitfalls catalog the R 60 build paid for.

---

## 11.1 The validation stack

Chapter 1 claimed a Primmel model can be *validated* as its first
machine operation. Validation is not one check but a stack, each layer
assuming the one below:

| Layer | What it proves | Status |
|---|---|---|
| 1. JSON Schema | each file is well-formed for its kind | ● `data/schemas/` |
| 2. Model linker | every cross-reference resolves | ● `browser/build/model-linker.ts` (R1–R43) |
| 3. `primmel check` | cross-layer invariants hold | ● C1–C96 (`@primmel/primmel` `src/check-rules.ts`, 0 errors on the shipped packages) |
| 4. Coverage audits | the aspect↔requirement↔test↔form closure is complete | ◐ structural today, explicit in v3 |
| 5. Text-coverage metric | every normative sentence is modelled, none duplicated | ● `src/text-coverage.ts` (C71–C73 + `--coverage`), R 60 at 100 % / 0 unresolved |

In the running system, layers 1–2 are wired into `npm run validate`
(`browser/scripts/validate.ts`, schema + semantic validation) and run
on every build of the R 60 package. Layer 3 runs as `primmel check`
over the `.prl` package (v2 plan W8, COMPLETE 2026-07-18); layers 3–5
consolidate in v3: same findings, one command, one report.

## 11.2 Layer 1, JSON Schema per file kind (●)

Every YAML file kind has a schema under `data/schemas/`, `rc.yaml` for
requirements, `cc.yaml` for conformance tests, `form.yaml` for forms,
`entities.yaml` for the entity classes, and so on, one schema per
bounded context (MECE at the file level). The schema proves *shape*:
required fields present, enums from declared value sets, `QuantityValue`
structured as value + unit (never a bare number, INV-1 at the syntactic
level). A schema failure means the file cannot even be read as its kind;
nothing downstream runs.

## 11.3 Layer 2, the model linker (●)

The linker statically resolves **every reference between a standard's
files**, OCL identifiers in limits and derivations, requirement
targeting, certificate/notes/gateway/checklist references,
applicability keys, symbol→calculation/formula→profile links, and form
`bind:` roots. Its rule catalog, each rule one concern:

| Rule | Catches |
|---|---|
| `ocl-identifiers` | an identifier in an `ocl{…}` expression that resolves to nothing (e.g. the C-style ternary `'yes' : 'no'` that is not OCL at all) |
| `requirement-targeting` | a requirement whose `binds_to` path does not exist in the subject model |
| `cross-standard-leakage` | a reference to an element no package of this standard declares (a form name left over from another rec's build) |
| `applicability-keys` / `applicability-instances` | a dimension value or `instances:` key absent from the dimension registry |
| `calculation-links` | a symbol→calculation or formula→profile link that dangles |
| `bind-paths` | a form field `bind:` root that is not a declared aspect path |
| `quantity-coherence` | unit/quantity-kind mismatch across a link |
| `verdict-inputs-resolve`, `verdict-no-shadow`, `verdict-restatement` | the VerdictQuantity discipline, derivations defined once, referenced, never restated inline |
| `source-discrepancy` | a discrepancy record whose citations do not resolve (chapter 9) |
| `test-design` | test-design metadata referencing undeclared rules |
| `irdi-resolve` (R36) | an attribute `irdi` annotation that fails the pinned OpenCDD snapshot, ISO/IEC 11179-6 full-IRDI syntax, entry existence, status level, unit symbol (Unicode-exact), quantity-kind↔dimension coherence; snapshot absent ⇒ one stub note, never a failure (§12.4) |
| `behavior-coverage` (R37) | a stimulus-response conformance test (the five metamodel kinds, `type: Testing`) that is no behavior's `verified_by` target, a warning; a designed delta is allowlist-documented (Volume III, §4.9) |
| `invariant-crosswalk` (R38) | an INV-registry entry lacking name/statement/severity, silently unenforced (no claim, no `aspirational` marker), or claiming enforcement machinery that does not exist, kernel C-checks, linker rules, or platform gates with evidence paths (Volume II, §9.12) |
| `test-sequence-integrity` (R39) | a sequence step without `test` XOR `phase`, a dangling test ref, a `depends_on` that is not earlier and acyclic, an out-of-vocabulary `role` (Volume III, §4.10) |
| `instance-coverage` (R40) | a test's `instances:` map that leaves an applicable dimension value unkeyed, an undispatchable sample for the scheduler (Volume III, §4.11) |
| `formulas-used-resolve` (R41) | a `formulas_used` entry binding an undeclared test, duplicated per test, or naming a formula outside the calculations ∪ formulas registries (Volume III, §4.12) |
| `state-machine-integrity` (R42) | a lifecycle machine resolving to no entity class, states outside the entity's `status` enum, `initial` or endpoints outside the state set, a guard outside the closed vocabulary (Volume II, §8.5.2) |
| `spelling-code-resolve` (R43) | a `spelling:` code that fails compositional resolution against the vendored ISO 24229 snapshot (language / script / country segment not in the pinned lists), a duplicate code within one content set (keyed `setPath + code`), or a `via` conversion code that misses the register (case-insensitive, punctuation-exact; `zz-` user-assigned warns), snapshot absent ⇒ one stub warning, never a failure (chapter 10) |
| `serve-targets-resolve` (● C60) | a `serve` binding naming an undeclared aspect or endpoint operation (chapter 14) |
| `payload-schema-quantity` (● C61) | an endpoint operation whose payload is not a QuantityValue with unit and timestamp (chapter 14) |
| `freshness-required` (● C63) | a live binding without `fresh_within`, no stale semantics, no live binding (chapter 14) |
| `access-scope-covers-serves` (● C62) | an endpoint operation with no access scope, or a scope that does not cover the consumers of its `serve` bindings (chapter 14) |
| `monitor-refs-resolve` (● C65–C70) | a monitor's `evaluate` referencing requirements or promises not applicable to the monitored subjects, with the trigger, escalation and emit-sink legs (chapter 14) |
| `product-maps-resolves`, `unmapped-promises` (● C81/C82) | a `product_reference` mapping target dangling into the Recommendation; an unmapped IS promise flagged at authoring (chapter 15) |
| `abstract-import-pinned` (● C83) | an abstract import of a product model without a version pin (chapter 15) |

The twin-era rules shipped with their owning features, C60–C64 with
the twin interface primitives (task 32), C65–C70 with the monitor
runtime (task 34), C81–C83 with the product reference packages
(task 36); chapters 14 (§14.12) and 15 (§15.9) are their doctrine. The
smart-side halves ride `npm run validate`: the gateway and monitor
binding validators (`src/gateway/binding.ts`, `src/monitor/binding.ts`)
enforce the same laws on the YAML faces. The R36–R43 rows are the
phase-9, interop and multilingual increments, each
shipped with its owning feature (R36 with OpenCDD resolution, R37–R42
with the R 60 SSOT review's phase-9/9.5 tasks, R43 with ISO 24229
multilinguality, task 25, the R42/R43 numbering is the merge-collision
record of chapter 10, §10.5).

### The allowlist discipline

A real standard inherits real debt. Known-bad sites are recorded in
`data/r60/linker-allowlist.yaml` as `{rule, path_pattern, reason,
audit_ref}` entries, each citing the audit finding that justifies it
(for instance, the unresolved per-load-point identifier `load`, traced
to `analysis/deep-audit-r60.md` finding F6). The discipline has exactly
two states:

- **KNOWN**, the issue matches an allowlist entry: it prints, it does
  not fail the gate, and its `reason` says when it dies;
- **STALE**, an allowlist entry that matches no issue: the underlying
  data was fixed, so the entry must be removed *immediately*. A stale
  allowlist entry is debt masquerading as process.

The standing burn-down plan (the repo's tasks 12–14) takes every list to
empty; an allowlist that only grows is a failed validation strategy, not
a safety valve.

## 11.4 Layer 3, `primmel check`: cross-layer invariants (●)

Above reference resolution sits the tier law itself. `primmel check`
evaluates the invariants that span layers, the checks that made chapter
1's dependency law and chapter 2's anatomy enforceable. The catalog is
**89 rules** (`@primmel/primmel` `src/check-rules.ts`, test-pinned; 0
errors on the shipped packages), organized by family, the five original
base checks below are its root, not its extent:

| Family | Rules | Provenance |
|---|---|---|
| base | C1–C5 (+ C56/C57 allowlist self-checks), C89 spelling-code-wellformed, C90–C91 invariant, C92–C93 test-sequence, C94 formulas-used, C96 duplicate-id | the v2 linter (W8), roadmap/25, gap-close E9–E11, kernel hygiene |
| anatomy (subject is/has/does) | C6–C9, C84 constraint-shape | roadmap/01, /51 |
| process | C10–C16, C58/C59 (activity-kind, segregation), C74–C76 signature boundaries | roadmap/02, /08, /38 |
| instantiation | C17–C20 | roadmap/03 |
| mapping | C21–C26 | roadmap/04 |
| composition (`uses`) | C27–C31 | roadmap/05 |
| quantities + duality | C32–C36 | roadmap/06 |
| state machines | C37–C41 (incl. C38 state-family-separation), C95 cascade-transition-resolve | roadmap/07, gap-close E12 |
| promises | C42–C44 | roadmap/08 |
| artifacts | C45–C47 | roadmap/09 |
| characteristics | C48–C50 | roadmap/10 |
| coverage | C51–C55, C71–C73 (text coverage, §11.6) | roadmap/17, /26 |
| twins | C60–C70 (endpoint/serve/freshness/monitors) | roadmap/32–34 |
| edition lifecycle | C77–C80, C85 baseurn-wellformed | roadmap/28, /27c |
| supply chain | C81–C83, C86–C88 passport | roadmap/36, /35 |

A violation here is not a style complaint: it means the model would
mis-execute, a verdict computed against the wrong scope, a form
prefilling from a path that does not exist.

The base set, for the record: **anchor paths vs attribute scopes**, a
`binds_to` or `bind:` path must exist *and* be read at a legal scope:
no sample-scope attribute resolved by inheritance, no model-scope value
stated per sample (C1, the scope discipline of chapter 3); **reference
targets**, every `reference(Class)` field points at an existing record,
`on_delete` semantics declared (C2); **dimension enums**, every
classification value comes from the dimension registry (C3); **store
uniqueness**, each registry compiles to exactly one store (C4);
**req↔test coverage**, a conformance test's acceptance targets its
requirement, a form's program binds the tests it evidences (C5).

Two recent members deserve note. **C84 constraint-shape** (● primmel-ts
490bacc, roadmap/51), the declaration shape of the subject-intrinsic
constraint (the «inv» entity of chapter 2, smart-repo task 51), five
error legs mirroring the smart-side schema: the stereotype is always
`inv` (requirements are the «req» counterpart); the check is a *single*
`ocl{…}` boolean over the subject's declared anatomy;
`violation_meaning` is non-empty, the invalidated judgment records what
a violation means, never a bare id; `on_violation` ∈ {`invalid`,
`indeterminate`}, a constraint voids the measurement or withholds
judgment, it never *fails* the instrument; and a declared `source`
names both doc and clause (clause-URN provenance, chapter 9). Duplicate
constraint ids are surfaced by C96 duplicate-id (the parse-time rule,
now visible through `checkPackage`), and the resolution
legs stay smart-side (linker rule R32), C84 polices shape only, which
is why all shipped packages pass with zero hits. And the **passport
trio C86–C88** (● primmel-ts da30b21, roadmap/35): C86
passport-content-resolves (every content entry of a `passport`
declaration resolves against the product model), C87 passport-access-leak
(nothing marked `restricted`/`authority` appears in a less-privileged
class, fail-closed), C88 passport-upi-scheme (the UPI pattern and level
,  ESPR model/batch/item, are well-formed). §12.5 and §14.6 are their
doctrine.

## 11.5 Layer 4, coverage audits (◐)

Coverage is the graph property chapter 1 stated as a theorem; the audit
is its computation. Four closure questions, each mechanically answered
from typed anchor sets:

```text
aspect ──▶ requirement ──▶ conformance test ──▶ form ──▶ verdict
```

- an **aspect with no requirement** is *unconstrained*, did the
  Recommendation really mean to leave `n_lc` unregulated, or was a clause
  missed?
- a **requirement with no test** is *unverifiable*, it will produce
  verdicts no evidence can support;
- a **test with no form** *leaves no evidence*, the run happened and
  nothing permanent records it;
- a **form with no evaluation** *leaves no judgment*, evidence gathered
  and never weighed.

Coverage findings are warnings by design: a deliberate exclusion (an
informative annex, a definitional requirement verified by review ,
R 60's `verification: { method: definitional }`) is a legitimate answer,
recorded, not a gap. The same calculus covers **mappings** (chapter 5):
mapping coverage per reference component, full / minimal / partial /
none, is part of the same audit run.

## 11.6 Layer 5, the normative-text coverage metric (●)

The top of the stack closes the loop with chapter 9. Given `.prd`
fragments and provenance maps:

> **every normative sentence of the source maps to at least one model
> element (target 100 %), and no two elements are semantic duplicates
> (target 0).**

Reported per package, with declared allowances for deliberate exclusions
(front matter, informative annexes). This is the authoring-quality dual
of reconstruction congruence: reconstruction asks "can the model re-emit
the document?"; text coverage asks "did anything in the document escape
the model, or enter it twice?" Semantic duplication is the quiet killer
here: two requirements interpreting the same sentence differently is
worse than a gap, because both will compute verdicts.

**Implemented (TODO.roadmap/26).** The `.prd` fragments decompose into
addressed *sentences* (`<fragment>/s<N>`, the reserved finer address
space of the fragment grammar, computed at package build, never stored
in the extract); a documented modality classifier (shall/should/may/must + negatives;
definitions normative, informative fragments demoted ,
pinned precision ≈ 0.91 / recall ≈ 0.79 on a 70-sentence labelled sample
of R 60, with every false negative proven to sit in a bound fragment)
decides which sentences gate. The sentence manifests + the package's
declarations (sentence-pinned allowances, duplicate adjudications) ship
inside the PRL package as `sources-prd/*.sentences.json` +
`coverage.json`, and `primmel check` computes the metric: **C71** warns
per uncovered normative sentence (audit level, budgeted by the package's
`text_coverage_budget`, **C72**, the C51/C52 budget pattern; a package
at 100 % declares 0, so any regression fails), **C73** fails stale or
malformed declarations (an allowance matching no normative sentence, an
adjudication whose pair is no longer flagged). `--coverage` prints the
full report: per-document ratios with and without allowances, the
allowed exclusions, and the duplicate pairs with their adjudication
status, pairs are *reported*, never auto-failed; acceptance is 0
*unresolved*. The R 60 baseline: 100 % gated normative-sentence coverage
on all three parts (273 bound, 20 sentence-pinned allowances, 0
uncovered) and 59/59 duplicate pairs adjudicated distinct (0 unresolved).

## 11.7 The pitfalls catalog (from the R 60 build)

These are the failure modes the R 60 package actually produced. Each is
now a check; each check exists because the failure was found the hard
way.

1. **Clause-number drift between editions.** A form reference
   (`form_contains('sample-selection')`) predated the R 60-3 form
   renumbering; the file had become `04-07-sample-selection.yaml`.
   *Guard:* the references registry + linker resolution (chapter 9);
   *lifecycle treatment:* chapter 13's clause-drift detection.
2. **Scope/origin confusion.** A test-dependent attribute
   (`sample.test_context.d_max`) inherited from the model level, or a
   design-fixed parameter restated per sample. *Guard:* anchor-path/scope
   invariants (§11.4) + the delegation law (INV-10).
3. **Naming discipline.** Data keys are `snake_case` (`accuracy_class`,
   `e_max`, `n_lc`) everywhere, YAML fields, entity fields, attribute
   ids. A camelCase key is not a style deviation; it is an unresolvable
   reference waiting for a consumer.
4. **Value-vs-unit mistakes.** A bare number where a `QuantityValue`
   (value + unit) belongs (INV-1). *Guard:* schema layer; the failure
   mode is silent unit ambiguity, `40` degrees of what?
5. **Unbound requirements.** A requirement with no `binds_to` constrains
   nothing and verifies nothing. *Guard:* coverage audit (a requirement
   without anchors is a finding on sight).
6. **Binding-key drift.** The model renames an attribute; a form still
   binds the old path. *Guard:* the `bind-paths` linker rule, this is
   precisely the check that makes refactoring the primary tier safe.
7. **Table shape traps.** A lookup table keyed by the wrong dimension,
   or a profile lookup (`lookupMPE(test_load, accuracy_class, p_lc)`)
   whose argument order drifted from the table's key order. *Guard:*
   `calculation-links` + the rule that tables are data, never baked
   into OCL, so the shape is declared once and checkable.

And the meta-pitfall the catalog itself guards: **two clauses of the
source that disagree** (R 60-1 5.6.3.1 vs R 60-3 2.1.7 on the humidity
criterion). Do not pick a side silently, record a `source_discrepancy`
(chapter 9) and let the linker keep both citations live.

## 11.8 Grammar sketch *(illustrative v3 syntax)*

```prl
check oiml-r60 {
  schema   per_file_kind                 # layer 1
  link     rules all                     # layer 2, allowlist from linker-allowlist.yaml
  invariants {
    anchor_scopes                        # paths exist + scope discipline
    reference_targets                    # closed under reference
    dimension_enums                      # values ⊆ registry
    req_test_form_refs                   # acceptance/binding coherence
    store_uniqueness
  }
  coverage {
    closure aspect -> requirement -> test -> form -> verdict
    mapping_coverage per reference component
  }
  text_coverage {                        # layer 5, needs .prd
    normative_sentences target 1.0
    semantic_duplicates  target 0
    exclude [front_matter, annex_A_informative]
  }
}

allowlist_entry {
  rule ocl-identifiers
  match "*unresolved identifier 'load' in*"
  reason "per-load-point variable is indeterminate at verdict time by design"
  audit_ref analysis/deep-audit-r60.md#F6
}
```

## 11.9 Validation rules (for the validation artifacts)

The checker's own inputs are models too, and get checked:

- every allowlist entry names a real rule, a non-empty pattern, a
  `reason`, and an `audit_ref`; an entry matching nothing reports STALE
  and fails the strict gate;
- every `check` block names a target package resolvable in the
  workspace; its coverage exclusions must cite declared fragments or
  parts, not free text;
- a coverage allowance (`definitional` verification, informative
  exclusion) is a declared record, an *undeclared* gap is always a
  finding.

## 11.10 Summary

- Validation is a five-layer stack: schema (●), linker (●, R1–R43),
  cross-layer invariants (● C1–C96), coverage audits (◐),
  text coverage (●). Each layer assumes the one below.
- The linker resolves every cross-file reference; the allowlist
  discipline (KNOWN prints, STALE must die) keeps inherited debt honest
  and finite.
- `primmel check` enforces the tier law across fifteen families, base,
  anatomy, process, instantiation, mapping, composition, quantities,
  state, promises, artifacts, characteristics, coverage, twins, edition,
  supply chain.
- Coverage is computed, not opined: aspect↔requirement↔test↔form
  closure plus mapping coverage; deliberate exclusions are records.
- The pitfalls catalog (clause drift, scope confusion, snake_case,
  bare numbers, unbound requirements, binding-key drift, table shapes)
  is the R 60 build's scar tissue, each entry now a check.

*Next: [Chapter 12, Interop](12-interop.md): ReqIF, RDF/OWL and
OpenCDD, lossy-but-useful projections, never the kernel.*
