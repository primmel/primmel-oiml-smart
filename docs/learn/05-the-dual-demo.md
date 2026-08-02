# Tier 5 — the dual demo: model your own Recommendation

> *A curriculum chapter of [Learn OIML SMART](README.md).*

**The artifact:** a kernel-validated Primmel model of OIML R 7
(1979) — Clinical thermometers — built with Primmel Studio, plus the
live proof that it simulates, maps to its source document, and
previews as a certificate.

**Prerequisites:** [Tier 4 — authoring](04-authoring.md). The r60
classroom helps but is not required.

---

## Why a second instrument

Every earlier tier used OIML R 60 (load cells) — deliberately: one
instrument, learned deeply. This tier exists to prove the methodology
TRANSFERS. If you can model a mercury-in-glass clinical thermometer
with the same seven-step loop you used for load cells, the method is
yours; if you can't, the earlier tiers were memorization. That is the
whole point of the dual demo: r60 taught you the method, R 7 makes
you apply it.

## The seven-step loop

The full walkthrough lives with the model —
[`demo/r7-clinical-thermometer/TUTORIAL.md`](https://github.com/primmel/editor/blob/main/demo/r7-clinical-thermometer/TUTORIAL.md)
in the Primmel Studio repo. The loop it teaches:

1. **Read the document like a modeller** — instrument / truths /
   checks / verdict (the IS-HAS-DOES read).
2. **Open the model in the Studio** — the OIML program layer
   activates through the plugin, never a kernel branch.
3. **The subject anatomy** — IS identity + design parameters (the MPE
   table), HAS attributes + characteristics, DOES behaviors — and the
   certificate preview as the first secondary view.
4. **Requirements with provenance** — each a constraint on the
   subject's IS/HAS/DOES, each carrying its clause URN
   (`source: { doc: urn:oiml:pub:r:7:1979, clause: "…" }`).
5. **Conformance tests and forms** — tests interrogate the subject to
   produce evidence; forms are the evidence skeleton.
6. **The workflow, simulated** — the clause-8 ambient gate and the
   MPE gate, walked live with registers (conform / invalid ambient /
   out-of-MPE).
7. **The doc map + review + save** — the model mapped back onto the
   document's statements; the kernel's model-diff as the
   review-before-commit.

## The assessment gate

Reproduce the gate, as with every tier:

```bash
cd ~/src/primmel/editor
npx vitest run src/lib/__tests__/r7-tutorial.test.ts   # 6 tests
npx tsx e2e/r7-smoke.ts                                 # the live loop
```

- the package loads strict and validates clean;
- every doc-map target resolves against the real R 7 document
  (the anchor sentences pin to the right texts);
- the workflow simulates all three paths.

Then, the honest exercise: pick a third Recommendation (R 49 water
meters, R 76 non-automatic weighing) and run the same seven steps.
If the loop holds for you on a document you have never seen, the
curriculum is done.

## The dual demo, side by side

| | smart-r60 classroom | the R 7 tutorial |
|---|---|---|
| instrument | OIML R 60 load cells | OIML R 7 clinical thermometers |
| you learn | the methodology, six levels, live twin | applying it — document to validated model |
| the tool | the classroom viewer | Primmel Studio |
| the proof | the twin flips a verdict | the kernel's own validator, green |
