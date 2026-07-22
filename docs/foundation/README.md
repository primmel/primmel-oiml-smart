# Volume 0 — The IS–HAS–DOES Modelling System

> *In this volume:* the formal foundation on which every other volume
> stands. Eight terms — `is`, `has`, `does`, `value`, `property`,
> `object`, `process`, `transition` — and three theorems showing the
> system is **closed**, **complete**, and **extensible**. Volume I
> chapter 2 ([Subjects](../primmel/02-subjects.md)) operationalizes this
> system as Primmel's subject anatomy; this volume proves why that
> anatomy is exhaustive rather than heuristic.

The notation below uses plain Unicode for math symbols (`⊆`, `→`, `∘`,
`⇀`, `↪`, etc.) so the proofs render in any reader. Where the prose says
"mathematics", read it as: the symbols are the claim, the words are the
argument.

---

## 1. What This Document Is

This document defines a modeling system built from exactly eight terms: **is, has, does, value, property, object, process, transition**. It explains the system as a layered onion — each layer depends only on the layers inside it — and then proves three theorems about it: that it is **closed** (no operation on the eight terms produces anything outside them), **complete** (every well-formed descriptive claim can be expressed with them), and **extensible** (the system grows by adding content, never by adding primitives).

A novice should read the layers in order. Each layer answers one question, and no layer secretly depends on a layer outside it. That discipline — inner layers never referencing outer ones — is what makes the proofs possible at the end.

---

## 2. The Onion at a Glance

The eight terms are not eight peers. They organize into **three relations** and **five sorts of thing**, arranged in five concentric layers:

```
IS  ⊂  OBJECT  ⊂  {HAS, PROPERTY, VALUE}  ⊂  {DOES, TRANSITION}  ⊂  PROCESS
```

Layer 0 is individuation (IS). Layer 1 is what gets individuated (OBJECT). Layer 2 is what objects hold (HAS, with PROPERTY as the slot and VALUE as the content). Layer 3 is what objects do (DOES, with TRANSITION as the rule). Layer 4 is the bridge that folds the dynamic side back into the static side (PROCESS, a transition treated as an object).

Each relation has its nouns: IS traffics in objects, HAS traffics in properties and values, DOES traffics in transitions and processes. Every relation has its material; nothing dangles. That symmetry is the shape completeness takes.

---

## 3. Layer 0 — IS: The Ground of Individuation

Before you can say anything about a thing, you must be able to say **which thing** you are talking about, and what counts as *the same thing* across time and change. IS is that relation. It is not a property among properties: it is the precondition for property-tracking to be meaningful at all. You cannot record "this entity's temperature at time 1 and time 2" unless something already tells you both readings belong to *one* entity's timeline.

Formally, IS is a relation between objects:

```
IS  ⊆  O × O
```

The right-hand side is deliberate: "Rex is a mammal" relates the object *Rex* to the object *mammal*. Kinds are objects — abstract ones — which is why no ninth primitive called "type" is needed (this is Closure Rule 1, Section 8). IS supplies two things: **identity** (this is the same entity as before) and **kind-membership** (this entity falls under that kind). Both are individuation, at instance grain and type grain respectively.

Crucially, IS-facts are not zero-variance HAS-facts. A value that happens never to change is contingent constancy; an IS-fact is individuating necessity — losing it doesn't change the entity, it dissolves what counted as *the entity* at all. IS is therefore logically prior to everything outward of it.

---

## 4. Layer 1 — OBJECT: What Gets Individuated

An **object** is anything IS can individuate: a dog, a door, a number, a kind, a specific run of a program. Objects are the bearers — the things all other claims attach to. There is deliberately no restriction to physical things; abstractness is not a disqualification, because IS doesn't care what a thing is made of, only whether "same one again" is a coherent question about it.

Formally, let `O` be the universe of objects. Layer 0 gives us `IS ⊆ O × O`; Layer 1 simply names `O` itself. Everything in the outer layers will be a claim *about* members of `O` or will be *foldable into* `O`.

---

## 5. Layer 2 — HAS, PROPERTY, VALUE: The Static Axis

Objects hold things. HAS is the attribution relation, and it comes with a type/instance split that must never be blurred: a **property** is the slot — the dimension along which an object can vary (color, mass, owner) — while a **value** is what currently fills the slot (red, 4 kg, Alice). Property is the question; value is today's answer.

Formally, with `P` the set of properties and `V` the set of values:

