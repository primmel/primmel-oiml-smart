# Chapter 6 — Evaluation

> *In this chapter:* the judgment layer of a Recommendation package — how
> evidence becomes a decision. Admissibility per test report, verdict
> re-execution per requirement, the cross-sample model evaluation, the
> overall decision, the approval chain, the certificate as promises-as-verified,
> and BIML registration. Everything here is authored configuration:
> the package declares the synthesis, the engine computes it.

---

## 6.1 Judgment is authored configuration, not code

Chapters 3–5 built the evidentiary chain: requirements constrain the
subject, conformance tests operate on it, forms record its exhibition.
Evaluation is where the tertiary tier closes over all three — and it
follows the same discipline as everything upstream: **the Recommendation
package declares the rules; the platform executes them.**

Three invariants from the metamodel (Volume II, Chapter 9) set the terms:

- **INV-4 — facts carry no verdicts.** A TestReport and its FormInstances
  are evidence. Nothing in them says "pass"; judgment is computed
  downstream, never recorded upstream.
- **INV-5 — re-evaluation needs no re-testing.** Every judgment is a
  pure function of definitions + facts. Change a limit, re-run the
  evaluation, get the new judgment — the evidence stays as recorded.
- **INV-6 — type conformity is established across samples.** One sample
  yields one test report and one sample evaluation; the *type* is judged
  only in aggregate.

The synthesis has three levels plus a signing act, and each level is a
declared entity in `data/r60/entities/workflow.yaml`, not a hard-coded
pipeline:

```text
Level 1   TestReportDetermination   admissibility per report (per lab)
Level 2   Verdict                   per requirement × sample, re-executed
Level 2b  ModelEvaluation           completeness + failures across labs
Level 3   EvaluationReport          overall decision per application
act       Certificate + approvals   the signed artifact and its registration
```

The levels are ordered but independent: admissibility gates evidence,
verdicts judge requirements, the model evaluation measures coverage,
the decision aggregates. Conflating them — a "pass" written into a form,
a decision computed inside a lab's UI — is exactly what the fact/judgment
firewall forbids.

## 6.2 Level 1 — admissibility: the TestReportDetermination ●

An application may produce several test reports — one per lab, one per
model group. Before any requirement is judged, the issuing authority
(IA) decides whether each report is **admissible as evidence** at all:
complete, signed, in scope. That decision is a first-class record
(`data/r60/entities/workflow.yaml` — TestReportDetermination):

```yaml
      - name: decision
        type: enum
        enum_values: [ACCEPTED, REJECTED, CONDITIONALLY_ACCEPTED]
```

Three rules shape the level:

- **One determination per report.** The EvaluationReport carries
  `test_report_ids [1..*]` (PD-05 §4.5.1 k), and the description on
  TestReportDetermination is explicit: "One EvaluationReport contains
  one TestReportDetermination per entry in test_report_ids[]".
  Finalization requires *all* of them — an undecided report blocks the
  decision.
- **CONDITIONALLY_ACCEPTED is real.** A report with conditions
  (`conditions: string[]`) still feeds the synthesis; its conditions
  propagate to the overall decision's `conditions` list.
- **The determination owns the verdicts.** Level-2 verdicts for the
  report's samples are embedded on the determination
  (`verdicts: reference(Verdict) [0..*], on_delete: cascade`) — the
  admissibility record and its per-requirement judgments form one
  reviewable unit.

Admissibility is a *human* determination recorded as data: reviewer,
supervisor, review date, notes. The machine's job is to make the gate
explicit and the record complete — not to auto-accept.

## 6.3 Level 2 — verdict re-execution per requirement ●

This is the level that makes evaluation *executable* rather than
ceremonial. For every applicable requirement, for every sample in scope,
the engine **re-executes the requirement's OCL `limit` against the bound
evidence** and records the outcome as a Verdict
(`data/r60/entities/workflow.yaml` — Verdict; runtime:
`browser/src/services/verdict.service.ts`, UI `VerdictMatrix.vue`).
Nothing is transcribed from the lab's own pass/fail display: the same
OCL statement the author wrote in Chapter 3 runs again at evaluation
time, on the IA's side, against the facts on record (INV-9).

A Verdict captures the full audit trail of one judgment:

