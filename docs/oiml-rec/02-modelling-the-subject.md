# Chapter 2 — Modelling the Subject

> *In this chapter:* how to declare the primary tier of a Recommendation
> package — the subject type and its variants, classification dimensions,
> family criteria, model groups, the attribute definition discipline,
> capabilities, behaviors, operating conditions, the documentary identity
> slots and qualitative aspects that complete the subject's HAS inventory,
> and the endpoint and serve declarations that make a subject twin-ready
> (○). Everything else in the package anchors to what you declare here.

---

## 2.1 The subject is the package's foundation

A Recommendation governs a kind of measuring instrument. Before any
requirement, test, or form can be authored, the instrument itself must
exist as a model: the **subject** of the primary tier. This is not
ceremony. Every secondary element you will write later — a requirement's
`binds_to`, a test's variables, a form's `bind:` paths — resolves against
the subject's declared aspects, and the linker rejects anything that does
not resolve. Get the subject right and the secondary models write
themselves as derivations of it; get it wrong and every downstream model
compensates with duplication.

All subject content lives in `data/<rec>/model/`, instantiating Module C
(instrument-description) of the OIML core metamodel. The R 60 package is
the running example throughout: `data/r60/model/` holds
`instrument.yaml` (subject type, dimensions, family, groups),
`attributes.yaml` (the attribute schema), `capabilities.yaml`,
`behaviors.yaml`, `conditions.yaml`, `promises.yaml`,
`characteristics.yaml`, `identity.yaml` (documentary identity slots) and
`aspects.yaml` (the qualitative aspect registry). Author them in that
order.

## 2.2 Subject type and variants

Declare the subject as a subclass of the metamodel's abstract
`MeasuringInstrumentModel` — the Model level of the subject chain, the
centre of conformity (● `data/r60/model/instrument.yaml`):

```yaml
subject_type:
  id: LoadCell
  extends: MeasuringInstrumentModel
  measurand_kind: force               # output expressed in units of mass
  definition: >
    Measuring transducer that will produce an output in response to an
    applied load. …
  source: { doc: urn:oiml:pub:r:60-1:2021, clause: "3.1.3" }
```

Three things are mandatory and one is implied. The `extends` places the
subject on the metamodel's subject chain (Family → Group → Model →
Sample); `measurand_kind` fixes what the instrument measures; the
`definition` is the Recommendation's own normative sentence, transcribed
verbatim with its clause provenance. Nothing is provenance-free: every
declaration carries `source: { doc, clause }` with the clause-URN of the
edition named in `standard.yaml`.

Most Recommendations partition their subject into **variants**. R 60
declares four, one per signal-processing category (`analogue_passive`,
`analogue_active`, `digital`, `digital_with_processing`, R 60-1
§3.1.3.1–3.1.3.4). Each variant gets the same metadata shape: id,
human-readable `name`, normative `definition`, `source` clause. Variants
are IS-level facts — a digital load cell is a *different subject* from an
analogue-passive one — but they are not new classes: they share one
subject type and differ in which capabilities (§2.8) and dimensions
(§2.3) apply. Resist declaring a variant per market name; declare one
per distinction the Recommendation itself draws normatively.

## 2.3 Classification dimensions

Dimensions are the HAS-level classification axes that drive applicability:
which requirements apply, which tests run, which forms appear in the
report. Each dimension declares an id, a **scope** (the chain level at
which membership is stated), enum `values` with localized names, and
clause provenance (● `data/r60/model/instrument.yaml` —
`classification_dimensions`):

```yaml
  - id: accuracy_class
    scope: group
    source: { doc: urn:oiml:pub:r:60-1:2021, clause: "5.1.1" }
    values:
      - id: C
        n_lc_limits: { lower: 500, upper: 10000 }   # R 60-1, Table 1 payload
```

R 60 declares five axes: `technology` (scope family, §5.7),
`accuracy_class` (group, §5.1.1), `humidity_class` (family, §6.2.4.4),
`load_type` (group, §5.1.4), `construction` (family, §3.3). Two rules
make dimensions earn their keep:

- **Per-value payload hangs off the enum entries.** When the
  Recommendation tabulates data per class — R 60-1 Table 1's `n_LC`
  ranges per accuracy class — attach it to the value, not to a parallel
  structure, so applicability and payload resolve from one place.
