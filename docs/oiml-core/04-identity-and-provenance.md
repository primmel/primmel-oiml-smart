# Chapter 4 — Identity and Provenance

> *In this chapter:* Module B — everything that *names* things beyond the
> subject chain itself: the manufacturer, legally-relevant software,
> markings, sealing, calibration events, and the certificate. Plus the
> module's dependency rule and the one sanctioned cycle in the metamodel.

---

## 4.1 What Module B is for

The subject chain (Chapter 2) says what an instrument *is*; Module B says
*whose* it is, *what software* it runs, *how it is marked and sealed*,
*when it was calibrated*, and *what conformity it has earned*. In the
metamodel's own words: "Everything that NAMES things beyond the subject
chain itself ... The subject chain lives in instrument-description; this
module's artifacts reference it" (`oiml-core-ontology.yaml` —
identity-provenance).

In kernel terms, Module B realizes the IS **provenance** aspect — the
pedigree of the subject: manufacturer, source clauses, supersedes chains,
legally-relevant software identity — plus the legally-relevant identity
artifacts (markings, seals) and the conformity artifact (the
certificate). Six classes, all ● in the metamodel v0.5.0:

| Class | What it names | Anchors to |
|---|---|---|
| Manufacturer | the responsible organization | — |
| SoftwareComponent | legally-relevant software of a Model | C (Model), OIML D 31 |
| Marking | datasheet/inscription of a Model | C (Model) |
| Sealing | protection against unauthorized modification | C (Model), D1 (Recommendation) |
| CalibrationRecord | one calibration event | C (Sample), A (TraceabilityChain) |
| Certificate | the conformity artifact | C (Model/Sample), D1, D3 |

## 4.2 The dependency rule and the sanctioned cycle

Module B is the one place where the metamodel relaxes its own
acyclicity — and says so explicitly (`oiml-core-ontology.yaml` —
dependencyRules):

> **identity-provenance depends on A and C** — its artifacts NAME
> subjects (Model/Sample) defined in C. The C → B back-edge
> (`Model.manufacturer`) is the only sanctioned cycle.

The logic: a Certificate must reference the Model it certifies, a
CalibrationRecord the Sample it calibrates, a Marking the Model it
inscribes — so B points at C. But an instrument that cannot name its
manufacturer is not legally identifiable — so C points back at B,
exactly twice: `MeasuringInstrumentModelFamily.manufacturer` and
`MeasuringInstrumentModel.manufacturer`. Those two references are the
whole cycle, and they are sanctioned because the alternative — duplicating
organization data inside C — is worse than the cycle. Every other
cross-module edge follows the strict law (Chapter 0, six-modules
diagram).

And one flow rule closes the loop with the conformity modules:

> **Certificates flow one way: D3 issues → B stores → C displays via
> Marking.**

D3's TypeApprovalDecision issues the certificate (Chapter 7); B is where
the artifact lives (§4.8); C surfaces it — `Model.typeApprovalRef` is
"filled after D3 approval", and the instrument's marking is the legal
display channel. No module ever writes backwards.

## 4.3 Manufacturer

```yaml
Manufacturer:
  id, legalName                 # required
  address, trademark            # optional
```

Deliberately thin: "an organization responsible for the instrument". Its
weight comes from being the *target* of the sanctioned back-edge — every
Family and every Model references one — and from being the party the
EvaluationReport is `issuedTo` (D3). In the running system it is a stored
entity (`data/r60/entities/parties.yaml` — Manufacturer, "metamodel
Module B Manufacturer"), alongside the other workflow parties (issuing
authorities, test laboratories — including manufacturer-owned labs,
flagged `lab_kind: manufacturer_test_lab` with a mandatory parent
reference). Chapter 8 develops the full party model.

## 4.4 SoftwareComponent — the D 31 identity

Modern instruments are part software, and legal metrology needs to know
*which* software it approved. OIML D 31 supplies the concepts; Module B
supplies the record:

```yaml
SoftwareComponent:
  model:              ref C.MeasuringInstrumentModel   # required
  version:            string                           # required
  legallyRelevant:    boolean                          # required
  checksum:           string
  identificationMethod: string
```

