---
name: pre-qa
description: Mandatory builder's gate before showcasing ANY build of this site. Run after finishing a build or revision, BEFORE presenting previews, screenshots, or links. Catches the bug classes that static review misses - dead interactions, broken reloads, missing assets.
---

# Pre-QA — the showcase gate

**Iron rule: no build reaches the client's eyes without every check below passing IN THIS SESSION, on the CURRENT code.** A stale pass doesn't count after edits. If any check fails: fix, then restart the checklist from 1.

This is not the full QA gate (impeccable/Lighthouse/guidelines). This is the cheaper, faster gate that catches *embarrassment bugs* before a demo. Run it every time; it takes minutes.

## The checklist

1. **Types/build clean.** `npx tsc --noEmit` (or the project's build) — zero errors.

2. **Double fresh-reload, every page.** Load each page/route, then force-reload it TWICE. Second visits exercise `sessionStorage`/`localStorage` code paths that first visits never hit. *(Regression class: a boot overlay covered the whole site on reload — `display` rule overriding `[hidden]` + listener attached only on the first-visit path.)*

3. **Full click-through with ASSERTED state change.** For every interactive element class (buttons, cards, toggles, nav items, carousel controls, easter eggs), click at least one instance and assert a **visible state change** — a width that grows, a modal that opens, a counter that ticks. "No console error" is NOT a pass; dead handlers fail silently. Use `javascript_tool` to script it and read back computed state. *(Regression class: skill bars dead because fill `<span>`s were inline — width silently ignored; clicks "worked" but nothing visibly moved.)*

3b. **Overlay audit — every popup, modal, drawer, toast, banner, on EVERY page.** Open each overlay, exercise its internal controls (carousel arrows, thumbs, close paths: button/backdrop/Esc), then close it and reload the page. Assert hidden state by **computed style** (`getComputedStyle(el).display === 'none'`), never by the `hidden` property alone — a CSS `display` rule silently defeats the attribute (bug class seen three times). Every stylesheet ships the systemic guard `[hidden] { display: none !important; }`. Also verify overlays at desktop AND mobile widths — a modal can be fine at 375px and blown out at 1440px (grid tracks need `minmax(0, …)`).

4. **Asset audit on the current load.** `performance.getEntriesByType('resource')` filtered for status ≥ 400 must be empty, AND `[...document.images].filter(i => i.complete && i.naturalWidth === 0)` must be empty. Console history lies across navigations — query the current load. *(Regression classes: SVG icons invisible for missing `xmlns`; media 403 from junction resolution.)*

4b. **Disk ≠ git.** `git status --short` must show no untracked or modified runtime assets (`public/`, `src/`). A file on disk passes every local build and 404s in production if it was never committed. *(Regression class: `labyrainth-card.webp` — featured card backdrop 404 live while every local sim passed.)*

5. **Viewport sweep.** 375px (mobile preset, reload after switching), 768px, desktop. Check: no horizontal scroll (`scrollWidth <= clientWidth`), centered elements actually centered, nothing overlapping.

6. **Full option cycles.** Language selector through EVERY locale (EN → IT → ES → back) and sound toggle on→off→on. Verify re-render, not just the button label.

7. **Reduced-motion load.** Emulate `prefers-reduced-motion` once; page must be fully usable (no overlay that only an animation removes).

8. **Report before showcase.** Produce the pass/fail table in the conversation BEFORE presenting the build. A fail means the demo waits.

## Enforcement

A `PreToolUse` hook on `mcp__Claude_Browser__preview_start` (this repo's `.claude/settings.json`) injects this gate as context whenever a preview server is about to serve a build. The hook reminds; this skill defines.
