# The Twin Lab, the generic twin workbench

> *In this chapter:* how the operator binds a live twin endpoint to a
> Recommendation, watches compliance compute, and walks a guided test
> run, for any Recommendation that declares a twin interface, never a
> per-instrument page. Status: ● shipped (`/app/twin-lab`).

---

## 1. One page, every Recommendation

The Twin Lab is the platform's **generic** twin workbench. Its
contract: pick a Recommendation, point at a live twin endpoint (a
Primmel SMART Twin, a real instrument or a simulated one), and the
page derives everything else from the Recommendation's OWN declared
twin interface (`model/twin.yaml`, generated from the package's
`twin.prl`, the single source of truth). Nothing about a specific
instrument is hard-coded: a new Recommendation ships a `twin.prl` and
the page works.

Today four Recommendations declare the interface, R 60 (load cells),
R 91 (speed meters), R 129 (dimensioners), R 144 (gas analytical
systems), and all four bind through the same page (the
`twin-lab-families` integration contract proves it continuously).

## 2. The three legs

```text
Connect       the page introspects the endpoint (GraphQL
              introspection — never assumed) ∩ the Recommendation's
              declared interface → a proposed BINDING (serves with
              freshness windows, integrations, the command face),
              validated by the REAL gateway validator
Compliance    one cycle: the bound registers feed the SAME verdict
              engine the workflow uses (INV-9 — never a second
              dialect); requirements reading at least one bound
              register judge, honestly
Guided run    the conformance test's declared steps become a script:
              environment legs click-when-done, measurement rows
              attest the PHYSICAL display while the twin's serve
              auto-records (with the pair skew, judged against the
              serve's fresh_within) → the run compiles into the
              Recommendation's own evidence form → the verdict chain
```

The honesty rules that make it certification-grade:

- **Introspection is the contract.** An operation the endpoint does
  not answer is reported *missing*, never assumed; a serve the
  endpoint cannot bind is *unbound with its reason*, never silently
  dropped (the R 144 family's NO/NO₂ registers report exactly this
  when a product doesn't measure them).
- **The wire field names follow the generated schema's camelCase
  rule**, the SST schema camelizes every field; the lab's documents
  match (multi-word registers like `indication_length` →
  `indicationLength`).
- **The attested physical reading is the evidence of record**; the
  twin's served reading is auto-captured with its serve timestamp ,
  the same pairing discipline as the twin-fidelity probe.
- **A twin that does not answer degrades honestly**, the record
  carries the error, never an invented value.

## 3. The command face

The model's DOES → mutations: an operation of kind `invoke` (R 91's
`run_self_test`, R 144's `zero_calibration`/`span_calibration`) is a
first-class command on the page, issued through the binding,
recorded with the instrument's resulting state, and compiled into the
run's command log as evidence.

## 4. The practice drive (G18)

The world channel's scenario buttons (drive the SST's physics:
temperature, load, time) run a *practice* session, segregated by the
`practice-` id marker, never certification evidence. The banner says
so, always; the report compiler marks the same boolean, never the
channel (only the world-drive module knows the channel).

## 5. Where the depth lives

The architecture site carries the gated detail: `docs/architecture/12-the-sst-interaction-contract.md`
(two endpoints, four verbs, no iframe) and `docs/architecture/14-the-twin-stream.md`
(the real-time channel the watch arm binds when the endpoint streams) in the
`oimlsmart/smart` repository (member access today; the public mirror
lands with the website wave).

*Next: [Multi-standard projection](04-multi-standard-projection.md) ,
one implementation model, several auditor lenses, no merged claims.*
