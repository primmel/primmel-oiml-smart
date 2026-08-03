# Primmel SST — the simulated-SMART-twin framework

> *In this section:* Primmel SST, the platform's simulated-twin
> framework — simulated instruments, servers and clients of a SMART
> twin endpoint, so a program's twin machinery can be built, tested
> and demonstrated with no hardware. This page is the orientation; the
> sources live in the framework repositories.

---

## 1. What the SST is

A SMART twin is a served instance: a model with state, queryable over
a declared endpoint and judged continuously by the same rules that
evaluate the paper form. Primmel SST simulates that endpoint — the
instrument behavior, the server, and the clients that talk to it — so
the twin lab, the monitor runtime and the certification chain run end
to end on a laptop. The framework is kind-agnostic: an instrument
library declares its kinds and the runtime serves them.

## 2. Where the pieces live

- [primmel/sst](https://github.com/primmel/sst) — the framework: the
  kind-agnostic runtime, the shell, the bench, the specs.
- [oimlsmart/sst-instruments](https://github.com/oimlsmart/sst-instruments)
  — the OIML instrument library for the SST: kinds, instances, the
  composite (the ACME LC-500 pilot family).

## 3. Where it runs

The platform's twin machinery rides the SST: see [Simulated
Instruments](../platform/02-simulated-instruments.md) and [The Twin
Lab](../platform/03-the-twin-lab.md) in the Platform volume. The
end-to-end run — certify a simulated load cell yourself — is the OIML
SMART demo manual, on the program's site:
<https://www.oimlsmart.org/docs/oiml-rec/13-running-the-demo>.
