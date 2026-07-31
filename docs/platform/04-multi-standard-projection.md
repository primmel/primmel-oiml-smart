# Multi-standard projection — the auditor lenses

> *In this chapter:* an implementation model (a product, an
> organization) projects onto SEVERAL reference standards at once —
> and an auditor ever sees it through ONE lens (or an approved set),
> never through a merged claim. Status: ● shipped (TODO.v3/01).

---

## 1. The question it answers

A manufacturer maps one product to OIML R 60 *and* to the twin-fidelity
certification program. An organization builds one integrated management
system and gets audited against ISO 9001 *and* ISO/IEC 27001. The
implementation is one; the audits are several. How do you keep both
truths without forking the model or merging the claims?

The platform's answer is **projection**: the implementation model
carries a map profile per reference standard (`map_profile oiml-r60`,
`map_profile oiml-twin-cert`, … — the C21 alias discipline: local alias
declarations of the reference elements, never content-merged), and the
**auditor lens** is a computed VIEW over the implementation restricted
to one standard's governed set.

## 2. The rules that keep it honest

- **One implementation, several lenses.** The ACME LC-500's model maps
  to R 60 and to the twin-fidelity program; the auditor of R 60 sees
  the R 60 lens (its requirements, its verdicts), the twin-fidelity
  auditor sees theirs — the same evidence underneath, side by side.
- **No merged claims.** Each standard keeps its own lens and its own
  verdicts; the platform never computes a "merged compliance". The
  chain rule derives the flows for free: the quarry consumer's live
  indication flows compliance to *both* `twin-fidelity/indication-band`
  and the R 60 requirements.
- **Collisions are a doctrine, not an accident.** When two governed
  sets name the same register, `src/lenses/collisions.ts` computes it
  deterministically (`detectCollisions`) — and a shared register
  resolves stricter-wins ONLY when the model declares that resolution
  in advance, never assumed. Today's LC-500 lenses are disjoint (no
  silent collision); a synthetic shared register surfaces as `shared`.
- **Reference and implementation at any depth.** A lens can project
  from a deeper implementation to a shallower reference — you can view
  an integrated management system through the QMS lens alone. The
  machinery is the same map-profile calculus (Chapter 15 of the Primmel
  volume).

## 3. Where it shows up in the running system

- The product packages (`acme-lc500`, `acme-cgm-200`, …) carry one
  map per standard (`r60-map.prl`, `twin-cert-map.prl`).
- The view-lenses codegen projects the auditor lenses into the app's
  generated data (`browser/src/data/generated/view-lenses.ts`).
- The oiml-integrated-ref package demonstrates an integrated reference
  model built from several references that share processes DRYly.

## 4. Where the depth lives

The gated architecture page: `docs/architecture/13-multi-standard-projection.md`
(the `oimlsmart/smart` repository — member access today; the public
mirror lands with the website wave) — the full doctrine with the
collision calculus and the worked LC-500 example.

*Next: [The composite twin](05-the-composite-twin.md) — a system of
twins whose certificate reads the weakest declared link.*