```
HAS :  O  →  (P  ⇀  V)
```

Each object maps to a partial function from properties to values. Two consequences matter. First, *change* needs no primitive: "becomes" is merely a difference between two value-readings indexed by time, and time itself is just a value attached via HAS. Second — and this is Closure Rule 2 — **values may contain references to objects**: `O ↪ V`. A value can be a pointer, not just raw data. "Owned by Alice" is a property whose value refers to the object Alice. This single embedding is what makes all relational vocabulary (owns, adjacent-to, depends-on) derivable rather than primitive.

---

## 6. Layer 3 — DOES, TRANSITION: The Dynamic Axis

Objects act. DOES is the dynamic relation, and its noun is the **transition**: a rule of the form

```
t :  V_in  →  V_out
```

**input, transform, output** — nothing more. Input and output are the transition's boundary interface: they are what makes it a *function* rather than a label, and they are where one entity's doing touches another entity's holdings. The input need not be the same object as the output; only the interface must be declared.

Transitions compose: if `t₁ : A → B` and `t₂ : B → C`, then

```
t₂ ∘ t₁  :  A  →  C
```

and the composite is *itself a transition* — same shape, larger grain. This is the recursion result: a step is a small process, a process is a large step, and "transition between steps" and "transition between processes" are one operation applied at different scales. Composition never produces a new kind of arrow. In categorical terms, transitions form the morphisms of a category whose objects are value-interfaces; closure under composition is definitional.

---

## 7. Layer 4 — PROCESS: The Reification Bridge

A transition is a rule; but rules need to be named, instantiated, paused, retried, and tracked — that is, they need to bear IS-facts and HAS-facts. A **process** is exactly that move: a transition reified as an object.

```
ρ :  T  →  O
```

The reification map `ρ` takes a transition and returns an object that *represents* it, so the whole Layer 0–2 machinery applies to it: a process has an identity (which run is this?), has properties (started-at, current-position), has values filling them. Process means *transition-as-object* and nothing more; any use of "process" that a transition doesn't already cover signals redundancy.

This layer closes the onion back on itself: the dynamic axis folds into the static one, so one set of machinery serves both.

---

## 8. The Three Closure Rules

The eight terms close the system only under three explicit rules, each already motivated above.

- **Rule 1 (kinds are objects):** IS has codomain `O`; classes are abstract objects bearing their own properties.
- **Rule 2 (values hold references):** `O ↪ V`; relations are property–value pairs whose values point at objects.
- **Rule 3 (process is reified transition):** `PROCESS = ρ(T) ⊆ O`; no independent meaning is permitted.

---

## 9. The Formal Definition

The full system is the algebra

```
𝓜  =  ⟨ O, P, V, T ;  IS, HAS, DOES ;  ∘, ρ, ι ⟩
```

with:
- **sorts:** objects `O`, properties `P`, values `V`, transitions `T`, and `PROCESS = ρ(T)`;
- **relations:** `IS ⊆ O × O`, `HAS : O → (P ⇀ V)`, `DOES ⊆ O × T`;
- **operations:** composition `∘ : T × T ⇀ T`, reification `ρ : T → O`, and reference-embedding `ι : O ↪ V`.

---

## 10. Theorem 1 — Closure

**Claim.** Every operation of `𝓜` applied to elements of `𝓜` yields an element of `𝓜`.

**Proof.** There are exactly three operations; check each.

(i) *Composition:* `∘` maps `T × T ⇀ T` by signature; the composite of two transitions is a transition, so `T` is closed under `∘`.

(ii) *Reification:* `ρ` maps `T → O`; its output is an object, already a sort of `𝓜`.

(iii) *Embedding:* `ι` maps `O ↪ V`; its output is a value, already a sort.

The relations produce truth-claims over existing sorts and generate no new entities. No operation has a codomain outside `{O, P, V, T}`; hence no use of the system ever manufactures a ninth sort. ■

---

## 11. Theorem 2 — Completeness

Completeness cannot be absolute — no finite vocabulary proves itself sufficient for all possible discourse. It is proven *relative* to one axiom about what modeling is.

> **Claim-Form Axiom.** Every atomic descriptive claim about an entity is one of three forms: an identity claim (what it is), an attribution claim (what it holds), or a transformation claim (what it does).

**Claim.** Under the axiom, every atomic claim is expressible in `𝓜`.

**Proof.** By cases on the axiom's trichotomy, at both type and instance grain.

