# Alternatives Audit — DIN DKE SPEC 99200 and the IEC-ISO Core Ontology

> *In this document:* the two document-centric alternatives the frame
> was audited against, what each actually models (from their corpora,
> not their brochures), where Primmel v3 is strictly superior, what was
> adopted from them, and what was deliberately rejected.

The audit record lives in `docs/primmel-concepts.md` §1, §9 and §12 of
the `oimlsmart/smart` repository; this document is the developed form.
Sources (both are sibling checkouts under `~/src/`): the DIN DKE SPEC
99200 project
(`external/DIN_DKE_SPEC_99200__ReqIF_interpretation_for_public_standards/`)
and the IEC-ISO Core Ontology share
(`mn/sdu-smart/reference-docs/smartsdu-information-model-share-c6362d946900/`).

---

## 1. Why an audit

Both alternatives are serious, standards-body-backed answers to the same
question Primmel answers: *what is a standard, to a machine?* They were
examined for two purposes — to confirm that the executable frame is a
strict superset (so exports to their ecosystems are projections, never
compromises), and to harvest whatever they do better. The verdict in
advance: both stop at the document's text; neither can say what a
requirement constrains, whether something conforms, or how conformity is
established. But each owns machinery the frame lacked, and §5 lists what
was taken.

## 2. DIN DKE SPEC 99200 — the ReqIF profile

*ReqIF interpretation for public standards* (2025-03) fixes a
data-model convention for exchanging standards content between
requirements-management tools — DOORS, Polarion (the project ships a
Polarion template under `Utilities/Templates/`) — using OMG ReqIF as
the wire format, with a Schematron checker for conformance
(`Utilities/Schematron/`). It is, by its own clause 11, an **import /
management / export convention** for target software: an interchange
profile, not a semantics.

The model, read from the profile's own ReqIF serialization
(`Examples/DIN_DKE_SPEC_99200.reqifz`):

- **Three spec-object-types** — `document` ("Documents"), `heading`
  ("Clause and Section Headers"), `provision` ("Governing and
  assertional provisions, as well as tables, lists, images and so on").
  The whole standard becomes rows of these three types.
- **One relation type** — `cross-reference`. Every typed link a standard
  contains (binds, verifies, supersedes, cites) flattens into it.
- **XHTML as the semantic carrier** — the provision's meaning is its
  `ReqIF.Text` blob; everything else is metadata *about* the blob.
- **`obj.modality`** — an enumeration: `constraint`, `requirement`,
  `recommendation`, `capability`, `permission`, `possibility`,
  `ambiguous`, `undefined`, ordered by bindingness. The profile's own
  note on the `constraint` value admits the seam (clause 8.2.1.2 of the
  spec, per its ReqIF serialization in
  `Examples/DIN_DKE_SPEC_99200.reqifz`): *"Although an external
  constrains [sic] is formally not a modality, the obj.modality
  (8.2.1.2) contains the value 'constraint' since the attribute
  represents not only modalities but all levels of obligations for the
  user."* — so `requirement` is duplicated in effect by
  `constraint`, and the enum conflates verbal form with obligation
  source. Because modality is mined from text by NLP, the enum needs its
  escape hatches (`ambiguous` when a fragment mixes modalities;
  highest-bindingness wins when a division aggregates sentences).
- **`obj.normativity`** — `normative` / `informative` / `undefined`.
- **`smart-type`** — a coarse semantic tag: `actor`, `condition`,
  `margin`, `performance`, `system`, `undefined`.
- **`use.*` context filters** — `use.business-process`,
  `use.business-sector`, `use.location`, `use.product-category`,
  `use.product-life-cycle`, `use.project-phase`, `use.purpose` and
  kin: multi-valued applicability *tags* for filtering rows by context
  of use.
- **`bib.*` tri-lingual metadata** — `bib.tg.title-german`,
  `bib.ti.title-english`, `bib.tf.title-french` plus per-language
  descriptor sets; `ids.*` identifiers; `pub.*` transformation
  provenance (tool, date, checked-flag).

What this buys: lossless-enough exchange of a standard's text between RM
tools, with modality and context filters good enough to *find* things.
What it cannot buy: a requirement is a tagged paragraph, not a bound
expression — nothing says *what* `margin` constrains, with which unit,
against which limit; there are no values, no tests, no verdicts, no
processes. Applicability is a tag match, not an evaluation.

## 3. The IEC-ISO Core Ontology — narrative fragments in OWL/RDF

The IEC-ISO Core Ontology (derived from the IEC SG12 SIM work;
`information_model/ontologies/core-ontology.ttl`, CC BY-SA 4.0) is a
*representation* ontology for linked data. Its README states the scope
plainly: concepts from the ISO/IEC Directives Part 2 (sections 3, 6, 7),
facts extractable automatically as RDF, and — deliberately —
**"Narrative (text-based) content and not other forms (figures,
equations, tables)"**.

