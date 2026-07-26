# Chapter 9 — Walkthrough: R 91 and R 144 — the stress cases

> *In this chapter:* what modelling two more Recommendations — of
> different kinds — proved about the methodology, and what they forced
> into the frame. R 91 (traffic speed meters) and R 144 (gas analytical
> systems) were built with the same method as R 60, then audited
> clause-by-clause against their sources. Each case below reads the same
> way: the Recommendation's demand → the modelling answer → the
> primitive it added to the frame.

---

## 9.1 Why stress cases: the audit method

A methodology validated on one Recommendation is a hypothesis. The gap
audit (`analysis/primmel-methodology-gap-audit.md`) tested it by
actually building R 91 and R 144 with the Chapter 1–7 method and
running `primmel check` — then two deep audits swept the results
clause-by-clause against the sources (`analysis/deep-audit-r91.md`,
`deep-audit-r144.md`). Status at audit time:

| Model | Subject | Attrs | Reqs | Tests | Package validation |
|---|---|---|---|---|---|
| R 60 (load cells) | LoadCell | 38 | 60 | 62 | 0 errors |
| R 91 (traffic speed meters) | SpeedMeter | 47 | 51 | 31 | 0 errors, 26 coverage warnings |
| R 144 (gas analytical systems) | GasAnalyticalSystem | 44 | 39 | 24 | 0 errors, 12 coverage warnings |

What survived unchanged is as important as what broke: the subject
chain with INV-10 delegation, orthogonal dimensions driving
applicability, `binds_to` + OCL limits including conditionals and table
lookups, and — the OCP claim in practice — **the entire workflow and
party entity layer carried over byte-identical** (state machines,
approvals, roles). What broke is the rest of this chapter. The audits'
follow-up pass burned the findings down in the open: the 33-row
influence/disturbance table modelled (tests 31 → 54, targeting warnings
25 → 23), the six missing clause-7 subclauses modelled (requirements
51 → 57), the stationary field test landed (untargeted warnings
25 → 21).

## 9.2 R 91 — traffic speed meters

### 9.2.1 Five category axes — and the membership problem

**Demand.** R 91-1, clause 5 assigns *every* speed meter to categories
along five orthogonal axes — mode of use, installation, working
principle, triggering, cosine compensation — with a NOTE that one
instrument may hold several categories at once (stationary AND moving;
mobile AND fixed), and 6.15.2 makes the dual stationary/moving meter
normative. On top of that the taxonomy is *nested*: an average-speed
meter is a fixed-distance meter (3.3.4) and "all the requirements
specific to fixed-distance speed meters (6.12) shall be fulfilled"
(6.13).

**Answer.** Five classification dimensions
(`data/r91/model/instrument.yaml`): `mode_of_use` and
`cosine_compensation` at model scope, `installation_principle`,
`working_principle`, `triggering` at family scope — plus the certified
moving-MPE class A/B as a *group* dimension (`metrological_class`),
correctly not a sixth axis, and the OIML D 11 environment classes
H1–H3 / M2–M3 / E2–E3 (6.17.1–6.17.3) as family dimensions selecting
test severity. The nesting is data on the value:
`average-speed` declares `implies: [fixed-distance]`, source-verified
against 6.12/6.13 — category subsumption the linker checks for acyclicity
(rule `applicability-instances`).

