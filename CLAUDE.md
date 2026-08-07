# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

Pietro Dondi's personal portfolio — the **"AFTERGLOW CD v2"** 2026 renovation, live at https://piemh.github.io/interactiveportfolio/. A gamified single-page site (LEVEL 0 START → LEVEL 4 BOSS BATTLE): Vite + strict TypeScript, vanilla DOM (no framework), runtime-localized EN/IT/ES. Art direction was prototyped in Claude Design and implemented by Claude Code against a content contract (AIforBusinesses test case 1 — the intake/design record lives in that repo under `sites/interactiveportfolio/`).

**Iron content rule:** every project link, media file, and fact on the site comes from the content contract. Never drop, shrink, or paraphrase content to fit a design — the design adapts to the content.

## Where everything lives

| Path | What it is |
|---|---|
| `index.html` | The single page, with **default-locale (EN) copy prerendered into the markup** — kills i18n CLS, feeds crawlers, readable without JS. `data-i18n` attributes mark swap points. Head owns font preloads, OG/meta, the `fetchpriority=high` hero `<img>`. |
| `src/main.ts` | All page logic, grouped by section: star strata + shooting stars + parallax (`buildStars`, `initParallax`), nav rail/bottombar with scroll-spy (`buildNav`), projects grid + featured card (`renderProjects`, `mediaBg`), modal stage/thumbs + video first-frame capture (`openProject`, `mountStage`, `captureFrame`), skills stat sheet (`renderSkills`, scaleX fills), boss battle (`syncBoss`, `renderChannels` — per-channel hits in `sessionStorage`, victory only at 0 HP), sound + language controls. |
| `src/style.css` | All styles. Design tokens at the top. Ships the systemic guard `[hidden] { display: none !important; }` and self-hosted `@font-face` with **metric-matched fallbacks** (`size-adjust`/`ascent-override` — do not touch without re-measuring CLS). |
| `src/shared/data/projects.ts` | **The content source of truth**: projects, media lists, skills, contact channels. Editing site content = editing this file (+ locales). Paths here stay clean root-absolute (`/images/...`). |
| `src/shared/asset.ts` | `asset(p)` prefixes `import.meta.env.BASE_URL` — **every runtime-consumed asset path goes through it**. Raw paths break under the GitHub Pages subpath. |
| `src/shared/i18n.ts` | Locale loading, `t()`/`ta()`, `applyI18n` over `data-i18n`, `<html lang>` + meta sync. |
| `src/shared/` (rest) | `sound.ts` (WebAudio SFX, **default off**), `modal.ts` (open/close, focus trap, Esc/backdrop), `reveal.ts` (scroll reveal — observes static sections, not detached nodes). |
| `src/locales/{en,it,es}.json` | Flat key:value translations. **Any new copy = a key in all three files.** IT must read native, ES exists at working level. |
| `src/fonts/`, `src/hero/` | Self-hosted woff2 subsets + the WebP hero (build-hashed via Vite). |
| `public/` | Served verbatim: `Assets/` (project media — **case-exact names**, spaces allowed), `images/`, `art/` (original SVG placeholder art), `og.png`, `robots.txt`, favicon. |
| `OldVersion/`, `OldVersion2025/` | Archived previous site generations. Read-only history — never edit, never reference at runtime. |
| `variants/` | Git-ignored local design workspace from the renovation (3 variants + hub + shared engine). Not part of the build. |

## Build & deploy

```bash
npm run dev        # Vite dev server (port 5173)
npm run typecheck  # tsc --noEmit — must be clean before any showcase
npm run build      # production build → dist/
npm run preview    # serve the built dist/
```

- `vite.config.ts` sets `base: './'` — the build is path-relative so it works at the Pages subpath `/interactiveportfolio/` today AND at a custom-domain/VPS root later, unchanged. Don't hardcode absolute URLs (OG tags are the one deliberate exception).
- `assetsDir: 'bundle'` — **never rename to `assets`**: it would case-collide with `public/Assets/` on Windows and break on case-sensitive hosts.
- Deploy: push to `main` → `.github/workflows/deploy.yml` (checkout → Node 22 → `npm ci` → typecheck → build → upload → `deploy-pages`). Pages is in **workflow-builds mode**; there is no gh-pages branch to maintain. `workflow_dispatch` allows manual redeploys.

## Gotchas (each one shipped a real bug once)

1. **Disk ≠ git.** A file in `public/` that isn't committed passes every local build and 404s in production (`labyrainth-card.webp` incident). `git status` before shipping media.
2. **Case-exact paths.** Pages is case-sensitive, Windows isn't — `Assets/` vs `assets/` bugs hide locally.
3. **`[hidden]` guard stays.** Any author `display` rule silently defeats the `hidden` attribute; assert overlay hidden-state by computed style, not the property.
4. **Fonts and prerendered copy are CLS armor.** `font-display: optional` + metric fallbacks + EN text in the HTML got CLS to 0.01 — changes there need re-measurement.
5. **Honest perf numbers only:** Lighthouse with `--throttling-method=devtools` against a subpath simulation of `dist/` (Lantern-simulated LCP on instant local serving is fiction). Gate: ≥ 90 performance.
6. **GPU-only animation.** Pulses are opacity overlays, fills are `scaleX` — no width/box-shadow transitions. Hover effects gated behind `@media (hover: hover) and (pointer: fine)`; everything respects `prefers-reduced-motion`.

## Working agreement

- Claude works on a **branch**; Pietro reviews and merges to `main` (merge = deploy).
- Before showcasing anything, run the `pre-qa` project skill (`.claude/skills/pre-qa/`) — a hook reminds you when a preview server starts, but the gate applies to any demo.
- Keep the gamification metaphor coherent (levels, boss, HUD) — it's the site's identity, not decoration.
