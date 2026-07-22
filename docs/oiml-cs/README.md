# Annex A — OIML-CS: the Certification-Scheme Reference Package

> *In this annex:* why the OIML Certification System is modelled as its
> own reference package — separate from every Recommendation — the
> 7-step certification workflow with its per-role realization, the
> judgment artifacts (determinations, evaluation reports, certificates,
> the 18-element test-report checklist), and how implementation packages
> map to the scheme under the coverage calculus.

Status markers: ● exists in the running system · ◐ partial · ○ planned
for v3.

---

## A.1 Why the OIML-CS is its own reference model

A Recommendation and a certification scheme are different documents
speaking about different things:

- **OIML R 60** says what a load cell *is* and when it *conforms* —
  subject content: classification, attributes, metrological
  requirements, conformance tests, report forms. Its subject is the
  instrument.
- **OIML-CS PD-05** (*Processing an application for an OIML Type
  Evaluation Report and OIML certificate*, Edition 6 (Amendment 1),
  2024) says how conformity is *established and certified* — process
  content: application, consideration by the Issuing Authority, tests
  and examinations, test reports, the type evaluation report,
  certificate issuance, registration. Its subject is the certification
  process. **PD-02** (*Approval of Legal Metrology Experts*) belongs to
  the same family: provisions about *who may act* in the scheme, not
  about instruments.

Neither content kind owns the other. R 60 never says how an application
is reviewed; PD-05 never says what a load cell's MPE is. The scheme is
instrument-agnostic by design — PD-05's clauses apply identically to
every instrument category the OIML-CS covers, which is why the running
system carries the same workflow model in every Recommendation tree.
All three `evaluation/` directories (`data/r60/`, `data/r91/`,
`data/r144/`) hold the same seven files under the same names:
`approvals.yaml`, `state-machines.yaml` and `roles.yaml` are identical
but for header comments and YAML quoting style; the other four
(`workflow`, `gateways`, `processes`, `certificate-template`) differ
only in Recommendation-specific clause references and content; R 60 and
R 144 add five rec-specific files. Nothing is byte-identical across
trees — the identity is structural, which is the point.

The v2 layout ignores this boundary: the R 60 package mixes a reference
model of the Recommendation with an implementation model of the OIML-CS
process (the `evaluation/` workflow), and the PD-05 clause references in
`evaluation/approvals.yaml` are embryonic mappings with no mapping
machinery around them. The v3 frame names the boundary and enforces it:

- **PD-05 / PD-02 published as the OIML-CS reference package** — the
  scheme's provisions, processes, registries and judgment artifacts as a
  reference model, clause-anchored to the source documents
  (`reference-docs/cs/docs/oiml-cs-pd-05-edition-6-amendment-1.pdf`);
- **the platform workflow re-homed as an implementation package** that
  *maps to* the scheme (§A.6) — never inherits from it;
- **any certification body's own operations** modelled the same way:
  another implementation package, another mapping, the same calculus.

The document family the package covers (the OIML-CS corpus, mirrored in
`data/platform/docs/oiml-cs.yaml`): B 18 (the framework), OD-01/OD-02
(governance), PD-01…PD-09 (procedures — PD-05 processing, PD-02
experts, PD-03 participant approval, PD-04 laboratory assessment),
D 30 / D 32 (ISO/IEC 17025 and 17065 guidance). This annex concentrates
on PD-05, the processing procedure the platform executes.

## A.2 The 7-step certification workflow

PD-05 §4 (Scheme B; §5 Scheme A applies the same provisions) defines the
chain every OIML certificate travels. The platform realizes all seven
steps; the third column cites the realization.

