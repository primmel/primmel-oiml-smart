# The program config seam — OIML SMART as instance #1

> *In this chapter:* everything program-flavored the shell says lives
> in ONE manifest the framework reads at boot — OIML SMART is the
> first instance of a generic app framework, and a second program is a
> second manifest, never a fork. Status: ● shipped
> (TODO.integration/10).

---

## 1. Why a seam

The platform ships more than one SMART program (OIML SMART today;
accreditation, MSS-certification and lab programs are on the roadmap).
If the framework's shell — layouts, header, footer, splash, landing,
login — says program things in scattered literals, every new program
is a fork. The seam makes it a config.

## 2. The three buckets (MECE)

| Bucket | Home | Examples |
|---|---|---|
| **Program literals** | `browser/src/program/manifest.ts` | product name, hero copy, footer line, splash quotes, demo role accounts, library label, the certification-system sub-brand |
| **Program data** | `primmel-packages/` + `data/` (SSOT) | the rec registry, requirements, forms, seed narratives |
| **Program documentation** | the docs federation (this site) | about pages, guides, architecture |

A literal naming none of these is platform-generic and stays in the
framework.

## 3. The seam

One typed read: `programManifest()` (default the OIML instance; a
test-only swap proves a second instance renders). Consumers were
migrated copy-identically — the three layouts' title defaults, the
header context label, the footer powered-by line, the splash quotes,
the landing hero, the login demo accounts, and — at generation time —
the route generator (the regenerated page shells are byte-identical,
proven by an empty git diff).

The hard guarantee: `browser/src/program` is a **forbidden root** for
the platform machinery (the boundary gate) — the twin/gateway/monitor
engines import no program copy, ever.

## 4. The dummy second instance

`browser/src/program/demo-instance.ts` is a complete second manifest
("Acme QMS SMART"). The seam test swaps it in and the real shell
component renders ITS copy — proving the shell reads the seam, never
a hardcoded program.

## 5. Where the depth lives

The gated spec:
[The program config](https://github.com/oimlsmart/smart/blob/v2/docs/architecture/17-the-program-config.md)
— the manifest schema and the consumer table.

*Back to [the Platform volume](README.md); on to
[Confium](../confium/README.md) — the threshold-cryptography PKI the
CNML format rides on.*
