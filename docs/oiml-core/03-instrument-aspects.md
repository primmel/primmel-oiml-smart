# Chapter 3 — Instrument Aspects

> *In this chapter:* the rest of Module C — the aspect catalog that fills
> the subject chain's slots. AttributeDefinition vs Parameter (INV-2),
> the Capability mixin, Behaviors, the three designed condition tiers,
> Formulas and Constraints — each mapped onto the kernel's IS/HAS/DOES
> anatomy.

---

## 3.1 The anatomy, specialized

Volume I, Chapter 2 gave the universal subject anatomy: seven IS aspects,
six HAS aspects, one recursive DOES aspect. Module C is that anatomy
*realized for measuring instruments*. The mapping:

| Kernel aspect (family) | Module C realization |
|---|---|
| design parameters (IS) | Attributes with `origin: design-fixed`, valued as Parameters on Family/Group/Model |
| designed operating conditions (IS) | `OperatingConditionSet` — reference / rated / limiting tiers |
| promises (IS) | `origin: declared` attribute values (manufacturer ratings); envelope-shaped claims ○ |
| structure (IS) | `relationships: [{ predicate, target }]` — partOf / connectsTo ○ |
| attributes (HAS) | Attributes with `origin: test-dependent`, valued on the Sample's `test_context` |
| dimensions (HAS) | `Classification.dimensions` — exhibited classification membership |
| environmental context (HAS) | `Conditions` with `role: actual` — the D2 conditions log |
| characteristics (HAS) | Formula outputs and behavior-derived quantities (error, creep, repeatability) |
| behaviors (DOES) | `Behavior` — static / dynamic / temporal / influence-response |

The classes below are the mechanism behind these rows — plus the two rule
classes (Formula, Constraint) that make the catalog computable. Grounding:
`oiml-core-ontology.yaml` (Module C) and the R 60 profile
(`ontology-remix/OIML Recommendation Models/Ontology/R 60/`).

The twin direction adds two instrument-facing notes to this catalog
(Volume I, Chapter 14 ○), and neither is a new aspect kind. An **endpoint
declaration** is IS-level: "this instrument offers this interface" sits
next to its software identification and markings as part of what the type
*is*. **Serve bindings** are HAS-level: they bind exhibited aspects —
test-context values, classification, state — to endpoint operations, with
freshness windows declared on the binding. Both are plumbing over the
anatomy above, not additions to it.

## 3.2 AttributeDefinition and Parameter — INV-2

The schema/instance split at its sharpest (`oiml-core-ontology.yaml` —
INV-2): an attribute is **defined once** (AttributeDefinition) and
**valued per Family/Group/Model/Sample** (Parameter). The definition
carries everything except the value — field by field below, from
`data/r60/model/attributes.yaml` (e_max):

```yaml
- id: e_max
  symbol: E_max                    # print notation, kept out of the id
  name: Maximum capacity
  definition: Largest value of a quantity expressed in units of mass, which may be applied to a load cell.
  source: { doc: urn:oiml:pub:r:60-1:2021, clause: "3.5.5" }
  quantity_kind: mass
  value_type: QuantityValue
  origin: design-fixed
  scope: model
  category: metrological
```

