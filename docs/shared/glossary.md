# Glossary — Every Term of the Frame, One Definition Each

> *In this document:* the controlled vocabulary of Primmel v3 + OIML
> SMART, alphabetical. Each term gets one definition; where a running
> artifact owns the term, the definition cites it. Status markers:
> ● exists in the running system · ◐ partial · ○ planned for v3.

Cross-references use *italics*. Volumes I–III and the annexes are the
long-form treatments; this page arbitrates wording, not depth.

---

**admissibility** — the gate that decides whether evidence may enter
judgment: the per-test-report *determination* (ACCEPTED / REJECTED /
CONDITIONAL) before any synthesis; a run voided by a *precondition*
violation is inadmissible, never failed. ●

**anchor / anchor set** — the typed list of primary-tier aspect paths a
secondary element binds, operates on, or projects; secondary elements
are *defined by* their anchors, which is what makes coverage a graph
property. ●

**abstract process** — a *process* in definition form: signature +
invariants + state skeleton, without steps; always valid. In a
*reference model* it reads as "a process is required to fulfil these
provisions". ●

**applicability** — the computed relation deciding which requirements,
tests and forms apply to a given subject, derived from its *dimension*
values by the ONE applicability engine (dimension conditions, `implies:`
subsumption, `instances:` parameterization — R 60's n_runs: A/B = 5,
C/D = 3). ●

**artifact (definition / instance)** — IS: an output the subject *must*
produce, declared with a content contract and produced-when rules (the
R 91 evidence file); HAS: the produced output itself, recorded as
*evidence*. ○

**attribute** — an exhibited named property value (HAS): test-dependent
settings, as-found/actual values; *defined* once in
`model/attributes.yaml` (INV-2) and *valued* per Family / Group / Model
/ Sample through the parameter maps. ●

**behavior** — a subject's DOES aspect: a *process* (IN parameters →
steps → OUT parameters; state may change); the archetype is the
measurement process (measurand → transduction → indication). ●

**capability** — (subject) a mixin declaring what an instrument can do
(`extends` / `requires`); (organization) an abstract test ability a
laboratory declares, consumed by capability-based lab selection. ●

**characteristic** — a quantity *derived from behavior I/O* (error =
OUT − reference IN; repeatability = dispersion of OUT under repeated IN;
creep = ΔOUT/Δt under constant IN): the quantitative interface that
*promises* claim, *requirements* limit, tests compute, and *verdicts*
judge. ◐ (defined today specification-side; hoisting to the primary
model is v3 work)

**classification** — see *dimension*: the exhibited membership of a
subject in the classification axes; classification drives
*applicability*. ●

**condition tiers (reference / rated / limiting / actual)** — the
`ConditionRole` catalog: *reference* (calibration-grade envelope),
*rated* (where the *promises* hold), *limiting* (survivable extremes)
are designed envelopes (IS); *actual* is the experienced
*environmental context* (HAS) — one value structure, two aspect roles. ●

**conformance test** — an operation *on* the subject: constrains inputs
(stimuli), *environmental context* (conditions to enforce) and state
(*preconditions*), then observes outcomes as typed observables; its
parameters are derived from the *requirement*'s limits and the subject's
parameters — never restated. ●

**constraint** — a Boolean OCL statement (`inv`) bound to aspect paths;
the shape every *requirement* limit takes. OCL is the only rule language
(INV-9). ●

**coverage (full / minimal / partial / none)** — per reference-model
component, how much is fulfilled by mapped implementations: full (all
fulfilled), minimal (the gateway minimum met), partial (something
mapped, below the minimum), no cover (nothing mapped) — computed by the
coverage calculus: inherited down process trees, aggregated up,
transitive at process level, never at model level. ○ (calculus; ● v2
serialization)

**delegation (INV-10)** — attribute resolution upward Family ← Group ←
Model ← Sample: a value set at a lower level overrides the inherited
one; values are never copied downward. ●

**design parameter** — a value fixed by design that defines the type
(IS; `origin: design-fixed`): change it and you have a different
*Model*; dual of its exhibited realization. ●

**determination** — a recorded judgment on evidence: per form
(pass / fail / indeterminate, with notes) or per *test report* (the
*admissibility* gate). ●

**dimension** — an exhibited classification membership (HAS) declared in
the subject's dimension registry (`model/instrument.yaml`); the axis
that drives *applicability*. R 60 declares four: `accuracy_class`,
`technology`, `humidity_symbol`, `load_type`. ●

