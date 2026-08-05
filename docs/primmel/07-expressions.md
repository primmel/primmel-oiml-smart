# Chapter 7, Expressions

> *In this chapter:* the one rule language, why every computable
> statement in Primmel is OCL, the stereotype anatomy of a statement,
> how inputs are bound, and the table functions that keep normative
> numbers out of expressions.

---

Chapter 6 gave values their homes and types. This chapter gives them
their *logic*. A modelled standard is dense with computable statements:
requirement limits, conformance-test pass criteria, derived
characteristics, applicability guards, gateway conditions, form
derivations. Primmel's seventh design principle settles how they are
written: **one rule language**. All computable statements are OCL , 
no JavaScript snippets, no spreadsheet formulas, no prose arithmetic.

## 7.1 One rule language (INV-9)

INV-9 is the language law of the metamodel:

> All derivations and rules are expressed in OCL (OMG Object Constraint
> Language, formal/2014-02-03): side-effect-free statements of the form
> *[multiple bound inputs ⇒ OCL expression ⇒ typed output]*. Constraints
> are OCL `inv` (Boolean); Formulas are OCL `derive` (typed value). The
> same statement executes identically in D2 (fact checks) and D3
> (re-validation).

Three commitments are packed into that.

- **Side-effect-free.** An expression reads values; it never writes
  them. Evaluation order between independent statements is free, and
  re-evaluation is idempotent, the property verdict re-execution
  (INV-5) stands on.
- **Closed under reference.** Every identifier resolves to a declared
  element, a Symbol, an attribute on an aspect path, a context field,
  a table, or a built-in function. An unresolvable identifier is a
  load-time validation error, not a runtime `null` that silently
  falsifies a limit (● `browser/src/engine/ocl/validator.ts`).
- **One execution.** The same statement runs in the test laboratory
  (a form's pass/fail as evidence is recorded) and in evaluation (the
  verdict service judging the requirement), one engine, one parse
  (§7.4).

The 2021 lineage's mini expression language is superseded. A bespoke
dialect is a second semantics to keep honest forever, and honesty
about two semantics always decays into a guess.

## 7.2 Statement anatomy: the stereotypes

Every rule-language statement is classified by an OCL stereotype that
says what kind of statement it is:

| Stereotype | Kind of statement | Output | Status |
|---|---|---|---|
| `inv` | **constraint**, a Boolean that must hold | Boolean | ● |
| `derive` | **derivation**, a typed value computed from inputs | QuantityValue / typed value | ● |
| `def` | **definition**, a named helper (derived property or query) reused by other statements | typed | ○ |
| `init` | **initialization**, the initial value of a variable at instance creation | typed | ○ |

The running system realizes the first two as first-class metamodel
classes. A **Formula** (Module C) is a `derive` statement: it computes
a derived attribute or characteristic from bound inputs , 
`MR = D_max − D_min`, `E_L = (I − I_ref) / f`; its output is a *value*,
never a judgment (INV-7). A **Constraint** is an `inv` statement: an
intrinsic validity rule over attribute values, formula outputs, or
measurements, coherence, distinct from a Requirement, which is a
regulatory *limit* on the secondary tier. `def` and `init` are
reserved slots, shared sub-expressions, instance-time defaults; the
current packages need neither (○).

Every statement, whatever its stereotype, has the same declared shape , 
visible in the ontology's Formula/Constraint field lists:

```text
context    : the classifier the statement is about (e.g. LoadCell)
stereotype : inv | derive | def | init
inputs     : bound variables — each { name, binding: 'self.<path>', from: <definition> }
expression : the OCL body
output     : the typed result (Boolean for inv)
```

The expression body is the *only* part that is free text; everything
else is declared structure the linter can check.

## 7.3 Binding: the `uses` discipline

An expression never reaches into the model by itself; its inputs are
**bound** explicitly. The chapter-1 sentence, modelled in
`data/r60/specification/requirements/metrological.yaml` (R 60-1 §5.2):

```yaml
limit:
  expression: "ocl{sample.test_context.d_max <= model.parameters.e_max}"
  uses:
  - sample.test_context.d_max
  - model.parameters.e_max
```

The `uses` list is the statement's *import declaration*: it makes the
anchor set (§1.5) machine-readable, one HAS path, one IS path here;
it lets the linker verify statically that every free identifier is
accounted for (`verdict-inputs-resolve`); and it lets evaluation build
the input scope without scanning the model at runtime. A Formula's
inputs bind the same way: `{ name: e_max, binding:
'self.parameters.e_max' }`.

