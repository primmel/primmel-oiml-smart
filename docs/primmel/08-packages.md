# Chapter 8 — Packages

> *In this chapter:* how models are published, composed, and versioned —
> the package manifest, the directory convention, `uses` composition
> across packages, the layering rules that keep overlays honest,
> modules, editions, and the native ⇔ YAML round-trip.

---

Chapters 1–7 modelled content. This chapter models *containment*: how
a body of content becomes a distributable, composable, versioned unit —
where a model begins and ends, how one model builds on another without
copying it, how two editions coexist. The running system's answer is
on disk: `primmel-packages/oiml-r60/` is the full R 60 Recommendation
as `.prl` files, and it runs the application end to end (●).

## 8.1 The manifest

A package is a directory whose root carries `package.primmel` — the
only required file; everything else is merged by convention. The
manifest of the running R 60 package, verbatim:

```prl
package {
  id oiml-r60
  title "OIML R 60:2021 — R 60 package"
  version "2021"
  editions { 2021 2017 2000 1996 }
  baseUrn "urn:oiml:pub:r:60:2021"
  extends oiml-core
  description "Metrological regulation for load cells — requirements, test procedures, and test report forms."
  source { collection "sources/r060/collection.yml" parts { 1 2 3 } }
}
```

The fields, each doing one job:

- **id** — the package's name in the global id-space; all cross-package
  references (`Namespace#ElementID`) key on it.
- **title / description** — the human face; multilingual in v3
  (chapter 10).
- **version** — the package's own version, the coordinate edition
  pinning (INV-8) records against.
- **editions** — the document editions this package's lifecycle covers
  (§8.5).
- **baseUrn** — the provenance root: clause URNs
  (`urn:oiml:pub:r:60-1:2021#clause-5.2`) resolve against it (chapter 9).
- **source** — the authoritative document collection the package models,
  down to its parts; the anchor for the text-coverage and
  reconstruction audits (chapters 9, 11).
- **extends** — the v2 single-parent declaration; §8.3 shows why v3
  replaces it with `uses`.

## 8.2 The directory convention

Inside the package, content is split by layer — the same five-layer
split the YAML tree uses (`data/r60/`), so the round-trip is
structurally obvious:

```text
oiml-r60/
  package.primmel          # the manifest — the only required file
  model/                   # the subject: instrument, attributes, capabilities,
                           # behaviors, conditions  (primary tier)
  entities/                # storable classes: subject chain, parties, workflow
                           # (registries: store/indexes/FK graph)
  specification/           # requirements, conformance, tables, symbols,
                           # calculations, formulas  (secondary tier)
  execution/               # forms, subforms, test-report skeleton (evidence views)
  evaluation/              # workflow, state machines, gateways, approvals,
                           # certificate, selection (tertiary tier)
  terminology.prl          # terms with vocab_ref into the registers
  references.prl           # document references
```

Directory names are fixed; file names within them are free; the loader
merges all files into one effective model. References cross files **by
stable id only** — `/req/metrological/mpe`, `load-cell-errors`,
`e_max`, `Manufacturer` — never by path. One id space per package: the
same identifier defined twice anywhere is a duplicate-id error at load
(● W2 loader, cross-file duplicate detection). An author reorganizes
files freely; nothing that referenced the content can tell.

The convention is the tier system made visible on disk: `model/`
primary, `specification/` secondary, `evaluation/` tertiary,
`entities/` the registries. A new Recommendation adds a package
directory and changes zero existing files (OCP).

## 8.3 Composition: `uses`

No Recommendation stands alone. R 60 needs the metamodel's subject
chain, the OIML-CS workflow skeletons, the EMC test family, the IEC
60068 methods. The v2 manifest expresses this with a single-string
`extends: oiml-core` — and that is precisely where v2 runs out:

- **Single inheritance cannot express the real shape.** A rec package
  is *core + N modules*, not *one parent*. Verified in the running
  tree: every rec `package.primmel` declares `extends oiml-core`, and
  no `oiml-core` package exists in `primmel-packages/` — the reference
  dangles.
- **Copy-residue is the failure mode composition must kill.** The
  cross-standard census found 12 R 91 files byte-identical to R 60 and
  8 R 144 structurally identical — including copies *wrong* for the
  copying rec (R 91 shipping R 60's gateways and certificate
  template). Between "copy" and "restate from scratch" there was no
  mechanism. `uses` is that mechanism.

v3 composition (○ — the target design, grounded in the layering
analysis):

```prl
package {
  id oiml-r144
  ...
  uses [ core, emc-disturbances, env-iec60068, reference-materials,
         report-headers, examination-docs ]
}
```

The semantics:

- **Topological merge.** Dependencies order themselves — core, then
  modules, then the rec overlay — and the effective model is the
  merge, fed to the generators unchanged.
- **An overlay may reference, never redefine.** Any id defined
  upstream is *used* downstream, and redefining it is a linker error —
  conflict detection moves from "silent skip + build warning" (today's
  codegen heuristic, which sorts R 60 first so its shapes win) to an
  explicit error.
