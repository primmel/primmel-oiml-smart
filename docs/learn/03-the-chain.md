# Tier 3 — the chain (a day)

Tier 2 taught you the claim. This tier walks the claim's whole
enforcement path: **requirements → tests → forms → evidence →
verdicts → certificates**. Every link is data, and every link can be
inspected at runtime — you will drive the full path against a live
twin in the Twin Lab and end with a test report that proves every
link.

**Learning outcomes.** At the end you can:

- trace one requirement from its clause to a verdict, naming every
  intermediate artifact;
- perform a guided test run: environment legs, attested readings, the
  twin auto-capture, the compiled evidence form;
- read a verdict's basis — the resolved inputs, the freshness window,
  the override rule;
- explain why requirements/tests/forms are *secondary* models, derived
  from the subject's IS/HAS/DOES.

## The chain, link by link

```text
REQUIREMENT   a constraint on the subject's IS/HAS/DOES, with a limit
              (an OCL expression over declared quantities) and clause
              provenance
     ↓ tested by
TEST          a procedure (a process) that probes the subject —
              declared steps, preconditions, acceptance criteria; an
              INVALID run (a violated precondition) voids, never fails
     ↓ records into
FORM          the evidence interface — one form per test, fields
              bound to the entity graph, computed fields evaluating
     ↓ becomes
EVIDENCE      the captured readings: attested values (of record) and
              twin-served values (auto-captured, with the pair skew)
     ↓ judged to
VERDICT       the requirement's limit evaluated against the bound
              evidence — pass | fail | invalid | indeterminate, with
              the resolved inputs snapshotted (the re-judgment basis)
     ↓ aggregated to
CERTIFICATE   the determination's output — every applicable
              requirement determined, full coverage required
```

Two honesty invariants hold at every link: **invalid voids, never
fails** (a wrong setup is not an instrument defect), and **stale
degrades to indeterminate** (silence is not evidence — a value without
a fresh timestamp judges nothing).

## Hands-on — drive the whole chain in the Twin Lab (half a day)

Setup: the app (`cd browser && npm run dev`) and a sim
(`cd sst && npx tsx packages/runtime/sst-runtime/src/bin.ts run
../sst-instruments/packages/instances/acme-lc500 5290`).

1. **Bind** (`/app/twin-lab`): pick R 60, enter the sim's `/twin` URL,
   Discover — read the proposed binding (the serves, the freshness
   windows, the command face). Bind.
2. **One cycle** (the compliance monitor): the verdict stream fills —
   requirements reading at least one bound register judge, live.
3. **The guided run** (the chain's heart): pick the MDLO test. The
   interpreter reads the test's declared steps verbatim:
   - *Environment legs* — "Set the chamber to 20 °C (click when
     done)". Drive the SST's world channel (the practice buttons —
     note the honesty banner: `practice-` ids, never certification
     evidence) or act on a physical instrument, then click.
   - *Measurement rows* — place the calibrated load, type the PHYSICAL
     display's reading (the evidence of record); the twin's serve
     auto-records with its timestamp and the pair skew.
   - *Commands* — issue the model's invoke operations from the leg.
4. **Compile**: the run lands in the Recommendation's OWN evidence
   form (fields prefill — declared values never re-typed), the form's
   computed fields evaluate, and the verdict chain judges the test's
   target requirements. Read the report block.

**Make it (the checkable artifact).** Your compiled form instance +
the target verdicts, printed by the page. The scripted equivalent to
verify against:

```bash
cd browser && npx vitest run --config vitest.e2e.config.ts e2e/twin-lab.e2e.ts
```

— the whole workbench walked green: connect → compliance → guided run
→ compiled evidence → verdicts.

## The why, in one paragraph

A certificate is not a judgment call — it is the **aggregate of
verdicts**, each computed from evidence, each traceable to a clause.
Any link you pull on unwinds: verdict → resolved inputs → the form's
computed values → the captured readings → the test's declared steps →
the requirement's limit → the clause. That is why the platform can
re-judge a window under a NEW limit later from the same stored
snapshots (INV-5) — evidence accrues, never rewrites.

Depth:
[the twin lab chapter](../platform/03-the-twin-lab.md) and
[the operator guides](https://www.oimlsmart.org/docs/oiml-rec/15-operator-guides)
on the OIML SMART site (the lab tester's walkthrough).

*Next: [Tier 4 — authoring](04-authoring.md).*
