# The pilot report — the first campaign, executed

> **Status:** executed 2026-08-01 against the OIML SMART SST (the
> simulated hardware — the protocol's §1 slot filled by the
> `acme-lc500` SST instance; the /world channel stood in for physical
> access). The campaign followed the
> [protocol](16-real-instrument-pilot.md) step for step. Every number
> below is from the executed runs, not the design.

## 1. What the program got right — the simulated chain transferred unchanged

The certification chain ran against the live twin with **no
campaign-specific code**: admission, the probe schedule, the verdict
chain, the certificate, the evidence stream — the same artifacts that
ran in simulation carried the campaign:

- **Admission.** The SST's self-declared IS-facts (identification,
  classification, design parameters) read through the twin's
  `Query.instrument` matched the package's declarations — the first
  fidelity check passed with the pair-of-eyes step done by the schema
  conformance check (startup, zero manual edits).
- **Baseline probes.** Indication at no load, mid-range, and capacity
  read inside the declared bands; every probe pair (twin read vs
  world ground truth) landed inside its pairing window — 441
  single-value checks in the instance-delegation parity suite, all
  identical.
- **Behavior probes.** The full behavioral class executed live: creep
  dwell, freshness degradation, fault injection and recovery, the
  warm-up arc, and the streamed transition log.
- **The decision.** Verdict chains computed per cycle; the
  certificate issued as a CNML document with its evidence chain
  intact (the `cnml-verify` contract, live).
- **Surveillance.** The monitor's schedule ran the quarter-accrual
  pattern (the pilot e2e: 2,147 + 2,147 pass verdicts; drift flags, an
  outage degrading to `indeterminate`, a fault opening a service
  case) — append-only, no rewrites.

## 2. What δ meant against the (simulated) instrument

The fidelity tolerance δ was read per the protocol §6 — class-sized,
time-paired, residuals as data:

| Probe | The band | The observed | Reading |
|---|---|---|---|
| Creep dwell, good cell (fresh) | ≤ 0.021 kg (class allowance, 450 kg × 900 s) | ≈ 0.009 kg | **pass** — the good cell holds its class with margin; the residual is the physics (2.0e-5 creep coefficient), not noise |
| Creep dwell, creep-fail sample | the same | 1.8 kg (450 → 451.8) | **fail** — the twin whose dynamics exceed the envelope; the verdict is a fail, never an invalid |
| Reference drift mid-dwell | INVALID above allowance/3 | driven at 455 kg | **invalid** — the setup voids, never a silent fail |
| Stale twin (servedLagS 3600 s) | freshness window | verdict `indeterminate` | staleness degrades, transport stays ok |
| Warm-up arc | 5τ (300 s) | `warming` → `ready` at 301 s | the arc holds within a second of τ |
| Fault injection | op_state register | `fault` streamed; service case opened | the state rule fires through the SSE push channel |

**The residuals distribution is part of the answer**: the good cell's
creep sits at ~43 % of the class allowance — a realistic margin for a
well-made cell, and far from the "suspiciously perfect" zone the
protocol warns about (§6: a twin that is *too* perfect is as suspect
as one that drifts).

## 3. The corrections fed back into the models

The campaign surfaced four real defects in the v2 SST surface, all
fixed at the source (never patched around):

1. **The mechanical stage did not integrate** — strain read 0 under
   load and creep never developed (the elastic-only residue of the
   data-driven boot fix). Fixed in the runtime: instance creep-law
   coefficients override the profile's law; the composer's ground
   truth reads real stage states. Proven here: 450 → 451.8 kg.
2. **The environment read-back was absent** from the lc500 world
   surface. Fixed in the kind's SDL (clockS + environment declared;
   the composer already had the values).
3. **The warm-up arc was unreachable** (boot/reset landed straight on
   `ready`). Fixed in the composer: power-on at `warming`, settle at
   5τ, lazily at read.
4. **The SIM_WORLD_TOKEN guard was dropped** (mutations answered 200
   without the bearer). Fixed in the runtime's CLI wiring: 401
   without, 200 with, queries open — the practice channel's guard is
   back.

A fifth correction is a test-side lesson, kept honest: the good-cell
creep coefficient (3.0e-4) was tuned for the legacy unit semantics
and would have failed its own class under the correct law; it is
re-tuned to 2.0e-5 with the unit-semantics note in the coefficients
file.

## 4. The decision record

- **Instrument (simulated):** ACME LC-500 (fresh sample),
  `acme-lc500` SST instance, class C, 500 kg capacity.
- **Campaign:** admission ✓ → baseline ✓ → behavior probes (6/6) ✓ →
  decision ✓ → surveillance pattern ✓.
- **Verdict:** the twin-cert chain issues; the evidence stream is
  complete and append-only; every `indeterminate` traces to a named
  gap (never a silent pass).
- **Suites behind this report:** `twin-cert-streaming` 6/6,
  `behavior-probe` 4/4, `sim-twin-acceptance` 5/5,
  `composite-sst-acceptance` 3/3, `sim-practice` 9/9 — all live
  against the SST, 2026-08-01.

## 5. What the physical pilot still owes

The protocol's fieldwork legs — a physical instrument (or harness),
the chamber log against the campaign log, the human expert's
checklist walked by a metrologist who did not write the software —
remain fieldwork. This campaign proved every leg of the program
except the physics of an actual transducer; the SST's own realism
(creep residuals after thermal cycles, configurable per sample) is
what made the dry run meaningful.

## 6. Where the flow runs next

The certification chain this pilot's twins plug into now runs end to
end in the app: [the OIML-CS flow, executable](../oiml-cs/08-the-flow-executable.md)
(the oiml-cs volume, chapter 8) — application → sample request →
custody → runs → evaluation marks → CNML-signed issuance → BIML
registration, with the SST-guided run (chapter 8.1, the laboratory's
leg) consuming exactly the simulated instruments this report covers.
