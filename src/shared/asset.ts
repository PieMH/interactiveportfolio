// Base-path-safe asset URLs. The site deploys under a subpath on GitHub Pages
// (piemh.github.io/interactiveportfolio/) and at the root on a future VPS —
// vite `base: './'` + this helper make runtime media paths work in both.
export const asset = (p: string): string =>
  import.meta.env.BASE_URL + p.replace(/^\//, '');