- **Mirror every axis as an attribute.** Each dimension is mirrored in
  `attributes.yaml` with `is_dimension: true` and `enum: <axis id>`
  (● `accuracy_class`, `load_type`, `technology`; `humidity_symbol`
  mirrors `humidity_class`). The mirror is what lets requirement
  `applicability` blocks, capability filters, and form `bind:` paths
  reference the axis through the one uniform attribute vocabulary. The
  mirroring is by-id, so collisions matter: R 60's `construction`
  dimension (measurement technique) has no mirror, and the pre-existing
  mechanical-construction attribute was renamed `construction_type` to
  keep the id space clean.

Dimension values may also declare `implies: [otherValueIds]` for category
subsumption — R 91's average-speed meter implies the fixed-distance
category (● `data/r91/model/instrument.yaml`); the graph must be acyclic
and the linker checks it.

## 2.4 Family criteria: transcribe, or derive-and-annotate

The **family** (VIML 4.02) is the level at which the Recommendation
decides what "one application" covers. The family criteria are the
Recommendation's own rule for that sameness, and the discipline is:
**transcribe them verbatim** (● `data/r60/model/instrument.yaml` —
`family_criteria`, R 60-1 §3.4.2 (a)–(f)):

```yaml
  family_criteria:
    - "same material or combination of materials (e.g. mild steel, …)"
    - "same design of the measurement technique (e.g. strain gauges bonded to metal)"
    - "same principle used to attach the strain gauge to the load cell"
    - "same method of construction (shape, sealing of strain gauges, mounting method, manufacturing method)"
    - "same set of specifications (output rating, input impedance, supply voltage, …)"
    - "one or more load cell groups, all cells in a group having identical
       metrological characteristics (class, n_LC, temperature rating, etc.)"
```

A candidate model violating any criterion is a *different family* — a
separate application and type evaluation. That is a conformance-relevant
decision, so paraphrase is forbidden: the criteria are quoted, not
summarized.

What if the Recommendation has no family clause? **The R 144 lesson:**
derive and annotate. R 144 defines no "family" — so its package derives
criteria from the clauses that do delimit sameness (measuring principle
§1.1, system composition §2.1, principal units §3.2), carries a `note`
saying exactly that, and tags every derived criterion with the clause it
was derived from (● `data/r144/model/instrument.yaml`). Derived criteria
are legitimate; unannotated ones are not.

## 2.5 Model groups

Some Recommendations define an intermediate level inside the family —
R 60-1 §3.4.2's "load cell group". Declare it only if the Recommendation
does, and declare it as *data about sameness*
(● `data/r60/model/instrument.yaml` — `model_groups`):

```yaml
model_groups:
  identical_characteristics: [ metrological_class, n_lc, "y", z, temperature_rating ]
  identical_attributes:      [ accuracy_class, n_lc, "y", z, t_min, t_max ]
```

The first list keeps the Recommendation's own terminology; the second
maps it onto attribute ids (`metrological_class` → `accuracy_class`,
`temperature_rating` → `t_min`/`t_max`). A group carries a compact label
— `group_label`, e.g. `'C6'` for class C with `n_LC` 6000
(● `data/r60/entities/instrument.yaml` — `MeasuringInstrumentModelGroup`)
— which doubles as the certificate dimension label. Within a group,
models differ only by `e_max` (R 60-2 Annex D), and sample selection for
type evaluation runs **per group**, never per model. Never use a group to
paper over a family-criterion change: criteria hold ⇒ one family split
into groups; any criterion differs ⇒ separate family.

## 2.6 Attributes: the definition discipline

Attributes are the INV-2 schema layer: each attribute is **defined once**
in `attributes.yaml` and **valued** per Family/Group/Model/Sample —
values are resolved by delegation, never copied downward (INV-10). The
definition is a fixed nine-field anatomy (● `data/r60/model/attributes.yaml`
— `e_max`):

```yaml
  - id: e_max
    symbol: E_max
    name: Maximum capacity
    definition: Largest value of a quantity expressed in units of mass,
      which may be applied to a load cell.
    source: { doc: urn:oiml:pub:r:60-1:2021, clause: "3.5.5" }
    quantity_kind: mass
    unit: kg
    value_type: QuantityValue
    origin: design-fixed
    scope: model
    category: metrological
    is_dimension: false
```