**DOES** — the process question of the *subject* anatomy: what the
subject does — *behaviors* as processes with inputs, steps, outputs. ●

**environmental context** — the actual conditions experienced by the
subject (HAS): logged during runs, installation context; dual of the
designed operating conditions (IS). ●

**evidence** — the recorded exhibition of a subject under test: runs,
form instances, evidence records — facts only, permanent, firewalled
from judgment (a *test report* contains no *verdicts*). ●

**executable process** — a *process* with concrete steps, transitions
and register operations; additive over the *abstract* form, layered on
when simulation or automation demands it (no process needs steps to be
valid). ●

**executor (machine / actor)** — the IS-level typing of a step's
performer: *machine* (run by the engine — OCL evaluation, gateway
resolution, calculation, applicability expansion, verdict re-execution)
vs *actor* (performed by a human, lab or equipment; recorded via forms). ●

**form (schema / instance)** — an evidence *view* projecting the subject
graph into a record: the authored form is an evidence schema (bound
fields prefill and write through; unbound fields are the raw evidence
slots); the FormInstance is the *evidence*. ●

**HAS** — the exhibition question of the *subject* anatomy: what the
subject exhibits — measurable, loggable, varying across units and time
*without* changing identity. ●

**implementation model** — a model of an organization's actual
operations, a digital twin of reality; speaks for the organization;
related to *reference models* only by *mapping*. ◐ (the platform
workflow is one, today unnamed)

**instance** — a subject at the instance level realizing a
definition-level subject (a *Sample* is an instance of a *Model*):
carries the definition's IS by *delegation*, its own HAS, and executes
the definition's DOES. ●

**instantiation** — the first-class definition ⇒ instance relation,
uniform across the language: process definition → execution, form →
FormInstance, artifact definition → artifact instance, attribute
definition → valued parameter. ●

**IS** — the identity/design question of the *subject* anatomy: what the
subject is — intrinsic; change it and you have a different subject. ●

**mapping** — the typed compliance relation between models: A ⇒ B
(fulfilling A fulfils B), carrying description + justification; neither
equivalence nor refinement; serialized in-model (`map_profile`) or
standalone (`.prm`). ● (v2 serialization)

**measurement variable** — a typed value with source typing (declared /
measured / derived / computed / lookup); derivations are OCL `derive`,
constraints OCL `inv` — one rule language. ●

**Model** — the subject-chain level that is the center of conformity
(VIML 4.06 "type"): *requirements* bind to it, tests run on its
*Samples*, evaluation aggregates back to it. ●

**ModelFamily** — the top of the subject chain (VIML 4.02 family):
models sharing family criteria (R 60-1, 3.4.2). ●

**ModelGroup** — the R 60 domain grouping level between family and model
(the load cell group, profile DL.2b), with identical-characteristics
criteria. ●

**modality** — the obligation strength of a *provision*: shall / should
/ may (`obligation.yaml`; ISO/IEC Directives Part 2 Annex H); a failed
*should*-limit is an observation, never a decision blocker. ●

**operational state** — the subject's own state machine (HAS): off →
warming → ready → measuring → fault; transitions fired by DOES
processes; tests gate on state via *preconditions*. Distinct from the
lifecycle state of process artifacts (application, report, certificate). ○

**package** — the unit of model authoring and distribution: a manifest
plus modules composed by *uses*; on disk, `.prl` files. ●

**precondition** — a run-validity rule on a *conformance test* (state,
environmental context, reference-material constraint), evaluated before
the limit; a violation yields outcome `invalid` — a void run, never a
`fail`; a check with missing inputs never fires. ●

**primary tier** — the *tier* of the *subject* and its aspects (what the
subject IS / HAS / DOES); everything on the secondary tier anchors to it. ●

**process** — the recursive model kind: a process IS signature +
invariants + executor, HAS state + registers + context, DOES steps and
sub-processes — bottoming out in atomic steps (a register write, a
stimulus application, a wait). ●

**promise** — a manufacturer *claim on a characteristic or behavior*
(IS): possibly envelope-shaped or conditional; cites no regulator — the
manufacturer binds itself, evaluation verifies, the certificate prints
promises-as-verified. ◐ (today only parameter-valued claims)

