# Chapter 10 — Multilinguality

> *In this chapter:* why Primmel tags human-readable content with ISO
> 24229 spelling codes rather than BCP 47 language tags, what a spelling
> code is made of, how content sets carry multilingual strings, and how
> rendering selects among them.

---

## 10.1 The problem: a language tag is not a writing system

Standards are multilingual artifacts. OIML publishes in English and
French; members translate; manufacturers romanize names; certificates
travel across scripts. The industry's default answer — a BCP 47 tag like
`zh-Hans` or `sr-Latn` — classifies the string: *this is Chinese,
simplified script*. It cannot say the thing a standards pipeline
actually needs: **which system produced this written form, and which
rules reproduce it.** "Romanized" is not a system; Wade-Giles and Pinyin
both are, and they disagree.

Primmel adopts **ISO 24229** instead. BCP 47 is explicitly a non-goal
(chapter 1's rejected patterns); the concepts document states it
flatly: all human-readable strings are *spelling-coded per ISO 24229*,
and BCP 47 is *not* used.

## 10.2 ISO 24229 in five minutes

Three standards answer three orthogonal questions:

| Standard | Question | Examples |
|---|---|---|
| ISO 639 | what **language**? | `eng`, `fra`, `zho`, `ara` |
| ISO 15924 | what **script**? | `Latn`, `Cyrl`, `Hani`, `Arab` |
| ISO 24229 | which **conversion system**? | `UN:ara-Arab:Latn:2017`, `ISO:Cyrl:Latn:9-1995` |

A **spelling system** is the combination of the first two — a language
in a script: `ara-Arab`, `bel-Cyrl`, `fra-Latn`. It may carry an
optional country code (`uzb-Arab-AF` — Uzbek in Arabic script as used in
Afghanistan) and an optional extension (`ind-Latn-pre1972` — the
pre-1972 orthography). The script element is **mandatory**: a bare
`ara` is not a spelling system, because Arabic is written in more than
one script.

A **conversion system code** names a registered system that converts one
spelling into another, in four colon-separated segments:

```
BGN-PCGN : zho-Hans : Latn : 1979
 titular     source    target  identifying
(authority) (spelling) (spelling) (version/year)
```

The titular segment names the managing authority (`UN`, `ICAO`,
`ALA-LC`, `DIN`, `ISO`; `Var` when none is identifiable; a `zz-` prefix
for user-assigned codes). The register is authoritative, maintained
under ISO 19135 procedures: entries have a lifecycle (proposed, stable,
deprecated, withdrawn), and an assigned code is reserved forever — never
reused. Codes are case-insensitive (`iso:cyrl:latn:9-1995` ≡
`ISO:Cyrl:Latn:9-1995`), and default scripts may be omitted in
registered abbreviations (`UN:ara:Latn:2017` for `UN:ara-Arab:Latn:2017`).

The property Primmel buys: a code is **resolvable to concrete rules**.
`ISO:Cyrl:Latn:9-1995` does not describe the output — it names the
system whose published rules produce the output, for any Cyrillic text,
auditably.

## 10.3 Spelling codes on every human-readable string

The rule of the chapter: **every human-readable string in a model is
spelling-coded.** That means names, definitions, statements, notes, and
certificate text — everything a human reads — never OCL, never
identifiers, never `snake_case` attribute ids (those are machine keys,
chapter 11's naming discipline, and stay single-spelling by design).

A model carries **one logical string** with **per-spelling values** —
a *content set*. The R 60 requirement from chapters 1 and 9, as a
content set:

- `eng-Latn` — "The value of the largest load applied to a load cell
  during test which is expressed in units of mass shall not be greater
  than E_max."
- `fra-Latn` — the official OIML French text.

Two values, one string. The statement is one model element; the
spellings are facets of it, not copies of it. This is the same
definition/instance discipline as everywhere else in the kernel: edit
the element once, and every spelling of it moves together; add a
spelling and no consumer of the others is disturbed (OCP).

A conversion system code enters when a spelling was *derived* rather
than authored: a manufacturer's name in `zho-Hans` and its Latin
rendering carry the rendering's system code
(`BGN-PCGN:zho-Hans:Latn:1979`), so the Latin form is citable to the
rules that produced it — exactly the passport-catalogue problem ISO
24229 exists to solve.

## 10.4 Alignment with the vocabulary registers

This extends a practice the terminology layer already runs. The
glossarist registers (`viml-2022`, `vim-2012` in the sibling
`../vocab/datasets/` repo) store each concept as per-language
**localized concepts** keyed by language code (`language_code: eng` /
`fra`), one writing system per entry (●). That keying *is* a spelling
discipline in embryo — the registers just never needed to name the
script, because every entry happens to be Latin-script.

The v3 step generalizes the register key from a bare ISO 639 language
code to a full ISO 24229 spelling code (○), and — the actual content of
this chapter — extends the practice **from names to all prose**. Terms
were the thin edge: a definition, a note, a certificate sentence get
exactly the same treatment as a designation.

## 10.5 Rendering: selection by code

Rendering never prints a language; it selects **by spelling code**:

1. an exact match on the requested code wins;
2. otherwise the renderer may fall back along a declared chain — a
   registered conversion of an available spelling (the model can *say*
   "render this `zho-Hans` string via `BGN-PCGN:zho-Hans:Latn:1979`" and
   the conversion is citable), then the package's default spelling;
3. selection is **per string, never per document** — a certificate may
   print the instrument designation in `zho-Hans`, its romanization in
   `Latn` with the conversion code cited, and the legal text in
   `eng-Latn`, from one content set.

Per-string selection is what makes multilingual rendering auditable:
every printed string can be traced to (element, spelling code[, system
code]) — the same provenance reflex as chapter 9, one axis over.

## 10.6 Grammar sketch *(illustrative v3 syntax)*

```prl
text /req/metrological/measuring-range-max.statement {
  spell eng-Latn "The value of the largest load applied to a load cell
                  during test … shall not be greater than E_max."
  spell fra-Latn "La valeur de la plus grande charge appliquée à une
                  cellule de pesée … ne doit pas excéder E_max."
}

text manufacturer-name {
  spell zho-Hans "…"
  spell zho-Hani:Latn via BGN-PCGN:zho-Hans:Latn:1979 "…"   # converted, system cited
}

package oiml-r60 {
  default_spelling eng-Latn            # fallback of every content set
  spellings { eng-Latn, fra-Latn }     # declared set; the linter counts coverage
}
```

## 10.7 Validation rules

- every spelling code parses: ISO 639-3 alpha-3 (terminological)
  language code + ISO 15924 script (**mandatory**) + optional
  ISO 3166-1 country + optional extension — a bare language code is an
  error;
- every `via` system code resolves to a register entry (or is `zz-`
  user-assigned, which validates with a warning — user-assigned codes
  are not portable);
- every content set carries the package's `default_spelling`; declared
  spellings missing from a set are reported as coverage gaps;
- one value per code per set — two `eng-Latn` values for one string is
  a duplicate, not a variant (use an extension code to distinguish);
- machine content is never spelling-coded: identifiers, bind paths, OCL,
  and `snake_case` keys are single-form by construction.

## 10.8 Summary

- Language tags classify; ISO 24229 codes resolve to concrete writing
  and conversion rules. Primmel uses the latter, never BCP 47.
- A spelling system = ISO 639 language + ISO 15924 script (+ country,
  + extension); script is mandatory. A conversion system code =
  titular : source spelling : target spelling : identifying segment.
- Every human-readable string is a content set — one logical string,
  per-spelling values, conversion codes cited where a spelling was
  derived.
- The vocabulary registers already key localized concepts per language
  (●); v3 generalizes the key and extends the practice from names to
  all prose (○).
- Rendering selects by code, per string, with a declared fallback chain
  ending at the package default.

*Next: [Chapter 11 — Validation](11-validation.md): schemas, the model
linker, `primmel check`, coverage audits, and the authoring pitfalls
catalog.*
