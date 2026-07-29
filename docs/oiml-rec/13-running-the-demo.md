# The demo manual — bootstrap, walkthrough, verification

The complete manual for setting up the OIML SMART demo: every command,
the output to expect, what to click, and how to verify each link of the
full chain — the OIML-CS certification workflow, the participant
registry, the live-twin monitor, the twin-certification program, the
standalone sim instruments, and the asserted pilot.

> **What is fictional, what is real.** Every demo *value* is fictional
> and marked: the `twin-demo-` id prefix, `demo: true` on the twin
> certificate, the ACME fictional products. Every demo *normative text*
> (the Recommendations, the OIML-CS documents, TW-1) is real and
> byte-traceable to its published source. Demo accounts accept **any
> password** — this is a development posture, never a deployment one.

---

## 0. Prerequisites

| Need | Check |
|---|---|
| Node.js 22 or 24 | `node --version` |
| The smart repo cloned | `cd smart` |
| (Optional, for the live-twin legs) the sim-instruments repo beside it | `ls ../sim-instruments` |
| Ports free: **5190** (app), **3190** (auth server), **5290** (sim, optional) | `lsof -i :5190` → nothing |

Install dependencies once:

```bash
cd browser
npm install
```

---

## 1. Seed the demo accounts — `npm run reset-db`

```bash
cd browser
npm run reset-db
```

Expected output (verbatim):

```text
Deleted /Users/…/smart/data/oiml-smart.db
Seeded 7 demo accounts
  admin@oiml.org — OIML Admin (admin)
  applicant@oiml.org — HBK Applicant (applicant, org: mfr-hbk)
  ia@oiml.org — IA Officer (DE1) (ia_officer, org: DE1)
  tl@oiml.org — TL Operator (PTB) (tl_operator, org: 21)
  cs@oiml.org — CS Administrator (cs_admin)
  viewer@oiml.org — Viewer (viewer)
  developer@ribose.com — Ribose Developer (admin)
Done.
```

This recreates the auth database from scratch. Run it any time you want a
clean login state — it is safe to re-run (it deletes only the auth DB,
not the browser-side workspace data; see §9 for the full reset).

## 2. Start the app — `npm run dev`

```bash
npm run dev        # stays in the foreground; keep it running
```

This starts two processes:

- the **Astro app** on `http://localhost:5190` (regenerates the data
  trees from the Primmel packages first — `gen:data` runs ahead),
- the **auth server** on `http://localhost:3190`.

Verify: `curl -s -o /dev/null -w "%{http_code}" http://localhost:5190/app`
→ `200`. Open `http://localhost:5190/app` in a browser.

## 3. Log in (the Gate)

The app opens on the **Gate** (login) page. Pick any demo account from
the §1 table — **any password works** in the demo posture. What each
role is for:

| Account | Role | What it demonstrates |
|---|---|---|
| `admin@oiml.org` | admin | every surface |
| `applicant@oiml.org` | applicant (HBK) | the applicant portal — apply for certification |
| `ia@oiml.org` | IA officer (DE1) | the Issuing Authority console — dispatch, evaluate, sign |
| `tl@oiml.org` | TL operator (PTB) | the lab workbench — test requests, test runs, forms |
| `cs@oiml.org` | CS administrator | the CS admin console + the **twin console** |
| `viewer@oiml.org` | viewer | read-only browsing |
| `developer@ribose.com` | admin | every surface |

**First boot only:** the workspace seeds itself from the compiled sample
data (the *seed-once* doctrine — reseeding never overwrites your later
edits). You will see the seeded content appear within seconds.

## 4. The OIML-CS certification workflow (the 14 seeded flows)

The sample data carries **14 complete manufacturer storylines** for
OIML R 60 (plus flows for R 91, R 129, R 144):

manufacturer → instrument family → group → model → sample →
application → test request → lab assignment → test report with real
form instances → evaluation report → certificate.

One storyline deliberately stops just before issuance — the
pre-signature gate demo (the issuance gate **fails closed** without the
finalized evaluation; that is the point).

Walk it in order:

1. **Applicant portal** (as `applicant@oiml.org`): the applications
   list — open one, see its status, documents, and the instrument it
   covers.
2. **Lab inbox / workbench** (as `tl@oiml.org`): the PTB test requests
   — open one and start a test run.
3. **The test-run view**: execute a conformance test against the real
   form schema — enter readings, watch the form's **computed verdicts**
   (per-row and overall) evaluate live against the requirement's limits.
4. **The test report**: the completed form instances — the evidence
   the evaluation reads.
5. **The evaluation report** (as `ia@oiml.org`): per-provision
   determinations against the Recommendation's requirements, the
   conclusion on the type.
6. **The certificate**: sign and issue (or watch the pre-signature
   gate story refuse, correctly).

## 5. The OIML-CS participant registry (B 18:2025)

The participants seed covers the framework: organizations,
utilizers/associates, participant **declarations** (with the
sign/suspend state machine), participant **applications**,
**competence evidence**, **approval votes**, and **category schemes**.

Walk it (as `cs@oiml.org`): the CS admin console — open a Declaration,
see its competence evidence, and note the signing gate: a Declaration
signs only when its evidence is complete; otherwise the action fails
closed with the reason printed.

## 6. The twin console (the live monitor) — `/app/twin`

1. Click **Provision the demo twin** — this creates the ACME LC-500
   SN-0042 (all ids carry `twin-demo-`) and starts the hourly monitor
   against the simulated feed.
2. **Run cycle** — fresh verdicts land in the verdict stream (pass on
   the good cell).