- **`id` / `symbol`** — the id is the snake_case machine key used in bind paths, calculations and forms (`E_max` → `e_max`); the symbol is the typeset notation for rendering. Never mix the two.
- **`definition` + `source`** — the normative sentence and its clause-URN provenance. Nothing is provenance-free.
- **`quantityKind` + `valueType`** — kind from the closed registry (Chapter 1); type is `QuantityValue | string | MeasurementResult`.
- **`origin`** — `design-fixed` (set by design; R 60's E-terms), `test-dependent` (chosen under test; D-terms), or `declared` (manufacturer rating). Origin is the IS/HAS discriminator at the attribute level (§3.3).
- **`scope`** — the chain level where the value is stated (Chapter 2, §2.8).
- **`category`** — the characteristics breakdown: `metrological | electrical | dimensional | material | administrative`.
- **`irdi`** — the IEC CDD identifier, where a registry entry exists (e.g. `rated_output`), so a shared attribute is citable in an international dictionary rather than invented per package.

A **Parameter** is then only the value layer: `{ definition: ref,
category, value: QuantityValue }` — or `fields[]` for composite parameters
(named sub-values, each a QuantityValue). Because the definition is
single-sourced, the linker can check every valued parameter against its
definition's scope, kind and type.

**Derived attributes** carry OCL over sibling ids instead of a stored
value: `v_min` is `(self.e_max - self.e_min) / self.y`; `mr_max` is
`self.e_max - self.e_min`. (The profile-level form of the same idea is
the Formula class, §3.7.)

**When to add an attribute:** when a requirement binds to it, a form
captures it, a calculation consumes it, or the certificate prints it —
not for narrative content.

## 3.3 Design parameters vs exhibited attributes

The kernel's IS/HAS duality is, at the attribute level, the `origin`
decision. **`design-fixed`** values are part of the type definition —
change one and you have a different model: the IS *design parameters*.
**`declared`** values are manufacturer ratings — the parameter-valued
face of IS *promises*. **`test-dependent`** values are HAS *attributes* —
chosen and recorded under test, living on the Sample's `test_context`,
never inherited. One quantity may exist at both levels, but the *roles*
never merge — and scope keeps the two apart in the data. Verification is
the duality sentence from Volume I: *the exhibited value must satisfy the
designed claim.*

## 3.4 Capabilities — the mixin model

A **Capability** is "a static affordance: what the instrument CAN do":
`kind` (e.g. `measure`), the `measurand` it addresses, a
`measuringInterval { min, max, unit }`, optional `resolution`, and an
optional `output { protocol, signal, connector }`. In the running R 60
data, capabilities are organized as **mixins** that decide which
attributes, requirements and tests apply to a Model; the effective set is
the union over declared capabilities (`data/r60/model/capabilities.yaml`):

```yaml
- id: load-cell                 # base — all load cells
  has_parameters: [e_max, e_min, n_lc, v_min, dr, "y", z, p_lc]
  satisfies_requirements: [/req/metrological/mpe, /req/metrological/creep, ...]
  verified_by_tests: [/conf/metrological-tests/measurement-error-repeatability-mdlo, ...]

- id: electronic
  abstract: true                # blocks direct declaration
  satisfies_requirements: [/req/electronic/no-significant-faults, /req/electronic/disturbances]

- id: digital
  extends: [electronic]         # inherits parameters/requirements/tests transitively
  requires: [load-cell, electronic]   # forces co-declaration
  has_parameters: [power_voltage, interfaces, output_signal, software_identification]
```

Three composition operators do the work: `extends` (inherit
transitively), `requires` (a capability cannot be declared without its
partners), `abstract` (no direct declaration). This is the metamodel's
**OCP mechanism**, in the capability file's own words: adding a new
capability (e.g. "wireless") is additive — **new variant = new capability
= zero schema change.** In the anatomy a capability is design-level: it
says what the type *is able* to do — the affordance half of structure
(IS) — while each exercise of it is a behavior (DOES).

## 3.5 Behaviors — the instrument's DOES

A **Behavior** is "a dynamic/temporal response characteristic — what D1
requirements bind to and simulations consume" (`data/r60/model/behaviors.yaml`
— creep):

```yaml
- id: creep
  kind: temporal                 # static | dynamic | temporal | influence-response
  stimulus: force                # constant load, all else constant
  response: Change in load cell output occurring with time while under constant load ...
  source: { doc: urn:oiml:pub:r:60-1:2021, clause: "3.7.1" }
  verified_by: [/conf/metrological-tests/creep]      # R 60-2, 2.10.2
```

