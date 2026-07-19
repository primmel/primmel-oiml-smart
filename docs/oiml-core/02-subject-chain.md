# Chapter 2 — The Subject Chain

> *In this chapter:* Module C's core — the chain Family → Group → Model →
> Sample, its VIML anchors, the Classification record, the attribute
> scope decision table, the independence of scope and origin, delegation
> (INV-10), and why sample selection runs per group.

---

## 2.1 The chain and its VIML anchors

Volume I, Chapter 3 established instantiation as a kernel relation: a
Sample is an instance of a Model; definition and instance never mix in
one element. This chapter is the OIML realization of that relation — the
concrete subject chain of legal metrology, every level anchored to a
VIML clause:

```
MeasuringInstrumentModelFamily (VIML 4.02)
  └── MeasuringInstrumentModelGroup   (domain level — not VIML)
        └── MeasuringInstrumentModel  (VIML 4.06, "type" — CENTRE of conformity)
              └── MeasuringInstrumentSample (VIML 4.09 — one physical unit)
```

The anchors are normative, not decorative:

- **Family** (VIML 4.02) — instruments "belonging to the same
  manufactured type within the same category, sharing design features and
  metrological principles but possibly differing in some metrological and
  technical performance characteristics, as defined in the relevant
  Recommendation".
- **Model** (VIML 4.06) — the 'type': "definitive model ... of which all
  of the elements affecting its metrological properties are suitably
  defined".
- **Sample** (VIML 4.09) — a specimen of an identified Model; "called
  'sample' in Recommendation test procedures".
- **Group** has *no* VIML anchor on purpose: it is the Recommendation's
  own intermediate level (R 60-1, 3.4.2 "load cell group"). Use it only
  when your Recommendation defines an inner family; otherwise omit it.

## 2.2 The abstract root: MeasuringInstrument

