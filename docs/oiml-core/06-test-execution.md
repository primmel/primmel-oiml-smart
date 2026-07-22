# Chapter 6 — Test Execution

> *In this chapter:* Module D2 of the metamodel — the run-time tier of
> facts. Test runs, evidence records, the admissibility gate, constraint
> checks, and the test report: everything a laboratory can truthfully
> record, and not one judgment more.

---

## 6.1 Module D2: facts only

Module D2 (`test-execution` in
`ontology-remix/OIML Core Models/Ontology/oiml-core-ontology.yaml`) executes
D1 definitions on Samples, captures evidence, and produces the TestReport.
Its dependency rule: D2 depends on D1 (it executes definitions), C (the
Sample under test), and A (results are typed values). It contains **facts
only** — and the metamodel states the law as INV-4:

> **INV-4 — D2 contains no verdicts. If a TestReport says "pass", the
> schema is broken.**

This is the fact/judgment firewall of Volume I, Chapter 1, made structural.
A run records what was applied and what was observed. Whether that
observation *satisfies* a requirement is a different act, performed later,
by a different module, over different inputs (Chapter 7). The firewall is
what makes judgments re-runnable: facts are permanent, so evaluation can
be re-executed against new limits, new classes, or corrected derivations
without re-testing (INV-5).

Why so strict? Because the alternative — reports with embedded pass/fail —
freezes a judgment into evidence. When the judgment is later found wrong
(a derivation defect, an edition change, a surveillance re-class), every
report that pre-judged itself must be reopened. In this architecture only
definitions and facts are inputs; judgments are outputs, recomputed on
demand.

## 6.2 TestRun — one test, one sample, one execution

A **TestRun** is one execution of one ConformanceTest on **one** Sample.
Its identity fields pin the entire execution context:

- `executes` — the ConformanceTest (D1 definition) being executed;
- `methodVersion` — the version pin of the TestMethod (INV-8: every
  definition executed in D2 is version-pinned; a verdict is only
  reproducible if the definition it ran against is known exactly);
- `sample` — the single physical unit under test (VIML 4.09);
- `lab`, `operator` — who performed it;
- `started` — when;
- `equipment` — the instruments used, each `{ id, calCert?, traceability? }`
  carrying its calibration certificate reference: the traceability chain
  of Module A, asserted at the point of use.

In the running system (`data/r60/entities/test-execution.yaml`) the run is
created per **TestAssignment** — the atomic (form × sample) work tuple of
the dispatch (Chapter 8) — exactly one run per assignment, idempotently,
and bridged 1:1 to the FormInstance that acts as its evidence template
(the R 60-3 form). ● The run's lifecycle is a small machine:

```
PLANNED → IN_PROGRESS → COMPLETED
                      ↘ INVALIDATED
```

`INVALIDATED` is the run-level shadow of D1's precondition discipline: a
run voided by a violated test-setup constraint or by inadmissible evidence
is void **as a test** — it says nothing about the instrument. A voided run
may be redone (`redoRun`); its evidence is archived verbatim into
`superseded_evidence` — history is kept, but archived records no longer
participate in admissibility. Facts are never deleted; they are
superseded.

## 6.3 EvidenceRecord — the filled slot

An **EvidenceRecord** is a filled data-input slot — mandatory evidence,
typed by the TestMethod output it satisfies. Chapter 5 ended on that seam:
a method's `outputs` are the run's data-input requirements; each output
slot must be filled by exactly this kind of record:

- `fillsOutput` — which method output slot this record fills (a path into
  `TestMethod.outputs.*`; in the running realization, the form field name
  the record satisfies — `dmax`, `test_loads`, …);
