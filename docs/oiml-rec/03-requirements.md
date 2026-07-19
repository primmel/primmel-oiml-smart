# Chapter 3 — Requirements

> *In this chapter:* the requirement — the first secondary model kind —
> as a constraint bound to subject aspect paths: its anatomy, the bind
> vocabulary, the constraint/requirement distinction, tables as data, and
> the VerdictQuantity discipline that derives every acceptance quantity
> exactly once.

---

## 3.1 What a requirement is

A requirement is a **constraint over primary aspect paths**. It is the
first kind of secondary model you author, and the anchoring rule governs
every line of it: a requirement *binds* aspect paths — it never redefines
them, never restates a subject fact, and never contains a number that
belongs to the instrument (INV-3). The "shall" sentence is the human
rendering; the model is the binding plus the limit.

Requirements live in `data/<rec>/specification/requirements/`, grouped in
scopes `/req/<area>`; a requirement's full id is its scope plus its
`identifier_fragment` — `/req/metrological/creep`. Every requirement is
also the anchor for everything downstream: tests `targets` it, forms
reference it, and evaluation re-executes its limit against evidence to
produce a verdict. A requirement with no test is unverifiable; that is a
coverage finding the linter computes, not a review opinion.

## 3.2 Anatomy

Six parts, in authoring order — shown on the simplest metrological
requirement of R 60 (● `data/r60/specification/requirements/metrological.yaml`
— `measuring-range-max`):

```yaml
    - name: Maximum load of the measuring range
      identifier_fragment: measuring-range-max
      reference: "urn:oiml:pub:r:60-1:2021#clause-5.2"
      statement: |
        The value of the largest load applied to a load cell during test which
        is expressed in units of mass shall not be greater than E_max.
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

1. **statement + reference** — the normative "shall" sentence transcribed
   verbatim, and its clause-URN provenance. The statement is for humans;
   nothing downstream parses it.
2. **binds_to** — the canonical aspect paths the requirement constrains
   (§3.3). This is the requirement's anchor set and the machine's answer
   to "what is this requirement *about*?"
3. **limit** — the machine-checkable OCL `expression`, with `uses`
   listing *every* input the expression reads: attribute paths,
   `observable:` ids, `formula:`/`table:`/`profile:` references. `uses`
   is the closed-world declaration the linker checks the expression
   against.
4. **applicability** — the classification filter (§3.6).
5. **verification.method** — how conformity is established (§3.6).
6. **acceptance_criteria** — the legacy human-readable form (threshold
   type, operator, unit), kept for provenance only. `binds_to` + `limit`
   are canonical; never author one without the other, because an
   unbound requirement cannot be re-executed at evaluation and judges
   nothing.

A richer limit shows the pattern at full strength — the creep
requirement (● same file, `creep`):

```yaml
      limit:
        expression: "ocl{abs(c_c) <= 0.7 * abs(lookupMPE(sample.test_context.d_max, group.classification.accuracy_class, 0.7)) and sample.test_context.d_max >= 0.9 * model.parameters.e_max and sample.test_context.d_max <= model.parameters.e_max}"
        uses:
        - observable:c_c
        - group.parameters.mpe
        - group.classification.accuracy_class
        - model.parameters.e_max
        - sample.test_context.d_max
        - formula:lookupMPE
        - table:mpe_tiers
```

Note what the expression does *not* contain: no tier breakpoints, no
MPE numbers. Those live in a table (§3.5). The limit reads the subject
through bound paths and reads data through named lookups — nothing else.

## 3.3 The bind vocabulary

`binds_to` and form `bind:` paths share one vocabulary of canonical
aspect paths into the primary tier:

| path shape | binds | R 60 example |
|---|---|---|
| `model.parameters.<attr>` | model-scope attributes | `model.parameters.e_max` |
| `group.parameters.<attr>` | group-scope attributes | `group.parameters.mpe`, `group.parameters.n_lc` |
| `family.parameters.<attr>` | family-scope attributes | `family.parameters.p_lc`, `family.parameters.t_min` |
| `*.classification.<dim>` | dimension membership at its scope | `group.classification.accuracy_class`, `family.classification.humidity_class` |
| `sample.test_context.<attr>` | sample-scope, test-dependent values | `sample.test_context.d_max`, `sample.test_context.v` |
| `observable:<symbol>` | test-output quantities (in `uses`) | `observable:e_l`, `observable:c_c`, `observable:c_p` |
| `formula:<id>` / `table:<id>` / `profile:<id>` | named calculations and data (in `uses`) | `formula:lookupMPE`, `table:mpe_tiers`, `profile:min_temperature_span` |

Scope discipline is enforced: a path must resolve to an attribute
declared at that scope — `sample.test_context.e_max` is a linker error,
not a warning, because `e_max` is model-scope. The `observable:` ids are
the symbols of the characteristics tests compute (`symbols.yaml`);
binding an observable is how a requirement constrains a *test output*
without owning the test.

## 3.4 Constraint vs requirement

Two model kinds carry OCL Booleans in this system, and confusing them
corrupts evaluation:

- A **Constraint** (Module C) is an intrinsic *validity* rule — an OCL
  `inv` over the subject or the test setup. A violation means the
  situation is malformed.
- A **Requirement** (Module D1) is a regulatory *limit*. A violation
  means the instrument is non-conforming.

The classic constraint is test-setup geometry (● `ontology-remix/OIML
Recommendation Models/Ontology/R 60/oiml-r60-loadcell-profile.yaml` —
`constr:r60:fig3-2b`):

```yaml
  - id: constr:r60:fig3-2b
    kind: test-setup
    stereotype: inv
    expression: "0.9 * self.E_max <= self.D_max and self.D_max <= self.E_max"
    output: { type: Boolean, satisfiedWhen: true }
    violationMeaning: "D_max below 90% of capacity or above capacity — test setup invalid."
