# Role paths — your first 10 minutes, per seat

The [demo manual](13-running-the-demo.md) is the reference; this page
is the on-ramp per seat. Find your role, follow the short path, and end
at the manual's section for your depth. Every path assumes the
bootstrap is done (`cd browser && npm run reset-db && npm run dev` →
`http://localhost:5190/app`, any password).

## Applicant (a manufacturer seeking certification)

**Log in as** `applicant@oiml.org` (HBK Applicant).

1. Open the **applicant portal** — your applications list. Open one and
   read its status, the instrument it covers, and its documents.
2. Follow one storyline end to end: your instrument's family → model →
   sample → the test request it produced → the test report that came
   back.
3. Notice the pre-signature gate storyline: an application with a
   finalized evaluation that has *not* issued — the issuance gate fails
   closed, and the page tells you why.

*What it proves:* the workflow is real and inspectable, not a slide.
Depth: [demo manual §4](13-running-the-demo.md).

## Test Laboratory operator (PTB)

**Log in as** `tl@oiml.org` (TL Operator).

1. Open the **lab inbox** — the test requests assigned to your lab.
2. Start a **test run** on one. The form is the Recommendation's own
   report form: enter readings, and watch computed fields (errors,
   MPEs, per-row verdicts) evaluate live.
3. Complete it and read the compiled **test report** — the 18-element
   checklist (PD-05) is enforced at compilation.
4. Then the **Twin Lab's guided run** (`/app/twin-lab`, after a bind):
   the test as a script — environment legs click-when-done, measurement
   rows attest the physical display while the twin auto-records (the
   practice drive's `practice-` marker keeps rehearsals out of
   certification evidence).

*What it proves:* forms are evidence with teeth — computed, checked,
never decorative. Depth: [demo manual §4 + §6½](13-running-the-demo.md)
and [the operator guides §B](15-operator-guides.md).

## Issuing Authority officer (DE1)

**Log in as** `ia@oiml.org` (IA Officer).

1. Open the **IA console**: applications awaiting review — dispatch one
   to an eligible laboratory (the capability match is enforced: a lab
   only sees tests it is eligible for).
2. Open an **evaluation report**: per-provision determinations against
   the Recommendation's requirements, full coverage required, and the
   conclusion on the type.
3. Sign a certificate where the storyline allows — or watch the gate
   refuse, correctly, where it doesn't.

*What it proves:* dispatch and evaluation are gated by eligibility and
coverage, not by convention. Depth: [demo manual §4](13-running-the-demo.md).

## CS administrator (the scheme operator)

**Log in as** `cs@oiml.org` (CS Administrator).

1. Open the **CS admin console** — the participant registry: open a
   Declaration, read its competence evidence, and see the signing gate
   (it signs only when the evidence is complete).
2. Then open **`/app/twin`** (the twin console): provision the demo
   twin, run a monitor cycle, drift the feed (fail + flag + service
   case), kill the feed (indeterminate, never fail).
3. Provision the **twin-certification demo**: the ACTIVE certificate
   `TC/2027/DE-0042` and the D2 probe evidence — a range point and the
   behavioral creep dwell.
4. Read the **surveillance posture**: the fleet watch fires hourly AND
   on change (a changed serve fires a cycle immediately); a truthful
   `fault` opens a service case, never a certificate flag; consecutive
   failed cycles walk the certificate machine (suspend ⇒ reinstate ⇒
   withdraw).

*What it proves:* the scheme runs as data — registry, monitor, and
certificate machine alike. Depth: [demo manual §5–§7](13-running-the-demo.md)
and [the operator guides §C](15-operator-guides.md).

## NMI / legal-metrology evaluator

**Log in as** `admin@oiml.org` (or `cs@oiml.org`).

1. Walk the certificate's evidence chain backwards: certificate →
   evaluation → test report → the recorded readings — every verdict
   re-derives from stored snapshots (INV-5), nothing is a screenshot.
2. Note the honesty lines: `indeterminate` is not `fail`; silence is
   not evidence; the U:MPE ≤ 1:3 discipline in the probe forms.
3. Open the **certification library**: the Recommendation's
   requirements, each with its clause-URN provenance to the published
   OIML document — the standard's text and the platform's model are
   traceable, not paraphrased.

*What it proves:* traceability and GUM-culture honesty, mechanized.
Depth: [demo manual §4–§7](13-running-the-demo.md) and the architecture
site's twin-certification page.

## Learner (the curious engineer)

1. Boot a sim instrument standalone (`cd sst && npx tsx
   packages/runtime/sst-runtime/src/bin.ts run
   ../sst-instruments/packages/instances/acme-lc500 5290`) → the bench
   at `http://localhost:5290/` — place a load, watch the indication
   settle, read the paired analogue **dial** (a rendering of ground
   truth, never a served value).
2. Reboot on the `creep-fail` sample (append it to the run command):
   the twin now lies — its served value drifts while the world's load
   stays constant. Catch it: the dial says what the API won't. (A pure
   *lying* twin needs no reboot: `setFidelity(servedOffsetKg: 1)`.)
3. Then read the three-layer story in the architecture site's
   `docs/architecture/00-the-mental-model.md` (the `oimlsmart/smart`
   repository — member access today; the public mirror lands with the
   website wave) and play the lying-twin exercise in the sim
   (tier-1 hands-on — see the [demo manual §8](13-running-the-demo.md)).

*What it proves:* the epistemic wall is physical, not rhetorical — a
served value is a claim, not a fact. Depth: the sim's README, the
`tour` console command, and the [demo manual §8](13-running-the-demo.md).
