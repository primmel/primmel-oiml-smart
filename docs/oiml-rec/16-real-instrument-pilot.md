# The real-instrument pilot — the protocol

> **Status:** execution-ready. Everything on this page is complete and
> gated *except* the physical run itself, which waits for one thing: a
> physical instrument with a Primmel SMART twin (or a faithful
> interface harness, §3). When such an instrument exists, this protocol
> is the runbook — no further design work is needed.

The twin-certification program is proven in simulation: the six
requirements, the probe channel, the verdict chain, the behavioral
fidelity classes, and the deployable compliance engine all run green
against the simulated SMART twins. The pilot proves the program
**outside simulation**: one real instrument, one real campaign, one
decision record a human expert can review line by line.

---

## 1. The instrument slot

The pilot instrument must provide one of:

1. **A native Primmel twin** — the instrument (or its companion
   service) serves the `/twin` contract derived from its product
   reference package, with the startup-conformance schema the runtime
   expects; or
2. **A faithful interface harness** — a bridge process that serves the
   same `/twin` contract by reading the physical instrument through
   whatever interface it has (§3).

Everything else — the governed aspect set, the probe schedule, the
verdict chain, the certificate — comes from the program unchanged. The
instrument is the *only* variable.

**Candidate profile (R 60, the reference pilot):** a digital load cell
with a readable indication channel (RS-485/Modbus, Ethernet, or a
vendor SDK), placed under a calibrated deadweight stack, in a room
whose temperature can be driven (a thermal chamber is ideal; a
patient day-night cycle is acceptable with longer windows).

## 2. The certification campaign

The campaign mirrors the simulated chain step for step — the same
twin-cert package, the same monitor, the same verdict engine:

1. **Admission.** Register the instrument: its product reference
   package (the manufacturer's, pinned `id@edition`), its twin endpoint
   (native or harness), its sample identity (serial number, the
   physical marks). The admission probe reads the twin's self-declared
   IS-facts and a human confirms they match the markings on the
   hardware — the first fidelity check is a pair of eyes.
2. **Baseline probes.** The monitor runs the declared probe schedule:
   indication at no load, at 20 %, at 50 %, at capacity — each probe
   reading the twin's served indication *and* the human-recorded
   physical display within the declared pairing window. Every pair
   lands in the evidence stream with both timestamps.
3. **Behavior probes.** The fidelity campaign: warm-up drift, a
   temperature cycle (the twin's served behavior vs the physical
   readings at each plateau), creep at a sustained load, return-to-zero.
   Each behavior class runs with the tolerance δ declared in the
   twin-cert package — §6 is how to read δ against a real instrument.
4. **The decision.** The verdict chain computes; the certificate (or
   the refusal, or the `indeterminate` with the gaps named) issues as a
   CNML document carrying the full evidence chain.
5. **Surveillance.** The monitor keeps its schedule for the campaign
   window; any degradation is a re-judgment, appended, never rewritten.

## 3. The interface-harness spec (for instruments without a native twin)

The harness is a small service between the physical instrument and the
`/twin` contract. Its duties, in contract order:

1. **Serve the derived schema.** The `/twin` schema is generated from
   the product package's serve declarations — the harness implements
   exactly that, nothing instrument-specific beyond it.
2. **Read the physical channel honestly.** Each serve names its
   physical source (the register, the command, the polling interval)
   and its `servedAt` is the *physical read time*, never the request
   time. Freshness windows judge what the harness cannot control.
3. **Declare its own fidelity.** The harness publishes its translation
   error budget (quantization, polling latency, unit rounding) as
   serves of its own — the fidelity verdict reads the harness's honesty
   as part of δ, because the twin is the instrument *plus* the harness.
4. **Never invent.** A channel that cannot answer yields `unavailable`
   — the epistemic wall applies to hardware as much as to software.

A harness is one process with one config file (channel, registers,
poll rates, the product package it serves). The reference harness for
the pilot targets a Modbus-RTU cell; a second transport is a new
config, never new code.

## 4. The evidence-review checklist (the human expert's pass)

The pilot's decision record is reviewed by a metrologist who did not
write the software. The checklist, in order:

- [ ] Admission: the twin's IS-facts ≡ the physical markings (serial,
      class, capacity) — photographed, appended.
- [ ] Every probe pair (twin read vs physical display) inside its
      pairing window; any outlier explained or re-run.
- [ ] The temperature cycle's plateaus genuinely reached (chamber log
      vs campaign log).
- [ ] Each behavior probe's δ read against the instrument's class
      (§6) — not against convenience.
- [ ] Every `indeterminate` verdict traced to its missing evidence —
      each gap named, none silently passed.
- [ ] The CNML certificate verifies cryptographically and every claim
      in it resolves to evidence rows the reviewer can re-read.
- [ ] The surveillance window's re-judgments append cleanly; no
      rewrite, no gap in the stream.

## 5. The pilot report

After the decision, the report (published next to this chapter):

1. What the program got right — where the simulated chain transferred
   unchanged.
2. What δ meant against a real instrument — the observed fidelity
   residuals vs the declared tolerance, per behavior class.
3. The corrections — every model or tolerance correction feeds back
   through the SSOT gate (`primmel-packages/` edit → `gen:data` →
   the drift guard), never as a hand-patched artifact.

## 6. Reading δ against a real instrument

The fidelity tolerance δ is the program's honesty parameter: the
maximum admitted divergence between the twin's served value and the
physical reading within a pairing window. In simulation δ is exact;
against hardware it meets reality:

- **Size δ from the class, not from the outcome.** For an R 60 class C
  cell, δ starts at a fraction of the MPE for the applied load (the
  twin must be *better than the verdict it feeds* — U:MPE ≤ 1:3, the
  same metrological discipline as any reference channel).
- **Pair in time, not in value.** The twin read and the physical read
  pair by timestamp inside the window; a pair that misses its window
  is `indeterminate`, never interpolated.
- **Residuals are data.** A campaign where the twin is *too* perfect is
  as suspicious as one where it drifts — the residuals distribution is
  part of the report (§5.2).

---

*When the instrument arrives: this page is the runbook. Admission on
day one; baseline on day two; the behavior campaign inside the week;
the decision record and this report's first draft inside the fortnight.*