- `id` — **snake_case of the Recommendation's symbol** (`E_max` →
  `e_max`); the machine key used in bind paths, calculations, and forms.
- `symbol` — the print symbol as typeset (`E_max`, `p_LC`, `DR`), kept
  separate so ids stay snake_case while documents render true notation.
- `definition` + `source` — the normative sentence and its clause-URN.
- `quantity_kind` + `unit` — from `value-types.yaml` (register the unit
  there first); omitted for dimensionless kinds.
- `value_type` — `QuantityValue` for quantities (INV-1: no bare numbers),
  `string` for enums and identifiers.
- `origin` — where the value comes from (§2.7).
- `scope` — where the value is stated (§2.7).
- `category` — the characteristics breakdown: `metrological | electrical
  | dimensional | material | administrative`.
- `irdi` — the IEC CDD identifier where a registry entry exists
  (● `rated_output`), so shared attributes cite an international
  dictionary instead of being invented per package.

**Derived attributes carry OCL over sibling ids** — declared once at the
schema layer, never recomputed ad hoc downstream: `v_min` is
`(self.e_max - self.e_min) / self.y`; `mpe` is
`lookupMPE(load, self.accuracy_class, self.p_lc)`.

**When to add an attribute** — exactly four triggers: a requirement binds
it, a form captures it, a calculation consumes it, or the certificate
prints it. Narrative content earns no attribute. This is the anchoring
rule applied in reverse: every attribute should be reachable from the
secondary tier, and the coverage audit reports ones that are not.

## 2.7 Origin and scope: two independent decisions

`origin` and `scope` usually align but are different axes. R 60 draws the
distinction with its own figure: the "E-terms" above the line are
`origin: design-fixed` (values fixed by design — changing one makes a
different model); the "D-terms" below the line are `origin:
test-dependent` (values chosen under test); manufacturer ratings are
`origin: declared`. Scope follows this decision table:

| scope | rule | R 60 examples |
|---|---|---|
| family | constant for every model (family criteria, shared specs) | `e_min`, `p_lc`, `t_min`/`t_max`, `rated_output`, impedances, `transducer_material` |
| group | identical across one matrix sub-family | `accuracy_class`, `n_lc`, `v_min`, `y`, `z`, `dr`, `mpe` |
| model | distinguishes one catalog model | `e_max`, `mr_max`, `warm_up_time`, `power_voltage`, `software_identification` |
| sample | chosen under test — never inherited | `d_min`, `d_max`, `v`, `n`, `mr`, `conversion_factor_f` |

Sample-scope values live on the sample's `test_context`. The two axes
decouple in the instructive case: `dr` is `origin: test-dependent` with
`scope: group` — a *declared group characteristic verified per sample*.
Origin says where the value comes from; scope says where it is stated.
Decide them independently.

## 2.8 Capabilities: the mixin model

Capabilities decide which attributes, requirements, and tests apply to a
Model; a Model declares `capabilities[]` and its effective set is the
**union** over them (● `data/r60/model/capabilities.yaml`). Author the
base capability first, then compose:

- `load-cell` — the base every load cell has: `has_parameters` (`e_max`,
  `e_min`, `n_lc`, `v_min`, `dr`, `y`, `z`, `p_lc`),
  `satisfies_requirements` (`/req/metrological/mpe`, `repeatability`,
  `creep`, `dr`, `temperature-effect-mdlo`, `barometric-pressure`),
  `verified_by_tests` (the four metrological procedures).
- `extends: [electronic]` — inherits parameters, requirements, and tests
  transitively (`analogue-active`, `digital`).
- `requires: [load-cell, electronic]` — forces co-declaration; a model
  declaring `digital` must also declare its prerequisites.
- `abstract: true` — blocks direct declaration (`electronic` exists only
  to be extended).

This is the OCP mechanism: **a new variant is a new capability, not a
schema change** — adding "wireless" edits no requirement, test, or form.
The three wiring lists are the capability's anchor set:
`has_parameters` binds attribute ids, `satisfies_requirements` and
`verified_by_tests` bind the secondary ids of chapters 3–4. The linker
verifies every one resolves.

## 2.9 Behaviors