The class structure (verified in the `.ttl`):

- **`smart:Provision`** with eight subclasses per the Directives:
  `Requirement`, `Recommendation`, `Permission`, `Possibility`,
  `Capability`, `Statement`, `Instruction`, `ExternalConstraint` — each
  carrying its `skos:definition` and an `rdfs:seeAlso` into the
  Directives' anchors. This is the modality taxonomy done as a class
  hierarchy, cleanly separating what DIN's enum fuses (an
  `ExternalConstraint` is a *kind of provision*, not a fake modality).
- **Document structure** — `smart:Clause ⊑ smart:ProvisionSet`,
  `smart:PublicationDocument`, with publication/component type
  taxonomies.
- **`smart:ProvisionSupplement`** + the supplement taxonomy
  (`taxonomies/provision-supplement-type.ttl`: `note`, `example`,
  `footnote`), plus `BindingnessType` (`normative` / `informative`) —
  typed supplements with normativity, done right.
- **Terminology** — `smart:TermEntry` / `smart:Term` mapped to TBX;
  language tags per BCP 47 (as RDF prescribes).
- **The annotation model** — provisions are `oa:SpecificResource`
  annotations over identified fragments of the authoritative NISO STS
  file; `smart:isSuccessorOf` orders the annotated resources, so the
  document is *reconstructable* from the graph (the
  `docs/Competency Questions.md` CQ: "From which identified fragment in
  the authoritative file is the Provision derived? Is the extracted
  content within the core ontology congruous with the original?").
- **Validation and query** — SHACL shapes
  (`information_model/schemas/shacl/*.ttl`) and SPARQL competency
  questions.

What this buys: a faithful, queryable, provenance-anchored graph of a
standard's *text*, with document reconstruction and a serious supplement
taxonomy. What it cannot buy, by its own scoping: no quantities, no
subject model, no conformance — a `Requirement` individual points at
prose; nothing evaluates it. Narrative-only is an honest boundary, and
the boundary is exactly where Primmel starts.

## 4. Where Primmel v3 is strictly superior

| Capability | DIN 99200 | IEC-ISO Core Ontology | Primmel v3 |
|---|---|---|---|
| **Subject model** — what the standard governs | none (rows) | none (fragments) | the Subject with the full IS/HAS/DOES anatomy; the Family → Group → Model → Sample chain |
| **What a requirement constrains** | a paragraph tag (`smart-type: margin`) | a prose span | typed aspect paths (`model.parameters.e_max`); a requirement *is* a constraint over them |
| **Quantities** | none | none (narrative-only) | `QuantityValue { value, unit [+ uncertainty + tolerance] }`, unit registers, tables as data (INV-1) |
| **Executable conformance** | none | none | conformance tests with preconditions, observables, acceptance; verdicts re-computed from evidence |
| **Processes** | none | none | abstract + executable processes, step vocabulary, executors; the workflow runs |
| **Applicability** | `use.*` tag filters | none | dimension-driven evaluation through one engine (`implies:`, `instances:`) |
| **Compliance of implementations** | none | none | mapping (A ⇒ B) + the coverage calculus (full/minimal/partial/no cover, inherited, aggregated, transitive at process level) |
| **Rule language** | none | SHACL (validation only) | OCL everywhere — constraints, derivations, guards (INV-9) |

The relation is *strict superset*: everything both alternatives express
(text, structure, modality, supplements, provenance) is expressible in
the frame — which is why exports to them are lossy-but-useful
projections, never the kernel (Volume I, Chapter 12).

## 5. What was adopted

Six mechanisms were taken, each re-homed onto the executable frame:

1. **Fragment provenance + document reconstruction** (from the IEC-ISO
   annotation model) — the `.prd` artifact: source documents decomposed
   into addressable fragments; model elements bind fragment addresses;
   the model emits an ordered fragment stream and a congruence check
   (coverage + order + text identity) compares it against the
   authoritative source. Clause-level provenance exists today (●
   `source: { doc, clause }`); fragment level is ○.
2. **Multilinguality via ISO 24229 spelling codes, not BCP 47** —
   adopted against both: DIN's tri-lingual `bib.*` is document-metadata
   only, and the ontology inherits BCP 47 from RDF. The frame extends
   the vocabulary registers' existing `spelling:` practice to *all*
   prose: one content set, per-string spelling codes composed from
   ISO 639 + ISO 15924. ○
3. **Interop projections** — ReqIF export for RM-tool ecosystems (where
   manufacturers and labs already work) and an RDF/OWL + SHACL
   projection onto the Core Ontology vocabulary for linked-data
   consumers; plus OpenCDD IRDI resolution on attribute definitions. ○
4. **The normative-text coverage metric** — the audit's answer to "is
   the model complete against the text?": every normative sentence maps
   to at least one model element (target 100%), no two elements are
   semantic duplicates (target 0), reported per package by
   `primmel check`. ○
5. **Typed supplements + normativity marking** (the ProvisionSupplement
   taxonomy + DIN's normativity flag) — every content element marked
   normative or informative; supplements typed (note / example / figure
   / commentary). ○
6. **Model diff** — structural diff between package versions (elements
   added/removed/changed, including mapping diff), powering edition
   comparison, change audit and clause-drift detection; 'edition'
   packages are lifecycle packagings built on top of it, not core
   features. ○

## 6. What was deliberately rejected

- **Flat, untyped provision rows as the only model** (DIN's 3-type
  structure) — the frame has typed model kinds on tiers; rows are a
  projection.
- **XHTML-rich-text as the semantic carrier** — text is a rendering of
  the model, never the model.
- **A single generic relation type** (`cross-reference`) — relations are
  typed: binding, mapping, verification, delegation, composition.
- **Narrative-only scope** — tables, figures and equations are modelled
  as data and formulas, not excluded.
- **BCP 47 language tags** — ISO 24229 spelling codes instead (§5.2).
- **The fused modality/obligation enum** — modality (shall / should /
  may, `obligation.yaml`) is verbal form; an external constraint is a
  *source* of obligation and is modelled as such, not as a ninth enum
  value duplicating `requirement`.

## 7. Summary

- DIN DKE SPEC 99200 is an interchange profile for RM tools: 3 object
  types, 1 relation, XHTML text, modality and `use.*` filters — findable
  text, not executable semantics.
- The IEC-ISO Core Ontology is a representation ontology: the Directives
  Part 2 provision hierarchy, clauses, typed supplements, TBX terms, and
  a fragment-annotation model with document reconstruction — explicitly
  narrative-only.
- Primmel v3 is a strict superset where it matters: subject model,
  quantities, executable conformance, processes, applicability, mapping
  coverage, one rule language.
- Adopted: fragment provenance + reconstruction, ISO 24229, interop
  projections, the text-coverage metric, typed supplements, model diff.
- Rejected: flat rows, text-as-semantics, one relation type,
  narrative-only scope, BCP 47, the fused modality enum.

*Next: [Roadmap](roadmap.md): what exists today, what is partial, and
the phased path to v3.*