All four chain classes extend one abstract root
(`oiml-core-ontology.yaml` — MeasuringInstrument, VIML 0.10). It has **no
direct instances**: every concrete subject is a Family, Model or Sample,
or a domain-profile subclass of those (R 60's `LoadCell extends
MeasuringInstrumentModel`). The root is where the shared aspect slots
live — what any instrument HAS:

```yaml
MeasuringInstrument (abstract):
  id, class                    # class = subject type from a domain profile
  classification, capabilities, behaviors, conditionSets, parameters
  relationships: [ { predicate, target } ]   # partOf, connectsTo
```

Every level of the chain is therefore a full subject: a Family has
parameters, a Model has behaviors, a Sample has a classification. Chapter
3 fills these slots; this chapter is about the chain itself.

## 2.3 Family and family criteria

A Family `HAS MANY` Models; its classification and parameters act as
**defaults inherited by its Models** (INV-10, §2.10). Beyond the shared
slots it adds `familyDesignation`, a `manufacturer` reference into Module
B (the sanctioned back-edge — Chapter 4), and `familyCriteria`: the
grouping rule, transcribed verbatim from the Recommendation. R 60's are
R 60-1, 3.4.2 (a)–(f) (`data/r60/model/instrument.yaml` —
family_criteria): same material or combination of materials; same design
of the measurement technique; same method of construction; same set of
specifications; and so on.

The criteria are a decision procedure, not prose:

> A candidate model violating any criterion is a **different family** — a
> separate application and a separate type evaluation, not another group.

Getting this boundary wrong is expensive in both directions: split a
family and you multiply certification work; merge two and the type
evaluation claims more than it tested.

## 2.4 Model groups: the Recommendation's inner level

A family spans capacities × metrological characteristics; each block of
identical characteristics is a **group**. R 60 declares what must be
identical (`data/r60/model/instrument.yaml` — model_groups):

```yaml
model_groups:
  identical_characteristics: [ metrological_class, n_lc, y, z, temperature_rating ]
  identical_attributes:      [ accuracy_class, n_lc, y, z, t_min, t_max ]
```

Two consequences:

- **Within a group, Models differ only by `e_max`** (R 60-2, Annex D).
  That is what makes a group the unit of sample selection (§2.11): test
  one capacity per block and the evaluation covers the block.
- **Groups carry the compact label** — `group_label` e.g. `C6` (class C,
  n_lc 6000) — which the certificate reuses as its dimension label
  (`data/r60/evaluation/certificate-template.yaml` — dimension_labels
  pattern `{accuracy_class}{n_lc_thousands}`).

**Groups vs separate families:** family criteria hold ⇒ one family split
into groups; any criterion differs ⇒ separate families. Never use a group
to paper over a family-criterion change.

## 2.5 Model — the centre of conformity

The Model is where conformity happens, and the metamodel says so in
three clauses: Recommendations **target** domain-profile subclasses of
this class; it **instantiates** into Samples that get tested; type
approval **certifies the Model, never an individual unit**
(`oiml-core-ontology.yaml` — MeasuringInstrumentModel). Its own fields
are the identity spine: `modelDesignation`, `manufacturer` (Module B),
optional `family`, `hardwareRevision`, and `typeApprovalRef` — a
reference to a Module B Certificate, **filled only after D3 approval**.
The `samples` list is derived: all Samples whose `model` reference
resolves here.

## 2.6 Sample — the canonical instance

A Sample is one physical unit. It carries what is true of *this unit and
no other*: `serialNumber`, `manufacturingDate`, optional
`currentLocation`, and a `custody` chain (`{ from, to, timestamp }` per
handoff). Its metrological content splits by the delegation law:

- it **carries the test-dependent attribute values** of the unit under
  test — the sample-scope attributes (`d_min`, `d_max`, `v`, `n`, `mr`,
  `conversion_factor_f`) live on its `test_context` and are *never
  inherited*;
- **everything else resolves through its Model** (INV-10).

Tests run on Samples (D2), verdicts judge Samples, and type conformity is
established *across* Samples (INV-6: one Sample = one TestReport = one
SampleEvaluation; only TypeEvaluation synthesizes across them).

## 2.7 Classification and dimensions

Every subject carries one **Classification** record — its position in
the design space:

```yaml
Classification:
  measurandKind:     ref QuantityKind   # required — what it measures
  operatingPrinciple, applicationDomain, metrologicalClass
  dimensions:        map                # domain-provided classification axes
```

The `dimensions` map is where applicability comes from. R 60's axes
(`data/r60/model/instrument.yaml`): `technology` (scope family),
`humidity_class` (family), `accuracy_class` (group), `load_type` (group),
plus `construction`. Each axis declares its enum values and a **scope** —
the chain level at which it is set — and per-value payload hangs off the
enum entries (`n_lc_limits: { lower: 500, upper: 10000 }` on class C,
from R 60-1, Table 1). Every axis is mirrored as an attribute with
`is_dimension: true` + `enum: <axis id>` so that requirement
`applicability` blocks and form `bind:` paths (`group.classification.
accuracy_class`) reference one uniform namespace. Note the division of
labour: dimension *values* come from the domain profile; the
family/group/model hierarchy itself is expressed by real references on
the chain, **not** inside Classification.

## 2.8 Attribute scope — the decision table

Every attribute declares a `scope`: the chain level at which its value is
stated. The decision table, with R 60's population
(`docs/oiml-smart-modelling-methodology.md` §3.4):

| scope | rule | R 60 examples |
|---|---|---|
| **family** | constant for every model (family criteria, shared specs) | `e_min`, `p_lc`, `t_min`/`t_max`, `rated_output`, impedances, excitation, `safe_overload`, `transducer_material`; dims `technology`, `humidity_class`, `construction` |
| **group** | identical across one matrix sub-family | `accuracy_class`, `n_lc`, `v_min`, `y`, `z`, `dr`, `mpe`, `construction_type`; dim `load_type` |
| **model** | distinguishes one catalog model | `e_max`, `mr_max`, `warm_up_time`, `power_voltage`, `interfaces`, `output_signal`, `software_identification` |
| **sample** | chosen under test — never inherited | `d_min`, `d_max`, `v`, `n`, `mr`, `conversion_factor_f` |

Scope is what makes bind paths type-check: `model.parameters.e_max` is
legal; `sample.test_context.e_max` is a linker error.

## 2.9 Scope vs origin — decide independently

`origin` says **where the value comes from** (`design-fixed` — set by
design, R 60's "E-terms" above the Figure 3 line; `test-dependent` —
chosen under test, the "D-terms"; `declared` — a manufacturer rating).
`scope` says **where it is stated**. The two usually align — and the one
case where they do not is the reason they are separate fields:

> `dr` (minimum dead load output return) is `origin: test-dependent` with
> `scope: group` — a *declared group characteristic* (derived as
> `(e_max − e_min) / (2·z)`) that is *verified per sample* by the DR
> test; the measured value is a D2 MeasurementResult.
> (`data/r60/model/attributes.yaml` — dr, note.)

Had scope been inferred from origin, `dr` would have been forced onto
samples and the group-level claim would have no home. Decide the two
independently; the linter checks each on its own terms.

## 2.10 Delegation — INV-10

The resolution law (`oiml-core-ontology.yaml` — INV-10):

> **Encapsulation by delegation:** a Sample resolves attributes through
> its Model, a Model through its Family; a value set at a lower level
> overrides the inherited one. Attribute values are **never copied
> downward**.

Ask a sample for `E_max` and the answer walks upward Sample → Model →
(Group) → Family until a level states the value. Copy-down is forbidden
because it is the classic source of stale duplicates: change the model's
design value and every copied sample record lies. Override is legal and
*visible* — an explicitly stated lower value shadows the inherited one,
and the shadowing is itself data. Scope tells you which levels *may*
state a value; delegation tells you how unstated values resolve.

## 2.11 Sample selection per group

Because a group's members differ only by `e_max`, selection runs **per
group**, not per model — and the algorithm is data
(`data/r60/evaluation/sample-selection-rules.yaml`, encoding R 60-2, 2.4
+ Annex D):

```yaml
- id: D.2.2-smallest-per-group
  step: D.2.2
  rule: "For each MeasuringInstrumentModelGroup, identify the model with the smallest e_max"
  selector: "MIN(e_max) GROUP BY group_id"
```

Around this anchor: a merit walk (class → n_lc → v_min) picking 5–10×
capacity steps, same-capacity de-duplication across groups,
partial-evaluation flags (lower v_min / higher Y ⇒ extra temperature-MDLO
and barometric tests), and single picks for the humidity and digital
tests. Get the taxonomy right and the selection procedure is a query over
it — the subject chain doing the work that prose makes a committee do.

## 2.12 Grammar sketch *(illustrative v3 syntax)*

```prl
subject_chain load_cell {
  family LoadCellFamily {
    viml "4.02"
    designation   "ACME strain-gauge family"
    manufacturer  ref ACME                        # -> Module B (ch. 4)
    criteria from "urn:oiml:pub:r:60-1:2021#clause-3.4.2"   # (a)–(f), verbatim
    classification { measurand_kind force; technology strain_gauge; humidity_class CH }
  }
  group C6 in LoadCellFamily {
    identical_characteristics [ metrological_class, n_lc, y, z, temperature_rating ]
    label "C6"                                    # class C, n_lc 6000
    classification { accuracy_class C; load_type compression }
  }
  model ACME_LC_500 in C6 {
    viml "4.06"                                   # the 'type' — centre of conformity
    parameters { e_max = 500 kg }                 # model scope, design-fixed
    type_approval ref Certificate?                # filled after D3 approval
  }
  sample sn_0042 of ACME_LC_500 {
    viml "4.09"
    serial_number "SN-0042"
    test_context { d_min = 20 kg; d_max = 400 kg }  # sample scope, never inherited
    # e_max resolves by delegation: sample -> model (500 kg)   INV-10
  }
}
```

## 2.13 Validation rules

- **VIML anchoring.** Family, Model and Sample carry their VIML clause
  anchors; Group is used only when the Recommendation defines an inner
  level.
- **INV-10.** Attribute resolution delegates upward; no attribute value
  is copied to a lower level; overrides are explicit.
- **Scope discipline.** A value is stated only at its attribute's scope
  (no `sample.test_context.e_max`); sample-scope attributes are never
  inherited.
- **Scope/origin independence.** `origin` and `scope` are validated separately (the `dr` case is legal).
- **Group coherence.** Models in one group agree on the declared `identical_characteristics` / `identical_attributes`; any family-criterion difference implies a different family.
- **Chain references.** `Model.family`, `Sample.model` and
  `Model.typeApprovalRef` resolve; `typeApprovalRef` is set only from D3.

## 2.14 Summary

- The chain is Family (VIML 4.02) → Group (domain level) → Model (VIML
  4.06, the 'type') → Sample (VIML 4.09), all extending the abstract
  VIML 0.10 root.
- The Model is the centre of conformity: targeted, instantiated,
  certified — never the individual unit.
- Family criteria are a decision procedure; groups are blocks of
  identical characteristics differing only by `e_max`; the group is the
  unit of sample selection.
- Scope (where stated) and origin (where from) are independent axes —
  the `dr` case proves why.
- INV-10: values resolve upward by delegation and are never copied down;
  lower overrides shadow, visibly.

*Next: [Chapter 3 — Instrument Aspects](03-instrument-aspects.md): the
attributes, capabilities, behaviors, conditions, formulas and constraints
that fill the chain's slots — the instrument IS/HAS/DOES catalog.*
