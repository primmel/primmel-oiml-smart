# For legal-metrology authorities (the NMIs)

> *This section is for you if you are a national metrology institute or
> a legal-metrology authority — OIML's own members. It explains the
> program in legal-metrology language: traceability, uncertainty, the
> GUM-adjacent discipline, and why this tooling is yours.*

---

## 1. What OIML SMART is to an NMI

OIML SMART is the OIML's own executable-standards program: the
Recommendations are modeled once (in Primmel, the executable modelling
language) and the whole certification workflow runs from those models
— applications, dispatch, testing, evaluation, certificates, the
register, and the live surveillance of certified digital twins. For an
NMI this is not vendor software: **it is your own Recommendation,
executing under your own discipline, with every judgment traceable to
a clause.**

The three things an authority asks of any such system, answered:

1. **Is the judgment traceable?** Every requirement carries its clause
   URN (`source: { doc: urn:oiml:pub:r:60-1:2021, clause: "5.2.4" }`);
   every verdict records WHICH definition judged it (the INV-8
   definition-version pin) and the resolved inputs it judged from (the
   re-judgment basis, INV-5).
2. **Is the uncertainty honest?** The reference channel is *gated*,
   never assumed (§2); a stale value degrades to *indeterminate*, never
   a silent pass (§3).
3. **Can we reproduce it?** The whole stack stands up from a checkout
   and reproduces a type evaluation end to end — gated by the same
   commands you will run ([the authority quickstart](01-authority-quickstart.md)).

## 2. Traceability, mechanized

The platform's traceability chain is not a report — it is the runtime:

- **Reference materials are first-class.** A reference reading arrives
  through a *declared* channel (`reference_instrument` |
  `observer_attestation` | `sim_ground_truth` — the C99 probe-channel
  provenance facet), and an observer channel carries its declared
  traceability limitation ("twin ≡ display, not twin ≡ mass" — never a
  comment).
- **The U:MPE ≤ 1:3 discipline is a process in the model.** The
  reference-traceability gate (the oiml-integrated-ref package's
  `reference_traceability_gate` process) computes
  `reference_uncertainty / judged_allowance` and **voids the setup when
  the ratio exceeds one third** — INVALID (the setup was wrong), never
  an instrument failure, never a silent admission. This is the same
  discipline the Recommendations' reference materials enforce (the CGM
  U:MPE ≤ 1:3 constraint).
- **Pairing windows are declared, never invented.** A served value and
  its reference pair within the *declared* pairing window; a pair
  outside is inadmissible evidence — the run is void, never a fail.
- **Clause URNs everywhere.** Requirements, test procedures, and form
  fields carry their published-print addresses; the reconstruction
  congruence gate proves coverage, order, and text identity against
  the published source (the named gaps have reasons and only burn
  down).

## 3. The uncertainty + freshness treatment

The platform's answer to "what is this value worth?":

- **Freshness is first-class.** Every served register declares
  `fresh_within`; a value older than its window degrades verdicts to
  **indeterminate** (silence is not evidence) — never a fail on
  physics, never a pass on faith.
- **Skew is recorded, not hidden.** The served–reference pair's skew
  is computed from the two evidence times and judged against the
  declared window — the same pairing discipline as a laboratory's
  simultaneous readings.
- **ISO 14253-1 zones, structurally.** Verdict outcomes are
  `pass | fail | invalid | indeterminate`: conformance, nonconformance,
  *void* (the measurement was wrong — invalid), and *undecidable*
  (missing or stale evidence — indeterminate). No verdict ever
  collapses the last two into a fail.
- **Uncertainty-denominated limits.** Acceptance quantities are
  declared once as typed quantities with units (never bare numbers,
  INV-1), and verification-interval-denominated limits (the load
  cell's v) are a distinct quantity kind — a v-denominated observable
  against a mass limit is a defect by construction.

## 4. The member-state narrative

OIML is the authority of legal metrology and its members are the NMIs.
This program is **the members' own tooling**: the Recommendations are
your documents, the models are clause-traceable to them, and the
program's governance is the OIML-CS's own (B 18:2025 — its participant
registry, its documents corpus, its operations runtime, all modeled).
An NMI running OIML SMART on its own evaluations is exercising its own
mandate with better instruments — the standard is the source of truth,
the platform is a pure engine, and every claim in the tree has a
command that proves it.

*Next: [the authority quickstart](01-authority-quickstart.md) — stand
up the stack and reproduce a type evaluation, gated.*
