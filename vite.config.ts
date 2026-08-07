import { defineConfig } from 'vite';

// base './' makes the build path-relative: works on GitHub Pages under
// /interactiveportfolio/ today and at a custom-domain root later, unchanged.
export default defineConfig({
  base: './',
  build: {
    // 'assets' would case-collide with the public media dir 'Assets/' on
    // Windows and break on case-sensitive hosts (GitHub Pages) — keep distinct
    assetsDir: 'bundle'
  }
});
