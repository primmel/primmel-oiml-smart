# Chapter 12 — Modelling Your Product

> *In this chapter:* the manufacturer side of the model supply chain —
> you author a **product reference package**: your instrument modelled
> as a subject (the same methodology as chapters 1–7), every
> conformance-relevant aspect and promise **mapped to the
> Recommendation**, and the package consumed by your customers in two
> modes — abstract import and live integration. The worked example is
> the pilot: **ACME's LC-500** load cell mapped to R 60, consumed by a
> quarry's belt scale. The normative spec of the supply-chain model is
> Volume I, [chapter 15](../primmel/15-model-supply-chain.md) — this
> chapter is the authoring path.

---

## 12.1 Why a product model

Chapters 1–9 produced the **standards-reference** side: the
Recommendation. Chapter 10 produced the **implementation** side for a
laboratory. The third publisher of the supply chain (Volume I, §15.1) is
you, the manufacturer: your LC-500 exists as a product whether or not
R 60 exists, and your model of it is a **reference model** — it states
what the product is and claims. It is *not* derived from the
Recommendation, and it does not compose the Recommendation: the two are
related by **mapping only**.

Today the product's conformance story lives in brochures, datasheets and
the certificate's prose. The product reference package makes it
computable — *"against which clause is this claim made, and does the
evidence support it?"* An unmapped product model is a brochure; a mapped
one lets your customer's engine reason about your product without
re-modelling it:

```text
user's implementation ──maps──▶ your product reference model ──maps──▶ the Recommendation
```

## 12.2 The manifest

A product reference package is an authored-native Primmel package — a
directory `primmel-packages/<vendor>-<product>/` whose manifest declares
the new package kind and the supply-chain facets:

```prl
package {
  id acme-lc500
  kind product_reference
  manufacturer "ACME Weighing GmbH"
  product "LC-500"
  version "2021"
  editions { 2021 }
  status current
  maps_to { oiml-r60 }
}
```

Four declarations carry the semantics:

- **`kind product_reference`** — the package speaks for the product.
  Registries skip it in rec listings; registries of the supply chain
  discover it by this kind.
- **`manufacturer` / `product`** — who the model speaks for and the
  product designation (linter rule C81 requires both).