- **`fact`** — a `VerdictFact { name, value, source }`: the observed
  value the limit was evaluated against, resolved from the requirement's
  primary `binds_to` path (the entity graph) or from a form's computed
  values realizing an observable symbol. The value is a QuantityValue,
  never a bare number (INV-1).
- **`limit`** — a *snapshot* `{ expression, uses, inputs }`: the OCL
  expression and every input value it ran with. The judgment is
  reproducible because the inputs are pinned (INV-8's version-pinning
  applied at the judgment level).
- **`outcome`** — `pass | fail | indeterminate | invalid`.
  `indeterminate` is a first-class outcome, not an error: missing
  evidence or an unevaluable expression, with the reason recorded in
  `notes`. `invalid` comes only from a violated test-validity
  precondition (the conformance test's `preconditions:`, evaluated
  *before* the limit): it voids the **run** — a bad test, never an
  instrument failure — and names the violated precondition ids in
  `precondition_violations`.
- **`modality`** — `shall | should`, copied from the requirement's
  limit: a failed *should* surfaces as an **observation** in the
  evaluation report, never as a pass/fail blocker.
- **`criterion`** — the verdict taxonomy where the Recommendation has
  one (R 91-2, 6.1): `I/MPE` (limit applies during the influence
  factor), `D/NSFa` (no significant fault *after* the disturbance —
  recorded manual intervention allowed), `D/NSFd` (no significant fault
  *during*), `n/a` (observational).
- **Overrides are recorded, never silent.** `overridden: boolean`,
  `override_note` (mandatory justification), `override_by`. An evaluator
  may disagree with the computed outcome; the record keeps both.

Two further fields keep the verdict honest in harder Recommendations:
`verdict_id` keys the judgment to the canonical VerdictQuantity registry
(`data/r60/specification/verdicts.yaml` — each acceptance quantity
derived **once**, referenced by requirements and forms, so the
evaluation can never judge a different quantity than the lab computed),
and `channel_values` records which set-dimension values (e.g. R 144
measurand components) the verdict's evidence covers — per-channel
requirements need a passing verdict *per channel* (Chapter 9).

Where the derivation has multiple spellings in the source, the registry
settles it once. R 60's MDLO temperature effect exists as one
VerdictQuantity, `mdlo_normalized`
(R 60-3, 2.1.4: `ocl{abs(c_m * t_f / delta_t * (d_max - d_min) / (n * v_min))}`),
replacing two divergent formulations that had drifted apart between the
requirement and the form — the defect class the registry exists to kill.

## 6.4 Level 2b — the cross-sample ModelEvaluation ●

Verdicts judge requirements; the ModelEvaluation answers the orthogonal
question: **is this model fully tested?** Per model, the accepted
reports of all contributing labs are gathered, and completeness plus
failures derive the decision (`data/r60/entities/workflow.yaml` —
ModelEvaluation):

```yaml
      - name: decision
        type: enum
        enum_values: [PASS, FAIL, CONDITIONAL, INCOMPLETE]
        description: |
          PASS: all required forms covered with no failures.
          FAIL: any FormInstance.result == FAIL.
          CONDITIONAL: covered but with non-passing evidence (e.g. ANR cases).
          INCOMPLETE: missing_form_ids is non-empty.
```

The mechanics are deliberately simple and derived, never entered by
hand: `required_form_ids [1..*]` comes from the test program;
`covered_form_ids` are forms with at least one passing FormInstance;
`missing_form_ids` is the set difference; `contributor_test_report_ids`
and `contributor_lab_ids` record *who* supplied the evidence. This is
where the multi-lab dispatch of Chapter 5 pays off: work split at
(form × sample × lab) granularity reassembles here into one judgment
per model — and INV-6 is enforced structurally, because the entity only
exists across reports, never inside one.

CONDITIONAL deserves a note: it is the honest middle state — coverage
complete, but some evidence non-passing without being a hard failure
(the ANR cases: additional national requirements where one country's
test set differs). It feeds the certificate's amended scope (§6.7).

## 6.5 Level 3 — the overall decision ●

The EvaluationReport aggregates the model evaluations into the decision
the application is waiting for
(`data/r60/entities/workflow.yaml` — EvaluationReport):

```yaml
      - name: overall_decision
        type: enum
        enum_values: [PENDING, APPROVED, REJECTED, CONDITIONALLY_APPROVED]
```

