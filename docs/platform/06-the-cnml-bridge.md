# The CNML bridge — sign + verify in the app

> *In this chapter:* an issued OIML certificate becomes a signed CNML
> document — and anyone verifies it — without leaving the app.
> Status: ● leg 1 shipped (TODO.integration/09; the CA chain + the
> transparency proofs are later legs).

---

## 1. What CNML is to the program

CNML (Certificat Numérique de Métrologie Légale) is the OIML SMART
program's machine-readable certificate format: an XML document per
Recommendation, signed with XMLDSig (ECDSA P-256) and verifiable
through a fixed check pipeline. It is implemented by the sibling
**digital-certificates** repo and consumed as a dependency — never
copied (the bridge resolves the `@cnml/*` packages to their TypeScript
sources; when they change, the bridge re-resolves).

## 2. The flow

```text
our Certificate ─ project (the per-rec field map) → CNML cert JSON
                ─ validate against the per-rec schema FIRST
                  (a rejection lists every violation, signs nothing)
                ─ serialize (@cnml/cnml-xml) → CNML XML
                ─ sign (@cnml/cnml-crypto, the browser-held key)
                → signed CNML XML (XMLDSig enveloped, X.509 in KeyInfo)
                ─ verify (@cnml/cnml-crypto's check pipeline)
                → per-check verdict with reasons
```

The check pipeline, in order: **xml-well-formed → schema-valid →
signature → scope → crl → timestamp → transparency**. `skip` is a
first-class status (proofs absent ⇒ honest skip); `warn` is a
documented honest state (a self-signed leg-1 cert carries no scope
extension — the check's own legacy doctrine).

## 3. The signing custody

The signing key is an ECDSA P-256 WebCrypto pair, generated and held
**in the browser** (IndexedDB, the private key passphrase-wrapped —
the CNML pattern: the signer is a person at a browser, not a server).
The signature ALWAYS carries an X.509 certificate in KeyInfo — the
embedded chain is what any verifier resolves without a trust store;
when no chain is supplied, the bridge self-issues from the signing
pair. The signed document + the signing record persist on the
certificate's `json_data.cnml` (evidence accrues, never rewrites — a
re-sign appends to `cnml_history`).

## 4. The operator surface

The certificate detail page carries the CNML panel: *Sign as CNML*
(the issuance gate's final step — the certificate must be ACTIVE) and
the verification panel (every check with its reason, a download of the
`.cnml.xml`). A verify failure is never silent: the schema rejection
lists every violation; a tamper or a swapped embedded certificate
fails the signature check with its reason (both proven by test).

## 5. What leg 1 deliberately is NOT

- Not the CA: the PKI CA server issues real X.509 chains (leg 2); leg
  1 signs with browser-held self-signed keys (the scope/CRL checks
  then honestly skip/warn).
- Not transparency onboarding: the OTS/tlog proofs embed when the
  infrastructure answers; the checks skip honestly until then.

## 6. Where the depth lives

The gated spec:
[The CNML bridge](https://github.com/oimlsmart/smart/blob/v2/docs/architecture/16-the-cnml-bridge.md)
— the field map table, the failure-semantics card catalogue, and the
upstream fixes the bridge surfaced (the core schemas' registration,
the parse-shape normalization, the trusted-key path).

*Next: [The program config seam](07-the-program-config.md) — OIML
SMART as instance #1 of the app framework.*