The decisive field is `legallyRelevant`: only legally-relevant software
falls under type-approval control — a change to it is a change to the
type; a change to anything else is not. `version`, `checksum` and
`identificationMethod` make the identity checkable at examination time.
In the anatomy this is provenance at the software layer: the kernel's IS
provenance aspect lists "legally-relevant software identity" explicitly.
R 60 surfaces it as the model-scope attribute `software_identification`
(Chapter 2, §2.8); the D 31 *test* family (separation of legally-relevant
parts, software identification, fault detection) is one of the planned
shared modules (`software-d31`, Chapter 10).

## 4.5 Marking

```yaml
Marking:
  model: ref C.MeasuringInstrumentModel
  items: [ { content, location } ]
  nameplateSpec: string
```

A marking is the datasheet/inscription of a Model: not just *what* must
be written but *where* — the `location` is legally positioned (a
nameplate, a non-removable surface, a software-displayed identification).
This is the display half of the certificate flow: the type-approval
designation an instrument bears is a marking item whose content traces to
a stored Certificate. Examination checks the instrument against its
Marking; the Recommendation's marking requirements (D1) constrain what
`items` must contain.

## 4.6 Sealing

```yaml
Sealing:
  model: ref C.MeasuringInstrumentModel
  seals: [ { protects, means, location } ]
  requiredBy: ref D1.Recommendation
```

Sealing is "means protecting against unauthorized modification,
readjustment, removal of parts or software" (VIML 2.20). Each seal record
says what it `protects` (a component, an adjustment, the software), by
what `means` (physical seal, electronic seal, password), and `where`.
The optional `requiredBy` reference closes the loop with D1: sealing
*requirements* live in the Recommendation; the Sealing record is the
design that answers them — which is why B may reference D1 here even
though its stated dependencies are A and C: the reference is to the
requirement that mandates the seal, a naming relation, not a bind.

## 4.7 CalibrationRecord

```yaml
CalibrationRecord:
  sample: ref C.MeasuringInstrumentSample    # required
  date, lab, certificate                     # required
  result, traceability, nextDue              # optional
```

One calibration event for one Sample — note the level: calibration
happens to *units*, so the anchor is the Sample, not the Model. The
`traceability` reference is Module A's TraceabilityChain (Chapter 1,
§1.7): the record claims not just that the unit was calibrated but
*through which chain to the SI*. `nextDue` is where the metamodel meets
the calendar — calibration is recurrent, and the record carries the
validity window that subsequent verification will check.

## 4.8 Certificate — the conformity artifact

```yaml
Certificate:
  id, kind: CertificateKind          # type-approval | verification | calibration
  subject: ref C.Model | C.Sample    # required
  issuingBody: string
  basisRecommendation: ref D1.Recommendation
  evaluationRef: ref D3.TypeEvaluation | D3.TypeApprovalDecision
  issueDate, validUntil
```

The certificate is the artifact conformity assessment exists to produce —
"issued by D3, stored here". Three fields tell its whole story:

- **`kind` and `subject` together encode the level of the act.** A
  *type-approval* certificate has a **Model** as subject (type approval
  certifies the type, never an individual unit — Chapter 2, §2.5);
  *verification* and *calibration* certificates have **Samples**.
- **`basisRecommendation`** names the requirement set it certifies
  against.
- **`evaluationRef`** is the traceability spine of the judgment: the
  certificate points back to the TypeEvaluation or TypeApprovalDecision
  that justified it, so the chain certificate → decision → evaluation →
  verdicts → evidence is walkable in both directions (INV-5's
  re-runnability, applied to the artifact itself).

In the running system the certificate is a workflow entity with an annex
(`data/r60/entities/workflow.yaml` — Certificate, CertificateAnnex), its
scope is the application's family × class matrix (or the amended outcome
of a conditional evaluation), and its number and dimension labels come
from the certificate template (`data/r60/evaluation/certificate-template.yaml`
— `number_format: "{shortName}/{edition}-{scheme}-{authority}-{year2}.
{seq}"`, `dimension_labels` pattern `{accuracy_class}{n_lc_thousands}` —
the `C6` group label of Chapter 2 surfacing on the legal document). On
approval, `Model.typeApprovalRef` is filled: the sanctioned flow D3 → B →
C, completed.