The `kind` taxonomy mirrors the error model of Chapter 1: static,
dynamic, temporal (creep, drift, warm-up) and influence-responses
(temperature effect on MDLO). The optional `characteristic` slot binds
the behavior to the quantity derived from its I/O (a QuantityValue or a
Formula) — the kernel's "characteristics are derived from behavior I/O"
made explicit. The `verified_by` list joins the behavior to the coverage
chain: **behavior → test → requirement**. Declare a behavior even with no
test yet: R 60's `durability` has none in R 60-2 and is deliberately left
without `verified_by` — an honest hole the coverage audit reports, not a
silent one. In kernel terms a behavior is a Process (Volume I, Chapter 4):
the abstract form is always valid; the executable form is layered on when
simulation demands it. A third form is the *served* one (Volume I,
Chapter 14 ○): the behavior made remotely invocable — the measurement
process as the archetype, invoked through the endpoint, its response
processes streaming as telemetry.

## 3.6 Operating condition sets — the designed tiers

The three VIM tiers, each a Module A `Conditions` instance
(`oiml-core-ontology.yaml` — OperatingConditionSet):

| Tier | Role | Meaning |
|---|---|---|
| `reference` | required | where specification values are valid — calibration/evaluation conditions |
| `rated` | required | the envelope where the instrument performs as designed |
| `limiting` | optional | what the instrument survives without permanent shift |

This is the IS half of the conditions duality from Chapter 1: the
*designed* envelopes, against which the run's `actual` log (HAS) is
checked. R 60's set (`data/r60/model/conditions.yaml` —
load-cell-operating-conditions) pins the reference tier at 20 °C ± 2 per
R 60-2, 2.10.1; the same file holds `common_test_conditions` (calibrated
equipment, axial loading, stabilisation) that tests reference. Errors
within the rated envelope are judged against the MPE; disturbances
outside it against fault limits — the tiers give both limit kinds their
meaning.

## 3.7 Formula — derived values, not verdicts

A **Formula** computes a value from multiple attribute paths via an OCL
derivation (`stereotype: derive`). Shape: *[multiple bound inputs ⇒ OCL ⇒
typed output]* (`oiml-r60-loadcell-profile.yaml` —
formula:r60:max-measuring-range):

```yaml
- id: formula:r60:max-measuring-range
  language: OCL                  # fixed — INV-9
  context: LoadCell
  stereotype: derive
  signature: "MR_max : Mass"
  inputs:
    - { name: E_max, binding: "self.E_max", from: attrdef:r60:E_max }
    - { name: E_min, binding: "self.E_min", from: attrdef:r60:E_min }
  expression: "self.E_max - self.E_min"
  output: { symbol: MR_max, quantityKind: qk:mass, type: Mass }
  source: { doc: rec:oiml-r60:2017, clause: "3.5.7" }
```

Two laws apply. **INV-9** — the language is OCL, always: the same
statement executes identically in D2 fact checks and D3 re-validation.
**INV-7** — a Formula's output is a **value** (QuantityValue, or
MeasurementResult over measured data), never a judgment. Formulas compute;
Constraints check; Verdicts judge. Formulas are the definitional home of
**characteristics** — error, repeatability, creep: derived from behavior
I/O, defined once in the primary model, judged by verdicts.

## 3.8 Constraint — intrinsic validity, not regulatory limits

A **Constraint** is a checkable rule over attribute values, Formula
outputs or measurements, expressed as an OCL invariant (`stereotype:
inv`) — *[multiple bound inputs ⇒ OCL ⇒ Boolean]*. Its `kind` says what
truth it guards (`ConstraintKind: invariant | domain | test-setup`), and
`violationMeaning` is required: a violated constraint must say what it
means. The discipline that matters most is the boundary with D1
(`docs/oiml-smart-modelling-methodology.md` §4.2):

> A **Constraint** (Module C) is an intrinsic *validity* rule; a
> **Requirement** (Module D1) is a regulatory *limit*. "The test was set
> up wrong" → constraint. "The instrument must be this good" →
> requirement.

The classic R 60 case is test-setup geometry (`oiml-r60-loadcell-profile.yaml`
— constr:r60:fig3-2b):

```yaml
- id: constr:r60:fig3-2b
  kind: test-setup
  stereotype: inv
  oclName: fig3_2b
  inputs: [ D_max, E_max ]       # each bound self.<path>, from its AttributeDefinition
  expression: "0.9 * self.E_max <= self.D_max and self.D_max <= self.E_max"
  output: { type: Boolean, satisfiedWhen: true }
  violationMeaning: "D_max below 90% of capacity or above capacity — test setup invalid."
```

