# Confium, the threshold-cryptography PKI

> *In this section:* Confium, the Ribose threshold-cryptography PKI
> product, as the platform's certificate-cryptography reference, the
> three modes, and why Mode 3 (the sovereign certificate PKI) is the
> one the OIML CNML format rides on.

---

## 1. What Confium is

Confium is the Ribose PKI product built on **threshold cryptography**:
signing keys are split into shares, and a signature is produced by a
threshold of share-holders cooperating, no single point of key
compromise, no HSM vendor lock-in. The public home is
[confium.org](https://www.confium.org) /
[confium.github.io](https://confium.github.io); the specifications
publish at [confium.github.io/specs](https://confium.github.io/specs/).
This section is the platform's reading guide, not a restatement.

## 2. The three modes (the load-bearing structure)

| Mode | What it is | Who it serves |
|---|---|---|
| **Mode 1, Peer TC** | Threshold signing among peers: each party holds a share, the group signs without a CA | small closed groups |
| **Mode 2, PKI drop-in** | The threshold group IS the CA: certificates issued by threshold, no single CA key | organizations replacing a CA |
| **Mode 3, Sovereign PKI** | A Certificate PKI where CA signing happens by threshold, compatible with X.509 consumers | **the OIML SMART program's CNML** |

The spec's own pages:
[the framework overview](https://confium.github.io/docs/architecture/),
[Mode 1, Peer TC](https://confium.github.io/docs/mode1-peer-tc/),
[Mode 2, PKI drop-in](https://confium.github.io/docs/mode2-pki-drop-in/),
[Mode 3, Sovereign PKI](https://confium.github.io/docs/mode3-sovereign-pki/),
and the full specifications at
[confium.github.io/specs](https://confium.github.io/specs/).

## 3. Mode 3 and the CNML format

The OIML SMART program's certificate format (CNML, see the
[CNML section](https://www.oimlsmart.org/docs/cnml/), on the OIML SMART
site) signs with X.509-compatible
certificates. Leg 1 of the CNML bridge signs with browser-held
self-signed keys (a person at a browser, the scope/CRL checks honestly
cautious). The target leg is the **CA-issued chain through a Confium
Mode 3 CA**: the OIML scheme operator's CA key exists only as shares
across the scheme's authorities, certificates issue by threshold
session, and the scope extension (the issuer's authorized
Recommendations) rides the certificate, the check pipeline's
scope/CRL legs then judge for real.

## 4. Where the pieces live

- Public site + specs: [confium.org](https://www.confium.org) ·
  [confium.github.io/specs](https://confium.github.io/specs/).
- The PKI CA server: the `cnml/oiml-pki-server`
  project (the Mode 3 flagship implementation, its own specs,
  untouched by the bridge; the repo is member-access today).
- The bridge's leg-1 custody: [the CNML bridge](../platform/06-the-cnml-bridge.md).

*On to [the CNML section](https://www.oimlsmart.org/docs/cnml/), the OIML SMART
certificate format itself, on the program's own site.*
