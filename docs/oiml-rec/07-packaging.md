# Chapter 7 — Packaging

> *In this chapter:* the deliverable itself. A Recommendation is shipped
> as a package with a fixed directory contract: `standard.yaml` as the
> manifest, five content layers, root document files, a Layer-1 domain
> profile, JSON Schemas, a seeded sample flow, a `primmel-packages`
> twin for the `.prl` round-trip, and `.prd` fragment extracts whose
> reconstruction gate proves the model still says what the source says.
> Then the composition question: how a rec package consumes core and
> shared modules by `uses` — reference, never redefine.

---

## 7.1 The package is the deliverable

Everything the previous five chapters authored — subject, requirements,
tests, forms, evaluation — must land somewhere a machine can find,
validate, and build. That somewhere is the **package**: one directory
per Recommendation, self-describing, registered, and complete. Two
rules from Chapter 1 govern its shape:

- **Primmel (PRL) is the single source of truth** (chapter 11 — the flip
  landed). The `.prl` packages are authoritative; the `data/<rec>/` YAML
  trees are generated artifacts (`npm run gen:data`, never hand-edited),
  and TypeScript in `browser/src/data/generated/` is derived from them at
  build time; services carry no domain content. A new Recommendation is a
  *data* addition, never a code change.
- **A new Recommendation is data, not schema.** The metamodel is schema
  only; the R 60 profile states the rule — "A new Recommendation = a new
  profile file; zero schema changes" (`oiml-r60-loadcell-profile.yaml`).

The contract below is the one R 60 ships today; R 91 and R 144 follow
the same layout, which is precisely what made the cross-standard
layering census (`analysis/cross-standard-layering.md`) measurable.

## 7.2 The `data/<rec>/` directory contract ●

```text
data/<rec>/
  standard.yaml         identity + structure registry + source
  terminology.yaml      terms; vocab_ref → viml-2022 / vim-2012
  references.yaml  notes.yaml  obligation.yaml  value-types.yaml
  navigation.yaml  parts.yaml  redirects.yaml  sample-data.yaml
  model/        instrument.yaml attributes.yaml capabilities.yaml
                behaviors.yaml conditions.yaml
  entities/     instrument.yaml parties.yaml workflow.yaml test-execution.yaml
  specification/ requirements/ conformance/ tables.yaml symbols.yaml
                calculations.yaml formulas.yaml verdicts.yaml
  execution/    forms/ subforms/ test-report.yaml test-report-checklist.yaml
  evaluation/   workflow.yaml state-machines.yaml processes.yaml gateways.yaml
                approvals.yaml roles.yaml certificate-template.yaml
                evaluation-dimensions.yaml evaluation-profiles.yaml
                lab-selection-criteria.yaml sample-selection-rules.yaml
                calculation-context.yaml
```

Each directory answers to one tier of the frame: `model/` is the primary
tier (what the subject IS/HAS/DOES), `entities/` its storable subject
chain and workflow records, `specification/` the secondary tier
(constraints and operations), `execution/` the evidence views,
`evaluation/` the tertiary judgment and workflow config. The root files
are the document machinery (Layer 0 anchoring: terminology, obligation,
value types) plus app-facing concerns (navigation, redirects) and the
Layer-3 seed (`sample-data.yaml`, §7.6).

### 7.2.1 `standard.yaml` — the manifest ●

`data/r60/standard.yaml` is the package's self-description, in three
blocks:

1. **Identity** — `id`, `shortName`, `fullName`, `baseUrn`, `version`,
   `editions`, `description`, `publisher`, `docnumber`, `doctype`. The
   `baseUrn` (`urn:oiml:pub:r:60:2021`) is the namespace every
   provenance reference in the package resolves against.
2. **`structure:`** — the registry. Every file in the package is
   registered with `path` + `label` + `description`, grouped by layer
   (model / entities / specification / execution / evaluation /
   root-level). The rule is absolute: **a file not in `standard.yaml`
   does not exist as far as the build is concerned.** The generators
   discover content through the registry, never by walking the tree.
3. **`source:`** — where the authoritative text lives: the Metanorma
   collection (`sources/r060/collection.yml`), the part documents, and
   the package's Primmel twin (`primmel: primmel-packages/oiml-r60`).

The manifest is what turns "a directory of YAML files" into "a package":
identity, inventory, provenance.

