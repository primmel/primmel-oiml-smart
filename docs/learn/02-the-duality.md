# Tier 2 — the duality (half a day)

Tier 1 gave you one model in your hands. This tier gives you the
distinction the whole program is built on: **reference** models and
**implementation** models — and how ONE implementation is read through
SEVERAL references without ever merging the claims. You will map a
product to a standard, and then look at it through two different
lenses.

**Learning outcomes.** At the end you can:

- say what makes a model *reference* (an authority's governed
  vocabulary) vs *implementation* (somebody's reality described against
  it);
- read a `map_profile` as a conformance claim made computable — aspect
  by aspect, with a justification per pair;
- explain why an auditor ever sees ONE lens, and why a shared register
  is a declared doctrine, never an accident.

## The two kinds of model

A **reference model** is authored by an authority and says what shall
be true: OIML R 60 (what load cells shall satisfy), ISO 9001 (what a
quality system shall do), the twin-fidelity program TW-1 (what a twin
shall prove). It is complete in itself and answers to no one.

An **implementation model** is authored by someone with a reality to
account for: a manufacturer's product (the ACME LC-500), an
organization's management system, a laboratory's equipment set. It is
*complete in itself too* — and it declares its relationship to the
references by **mapping**, never by import:

```text
reference      oiml-r60           oiml-twin-cert
                  ↑                 ↑
               map_profile       map_profile      (C21 aliases, pairs,
                  ↑                 ↑               justifications)
implementation        acme-lc500  (ONE product, TWO claims)
```

The rules that keep it honest:

- **Mapping, never import.** The product declares local aliases of the
  reference elements it maps to (the C21 discipline) and pairs its own
  aspects to them. `uses` would *include* the reference — inclusion ≠
  fulfilment (the C24 rule). The LC-500 composes nothing from R 60.
- **Any number of layers.** References can map to references (an
  integrated reference built from several standards, sharing processes
  DRYly); implementations can import implementations (the quarry
  imports the LC-500's reference model — abstract, or live).
- **One implementation, many lenses.** The product maps to R 60 AND to
  the twin-fidelity program. The auditor of R 60 sees the R 60 lens;
  the twin-fidelity auditor sees theirs. The platform never computes a
  "merged compliance".
- **Collisions are declared.** If two mapped standards name the same
  register, the collision is computed deterministically, and a
  resolution applies only if the model declared it in advance.

## Hands-on — read a real conformance claim (2 hours)

The shipped product reference model is the teaching case. Open
`primmel-packages/acme-lc500/model/r60-map.prl`:

1. Find the twin projection pairs (`lc500_api -> oiml-r60#/twin/interface/endpoint/loadcell_api`):
   the product's endpoint IS the standard's governed surface — the
   full twin's richer anatomy filtered out above it.
2. Read one pair's **justification** — every pair carries one
   ("same quantity, same clause definition — our error-hold
   characteristic is the quantity the stationary field test computes").
   That is the claim, in words, per aspect.
3. Now open `model/twin-cert-map.prl` — the SAME product's second
   claim, to the twin-fidelity program. Two map profiles, one product,
   no merged pair set.

**Make it (the checkable artifact).** Run the chain-rule gate over the
real packages:

```bash
cd browser && npx vitest run src/__tests__/product-supply-chain.test.ts
```

All pairs resolve, every promise is a mapping source, zero lint errors
— you have just verified a manufacturer's conformance claim the way
the platform does. Then run the multi-standard legs:

```bash
npx vitest run src/__tests__/lens-collisions.test.ts src/__tests__/lenses-page.test.ts
```

The collision doctrine computes deterministically (the LC-500's two
standards disjoint today, a synthetic shared register surfacing as
`shared`), and the lens page renders the auditor's view — two
standards side by side, no silent collision.

## Where next

Tier 3 follows the claim downstream: how a mapped requirement becomes
a test, evidence, a verdict, and a certificate — with the Twin Lab as
the hands-on environment. Depth if you want it now:
[the multi-standard projection](../platform/04-multi-standard-projection.md).

*Next: [Tier 3 — the chain](03-the-chain.md).*