Behaviors are the subject's DOES face at authoring time: the response
characteristics that requirements quantify and tests stimulate. Each
declares `kind` (`static | dynamic | temporal | influence-response`), a
`stimulus`, a normative `response` sentence with provenance, and
`verified_by` test links (● `data/r60/model/behaviors.yaml` — `creep`,
R 60-1 §3.7.1, verified by `/conf/metrological-tests/creep`).

The `verified_by` link is how a behavior joins the coverage chain:
behavior → test → requirement. Declare a behavior **even when no test
exists yet**: `durability` (VIML 5.15) has no R 60-2 procedure and is
deliberately left without `verified_by` — the absence is the honest
statement that this behavior is currently claimed, not verified, and the
coverage audit reports it as such.

## 2.10 Operating conditions and test conditions

The designed operating envelope is the three VIM tiers of the IS/HAS
duality, each a named set of influence-quantity values `{ quantity_kind,
value, unit, tolerance? }` (● `data/r60/model/conditions.yaml` —
`load-cell-operating-conditions`):

- **reference** — where specification values are valid: the enforced test
  conditions (20 °C ± 2, R 60-2 §2.10.1; the §2.7.3.1 stability rule).
- **rated** — the envelope where the instrument performs as designed and
  errors are judged against MPE (default −10…+40 °C, R 60-1 §5.6.1).
- **limiting** — what the instrument survives without permanent shift
  (loads up to `e_lim`, excitation up to `excitation_maximum`).

A test will later *constrain the actual environmental context (HAS) to
lie within these designed tiers (IS)* — the duality made operational.
The same file holds `common_test_conditions` — procedural conditions
shared by all performance tests (calibrated, traceable equipment; axial
loading without shock; stabilisation periods; ISO 8601 timestamps),
referenced by tests rather than restated per test.

## 2.11 Declaring the subject twin-ready (○)

Sections 2.2–2.10 declare the subject for the laboratory. One further
question belongs at authoring time: *could this subject be switched
on?* The twin direction (Volume I, [chapter
14](../primmel/14-live-twins.md)) needs two more declarations — both
additive, both ○ in v3, and both anchored to the aspects already
modelled:

- **The endpoint (IS-level).** The subject's declared API surface —
  "this product offers this interface" is part of the type definition,
  like a marking or a software identification. Each operation has a
  **kind** (`query` pulls a current value, `subscribe` pushes on
  change, `invoke` triggers a process) and an **access scope**
  (`public` / `registered` / `authority` — who may call it), and the
  endpoint carries a **connector profile** (`rest_json`, `mqtt`,
  `opc_ua`, `file_drop`) binding protocol to model.
- **The serve bindings (HAS-level).** Which declared aspects the
  endpoint serves, via which operation — attributes, dimensions, state,
  characteristics, environmental context — each with a **freshness
  window** (`fresh_within 5s`): how old a value may be before it stops
  meaning anything. Freshness is part of the binding, not an
  operational detail: a monitor reading a stale value degrades its
  verdict to `indeterminate`, never a silent pass.

Nothing else in this chapter changes. The served aspects are the ones
of §2.3–§2.10, and the OCL a monitor evaluates is the requirement's own
limit (INV-9) — the laboratory and the twin are judged by the same
statements. Sketched on the running example:

```prl
subject LoadCell extends MeasuringInstrumentModel {
  is {
    endpoint lc500_api {                                  # ○
      operation get_indication { kind query     serves indication }
      operation watch_state    { kind subscribe serves state, environmental_context }
      operation run_self_test  { kind invoke    does self_test }
      access  { public: [get_indication]  registered: [watch_state]
                authority: [run_self_test] }
      profile rest_json
    }
  }
  has {
    serve sample.test_context.d_min via get_indication { fresh_within 5s }   # ○
  }
}
```

Authoring guidance in one line: declare the endpoint when the
instrument is expected to be queryable in service; declare a serve
binding for every aspect a requirement will want *live* — and give each
its freshness window, because a live binding without one is an error.

## 2.12 Documentary identity and qualitative aspects: completing the HAS inventory

Sections 2.2–2.10 declare the quantitative and behavioural subject:
attributes, dimensions, capabilities, behaviors, conditions. But a
Recommendation also constrains things that are *not* quantities — "verify
markings and inscriptions for a Class C load cell" presupposes the load
cell **has** markings and inscriptions. A requirement can only constrain
what exists: every constraint needs a home in the subject's IS/HAS/DOES
inventory. Two registries complete the inventory (TODO.roadmap/47), and
one linker rule makes the coverage machine-checked.

