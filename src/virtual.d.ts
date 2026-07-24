/**
 * Type declarations for Starlight's Vite virtual modules.
 *
 * `virtual:starlight/*` modules exist only inside the Starlight
 * integration's build pipeline, so astro-check cannot resolve them on its
 * own. Component overrides import them to re-use built-in pieces (the
 * custom PageFrame re-uses MobileMenuToggle for the sidebar).
 */
declare module 'virtual:starlight/components/*' {
  import type { AstroComponentFactory } from 'astro/runtime/server/index.js';
  const component: AstroComponentFactory;
  export default component;
}