- **Requirements are checked.** Each module's `requires` must be
  satisfied by core, by previously merged modules, or by the rec
  itself; absent *optional* facets are "not yet modelled", not errors
  — partial consumers (R 91 today) compose cleanly.
- **An implementation package maps, it does not extend.** A lab's SOP
  package declares `uses` for vocabulary, then *maps* its processes to
  the reference package (chapter 5). Composition is for structure;
  mapping is for compliance.
- **A package classifies itself in its own manifest.** Facets like
  `scheme_type: <type-id>` let a package that *implements a scheme*
  classify itself against a taxonomy package (ISO/IEC 17067's scheme
  types 1a–6 — chapter 4's classification doctrine, hoisted to package
  level): the OIML-CS layer declares `scheme_type: type_1a` (B 18:2025
  §1.3). The declaration never lives in the taxonomy package — a
  foundation package naming its consumer would invert the composition.
  The id must resolve against a register composed *earlier* in the
  `uses` list (`checkUses` fails the composition otherwise), and
  downstream gates may read the classification mechanically — the
  OIML-CS coverage gate discharges type-conditioned checklist items
  against it (Volume IV, chapter 7).

## 8.4 The layer stack

Packages arrange into the layer stack the concept frame fixes:

| Layer | Package kind | Contents | Status |
|---|---|---|---|
| 0 | vocabulary registers | glossarist VIML/VIM term registers (sibling repo) | ● |
| 1 | Primmel kernel | the language itself — this volume | ● (this documentation) |
| 2 | OIML core + CASCO foundation + scheme | `data/core/` (subject chain, parties, workflow, state machines, CS registries); the four ISO/IEC CASCO packages (17000/17065/17025/17067); the `oiml-cs` scheme package — composed into every rec's effective tree in `uses:` order | ● (composition, linker and coverage gates green — Volume IV) |
| 2b | shared modules | parameterized test/form families | ◐ (seven identified; manifests sketched) |
| 3 | rec packages | normative content only: subject, dimensions, attributes, requirements, tests, forms, tables, terminology | ● (R 60, R 91, R 144) |

The seven shared modules the census isolated — each a family that at
least two Recommendations replicate with only parameters differing:

- `emc-disturbances` — the IEC 61000-4-x immunity family (esd, bursts,
  surge, rf-emf, …): stabilize-baseline → apply disturbance at
  severity → record observable → fault verdict.
- `env-iec60068` — climatic/mechanical methods (dry-heat, cold,
  damp-heat cyclic/steady, vibration, shock, ambient-pressure).
- `software-d31` — the OIML D 31 software-examination checklist.
- `reference-materials` — certified reference records (certified value + uncertainty)
  and the U:MPE validity hook.
- `specimen-governance` — sample-selection rules and EUT continuity.
- `report-headers` — bind-driven TRF identification/conditions blocks.
- `examination-docs` — documentation/marking examination skeletons.

A **module** is a shared, parameterized package: it freezes a skeleton
(variables with source typing, steps, verdict pattern, form skeleton)
and declares what consumers must bind — `provides` (the patterns),
`requires` (what core and the consumer supply), and the consumer's
`with:` bindings (its attribute ids, severities, acceptance
expressions, clause URNs). R 60 consumes `emc-disturbances` with
observable `indication` in counts/v and the significant-fault verdict;
R 144 with `e_x` in ppm and the `within_limits_or_detected` verdict —
one skeleton, two bindings, zero copies.

The supply chain of chapter 15 adds one package kind beside the stack:
**`product_reference`** (○) — the manufacturer's product model, mapped
aspect-by-aspect to the Recommendation. A user consumes it as an
**abstract import** — static reference content under the same
version-pinning discipline `uses` enforces: no unpinned consumption —
or as a **live integration** of the deployed instance's twin. Chapter
15 is the authority for both modes; the package layer treats the kind
as one more composable unit.

## 8.5 Editions and lifecycle

The manifest's `editions { 2021 2017 2000 1996 }` is not decoration.
Editions are **arbitrary packagings used for provenance and lifecycle
management** — orthogonal to the kernel, and to be implemented as such:

- **Edition pinning.** Every definition executed in a run is
  version-pinned in the test report (● INV-8), so a re-evaluation
  under a new edition is an explicit act.
- **Versioning relations live on the package, not in subject models.**
  Supersedes/replaces chains and validity windows are manifest
  content; a 2000-edition load cell and a 2021 one differ by package
  reference, not by a version field smeared through the subject graph.
- **Model diff** is the kernel capability editions owe: structural
  diff between two package versions (elements added/removed/changed,
  including mapping diff), powering edition comparison, change audit,
  and clause-drift detection. Chapter 13 develops this in full (○).

## 8.6 Round-trip: Primmel-native ⇔ Primmel-YAML