**The derivation protocol** is an audit, not an invention. Read every
requirement and every conformance test of the Recommendation and ask
*what the subject must have for this constraint to be checkable*:

| the constraint is about… | the home is |
|---|---|
| a quantity the subject carries | an attribute (§2.6), bound `<layer>.parameters.<id>` |
| category membership | a dimension (§2.3), bound `<layer>.classification.<id>` |
| a sample/test-run value | a sample-scope attribute, bound `sample.test_context.<id>` |
| documentary identity (who/what/when, approval marks) | an identity slot, bound `model.identity.<id>` |
| a qualitative facet (markings, sealing, software, construction, power supply, interfaces, documentation) | an aspect, bound `model.aspects.<id>` |
| a capability / characteristic / behavior | those registries, bound `model.capabilities.<id>` / `model.characteristics.<id>` / `model.behaviors.<id>` |

**Identity slots** (`model/identity.yaml`, `identity_slots:`) are the
instrument's documentary identity as first-class HAS items — the typed
content vocabulary of metamodel Module B `Marking.items
{content, location}`. Each slot: snake_case `id`, `label`, `type`
(`string | designation | serial | year | mark | map`), `presentation`
(`marked-on-instrument` and/or `accompanying-document` — the *location*
axis; R 60-1 6.2.1 vs 6.2.2), optional `optional: true` for conditional
slots (a type approval mark "if applicable"), and clause `source`. Never
a quantity: a marked E_max stays an attribute; the slot is only the
documentary fact. R 60 ships five: `manufacturer`, `model_designation`,
`serial_number`, `year_of_production`, `type_approval_mark`.

**Aspects** (`model/aspects.yaml`, `aspects:`) are the qualitative HAS
registry. Each aspect: `id`, `label`, `kind` (`marking | inscription |
sealing | display | control | interface | power-supply | enclosure |
construction | documentation | other`), `definition`, clause `source`,
and optional links — `term_ref` (the terminology term defining it),
`component` (a declared component it sits on), `attribute` (its
quantitative facet, e.g. `power_supply` → `power_voltage`), and
`contains:` (sub-slots it presents: `model.identity.<slot>` paths or
attribute ids — never redeclaring quantities). Where the metamodel has
the class, say so via `metamodel_class` (Module B `Marking`, `Sealing`,
`SoftwareComponent`); the remaining kinds are rec-level registries by
design. R 60 ships eight: `markings`, `accompanying_document`,
`application_documentation`, `sealing`, `software`, `construction`,
`power_supply`, `interfaces` — derived from R 60-1 6.x and the R 60-2
2.5/2.6 examination targets.

**Binding coverage is machine-checked** (linker rule
`requirement-binding-targets`, R28): every requirement `binds_to` and
every test `binds_to` — the test's *inspection/verification targets*,
distinct from its `targets:` (the requirements it verifies) — must
resolve against the full inventory, and once a package declares an
aspect registry, every requirement and every test must bind ≥1 home; a
constraint on nothing is a modelling error. (CASCO/scheme-layer
provisions — `/req/cs/*`, `/req/iso-*` — are exempt from coverage: they
constrain the certification body, not the subject.) The metamodel
decision: identity slots and the Module-B-backed aspects *realize*
existing metamodel classes (`Marking`, `Sealing`, `SoftwareComponent`),
so no metamodel addition was needed for the pilot — a generic `Aspect`
class for Module C is deferred until a second Recommendation's
enrichment audit confirms the pattern recurs.

## 2.13 Grammar sketch *(illustrative v3 syntax)*

