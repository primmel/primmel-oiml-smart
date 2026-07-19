# Volume I — The Primmel Kernel

Primmel is a domain-specific language for representing SMART standards in
an **executable** form. A Primmel-modelled standard is a structured
artifact whose subjects, requirements, processes, data requirements and
evidential requirements are defined precisely enough that a computer can
validate them, query them, execute them, and reason about them.

Primmel v2 (formerly MMEL) established the four pillars — **data**,
**process**, **compliance**, **measurement** — and the artifact kinds
`.prl` / `.prd` / `.prm` / `.pws`. Primmel v3 keeps all of it and adds the
layer the compliance use-case always needed: **the subject**.

## The v2 → v3 delta

| v2 (today) | v3 (this volume) |
|---|---|
| provisions as text + modality | **subjects** with a full anatomy (IS/HAS/DOES); requirements as constraints bound to subject aspects |
| processes as canvas nodes | processes as **recursive subjects** — abstract or executable, with state, registers, executors |
| one model kind | **reference vs implementation** model kinds, with mapping as the compliance relation |
| mapping coverage (full/minimal/partial) | same calculus, now machine-checked against typed anchor sets |
| data classes + registries | same, plus **quantities/units**, typed variables, tables/profiles, time primitives |
| models | **packages** with `uses` composition, modules, editions, model diff |
| references to clauses | clause + **fragment** provenance, document reconstruction, text-coverage audit |
| — | multilinguality (ISO 24229), interop projections (ReqIF, RDF/OWL, OpenCDD) |

## The chapter map

1. [Philosophy and tiers](01-philosophy-and-tiers.md) — why executable
   standards; the design principles; the tier system that organizes every
   model; the four artifact kinds.
2. [Subjects](02-subjects.md) — the center of the primary tier; the
   IS/HAS/DOES anatomy; the aspect catalog; what makes each aspect IS vs
   HAS vs DOES.
3. [Instantiation](03-instantiation.md) — definition and instance; the
   subject chain; Sample as instance of Model; delegation.
4. [Processes](04-processes.md) — abstract and executable processes; the
   step vocabulary; executors; state; evidence.
5. [Mappings](05-mappings.md) — reference and implementation models; the
   coverage calculus.
6. [Data and values](06-data-and-values.md) — registries, variables,
   quantities, tables, time.
7. [Expressions](07-expressions.md) — OCL as the one rule language.
8. [Packages](08-packages.md) — composition, modules, editions.
9. [Provenance and documents](09-provenance.md) — fragments, `.prd`,
   reconstruction.
10. [Multilinguality](10-multilingual.md) — ISO 24229.
11. [Validation](11-validation.md) — schemas, the linker, `primmel check`.
12. [Interop](12-interop.md) — ReqIF, RDF/OWL, OpenCDD.
13. [Model diff and lifecycle](13-diff-and-lifecycle.md).

## The one-sentence summary

> A Primmel package models a **subject** (what it IS, HAS and DOES),
> constrains it (**requirements** bound to its aspects), exercises it
> (**processes** — tests that constrain inputs, conditions and state while
> observing outcomes), records the exhibition (**evidence** in registries),
> and judges it (**verdicts** re-executable against the evidence) — with
> every element provenance-anchored to the source document and every
> implementation mapped to its reference.
