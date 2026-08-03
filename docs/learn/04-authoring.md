# Tier 4 — authoring (a day)

The final tier: you stop reading models and **write** one — a small
standard as a Primmel package, with the linker and the coverage gates
as your feedback loop. The pattern is the OIML classroom's
(`smart-r60`, the reference instance that teaches R 60 exactly this
way): author in Primmel, regenerate, let the gates grade you.

**Learning outcomes.** At the end you can:

- structure a package (manifest, quantity register, subject anatomy,
  requirements) from nothing;
- read the linter's findings as a teacher (every rule names what it
  wants, with the doctrine's section);
- use the coverage gates (congruence, the text-coverage budget) as
  the authoring feedback loop;
- say when a model is done: the gates green, the coverage honest.

## The shape of a package

```prl
package {
  id my-standard
  kind rec
  version "2027"
  editions { 2027 }
  baseUrn "urn:example:my-standard:2027"
  uses { }
  requires { }
  status preview
  default_spelling eng-Latn
  description "My toy standard — the tier-4 artifact."
}

quantity_register si {
  kind mass { dimensions { M 1 } si_unit kg }
  unit kg { symbol "kg" kind mass factor 1 }
  kind dimensionless { si_unit "1" }
  unit dimensionless { label "dimensionless" kind dimensionless }
}

attribute_definition e_min { quantity_kind mass unit kg scope model }
attribute_definition d_min { quantity_kind mass unit kg origin measured scope sample }

subject MyInstrument {
  is {
    metadata { name "My instrument (fictional)" }
    design_parameters { e_min : mass }
  }
  has {
    attributes { d_min : mass test_dependent }
  }
}

requirement /req/metrological/measuring-range-min {
  name "Minimum load of the measuring range"
  statement "The smallest load applied during test shall not be less than E_min."
  binds_to { sample.test_context.d_min model.parameters.e_min }
  limit {
    expression "ocl{sample.test_context.d_min >= model.parameters.e_min}"
    uses { sample.test_context.d_min model.parameters.e_min }
  }
  acceptance_criteria {
    type: "threshold"
    description: "Minimum test load shall be at least E_min"
  }
  verification { method examination description "Verified in the type evaluation program." }
}
```

Every piece you met on the earlier tiers, authored now: the register
(quantities, never bare numbers — INV-1), the subject (IS/HAS/DOES),
the requirement (a constraint with a limit and a verification path).

## Hands-on — author and be graded (a day)

1. Create `primmel-packages/my-standard/` with the two files above
   (`package.primmel`, `model.prl`).
2. Grade it with the kernel:

   ```bash
   cd ../primmel/primmel-ts/packages/primmel
   npx tsx scripts/check.mts <path-to>/my-standard
   ```

   Zero errors, zero warnings is the bar. Read every finding as a
   teacher: the check id names the rule; the message names what it
   wants.
3. Break it on purpose, once: delete the `attribute_definition d_min`
   line and re-run. Two errors teach you the resolution discipline
   (`binds_to` and `limit.uses` resolve against *definitions*, not
   exhibited attributes). Restore it.
4. **The classroom pattern.** Look at the reference instance
   (`~/src/oimlsmart/smart-r60/`): the classroom syncs the data trees
   on load and runs its unit specs against them — your package is
   teachable the moment the gates pass.

**Make it (the checkable artifact).** Your package, lint-clean, plus
one sentence per finding you fixed — that is the author's log every
real package in this program carries (each shipped package's history
is exactly such a log).

## When is a model done?

- `primmel check` is silent at default AND `--strict --audit`.
- Every reference resolves; every requirement has a verification path
  (the C5 honesty: no undeclared coverage gap).
- The text you *didn't* model is a named gap with a reason — the
  coverage budget only burns down (C72), never quietly grows.
- The package regenerates byte-clean through the SSOT loop
  (`npm run test:ssot` on the program side).

Depth: [the authoring volume](https://www.oimlsmart.org/docs/oiml-rec/01-methodology)
on the OIML SMART site, and the
the classroom's own pattern (the `smart-classroom-r60` repo — private during the pilot).

*You have finished the curriculum: concept → hands-on → duality →
chain → authoring. The volumes beside this section go deeper on every
tier.*