**provenance (clause / fragment)** — the pedigree of an element: clause
level (`source: { doc, clause }` URNs, ●) and fragment level (binding to
addressable fragments of a `.prd` extract, ○), the latter enabling
document reconstruction with a congruence check.

**provision** — a statement of a standard carrying *modality* and a
normative/informative mark; in Primmel a provision becomes a typed
element (a *requirement*, an *abstract process*, a registry demand) —
never a tagged paragraph. ●

**QuantityValue** — the value type `{ value, unit [+ uncertainty +
tolerance] }`: no bare numbers anywhere (INV-1). ●

**reference model** — the semantic content of a standard document,
published by the standards body: faithful, machine-applicable,
machine-readable, transferable; speaks for the standard. ●

**registry vs data class** — a *place where records are kept* (compiles
to a store with indexes) versus a pure embedded value structure;
registries are storable classes, data classes are helpers. ●

**requirement** — a *constraint over primary aspect paths*: statement +
clause reference + `binds_to` + OCL `limit` + *applicability* +
verification method; it binds, never restates (INV-3). ●

**sample** — an *instance* of a *Model* (VIML 4.09 specimen): one
physical unit under test, with serial number, custody events and
`test_context` values. ●

**secondary tier** — the *tier* of models anchored to primary aspect
paths: *requirements* (constraints), *conformance tests* (operations),
*forms* (evidence views); owns no subject facts. ●

**spelling code (ISO 24229)** — the writing-system / conversion-system
code (composed from ISO 639 language + ISO 15924 script, resolvable to
concrete rules) carried by every human-readable string in v3
multilinguality; BCP 47 is not used. ○

**subject** — the entity the standard governs, modelled with the
complete IS / HAS / DOES anatomy; the center of the primary *tier*. ●

**subject chain** — *ModelFamily* → *ModelGroup* → *Model* → *Sample*:
the definition/instance ladder of the measuring-instrument subject. ●

**supplement** — a typed informative attachment to a *provision* (note /
example / figure / commentary), each element marked normative or
informative — per the IEC-ISO ProvisionSupplement taxonomy. ○

**tertiary tier** — the *tier* of execution and judgment over secondary
× primary instances: runs and *evidence*, *verdicts*, evaluations,
decisions, certificates, and the *workflow* processes that orchestrate
them. ●

**test report** — the laboratory's evidence compilation: one per lab per
group, owning its form instances (cascade FK); content fixed by the
PD-05 §4.4.3 18-element checklist; facts only — no *verdicts*. ●

**tier** — the single organizing fact of the frame: every element lives
on exactly one tier (Foundations / Primary / Secondary / Tertiary /
Cross-cutting); dependencies point only upward. ●

**traceability** — the cross-cutting spine: every element carries
*provenance* to the source document; every judgment carries its
*evidence* chain. ●

**uses composition** — multi-package composition (`uses: [core,
module-a, …]`): topologically merged, id-space references, no
redefinition of upstream ids; single-string `extends` is insufficient —
an implementation package *maps* to reference packages it does not
extend. ○ (v2 uses `extends`)

**verdict** — a per-*requirement* judgment for one *sample*: pass /
fail / indeterminate / invalid, with fact-under-judgment, limit
snapshot, *modality*, and overrides recorded — a re-executable function
of definitions + *evidence*. ●

**VerdictQuantity** — an acceptance quantity declared once (id, quantity
kind, OCL `derive`, inputs, optional series reduction) in the
specification's verdict registry; referenced by requirements
(`limit.accepts`) and forms (`verdict:` / `evaluation:`) — never
restated inline. ●

**vocabulary register** — a glossarist term register (viml-2022 =
OIML V 1:2022, vim-2012 = VIM): layer 0 of the architecture; terms
anchor via `vocab_ref: { register, clause }`. ●

**workflow** — the orchestration of the certification process: phases,
actors/roles, state machines with cascades, gateways, approvals —
first-class process content, not annotation. ●

**workspace (.pws)** — the records produced by running implementation
models: one directory per workspace, one subdirectory per *registry*,
one YAML file per record, a `manifest.yaml` at the root; speaks for the
evidence. ● (v2 form: IndexedDB stores + sample-data flows)

---

*Next: [Alternatives Audit](alternatives-audit.md): DIN DKE SPEC 99200
and the IEC-ISO Core Ontology, compared to the frame these terms name.*