Binding is where closed-under-reference stops being a slogan. An
identifier not in `uses` fails at load; a `uses` entry the expression
never mentions is dead weight and is flagged. The two directions keep
expression and anchor set in lockstep, the property the coverage
theorem of chapter 1 audits over.

## 7.4 One statement, two executions

The load-cell error tells the whole story:

```text
derivation (form, during the test):
  ocl{(indication - reference_indication) / conversion_factor_f}

rule (requirement limit, during evaluation):
  ocl{abs(e_l) <= abs(mpe)}
```

The first statement executes **in testing**: the form engine evaluates
it over recorded measurements and stores the computed value in the
FormInstance, a fact (INV-7). The second executes **in evaluation**:
the verdict service evaluates the requirement's limit against the
stored fact, a judgment. Both go through the same engine
(`browser/src/engine/ocl/`); each canonical derivation is parsed **once
per standard load** into a cached AST every consumer evaluates
(`verdict-registry.ts`; `services/verdict.service.ts` at requirement
level, `data/form-calculation.ts` at form level). No second evaluator
to drift.

This is re-execution concretely: given definitions + facts, every
judgment is reproducible. Change the class limits for a surveillance
audit and re-judge last year's report, no re-testing, no divergence
between lab computation and evaluator judgment (INV-5).

Chapter 14 adds a third execution to the same parse: the Compliance
Engine's monitors evaluate these statements over *served* values (○ , 
§14.5). There is no "online dialect", a monitor runs the lab's OCL
verbatim, which is precisely what makes continuous compliance a judgment
by the standard and not by a second semantics.

## 7.5 The dialect surface

The dialect is a deliberately small OCL subset, frozen by the engine
reference (`docs/ocl-dialect.md`). What an author actually writes:

- **The `ocl{...}` wrapper.** In YAML an expression string is wrapped
  `ocl{ ... }`; the wrapper is stripped before lexing. A string
  without it is prose and is never evaluated (●).
- **Data access.** Identifiers are the YAML keys of the scope:
  measurement fields, `$context.<field>`, `$form.<field>` (sibling
  fields), `$root.forms['load-cell-info'].d_max` (cross-form), and in
  DATALIST iteration `$index` and `$prev`. `a.b.c` walks records;
  `expr[i]` indexes.
- **Logic and arithmetic.** `and or xor not implies`, comparisons,
  `if/then/else/endif`, `let … in …`, power `^`, math builtins
  (`abs`, `round`, `floor`, `sqrt`, `pow`, `min`, `max`).
- **Collections.** `->forAll / ->exists / ->collect / ->select /
  ->reject` with single-iterator lambdas, membership
  `->includes / ->excludes / ->includesAll`, reducers
  `->size / ->sum / ->max / ->asSet`. One line computes repeatability:
  `ocl{(indications->max() - indications->min()) / conversion_factor_f}`.
- **Series and statistics** (evidence-shaped functions):
  `reading_at(series, 'elapsed_min', 30, 'change_v')`, `window`,
  `drift_over`, `group_by`, `pairwise_max_difference`, `stddev`,
  `m_sigma_coverage`, all fail loudly on empty windows or missing
  axes, never a coerced zero.
- **Quantity coherence.** Comparisons are checked by quantity kind
  (§6.3): a `verification_interval` observable against a `mass` limit
  is a linker error; a dimensionless literal adopts the other side's
  kind.

## 7.6 Table functions

Chapter 6's rule, *model the table, never bake numbers into OCL*, is
enforced by giving expressions first-class lookup functions (●):

- **`lookupMPE(load, accuracy_class, p_lc)`**, R 60-1 Table 4 as a
  function: resolve the `mpe_tiers` binding for the class, take the
  first tier with `min ≤ load < max` (missing `max` unbounded), return
  `factor × p_lc`. `mode: relative` tiers (`factor × load`) carry
  %-of-value limits (R 91).
- **`lookupProfile('<profile>', <dimension_value>)`**, the generic
  dimension-keyed accessor: `lookupProfile('n_LC_range', 'C')` →
  `{ min: 500, max: 10000 }`, `lookupProfile('test_runs', 'A')` → `5`
  (● `data/r60/specification/formulas.yaml`).
- **`lookup('<table>', '<column>', { key: value, … })`**, row lookup
  into a column-indexed table; `column: '*'` returns the row.