| # | Step | PD-05 | Realization in the platform | Status |
|---|---|---|---|---|
| 1 | **Application** — applicant submits for a Model or ModelFamily | §4.1 / §5.1 | applicant portal wizard (`browser/src/vue-pages/portal/application-wizard.vue`); `Application` + subject chain (`data/r60/entities/workflow.yaml`, `instrument.yaml`) | ● |
| 2 | **Review & dispatch** — IA reviews, requests changes, dispatches TestRequests to one or more TLs | §4.2 | IA console (`vue-pages/ia/application-review.vue`, `dispatch-builder.vue`); `TestRequest` 1..n per application, `TestAssignment` per (form × sample × model × lab) | ● |
| 3 | **Testing** — TL receives samples, performs assigned tests, signs evidence | §4.3 | TL workbench (`vue-pages/lab/`); custody chain on `MeasuringInstrumentSample`; runs via `test-run.service.ts`; R 60-3 forms (`data/r60/execution/forms/`) | ● |
| 4 | **Test report** — TL compiles and submits the OIML Test Report | §4.4 | `TestReport` owning `FormInstance`s (cascade FK); report composer (`vue-pages/lab/report-composer.vue`); 18-element checklist (§A.5) | ● |
| 5 | **Evaluation** — IA determinations per form/report, synthesis per model, overall decision | §4.5 | `EvaluationReport` → `TestReportDetermination` → `ModelEvaluation`; `evaluation-aggregator.service.ts`; per-requirement verdicts via `verdict.service.ts` | ● |
| 6 | **Decision & issuance** — certificate issued for the (possibly amended) scope | §4.6 + Annexes A/B | `Certificate` from a completed evaluation (`useCertificate.issueCertificate`); number per `evaluation/certificate-template.yaml`; print via `CertificatePrint.vue` | ● |
| 7 | **Registration** — certificate record registered with the BIML | §6 | `biml-registration.service.ts`: record builder, idempotent register action, public register at `/app/register` | ◐ |

Step 7 is the honest ◐: the registration record and the public register
exist; a true OIML-CS API integration (export feed to the BIML) is ○.

Two properties of the model carry the scheme's semantics:

- **The subject chain is referenced, never duplicated.** The application
  references `model_family_id`, `model_ids[]`, `sample_ids[]`; the
  instrument definition (dimensions, parameters, capabilities,
  conditions) lives on Family/Group/Model/Sample. PD-05's "description
  of the type" *is* the subject model — the form is a view, not a copy.
- **Dispatch is at (form × sample × model × lab) granularity.** One
  application may spawn many TestRequests; one request carries exactly
  the conformance tests *that* lab must perform — partial test sets
  across labs are the normal case, and `parent_request_ids` links split
  requests. Lab selection is capability-driven
  (`evaluation/lab-selection-criteria.yaml` → `lab-selection.service.ts`).

## A.3 Per-role realization

The scheme names four actor kinds; the platform gives each a console:

| Role | Console | What the role does there |
|---|---|---|
| **Applicant / Manufacturer** | `vue-pages/portal/` | declares the model family and matrix scope; submits; edits and resubmits under `CHANGES_REQUESTED` (authz treats it like `DRAFT`); withdraws with a reason |
| **Issuing Authority (IA)** | `vue-pages/ia/` | reviews (accept / reject / request changes); derives dispatch (`src/data/dispatch.ts`); walks state machines (`src/data/state-walk.ts`); evaluates; decides; issues |
| **Test Laboratory (TL)** | `vue-pages/lab/` | receives samples into custody; sees only its assignments; executes runs and forms; signs per form and per run; compiles the test report |
| **BIML / public** | `/app/register` | the public certificate register — whitelisted next to `/app/login` in the router guard, no session required |

The lifecycle state machines that drive every transition live in
`data/r60/evaluation/state-machines.yaml` (application, form instance,
test report, evaluation report, certificate) with declarative cascades;
the machines are scheme content, not application code.

### A.3.1 A fifth role: the engine operator (○)

The four consoles above run the type-approval workflow, and that
workflow stays the legal baseline — nothing here amends PD-05. The twin
direction adds one actor the scheme has not yet named: the **engine
operator** (Volume I, chapter 14, §14.8) — the issuing authority,
regulator or market-surveillance body running the Compliance Engine
against the certified promises *after* issuance. Continuous
surveillance is the scheme's future face: the certificate of §A.4 stops
being a photograph of one Tuesday in the lab and becomes the head of an
evidence stream — monitors re-evaluating the same requirement OCL
against served values, failures escalating back into the scheme's own
machinery (flag the certificate, open a case). All of it is ○; the
7-step workflow of §A.2 issues the certificate either way — the engine
then watches what the certificate promised.

## A.4 Determinations, evaluation reports, certificates

The tertiary-tier judgment chain (facts permanent, judgments
re-runnable):

1. **Determination** — a recorded judgment on evidence. Two
   granularities: per form (`form_determinations`: pass / fail /
   indeterminate, with notes) and per test report
   (`TestReportDetermination`: the admissibility gate — ACCEPTED /
   REJECTED / CONDITIONAL). A report the IA has not determined blocks
   synthesis. "Contact the lab" is expressed as `indeterminate` + notes,
   or the form rejected back to the lab.