```prl
subject LoadCell extends MeasuringInstrumentModel {
  is {
    metadata   { name "Load cell"  measurand_kind force
                 source "urn:oiml:pub:r:60-1:2021#clause-3.1.3" }
    variants   { analogue_passive «3.1.3.1»  analogue_active «3.1.3.2»
                 digital «3.1.3.3»  digital_with_processing «3.1.3.4» }
    family_criteria verbatim "r:60-1:2021#clause-3.4.2"   # or derive-and-annotate
    model_groups identical [ accuracy_class, n_lc, y, z, t_min, t_max ]
    designed_conditions { reference ref_conds  rated rated_conds  limiting lim_conds }
  }
  has {
    dimensions {
      accuracy_class : group ∈ { A, B, C, D }
        with payload { C → n_lc_limits { 500, 10000 } }
      humidity_class : family ∈ { CH, SH, NH }
    }
    attributes {
      e_max : mass[kg]  origin design-fixed  scope model  category metrological
            symbol "E_max"  source «3.5.5»
      v_min : mass[kg]  origin design-fixed  scope group
            derive ocl{ (self.e_max - self.e_min) / self.y }
      d_max : mass[kg]  origin test-dependent scope sample   # → test_context
    }
    capabilities {
      load-cell        { has_parameters [e_max, e_min, n_lc, v_min, dr, y, z, p_lc]
                         satisfies [/req/metrological/mpe, …]
                         verified_by [/conf/metrological-tests/creep, …] }
      electronic       { abstract }
      digital          { extends [electronic]  requires [load-cell, electronic] }
    }
  }
  does {
    behavior creep : temporal { stimulus force  response «3.7.1»
                                verified_by /conf/metrological-tests/creep }
    behavior durability : temporal { stimulus time  response «viml-2022:5.15» }
                                  # deliberately unverified
  }
}
```

## 2.14 Validation rules

The schema, linker, and coverage audit enforce:

- every `extends` target is a metamodel subject-chain class; every
  `source` clause resolves against the edition named in `standard.yaml`;
- every dimension's enum values are the only values usable in
  `applicability` blocks anywhere in the package; `implies` graphs are
  acyclic;
- every dimension is mirrored by exactly one `is_dimension: true`
  attribute whose `enum` points back; no non-dimension attribute reuses a
  dimension id;
- every attribute id is snake_case, unique, and carries origin + scope;
  sample scope implies `test_context` storage; `derived` expressions
  reference only declared sibling ids;
- every capability `has_parameters` / `satisfies_requirements` /
  `verified_by_tests` entry resolves; `requires` closures are satisfied;
  `abstract` capabilities are never declared directly;
- every behavior's `verified_by` resolves, or the behavior is reported as
  unverified coverage — a finding, not an error;
- every `quantity_kind` and `unit` resolves against `value-types.yaml`;
- every requirement and test `binds_to` path resolves against the full
  HAS inventory (attributes, dimensions, identity slots, aspects,
  capabilities, characteristics, behaviors), and — once an aspect
  registry is declared — every requirement and test binds ≥1 home;
  aspect `contains` / `attribute` / `component` / `term_ref` links
  resolve against the same inventory;
- every `serve` binding (○) names a declared aspect and a declared
  endpoint operation, and carries its freshness window — a live binding
  without `fresh_within` is an error.

## 2.15 Summary

- The subject is declared once, in `model/`, before anything secondary;
  every later element anchors to it.
- One subject type `extends MeasuringInstrumentModel`; variants are
  declared per normative distinction, with verbatim definitions and
  clause provenance.
- Dimensions drive applicability: enum values carry per-value payload,
  and each axis is mirrored as an `is_dimension` attribute.
- Family criteria are transcribed verbatim — or, when no clause exists,
  derived and annotated per criterion (the R 144 lesson).
- Attributes are defined once with a fixed anatomy (snake_case id, print
  symbol, definition, source, kind/unit, value type, origin, scope,
  category, irdi); derived attributes carry OCL. Add one only when a
  requirement, form, calculation, or certificate demands it.
- Capabilities are mixins — base first, then `extends`/`requires` —
  making a new variant an additive edit. Behaviors are declared with
  `verified_by` links, or deliberately without. Conditions come in the
  three designed tiers plus shared test conditions.
- The HAS inventory is complete before the secondary models start:
  identity slots (`identity.yaml`) for the documentary identity, aspects
  (`aspects.yaml`) for the qualitative facets — derived by auditing every
  requirement and test for what the subject must HAVE — and linker rule
  R28 proves every requirement and test binds ≥1 declared home.
- Twin readiness is two additive declarations (○): the endpoint (IS —
  operations with kinds and access scopes, one connector profile) and
  the serve bindings (HAS — aspect via operation, each with a freshness
  window; stale ⇒ `indeterminate`).

*Next: [Chapter 3 — Requirements](03-requirements.md): constraints bound
to the subject you just modelled — statement, binding, OCL limits, and
tables as data.*