3. **Drift** — the twin's served value drifts: the next cycle's verdict
   flips to **fail**, and the escalation stream opens a **flag** and a
   **service case** (watch them appear, deduped while open).
4. **Outage** — kill the feed: verdicts degrade to **indeterminate**,
   never fail (silence is not evidence); the connector health log
   records the outage.
5. **Re-judge** — re-check a stored window against a tightened limit:
   the verdicts recompute **with zero feed queries** (INV-5 — the twin
   is never re-queried), and the re-judged records append marked as
   re-judgments.

## 7. The twin-certification program (the newest link)

Still on `/app/twin`, scroll to **Twin certification**:

1. Click **Provision the twin-cert demo** — creates the ACTIVE twin
   certificate `TC/2027/DE-0042` over the same SN-0042 (scheme
   **type 5**, conditional validity on the `twin-fidelity-fleet`
   monitor) and the D2 probe evidence.
2. Read the certificate card: number, status, issue/expiry, the
   conditional-validity conditions.
3. Read the **probe evidence** table: a range point (served vs
   reference, pairing skew) and the **behavioral creep dwell** — 900 s
   at 450 kg, max drift 0.01 kg against the class-C allowance
   **0.021 kg** computed from the Recommendation's own tables
   (TODO.v3/02 — class-parameterized behavioral fidelity).

The section is declaration + seeded evidence. Live surveillance
(flag ⇒ investigate ⇒ suspend ⇒ reinstate ⇒ withdraw) runs in the
acceptance runtime — see §9 — never on this page.

## 8. The simulated instruments (standalone)

Four families, each bootable alone with **zero SMART checkout** — the
way external users try the concept:

```bash
npm start -w @sim/lc500          # load cell:    bench at http://localhost:5290
npm start -w @sim/gas-analyzer   # gas analyzer:  R 144, two channels (CO, NOx)
npm start -w @sim/r91            # radar speed:   R 91 Doppler, 20–180 km/h
npm start -w @sim/md             # dimensioner:   R 129 optical conveyor
```

Each instrument serves:

- **`/twin`** — the governed projection (query the indication, watch
  the state), generated from its product reference package;
- **`/world`** — the physical world: `placeLoad`, environment sweeps,
  `injectFault`, scenario swap, `advanceTime`, `reset`;
- a **console** (`--console`) and, for the load cell, the **bench** web
  app at `http://localhost:5290/` (the physical scene + the paired
  analogue dial — read the needle; that is how a human catches a lying
  twin).

Try the deliberate fail case: `mutation { scenario(name: "creep-cell")
{ clock } }` — the cell creeps far beyond its class allowance (the
behavioral probe of §7 fails it). Swap back with `"good-cell"`.

For any **non-local** boot, guard the actuation channel:
`SIM_WORLD_TOKEN=<long-random> npm start -w @sim/lc500` (mutations then
need `Authorization: Bearer …`; queries and `/twin` stay open).

## 9. The asserted proofs (optional, for developers)

```bash
cd browser
npm run pilot                         # the 6-step live-twin pilot, asserted
npx vitest run src/__tests__/twin-cert-acceptance.test.ts    # certify → suspend → reinstate → withdraw against the live sim
npx vitest run src/__tests__/behavior-probe.test.ts          # the behavioral creep probe end to end
npx vitest run src/__tests__/sim-twin-acceptance.test.ts     # monitor verdicts against the real wire
```

## 10. Verify the demo is healthy (the checklist)

| Link | Proof |
|---|---|
| Auth | `npm run reset-db` prints the 7 accounts |
| App | `http://localhost:5190/app` returns 200 |
| CS chain | an application opens with its instrument + test requests |
| Registry | a Declaration shows its competence evidence + signing gate |
| Monitor | provision → run cycle ⇒ verdicts in the stream; drift ⇒ fail + flag |
| Twin-cert | provision ⇒ certificate `TC/2027/DE-0042` ACTIVE + 2 probe records |
| Sims | each `npm start -w …` boots; `/twin` answers; `/world` actuates |
| Pilot | `npm run pilot` — 6/6 steps asserted |

## 11. Troubleshooting

- **`EADDRINUSE: 5190/3190`** — another dev stack is running
  (`lsof -i :5190`). Stop it, or serve the app on an alternate port:
  `npx astro dev --port 5291`.
- **The app boots but pages are empty** — the first-boot seed raced a
  navigation. Reload once; if it persists, clear the browser's
  IndexedDB for the origin and reload (the seed re-runs once).
- **A stale workspace after upgrading** — the seed-once doctrine never
  overwrites live data. For a truly fresh demo: clear IndexedDB for the
  origin AND re-run `npm run reset-db`, then reload.
- **The monitor shows nothing after provisioning** — the evidence
  streams are the in-memory reference store: they reset when you leave
  `/app/twin`. Re-run a cycle.
- **`/world` returns 401** — the sim was started with `SIM_WORLD_TOKEN`
  set; pass the token (the bench terminal prompts once, the console
  reads the same env var).
- **Reset everything** — `npm run reset-db` + clear IndexedDB + restart
  `npm run dev`.

---

## What you just walked, in one paragraph

An applicant asks for certification; a laboratory tests the instrument
and records evidence in the Recommendation's own forms; an Issuing
Authority evaluates and issues a certificate; the scheme registry keeps
the participants honest. The certified instrument then lives its life
as a digital twin — a **governed projection** of what the standard
declares it governs — watched continuously by the compliance engine,
probed against physical references (points *and* behavior), certified
for fidelity, and suspended when it lies. Every artifact in that chain
is data in the Primmel packages; every verdict recomputes from stored
evidence; nothing is a mock.