A violated **test-setup** constraint invalidates the run *as a test*,
regardless of results — executed in D2 as a ConstraintCheck, at run time,
not judged at evaluation. This is the run-validity semantics the
conformance-test preconditions generalize (Chapter 6): a void run is a
fact about the test, never a failure of the instrument.

## 3.9 Grammar sketch *(illustrative v3 syntax)*

```prl
# defined once (INV-2) — valued per chain level as Parameters
attribute e_max {
  symbol "E_max"   name "Maximum capacity"
  definition "Largest value ... applied to a load cell."
  source "urn:oiml:pub:r:60-1:2021#clause-3.5.5"
  kind mass   value_type QuantityValue
  origin design_fixed   scope model   category metrological
}
attribute dr {
  symbol "DR"   kind mass   origin test_dependent   scope group
  derived ocl{ (self.e_max - self.e_min) / (2 * self.z) }
}
capability digital {
  extends  [electronic]
  requires [load_cell, electronic]
  has_parameters [power_voltage, interfaces, output_signal, software_identification]
  satisfies      [/req/electronic/warm-up-time]
}
behavior creep {
  kind temporal
  stimulus force                 # constant load, all else constant
  response  "change of output with time under constant load"
  source    "urn:oiml:pub:r:60-1:2021#clause-3.7.1"
  verified_by [/conf/metrological-tests/creep]
}
condition_set load_cell_operating_conditions {
  reference { temperature 20 degC ± 2 }      # designed IS tiers
  rated     { temperature -10 .. +40 degC }
  limiting  { temperature -30 .. +70 degC }
}
formula max_measuring_range context LoadCell {
  derive MR_max : Mass = self.E_max - self.E_min     # INV-7: a value, not a verdict
}
constraint fig3_2b context LoadCell kind test_setup {
  inv fig3_2b: 0.9 * self.E_max <= self.D_max and self.D_max <= self.E_max
  violation "D_max below 90% of capacity or above capacity — test setup invalid."
}
```

## 3.10 Validation rules

- **INV-2.** Every valued Parameter resolves to exactly one AttributeDefinition; the value matches the definition's `valueType`, `quantityKind`, `scope` and (for composites) its named `fields`.
- **Origin/scope coherence.** `test-dependent` values are stated at sample scope or — the declared-group-characteristic case — carry a derivation and a verification path (the `dr` pattern).
- **Capability algebra.** `extends`/`requires` graphs are acyclic and resolvable; `abstract` capabilities are never declared directly; every referenced parameter, requirement and test id exists.
- **Behavior signatures.** `kind` is one of the four BehaviorKind values; a `characteristic` reference resolves to a QuantityValue or Formula; every `verified_by` target exists (or its absence is deliberate).
- **Condition tiers.** `reference` and `rated` are required, `limiting` optional; every tier is a Module A `Conditions` instance.
- **INV-7 / INV-9.** Formula outputs are typed values via OCL `derive`; Constraint outputs are Booleans via OCL `inv`; neither judges — and `violationMeaning` is mandatory on every Constraint.

## 3.11 Summary

- Module C is the kernel anatomy realized: design-fixed attributes and condition tiers are IS; test-dependent values, dimensions and actual logs are HAS; behaviors are DOES.
- INV-2: an attribute is defined once (symbol, clause, IRDI, kind, origin, scope, category) and valued per chain level; derived attributes are OCL over siblings.
- Capabilities are mixins — `extends` / `requires` / `abstract` — and the OCP variant mechanism: new variant, zero schema change.
- Behaviors carry `kind`, stimulus, response and the `verified_by` chain into tests and requirements; uncovered behaviors are visible holes.
- Formulas compute values (INV-7), Constraints check validity (OCL `inv`), Requirements limit — three kinds of statement, three homes.
- A violated test-setup constraint voids the run, not the instrument.

*Next: [Chapter 4 — Identity and Provenance](04-identity-and-provenance.md):
Module B — manufacturer, software, markings, sealing, calibration, certificates.*