The linker enforces the discipline statically: `verdict-no-shadow`
(no re-deriving a canonical quantity under another name),
`verdict-restatement` (no restating a table's constants inline), and
lookup-arity/key checks against the declared table schema. A correct
MPE tier propagates by editing one cell, and every verdict derived
from it is re-computable (§7.4).

## 7.7 The symbol DAG

Every variable an expression can name is declared once in the symbol
registry (● `data/r60/specification/symbols.yaml`), and each symbol has
a **kind** that says what sort of thing it names:

| Kind | What it names | R 60 examples |
|---|---|---|
| `attribute` | an AttributeDefinition of the subject model (INV-2) | `e_max`, `d_max`, `n_lc`, `p_lc` |
| `formula` | a derived quantity with `formula { display, expression, inputs }` | `mr`, `y`, `z`, `n` |
| `observable` | a test-execution output, measured or derived during a run | `c_c`, `e_l`, `e_r`, `t_1`, `fault` |

`formula.inputs` lists the symbol's dependencies, and the edges form a
**directed acyclic graph**: declared parameters are the leaves,
`conversion_factor_f` sits one level up (inputs `[d_max, d_min, n]` in
the running data), the characteristics (`e_l`, `c_c`, `e_r`) above it,
`dr` → `z` above those. The engine evaluates in topological order; the
schema rejects a cycle outright. The DAG is traceability rendered
quantitatively: `formula.display` carries the normative text ("E_L =
(average test indication − reference indication) / f") next to the
machine expression, each symbol referenced to its clause URN.

## 7.8 Grammar sketch *(illustrative v3 syntax)*

```prl
# ── a derivation: stereotype derive, bound inputs, typed output ──
derive e_l on LoadCell {
  signature "E_L : VerificationInterval"
  inputs {
    avg : self.test.avg_indication        from symbol avg_indication
    ref : self.test.reference_indication  from symbol reference_indication
    f   : self.parameters.conversion_factor_f
  }
  expression ocl{ (avg - ref) / f }
  output { symbol e_l, unit v, quantity_kind verification_interval }
  source "urn:oiml:pub:r:60-3:2021#clause-2.1.2"
}

# ── a constraint: stereotype inv, Boolean output ──
inv measuring_range_coherent on LoadCell {
  inputs {
    d_min : self.sample.test_context.d_min
    e_min : self.family.parameters.e_min
  }
  expression ocl{ d_min >= e_min }
  violation "Minimum test load below E_min — the measuring range is misdeclared."
}

# ── a requirement limit (secondary tier): the same shape, anchored ──
requirement /req/metrological/measuring-range-max {
  binds_to [sample.test_context.d_max, model.parameters.e_max]
  limit {
    expression ocl{ sample.test_context.d_max <= model.parameters.e_max }
    uses      [sample.test_context.d_max, model.parameters.e_max]
  }
}

# ── a lookup-driven limit: the table is referenced, never restated ──
derive mpe on LoadCell {
  inputs { load : self.test.load ; cls : self.classification.accuracy_class
           p    : self.parameters.p_lc }
  expression ocl{ lookupMPE(load, cls, p) }
  output { symbol mpe, unit v }
}
```

## 7.9 Validation rules

- every expression parses at load time; a string in an expression
  slot without the `ocl{}` wrapper is prose, never evaluated (●);
- closed under reference: every identifier resolves to a Symbol,
  attribute path, context field, table, or built-in (●);
- every free identifier of a `limit.expression` appears in its `uses`
  list, and every `uses` entry is used, both directions checked
  (`verdict-inputs-resolve`);
- stereotype/output coherence: an `inv` body is Boolean; a `derive`
  body declares a typed output; `def`/`init` stay empty for now (○);
- the symbol dependency graph is acyclic; `formula.inputs` resolve to
  declared symbols (● schema);
- quantity-kind coherence on comparisons and arithmetic (●
  `quantity-coherence`);
- no shadowing or restatement: a canonical quantity is derived once
  and referenced; table constants never appear inline
  (`verdict-no-shadow`, `verdict-restatement`);
- lookup calls cite declared tables/profiles with matching key arity and column names (●).

## 7.10 Summary

- OCL is the only rule language (INV-9): side-effect-free, closed
  under reference, one engine; the 2021 mini language is superseded.
- Statements are stereotyped: `inv` (constraints, Boolean) and
  `derive` (typed values) are realized; `def` and `init` are reserved.
- Every statement is *[bound inputs ⇒ OCL ⇒ typed output]*; `uses`
  lists make anchor sets machine-readable and statically checkable.
- The same statement executes identically in testing (facts) and
  evaluation (judgments), parsed once and cached for every consumer.
- Table functions (`lookupMPE`, `lookupProfile`, `lookup`) keep
  normative numbers in tables, out of expressions.
- The symbol registry, attribute, formula, observable kinds, is the
  closed identifier space; `formula.inputs` form the DAG that orders
  evaluation.

*Next: [Chapter 8, Packages](08-packages.md): manifests, `uses`
composition, layering rules, modules, and versioning.*