```

The `violationMeaning` is the tell: a violated test-setup constraint
invalidates the run *as a test*, regardless of results — checked at run
time, not judged at evaluation. The same sentence structure ("D_max shall
not exceed E_max") appears as *both* kinds in R 60: as requirement
`measuring-range-max` (§3.2), where a violation is instrument
non-conformity, and as constraint `fig3-2b`, where a violation is a void
run. The authoring rule: **"the test was set up wrong" → constraint;
"the instrument must be this good" → requirement.**

## 3.5 Tables and profiles: Recommendation data stays data

When the Recommendation hands you a table, model the table — never bake
its numbers into OCL. R 60-1 Table 4 (MPE tiers per accuracy class) is
data in two linked shapes (● `data/r60/specification/tables.yaml`):

- **`tables:`** — column-indexed rows with typed columns, supporting the
  MMEL lookup syntax;
- **`profiles:`** — dimension-keyed bindings for runtime lookup:
  `mpe_tiers` binds per accuracy class the tier list
  `{ min, max?, factor }`; `test_runs` binds 5/5/3/3;
  `temperature_increment` binds 2/5/5/5; `n_LC_range`, `p_LC_range`,
  `min_temperature_span` likewise.

Expressions reach this data through two declared formula functions
(● `data/r60/specification/formulas.yaml`): `lookupMPE(load,
accuracy_class, p_lc)` — key on class, variable on load, multiplier
`p_LC` — and the generic `lookupProfile('<profile>', <dimension_value>)`.
Requirement limits call the functions; the functions read the tables; the
tables carry the clause provenance (`source: r:60-1:2021, table-4`).
Change a tier in a future edition and you edit one data file — no
expression in the package moves.

Two honest-data practices come with this:

- **Annotate equivalences, don't "fix" shapes silently.** `mpe_tiers`
  tier-3 rows are unbounded above (`null`); R 60-1 Table 4 bounds them at
  exactly the `n_LC` class limits of Table 1, so the shapes are
  equivalent for any classifiable load cell. The file header says so and
  keeps the legacy shape.
- **Record source discrepancies as data.** The legacy value model carried
  analogue-passive `p_LC` 0.3–1.0 against R 60-1:2021 §5.3.2's 0.3–0.8.
  The `p_LC_range` profile keeps the legacy binding with a
  `source_discrepancy` block (summary, sources, resolution, rationale);
  the canonical limit in `/req/metrological/mpe` enforces 0.3–0.8.
  Preserve and annotate; fix at the canonical layer.

## 3.6 Applicability and verification methods

**Applicability** is a classification filter, declared per requirement
against the dimension enums: `applicability: { humidity_class: [CH] }`
on `/req/metrological/humidity-ch`, `[SH]` on `humidity-sh`. The
applicability engine expands these per subject at runtime — a CH-marked
cell gets the CH requirement and never the SH one. Values must exist on
the dimension; the linker rejects typos here because applicability is
where a wrong id silently becomes "requirement never applies".

**verification.method** declares how conformity is established, from the
fixed vocabulary `definitional | computational | testing | inspection |
deferred` (● all five in use across `data/r60/specification/requirements/`):

- `definitional` — satisfied by definition and confirmed at report review
  (the measuring-range requirements);
- `computational` — verified by evaluating the limit over declared and
  derived values;
- `testing` — verified by a conformance test (chapter 4);
- `inspection` — verified by examination (markings, documentation);
- `deferred` — no single test; assessed through the overall type
  evaluation (durability: "Assessed through the overall type evaluation
  process; no single specific test").

The method is not decoration: it tells the workflow what evidence a
verdict for this requirement may draw on, and it is what makes
"requirement with no test" a *finding* for `testing` methods but a
*design* for `deferred` ones.

## 3.7 Acceptance quantities: derived once, referenced everywhere

Some acceptance quantities are real derivations — composite, normalized,
clause-specified — and the failure mode to avoid is each layer
recomputing them its own way. R 60 lived that failure: the temperature
effect on MDLO was computed three ways at three layers (requirement,
form, evaluation), differing by normalization *and* by the v→v_min
conversion (the audit's F1 defect). The discipline that closes it:

- The quantity is declared **once** in the VerdictQuantity registry
  (● `data/r60/specification/verdicts.yaml` — `mdlo_normalized`, R 60-3
  §2.1.4):

```yaml
  - id: mdlo_normalized
    quantity: { kind: dimensionless }
    derive: "ocl{abs(c_m * t_f / delta_t * (d_max - d_min) / (n * v_min))}"
    inputs: [c_m, t_f, delta_t, d_max, d_min, "n", v_min]
    source: { doc: urn:oiml:pub:r:60-3:2021, clause: "2.1.4" }