The derivation rules are declared, not coded (methodology §7):

| Condition | Decision |
|---|---|
| all model evaluations PASS | **APPROVED** |
| any FAIL | **REJECTED** |
| mixed (CONDITIONAL present, none FAIL) | **CONDITIONALLY_APPROVED** |
| any INCOMPLETE | **PENDING** — cannot finalize |

PENDING is a real state, not an absence: it blocks `finalized_at` /
`finalized_by`, which is what keeps an evaluation with outstanding
evidence from ever signing a certificate by accident. The report's
metadata is the PD-05 §4.5 record: `reviewer_name`, `supervisor_name`,
`review_date`, `conditions`, `review_notes`. Aggregation runs in
`browser/src/services/evaluation-aggregator.service.ts`
(TR → determination → model → overall); the IA workspace renders it in
`cs/evaluation-detail.vue`.

## 6.6 The approval chain as data ●

The workflow's signing steps are not workflow-engine config hidden in
code — they are six declared approvals in
`data/r60/evaluation/approvals.yaml`, each with actor, signatory role,
the store it signs into, and its PD-05 clause reference:

```yaml
  - id: ia_approve_evaluation_report
    label: "IA Approves Evaluation Report"
    actor: issuing_authority
    approve_by: responsible_person_ia
    approval_record: evaluationReports
    reference: "PD-05 §4.5"
```

The chain: `ia_accept_application` (§4.2) → `tl_authorize_test_report`
(§4.4.3 r) → `ia_approve_evaluation_report` (§4.5) →
`ia_sign_certificate` (§4.6) → `biml_register_certificate` (§4.7) →
`ia_approve_revision` (§8.1). Every signed act produces an ApprovalRecord
(approver role, approver name, decision, date) — the audit spine that
lets any later reader reconstruct *who authorized what, under which
clause*. In the v3 frame these PD-05 references are embryonic
**mappings**: the workflow content is an implementation model of the
OIML-CS reference package, and the approval's clause ref is the mapping
pair (A ⇒ B) in seed form (Volume I, Chapter 5).

## 6.7 The certificate: promises as verified ●◐

On APPROVED the IA issues the Certificate. Its scope is the
application's matrix — **or the amended outcome**: a CONDITIONAL model
evaluation can remove a model from the family scope, and the certificate
prints what was actually approved
(`data/r60/entities/workflow.yaml` — Certificate: `classifications
[1..*]`, `model_family_id`, `type_designation`, `conditions`,
`test_reports`, `evaluation_report_id`).

The rendering is data, in `data/r60/evaluation/certificate-template.yaml`:

```yaml
  number_format: "{shortName}/{edition}-{scheme}-{authority}-{year2}.{seq}"
  dimension_labels:
    pattern: "{accuracy_class}{n_lc_thousands}"
  characteristics_template:
  - { name: e_max_values, attribute: e_max, type: string, label: "E_max values", obligation: mandatory }
  - { name: accuracy_class, dimension: accuracy_class, type: string, label: "Accuracy class", obligation: mandatory }
```

- **`number_format`** composes the certificate number from the
  standard's identity block — `R60/2021-A-DE1-25.01`-style identifiers
  from data, not string concatenation in code.
- **`dimension_labels`** composes each classification row's compact
  label from dimension values — R 60's `'C6'` (class C, n_lc 6000) is
  the same `group_label` the subject chain carries, so the certificate
  and the taxonomy can never disagree about what a row *is*.
- **`characteristics_template`** lists what the certificate certifies,
  row by row, referencing attribute ids and dimension ids from the
  model layer. R 60-4 Annex B's mandatory supplement (model designation,
  E_max, accuracy class, n_LC, v_min, p_LC) is marked
  `obligation: mandatory`; the Table B.1 technical data rows are
  `optional`.

Read the characteristics row set through the v3 frame and it is exactly
the subject's **promises-as-verified**: the manufacturer claimed these
characteristics on the type (IS), evaluation verified them against
evidence, and the certificate prints the verified claims. That reading
is the target; today's template references parameter-valued claims
(attributes, dimensions), with envelope-shaped promises a v3 addition
(◐ — concepts document §3.1, promises row).

## 6.8 BIML registration ◐

