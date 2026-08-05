# The composite twin, the weakest declared link

> *In this chapter:* a SYSTEM of twins (the CGM-200 gas analytical
> system: analyzer + sample line) binds, runs and certifies as one ,
> and its certificate always prints its component basis. Status:
> ● shipped (TODO.v3/03 + TODO.integration/06–07).

---

## 1. What a composite is

Some instruments are systems: a gas analytical system is an analyzer
plus a sample-handling line; a weighing system is several cells under
one indicator. The **composite twin** models the system as a subject in
its own right, with a **composition declaration**
(`payload/composition.yaml` in the composite's package) naming:

- the **components**, each a product twin (pinned product + edition,
  its endpoint, its serial, its twin-certificate reference, `null`
  means *uncertified*, which the calculus never hides);
- the **decomposition**, which component's projection supplies each
  composite register, and the composite's own state rule.

## 2. The composition calculus

The composite's certificate strength is the **weakest declared link**:

```text
all components certified (ACTIVE)   → full
any uncertified (no cert on record) → partial   (a DECLARED gap)
any suspended                       → suspended
any withdrawn                       → withdrawn
```

Every state below full prints its basis, which component, which
status, on the report, the certificate and the DPP. **A declared gap
is a scope limitation; a hidden gap is fraud.** Component replacement
bumps the component-set revision and retains the previous set
(evidence accrues, never rewrites).

## 3. The runtime (not just the calculus)

- **The composite binding**, one integration per component endpoint,
  the bindings renamed through the decomposition (the component's
  operation feeds the COMPOSITE register). Validated by the REAL
  gateway validator against the deployment twin, never a second
  validator.
- **The composite's own state**, computed by the declared rule (a
  closed vocabulary; today `any_fault_else_analyzer`: fault when ANY
  component faults, else the analyzer's operational state).
- **The verdict chain's composition leg**, the calculus runs per
  cycle against the REAL certificate register; below full, every
  verdict of the cycle carries the DECLARED scope limitation with the
  weakest components named, the OUTCOME never rewritten.
- **The certification run**, the guided run captures per-component
  registers (a component endpoint down degrades ITS registers honestly,
  never faults the composite); the compiled report carries the
  composition block (strength + basis + revision), and the twin
  certificate record carries the component-set revision.

## 4. The honesty that makes it certification-grade

- Model-driven: the decomposition is DATA; the runtime interprets it
  generically, a new composite is a new package, never runtime code.
- The basis lines come from the calculus, never re-rendered by hand
  (the report asserts them against an independent recomputation).
- The live proof: the composite runs against a live gas-sim (bind →
  zero-calibration command → per-component capture → the DECLARED
  partial basis) in the `composite-basis` integration contract.

## 5. Where the depth lives

The composition calculus lives in `browser/src/twin-cert/composition.ts`
(the ladder + the printed basis), the runtime in
`browser/src/twin-cert/composite-runtime.ts`, both gated by the
`twin-composition`, `twin-composite-runtime`, `twin-composite-run` and
`composite-basis` suites.

*Next: [The CNML bridge](06-the-cnml-bridge.md), an issued
certificate becomes a signed CNML document.*
