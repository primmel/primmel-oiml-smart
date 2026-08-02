# Volume IV — The OIML-CS Scheme

This volume teaches the certification system itself: the OIML-CS as a
**reference package** — modelled from B 18:2025 and the twelve governing
documents, defined by delegation to the ISO/IEC CASCO corpus, executed by
the platform's two runtimes, and audited by one unified coverage report.
Everything here is grounded in the running system: `data/oiml-cs/` is the
package, `browser/src/data/` its calculi, and `npm run validate` prints
the coverage table this volume explains.

A Recommendation says what an instrument *is* and when it *conforms*;
the OIML-CS says how conformity is *established, certified and kept
honest* — who may act (participants, organs), under what competence
(delegated to ISO/IEC 17065/17025), through which process (PD-05's type
evaluation), with which instruments of discipline (Declarations,
appeals, deregistration, the registered-copy validity source). Neither
content kind owns the other: R 60 never says how an application is
reviewed; PD-05 never says what a load cell's MPE is. That boundary is
why the scheme is its own package — and its own volume.

The volume assumes Volume I (the Primmel kernel — abstract processes,
mappings, the coverage calculus) and Volume II (the OIML core — the
subject chain, parties, workflow entities). Volume III is the sibling
story: how a Recommendation is authored; this one is how the scheme that
certifies against it is modelled and run.

## Who reads this volume

**Track D — the scheme operator, certification body, or assessor.** You
run (or audit) a certification operation and want to know what the model
claims: which document says what, where the platform executes the scheme
and where it honestly does not (yet), and how coverage answers "does
this operation fulfil the scheme?" as a computation. Prerequisite
reading: `primmel/` chapters 4–5 (processes, mappings and the coverage
calculus), `oiml-core/` chapter 8 (parties and workflow).

**Track C — the Recommendation author.** You compose the scheme package
into every rec (`uses: […, oiml-cs, core, …]`); chapters 1–2 tell you
what that composition pulls in and why you never restate it, chapter 4
tells you which scheme provisions your rec's workflow validates against.

## The package contract

The scheme is one layer under `data/oiml-cs/` — a `kind: core` package
that every Recommendation composes after the four CASCO foundation
packages:

```text
data/oiml-cs/
  layer.yaml                    id oiml-cs, requires the four CASCO layers,
                                scheme_type: type_1a  (B 18:2025 §1.3)
  framework/                    the B 18:2025 constitution (chapter 1):
    participants.yaml             clause-5 kinds + organs as actors
    schemes.yaml                  Scheme A/B + the category lifecycle (§15)
    declarations.yaml             the Declaration model + signing gate (PD-08)
    documents.yaml                the clause-6 hierarchy + §4.2 auto-inclusion
    governance.yaml               organ decision rules (clauses 9–16)
  documents/<doc>/              the eleven governing-document modules
    requirements.yaml             (chapter 3): provisions /req/cs/<doc>/*
    abstract-processes.yaml       the document's pipeline, framework-bound
    annex-<guide>.yaml            optional informative guide (D 30 / D 32)
  specification/requirements/   cs.yaml — the 34 PD-05 provisions (chapter 4)
  evaluation/                   abstract-processes.yaml — the 8-step scheme
                                process + off-sequence flows
  execution/                    test-report-checklist.yaml — the 18 elements
  oiml-cs-to-17065.prm          the corpus ⇒ functional-approach map
  oiml-cs-to-17067.prm          the corpus ⇒ scheme-content checklist map
```

Three rules make the contract binding, and every chapter leans on them:

- **Delegation, never restatement (MECE).** Competence content lives
  only in the CASCO packages; the framework's `delegates_to:` facets
  *reference* them. A grep for ISO provision text inside `data/oiml-cs/`
  comes back empty — by test.
- **Classification, never inheritance.** Processes and the scheme itself
  classify against registers (`activity_kind:`, `scheme_type:`); nothing
  subclasses a register entry. Chapter 2 develops the doctrine.
- **Clause anchors cite the official published numbering.** The local
  presentation XMLs of the corpus are numbered official−1 and are never
  cited; every anchor was verified against the published PDFs where they
  exist locally, against the corpus audit otherwise — and the modules
  say which, in their headers.

## The gates

The scheme package is held to the same command gates as every layer, run
in the `oimlsmart/smart` repo:

```text
cd browser && npm run validate   # schemas + linker (R23–R26) + the coverage gates
cd browser && npx vitest run     # unit suites: framework, pipelines, runtimes, coverage
cd browser && npm run test:e2e   # puppeteer: the gate, the vote, appeals, validity
```

Status markers used in this volume: ● exists in the running system ·
◐ partial · ○ planned. Where the platform does not yet execute a modelled
obligation, the text says so — the coverage report of chapter 7 is the
machine-checked form of that honesty.

## The chapter map

1. [The scheme architecture](01-scheme-architecture.md) — the B 18:2025
   constitution: participant kinds and organs, Schemes A and B with the
   two-year lifecycle, Declarations and the signing gate, the document
   hierarchy, the governance rules.
2. [The CASCO foundation](02-casco-foundation.md) — why the scheme is
   defined by delegation to ISO/IEC 17000/17065/17025/17067, and the
   facet trio (`activity_kind`, `segregation:`, `scheme_type:`) that
   makes the delegation machine-checkable.
3. [The documents corpus](03-documents-corpus.md) — the per-document
   module convention and what each of PD-01…PD-09, CID-01, OD-01/02
   contributes.
4. [The certification workflow](04-certification-workflow.md) — PD-05 as
   abstract processes + 34 provisions, `realized_by` binding to the
   concrete Core processes, and the `.prm` coverage discipline.
5. [The participant runtime](05-participant-runtime.md) — the registry,
   the approval pipeline with the MC 80 % vote, and the issuance gate
   that fails closed.
6. [The operations runtime](06-operations-runtime.md) — Scheme A MTL/ANR
   processing, utilization and the denial discipline, appeals windows,
   post-issuance lifecycle, and the register as the §15.8 validity
   source.
7. [The coverage machinery](07-coverage-machinery.md) — the `.prm` maps,
   the unified per-document report, the named-gap doctrine, and the
   mutation proofs that keep the gate a gate.
8. [The flow, executable](08-the-flow-executable.md) — the certification
   workflow running end to end: the four role consoles, the sample
   custody chain, the per-run marks, the CNML-signed issuance, the BIML
   registration, and the two deployment modes.

## The one-sentence summary

> The OIML-CS is a constitution plus a corpus, defined by delegation to
> CASCO, executed where the platform walks its pipelines and gates, and
> audited by a coverage report that names every gap it has not yet
> closed.
