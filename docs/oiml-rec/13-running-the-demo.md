# Running the demo (the full chain, bootstrapped)

The platform boots with demo data for the **full chain**: the OIML-CS
certification workflow, the participant registry, the live-twin monitor,
and the twin-certification program — plus four standalone simulated
instruments. This page is the 5-minute bootstrap and what to look at in
each link.

## 1. Bootstrap (2 minutes)

From a clone of the smart repo:

```bash
cd browser
npm install
npm run reset-db     # 7 demo accounts (roles below)
npm run dev          # astro on http://localhost:5190 + the auth server on 3190
```

`reset-db` seeds the demo accounts (log in from the Gate page — every
account accepts any password in the demo posture):

| Account | Role | Sees |
|---|---|---|
| `admin@oiml.org` | admin | everything |
| `applicant@oiml.org` | applicant (HBK) | the applicant portal |
| `ia@oiml.org` | IA officer (DE1) | the IA console |
| `tl@oiml.org` | TL operator (PTB) | the lab workbench |
| `cs@oiml.org` | CS administrator | the CS admin console + the twin console |
| `viewer@oiml.org` | viewer | read-only |
| `developer@ribose.com` | admin | everything |

On first boot each workspace seeds itself from the compiled sample data
(the seed-once discipline — reseeding never overwrites live edits).

## 2. The CS certification workflow (the 14 seeded flows)

The sample data carries **14 complete manufacturer storylines** for
OIML R 60 (plus R 91/R 129/R 144 flows): manufacturer → instrument
family → group → model → sample → application → test request → lab
assignment → test report with real form instances → evaluation report →
certificate. One storyline stops just before certificate issuance (the
pre-signature gate demo — the issuance gate fails closed without the
finalized evaluation).

Walk it: the applicant portal (submit an application) → the lab inbox
(the PTB operator's test requests) → the test-run view (execute a test,
watch the form's computed verdicts) → the evaluation report → the
certificate (sign and issue).

## 3. The OIML-CS participant registry

The participants seed covers the B 18:2025 machinery: organizations,
utilizers/associates, participant declarations (with the sign/suspend
state machine), participant applications, competence evidence, approval
votes, and category schemes. The CS admin console walks the registry —
declarations sign when their competence evidence is complete and fail
closed otherwise.

## 4. The twin console (the live monitor)

`/app/twin` — provision the demo twin (the ACME LC-500 SN-0042) and the
hourly monitor starts judging its served registers against the simulated
feed: **run a cycle** (fresh verdicts), **drift** (the twin's served
value drifts — the verdict flips to fail and the escalation opens a flag
and a service case), **outage** (the feed dies — verdicts degrade to
indeterminate, never fail; the health log records it), then re-judge a
window against a tightened limit with zero feed queries (INV-5).

## 5. The twin-certification program (the newest link)

The twin console's **Twin certification** section — provision it to get
the ACTIVE twin certificate `TC/2027/DE-0042` over the same SN-0042
(scheme type 5, conditional validity on the `twin-fidelity-fleet`
monitor) and the D2 probe evidence: a range point and the behavioral
creep dwell (900 s at 450 kg, max drift 0.01 kg against the class-C
allowance of 0.021 kg — the class-parameterized behavioral fidelity of
TODO.v3/02). Live surveillance runs in the acceptance runtime (the
vitest flows and the pilot), never on the page.

## 6. The simulated instruments (standalone)

Four families, each bootable alone with zero SMART checkout:

```bash
npm start -w @sim/lc500          # the load cell (bench at http://localhost:5290)
npm start -w @sim/gas-analyzer   # the two-channel gas analyzer (R 144)
npm start -w @sim/r91            # the Doppler radar speed meter (R 91)
npm start -w @sim/md             # the optical conveyor dimensioner (R 129)
```

Each serves its twin on `/twin` (the governed projection) and the
physical world on `/world` (place a load, sweep the environment, inject
a fault, swap a scenario). The LC-500's `creep-cell` scenario is the
deliberate fail case for the behavioral probe; the `good-cell` is now
class-C creep-honest. Guard `/world` for any non-local boot with
`SIM_WORLD_TOKEN`.

## 7. The pilot (the asserted end-to-end proof)

```bash
cd browser && npm run pilot
```

The live-twin pilot: the ACME LC-500 product package → the sim's twin →
the monitor → the quarry consumer — six steps asserted end to end. The
twin-cert acceptance walks certify → flag → suspend → reinstate →
withdraw against the live sim in the vitest suite
(`twin-cert-acceptance`, `twin-cert-surveillance`, `behavior-probe`).

---

Every demo value is fictional and marked: the `twin-demo-` id prefix,
`demo: true` on the twin certificate, the fictional ACME products. The
normative content (the Recommendations, the OIML-CS documents, TW-1) is
byte-traceable to its published sources.
