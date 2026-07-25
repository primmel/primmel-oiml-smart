# Volume III — Authoring OIML Recommendations

This volume teaches the methodology: how to get from a published OIML
Recommendation — a PDF of prose, tables, formulas, and report forms — to a
**validated OIML SMART package** that renders the document, runs the
tests, and computes the verdicts. Everything here is grounded in the
running system: R 60 is the worked example throughout; R 91 (speed meters)
and R 144 (gas analyzers) are the stress cases.

The volume assumes Volume I (the Primmel kernel) and Volume II (the OIML
core metamodel). In particular, you should already read a requirement as
*a constraint bound to subject aspect paths*, a test as *an operation on
the subject*, and a form as *an evidence view* — the methodology is those
three ideas applied clause by clause.

The audience is wider than the standards body: a manufacturer authors
their **product reference package** — the product modelled and mapped to
the Recommendation — by these same moves (Volume I, chapter 15), and a
subject declared twin-ready here (chapter 2, §2.11) can later be served
and monitored live (Volume I, chapter 14).

## Who reads this volume

**Track C — the Recommendation author.** You are a metrologist or a
standards engineer modelling a new Recommendation (R 129, R 76, the next
edition of R 60), or maintaining an existing package. Prerequisite
reading: `primmel/` chapters 1–5, `oiml-core/` chapters 1–5; chapters 9–10
of Volume II (invariants, shared modules) tell you which laws the gates
enforce and which families you no longer author by hand.

## How to use this volume

Chapter 1 is the method in one pass: seven moves, from the subject to the
validated package, with the gates and the pitfalls. Chapters 2–7 develop
one move each — read them when you actually sit down to author that layer.
Chapters 8–9 are walkthroughs: the same seven moves applied to real
Recommendations, end to end, including the mistakes. Chapter 10 turns the
direction around: not the Recommendation but **your laboratory** — its
SOPs as an implementation package mapped to the required methods, with
the coverage calculus answering whether the lab's procedures fulfil them.
If you are starting a
new Recommendation today: read chapter 1, keep the directory contract
below open in another window, and work the moves in order.

## The package contract

What you produce is a directory `data/<rec>/` that the build discovers
through its `standard.yaml` manifest — normative content only,
instantiating the metamodel:

```text
data/<rec>/
  standard.yaml         identity + structure registry (every file registered here)
  terminology.yaml      terms; vocab_ref → viml-2022 / vim-2012
  references.yaml  notes.yaml  obligation.yaml  value-types.yaml
  navigation.yaml  parts.yaml  redirects.yaml  sample-data.yaml (the seed)
  model/        instrument.yaml attributes.yaml capabilities.yaml
                behaviors.yaml conditions.yaml
  entities/     instrument.yaml parties.yaml workflow.yaml test-execution.yaml
  specification/ requirements/ conformance/ tables.yaml symbols.yaml
                calculations.yaml formulas.yaml verdicts.yaml
  execution/    forms/ (shared headers + per-section) subforms/
                test-report.yaml test-report-checklist.yaml
  evaluation/   workflow.yaml state-machines.yaml processes.yaml gateways.yaml
                approvals.yaml roles.yaml certificate-template.yaml
                evaluation-dimensions.yaml evaluation-profiles.yaml
                lab-selection-criteria.yaml sample-selection-rules.yaml
                calculation-context.yaml
```

Plus the layer-1 domain profile
(`ontology-remix/OIML Recommendation Models/Ontology/R <n>/` — subject
taxonomy, attribute definitions, formulas, constraints, error model) and
JSON Schemas under `data/schemas/` for any new file kinds.

The `standard.yaml` manifest has three parts, and all three matter: the
identity block (`id`, `shortName`, `fullName`, `baseUrn`, `version`,
`editions`), the `structure:` registry (every file, with `path` + `label` + `description`,
grouped by layer), and the `source:` attachment (the
Metanorma sources of the Recommendation text).

Three rules make the contract binding:

- **Primmel (PRL) is the single source of truth** (chapter 11). The
  `.prl` packages are authoritative; the YAML data trees and the generated
  TypeScript are derived and never edited; services carry no domain
  content.
- **A new Recommendation is data, not schema.** The R 60 profile states it:
  "a new profile file; zero schema changes".
- **A file not registered in `standard.yaml` does not exist** as far as
  the build is concerned.

Where the content is not the rec's own law, you do not author it: core
entities come from the OIML core package, and the seven shared modules
(Volume II, chapter 10) supply the EMC, climatic, software-examination,
reference-material, specimen-governance, report-header, and
documentation-examination skeletons. Your package binds their slots; it
never copies their files.

## The gates

Three commands decide whether the package exists. You will run them
hundreds of times; chapter 1, §1.9 explains what each checks and lists
the six cross-layer invariants to self-check before calling a package
done:

```text
cd browser && npm run validate   # JSON-Schema + semantic (x-refs, anchors) + sample-data
cd browser && npm run build      # full codegen; YAML errors fail here
cd browser && npx vitest run     # unit tests over the generated data
```

Status markers used in this volume: ● exists in the running system ·
◐ partial · ○ planned in v3. Where the running R 60 package deviates from
the method (the `kind` taxonomy, the binding-key drift), the text says so
honestly — the method is the target, R 60 is the evidence.

## The chapter map

1. [The authoring method](01-methodology.md) — the end-to-end method in
   seven moves; the validation gates; the pitfalls catalog.
2. [Modelling the subject](02-modelling-the-subject.md) — subject types,
   variants, dimensions, attributes (origin/scope/category), capabilities,
   behaviors, conditions.
3. [Requirements](03-requirements.md) — anatomy; binding; OCL limits;
   applicability; verification methods; tables and profiles.
4. [Conformance tests](04-conformance-tests.md) — variables and sources;
   steps; conditions; acceptance criteria; inheritance; instances; kinds
   and obligation.
5. [Forms and reports](05-forms-and-reports.md) — bind paths; measurement
   methods; pass/fail; the test-report skeleton; checklists; omissions.
6. [Evaluation](06-evaluation.md) — determinations, verdicts, model
   evaluation, decision; the certificate template; approvals.
7. [Packaging](07-packaging.md) — the package layout; `uses` composition;
   sample data; registration.
8. [Walkthrough: R 60](08-walkthrough-r60.md) — the worked example, end to
   end.
9. [Walkthrough: R 91 and R 144](09-walkthrough-r91-r144.md) — speed
   meters and gas analyzers: the stress cases.
10. [Modelling your lab](10-modelling-your-lab.md) — the laboratory's
    SOPs, equipment register and record forms as an implementation
    package; the `.prm` to the required methods; full cover by the
    calculus (the MTL Rhein Ruhr pilot).
11. [Migrating from the YAML era](11-migrating-from-yaml.md) — the two
    trees and the round-trip discipline; the facets and packages of the
    v3 model; the gates, including the from-packages release proof; the
    path to Primmel-native authoring.

## The one-sentence summary

> Authoring a Recommendation is seven moves: model the subject, situate
> its taxonomy, constrain it with requirements, exercise it with
> conformance tests, record it with forms, judge it with evaluation — then
> package and validate until every gate is green.
