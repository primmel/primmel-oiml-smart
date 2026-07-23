# Primmel + OIML SMART

<div class="hero reveal reveal-1">
  <div class="hero__eyebrow">The complete documentation</div>
  <h1 class="hero__title">
    Standards are <em>programs</em>,<br/>not PDFs.
  </h1>
  <p class="hero__lede">
    A formal foundation for executable modelling, in two voices: <strong>Primmel</strong>,
    the language kernel; and <strong>OIML SMART</strong>, the legal-metrology
    system built on top. From a one-primitive categorical kernel to a complete
    certification pipeline — read at the level that fits.
  </p>
  <div class="hero__actions">
    <a class="hero__cta hero__cta--primary" href="/foundation/01-intuition/">
      Start with the foundation →
    </a>
    <a class="hero__cta hero__cta--secondary" href="/primmel/">
      Browse the language
    </a>
  </div>
</div>

## Two brands, one design system

<div class="dual-brand">
  <a class="brand-card reveal reveal-2" data-brand="primmel" href="/foundation/">
    <img class="brand-card__logo brand-card__logo--light" src="/primmel-logo-light.svg" alt="" aria-hidden="true"/>
    <img class="brand-card__logo brand-card__logo--dark" src="/primmel-logo-dark.svg" alt="" aria-hidden="true"/>
    <div class="brand-card__eyebrow">The language</div>
    <h3 class="brand-card__title">Primmel</h3>
    <p class="brand-card__lede">
      An executable modelling language for SMART standards. Built on the
      IS–HAS–DOES algebra: eight terms, three closure rules, a one-sort
      kernel that is a category.
    </p>
    <ul class="brand-card__chapters">
      <li>Volume 0 — the formal foundation</li>
      <li>Volume I — the language kernel</li>
    </ul>
    <span class="brand-card__cta">Read the foundation →</span>
  </a>

  <a class="brand-card reveal reveal-3" data-brand="oiml" href="/oiml-core/">
    <img class="brand-card__logo brand-card__logo--light" src="/oiml-logo-light.svg" alt="" aria-hidden="true"/>
    <img class="brand-card__logo brand-card__logo--dark" src="/oiml-logo-dark.svg" alt="" aria-hidden="true"/>
    <div class="brand-card__eyebrow">The system</div>
    <h3 class="brand-card__title">OIML SMART</h3>
    <p class="brand-card__lede">
      The International Organization of Legal Metrology's metamodel for
      measuring instruments: subjects, requirements, conformance tests,
      verdicts, certificates — encoded in Primmel.
    </p>
    <ul class="brand-card__chapters">
      <li>Volume II — the OIML metamodel</li>
      <li>Volume III — authoring Recommendations</li>
    </ul>
    <span class="brand-card__cta">Read the metamodel →</span>
  </a>
</div>

---

## The volume map

The documentation is written as five courses in dependency order. Each
volume is designed to carry a semester's worth of teaching.

| # | Volume | Contents |
|---|---|---|
| 0 | [**Foundation**](/foundation/) | the IS–HAS–DOES modelling system — eight terms, three closure rules, three theorems (closure, completeness, extensibility) |
| I | [**Primmel Kernel**](/primmel/) | the language: tier system, subject anatomy (IS/HAS/DOES), processes, mappings, data and values, packages |
| II | [**OIML Core**](/oiml-core/) | the OIML metamodel: measurement vocabulary, the subject chain, the six modules, the shared modules |
| III | [**Authoring Recommendations**](/oiml-rec/) | the methodology: from Recommendation text to a validated package |
| IV | [**The OIML-CS Scheme**](/oiml-cs/) | the certification system: the B 18 constitution, the CASCO foundation, the documents corpus, the runtimes, the coverage machinery |
| — | [Annexes](/shared/glossary/) | platform runtime · glossary · alternatives audit · roadmap |

## How to read this documentation

### Reading tracks

- **Track 0 — formal foundations.** Read [`foundation/`](/foundation/) first.
  It proves the IS/HAS/DOES trichotomy is exhaustive, not heuristic. Skip
  it only if you already accept the trichotomy on faith.
- **Track A — language designer / tool implementer.** `foundation/`, then
  `primmel/` cover to cover, then `platform/`.
- **Track B — metamodel maintainer (OIML core).** `foundation/`, then
  `primmel/` chapters 1–7, then `oiml-core/` cover to cover.
- **Track C — Recommendation author.** `foundation/` (skim §10–12), then
  `primmel/` chapters 1–5, `oiml-core/` chapters 1–5, then `oiml-rec/`
  cover to cover.
- **Track D — scheme operator / certification body / assessor.**
  `primmel/` chapters 4–5, `oiml-core/` chapter 8, then `oiml-cs/` cover
  to cover.

### Prerequisites chain

Volume 0 assumes nothing but literacy about formal systems. Volume I
assumes Volume 0 (chapter 2 of Volume I operationalizes the formal
system). Volume II assumes Volumes 0–I. Volume III assumes Volumes 0–II.
Volume IV assumes Volumes I–II. The Annexes are reference material,
readable out of order.

### Conventions

- **Status markers** — ● exists in the running system · ◐ partial ·
  ○ planned in v3. Chapters describe the v3 target; markers keep the
  gap honest.
- **Syntax blocks** tagged `prl` are Primmel v3 syntax. Where v3
  grammar is still being finalized, the block is marked
  *(illustrative)* — the *concepts* are normative, the exact keywords
  may shift.
- **Diagrams** are hand-authored SVG in each volume's `diagrams/`
  directory, referenced relatively. Palette: slate structure, brand
  (indigo) subjects, green IS aspects, amber HAS aspects, red DOES
  aspects, violet relations. Volume 0 (foundation) extends this palette
  with a "formal/math" set — teal (`#0d9488`) for kernel/Tier-0
  constructs, gray (`#475569`) for surface/Tier-1 constructs, dashed
  lines for elaboration/desugaring arrows, double-stroke for
  reification — see [`foundation/README.md`](/foundation/#conventions)
  for details.
- **References** to the running system use repo paths (`data/r60/…`,
  `ontology-remix/…`, `browser/…`) relative to the `oimlsmart/smart`
  repository.

### The concept foundation

The design dialogue this documentation realizes is consolidated in
`docs/primmel-concepts.md` of the `oimlsmart/smart` repo (the
"concepts document"). Where prose here and there disagree, this tree
is the developed form; the concepts document is the negotiation record.