**A note on the passport** (Volume I, Chapter 14 ○): the model-native
passport is the public *projection* of this identity layer — manufacturer,
software identity, markings — served from the instrument's endpoint. It
is not a certificate. The Certificate remains the legal artifact: issued
by D3, basis-bound, spine-walkable. The passport projects what the
instrument *is*; the certificate attests what it has *earned*.

## 4.9 Grammar sketch *(illustrative v3 syntax)*

```prl
manufacturer ACME {
  legal_name "ACME Wägetechnik GmbH"
  trademark  "ACME"
}

software lc_firmware on model ACME_LC_500 {      # OIML D 31 identity
  version "3.2.1"   legally_relevant true
  checksum "sha256:9f2c…"   identification_method "menu 4.1 display"
}

marking for ACME_LC_500 {
  item { content "Type ACME-LC-500, C6"  location nameplate }     # R 60: /req/technical/mandatory-markings
  item { content "Type-approval DE-26-041" location nameplate }   # <- D3 issued, B stored
  item { content "E_max = 500 kg"        location datasheet }
}

sealing for ACME_LC_500 {          # required_by is optional — the D1 requirement that mandates it
  seal { protects "calibration jumper"  means physical_wire  location housing_cover }
  seal { protects "legally-relevant software" means checksum_display location menu_4_1 }
}

calibration_record for sample SN_0042 {
  date 2026-03-14   lab "PTB 1.12"   certificate "PTB-26-11843"
  traceability chain { primary -> reference -> working -> SN_0042 }
  next_due 2028-03-14
}

certificate DE_26_041 {
  kind type_approval                # -> subject is a Model, never a unit
  subject model ACME_LC_500
  basis /rec/r60-2021
  evaluation type_approval_decision TAD-2026-118   # judgment spine
  issued_by "OIML issuing authority"
  issue_date 2026-06-30   valid_until 2036-06-30
}
```

## 4.10 Validation rules

- **The sanctioned cycle is the only cycle.** C may reference B only via
  `Family.manufacturer` / `Model.manufacturer`; every other cross-module
  edge obeys the dependency law (A ← everything; D1 binds A+C; D2 on
  D1+C+A; D3 on D1+D2).
- **Anchor discipline.** SoftwareComponent, Marking and Sealing anchor to
  a Model; CalibrationRecord anchors to a Sample; a Certificate's subject
  level must match its `kind` (type-approval → Model;
  verification/calibration → Sample).
- **Reference resolution.** `Sealing.requiredBy` and
  `Certificate.basisRecommendation` resolve to a D1 Recommendation;
  `Certificate.evaluationRef` resolves to a D3 TypeEvaluation or
  TypeApprovalDecision; `CalibrationRecord.traceability` resolves to a
  Module A TraceabilityChain.
- **One-way certificate flow.** Certificates are created only by a D3
  decision, stored only in B, surfaced in C only via `typeApprovalRef`
  and Marking items — never authored inside C or D1.
- **Legal relevance is explicit.** `SoftwareComponent.legallyRelevant`
  and every Marking item's `location` are required — an unlocated marking
  or an unclassified software component is a schema error, not a gap to
  fill later.

## 4.11 Summary

- Module B names what the chain cannot: manufacturer, legally-relevant
  software, markings, seals, calibrations, certificates — the IS
  provenance aspect, realized.
- B depends on A and C because its artifacts name subjects; the C→B
  manufacturer back-edge is the metamodel's only sanctioned cycle.
- Sealing answers a D1 requirement (VIML 2.20); marking carries content
  *and* legal location; calibration records the Sample-level event with
  its traceability chain.
- The certificate's kind and subject level agree by construction
  (type-approval → Model); its `evaluationRef` keeps the judgment spine
  walkable.
- Certificates flow one way: D3 issues → B stores → C displays via
  Marking and `typeApprovalRef`.

*Next: [Chapter 5 — Specification](05-specification.md): Module D1 —
requirements as constraints bound to the subject, and conformance tests
as operations on it.*
