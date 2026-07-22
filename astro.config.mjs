import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import sitemap from '@astrojs/sitemap';

// NOTE: `site` is a placeholder for the GitHub Pages deployment URL —
// update it (and add `base: '/<repo>/'` for a project page) when the
// canonical host is known. Sitemap generation requires an absolute URL.
export default defineConfig({
  site: 'https://oimlsmart.github.io/primmel-oiml-smart/',
  integrations: [
    starlight({
      title: 'Primmel v3 + OIML SMART',
      // Built-in pagefind search; dark-first theme with light toggle (Starlight defaults).
      sidebar: [
        { label: 'Overview', link: '/' },
        {
          label: 'Volume 0 — Foundation',
          items: [
            { label: 'The IS–HAS–DOES Modelling System', slug: 'foundation' },
            { label: '01 — Intuition', slug: 'foundation/01-intuition' },
            { label: '02 — Claims and Falsifiability', slug: 'foundation/02-claims-and-falsifiability' },
            { label: '03 — Eight Terms and Closure Rules', slug: 'foundation/03-eight-terms-and-closure-rules' },
            { label: '04 — Proofs', slug: 'foundation/04-proofs' },
            { label: '05 — Kernel/Surface Architecture', slug: 'foundation/05-kernel-surface-architecture' },
            { label: '06 — Algorithms', slug: 'foundation/06-algorithms' },
            { label: '07 — Derived Vocabulary Proofs', slug: 'foundation/07-derived-vocabulary-proofs' },
          ],
        },
        {
          label: 'Volume I — Primmel Kernel',
          items: [
            { label: 'Volume overview', slug: 'primmel' },
            { label: '01 — Philosophy and Tiers', slug: 'primmel/01-philosophy-and-tiers' },
            { label: '02 — Subjects', slug: 'primmel/02-subjects' },
            { label: '03 — Instantiation', slug: 'primmel/03-instantiation' },
            { label: '04 — Processes', slug: 'primmel/04-processes' },
            { label: '05 — Mappings', slug: 'primmel/05-mappings' },
            { label: '06 — Data and values', slug: 'primmel/06-data-and-values' },
            { label: '07 — Expressions', slug: 'primmel/07-expressions' },
            { label: '08 — Packages', slug: 'primmel/08-packages' },
            { label: '09 — Provenance and Documents', slug: 'primmel/09-provenance' },
            { label: '10 — Multilinguality', slug: 'primmel/10-multilingual' },
            { label: '11 — Validation', slug: 'primmel/11-validation' },
            { label: '12 — Interop', slug: 'primmel/12-interop' },
            { label: '13 — Model Diff and Lifecycle', slug: 'primmel/13-diff-and-lifecycle' },
          ],
        },
        {
          label: 'Volume II — OIML Core',
          items: [
            { label: 'Volume overview', slug: 'oiml-core' },
            { label: '01 — Measurement Vocabulary', slug: 'oiml-core/01-measurement-vocabulary' },
            { label: '02 — The Subject Chain', slug: 'oiml-core/02-subject-chain' },
            { label: '03 — Instrument Aspects', slug: 'oiml-core/03-instrument-aspects' },
            { label: '04 — Identity and Provenance', slug: 'oiml-core/04-identity-and-provenance' },
            { label: '05 — Specification', slug: 'oiml-core/05-specification' },
            { label: '06 — Test Execution', slug: 'oiml-core/06-test-execution' },
            { label: '07 — Evaluation', slug: 'oiml-core/07-evaluation' },
            { label: '08 — Parties and Workflow', slug: 'oiml-core/08-parties-and-workflow' },
            { label: '09 — Invariants', slug: 'oiml-core/09-invariants' },
            { label: '10 — Shared Modules', slug: 'oiml-core/10-shared-modules' },
          ],
        },
        {
          label: 'Volume III — Authoring Recommendations',
          items: [
            { label: 'Volume overview', slug: 'oiml-rec' },
            { label: '01 — The Authoring Method', slug: 'oiml-rec/01-methodology' },
            { label: '02 — Modelling the Subject', slug: 'oiml-rec/02-modelling-the-subject' },
            { label: '03 — Requirements', slug: 'oiml-rec/03-requirements' },
            { label: '04 — Conformance Tests', slug: 'oiml-rec/04-conformance-tests' },
            { label: '05 — Forms and Reports', slug: 'oiml-rec/05-forms-and-reports' },
            { label: '06 — Evaluation', slug: 'oiml-rec/06-evaluation' },
            { label: '07 — Packaging', slug: 'oiml-rec/07-packaging' },
            { label: '08 — Walkthrough: OIML R 60', slug: 'oiml-rec/08-walkthrough-r60' },
            { label: '09 — Walkthrough: R 91 and R 144', slug: 'oiml-rec/09-walkthrough-r91-r144' },
          ],
        },
        {
          label: 'Annexes',
          items: [
            { label: 'OIML-CS', slug: 'oiml-cs' },
            { label: 'Platform', slug: 'platform' },
            { label: 'Glossary', slug: 'shared/glossary' },
            { label: 'Alternatives Audit', slug: 'shared/alternatives-audit' },
            { label: 'Roadmap', slug: 'shared/roadmap' },
          ],
        },
      ],
    }),
    sitemap(),
  ],
});
