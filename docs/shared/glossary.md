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

**abstract import** — a consumption mode of a *product reference
model*: the product model enters the user's *implementation model* as
static reference content — designation, design parameters, designed
conditions, *promises* as point-in-time (as-certified) claims at a
pinned version; design-time integration, nothing live. ○

**abstract passport** — the point-in-time mode of the *model-native
passport*: identity, composition and as-certified claims — what a buyer
integrates at purchase, what a DPP registry looks up by unique
identifier. ○

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

**chain rule** — user ⇒ product ⇒ standard: conformance composes
through the typed *mappings* of the supply chain — transitive at
process level through mapped aspects, guarded at model level by the
shared-component rule (no shared aspects, no compliance flow; the
*coverage* report says so). ○

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

**connector profile** — the protocol binding declared per *endpoint*:
`rest_json`, `mqtt`, `opc_ua`, `file_drop` (for batch/plugin sources);
the model is protocol-neutral, profiles bind protocols. ○

**constraint** — a Boolean OCL statement (`inv`) bound to aspect paths;
the shape every *requirement* limit takes. OCL is the only rule language
(INV-9). ●

**continuous compliance** — the standard executed next to the product,
forever: *monitors* re-evaluate the same OCL (INV-9) over served values
on schedule / signal / change triggers, appending time-stamped
*evidence* and *verdicts* where a certificate alone freezes time. ○

**coverage (full / minimal / partial / no cover)** — per reference-model
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
subject does — *behaviors* as processes with inputs, steps, outputs.
Formally: the `DOES ⊆ O × T` relation; each *behavior* is a reified
transition `ρ(t) ∈ O`.
Canonical definition:
[Volume 0 ch 3 §§3.5–3.6](../foundation/03-eight-terms-and-closure-rules.md). ●

**endpoint** — the IS-level declaration of a subject's API surface:
operations (kinds `query` / `subscribe` / `invoke`, payloads
*QuantityValue* with timestamp), access scopes (`public` / `registered`
/ `authority`) and a *connector profile* — part of the type definition,
like a marking or a software identification. ○

**engine operator** — the party running the Compliance Engine against
the reference model (issuing authority, regulator, market surveillance
— or the manufacturer self-monitoring under third-party audit); speaks
for the standard, counterpart to the *twin provider*. ○

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

**freshness** — the validity window declared on a *serve binding*
(`fresh_within`): how old a served value may be before it stops meaning
anything; a stale value degrades the *verdict* to `indeterminate` —
stale ⇒ indeterminate, never a silent pass. ○

**HAS** — the exhibition question of the *subject* anatomy: what the
subject exhibits — observable, varies without identity change.
Formally: the `HAS : O → (P ⇀ V)` attribution relation.
Canonical definition: [Volume 0 ch 3 §3.4](../foundation/03-eight-terms-and-closure-rules.md). ●

**implementation model** — a model of an organization's actual
operations, a digital twin of reality; speaks for the organization;
related to *reference models* only by *mapping*. ◐ (the platform
workflow is one, today unnamed)

**import** — structural inclusion of one model inside another (`uses`
composition), distinct from *mapping*: "my model contains yours" vs "my
process fulfils your requirement". An *integrated management system*
both imports its components and maps to its standards — confusing the
two is how compliance gets double-counted. ◐ (v2 `includes` exists; v3
formalizes the import/mapping distinction, Volume I, Chapter 5 §5.6)

**instance** — a subject at the instance level realizing a
definition-level subject (a *Sample* is an instance of a *Model*):
carries the definition's IS by *delegation*, its own HAS, and executes
the definition's DOES. ●

**instantiation** — the first-class definition ⇒ instance relation,
uniform across the language: process definition → execution, form →
FormInstance, artifact definition → artifact instance, attribute
definition → valued parameter. ●

**integrated management system (IMS)** — one *implementation model*
covering several management domains at once (quality, security,
environment…): it *imports* its component operations (QMS, ISMS) and
*maps* to several *reference models* (ISO 9001, ISO 27001) — the
canonical case of import ≠ mapping and *multi-target mapping* (Volume I,
Chapter 5 §5.6). ○

**intermediate model** — a model sitting between the ends of a mapping
chain: a fulfiller toward the layers above and a reference for the
layers below (a sector scheme, a corporate policy manual, a *product
reference model*). Compliance flows through it hop by hop, only via
shared mapped components. ○

**IS–HAS–DOES Modelling System** — the formal foundation of every
model in this tree: eight terms (`is`, `has`, `does`, `value`,
`property`, `object`, `process`, `transition`), five layered sorts,
three closure rules, and three theorems (closure, completeness,
extensibility). Canonical definition:
[Volume 0 chapter 3](../foundation/03-eight-terms-and-closure-rules.md);
proofs in
[Volume 0 chapter 4](../foundation/04-proofs.md); operationalized as
the *subject anatomy* in
[Volume I chapter 2](../primmel/02-subjects.md). ●

**IS** — the identity/design question of the *subject* anatomy: what the
subject is — intrinsic; change it and you have a different subject.
Formally: the `IS ⊆ O × O` relation.
Canonical definition: [Volume 0 ch 3 §3.2](../foundation/03-eight-terms-and-closure-rules.md). ●

**live integration** — a consumption mode of a *product reference
model*: the deployed instance serves a *live twin* integrated directly
into the user's *implementation model* — served aspects feed the user's
registers, operational state gates the user's processes, *promises* are
monitored; *evidence* by reference with timestamps and version pins,
never by copy. ○

**live passport** — the continuous mode of the *model-native passport*:
the same identity and composition plus live compliance status computed
by the engine — what market surveillance reads when it scans the
product. ○