```

- Every consumer **references** it. The requirement's limit uses the
  `accepts` pattern instead of restating the derivation (●
  `/req/metrological/temperature-effect-mdlo`):

```yaml
      limit:
        accepts:
          verdict: mdlo_normalized
          op: lte
          limit: "ocl{p_lc}"
```

- The linker enforces the one-home rule: every `inputs` entry resolves
  (`verdict-inputs-resolve`), no consumer re-derives a registered
  quantity (`verdict-no-shadow`), and no restated derivation diverges
  (`verdict-restatement`). Requirement-level verdict evaluation and
  form-level calculation evaluate the *same* parsed derivation, cached
  once per standard load.

The outcome limit has exactly one home — the requirement, or the
registry when the derivation is shared. Everything else is a reference.

## 3.8 Grammar sketch *(illustrative v3 syntax)*

```prl
requirement /req/metrological/creep {
  is {
    statement "The difference between the reading taken upon the
      application of a maximum load (D_max) and … shall not exceed
      0.7 times the absolute value of MPE for the applied load."
    source "urn:oiml:pub:r:60-1:2021#clause-5.5.1"
    modality shall
  }
  has {
    binds_to [ group.parameters.mpe, model.parameters.e_max,
               sample.test_context.d_max ]
    limit ocl{
      abs(c_c) <= 0.7 * abs(lookupMPE(sample.test_context.d_max,
                                      group.classification.accuracy_class, 0.7))
      and sample.test_context.d_max >= 0.9 * model.parameters.e_max
      and sample.test_context.d_max <= model.parameters.e_max }
    uses [ observable:c_c, group.parameters.mpe,
           group.classification.accuracy_class,
           model.parameters.e_max, sample.test_context.d_max,
           formula:lookupMPE, table:mpe_tiers ]
    applicability { }                       # all classes
  }
  does {
    verification { method testing }         # → /conf/metrological-tests/creep
  }
}

requirement /req/metrological/temperature-effect-mdlo {
  has {
    limit accepts { verdict mdlo_normalized  op lte  limit ocl{p_lc} }
    uses [ observable:c_m, observable:delta_t, profile:temperature_increment,
           family.parameters.p_lc, group.parameters.v_min, … ]
  }
  does { verification { method testing } }
}

constraint fig3_2b on LoadCell {            # Module C — validity, not a limit
  inv ocl{ 0.9 * self.E_max <= self.D_max and self.D_max <= self.E_max }
  violationMeaning "D_max below 90 % of capacity or above capacity —
                    test setup invalid."
}
```

## 3.9 Validation rules

The linker and `primmel check` enforce:

- every requirement carries `statement`, clause `reference`, `binds_to`,
  OCL `limit` + `uses`, `applicability`, and `verification.method`;
  `acceptance_criteria` alone never satisfies the binding requirement;
- every `binds_to` / `uses` path resolves to a declared attribute at a
  scope-appropriate level; every `observable:` id resolves in
  `symbols.yaml`; every `formula:`/`table:`/`profile:` reference resolves
  in `formulas.yaml` / `tables.yaml`;
- every identifier read by a limit expression appears in `uses`, and
  every `uses` entry is read (closed-world both directions);
- every `applicability` value is a declared enum value of its dimension;
- every `limit.accepts.verdict` resolves in `verdicts.yaml`, and no
  consumer shadows or divergently restates a registered VerdictQuantity;
- no tier breakpoint, MPE number, or profile value appears inside an OCL
  expression — data lives in tables, expressions read data through named
  lookups.

## 3.10 Summary

- A requirement is a constraint over primary aspect paths: statement +
  clause reference + `binds_to` + OCL `limit` with closed-world `uses` +
  `applicability` + `verification.method`. It binds; it never restates.
- The bind vocabulary is small and canonical: `*.parameters.<attr>`,
  `*.classification.<dim>`, `sample.test_context.<attr>`, plus
  `observable:`/`formula:`/`table:`/`profile:` references in `uses`.
- Constraints say "the test was set up wrong" (OCL `inv`,
  `violationMeaning`, void run); requirements say "the instrument must be
  this good" (limit, verdict). The same English sentence can be both —
  model it twice, once per kind.
- Recommendation tables and profiles are data with clause provenance,
  read through `lookupMPE`/`lookupProfile`; OCL never contains their
  numbers. Discrepancies are preserved and annotated, fixed only at the
  canonical layer.
- Acceptance quantities are derived once in the VerdictQuantity registry
  and referenced via `limit.accepts` everywhere — one home, one parsed
  derivation, all consumers agreeing by construction.

*Next: [Chapter 4 — Conformance Tests](04-conformance-tests.md): the
operations that put these requirements on trial — variables, steps,
conditions, acceptance criteria, and class inheritance.*
