import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import tailwindcss from '@tailwindcss/vite';
import remarkStatusBadges from './src/plugins/remark-status-badges.mjs';

// Canonical deployment URL: GitHub Pages project page for the
// `primmel/primmel-smart-docs` remote (no custom domain configured).
// Sitemap generation requires an absolute URL; `base` matches the path.
export default defineConfig({
  site: 'https://primmel.github.io/primmel-smart-docs/',
  base: '/primmel-smart-docs/',
  markdown: {
    remarkPlugins: [remarkMath, remarkStatusBadges],
    rehypePlugins: [rehypeKatex],
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    starlight({
      title: 'Primmel + OIML SMART',
      // Custom CSS: KaTeX for math + the editorial rebrand
      customCss: [
        'katex/dist/katex.min.css',
        './src/styles/brand.css',
      ],
      // Custom components: section-aware SiteTitle + branded PageFrame with site-wide footer
      components: {
        SiteTitle: './src/components/SiteTitle.astro',
        PageFrame: './src/components/PageFrame.astro',
      },
      // Built-in pagefind search; dark-first theme with light toggle (Starlight defaults).
      sidebar: [
        { label: 'Home', link: '/' },
        {
          label: 'Volume 0 — Foundation',
          items: [
            { label: 'Volume overview', slug: 'foundation' },
            { label: 'Intuition', slug: 'foundation/01-intuition' },
            { label: 'Claims and Falsifiability', slug: 'foundation/02-claims-and-falsifiability' },
            { label: 'Eight Terms and Closure Rules', slug: 'foundation/03-eight-terms-and-closure-rules' },
            { label: 'Proofs', slug: 'foundation/04-proofs' },
            { label: 'Kernel/Surface Architecture', slug: 'foundation/05-kernel-surface-architecture' },
            { label: 'Algorithms', slug: 'foundation/06-algorithms' },
            { label: 'Derived Vocabulary Proofs', slug: 'foundation/07-derived-vocabulary-proofs' },
            { label: 'Comparative Analysis', slug: 'foundation/08-comparative-analysis' },
            { label: 'Categorical Foundations', slug: 'foundation/09-categorical-foundations' },
            { label: 'Executable Ground', slug: 'foundation/10-executable-ground' },
            { label: 'Open Questions', slug: 'foundation/11-open-questions' },
            { label: 'FAQ', slug: 'foundation/faq' },
            { label: 'Notation Reference', slug: 'foundation/notation' },
          ],
        },
        {
          label: 'Volume I — Primmel Kernel',
          items: [
            { label: 'Volume overview', slug: 'primmel' },
            { label: 'Philosophy and Tiers', slug: 'primmel/01-philosophy-and-tiers' },
            { label: 'Subjects', slug: 'primmel/02-subjects' },
            { label: 'Instantiation', slug: 'primmel/03-instantiation' },
            { label: 'Processes', slug: 'primmel/04-processes' },
            { label: 'Mappings', slug: 'primmel/05-mappings' },
            { label: 'Data and values', slug: 'primmel/06-data-and-values' },
            { label: 'Expressions', slug: 'primmel/07-expressions' },
            { label: 'Packages', slug: 'primmel/08-packages' },
            { label: 'Provenance and Documents', slug: 'primmel/09-provenance' },
            { label: 'Multilinguality', slug: 'primmel/10-multilingual' },
            { label: 'Validation', slug: 'primmel/11-validation' },
            { label: 'Interop', slug: 'primmel/12-interop' },
            { label: 'Model Diff and Lifecycle', slug: 'primmel/13-diff-and-lifecycle' },
            { label: 'Live Twins', slug: 'primmel/14-live-twins' },
            { label: 'The Model Supply Chain', slug: 'primmel/15-model-supply-chain' },
            { label: 'Views and Lenses', slug: 'primmel/16-views-and-lenses' },
            { label: 'Twin Certification', slug: 'primmel/17-twin-certification' },
          ],
        },
        {
          label: 'The Platform — runtime + twins',
          items: [
            { label: 'Volume overview', slug: 'platform' },
            { label: 'Simulated Instruments (SST)', slug: 'platform/02-simulated-instruments' },
            { label: 'The Twin Lab', slug: 'platform/03-the-twin-lab' },
            { label: 'Multi-standard Projection', slug: 'platform/04-multi-standard-projection' },
            { label: 'The Composite Twin', slug: 'platform/05-the-composite-twin' },
            { label: 'The CNML Bridge', slug: 'platform/06-the-cnml-bridge' },
            { label: 'The Program Config Seam', slug: 'platform/07-the-program-config' },
            { label: 'Primmel Studio', slug: 'platform/08-primmel-studio' },
          ],
        },
        {
          label: 'Primmel SST — simulated twins',
          items: [
            { label: 'The framework + the repos', slug: 'sst' },
          ],
        },
        {
          label: 'Confium — threshold-crypto PKI',
          items: [
            { label: 'The three modes + Mode 3', slug: 'confium' },
          ],
        },
        {
          label: 'Learn — the layered curriculum',
          items: [
            { label: 'The curriculum', slug: 'learn' },
            { label: 'Tier 0 — the concept', slug: 'learn/00-the-concept' },
            { label: 'Tier 1 — the hands-on', slug: 'learn/01-the-hands-on' },
            { label: 'Tier 2 — the duality', slug: 'learn/02-the-duality' },
            { label: 'Tier 3 — the chain', slug: 'learn/03-the-chain' },
            { label: 'Tier 4 — authoring', slug: 'learn/04-authoring' },
            { label: 'Tier 5 — the dual demo', slug: 'learn/05-the-dual-demo' },
          ],
        },
        {
          label: 'OIML SMART — the program (moved)',
          items: [
            { label: 'OIML Core → oimlsmart.org', slug: 'oiml-core' },
            { label: 'Authoring Recommendations → oimlsmart.org', slug: 'oiml-rec' },
            { label: 'The OIML-CS Scheme → oimlsmart.org', slug: 'oiml-cs' },
            { label: 'CNML Certificates → oimlsmart.org', slug: 'cnml' },
            { label: 'For NMIs → oimlsmart.org', slug: 'nmi' },
          ],
        },
        {
          label: 'Annexes',
          items: [
            { label: 'Use Cases', slug: 'shared/use-cases' },
            { label: 'Glossary', slug: 'shared/glossary' },
            { label: 'Alternatives Audit', slug: 'shared/alternatives-audit' },
            { label: 'Roadmap', slug: 'shared/roadmap' },
            { label: 'Releases', slug: 'shared/releases' },
            { label: 'Keeping Docs Current', slug: 'shared/keeping-current' },
          ],
        },
      ],
    }),
    sitemap(),
  ],
});