2. **Per-requirement verdicts** — `verdict.service.ts` re-executes each
   applicable requirement's OCL `limit` against the bound evidence:
   pass / fail / indeterminate per requirement × sample, evaluator
   overridable, driving the model and overall decisions. Evaluation is
   re-computation over permanent facts — no re-testing.
3. **ModelEvaluation** — per-model technical synthesis across reports
   (possibly across labs): completeness of required forms, then the
   decision from the verdict set. Type conformity is established across
   samples, never from one (metamodel INV-6).
4. **EvaluationReport** — collects all reports matching the issued
   requests; `overall_decision` PENDING → APPROVED /
   CONDITIONALLY_APPROVED / REJECTED; all-PASS approves, any-FAIL
   rejects, a mix conditionally approves, any-INCOMPLETE stays pending.
5. **Certificate** — issued from a completed evaluation; mirrors the
   application scope *or the amended outcome* (e.g. a model removed from
   the family). Number per PD-05 Annex B via
   `evaluation/certificate-template.yaml`
   (`{shortName}/{edition}-{scheme}-{authority}-{year2}.{seq}`, dimension
   labels `{accuracy_class}{n_lc_thousands}`). In v3 terms its
   characteristic list is the subject's **promises-as-verified** ◐ —
   today the certificate carries classifications and parameters; the
   promise-verification link is part of the promises program
   (`shared/roadmap.md`).
6. **BIML registration** — `Certificate.biml_registration` plus the
   registration record built by `biml-registration.service.ts`;
   publication to the OIML website is ○.

## A.5 The 18-element test-report checklist

PD-05 §4.4.3 fixes the minimum content of every OIML test report as
elements (a)–(r). The package models them as data —
`data/r60/execution/test-report-checklist.yaml` — one entry per element
with `obligation` and a `source` path into the entity graph, so report
completeness is *validated at compilation time*, not reviewed by eye:

| El. | Content | Bound to |
|---|---|---|
| a–c | title "OIML test report"; TL name/address + test location; unique report id on each page + end marker | `test_report.title`, `test_report.laboratoryId → organization.name, organization.address`, `test_report.reportNumber` |
| d–g | applicant identity; Recommendation reference (number + year); category; type/family designation | `application.applicant.company, application.applicant.address`, `standard.identifier + standard.year`, `standard.docnumber`, `instrument.model + application.typeDesignation` |
| h–k | samples tested; per-test dates; per-test place; per-test conductor | 04-07-sample-selection form, `form_instance.created`, `test_report.testLocation`, `form_instance.evaluator` |
| l–o | environmental conditions; facility and equipment; instrument/simulation setup; authorized adjustments | environmental data, `04-10 test-equipment forms`, 04-05-load-cell-type-info form, `04-07-sample-selection form (§4.8)` |
| p–r | results with uncertainty and traceability (**may** — only if the Recommendation specifies); per-test pass/fail conclusion; name/function/signature of the authorizing person | `form_instance.result`, `test_report.evaluator + test_report.signatureDate` |

Element (p) is the single `may` in the list; the rest are `shall`. The
checklist's own coverage is enforced in the evaluation process model
(`evaluation/processes.yaml`: `[test_report_checklist_coverage] >= 1.0`).

## A.6 Mapping implementation packages to the scheme

The OIML-CS package is a **reference model**; everything that operates
it is an **implementation model** related to it by mapping (A ⇒ B —
fulfilling A fulfils B), per Chapter 5 of Volume I. Three mapping
clients matter:

- **The platform workflow.** Each workflow entity and state machine in
  an implementation package maps to the PD-05 process it realizes:
  the application machine to §4.1–4.2, the dispatch process to §4.2,
  the report-compilation process and checklist gate to §4.4, the
  evaluation aggregation to §4.5, issuance to §4.6, registration to §6.
  The coverage calculus then answers "how much of PD-05 does this
  platform fulfil?" as a graph computation: full / minimal / partial /
  no cover per clause, inherited down process trees, aggregated up.
- **A certification body's own operations.** A CB running its own
  workflow tool models its actual process once and maps it to the same
  reference package; audit becomes coverage review over its `.prm`, not
  a document chase. The mapping carries description + justification per
  pair — precisely what a PD-03/PD-04 assessment asks for.