The last approval in the chain hands the certificate to the registration
body. The entity models it as `Certificate.biml_registration`
(`{ submitted_date, registered_date, registration_number }`), and the
certificate's lifecycle (`status: PENDING_REGISTRATION → ACTIVE → …`)
makes registration state explicit.

In the running system, registration is implemented as a record builder +
register action: `browser/src/services/biml-registration.service.ts`
produces the registration record (JSON download) idempotently, and the
public register renders at `/app/register`. What does not exist is the
outward leg — the OIML-CS export feed / API integration and true web
publication (◐: registration record ●, external publication ○;
`docs/oiml-cs-cert-workflow.md` Step 7 and gap-closure item 3).

## 6.9 Grammar sketch *(illustrative v3 syntax)*

```prl
evaluation r60 {

  determination test_report {                    # Level 1 — admissibility
    one_per   report in evaluation.test_report_ids
    outcomes  [ACCEPTED, REJECTED, CONDITIONALLY_ACCEPTED]
    carries   reviewer, review_date, notes, conditions[]
  }

  verdicts {                                     # Level 2 — re-execution
    re_execute requirement.limit against bound_evidence
    outcomes   [pass, fail, indeterminate, invalid]
    invalid    from precondition_violation       # voids the run, never a fail
    modality   from requirement.limit.modality   # should-fail = observation
    overrides  recorded with mandatory justification
    registry   verdicts.yaml                     # one derivation per quantity
  }

  model_evaluation per model {                   # Level 2b — cross-sample
    completeness required_form_ids vs covered_form_ids
    decision     PASS | FAIL | CONDITIONAL | INCOMPLETE
  }

  decision overall {                             # Level 3
    all PASS       -> APPROVED
    any FAIL       -> REJECTED
    mixed          -> CONDITIONALLY_APPROVED
    any INCOMPLETE -> PENDING                    # blocks finalization
  }

  approvals [ ia_accept_application(PD-05 §4.2), tl_authorize_test_report(§4.4.3 r),
              ia_approve_evaluation_report(§4.5), ia_sign_certificate(§4.6),
              biml_register_certificate(§4.7), ia_approve_revision(§8.1) ]

  certificate {
    number_format    "{shortName}/{edition}-{scheme}-{authority}-{year2}.{seq}"
    dimension_labels "{accuracy_class}{n_lc_thousands}"
    characteristics  verified_promises           # Annex B rows: attribute/dimension refs
  }
}
```

## 6.10 Validation rules

The linker and `primmel check` enforce, for the evaluation layer:

- every TestReport in an EvaluationReport's `test_report_ids` has
  exactly one TestReportDetermination before finalization;
- every Verdict's `requirement_id` resolves to a declared requirement,
  its `verdict_id` (when present) to a declared VerdictQuantity, and its
  `limit.uses` inputs are all bound — a verdict over unbound inputs is
  an error, not an indeterminate;
- `override_note` is mandatory whenever `overridden` is true;
- ModelEvaluation `required_form_ids` resolve to declared forms;
  `covered ⊆ required`; `missing = required − covered` (derived, never
  authored);
- certificate characteristics reference declared attribute/dimension
  ids only (the R 91 residue bug — characteristics pointing at another
  Recommendation's attribute ids — is exactly the rule's motivation);
- approval records reference declared stores and declared roles.

## 6.11 Summary

- Evaluation is authored configuration: three levels of declared
  synthesis plus a signing act, all in the package, none in code.
- Level 1 admits or rejects reports as evidence; Level 2 re-executes
  each requirement's OCL limit against bound facts — indeterminate and
  invalid are first-class, overrides are never silent; Level 2b measures
  cross-sample completeness; Level 3 aggregates to a decision that
  cannot finalize while anything is INCOMPLETE.
- The approval chain is data with PD-05 clause references — embryonic
  mappings to the OIML-CS reference package.
- The certificate prints promises-as-verified: number format, dimension
  labels and characteristics all derive from the model layer, and its
  scope may be the *amended* outcome of a CONDITIONAL evaluation.
- Facts are permanent; judgments are re-runnable (INV-4..8). That is
  what makes a re-evaluation after an edition change a computation,
  not a retest.

*Next: [Chapter 7 — Packaging](07-packaging.md): the `data/<rec>/`
directory contract, `uses` composition, sample data, and registering
the standard so the build sees it.*