**Primitive added.** `implies:` on dimension values (● landed); and the
multi-membership NOTE proves single-valued classification insufficient
even inside one Recommendation — set-valued dimension membership
(●, gap G9's R 91-internal instance, finding R15).

### 9.2.2 Composite and distributed instruments — the structure aspect

**Demand.** A moving speed meter is a target speed meter plus an **ego
speed meter** in one instrument — the ego is itself an instrument
(3.2.2) with its own MPE (6.15.3), its own fault limit (6.18.1), its
own field test (7.7.2) and *separate* influence/disturbance runs
(7.7.3). An average-speed meter is not a single instrument at all but
**distributed detection fields** with time synchronisation — a
measuring system (VIML 0.12).

**Answer.** The metamodel's `relationships` slot
(`partOf`/`connectsTo`) existed but was unrealized in any rec
(gap G3). The realization is in the model
(`data/r91/model/instrument.yaml`, `structure:`): `struct-moving-ego`
declares `consists_of` from MovingSpeedMeter to `ego_speed_meter` with
typed propagation (the ego's measurement up, its disturbance reaction
down — the whole's moving MPE explicitly NOT down, 6.15.3/6.18.1), and
`struct-distributed-detection-fields` declares the distributed
`detection_field` composition with its own propagation and an
applicability pin to the fixed-distance/average-speed principles. The
`ego-field-test` adds the component-level test subject
(`test_subject: { component: ego_speed_meter }`, deep-audit R14).

**Primitive added.** The **structure** IS aspect, realized (● — task
01, the kernel primitive landed with propagation rules; R 91's two
`consists_of` relations are the proving content, clause-anchored):
`partOf`/`consists_of`/`connectsTo` with typed targets and
behavior/parameter propagation rules — directly from G3.

### 9.2.3 Verification beyond type evaluation

**Demand.** R 91-1, clause 8 requires **initial verification,
subsequent verification, and in-service inspection** as distinct
conformity-assessment pathways — own tests, own conformity assessment,
own marking and securing, and validity triggers (re-verification when
tyre size changes on ego meters, 6.15.3 Note 2). R 144 has the same
shape (§7.2/7.3).

**Answer.** The type-approval workflow entities (Application → … →
Certificate of type approval) are joined by a per-rec verification
model (`data/r91/evaluation/verification.yaml`,
`data/r144/evaluation/verification.yaml`; schema
`data/schemas/verification.yaml`): per kind — initial (8.2), subsequent
(8.3), in-service inspection (8.4) — a test set that SUBSETS the rec's
conformance tests (the conformance machinery reused, never redefined),
the assessment scope, `limits.mode` (`same-as-type-evaluation` unless
the Recommendation names verification-specific limits), marking and
securing, and the validity window with re-verification triggers (the
timer = the window elapsed; the signal = an out-of-cycle event like the
6.15.3 Note 2 tyre change). Events are `VerificationRecord`s; the
sample carries `verification_state`, seals and signals; the R 91 pilot
flow (`sample-r91-vfy` + `verification.test.ts`) proves initial
verification with verdicts and marks, and the timer trigger firing on
schedule. Linker rule R22 (`verification-references`) checks every
reference.

**Primitive added (● — task 21, gap G1).** A `verification_process`
model — VIML 2.09/2.12–2.14 semantics (initial/subsequent/periodic —
the periodic case is the timer-triggered subsequent verification, not a
fourth pathway), verification records and marks (VIML 3.02/3.04 —
metamodel v0.6.1 D1 `VerificationProcess`, D3 `Verification`, B
`VerificationMark`), lifecycle machines with validity windows, and
timer-event recurrence for re-verification triggers. In the tier frame:
tertiary workflow processes beyond the type-evaluation chain, declared
in the package like everything else.

### 9.2.4 The evidence file — artifact definitions

**Demand.** R 91-1, 6.6/6.15.3/7.x mandates an **evidence file**: an
electronic artifact the *instrument* must produce per enforcement
measurement — speed, ego speed, direction, timestamps, site/alignment,
image evidence. Clause 7.3 enumerates items a–l; the test interface
(7.9) another twelve. That is 24 structured output items
(deep-audit R10) that are not lab-run records but a **required output
contract of the subject**.

**Answer.** The qualitative requirement became the IS/HAS pair of the
anatomy, shipped in the model (`data/r91/model/artifacts.yaml`):
**artifact definitions** (IS — content contract + produced-when rules)
whose fulfillment is recorded as **artifact instances** (HAS — the
produced file as evidence). The `enforcement-evidence-file` definition
carries the 7.3 a–l items as a typed `content_contract` (timestamps,
location, measurement id, measured speed, direction, …), the securing
requirement of 7.3 rides with it, and the evidence-file form +
the seeded flow record the produced instances.

**Primitive added (● — task 09, gap G2).** `artifact_definition` on the
model layer + `artifact_instance` evidence in D2. R 91 was the driver;
the concept was promoted into the v3 subject anatomy on the strength of
this demand.

**The twin angle (◐).** An artifact *definition* also tells a live twin
what to publish. On a served speed meter (Volume I, chapter 14) the
evidence file is not seized on inspection day — it is *served*:
produced per enforcement measurement, announced on the endpoint by
subscription, fetched with timestamps. The monitor's signal trigger
("an artifact arrived", §14.5 — the trigger kinds ship ●, task 34)
then evaluates the content contract on
arrival, and a missing or stale file is `indeterminate`, never a silent
pass. The G2 contract authored once is both the lab's checklist and the
twin's publication schedule. (Artifact-bearing endpoints remain ○ — no
shipped twin publishes an artifact yet.)

### 9.2.5 Test kinds: field, simulation, software

**Demand.** R 91-2's central experiment is not a chamber test: the
**metrological field test** with real traffic (clause 4 — site
selection, traffic conditions, a reference speed meter, ≥500/≥100
measurements, per-measurement MPE checks, optional error-distribution
statistics 4.7). Beyond it: **simulation** tests (simulator
characteristics are test-relevant, 5.2) and **software examination**
per OIML D 31 with mandatory vs optional items (8.3.1–8.3.5). Test
items carry obligation levels; the 33 exposures of Tables 1–2 carry
per-row verdict criteria (`I/MPE`, `D/NSFa`, `D/NSFd`, n/a).

**Answer.** The kind enum extends: `field`, `simulation`,
`software-examination` beside the R 60 five (performance, influence,
disturbance, durability, span-stability) — gap G4/G5, ● (three field,
two simulation and one software-examination tests ship in
`data/r91/specification/conformance/`). The
stationary field test now exists as data (`/conf/field/stationary-field-test`,
kind `field`): schedule constraints (4.1–4.3 site/traffic/distance),
the reference-uncertainty (4.5) and count (4.4) **preconditions** (run
validity, not verdicts), the per-measurement verdict
`lookupMPE(reference_speed, 'stationary', 1.0)`, and the 4.7 statistics
item. The 33-row influence/disturbance model carries each row's
criterion verbatim; the verdict entity stamps it (`criterion: I/MPE |
D/NSFa | D/NSFd | n/a`).

**Primitive added.** Per-kind metadata blocks (field:
site/traffic/reference; simulation: simulator spec; software: D 31
level) and test-level obligation (● — task 19: the `obligation` facet
(`mandatory` / `optional` / `conditional` + `obligation_note`) carries
R 91-2's [mandatory]/[optional] marks as data, no longer on prose).

### 9.2.6 Mixed absolute/relative MPE tiers — G12, resolved

**Demand.** Every R 91 MPE is piecewise with *mixed semantics in one
table*: a fixed absolute limit below 100 km/h, a percentage of the
measured speed above it (6.4/6.5/6.15.1/6.15.3). R 60's tier model
(`factor × multiplier`, multiplier fixed at the call site) cannot say
that — R 91's first model fell back to symbolic table text
(`"v > 100 km/h"`) no engine could evaluate.

**Answer.** An explicit `mode` on the tier
(`data/r91/specification/tables.yaml`):

```yaml
  - id: mpe_moving
    description: "MPE for moving measurements per class (R 91-1, 6.15.1)"
    rows:
      - [A, 0, 100, 3, absolute]
      - [A, 100, null, 0.03, relative]
```

`absolute` scales the call-site multiplier (R 60-compatible default);
`relative` scales the measured value. Implemented in both lookup paths
and verified at the boundary through the real profile: v = 100 → 3
(absolute tier), v = 100.1 → 3.003 (relative). The pure-relative
self-check limit (7.5: ±1 % at *all* simulated speeds) falls out as a
single `{ min: 0, factor: 0.01, mode: relative }` tier — the case the
audit called "a natural test of the tier model". The same pass rebuilt
the measurement-count table from the normative clauses (finding R4:
≥500/≥100 field, ≥500 dynamic, ≥200 moving-field, ≥10 linearity and
simulator velocities) — deleting an invented `typical/reduced/minimal`
key set that had promoted an informative gloss into pseudo-normative
data.

**Primitive added (●).** `mode: absolute | relative` on MPE tiers —
and the methodology rule it proves: when a table resists the tier
model, extend the *model*, never encode the table as prose.

## 9.3 R 144 — gas analytical systems

### 9.3.1 Set-valued measurands — and the lesson of the inverted guards

**Demand.** R 144 systems measure *component sets*: CO only, NO+NO2,
NOx as a sum channel, or combinations (R 144-1, 1.1 and 2.4 NOTE).
Requirements then apply *per component* — the CO range rule when CO is
measured, the NOx rule when NOx is measured.

**Answer.** `measurand_components` with `cardinality: set`
(`data/r144/model/instrument.yaml`), values `co / no / no2 / nox` —
with NOx first-class as a **derived measurand** (NOx = NO + NO2, its
range inheriting the component channels), replacing an earlier model
that had flattened membership into composite enum values
(`co-only / nox-only / co-nox` — combinatorial, and unable to drive
per-component requirements; gap G9). The deep audit found the two
failure modes the hard way: the one OCL expression using the set had
its guards **swapped** (CO's range check gated on `'no'`, NOx's on
`'co'` — finding F1), and the engine had no `->includes()` to execute
it with (F3). The shipped samples passed *by accident* (both guards
fired on a `[co, no]` classification): every gate green, the data
wrong.

**Primitive added (●).** The set-dimension semantics package:
set-valued membership (`cardinality: set`), collection ops
(`includes`/`includesAll`/`excludes` — executed in the engine, the F3
lesson), declared applicability matching for set keys with the
per-condition rule `match: any|all|exact` (any: intersection non-empty —
the default; all: every selected value listed; exact: mutual coverage),
per-channel evidence (`Verdict.channel_values` wired from the forms'
`component_under_test`, the F7 lesson), and a certificate label join
strategy (`co,no` needs a declared separator, not JS `toString` luck).
The burn-down (smart 21209b8) resolved every set finding — F1's swapped
guards, F3, F7, F8's missing-value policy, F10 — to an empty allowlist.

### 9.3.2 Structured interferents

**Demand.** R 144-1, 4.5.2 defines interfering components as
**(component, max concentration) pairs**, and the cross-sensitivity
test (R 144-2, 1.10) prescribes a three-gas sequence over them.

**Answer.** A structured attribute now
(`data/r144/model/attributes.yaml` — `interfering_components`):
`value_type: pair-list` with a `pair_list:` block (`key: component`,
`value: max_concentration`, `key_dimension: measurand_components`, plus
the declared component vocabulary CO₂/H₂O/SO₂/CH₄/H₂…) — each pair's
component id resolving to a measurand or a declared component (linker
rule `pair-list-components`), the concentration a QuantityValue. The
structure drives the cross-sensitivity test's gas selection (R 144-2,
1.10). The audit found the free-form precursor false-failing every
perfect instrument — the cross-sensitivity verdict comparing the
measurand signal against its own interference limit (finding F2).

**Primitive added (● — task 20, gap G10).** The pair-list value type:
schema + linker rule (TODO.roadmap/20). The F2 lesson
rides with it: when the structure is missing, the verdict math fills
the hole with something wrong.

### 9.3.3 No family clause — derive-and-annotate

**Demand.** R 144 contains no explicit "family" definition — the
R 60 walkthrough's "transcribe the criteria verbatim" step has nothing
to transcribe.

**Answer.** Derived criteria, annotated as derived
(`data/r144/model/instrument.yaml` — family): measuring principle(s)
(1.1), sampling approach (2.1, 5.1.2), gas-handling design (3.2),
adjustment means (2.7, 5.6.1), rated operating specifications (4.5.1) —
with the note on record: *"R 144 contains no explicit 'family'
definition — these criteria are derived from R 144-1, 1.1 (principle of
operation), 2.1 (system composition) and 3.2 (principal units)."* The
boundary rule is unchanged: violating a criterion means a
different family.

**Primitive added (● convention).** The methodology rule
*derive-and-annotate*: criteria are either verbatim (clause cited) or
derived (derivation annotated) — never silently invented. R 91's
family criteria took the same path.

### 9.3.4 Flows without groups or models

**Demand.** R 144 has no group concept — no "identical metrological
characteristics" sub-family level — and its certificates classify one
model configuration at a time.

**Answer.** Two seeded flows (Horiba ENDA-5000; SICK MCS100E-CO) run
family → models → samples with no group level, and the schemas were
adjusted so groups/models are optional — the subject chain tolerates
missing levels rather than forcing phantom levels into the taxonomy.

**Primitive added (●).** Chain-level optionality: the
Family → Group → Model → Sample chain is the *full* form; a
Recommendation instantiates the levels it has, and delegation
(INV-10) skips absent levels. The seed contract from Chapter 7 holds
either way: family → … → certificate, with the levels the rec has.

### 9.3.5 Reference materials: the CGM registry

**Demand.** Every R 144 quantitative test runs against Certified Gas
Mixtures — certified reference materials with identity, traceability
and uncertainty (Annex A), and a validity rule relating the material to
the requirement: U:MPE ≤ 1:3 at the test point (7.2.2.2, with an
issuing-authority 1:2 override).

**Answer.** A declared registry,
`data/r144/specification/reference-materials.yaml`: the A.1.1 identity
fields and three machine-checkable constraints — blend ≤ 10 % (A.2.2),
composition uncertainty ≤ 2 %/3 % (A.2.3), U:MPE ≤ 1:3 with the
authority override — a violation invalidating the run. Test points are
the `cgm-point` subform, now vector-shaped per channel so a
three-component exposure (CO + NO + N₂, A.1.4 NOTE) is one comparable
record instead of three serialized ones (finding F13).

**Primitive added (●).** The `reference-materials` module pattern:
certified value + uncertainty + traceability, with cross-entity
constraints evaluated before the limit — registry landed, and the
ratio rule evaluates at verdict time (`on_violation: invalidate`,
`browser/src/data/reference-materials.ts` — a violated constraint
voids the run, never fails the instrument).

## 9.4 What the stress cases forced into the frame

Each stress case left a primitive behind. The complete ledger:

| Demand (driver) | Modelling answer | Primitive | Status |
|---|---|---|---|
| Verification beyond type approval (R 91 cl. 8, R 144 §7) | tertiary workflow processes | `verification_process` + timer recurrence | ● G1 (task 21) |
| Required instrument outputs (R 91 evidence file) | IS contract + HAS instance | `artifact_definition` / `artifact_instance` | ● G2 (task 09) |
| Composite/distributed subjects (ego meter, detection fields) | structure aspect realized | `structure` block, partOf propagation | ● G3 (task 01) |
| Field/simulation/software tests (R 91-2) | kind enum + per-kind metadata | test kinds + obligation | ● G4/G5 (task 19) |
| Statistical test design (R 91-2 4.4/4.7) | counts + statistics blocks | `design.counts` + `acceptance.statistics` | ● G6 |
| Set-valued membership (R 144 sets, R 91 dual-mode) | cardinality: set + collection ops + `match:` rule | set-dimension package | ● G9 |
| Structured interferents (R 144 4.5.2) | (component, limit) pairs | pair-list value type | ● G10 (task 20) |
| Behavior-gating requirements (R 91 qualitative mandates) | bind to a behavior id | `verification: behavior-check` | ◐ G11 — the tests→behaviors direction landed (behaviors carry `verified_by`, pinned by R37, task 56; an image-based gate instance shipped, task 13 R8); the first-class requirement-side `method: behavior-check` remains ○ |
| Mixed absolute/relative MPEs (R 91) | tier `mode` | `mode: absolute \| relative` | ● G12 |
| No family clause (R 144, R 91) | criteria from scope/units clauses | derive-and-annotate | ● |
| Chain missing levels (R 144 no groups) | optional levels | delegation skips absent levels | ● |
| Certified reference materials (R 144 CGMs) | registry + validity constraints | `reference-materials` module | ● |

Two meta-lessons outweigh any row:

1. **Green gates proved nothing about data.** The deepest defects —
   swapped set guards (F1), an inverted compliance presumption (R5),
   a verdict comparing a signal to itself (F2), certificate
   characteristics pointing at another Recommendation's attribute ids
   (R2) — all shipped with passing validation. The answer is
   model-integrity validation, and it landed as linker rules
   (undefined OCL symbols, dangling certificate attributes, derivation
   shadowing, untargeted requirements). Schema validation checks
   grammar; the linker checks the model.
2. **The frame grew by demand, not by speculation.** Every primitive in
   the table exists because a Recommendation's clause forced it — and
   each was added once, in the frame, not per rec. R 144's set
   dimensions need the same `->includes()` R 91's dual-mode meter
   needs; R 91's artifact contract is R 144's "test means" disclosure.
   That is the OCP promise of Chapter 1 operating on the language
   itself.

## 9.5 Grammar sketch *(illustrative v3 syntax)*

```prl
subject SpeedMeter {
  is { structure { ego_speed_meter partOf MovingSpeedMeter }          # 3.2.2/6.15.3 ●
       artifacts  { evidence_file { produced_when enforcement_measurement
                                    contract { speed, ego_speed, direction,
                                               timestamps, site, image } } } }  # 7.3 a–l ●
  has { dimensions { working_principle : family ∈ { doppler-radar, range-finding,
                       fixed-distance, image-based, average-speed }
                     average-speed implies [fixed-distance]            # 6.13 subsumption ●
                     mode_of_use : model ∈ { stationary, moving } }    # clause 5 NOTE ● (set-valued, G9)
        artifact_instances { evidence_file } }                         # produced, recorded ●
}

conformance /conf/field/stationary-field-test {
  kind          field                                                  # G4 ●
  preconditions { reference_uncertainty_4_5, count_4_4 }               # invalid, not fail
  statistics    optional { bins, mean m, σ, z 5 }                      # 4.7 ●
  acceptance    per_measurement ocl{ abs(speed_error)
                  <= lookupMPE(reference_speed, 'stationary', 1.0) }
}

table mpe_moving { tiers { [A, 0, 100] limit 3    absolute             # G12 ●
                           [A, 100, ∞)  limit 0.03 relative } }

process initial_verification { kind verification_process               # G1 ●, VIML 2.12
                               recurrence timer (tyre_change on ego) } # 6.15.3 Note 2

dimension measurand_components { cardinality set                       # G9 ●
                                 values { co, no, no2, nox } }         # nox derived = no + no2
```

## 9.6 Validation rules

The stress cases added these checks to the linker and `primmel check`:

- `implies:` graphs on dimension values are acyclic; subsumption is
  applied when computing applicable requirements (an average-speed
  meter matches fixed-distance requirements);
- set-valued dimensions declare `cardinality: set` with declared
  applicability semantics (intersection); a *missing* value is an error
  state, never a vacuous pass (the F8 lesson); `->includes/includesAll/
  excludes` operands resolve to set-valued paths, and the expression
  must execute in the engine before the package ships (the F3 lesson);
- per-component requirements carry a channel axis; evaluation requires
  a passing verdict per channel value in the subject's set; derived
  measurands declare their derivation, with range/MPE coherence checked
  against the component channels;
- family criteria are verbatim-with-clause or derived-with-annotation —
  never unattributed;
- MPE tier tables declare `mode` per row and boundary inclusivity per
  tier (the R16 residual: engine default `[min, max)` is folklore until
  declared);
- certificate characteristics reference the rec's own attribute and
  dimension ids (R2); reference-material constraints reference declared
  materials and their evidence bindings.

## 9.7 Summary

- The methodology scaled: same chain, same layers, same OCL — and the
  workflow/party entity layer carried across byte-identical, proving
  the OCP claim on real content.
- R 91 stressed *categorization* (five axes, multi-membership,
  subsumption), *composition* (ego meter, distributed fields),
  *process scope* (verification pathways), *outputs* (the evidence
  file), and *limit semantics* (mixed MPE tiers — the one gap found
  and closed end-to-end in the audit itself).
- R 144 stressed *set-valuedness* (measurand sets, derived channels,
  per-channel evidence), *structured data* (interferent pairs),
  *missing text* (no family clause → derive-and-annotate), and
  *reference materials* (the CGM registry with validity constraints).
- Every stress case ended as a primitive in the frame — added once,
  available to every future Recommendation — and as a linker rule,
  because each class of defect first shipped green. The audits' real
  finding: schema validation validates grammar; the model needs a
  linker that validates meaning.

*Next: [Volume IV — the OIML-CS Scheme](../oiml-cs/README.md) and the
[platform annex](../platform/README.md) — the OIML-CS
certification-scheme reference package and the platform runtime the
packages run on.*