## 7.3 The Layer-1 domain profile ●

The package's data instantiates a schema it does not own. Above
`data/<rec>/` sits the metamodel
(`ontology-remix/OIML Core Models/Ontology/oiml-core-ontology.yaml`,
schema only: classes, enumerations, INV-1..10), and beside it one
**domain profile per Recommendation**
(`ontology-remix/OIML Recommendation Models/Ontology/R 60/oiml-r60-loadcell-profile.yaml`)
— the Recommendation's ontology-level data: subject taxonomy,
attribute-definition semantics, formulas, constraints, the error model.
The profile is data, not schema: adding R 91 or R 144 changed zero lines
of the metamodel (the OCP claim the gap audit verified in practice).

In the tier language of Volume I: the metamodel + profile are the
Foundations-to-Primary bridge the rec package anchors to; the rec
package never redefines metamodel classes, it instantiates them.

## 7.4 JSON Schemas for new file kinds ●

Every file kind in the package validates against a JSON Schema in
`data/schemas/` (~40 schemas: `standard-meta.yaml`, `model.yaml`,
`entities.yaml`, `rc.yaml`, `cc.yaml`, `form.yaml`, `verdicts.yaml`,
`tables.yaml`, `symbols.yaml`, `evaluation-*.yaml`, …). The discipline
for a new file kind — say, the `reference-materials.yaml` R 144 added —
is three steps, in order:

1. author the schema in `data/schemas/`;
2. register the file in `standard.yaml`'s `structure:` (and the
   `standard-meta` schema, which enumerates the known structure keys);
3. only then author content.

Schema-first is what keeps "a new file kind" from becoming "a new
silent hole in validation". The gates (`npm run validate`) run schema
validation before semantic validation; a file with no schema fails
loudly, never passes vacuously.

## 7.5 `uses` composition: core + modules + overlay ◐