- **Per-lab test procedures.** A lab's SOP for an R 60-2 method maps to
  the Recommendation's required method the same way — one relation, one
  calculus, one audit view across scheme and Recommendation alike.

## A.7 Grammar sketch *(illustrative v3 syntax)*

The scheme package declares abstract processes (the scheme *requires*
them; it does not execute them), registries for its records, and
provisions anchored to PD-05 clauses:

```prl
package oiml-cs {
  uses [oiml-core]
  source "urn:oiml:pub:cs:pd:05:2024#amd1"

  process type_evaluation {          # abstract: required, not executed
    is {
      provenance { source "pd-05#clause-4" }
      executor actor IssuingAuthority
    }
    does {
      step application        { source "pd-05#clause-4.1" }
      step consideration      { source "pd-05#clause-4.2" }
      step tests_examinations { source "pd-05#clause-4.3" executor actor TestLaboratory }
      step test_report        { source "pd-05#clause-4.4" }
      step evaluation_report  { source "pd-05#clause-4.5" }
      step issuance           { source "pd-05#clause-4.6" }
      step registration       { source "pd-05#clause-6" }
    }
  }

  registry TestReport { ... }
  provision test_report_content {
    modality shall
    source "pd-05#clause-4.4.3"
    checklist elements a..r          # the 18-element model of §A.5
  }
}
```

And an implementation package maps to it (standalone `.prm` form):

```json
{
  "@type": "Primmel_MAP",
  "id": "smart-platform-to-oiml-cs",
  "mapSet": {
    "oiml-cs": {
      "mappings": {
        "platform.workflow.application": { "oiml-cs#type_evaluation.application": {
          "description": "Portal wizard + application state machine realize PD-05 application intake.",
          "justification": "Every §4.1 data element is captured on Application or the referenced subject chain."
        } },
        "platform.workflow.report_compile": { "oiml-cs#type_evaluation.test_report": {
          "description": "Report composer with the 18-element checklist gate.",
          "justification": "Report compilation validates the /req/cs/test-report-18-elements provision; checklist coverage >= 1.0 gates evaluation-report compilation (PD-05 §4.5)."
        } }
      }
    }
  }
}
```

## A.8 Validation rules

- every workflow entity, process and checklist entry in the scheme
  package carries clause-level provenance into PD-05/PD-02
  (`source: { doc, clause }`) — the scheme package owns no instrument
  facts, and a Recommendation package owns no scheme facts;
- mappings are directional: implementation → reference only; both ends
  resolve (`Namespace#ElementID`); coverage claims are computed by the
  calculus, never authored (Chapter 5, Volume I);
- the 18-element checklist is enforced in the process model
  (`evaluation/processes.yaml`), not at TestReport submission:
  `compile_test_report` validates the `/req/cs/test-report-18-elements`
  provision (PD-05 §4.4), and `compile_evaluation_report` refuses
  synthesis while `[test_report_checklist_coverage] < 1.0` (PD-05 §4.5);
- a Certificate issues only from a finalized EvaluationReport
  (`overall_decision ≠ PENDING`), and its scope equals the application's
  scope as amended by the decision — never wider;
- determinations and verdicts are re-executable functions over evidence:
  an evaluation artifact that embeds measured values (rather than
  referencing them) violates the fact/judgment firewall.

## A.9 Summary

- The OIML-CS (PD-05 processing, PD-02 experts) is process content about
  certification; Recommendations are subject content about instruments.
  Neither owns the other — hence two reference packages, related to
  implementations by mapping alone.
- The 7-step workflow (application → review → dispatch → testing →
  test report → evaluation → decision/issuance → registration) is
  realized per role: portal, IA console, TL workbench, public register.
  Steps 1–6 are ●; registration is ◐ (record + register built, BIML API ○).
- Judgments are a re-runnable chain: determinations → verdicts →
  model evaluations → evaluation report → certificate
  (promises-as-verified) → BIML registration.
- PD-05 §4.4.3's 18 elements are data, validated at report compilation.
- "Does this platform / CB / lab fulfil the scheme?" is a coverage
  question, answered by the mapping calculus — not by document review.
- The scheme's future face is continuous surveillance (○): a fifth
  role, the engine operator, runs the Compliance Engine against the
  certified promises after issuance — while the 7-step workflow remains
  the legal baseline (§A.3.1).

*Next: [Annex B — The SMART Platform Runtime](../platform/README.md):
the engine that executes these models.*
