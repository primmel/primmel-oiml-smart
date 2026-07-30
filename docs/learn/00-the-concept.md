# Tier 0 — the concept (one hour)

The whole system in your head, in one sitting. Read this page slowly;
at the end you will be able to say what the system is, why it is shaped
this way, and where any fact lives. Everything after this is depth on
these same ideas.

## The eight terms

Every model in this world — a load cell, a Recommendation, a
certification program — is described with exactly eight terms. Three
**relations** and five **sorts of thing**:

- **IS** — identity: what a thing *is*. The truths that individuate it
  (this is the same entity as before; it is a member of that kind).
  Not a property among properties: lose it, and the thing stops being
  *that thing* at all.
- **HAS** — possession: what a thing *holds*. A **property** is the
  slot (mass, owner); a **value** is what fills the slot today
  (500 kg, ACME). Properties vary; values are read now.
- **DOES** — behavior: what a thing *does*. A **transition** is a rule
  (input → transform → output); transitions compose, and the composite
  is a transition. A **process** is a transition reified as an
  **object** — so it can have an identity, properties, and values of
  its own (which run is this? started when? where is it now?).

That is the entire vocabulary. Formally it is proved **closed** (no
operation escapes it), **complete** (every descriptive claim —
identity, attribution, transformation — factors through it), and
**extensible** (new domains enter as content, never as new primitives).

## The three claim forms

Every descriptive claim about anything is one of three forms — and that
is why requirements, tests, and forms are *secondary* models, never
peers of the subject:

- **Requirements** are constraints on a subject's IS/HAS/DOES ("the
  temperature range shall be X to Y").
- **Tests** are processes that probe a subject's IS/HAS/DOES to produce
  evidence ("run test procedure A at X, then at Y").
- **Forms** are interfaces for recording that evidence ("at 20 °C this
  input gave this output").

The subject — the measuring instrument — is primary. Everything else is
derived from it.

## The three layers of the digital twin

```text
Physical device
   ⇕  representation (any shape)
FULL DIGITAL TWIN   — the manufacturer's complete representation
   ⇕  PROJECTION, declared by the standard's governed aspect set
PRIMMEL TWIN      — only what the standard governs
   ⇕  fidelity proof (served ≡ physical within δ + freshness)
TWIN CERTIFICATION — certifies the projection, never the full twin
```

A manufacturer's twin can be arbitrarily rich — physics, telemetry,
history, diagnostics. The **Primmel twin** is a *tailored projection*
of it: only what the standard declares it governs (the governed aspect
set, in the Recommendation's own model). The manufacturer's internal
richness stays private; the projection is what you are allowed to read.

## Why not an admin shell

The industrial mainstream (Siemens et al.) calls a device interface an
"admin shell" — a standardized set of **verbs**: commands you may
invoke. The Primmel twin is **not that**. It is a **governed state
projection**: you read what the standard declared it governs. The
decisive difference is who designs the interface: an admin shell is
designed per vendor (it drifts per vendor); a Primmel twin is **derived
from the standard** — the interface is generated from the governed
aspect set, so every compliant twin has the same shape, and a
certification engine can rely on it. You cannot certify against an
interface that drifts.

## The one rule that keeps it honest

The Primmel packages are the **single source of truth**. Everything
downstream — the data trees, the generated code, the screens — is a
generated artifact, proven byte-identical to the packages by a drift
guard on every gate. You never edit a generated artifact; you edit the
package and regenerate.

## The tier-0 assessment

Explain, in your own domain (your instrument, your device, your
standard):

1. What is the subject, and what are its IS / its HAS / its DOES?
2. What would its full digital twin contain that its Primmel twin must
   not serve?
3. Who declares the governed aspect set — and why must it be the
   standard, not the vendor?

If you can answer all three with a straight face, tier 0 is done.
[Tier 1 — the hands-on](01-the-hands-on.md) makes them physical.
