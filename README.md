# interactiveportfolio

Pietro Dondi's interactive portfolio — a gamified single-page site (Level 0 START → Level 4 BOSS BATTLE) built with **Vite + TypeScript**, no framework. Localized in EN · IT · ES at runtime. Live at [piemh.github.io/interactiveportfolio](https://piemh.github.io/interactiveportfolio/).

## Develop

```bash
npm install
npm run dev        # dev server
npm run build      # production build → dist/
npm run preview    # serve the build
npm run typecheck
```

## Deploy

Pushes to `main` build and deploy via GitHub Actions (`.github/workflows/deploy.yml`) to GitHub Pages. The build uses `base: './'`, so it also works unchanged under a custom domain or VPS root.

## Layout

- `src/` — app code (`main.ts`, `style.css`, `shared/` modules, `locales/` EN·IT·ES)
- `public/` — static assets served as-is (`Assets/` project media, `images/`, `art/` SVGs, favicon)
- `OldVersion/`, `OldVersion2025/` — previous site generations, archived
- `variants/` — local-only design workspace from the 2026 renovation (git-ignored)

Design: "AFTERGLOW CD v2" — art direction prototyped in Claude Design, implemented and content-merged with Claude Code (2026 renovation).
