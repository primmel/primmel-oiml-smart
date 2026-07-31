# CNML — the OIML SMART certificate format

> *In this section:* CNML (Certificat Numérique de Métrologie Légale),
> the program's machine-readable certificate format — the format, the
> apps, and the operator manuals. The sources live in the
> digital-certificates repo; this section is the reading guide.

---

## 1. What CNML is

CNML is the OIML SMART program's name for its certificate format on
the Confium PKI: an XML document per Recommendation (R 60, R 129, … —
22 per-Recommendation JSON Schemas), carrying the certified type, the
per-rec characteristics, the recommendation identity and the test
reports, signed with XMLDSig (ECDSA P-256) and verifiable through a
fixed check pipeline. It is a [Primmel](README.md)-adjacent OIML
initiative: it applies to OIML SMART today, and the pattern applies to
any SMART program.

## 2. The pieces (the digital-certificates repo)

| Piece | What it owns |
|---|---|
| `packages/cnml-xml` | cert JSON → CNML XML and back (browser-native) |
| `packages/cnml-schemas` | the 22 per-Recommendation JSON Schemas + the core model |
| `packages/cnml-crypto` | key custody, sign, verify, the check pipeline |
| `apps/cnml-web` | the standalone CNML web app (create, sign, verify) |
| `oiml-pki-server` | the Mode 3 CA (the Confium flagship — its own specs) |

The format validates every certificate against its per-Recommendation
schema before signing; the check pipeline verifies: **xml-well-formed
→ schema-valid → signature → scope → crl → timestamp → transparency**.

## 3. The operator manuals (the repo's own docs)

- [The verifier's manual](https://github.com/oimlsmart/digital-certificates/blob/main/docs/manual-verifier.md)
  — verifying a CNML document: the checks, their statuses, what to
  trust.
- [The signer's manual](https://github.com/oimlsmart/digital-certificates/blob/main/docs/manual-signer.md)
  — key custody and signing.
- [The issuing authority's manual](https://github.com/oimlsmart/digital-certificates/blob/main/docs/manual-ia.md)
  — issuing under a scheme.
- [The BIML register manual](https://github.com/oimlsmart/digital-certificates/blob/main/docs/manual-biml.md)
  — the public register side.
- [The PKI architecture](https://github.com/oimlsmart/digital-certificates/blob/main/docs/pki-architecture.md)
  — how the CA, the apps and the checks fit.

## 4. CNML inside the OIML SMART app

The app embeds the format through the CNML bridge (sign + verify on
the certificate detail page): see
[the CNML bridge](../platform/06-the-cnml-bridge.md) in the Platform
volume, and the Confium section for the PKI it rides on
([Confium](../confium/README.md)).

*Back to [the site index](../README.md).*
