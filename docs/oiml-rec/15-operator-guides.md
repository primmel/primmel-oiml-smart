# Operator guides — the twin flows, per role

Four operator guides for the program as it runs today: the **twin lab
operator**, the **lab tester** (guided run + attestations), the
**scheme operator** (surveillance, event-driven), and the **auditor**
(the lenses). Each names its role, its walkthrough, and the evidence it
produces. Depth lives at
[the Platform volume](../platform/README.md); these are the how-tos.

---

## A. The twin lab operator — connect, bind, watch compliance

*Role: the lab's twin operator. The page: `/app/twin-lab`.*

**What you're doing.** Binding a live twin endpoint (a real Primmel
SMART Twin or a simulated one) to a Recommendation, so the platform
judges the twin's served registers against the Recommendation's own
requirements — nothing about your instrument is hard-coded.

**Walkthrough.**

1. Open `/app/twin-lab`. Pick the Recommendation (R 60, R 91, R 129 or
   R 144 — the selector lists exactly the recs that declare a twin
   interface).
2. Enter the endpoint URL (`http://<host>:<port>/twin`) and press
   **Discover**. The page introspects the endpoint — the schema is the
   contract, never an assumption.
3. Read the **proposed binding**: every serve with its freshness
   window, the integrations (poll + watch), the command face (the
   model's invoke operations). Anything the endpoint can't answer is
   reported *missing* with its reason — read it; it is the honest
   state, not an error to dismiss.
4. Press **Bind**. The lab twin entity set provisions and the monitor
   wires the integrations.
5. Press **Run cycle**. The verdict stream fills: requirements that
   read at least one bound register judge pass/fail/indeterminate —
   through the same verdict engine as the workflow (never a second
   dialect).

**The evidence.** The binding proposal (validated by the real gateway
validator), the per-cycle verdict records with the resolved-input
snapshots (the re-judgment basis), and the honesty notes (access-scope
restatements, unbound serves).

**The why.** A bound twin is *continuous* conformance: the served
registers keep judging against the Recommendation between physical
tests — the practice ground for the live-twin certification program
(TW-1) that follows.

---

## B. The lab tester — the guided run + attestations

*Role: the tester performing a conformance test. The page: the Twin
Lab's guided run (after a bind).*

**What you're doing.** Walking the conformance test's OWN declared
steps as a script: the app tells you what to do to the physical
instrument; you do it and attest what the physical display says; the
twin's served reading records itself.

**Walkthrough.**

1. Bind (guide A, steps 1–4), then pick the test (e.g. R 60's MDLO
   repeatability test). The interpreter reads the test's declared
   steps verbatim — environment legs first.
2. **Environment legs**: "Set the chamber to 20 °C (click when
   done)". Do it on the instrument (or drive the SST's world channel —
   the practice buttons), then click. Each completion timestamps.
3. **Measurement rows**: "Place the calibrated load of 100 kg. Record
   the physical display's indicated weight in this box and click
   next." You type the PHYSICAL reading (the evidence of record); the
   twin's served reading auto-records with its serve timestamp and the
   pair skew.
4. **Commands** where the model declares them (R 91's self-test, R
   144's zero/span calibration): issue from the leg; the instrument's
   resulting state records.
5. **Finish**: the run compiles into the Recommendation's OWN evidence
   form (fields prefill from the entity graph — declared values are
   never re-typed), the form's computed fields evaluate, and the
   verdict chain judges the test's target requirements. The report
   block is the form instance + the target verdicts.

**The evidence.** The attested readings (of record), the twin
auto-captures with skew, the command log, the compiled form instance,
the verdict block. A twin that doesn't answer degrades to
`twin_error` — the attestation stands, never an invented value.

**The why.** The tester sees the test as the Recommendation DECLARES
it (steps, counts per accuracy class, the evidence form), and the
twin record pairs every physical act with its digital echo — the
seed of twin-fidelity evidence.

---

## C. The scheme operator — surveillance, event-driven

*Role: the certification scheme's operator. The pages: `/app/twin`
(the monitor), the twin-certification section.*

**What you're doing.** Watching the certified fleet: the fleet monitor
judges certified twins against their fidelity requirements on a
schedule AND on change — a served fault is a service case, a fidelity
breach escalates to the certificate machine.

**Walkthrough.**

1. `/app/twin` — the monitor surface: the watched units, the verdict
   stream, the escalation records, the connector health.
2. **The schedule**: the fleet watch fires hourly (the declared
   `every: 1h`) and **on change** (a pushed serve that CHANGES a value
   fires a cycle immediately — the event-driven posture; a repeat
   value does not).
3. **Drift**: a twin serving beyond its certified band flags
   — the escalation record opens with the requirement and the basis.
4. **Outage**: a connector that stops answering degrades the registers
   to `indeterminate` (the freshness gate — silence is not evidence),
   never a fail, never a silent pass.
5. **Fault**: a twin TRUTHFULLY serving `fault` is NOT infidelity — it
   passes fidelity and opens a SERVICE case (the declared policy:
   service, never a certificate flag).
6. **The certificate machine**: consecutive failed cycles suspend;
   rectified reinstates; unrectified past the threshold withdraws —
   the surveillance-action rules of the program's `validity.yaml`.

**The evidence.** Append-only fact/verdict/escalation streams
(version-pinned), the escalation records with basis lines, the
certificate machine's walk. Re-judgment reads only stored snapshots —
evidence accrues, never rewrites.

**The why.** Surveillance is a *declared policy executed by the
engine*, not a human calendar: every escalation carries its rule and
its basis.

---

## D. The auditor — the lenses

*Role: an auditor of ONE standard (or an approved set). The view: the
auditor lenses over an implementation model.*

**What you're doing.** Reading an implementation (a product, an
organization) through ONE reference standard's lens — never through a
merged claim.

**Walkthrough.**

1. Open the implementation's lens for YOUR standard (the LC-500 pilot:
   the R 60 lens and the twin-fidelity lens, side by side).
2. Your lens shows YOUR standard's governed set: its requirements, its
   mapped aspects, its verdicts — the same evidence underneath as the
   other lens, never merged.
3. **Collisions are declared**: if two of your approved standards name
   the same register, the collision doctrine shows it (computed
   deterministically); a resolution applies only if the model declared
   it in advance.
4. Trace any verdict back: the chain rule shows which consumer mapping
   carries the compliance (product aspect → standard requirement).

**The evidence.** The lens's requirement-verdict set, the map-profile
pairs (with their descriptions and justifications), the collision
report.

**The why.** An auditor's authority is one standard at a time; the
lens makes the implementation honest under exactly that authority —
[the multi-standard projection chapter](../platform/04-multi-standard-projection.md)
carries the doctrine.

---

*Next: [Running the demo](13-running-the-demo.md) (the full manual)
or [Role paths](14-role-paths.md) (your first hour per seat).*