- *Identity claims:* "x is the same as before" and "x is a K" are both `IS(x, y)` with `y ∈ O`, Rule 1 guaranteeing kinds live in `O`.
- *Attribution claims:* "x holds v along dimension p" is `HAS(x)(p) = v`; relational attributions are the case `v = ι(y)` by Rule 2.
- *Transformation claims:* at type grain, "x can do t" is `DOES(x, t)` with `t ∈ T`; at instance grain, "this particular run" is `ρ(t) ∈ O` by Rule 3, individuated by IS and described by HAS like any object.

Every branch of the case analysis terminates in the eight terms; no branch requires a term outside them. ■

The empirical corroboration: every candidate primitive proposed and examined — state, step, can, receives, relates-to, becomes, type, time — reconstructs as a composite (Section 13). A vocabulary that stops needing patches has closed.

---

## 12. Theorem 3 — Extensibility

**Claim.** `𝓜` extends conservatively: any new domain content is absorbed without new primitives, and any proposed new primitive is either redundant or violates the Claim-Form Axiom.

**Proof.**

*(Conservative growth.)* Extension means enlarging the sorts: new kinds and instances enter `O`, new dimensions enter `P`, new data enter `V`, new rules enter `T`. The operations `∘, ρ, ι` and relations are defined schematically over the sorts, so enlarging a sort changes no definition and invalidates no prior claim — extension is monotone.

*(No new primitives.)* Suppose a ninth primitive `X` is proposed. Either every claim made with `X` falls under the Claim-Form trichotomy — in which case, by Theorem 2, `X` is definable from the eight and is a composite, not a primitive — or some claim made with `X` falls outside the trichotomy, contradicting the axiom that bounds the modeling domain. Either way `X` is inadmissible as a primitive. ■

---

## 13. The Derived Vocabulary

Everyday modeling words are reconstructions, not losses.

- **State** is the pair (instance-identity, current-position): two values, one a reference — pure bookkeeping over DOES.
- **Step** is a single firing of a transition: `ρ(t)` plus bound input/output values plus a timestamp — a composite.
- **Can** is a transition defined but not instantiated: type without a running instance.
- **Relates-to** is HAS with `v = ι(y)`.
- **Becomes** is a diff across two timestamped value-readings.
- **Time** is ordering from composition, timestamps as values.

Each retired term names a *materialized view* of the primitives — kept for convenience, owed nothing ontologically.

---

## 14. Summary

Peel the onion outward: IS individuates; objects bear; properties and values describe; transitions transform; processes fold transformation back into objecthood. Three closure rules seal the seams. The system is closed because its three operations never leave its four sorts; complete because every claim-form the domain admits factors through its three relations; extensible because growth happens inside the sorts, never beside them. Eight terms — not because eight is a lucky count, but because type and instance were finally separated on both axes, and once that joint is cut correctly, the list stops growing.

---

## 15. Where the system shows up in this documentation tree

The IS–HAS–DOES system is not a museum piece. It is the load-bearing
wall under every other volume.

- **Volume I — Primmel Kernel.** [Chapter 2 (Subjects)](../primmel/02-subjects.md) operationalizes the three relations as Primmel's subject anatomy — the IS catalog (seven aspect kinds), the HAS catalog (six aspect kinds), and the DOES catalog (behaviors as processes). The "three questions" of §2.2 are IS / HAS / DOES.
- **Volume I — Processes.** [Chapter 4](../primmel/04-processes.md) develops Layer 3 (DOES/TRANSITION) and Layer 4 (PROCESS as reified transition): abstract processes are transitions in definition form, executable processes are reifications with state and registers.
- **Volume I — Mappings.** [Chapter 5](../primmel/05-mappings.md) treats reference vs implementation models as two populations of objects related by HAS-with-reference (`v = ι(y)` in the formal system).
- **Volume II — OIML Core.** [The subject chain](../oiml-core/02-subject-chain.md) (Family → Group → Model → Sample) is the IS relation specialized for measuring instruments, at four grains of kind-membership and instance-identity.
- **Volume III — Authoring.** Every Recommendation package is, formally, an enrichment of `O`, `P`, `V`, and `T` for the legal-metrology domain — the *extensibility* of Theorem 3 is what makes a domain-specific application possible without touching the kernel.

If a chapter ever seems to introduce a ninth term, treat it as a
materialized view (Section 13) and check what composite it is
shorthand for.
