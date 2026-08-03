# Use Cases — What You Can Build With Primmel + OIML SMART

> *This page collects practical recipes for applying Primmel to real
> problems. Each use case links to the chapters that provide the
> depth.*

---

## For standards authors

### Write an executable OIML Recommendation

Model the subject (the measuring instrument), define requirements as
constraints on its aspects, specify the conformance tests as
processes, and the evaluation as verdicts — all in a single package
that a computer can validate, query, execute, and reason about.

**Start with:** [Authoring
Recommendations](https://www.oimlsmart.org/docs/oiml-rec/) (on the OIML
SMART site)

### Migrate a text-based standard to executable form

Take an existing Recommendation (R 60, R 91, R 144, etc.) and
re-express it as a Primmel package with clause provenance anchoring
every element back to the source document.

**Start with:** [Walkthrough: R 91 and R
144](https://www.oimlsmart.org/docs/oiml-rec/09-walkthrough-r91-r144)
(on the OIML SMART site)

---

## For instrument manufacturers

### Model your product for certification

Create a product reference model for your instrument, map it to the
Recommendation's reference model, and demonstrate compliance coverage
through the mapping calculus — without building a separate compliance
spreadsheet.

**Start with:** [Volume I chapter 15 — The Model Supply Chain](../primmel/15-model-supply-chain.md)

### Operate a live compliance twin

Deploy a served instance of your instrument model that feeds live
measurements, triggers re-evaluation when conditions change, and
maintains continuous compliance — the certificate becomes a live
contract, not a snapshot.

**Start with:** [Volume I chapter 14 — Live Twins](../primmel/14-live-twins.md)

---

## For certification bodies

### Run the OIML-CS certification scheme

Model the entire B 18 certification workflow — application, dispatch,
testing, evaluation, decision, certificate issuance, register entry —
as a Primmel process with typed evidence and machine-checked verdicts.

**Start with:** [The OIML-CS Scheme](https://www.oimlsmart.org/docs/oiml-cs/) (on the OIML SMART site)

### Validate a test report for admissibility

Check that evidence meets preconditions before it enters judgment —
void runs that violate preconditions are `invalid`, never `fail`.

**Start with:** [OIML Core chapter 6 — Test
Execution](https://www.oimlsmart.org/docs/oiml-core/06-test-execution)
(on the OIML SMART site)

---

## For tool builders

### Build a Primmel compiler

The language kernel is small: eight primitives, three closure rules,
three theorems. Implement the five algorithms (elaboration,
resugaring, reification, evaluation, state-location) and you have a
conforming runtime.

**Start with:** [Volume 0 chapter 6 — Algorithms](../foundation/06-algorithms.md)

### Build a modelling tool on top of the IS–HAS–DOES algebra

The eight-term algebra is generic — it applies to any modelling task,
not just legal metrology. Build domain-specific tools (healthcare
devices, automotive, aerospace) by populating the sorts with domain
content.

**Start with:** [Volume 0 chapter 3 — Eight Terms and Closure Rules](../foundation/03-eight-terms-and-closure-rules.md)

---

## For educators

### Teach executable standards modelling

The volume structure is designed as a semester-long course with three
reading tracks (novice, professional, expert). Use the foundation
volume as a standalone introduction to formal modelling, then layer
Primmel and OIML SMART as applications.

**Start with:** [Volume 0 — Foundation](../foundation/README.md) (novice track: chapters 1–2)

### Use the comparative analysis as a teaching tool

The foundation volume's comparative analysis (Chapter 8) shows how
OOP, UML, BPMN, EXPRESS, RDF/OWL, Petri nets, OPM, and SysML v2/KerML
each relate to the IS–HAS–DOES algebra. This is a useful reference
for any modelling course.

**Start with:** [Volume 0 chapter 8 — Comparative Analysis](../foundation/08-comparative-analysis.md)

---

## For researchers

### Extend the IS–HAS–DOES algebra

The foundation's extensibility theorem (Theorem 3) says new domains
enter by enlarging the sorts — not by adding primitives. If you have
a domain that doesn't fit, that's the attack surface the axiom
predicts.

**Start with:** [Volume 0 chapter 11 — Open Questions](../foundation/11-open-questions.md)

### Use Primmel as a formal specification language

The kernel is a category; the surface vocabulary desugars to it. If
your research needs executable formal specifications with reified
process instances and provenance tracking, Primmel provides both the
theory and a reference implementation.

**Start with:** [Volume 0 chapter 9 — Categorical Foundations](../foundation/09-categorical-foundations.md)