- `value` — the recorded QuantityValue (INV-1: never a bare number);
- `repetition` — the 1-based repetition index when the same slot is
  measured repeatedly (R 60's 3 or 5 load applications per class);
- `conditionsLog` — the influence-quantity values logged at capture time,
  each `{ quantityKind, value, unit }`;
- `timestamp` — when the value was captured.

The `conditionsLog` deserves attention: it is the **environmental context**
(HAS) recorded next to the measurement — what the sample *actually
experienced* — while the designed envelope it will be checked against
(reference / rated / limiting) is IS. The IS/HAS duality of Volume I,
Chapter 2, executed at run time: one value structure, two aspect roles,
both on record.

Per-measurement sign-off lives on the record (`signed_by` / `signed_at`),
not on the form — the evaluator who captured this value signs this value.
● (`data/r60/entities/test-execution.yaml` — EvidenceRecord.)

**Lab record vs live stream** (Volume I, Chapter 14 ○). An EvidenceRecord
is captured at a bench; the twin direction adds a second provenance: the
*evidence stream*, served by the instrument's endpoint and appended
continuously. The distinction is provenance, not kind — a stream record
carries this section's parts (value, conditions, timestamp) plus the
freshness window its `serve` binding declares. And the firewall holds on
the wire: neither the lab record nor the stream carries a verdict. Facts
flow; judgments are computed downstream, in D3, over both.

## 6.4 TestRunResult and the admissibility gate

The **TestRunResult** is the raw fact set of one run — its evidence
records — plus the **admissibility gate**, the run's structural
self-assessment:

```yaml
admissibility:
  all_required_slots_filled: true     # every method output has its record
  units_valid: true                   # every value's unit fits its slot
  conditions_within_envelope: true    # logged conditions inside the designed envelope
  status: admissible                  # admissible | inadmissible
```

Three checks, all facts, all computable without knowing any requirement's
limit: completeness of evidence, unit coherence (Module A value typing),
and envelope conformance (actual conditions — `ConditionRole: actual` —
against the designed tiers). `conditions_within_envelope` is the duality
again: HAS held against IS, mechanically.

The gate is not a verdict. An admissible run is merely *usable* — complete
and well-formed evidence. Whether the evidence passes is a question the
gate is forbidden to answer. ● (`RunAdmissibility`, computed by the
test-run service from evidence coverage, units, and constraint-check
outcomes.)

## 6.5 ConstraintCheck — the test policing itself

A **ConstraintCheck** is the execution of one Module-C Constraint against
the run's bound values. Recall the §5.5 distinction: a constraint is an
intrinsic validity rule (OCL `inv`), not a regulatory limit. The
test-setup geometry of R 60-1 Fig. 3 is the standing example — run
`constr:r60:fig3-2b` checks that the largest applied load lies between
90 % and 100 % of capacity:

```
0.9 * self.E_max <= self.D_max and self.D_max <= self.E_max
```

Each check records the constraint id, the `evaluatedValues` (input name →
value the invariant ran with), the `result` (`satisfied | violated`), and
its `effectOnAdmissibility`. The semantics are absolute:

> A violated test-setup constraint **invalidates the run as a test**,
> regardless of results.

If D_max was below 90 % of capacity, the test never happened —
metrologically speaking. Beautiful indications recorded under an invalid
setup are evidence of nothing. The run goes `INVALIDATED`; the instrument
is untouched by the event. ● (fig3-1/2a/2b and interval-consistency checks
run in the test-run service; violations gate admissibility.)

## 6.6 TestCaseResult — aggregation, still no judgment

Runs repeat: R 60 applies the same load three times (classes C/D) or five
(classes A/B), at four temperatures. The **TestCaseResult** is the
per-ConformanceTest roll-up: `basedOnRuns` (the contributing runs),
`derivedValues` (each `{ name, value: QuantityValue }`), and the
`constraintChecks` that ran.

Derived values are computed from the evidence by the D1 derivations —
`e_r` as the dispersion of indications across runs divided by the
conversion factor, `c_c` as the 30-minute creep change. This is
**aggregation only**: formulas are OCL `derive`, their outputs are values
(INV-7 — formula outputs are values, constraint results are facts,
verdicts are judgments; three different kinds, three different modules).
A TestCaseResult can say "the repeatability error of these five runs is
0.31 v". It cannot say whether 0.31 v is acceptable. ◐ in the running
system — derived measurement results are computed per form as
`FormInstance.computed_values` by the OCL calculation engine; a standalone
case-result entity across runs is the v3 consolidation.

## 6.7 TestReport — the deliverable

The **TestReport** is what the laboratory hands to the authority: Sample
identity, all case results, equipment traceability, issue date — and
`definitionVersions`, the map `{ recommendation, tests: {…} }` pinning
every definition the evidence was produced against (INV-8 again, at the
deliverable's granularity).

Two correspondences fix its shape:

- **INV-6** — one Sample = one TestReport = one SampleEvaluation. The
  report is the complete factual account of one specimen.
- **INV-4** — the report contains no verdicts. It is the *input* to
  judgment, never its carrier.

In the R 60 workflow layer the lab's submission is bundled per lab × model
group (the R 60-3 report of Chapter 8), each report collecting the
per-sample FormInstances and their runs; the per-sample correspondence of
INV-6 is recovered through `FormInstance.sample_id` and
`TestRun.sample_id`, and the version pin lives on each run's
`method_version` ●. A report-level `definitionVersions` digest, computed
from the pins of its runs, is ◐.

## 6.8 What "facts only" buys

Hold the module's discipline for a moment and the downstream benefits
fall out:

1. **Re-evaluation without re-testing** (INV-5). New class limits, a
   corrected derivation, a surveillance audit: recompute judgments over
   the same permanent facts.
2. **Independent judgment.** The evaluator was not in the lab. Because
   the report cannot pre-judge, the authority's verdict is a genuine
   second computation, not a countersignature.
3. **Audit symmetry.** Every later dispute decomposes cleanly: *fact
   questions* (was this value recorded? was the run admissible?) versus
   *judgment questions* (does this fact satisfy the limit?) — different
   modules, different remedies.

## 6.9 Grammar sketch *(illustrative v3 syntax)*

```prl
test_run run-2026-0142 {
  executes       /conf/metrological-tests/measurement-error-repeatability-mdlo
  method_version "r60-2:2021#2.10.1"          # INV-8 pin
  sample         sample:ACME-LC-500-SN0047    # ONE sample
  lab            lab:NMI-Force-2
  operator       "J. Verger"
  started        2026-03-11T09:20:00Z
  equipment      [{ id: "force-machine-2", cal_cert: "FM2-2025-118" }]

  evidence {                                   # fills the method's output slots
    { fills: test_loads,  repetition: 1, value: 500.0 kg, timestamp: 2026-03-11T09:41Z
      conditions_log: [{ quantity_kind: temperature, value: 20.3, unit: degC }] }
    { fills: indications, repetition: 1, value: 2000452 counts, timestamp: 2026-03-11T09:41Z }
  }

  constraint_checks {
    { constraint: constr:r60:fig3-2b, result: satisfied, effect: none }
  }

  result {
    derived_values { e_r: 0.31 v, e_l: 0.12 v }  # aggregation only — no judgment
    admissibility { all_required_slots_filled: true, units_valid: true,
                    conditions_within_envelope: true, status: admissible }
  }
}

test_report TR-2026-0091 {                     # the deliverable — INV-4: no verdicts
  sample          sample:ACME-LC-500-SN0047
  case_results    [run-2026-0142.result, …]
  equipment_traceability [chain:FM2-2025-118]
  definition_versions { recommendation: "r60:2021", tests: { mdlo: "r60-2:2021#2.10.1" } }
  issue_date      2026-03-20
}
```

## 6.10 Validation rules

- a TestRun references exactly one ConformanceTest and exactly one Sample;
  `methodVersion` is present and resolves (INV-8);
- every EvidenceRecord fills a declared method-output slot; every required
  slot is filled before `status: admissible` may be computed;
- every recorded value is a QuantityValue with a unit coherent with its
  slot (INV-1, Module A typing);
- every ConstraintCheck names a declared Constraint and records its input
  values; a `violated` result forces `effectOnAdmissibility: invalidates_run`;
- derived values on a TestCaseResult are computed by D1 derivations
  (`derive`), never hand-entered;
- **no D2 element carries a verdict, outcome, or pass/fail field** — the
  schema checker treats one as a structural defect (INV-4).

## 6.11 Summary

- D2 executes D1 definitions on one Sample at a time and records facts —
  runs, evidence, conditions, constraint checks, derived values. Nothing
  else.
- The EvidenceRecord fills a method-output slot: value + repetition +
  conditions log + timestamp + sign-off. The conditions log is HAS
  recorded against the IS envelope.
- The admissibility gate (slots filled, units valid, conditions within
  envelope) decides whether evidence is *usable* — never whether it
  *passes*.
- A violated test-setup constraint invalidates the run as a test; the
  instrument is never touched by it. Facts are superseded, never deleted.
- The TestReport is the per-sample deliverable: case results + version
  pins, and no verdicts (INV-4) — the firewall that makes Chapter 7
  possible.

*Next: [Chapter 7 — Evaluation](07-evaluation.md): Module D3 — judgments
as re-runnable functions over definitions and facts.*