One directory per Recommendation works — until the second and third
Recommendations exist and the census can measure what they share. The
measured facts (`analysis/cross-standard-layering.md` §0–1): 12 of
R 91's 34 files are *byte-identical* to R 60's; 8 of R 144's are
structurally identical; and the identical class splits in two —
genuinely shared skeletons (workflow entities, state machines,
approvals, roles, obligation) and **copy residue that is wrong for the
rec** (R 91 shipping R 60's certificate template, gateways, notes and
checklist — the deep-audit's R2 finding). The copy mechanism and the
bug mechanism are the same mechanism. Composition replaces both.

![Package composition](diagrams/package-composition.svg)

The design (layering census §5, ◐ — scaffolding landed, wiring planned
for v3):

- **Core** (`data/core/`, `id: core`, `kind: core`) — the Tier-1
  verbatim content: subject-chain and workflow entities, parties,
  evaluation skeletons (state machines, approvals, roles, workflow,
  processes), the OIML-CS 18-element report checklist, obligation
  catalog, value-type base. Never a publishable rec; the registry
  excludes `kind: core` from rec listings.
- **Modules** (`data/modules/<name>/`, `id: module-<name>`,
  `kind: module`) — seven parameterized test/form families measured out
  of the census: `module-emc-disturbances`, `module-env-iec60068`,
  `module-software-d31`, `module-reference-materials`,
  `module-specimen-governance`, `module-report-headers`,
  `module-examination-docs`. Each carries a manifest (`provides:` test
  patterns + form skeletons; `requires:` what the consumer must
  supply). The module freezes the *skeleton*; the rec binds its own
  attribute ids, severities, acceptance expressions and clause URNs.
  Parameterization is not new machinery: conformance-test `variables`
  and form `bind:` paths already do it — the module makes it a package
  boundary.
- **Rec overlay** (`data/<rec>/`) — normative content only: subject,
  dimensions, attributes, requirements, tests, forms, tables,
  terminology, plus the rec overlay of evaluation config.

The scaffolding is **shipped** (● smart e80b349): `data/core/layer.yaml`
declares `id: core` (package `oiml-smart-core`) with the OIML-CS process
requirements as its first content, and each of the seven modules declares
its `layer.yaml` (package ids `oiml-smart-module-<name>`, `kind module`).
The composition wiring is live: the registry composes the virtual
effective tree per rec — layers first, the rec's overlay merged REC-WINS
— and the existing generators consume the composed tree unchanged, so
"generated app data identical" stays a testable acceptance (the layering
snapshot tests pin it).

The consumption declaration lives on the rec's manifest — the shipped
R 144 `uses:` (YAML face), verbatim:

```yaml
# data/r144/standard.yaml (shipped)
uses:
  - iso-iec-17000      # the CASCO foundation, composed first …
  - iso-iec-17065
  - iso-iec-17025
  - iso-iec-17067
  - oiml-cs            # … then the scheme package …
  - core               # … then oiml-smart-core …
  - module-specimen-governance
  - module: module-reference-materials
    with: { subform: cgm-point }   # the rec binds its own subform id —
                                   # execution/subforms/cgm-point.yaml is
                                   # the thin overlay
```

In the package manifests the same composition reads `uses { iso-iec-17000
… oiml-cs oiml-smart-core oiml-smart-module-specimen-governance
oiml-smart-module-reference-materials }` — the layer.yaml ids map to
package ids (Volume I, chapter 8).

The composition law is the one rule that makes this safe:
**reference, never redefine.** An overlay may *reference* core and
module ids; it may never *redefine* them. The build composes a virtual
effective tree per rec (core → modules → rec, topologically ordered)
and the law is enforced twice over (●): the standards registry's
uses-no-redefine leg fails the build when a rec overlay restates a
layer's identity scalar or unions an owned multilingual array (the old
"silent skip + warning" heuristic is exactly what composition deleted;
`data-types-codegen.ts` now errors on conflicting shapes), and the
layer-owned requirement namespaces (`/req/cs/**`) reject rec-side
declarations at composition. The existing generators consume the
composed tree unchanged — so "generated app data identical" stays a
testable acceptance. Composition also tolerates partial consumers:
every module `provides` must be consumed or explicitly waived, so a rec
that binds nothing yet (R 91's preview edition) composes cleanly —
"not yet modelled", never an error.

Why not single inheritance? Because `extends` is a single string and a
rec is foundation + scheme + core + N modules. The v2 tree made the
point by dangling: every rec declared `extends oiml-core` while no such
package existed (layering census §5.2). The shipped answer is
multi-package `uses` — `oiml-smart-core` is a real package, and every
rec composes it.

### 7.5.1 A fourth package kind: `product_reference` (●)

`core`, `module`, `rec` — the three kinds above are all published from
the standards side. The model supply chain (Volume I, [chapter
15](../primmel/15-model-supply-chain.md)) adds a fourth, published by the
**manufacturer** — and it ships (● smart c24a644, task 36): the **ACME
LC-500** package holds the product model — the instrument's own
IS/HAS/DOES anatomy, authored by exactly this volume's method — with
every conformance-relevant aspect *mapped* to the Recommendation's
(`maps_to { oiml-r60 }` + `model/r60-map.prl`). Note what the package
does *not* do: it composes nothing from the rec — no `uses` edge; the
two are related by **mapping only**. Which is one more reason the id
discipline of chapters 2–4 matters: the manufacturer's conformance
claim resolves into *your* anchors.

Two consumption modes follow for the instrument user (chapter 15,
§15.3) — both shipped, both demonstrated by the quarry belt-scale
package: **abstract import** — static, version-pinned
(`uses { acme-lc500@2021 }`, reference-only under the chain checks),
design-time — and **live integration** — the deployed unit serves a
live twin inside the user's own model. The rec author's part is only to
know the package they ship is the mapping target; the certificate it
issues is what the product model cites as promises-as-verified.

## 7.6 Seed one full flow: `sample-data.yaml` ●

A package without instances is a claim; a package with a seeded flow is
a demonstration. The checklist (methodology §9.2, item 26) requires
**one full flow, end to end**:

```text
family → group → model → sample → application → request
       → report → evaluation → certificate
```

R 60 ships thirteen such flows (`data/r60/sample-data.yaml`), compiled
from fifteen real certificate PDFs in `reference-docs/certificates/` —
one manufacturer, one family, one group per certificate classification
label (`C3`/`C4`/`C6`), one model per classification-row E_max, 1–2
samples, then the workflow chain to an ACTIVE certificate. The seed is
what makes every downstream claim checkable: the store manifest builds,
the verdict matrix has evidence to re-execute, the certificate template
has classifications to print. R 144 ships two flows — and proves the
chain tolerates missing levels (family → model → sample, no groups;
Chapter 9).

The seed is also a regression instrument: the sample-data compiler
normalizes flows into store records at build time, so a modelling edit
that breaks the seed breaks the build, not the demo.

## 7.7 `primmel-packages/` — the single source of truth ●

Every rec package has a native-language twin under `primmel-packages/`
(`primmel-packages/oiml-r60/`, 88 `.prl` files plus the
`package.primmel` manifest), mirroring the YAML
layout by convention (`docs/primmel-v2-plan.md` §3):

```text
oiml-r60/
  package.primmel            # the only required file — manifest
  model/  entities/  specification/  execution/  evaluation/
  terminology.prl  references.prl  value-types.prl
  layers.prl                   # GENERATED include list (layer files used verbatim)
  payload/                     # codec exclusions shipped inside the package
  sources-prd/                 # .prd extracts + coverage/congruence payloads
```

The shipped manifest carries identity, composition and lifecycle:

```prl
package {
  id oiml-r60
  kind rec
  title "OIML R 60:2021 — R 60 package"
  version "2021"
  editions { 2021 2017 2000 1996 }
  baseUrn "urn:oiml:pub:r:60:2021"
  uses { iso-iec-17000 iso-iec-17065 iso-iec-17025 iso-iec-17067
         oiml-cs oiml-smart-core oiml-smart-module-specimen-governance }
  supersedes { urn:oiml:pub:r:60:2017 }
  validity { from 2021-01-01 }
  status current
  source { collection "sources/r060/collection.yml" parts { 1 2 3 } }
}
```

Rules: merged by convention (directory names fixed, file names free);
cross-file references by stable ids only (`/req/...`, `/conf/...`,
attribute ids — never paths). The semantic round-trip YAML ⇔ native is
implemented and CI-tested (`browser/build/yaml-to-primmel.ts` and
`primmel-to-yaml.ts` — construct-symmetric codecs, TODO.refactor/16),
and the runtime plug is proven: a full build from
`primmel-packages/oiml-r60` with zero validation errors
(`SMART_STANDARDS_SOURCE=primmel`, W6).

The migration phases have **landed**: A — YAML authoritative, converter
proves round-trip — done; B — YAML becomes generated output of the
native package — **done** (the task-31b SSOT flip, smart a549dab: the
packages are authoritative, `npm run gen:data` regenerates the YAML
trees, and `npm run test:ssot` proves both directions byte-clean; the
documented codec exclusions — pair_list blocks, formula engine
variants, the common-test-conditions register — ship inside the package
as `payload/*.yaml` and compose back, drift failing loudly); C — new
recs authored Primmel-native only — the standing rule (R 129 is the
first, task 22).

## 7.8 Registering the standard so the build sees it ●

Packaging ends in registration. The build's standards registry
discovers packages by scanning `data/*/` for `standard.yaml` and keying
on its `id` — no central list to edit. Two consequences the author must
know:

- **Id collisions shadow.** The registry resolves duplicate ids by sort
  order (later entry wins): `data/r144` shadows the legacy
  `data/oiml-r144`. Deliberate for migration, dangerous by accident —
  choose ids deliberately, and prefer deleting stale trees to
  out-sorting them.
- **Non-rec packages need a kind.** `kind: core` / `kind: module` keep
  core and modules out of rec listings, navigation and search (the
  layering census's registration rule).

Then the gates decide whether the package *is* a package:

```text
cd browser && npm run validate   # JSON-Schema + semantic (x-refs, anchors) + sample-data
cd browser && npm run build      # full codegen; YAML errors fail here
cd browser && npx vitest run     # unit tests over the generated data
```

A package that passes all three is registered, generated, seeded and
executable. Anything less is a directory.

## 7.9 Fragment provenance: `.prd` extracts and the reconstruction gate ●

Clause provenance (every element carries a clause URN) tells you *which
clause* — not *which sentence* — and it cannot prove the model still says
what the source says. Fragment provenance closes that loop: each source
document is decomposed into **addressable fragments**, published as a
**`.prd` file** (Primmel Document, the formal successor of the Demo
`.sdc` seed), model elements bind fragment addresses, and a congruence
gate reconstructs the document from the model.

### The `.prd` artifact

One file per source document part, at `data/<rec>/sources-prd/
<part>.prd.yaml` (schema `data/schemas/prd.yaml`):

```yaml
prd: "0.1.0"
document:
  urn: "urn:oiml:pub:r:60-1:2021"
  title: "Metrological regulation for load cells — Metrological and technical requirements"
  edition: "2021"
  part: "1"
  source: { adoc: "sources/r060/1/document.adoc",
            presentation: "data/r60/documents/1/document.presentation.xml",
            extractor: "scripts/extract-prd.py" }
fragments:
  - path: clause-5.2.1        # address = document.urn + "#" + path
    kind: provision           # provision | definition | table | figure | note | example | front-matter
    normative: true           # coverage counts normative fragments
    clause: "5.2.1"
    title: "Minimum load of the measuring range (D_{\"min\"}) (see 3.5.12)"
    parent: clause-5.2
    text: |-                  # near-verbatim: math as asciimath, xrefs resolved
      The value of the smallest load applied to a load cell during test which
      is expressed in units of mass shall not be less than E_{"min"} (see 3.5.9).
  - path: clause-5.3/note-1   # block sub-addresses within a clause
    kind: note
    normative: false
    parent: clause-5.3
    text: MPE is applicable after increasing as well as decreasing …
  - path: table-4             # numbered tables/figures are document-level
    kind: table
    normative: true
    parent: clause-5.3.2
    text: …
```

Extracts are **regenerable artifacts, never hand-edited**
(`scripts/extract-prd.py` reads the compiled Metanorma presentation XML
of the `sources/<rec>/` tree — the presentation materializes the printed
clause numbering, obligations and captions the raw adoc lacks). Where
extraction is imperfect, curations go in the extractor's `OVERRIDES`
table with a clause-referenced reason; `prd.test.ts` re-runs the
extractor and fails on any drift.

### The binding protocol

Every provenance form an element already carries is a fragment address,
and the linker's **R27 `fragment-references`** rule resolves all of them
against the cited document's `.prd`:

- `reference: "urn:…#clause-5.2"` — the coarse, human-legible citation;
- **`source: { doc, clause, fragment? }`** — the machine-checkable
  binding (rc/cc schemas): a single map, or a list when the element
  realizes a whole clause family (a test binding its procedure's step
  clauses 2.10.1.1–16). The optional `fragment` key composes
  sub-addresses (`…#clause-5.2/s2`) once finer fragments exist;
- form `references: [{ urn, role }]` — the report form realizes its
  R 60-3 section (`role: report-format`) and the calculation procedures
  behind its derivations (`role: calculation`);
- terminology `source:` — a URN list citing both the vocabulary origin
  (VIML/VIM) and the Recommendation's own clause-3 definition fragment;
- tables' `source: { doc, clause }` maps (a table address like
  `table-1` passes through as-is).

A citation that resolves to no declared fragment is a build error — the
rule burned every dangling pseudo-address the corpus carried (lettered
list items, `-option`/`-cond` suffices, a pre-2021 renumbering), each
remapped to the clause the content actually resides at, with the remap
recorded in the file's header comment.

### The congruence gate

The model emits an ordered fragment stream per document — every `.prd`
fragment in document order, carrying its bound elements (clause tree →
provisions → supplements) — and the gate (a `npm run validate` section,
`browser/build/prd-congruence.ts`) proves it on three axes:

- **coverage** — every *normative* fragment is bound by ≥1 model
  element. Deliberate absences are **named gaps** in
  `sources-prd/congruence.yaml` with clause-referenced reasons; a gap
  that becomes bound is STALE and fails.
- **order** — the model does not reorder the document's logic: an
  element's bindings follow source order, and each document-following
  file's elements follow source order by first bound fragment. Thematic
  registries (per-class variants, symbol/calculation registers) take
  `order_exceptions`, stale-guarded. Form files are evidence views keyed
  by the report structure and are exempt.
- **text identity** — a bound statement/definition appears verbatim, up
  to normalization (asciimath → plain symbols, punctuation dropped), in
  its fragment's subtree text. Paraphrase drift fails; deliberate
  condensations and per-class specializations take `text_exceptions`,
  stale-guarded.

The acceptance discipline: the R 60 reconstruction covers **100 % of
normative fragments — bound or documented gap** (R 60-1: 132 bound +
7 gaps of 139; R 60-2: 142 + 9 of 151; R 60-3: 275 + 16 of 291 — the
census is test-pinned), and the gate is mutation-proven
(`prd-congruence.test.ts`: seeded coverage gaps, order inversions, text
mismatches and stale named gaps each fail it). The sentence layer on
the same extracts (task 26) refines the census to **274/293 normative
sentences bound (93.5 %)**, 19 sentence-pinned allowances, 0 unresolved
duplicates, gated ratio 100 % per part (Volume I, chapter 9).

## 7.10 Grammar sketch *(the shipped forms)*

```prl
# ── the rec manifest (PRL face) ────────────────────────────
package {
  id oiml-r144
  kind rec
  baseUrn "urn:oiml:pub:r:144:2013"
  editions { 2013 }
  uses { iso-iec-17000 iso-iec-17065 iso-iec-17025 iso-iec-17067
         oiml-cs oiml-smart-core
         oiml-smart-module-specimen-governance
         oiml-smart-module-reference-materials }
  source { collection "sources/r144/collection.yml" parts { 1 2 3 } }
}
```

```yaml
# ── the module binding (YAML layer-manifest face) ──────────
uses:
  - module: module-reference-materials
    with: { subform: cgm-point }   # slot binding; an each: slot
                                   # binds a list of maps
```

```prl
# ── the module manifest ────────────────────────────────────
package {
  id oiml-smart-module-emc-disturbances
  kind module
  uses { oiml-smart-core }
  requires { oiml-smart-core }
  provides { disturbance-test-skeletons disturbance-form-skeletons
             disturbance-verdict-variants }
  # the rec binds: observable ids, severities, acceptance expressions, clause URNs
}
```

## 7.11 Validation rules

Package-level checks the linker and gates enforce:

- every file in the tree is registered in `standard.yaml`
  `structure:`, and every registered path exists (no ghosts, no
  orphans);
- every file validates against its `data/schemas/` schema — a new file
  kind without a schema is an authoring error;
- every `uses:` entry resolves to a declared core/module package;
  `requires:` of every consumed module is satisfied by core + earlier
  modules + the rec itself;
- no id is defined twice across the composed tree — the overlay
  references upstream ids, never redefines them;
- every module `provides` is consumed by the rec or explicitly waived;
- `sample-data.yaml` seeds at least one complete flow: every workflow
  entity in the chain present, every FK resolving, `standard_id`
  consistent throughout;
- `source:` resolves: the declared parts exist under `sources/`, and
  the `primmel:` twin (when declared) loads with zero errors.

## 7.12 Summary

- One directory per Recommendation, self-describing via
  `standard.yaml`: identity block, `structure:` registry (unregistered
  files do not exist), `source:` provenance.
- The Layer-1 domain profile carries ontology-level data per rec; the
  metamodel never changes for a new Recommendation.
- New file kinds are schema-first; the gates fail loudly on the
  unregistered and the unvalidated.
- Composition is `uses: [core, modules…]` with one law — reference,
  never redefine — producing a virtual effective tree the existing
  generators consume unchanged (● — core + the seven modules ship as
  `kind` packages; R 60, R 144, R 129 are the proving consumers; the
  census measured why).
- `sample-data.yaml` seeds one full flow family → … → certificate; the
  `.prl` twin under `primmel-packages/` is the single source of truth —
  the YAML trees regenerate from it, byte-clean in both directions
  (task-31b flip).
- `sources-prd/` holds the `.prd` fragment extracts — regenerable from
  the Metanorma presentation by `scripts/extract-prd.py`, schema-checked
  by `data/schemas/prd.yaml`; every element's provenance resolves
  against them (linker R27), and the reconstruction gate proves
  coverage + order + text identity at 100 % of normative fragments,
  bound or documented named gap (TODO.roadmap/24).
- Registration is discovery by manifest id plus the three gates:
  validate, build, vitest.
- A fourth package kind, `product_reference` (●), lets a manufacturer
  ship the product model mapped to the rec — the package you author is
  the mapping target, consumed by abstract import or live integration
  (Volume I, chapter 15; §7.5.1).

*Next: [Chapter 8 — Walkthrough: OIML R 60](08-walkthrough-r60.md):
the worked example, end to end — from three source documents to a
running package.*
