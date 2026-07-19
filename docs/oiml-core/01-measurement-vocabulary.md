# Chapter 1 — Measurement Vocabulary

> *In this chapter:* Module A — the shared value layer of the metamodel.
> QuantityKind and Unit, the QuantityValue workhorse (INV-1), GUM
> uncertainty, measurands and influence quantities, the four condition
> roles, and what a complete measurement result is made of.

---

## 1.1 The shared value layer

Every module of the metamodel deals in numbers: design parameters, test
stimuli, evidence values, limits, verdict facts. Module A exists so that
**every number anywhere in the system is expressed through the same nine
classes** (`oiml-core-ontology.yaml` — measurement-vocabulary: "Shared
value layer"). It is the only module that **depends on nothing** — the
value layer cannot afford imports, because everything imports it.

Module A is the OIML realization of the kernel's data-and-value
primitives (Volume I, Chapter 6), and it is deliberately conservative:
every class is anchored to an international authority — the VIM for
quantity concepts, the GUM for uncertainty, the SI for units. A
metrology-specific model invented none of them; it typed them.

| Class | Authority | Status |
|---|---|---|
| QuantityKind, Unit | VIM 1.1; SI | ● |
| MeasurementUncertainty | GUM | ● schema · ◐ runtime adoption |
| QuantityValue | — | ● |
| Measurand, InfluenceQuantity | VIM 2.3, 2.52 | ● |
| Conditions (ConditionRole) | VIM reference/rated/limiting + `actual` | ● |
| MeasurementResult, TraceabilityChain | VIM 2.9, 2.41 | ● schema · ◐ runtime (per-equipment certificates) |

## 1.2 QuantityKind and Unit

A **QuantityKind** is "a kind of quantity that can be measured" (VIM
1.1): mass, force, temperature, humidity. It carries an optional
`dimensionVector` (e.g. `M·L·T⁻²` for force) and an optional reference to
its SI coherent unit. Kinds come from a **closed registry**
(`data/schemas/quantity-kinds.yaml`, mirrored into the engine) — not from
free text — because the linker checks comparison coherence on *kinds*,
not on unit strings: an OCL expression comparing `mass` to `temperature`
is a static error, wherever it appears.

A **Unit** is a unit of measure with an explicit path to the SI:

```yaml
- { id: kg,   label: "kilogram", symbol: kg, quantity: mass }
- { id: degC, label: "degree Celsius", symbol: "°C", quantity: temperature }
- { id: v,    label: "verification interval", symbol: v, quantity: "load cell verification" }
```

(`data/r60/value-types.yaml` — unit register.) The metamodel fields are
`symbol`, `quantityKind` (required reference), `siBaseExpression` (e.g.
`kg·m·s⁻²`) and a required `conversionFactorToSI` — so any two values of
the same kind are commensurable by arithmetic, not by convention. Two
rules from the R 60 build are worth internalizing:

- **Units are registered before use.** Authoring checklist item 11:
  "Register new units in `value-types.yaml` before using them" — the
  validator rejects unregistered unit ids.
- **Unit slots take unit ids only.** `v_min` (an *attribute*) was once
  misused as a unit on eight form fields; the fix established the rule
  that unit positions hold register ids (`v`, `counts`, `degC`), never
  attribute ids.

## 1.3 QuantityValue — the workhorse

```yaml
QuantityValue:
  value:        decimal | string      # required
  unit:         ref Unit              # absent only for dimensionless/string values
  quantityKind: ref QuantityKind      # kind of the quantity
  uncertainty:  ref MeasurementUncertainty
  tolerance:    decimal
```

This is INV-1 made flesh: **no bare numbers** — every physical quantity
is a QuantityValue (value + unit, optionally + uncertainty + tolerance).
Attribute values live in `map<attribute_id, QuantityValue>` maps
(`model.parameters.e_max`, `sample.test_context.d_max`), never in
dedicated entity fields and never as raw scalars.

Three design notes:

- **`unit` is optional on purpose** — but only for dimensionless and
  string values. A mass without a unit is a schema violation; a string
  designation with a unit is one too.
- **`quantityKind` travels with the value** so that coherence checking
  does not depend on the unit string (§1.2): `500 kg` and `0.5 t` are the
  same kind and comparable; `500 kg` and `500 degC` are not.
- **`tolerance` is a first-class field**, not a footnote — condition
  entries (§1.6) are where it earns its keep: `20 °C ± 2` is one value,
  not two.

R 60 example — the model-scope design parameter `E_max`
(`data/r60/model/attributes.yaml` — e_max, `quantity_kind: mass`,
`unit: kg`): valued on a Model as `model.parameters.e_max = { value:
500, unit: kg, quantityKind: mass }`.

## 1.4 MeasurementUncertainty — the GUM fields

```yaml
MeasurementUncertainty:
  standardUncertainty:  decimal   # u
  expandedUncertainty:  decimal   # U — required
  coverageFactor:       decimal   # k, typically 2 — required
  coverageProbability:  decimal   # typically 0.95
  unit:                 ref Unit  # required
```

The shape follows the GUM (OIML G 1-100): an **expanded uncertainty** `U`
is mandatory and is what a QuantityValue carries; the **standard
uncertainty** `u`, the coverage factor `k` (U = k·u, typically k = 2) and
the coverage probability (typically 0.95) complete the statement. The
`unit` is required on the uncertainty itself — an uncertainty is a
quantity, so INV-1 applies to it recursively.

Status honesty: the class is ● as schema; its systematic runtime adoption
(uncertainty carried on every evidence value, uncertainty-considered
flags on verdicts) is ◐ — the uncertainty machinery that exists today is
the decision-rule side (guarded acceptance bands, `uncertaintyConsidered`
on Verdict), developed in Chapters 6–7.

## 1.5 Measurand and InfluenceQuantity

A **Measurand** is "the quantity intended to be measured" (VIM 2.3) —
modelled not as a bare kind but as *a QuantityKind in a specific
context*: `quantityKind` + `description` + the list of influence
quantities that bear on it. For R 60 the measurand is force applied to
the cell, expressed in units of mass (`measurand_kind: force` on the
subject type, with output in mass units).

An **InfluenceQuantity** is a quantity that "does not affect the
measurand itself but affects the relation between indication and
measurement result" (VIM 2.52) — temperature, barometric pressure,
supply voltage. Its decisive design point is the `roles` map: **the role
depends on where the quantity's value sits relative to the instrument's
condition tiers** (§1.6):

| Role | Where the value sits | How the response is judged |
|---|---|---|
| `influence-factor` | within **rated** conditions | against the MPE |
| `disturbance` | outside rated, within specified limits | against fault limits |

This is the metrological error model in two rows, and it is what the
conformance-test taxonomy (`performance | influence | disturbance |
durability | span-stability`) maps onto — an *influence* test moves an
influence factor inside the rated envelope; a *disturbance* test applies
a disturbance outside it. Same quantity, different role, different limit.
(Chapter 3 returns to the tiers; Chapters 5–7 to the tests and verdicts.)

## 1.6 Conditions — named sets, four roles

```yaml
Conditions:
  id:      uri
  role:    ConditionRole        # reference | rated | limiting | actual
  entries: [ { quantityKind, value, unit, tolerance? } ]
```

A `Conditions` instance is a **named set of influence-quantity values**
— nothing more. Its power is the `role`, and the fact that *one value
structure* serves all four roles (`oiml-core-ontology.yaml` —
Conditions: "Reused for reference/rated/limiting tiers
(instrument-description), enforced conditions (D1), logged conditions
(D2)"):

| Role | Meaning | Where it lives |
|---|---|---|
| `reference` | where specification values are valid — calibration/evaluation conditions | Module C design tiers; enforced by tests |
| `rated` | the envelope where the instrument performs as designed | Module C design tiers |
| `limiting` | what it survives without permanent shift | Module C design tiers |
| `actual` | what the unit *actually experienced* during a run | Module D2 conditions logs |

The first three are **designed** envelopes — IS aspects (Chapter 3,
OperatingConditionSet). The fourth is **observed** — a HAS aspect, the
environmental context of a specific run. That one structure in two aspect
roles is the metamodel's concrete encoding of the kernel's **IS/HAS
duality**: designed vs exhibited, same value shape, never the same slot.
A test then says the one sentence verification needs: *hold the actual
conditions (HAS) within the designed envelope (IS)* — R 60's reference
conditions, for instance, pin temperature at `20 °C ± 2` with ±0.5 °C
stability during a test (`data/r60/model/conditions.yaml` —
load-cell-reference-conditions, per R 60-2, 2.10.1).

## 1.7 MeasurementResult and TraceabilityChain

A **MeasurementResult** is the complete statement of one measurement:
`measuredValue` (a QuantityValue) + `measurand` + the `conditions` under
which it was obtained + `timestamp` + `traceability`. Nothing less is a
result; a value without its conditions and traceability is a reading, not
a measurement. Module D2's evidence composes exactly these parts (the
EvidenceRecord carries value, conditions log and timestamp), and the
measured `dr` of R 60 is annotated as "a D2 MeasurementResult"
(`data/r60/model/attributes.yaml` — dr, note).

A **TraceabilityChain** is the "unbroken chain of comparisons to SI"
(VIM 2.41): an ordered list of links — primary standard → reference →
working standard → instrument — where each link carries `{ standard,
lab, certificate }`. The chain is only as strong as its weakest link, so
the model makes the links explicit and ordered rather than implied. In
the running system, per-run equipment carries calibration-certificate
references (`data/r60/entities/test-execution.yaml` — TestRunEquipment);
the fully composed chain object per result is the ◐ part of §1.1's
table.

## 1.8 Grammar sketch *(illustrative v3 syntax)*

```prl
quantity_kind mass { dimension "M"  si_unit kg }
unit  kg   of mass { symbol "kg"  si "kg"            factor 1 }
unit  degC of temperature { symbol "°C" si "K"       factor 1 }   # offset handled by the register
unit  v    of load_cell_verification { symbol "v" }               # rec-defined kind, no SI path

uncertainty u_cal {
  expanded 0.05 kg   standard 0.025 kg
  coverage_factor 2  coverage_probability 0.95
}

conditions load_cell_reference_conditions role reference {
  temperature 20 degC ± 2        # value + tolerance, one entry
}

measurand applied_load {
  kind mass
  influence temperature      role influence-factor   # within rated
  influence barometric       role influence-factor
  influence supply_voltage   role disturbance        # outside rated → fault limits
}

measurement_result {
  value        499.97 kg ± u_cal
  measurand    applied_load
  conditions   load_cell_reference_conditions   # actual log at run time
  timestamp    2026-05-11T14:32:00Z
  traceability chain { primary -> reference -> working -> this_instrument }
}
```

## 1.9 Validation rules

- **INV-1.** No bare numbers: every physical value is a QuantityValue;
  unit-less values must be dimensionless or strings.
- **Closed kinds and registered units.** `quantityKind` resolves to the
  quantity-kinds registry; `unit` resolves to the unit register; the
  unit's `quantityKind` must equal the value's.
- **Comparison coherence.** OCL operands of different kinds are a static
  error (checked on kinds, not unit strings).
- **Uncertainty completeness.** `expandedUncertainty`, `coverageFactor`
  and `unit` are required; k ≈ 2 / p ≈ 0.95 is convention, not default —
  the values are stated, not assumed.
- **Condition roles.** `role` is one of the four ConditionRole values;
  entries are QuantityValues (tolerance optional); designed tiers and
  actual logs are different *instances*, never the same record.
- **Traceability order.** Chain links are ordered primary → … →
  instrument; every link names standard, lab and certificate.

## 1.10 Summary

- Module A depends on nothing and is used by everything: nine classes,
  all anchored to VIM/GUM/SI.
- INV-1: every physical quantity is a QuantityValue — value + unit (+
  uncertainty + tolerance); kinds come from a closed registry, units from
  a register with SI conversion.
- Influence quantities have *roles*, not fixed natures: influence-factor
  within rated conditions (judged vs MPE), disturbance outside them
  (judged vs fault limits).
- `Conditions` is one structure in four roles — reference/rated/limiting
  designed (IS), actual observed (HAS): the IS/HAS duality encoded in
  data.
- A MeasurementResult = value + measurand + conditions + time +
  traceability chain to the SI; anything less is a reading.

*Next: [Chapter 2 — The Subject Chain](02-subject-chain.md): Family →
Group → Model → Sample, and the delegation law that resolves their
attributes.*