**live twin** — a subject *instance* whose anatomy is served: IS (its
identity, which is also its passport, including the *endpoint*
declaration), HAS (live values via *serve bindings* with *freshness*
windows), DOES (remotely invocable processes); run by its *twin
provider*, judged by *monitors*. ○

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

**model-native passport** — the Digital Product Passport answered as a
*projection* of the product's subject model plus live instance state:
generated from the model, served by the *endpoint*, verified through
the engine — it cannot drift from the model because it *is* the model
(EU ESPR / CEN-CENELEC JTC24); modes: *abstract passport*, *live
passport*. ○

**modality** — the obligation strength of a *provision*: shall / should
/ may (`obligation.yaml`; ISO/IEC Directives Part 2 Annex H); a failed
*should*-limit is an observation, never a decision blocker. ●

**monitor** — the continuous *process* of the Compliance Engine:
trigger (schedule / signal / change) → fetch → *freshness* check →
evaluate the same OCL (INV-9) → *verdict* (pass / fail / indeterminate /
invalid) → time-stamped *evidence* into the *workspace* → escalate on
fail/invalid. ○

**multi-target mapping** — one *implementation model* mapped to
several *reference models* (`mapSet` is per target namespace), with
coverage computed per target; a single process may fulfil provisions in
several standards at once — the economy of integrated systems, proved
rather than asserted. ● (serialization) / ○ (calculus)

**object** — the bearer of claims in the foundational algebra: anything
IS can individuate — physical or abstract. Kinds are objects (Closure
Rule 1): *LoadCell*, a requirement, a package, a certificate.
Canonical definition: [Volume 0 ch 3 §3.3](../foundation/03-eight-terms-and-closure-rules.md). ●

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
stimulus application, a wait). Formally: a reified transition
`ρ(t) ∈ O` (Closure Rule 3).
Canonical definition: [Volume 0 ch 3 §3.6](../foundation/03-eight-terms-and-closure-rules.md). ●

**product reference model** — the manufacturer's model of their product
(the full IS / HAS / DOES anatomy), every aspect *mapped* to the
Recommendation: the conformance claim made computable; the certificate
carries its *promises*-as-verified; consumed by *abstract import* or
*live integration*. ○

**property** — the slot in the *HAS* relation: the dimension along
which an object can vary. Defined once (an *AttributeDefinition* —
symbol, clause, kind) and valued per subject level.
Canonical definition: [Volume 0 ch 3 §3.4](../foundation/03-eight-terms-and-closure-rules.md). ●

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

**transition** — the unit of *DOES*: a rule `t: V_in → V_out`
(input, transform, output). Transitions compose and the composite is a
transition. Every OCL statement in the system is one (INV-9's
"[bound inputs ⇒ OCL ⇒ typed output]").
Canonical definition: [Volume 0 ch 3 §3.5](../foundation/03-eight-terms-and-closure-rules.md). ●

**kind-membership** — the *IS* relation at type grain: "x is a K", where
K is an object (Closure Rule 1). Declared classification membership is
identity-defining (IS); the exhibited reading is HAS — the uniform
IS/HAS duality. ●

**claim-form trichotomy** — the completeness axiom: every atomic
descriptive claim is an identity claim (IS), an attribution claim (HAS),
or a transformation claim (DOES). The universal anatomy is its proof by
construction. ●

**closure rules** — the three rules sealing the algebra: kinds are
objects (no "type" primitive); values may hold references to objects
(ι: O ↪ V — `reference(X)`, `bind:` paths); process is a reified
transition (ρ: T → O — no independent meaning). ●

**reification (ρ)** — the folding of a transition into an object so the
IS/HAS machinery applies to it (Closure Rule 3). A *process* is exactly
this: transition-as-object, and nothing more. ●

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

**serve binding** — the HAS-level binding from an aspect to an
*endpoint* operation, carrying its *freshness* window (`serve
sample.indication via get_indication { fresh_within 5s }`); a live
binding without freshness is an error. ○

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

**twin provider** — the party running a *live twin* and its *endpoint*
(the manufacturer, or the owner-operator of the deployed unit); speaks
for the product, counterpart to the *engine operator*. ○

**uses composition** — multi-package composition (`uses: [core,
module-a, …]`): topologically merged, id-space references, no
redefinition of upstream ids; single-string `extends` is insufficient —
an implementation package *maps* to reference packages it does not
extend. ○ (v2 uses `extends`)

**value** — the content filling a *property* slot: a
*QuantityValue*, a string, a condition entry, a verdict outcome — or a
reference to an object (Closure Rule 2), which is how all relational
vocabulary derives.
Canonical definition: [Volume 0 ch 3 §3.4](../foundation/03-eight-terms-and-closure-rules.md). ●

**verdict** — a per-*requirement* judgment for one *sample*: pass /
fail / indeterminate / invalid, with fact-under-judgment, limit
snapshot, *modality*, and overrides recorded — a re-executable function
of definitions + *evidence*. ●

**VerdictQuantity** — an acceptance quantity declared once (id, quantity
kind, OCL `derive`, inputs, optional series reduction) in the
specification's verdict registry; referenced by requirements
(`limit.accepts`) and forms (`verdict:` / `evaluation:`) — never
restated inline. ●

**view (lens)** — a read-only rendering of a complex model through
a shallower one: a filtered view (a view profile with no provisions of
its own) or a deliberate lens model in the chain; shows a selection of
elements with their coverage against the lens's reference (e.g. the IMS
through the QMS lens). Never mutates the model or its *mappings*. ○

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
