# The authority quickstart — reproduce a type evaluation

A runbook for a legal-metrology authority: stand up the OIML SMART
stack and reproduce a full type evaluation end to end. Every step
names the command and what the authority should see; the whole runbook
is gated by `npm run orient` (the same checklist the platform runs on
itself — `browser/e2e/orient.e2e.ts` in the `oimlsmart/smart`
repository, member access today, executed live).

---

## 0. Prerequisites

| Need | Check |
|---|---|
| Node.js 22 or 24 | `node --version` |
| The `oimlsmart/smart` checkout | `cd smart` |
| Ports free: 5190 (app), 3190 (auth) | `lsof -i :5190` → nothing |

```bash
cd browser && npm install
```

## 1. The one-command proof — `npm run reset-db && npm run dev`

```bash
cd browser && npm run reset-db && npm run dev
```

What the authority should see: the seed prints the seven demo accounts
(their roles are the OIML-CS's own — applicant, issuing authority,
test laboratory, CS administrator, MC/RC members, secretariat), and
the app serves `http://localhost:5190/app` (200). Demo accounts accept
any password — a development posture, never a deployment one.

## 2. Walk the certification workflow (the 14 seeded flows)

Sign in as `ia@oiml.org` (the issuing-authority officer). Open an
application: it carries its instrument model, its storyline, and its
dispatch. What the authority should verify:

- **Dispatch is eligibility-gated**: a laboratory only sees the tests
  its declared competence covers (the lab-selection evaluator over
  `evaluation/lab-selection-criteria.yaml`).
- **The evaluation report requires full coverage**: every applicable
  provision of the Recommendation determined, with the conclusion on
  the type — no partial determinations pass.
- **The certificate carries the workflow's state machine**:
  DRAFT → SUBMITTED → ACTIVE, with suspension and withdrawal as
  declared transitions (the certificate machine, not a status string).

## 3. Reproduce a type evaluation (the pilot, asserted)

```bash
cd browser && npm run pilot
```

What the authority should see (six asserted steps):

1. **ACME publishes** — the type evaluation executes (20 forms × 3
   samples); the certificate issues with 5/5 product promises
   *verified* (promises-as-verified, never decorative).
2. **The quarry integrates** — the consumer's design-time validation
   passes (the chain-rule gate: 3/3 tested characteristics covered,
   the capacity-within-E_max design check holds) and the live twin
   binds (four chain pairs — the indication flows to BOTH the R 60
   requirements and the twin-fidelity program, the multi-standard
   reality).
3. **The monitor runs** — hourly AND on change; a drift flags, an
   outage degrades to indeterminate, a truthful fault opens a service
   case (never a certificate flag).
4. **The passport serves** — the product passport's abstract + live
   views; its QR payload resolves through the endpoint.
5. **The audit trail** — clause → promise → the quarter's verdict
   history → this morning's batch records: every link resolvable.
6. The pilot prints its own green lines; 6/6 asserted is the bar.

## 4. The Twin Lab (the authority's workbench)

Open `/app/twin-lab`, pick R 60, point at a twin endpoint (a sim or a
real Primmel SMART instrument), Discover → Bind → Run cycle. The
verdict stream fills from the SAME verdict engine the workflow uses
(INV-9 — never a second dialect). Then the guided run: the test's
declared steps as a script, attested readings (of record) paired with
the twin's auto-captured serves (with the pair skew judged against the
declared `fresh_within`).

## 5. The health checklist (all of it, one command)

```bash
cd browser && npm run orient
```

Eight printed steps, each green: login → the application → the
participant registry → the demo twin provisioned → a monitor cycle →
the twin-certification section (the ACTIVE twin certificate
`TC/2027/DE-0042` + the D2 probe evidence) → the Twin Lab's connect
surface. If any step is red, the output names exactly which link.

## 6. What the authority just verified

- The Recommendation executed *as data* — requirements, tests, forms,
  evaluation, the certificate machine.
- Eligibility-gated dispatch and coverage-gated evaluation — the
  OIML-CS's own gates, mechanized.
- Traceability to the clause at every link (the position pack's §2).
- The twin direction: live surveillance, twin certification, the
  workbench — all declaration, all provenance.

*Next: [the member-state narrative](README.md#4-the-member-state-narrative)
in the position pack, or [the demo manual](../oiml-rec/13-running-the-demo.md)
for the full operator detail.*
