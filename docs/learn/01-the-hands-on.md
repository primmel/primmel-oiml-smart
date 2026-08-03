# Tier 1 — the hands-on (half a day)

Tier 0 put the model in your head. This tier puts it in your hands:
you will boot a simulated instrument, act on its physical world, watch
a compliance engine judge it — and then catch it lying. Every step
tells you the command and what to expect.

**Setup** (2 minutes): from clones of
[`primmel/sst`](https://github.com/primmel/sst) and
[`oimlsmart/sst-instruments`](https://github.com/oimlsmart/sst-instruments),
side by side:

```bash
cd sst && npm ci
npx tsx packages/runtime/sst-runtime/src/bin.ts run   ../sst-instruments/packages/instances/acme-lc500 5290
```

(the bench is at `http://localhost:5290`). Optional, the scripted version
of this walk: add `--console` to the boot command and type `tour` —
the instrument narrates this same path for you.

## Part 1 — the two channels (30 minutes)

1. **Read the twin.** Query the served indication:

   ```bash
   curl -s -X POST localhost:5290/twin -H 'content-type: application/json' \
     -d '{"query":"{ indication { value unit kind servedAt } }"}'
   ```

   — this is what a certification engine is allowed to see: the governed
   projection, with its own timestamp.
2. **Read the world.** `POST localhost:5290/world` with

   ```json
   {"query":"{ groundTruth { appliedLoadKg clockS environment {
     temperatureDegC humidityPercentRh } } }"}
   ```

   — reality: the operator's view. `/world` is omnipotent by design
   (guard it for any non-local boot with `SIM_WORLD_TOKEN`).
3. **Place a load.** `{"query":"mutation { placeLoad(massKg: 40) { clock } }"}`
   then `{"query":"mutation { advanceTime(seconds: 30) { clock } }"}`
   and read the indication again — it settles on 40 kg.
4. **Sweep the environment.** `setEnvironment` the temperature to
   60 °C, advance 60 s, read the indication — it moved (temperature
   coefficients act on zero and span, exactly what the R 60 temperature
   tests measure). Back to 20 °C and advance — the reading does not
   return exactly (the configurable thermal-hysteresis memory).

What you just used is the tier-0 split made physical: **/twin is what
the instrument legally says; /world is reality.**

## Part 2 — the lying twin (45 minutes)

This is the tier's gate: you will catch a twin lying — and learn why a
served value is a claim, not a fact.

1. **Reboot as the creeping cell.** Physics variants are boot-time
   samples (one boot, one chain of custody): stop the sim, then
   `... run ../sst-instruments/packages/instances/acme-lc500 5290 creep-fail`.
2. Place 450 kg and advance **900 s** of virtual time
   (`advanceTime(seconds: 900)` — simulated, so no waiting).
3. **Read reality**: ground truth still says the applied load is
   exactly 450 kg — nothing physical changed.
4. **Read the twin**: the served indication has *drifted* (the
   creep-fail sample creeps toward ≈1.8 kg of asymptote). A
   certification engine reading only `/twin` would see a calm, fresh,
   *wrong* value.
5. **Catch it the human way**: open the bench
   (`http://localhost:5290/`) and look at the **analogue dial** — a
   rendering of *ground truth*, never a served value. The needle says
   what the API won't. That is why the paired dial exists: it is how a
   person catches a lying twin.
6. **Judge it the machine way** (if the SMART app is running): the
   behavioral creep probe computes the class allowance
   (0.7 × 1.5 v_min = **0.021 kg** for this class-C cell at 450 kg,
   from the Recommendation's own tables) and the drift exceeds it by
   two orders of magnitude — the twin **fails** behavioral fidelity,
   and the certificate machine walks: flag ⇒ investigate ⇒ suspend.
   (The full walk: `cd browser && npx vitest run src/__tests__/twin-cert-acceptance.test.ts`.)

## Part 3 — the verdict machinery (45 minutes)

1. **Restore the honest cell** (reboot on the default `fresh` sample;
   if you only made the twin *lie*, `fidelityReset` suffices — no
   reboot needed for fidelity knobs) and notice: the good cell sits
   *inside* the class allowance — its creep coefficient was
   recalibrated when the behavioral probe caught that it wasn't (the
   probe's first real finding; the point of having one).
2. **Watch a verdict flip**: with the SMART app up (`npm run orient`
   walks this for you), provision the demo twin on `/app/twin`, run a
   cycle (pass), drift the feed (fail + a flag and a service case
   open), kill the feed (**indeterminate** — silence is not evidence),
   then re-judge a stored window with zero queries to the twin.
3. Read the **evidence streams**: facts, verdicts, escalations —
   append-only; a failure never lands as evidence; a re-judgment
   appends marked, never rewrites.

## The tier-1 assessment

Do all of this, then answer aloud:

1. Why can a twin pass every point probe and still be unfaithful?
   (Answer: dynamics — the behavioral class judges the *envelope*, not
   the instants.)
2. Why is `indeterminate` honest and `pass`-by-default not?
3. Why must the analogue dial be a rendering of *ground truth* and
   never a served value?

Tier 1 done. [Tier 2 (planned)](README.md): author a product reference
package and get its twin certified.