- **`maps_to`** — the standards-reference packages this model maps to
  (C81 again: every entry must resolve, must not itself be a product —
  products map to the standard, never to each other — and must be
  actually mapped; every map profile's namespace must be declared here).
- **No `uses` of the Recommendation** — import is not mapping (C24);
  the product model is a peer, not an overlay.

## 12.3 The subject — the methodology, applied by you

Author the product model exactly as any subject model (chapter 2) — the
full IS/HAS/DOES anatomy (Volume I, §15.2):

- **IS**: design parameters, promises, metadata, provenance. Quantity-
  typed design parameters carry their literal as the qualifier string
  (`e_max : "500 kg"`) — this is the vocabulary your customers'
  design-time validation reads (§12.5). The promises are your claims on
  characteristics and behavior (chapter 3's promise grammar), each with
  `verified_by` citing the verifying requirements — and the
  certificate's provenance rides `is.provenance` (the promises-as-
  verified stratum: the claims as declared *and* the claims as verified,
  distinguishable, both citable).
- **HAS**: exhibited attributes, the characteristics the standard's
  tests compute, the operational state machine.
- **DOES**: the response behaviors (creep) and the self-tests.
- **Twin-ready**: the `endpoint` declaration (IS-level — "this product
  offers this interface") and the `serve` bindings with freshness
  windows (Volume I, chapter 14) — required only if your customers
  integrate live (§12.5, mode 2).

## 12.4 The mapping — the conformance claim made computable

The decisive act: every conformance-relevant aspect and promise is
mapped to the Recommendation's — aspect by aspect, promise to
requirement. Declare the local aliases of the reference elements you map
to (the C21 discipline — `requirement oiml-r60#/req/class-c/mpe { … }`,
citing the real clause in `source`), then the profile:

```prl
map_profile oiml-r60 {
  description "LC-500 → R 60: the manufacturer's conformance claim, made computable."
  mapping {
    mpe_within -> oiml-r60#/req/class-c/mpe {
      description "The class-limited error promise answers the class C MPE requirement."
      justification "Same quantity, same clause definition."
    }
    e_max -> oiml-r60#/req/metrological/measuring-range-max {
      description "Our E_max is R 60's E_max."
      justification "Same quantity, same clause definition (R 60-1, 5.2.2)."
    }
    …
  }
}
```

The discipline the gates enforce:

- **100 % of the tested characteristics covered.** Every block-form
  promise is a mapping source (C82 `product-unmapped-promises` warns at
  authoring — an unmapped promise is a brochure claim), and the
  platform's product-coverage gate recomputes the coverage over the real
  Recommendation: every characteristic/behavior your promises target
  must be reachable through a mapping, or the gate fails.
- **No dangling clause refs.** The same gate resolves every map target
  against the Recommendation's real requirement/test vocabulary.
- Every pair carries `description` + `justification` (C25 demands the
  description at audit strictness) — this is the text your customer's
  auditor reads instead of interviewing your engineers.

## 12.5 The two consumption modes — what your customer authors

Your customer (the integrator, the quarry, the factory) owns an
implementation package and consumes yours in one of two modes — serve
both; you author once (Volume I, §15.3).

**Mode 1 — abstract import.** The customer's manifest pins the edition:

```prl
package {
  id quarry-belt-scale
  uses { acme-lc500@2021 }   # version-pinned — no unpinned reference
}                            # consumption (C83 abstract-import-pinned)
```

The import is reference content at the pinned edition: the composer
locates and pin-checks your package but never content-merges it. And the
import is itself a mapping — the customer maps their usage to your
promised aspects (`map_profile acme-lc500 { … }`; C24 exempts the edge —
the import IS expressed as a mapping), so coverage applies: *how much of
your promised envelope does their installation actually use?* Design-
time validation comes with it: the customer's quantity claims that map
to your quantity-typed design parameters must hold against your promised
envelope — *the scale's capacity within your E_max* — computed by the
platform's gate, failing loudly on an exceeded envelope.

**Mode 2 — live integration.** The deployed instance serves its
endpoint; the customer's implementation model integrates it directly —
your served aspects feed their registers, your operational state gates
their processes, your promises are monitored by the Compliance Engine
inside their compliance story (Volume I, chapter 14's rules apply:
declare the endpoint and the serve bindings they consume). Their
evidence references your twin's — endpoint, operation, timestamps,
version pins — never copies it.

## 12.6 The chain rule — what the platform computes

The topology is a chain of typed mappings, and the coverage calculus of
Volume I, chapter 5 gives it teeth (§15.4):

- **Transitivity at process level**: the customer's mappings to your
  aspects compose with your mappings to the standard, yielding derived
  user ⇒ standard pairs — the part of their R 60 conformance that flows
  through your cell's mapped promises, answered by computation.
- **The shared-component guard**: the chain only works through *shared
  components*. Where the customer's process maps an aspect you never
  mapped, no compliance flows — and the coverage report says so,
  visibly (it never fails: operational data is legitimately unmappable).

The platform's supply-chain gate (`browser/build/product-coverage.ts`,
validate section 1h) computes all of it on every build; the pilot's
steady state is the proof:

```text
acme-lc500 (product_reference → oiml-r60; consumers: quarry-belt-scale)
  ✓ tested characteristics covered: 3/3
  ✓ design-time: capacity_within_emax — the claimed envelope (max 500 kg) fits the promised 500 kg
  ⇒ batch_weighing —[mpe_within]→ oiml-r60#/req/class-c/mpe
  ⇒ batch_weighing —[fault_annunciation]→ oiml-r60#/req/electronic/no-significant-faults
  ⇒ capacity_within_emax —[e_max]→ oiml-r60#/req/metrological/measuring-range-max
  ○ guard: batch_weighing → indication — the live register feed flows no compliance (visible)
```

## 12.7 The gates, in order

1. `primmel check --strict --audit primmel-packages/<your-package>` —
   the linter: C81 (your declaration resolves), C82 (no unmapped
   promises), the C21/C22 mapping discipline, C83 on your customer's
   side (their pin).
2. `cd browser && npx vitest run src/__tests__/product-supply-chain.test.ts`
   — the platform proof: the chain-rule gate, the mutation proofs (every
   leg fails loudly), the abstract import's reference-only composition,
   the promises-as-verified derivation from the type evaluation record,
   and the live-integration runtime over the real gateway and monitor
   services.
3. `cd browser && npm run validate` — section 1h recomputes the whole
   chain on every validation run.

The running example to copy: `primmel-packages/acme-lc500/` (the product
model + the R 60 mapping) and `primmel-packages/quarry-belt-scale/` (the
customer in both modes). Multi-manufacturer composition — one customer
integrating two product packages — is the same pattern twice: the
patterns compose; nothing in the chain rule privileges one manufacturer.

---

*The supply-chain model itself — the three publishers, the two modes,
the passport, the worked example — is specified in Volume I,
[chapter 15](../primmel/15-model-supply-chain.md); the twin machinery
(mode 2) in [chapter 14](../primmel/14-live-twins.md).*