A package has two serializations with a **semantic round-trip** between
them (● — implemented and tested): Primmel-native `.prl` (the
authoring form) and Primmel-YAML (the runtime form, `data/r60/`).
The contract:

- **YAML → native**: one `.prl` file per YAML file, per the §8.2
  convention; every YAML construct has a native counterpart.
- **Native → YAML**: parse the package, emit the exact runtime shapes
  (snake_case keys, structure-map paths); output passes the JSON
  Schemas and `npm run validate`.
- **Round-trip fidelity**: `native → yaml → native` deep-equal after
  normalization; `yaml → native → yaml` deep-equal modulo unordered-
  map ordering — property-tested over the entire R 60 tree, not
  samples. Comments become `note:` fields; meaningful order (steps,
  transitions, table rows) is preserved; unknown constructs fail
  loudly, never silently drop.
- **The runtime plug**: a Primmel package drops into the SMART build
  (`SMART_STANDARDS_SOURCE=primmel`) and compiles to the same
  generated artifacts — the app runs identically from either
  serialization (● W6: zero validation errors).

The point is not format sympathy but that *the model is the source of
truth in both directions*: authoring and runtime forms are projections
of one semantics, so neither drifts from the other without the test
kit failing.

## 8.7 Grammar sketch *(illustrative v3 syntax)*

```prl
# ── a rec package manifest ─────────────────────────────────
package {
  id oiml-r60
  title "OIML R 60:2021 — Metrological regulation for load cells"
  version "2021"
  editions { 2021 2017 2000 1996 }
  baseUrn "urn:oiml:pub:r:60:2021"
  source { collection "sources/r060/collection.yml" parts { 1 2 3 } }
  uses [ core, emc-disturbances, env-iec60068, software-d31,
         reference-materials, report-headers, examination-docs ]
}

# ── a scheme package classifies itself ─────────────────────
package {
  id oiml-cs
  uses [ iso-iec-17000, iso-iec-17065, iso-iec-17025, iso-iec-17067 ]
  scheme_type type_1a        # resolves against the 17067 register
}                            # composed earlier — never a record inside it

# ── a module manifest ──────────────────────────────────────
module emc-disturbances {
  provides {
    test_patterns  [ esd, bursts, surge, rf-emf, conducted-rf,
                     power-voltage-variation, short-time-power-reduction ]
    form_skeletons [ disturbance-test-form ]
  }
  requires {
    core [ entities/instrument, entities/test-execution ]
  }
  parameters {
    observable      : symbol        # consumer's measured quantity
    severity_table  : table         # consumer's severities
    verdict_pattern : expression    # significant-fault | within_limits_or_detected
  }
}

# ── the consumer binds, never redefines ────────────────────
use emc-disturbances with {
  observable      e_l
  severity_table  emc_severities
  verdict_pattern ocl{ not significant_fault }
}
```

## 8.8 Validation rules

- `package.primmel` is present and complete: id, title, version,
  baseUrn; the id is unique across the composed set (●);
- one id space per merged package: a duplicate id across any two files
  or layers is an error (● within a package today; ○ across `uses`
  boundaries with the v3 merge);
- overlay discipline: no id defined upstream is redefined downstream;
  every `requires` is satisfied by an earlier layer; every module
  `provides` is consumed or explicitly waived (○);
- `uses` is acyclic and topologically mergeable; a cycle is an error (○);
- a manifest classification facet (`scheme_type:`) resolves its id
  against a register package composed earlier in the `uses` list;
  the classification record never lives inside the taxonomy package (●);
- every cross-file and cross-package reference resolves by id
  (`Namespace#ElementID` across packages); path references are
  rejected (● within packages, ○ across);
- editions are a descending, duplicate-free list; the pinned edition
  of any executed definition exists in the list (● INV-8 pinning; ○
  the diff checks of chapter 13);
- round-trip: the package converts both directions with zero loss
  warnings; a hand-introduced semantic edit fails the kit (●).

## 8.9 Summary

- A package is a directory with one manifest (`package.primmel`: id,
  title, version, editions, baseUrn, source) and a fixed five-
  directory convention mirroring the tier system.
- References cross files by stable id, never by path; one id space per
  package makes reorganization free.
- `uses: [core, modules…]` replaces single-string `extends` —
  topological merge, overlay-may-reference-never-redefine.
  Composition is for structure; implementation packages map, they do
  not extend; a scheme package classifies itself (`scheme_type:`)
  against a register composed earlier.
- Packages stack: vocabulary registers, kernel, OIML core with the
  CASCO foundation and the scheme package (● — composed into every
  rec), seven shared parameterized modules, rec overlays.
- Editions are lifecycle packaging: pinning (INV-8) today, model diff in chapter 13.
- The native ⇔ YAML semantic round-trip is implemented and
  property-tested; the app runs from either serialization.

*Next: [Chapter 9 — Provenance](09-provenance.md): clause and fragment
provenance, `.prd` extracts, and document reconstruction.*
