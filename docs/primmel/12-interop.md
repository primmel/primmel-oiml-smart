# Chapter 12, Interop

> *In this chapter:* the export projections, ReqIF for
> requirements-management tools, RDF/OWL for linked-data consumers,
> OpenCDD back-references for attribute definitions, what survives each
> projection, what is lost, and why none of them is ever the kernel.

---

## 12.1 Projections, never the kernel

The Primmel model is a strict superset of the document-centric
alternatives: they represent a standard's *text*; Primmel represents its
*semantics* (chapter 1's comparison). The interop rule follows:

> **Exports are lossy-but-useful projections, never the kernel.**

A projection is generated, never authored; it is regenerated on every
build, never patched by hand; and it is consumed by ecosystems that
cannot, today, run a Primmel engine. The test for every projection is
honest bookkeeping: say exactly what survives and what is lost, and
check mechanically that the "survives" list is faithful. Round-trip is
explicitly *not* a goal: information lost on the way out cannot come
back, so nothing is ever re-imported into the kernel.

![Interop projections](diagrams/interop-projections.svg)

## 12.2 ReqIF export, the DIN DKE SPEC 99200 profile

**ReqIF** (OMG Requirements Interchange Format) is the wire format of
the requirements-management ecosystem, DOORS, Polarion, the tools
manufacturers and test laboratories already run. **DIN DKE SPEC 99200**
is the ReqIF interpretation for public standards: it models a standard
as database rows, three spec-object-types (`document`, `heading`,
`provision`), one relation (`cross-reference`), XHTML text carrying a
modality tag. The specification ships with the digital material needed
to import, manage and re-export in target software (its clause 11), and
tooling such as Schematron rules and exchange examples (`.reqifz`)
exists to keep exchanges conformant.

That is a *good* target for a projection, because a Primmel reference
package contains exactly the ReqIF profile's content as a subset:

| Survives the projection | Is lost |
|---|---|
| provision statements (the requirement `statement` texts) | **bindings**, `binds_to` anchor paths; a ReqIF row cannot say *what* is constrained |
| modality (shall / should / may → the provision's bindingness) | **limits**, the OCL in `limit.expression`; the row has text, not a computable constraint |
| the document hierarchy (parts, clauses, headings) | **processes**, test methods, steps, gateways, executors |
| provenance (clause URNs as attributes on the row) | **quantities**, QuantityValue, units, tables/profiles |
| cross-references between provisions | **applicability, verdicts, forms, mappings**, the entire executable tier |

The projection's value: a manufacturer consumes the standard inside its
own RM tool, links its design documents to the provision rows, and
answers "which clauses does our product file address?", while the
authoritative, executable form remains the Primmel package. The moment a
consumer needs to know whether the instrument *passes*, the projection
has nothing to say and the kernel must run.

**Shipped** (task 27b, ● primmel-ts 8840617). `primmel export reqif`
projects the R 60 package to the profile above: **1 document, 14
requirement classes, 180 requirements, 62 conformance tests, 128
spec-relations** (depends-on, verifies, binds), **0 dropped
references**, and the output validates against the official OMG ReqIF
XSD (`xmllint --noout --schema reqif.xsd`). The exporter's header note
carries the honest survives/lost bookkeeping of the table above, and a
reference that names nothing exported is recorded in
`stats.droppedReferences`, never dangled. The evidence artifact is
`analysis/reqif-export-oiml-r60.reqif` in the platform repo.

## 12.3 RDF/OWL + SHACL, the IEC-ISO Core Ontology projection

The second target is linked data. The **IEC-ISO Core Ontology**
(descended from the IEC SG12 Standard Information Model) defines an OWL
model for *fragments* of standards in RDF, with a scope it states
precisely: concepts from ISO/IEC Directives Part 2 (sections 3, 6, 7),
narrative content only, **not** figures, equations or tables; **not**
document metadata (number, edition, publisher); **not** presentation
(NISO STS owns that). Its center is the **Provision hierarchy**, one
class per directive verb-force: `Requirement`, `Recommendation`,
`Permission`, `Possibility`, `Capability`, `Instruction`, `Statement`,
`ExternalConstraint`, with `hasBindingnessType`, typed
`ProvisionSupplement`s (notes, examples), `Clause` with
`hasSectionNumber`, and `PublicationDocument` carrying
`dcterms:hasVersion` / `dcterms:replaces` / `dcterms:issued`. SHACL
node shapes validate instances: `ProvisionShape` constrains
`dcterms:isPartOf` to exactly one parent, a `Clause` or the
`PublicationDocument`, each checked against its own shape, and allows
a `dcat:distribution`; `ClauseShape` applies the same single-parent
rule and types `hasSectionNumber` and `dcterms:title`;
`PublicationDocumentShape` constrains the three `dcterms` properties
above. The consumption pattern is SPARQL: competency questions like
"list every Requirement of this document with its bindingness and
supplements".

The Primmel→RDF projection maps the package onto that vocabulary:
requirements become `smart:Requirement` instances, notes and examples
become typed supplements, clause structure becomes `Clause`/`isPartOf`,
the package's edition relations (chapter 13) become `dcterms:replaces`.
What survives is wider than ReqIF in one respect (the Provision
taxonomy's verb-force classification) and identical in the one that
matters: **no bindings, no processes, no quantities**, the ontology's
own scope statement excludes them. Two projection notes are worth
recording:

- **Language tags collapse.** RDF mandates BCP 47 for language-tagged
  strings, so ISO 24229 spelling codes (chapter 10) map *down* to BCP 47
  on export, a lossy step the projection declares, not hides.
- **SHACL is the check.** A projection that emits RDF the
  `ProvisionShape` rejects is a projection bug; SHACL validation is part
  of the export gate, symmetric to chapter 11's own gates.

**Shipped** (task 27c, ● primmel-ts f1a82d5). `primmel export rdf`
projects the R 60 package onto the smartSDU share's IEC-ISO Core
Ontology vocabulary (`core-ontology.ttl` v2.0.0) as **4,252 triples** ,
the provision hierarchy typed by modality (`shall → smart:Requirement`,
with `primmel:obligation` riding as data), the clause tree, terms with
SKOS-XL labels, provenance and cross-references
(`dcterms:source/requires/references`, `primmel:verifies`). The export
gate is real SHACL, twice over: the toolchain's own evaluator and
**pyshacl 0.31.0 both report `Conforms: True`** (rdflib 7.6.0 parses
the artifact to the exact count, zero warnings) against six shapes ,
including the clause-tree acyclicity constraint as standard SHACL-SPARQL,
which *fires* on a seeded cycle under both evaluators. The five
**competency questions** execute on the projected graph with pinned
answers, shall-provisions with holding clause (157), the verification
coverage map (91), terms by source clause (69), the modality census via
`rdfs:subClassOf*` (242), the full clause tree (15 rows), identical
under rdflib's SPARQL engine and the repo evaluator. Kernel check **C85
`baseurn-wellformed`** guards the IRI root every instance IRI resolves
against. The evidence artifact is `analysis/rdf-export-oiml-r60.ttl` in
the platform repo.

## 12.4 OpenCDD integration, the IRDI back-reference

The third relation runs the other way. **OpenCDD** (the open form of the
IEC Common Data Dictionary, IEC 61360) is an international register of
*property definitions*: every entry has an **IRDI** (International
Registration Data Identifier), a quantity kind, and a unit. Primmel does
not re-invent shared attributes per package; an attribute definition
carries its CDD citation in an `irdi` facet. This is already the
metamodel's law, INV-2: an attribute is **defined once** as an
AttributeDefinition (symbol, clause, IRDI) and **valued** per subject
level.

The integration is **shipped** (task 27a, ● smart 8247d37), validation,
not export, against a **pinned snapshot** of the register
(`data/opencdd/`; OpenCDD offers no REST/RDF/SPARQL interface, a pinned
snapshot of the public mirror is the intended consumption, here pinned
at mirror commit `7ea6d4c`, 2026-07-25, re-vendored on demand by
`npm run snapshot:opencdd`). Three dictionaries ship whole, IEC 62720
units (2,566 entries), IEC 61360-7 identification/marking (2,318),
IEC 63213 measuring-equipment properties (224), and IEC 61987 ships
filtered to the referenced IRDIs plus their unit-link closure (the full
dictionary is unvendorable). A checkout without the snapshot is a
graceful stub: R36 prints one note, never fails.

The R 60 attribute register carries **8 genuine annotations**
(`accuracy_class`, `t_min`, `t_max`, `warm_up_time`, `input_impedance`,
`output_impedance`, `interfaces`, `software_identification`), annotate
only on a genuine match; the register's other attributes are documented
honest absences, and honest absence is a correct outcome. The sweep also
*removed* a pre-existing citation (`0112/2///61987#ABA000#000`): invalid
IRDI syntax, and ABA000 is the IEC 61987 root *class*, not a property ,
no genuine rated-output entry exists, so the honest annotation is none.

Linker rule **R36 `irdi-resolve`** validates every annotation against
the snapshot on five axes:

1. **syntax**, the full ISO/IEC 11179-6 IRDI grammar
   (registrant/semantic///scheme#code; version and revision live on the
   CDD entity, never in the IRDI);
2. **existence**, the IRDI resolves to an entry in the snapshot;
3. **status**, the entry's `status_level` is in the accepted vocabulary
   (the register measures exactly `Standard`);
4. **unit-symbol coherence**, the attribute's unit matches the entry's
   MDC_P041-linked unit `short_name`, Unicode-exact;
5. **quantity-kind↔dimension coherence**, the attribute's quantity
   kind matches the entry's dimension string via an ISO 80000
   kind→dimension table.

Deliberate divergences are **allowlisted, never silenced**: five sites
where kind↔dimension coherence is genuine and only the symbol spelling
diverges, the platform's `degC` vs the registry's `°C` (on `t_min` and
`t_max`), warm-up time in `min` vs the SI second the entry links, and
`Ω` (U+03A9) vs the registry's `Ω` (U+2126 OHM SIGN) on the two
impedances. Each carries a reason and an audit reference in the linker
allowlist; the issues print as KNOWN, and an entry that stops matching
is STALE and fails.

The payoff is the chapter's thesis in miniature: an attribute with a
checked IRDI is citable in an international dictionary rather than
invented per package, the same "defined once, referenced everywhere"
discipline the kernel applies internally, extended across organizations.

## 12.5 The passport projection, endpoint and DPP-registry feed (●)

The twin direction's outward faces belong to this family, and they are
shipped (task 35, ● smart 244ea47). The **passport endpoint** serves
the product's model-native passport (chapter 14, §14.6), identity,
composition, as-certified claims, and live compliance status under
fail-closed access classes, and the **DPP-registry feed** emits the
one-way outward projection to the EU registry, addressed by unique
identifier. Both are projections in this chapter's exact sense:
generated from the product model, regenerated on every build, never
authored, never re-imported. And both are honestly lossy: the registry
receives the public fragment, while the executable product model and
its evidence stay behind in the kernel. What ReqIF is to the RM-tool
ecosystem, the passport feed is to the DPP ecosystem, the
lossy-but-useful face the outside world actually consumes.

The shipped surface, each piece linted:

- **The kernel `passport` construct**, a first-class declaration on
  the product model: `upi { pattern … level … }` (ESPR model/batch/item
  levels), the `carrier` facet (the QR payload resolves to the passport
  endpoint URL), and the content classes, the ACME LC-500 pilot
  declares `public { identity composition promises_as_verified }` and
  `authority { live_compliance_status }`, with `artifacts` and
  `sustainability` deliberately absent (nothing honest behind them
  yet). Kernel-linted by the catalog trio: **C86
  passport-content-resolves** (every content entry resolves against the
  product model), **C87 passport-access-leak** (nothing restricted
  leaks into a less-privileged class), **C88 passport-upi-scheme** (the
  UPI pattern and level are well-formed).
- **The projection engine** (`browser/src/data/passport.ts`) ,
  `buildPassportDocument` (abstract mode pins a version; live mode
  requires the computed verdict-stream read, never fabricated) and
  `projectPassportDocument` (the access-class enforcement point: public
  output carries only public entries, fail-closed).
- **The serving**, `GET /passport/<upi>.json?class=public|restricted|
  authority` (the resolver) and the public rendered view at
  `/passport/<upi>` (the authority class: the public content plus live
  compliance status).
- **The registry feed**, `GET /passport/registry.json`: the one-way
  outward projection (identifiers + locators), deliberately a **stub**:
  no authentication, no push protocol, the shape is shipped, the
  registry integration is the honest ○ remainder.

The alignment with CEN/CENELEC JTC24's eight areas is itself authored
data, not a prose claim: `data/r60/evaluation/r60-to-dpp.prm` maps the
R 60 content onto the areas on the existing `.prm` primitive, gated by
the coverage calculus, an area neither mapped nor named is a silent
gap and fails the gate (the record: `docs/dpp-jtc24-alignment.md` in
the platform repo).

## 12.6 Grammar sketch *(illustrative v3 syntax)*

```prl
projection reqif-din-99200 of oiml-r60 {
  spec_objects { document, heading, provision }
  carry   { statement, modality, clause_hierarchy, provenance_ref, cross_references }
  drop    { bindings, limits, processes, quantities, applicability, verdicts, forms, mappings }
  note    "generated artifact; regenerate on build; never patch, never re-import"
}

projection rdf-core-ontology of oiml-r60 {
  vocabulary smart   # IEC-ISO Core Ontology
  map requirement -> smart:Requirement
  map note/example -> smart:ProvisionSupplement (typed)
  map clause tree  -> smart:Clause + dcterms:isPartOf
  map editions     -> dcterms:replaces
  languages spelling -> bcp47 (lossy, declared)
  gate shacl { ProvisionShape, ClauseShape, PublicationDocumentShape }
}

attribute output_impedance {
  kind electrical-resistance ; unit Ω
  irdi "0112/2///61987#ABP162"          # IEC CDD — a genuine annotation
  check cdd { syntax, exists, status, unit_symbol_coherent, kind_dimension_coherent }
}
```

## 12.7 Validation rules

- a projection declares its `carry` and `drop` lists; everything in
  `carry` is mechanically verified present and faithful in the output
  (a statement whose exported text differs from the content set fails
  the export gate);
- a projection's output passes the *target's own* validator, the
  official OMG ReqIF XSD for the ReqIF projection (● xmllint-clean on
  the R 60 export), SHACL shapes for the RDF projection (● the repo
  evaluator and pyshacl both `Conforms: True`);
- no import path: the kernel accepts no artifact generated from a
  projection; provenance of every kernel element traces to a `.prd`
  fragment or an authored model file, never to an export;
- every IRDI on an attribute definition passes R36 `irdi-resolve`
  against the pinned snapshot, syntax, existence, status, unit-symbol
  coherence, quantity-kind↔dimension coherence (●); a deliberate
  divergence is an allowlist entry with reason and audit reference,
  never silence; an invalid IRDI is removed, not carried;
- the BCP 47 downgrade of spelling codes is declared in the RDF
  projection's `languages` clause, an undeclared silent mapping is an
  error.

## 12.8 Summary

- Exports are lossy-but-useful projections: generated, regenerated,
  never authored, never re-imported, the kernel stays the source of
  truth.
- ReqIF (DIN DKE SPEC 99200): provisions + modality + hierarchy survive;
  bindings, processes, quantities, verdicts are lost, ● shipped: R 60
  exports to 180 requirements + 62 tests + 128 relations, 0 dropped,
  XSD-valid.
- RDF/OWL (IEC-ISO Core Ontology): the Provision taxonomy, supplements,
  clause tree and edition relations survive; the same executable content
  is lost, by the ontology's own scope, ● shipped: 4,252 triples,
  SHACL-clean under two evaluators (pyshacl `Conforms: True`), five
  competency questions answered; spelling codes downgrade to BCP 47,
  declared.
- OpenCDD runs the other way, ● shipped: attribute definitions carry
  IEC CDD IRDIs validated by linker rule R36 against the pinned
  `data/opencdd/` snapshot (8 genuine annotations, 5 allowlisted
  symbol-spelling divergences, the invalid ABA000 citation removed) ,
  defined once, citable everywhere.

*Next: [Chapter 13, Model diff and lifecycle](13-diff-and-lifecycle.md):
editions as packaging, structural diff, and change audit.*
