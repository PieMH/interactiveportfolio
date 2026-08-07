import { projects, skills, contactLinks, type MediaItem, type Project } from './shared/data/projects';
import { applyI18n, LOCALES, locale, onLocaleChange, setLocale, t, ta, type Locale } from './shared/i18n';
import { configureSfx, play, setSfx, sfxEnabled } from './shared/sound';
import { closeModal, openModal } from './shared/modal';
import { trackSections } from './shared/reveal';
import { asset } from './shared/asset';

configureSfx({ wave: 'sine' });
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const SECTIONS = ['sec-hero', 'sec-about', 'sec-projects', 'sec-skills', 'sec-contact'];

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

/* ---------- drifting star strata (ported from CC v2 per merge order, +20% density) ---------- */
function buildStars(): void {
  const host = document.getElementById('stars');
  if (!host) return;
  const LAYERS = [
    { cls: 's1', count: 55 },
    { cls: 's2', count: 41 },
    { cls: 's3', count: 29 }
  ];
  LAYERS.forEach(({ cls, count }, li) => {
    const layer = el('div', `star-layer ${cls}`);
    const shadows: string[] = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() * 100).toFixed(1);
      const y = (Math.random() * 200).toFixed(1);
      const roll = Math.random();
      const hue = roll < 0.7 ? '232, 238, 246' : roll < 0.92 ? '47, 224, 245' : '255, 123, 192';
      shadows.push(`${x}vw ${y}vh 0 ${li}px rgba(${hue}, ${(0.45 + li * 0.2).toFixed(2)})`);
    }
    layer.style.boxShadow = shadows.join(', ');
    host.append(layer);
  });
}

/* ---------- parallax starfield (rAF-throttled, per handoff spec) ---------- */
function initParallax(): void {
  if (reducedMotion) return;
  const layers = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'));
  let ticking = false;
  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        layers.forEach((l) => {
          const f = Number(l.dataset['parallax'] ?? 0);
          l.style.transform = `translate3d(0, ${(-y * f).toFixed(1)}px, 0)`;
        });
        ticking = false;
      });
    },
    { passive: true }
  );
}

/* ---------- nav rail + mobile bottom bar (scroll-spy added per spec note) ---------- */
function buildNav(): void {
  const rail = document.getElementById('rail');
  const bar = document.getElementById('bottombar');
  if (rail) {
    rail.textContent = '';
    ta('cd.nav').forEach((label, i) => {
      const row = el('a', 'rail-row');
      row.href = `#${SECTIONS[i] ?? ''}`;
      row.dataset['target'] = SECTIONS[i] ?? '';
      row.append(el('span', undefined, label), el('span', 'rail-rule'), el('span', 'rail-sq'));
      row.addEventListener('click', () => play('click'));
      rail.append(row);
    });
  }
  if (bar) {
    bar.textContent = '';
    SECTIONS.forEach((id, i) => {
      const b = el('a', 'bb-item', String(i).padStart(2, '0'));
      b.href = `#${id}`;
      b.dataset['target'] = id;
      b.setAttribute('aria-label', t(`nav.${['hero', 'about', 'projects', 'skills', 'contact'][i] ?? 'hero'}`));
      bar.append(b);
    });
  }
}

/* ---------- projects ---------- */
function mediaBg(node: HTMLElement, p: Project): void {
  if (p.card.type === 'image') {
    node.style.backgroundImage = `url('${asset(p.card.src)}')`;
  } else {
    node.classList.add('is-art');
    const img = el('img');
    img.src = `./art/${p.card.slot}.svg`;
    img.alt = '';
    node.append(img);
  }
}

function renderProjects(): void {
  const fHost = document.getElementById('featuredHost');
  const gHost = document.getElementById('gridHost');
  if (!fHost || !gHost) return;
  fHost.textContent = '';
  gHost.textContent = '';

  const featured = projects.find((p) => p.featured);
  if (featured) {
    const card = el('button', 'featured');
    card.type = 'button';
    card.setAttribute('aria-haspopup', 'dialog');
    const media = el('div', 'featured-media');
    mediaBg(media, featured);
    media.append(el('span', 'featured-badge', t('cd.featured')));
    const body = el('div', 'featured-body');
    const tags = el('div', 'tagrow');
    featured.tech.slice(0, 6).forEach((tg) => tags.append(el('span', 'tag tag-lg', tg)));
    body.append(
      el('h3', 'featured-title', t(`projects.${featured.id}.title`)),
      el('p', 'featured-blurb', t(`projects.${featured.id}.blurb`)),
      tags,
      el('span', 'open-link', t('cd.openProject'))
    );
    card.append(media, body);
    card.addEventListener('click', () => openProject(featured));
    card.addEventListener('mouseenter', () => play('hover'));
    fHost.append(card);
  }

  projects.filter((p) => !p.featured).forEach((p) => {
    const card = el('button', 'pcard');
    card.type = 'button';
    card.setAttribute('aria-haspopup', 'dialog');
    const media = el('div', 'pcard-media');
    mediaBg(media, p);
    const body = el('div', 'pcard-body');
    const tags = el('div', 'tagrow');
    p.tech.slice(0, 4).forEach((tg) => tags.append(el('span', 'tag', tg)));
    body.append(
      el('h3', 'pcard-title', t(`projects.${p.id}.title`)),
      el('p', 'pcard-blurb', t(`projects.${p.id}.blurb`)),
      tags
    );
    card.append(media, body);
    card.addEventListener('click', () => openProject(p));
    card.addEventListener('mouseenter', () => play('hover'));
    gHost.append(card);
  });
}

/* ---------- modal: media stage + scrollable thumb strip ---------- */
let slide = 0;
let activeMedia: MediaItem[] = [];
let activeTitles: string[] = [];

function artSrc(slot: string): string {
  return asset(`/art/${slot}.svg`);
}

/* First-frame capture for local MP4 thumbnails (same-origin, cached). */
const frameCache = new Map<string, string>();

function captureFrame(src: string): Promise<string> {
  const cached = frameCache.get(src);
  if (cached) return Promise.resolve(cached);
  return new Promise((resolve, reject) => {
    const v = document.createElement('video');
    v.muted = true;
    v.preload = 'metadata';
    v.src = src;
    const fail = (): void => reject(new Error(`frame capture failed: ${src}`));
    v.addEventListener('error', fail, { once: true });
    v.addEventListener(
      'loadeddata',
      () => {
        v.currentTime = Math.min(0.1, v.duration || 0.1);
      },
      { once: true }
    );
    v.addEventListener(
      'seeked',
      () => {
        try {
          const c = document.createElement('canvas');
          c.width = 168;
          c.height = 94;
          const ctx = c.getContext('2d');
          if (!ctx) return fail();
          ctx.drawImage(v, 0, 0, c.width, c.height);
          const url = c.toDataURL('image/jpeg', 0.72);
          frameCache.set(src, url);
          resolve(url);
        } catch {
          fail();
        }
      },
      { once: true }
    );
  });
}

function mountStage(): void {
  const stage = document.getElementById('stage');
  if (!stage) return;
  stage.textContent = '';
  const item = activeMedia[slide];
  if (!item) return;
  const title = activeTitles[slide] ?? '';
  let node: HTMLElement;
  if (item.type === 'youtube') {
    node = el('iframe');
    (node as HTMLIFrameElement).src = `https://www.youtube-nocookie.com/embed/${item.id}`;
    node.setAttribute('allowfullscreen', '');
    node.setAttribute('title', title);
  } else if (item.type === 'video') {
    node = el('video');
    const v = node as HTMLVideoElement;
    v.controls = true;
    v.preload = 'metadata';
    v.src = asset(item.src);
  } else {
    node = el('img');
    const img = node as HTMLImageElement;
    img.src = item.type === 'image' ? asset(item.src) : artSrc(item.slot);
    img.alt = title;
  }
  const prev = el('button', 'stage-btn stage-prev', '‹');
  prev.type = 'button';
  prev.setAttribute('aria-label', t('ui.prev'));
  prev.addEventListener('click', () => goTo(slide - 1));
  const next = el('button', 'stage-btn stage-next', '›');
  next.type = 'button';
  next.setAttribute('aria-label', t('ui.next'));
  next.addEventListener('click', () => goTo(slide + 1));
  stage.append(
    node,
    el('span', 'stage-caption', title),
    prev,
    next,
    el('span', 'stage-counter', `${slide + 1} / ${activeMedia.length}`)
  );
  document.querySelectorAll<HTMLElement>('.thumb').forEach((th, i) => {
    th.classList.toggle('is-active', i === slide);
    if (i === slide) th.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
  });
}

function goTo(i: number): void {
  const n = activeMedia.length;
  slide = ((i % n) + n) % n;
  mountStage();
  play('click');
}

function openProject(p: Project): void {
  const modal = document.getElementById('modal');
  const title = document.getElementById('modalTitle');
  const blurb = document.getElementById('modalBlurb');
  const desc = document.getElementById('modalDesc');
  const tags = document.getElementById('modalTags');
  const thumbs = document.getElementById('thumbs');
  if (!modal || !title || !blurb || !desc || !tags || !thumbs) return;

  activeMedia = p.media;
  activeTitles = ta(`projects.${p.id}.media`);
  slide = 0;
  title.textContent = t(`projects.${p.id}.title`);
  blurb.textContent = t(`projects.${p.id}.blurb`);
  desc.textContent = t(`projects.${p.id}.desc`);
  tags.textContent = '';
  p.tech.forEach((tg) => tags.append(el('span', 'tag', tg)));

  thumbs.textContent = '';
  p.media.forEach((item, i) => {
    const th = el('button', 'thumb');
    th.type = 'button';
    th.title = activeTitles[i] ?? '';
    th.setAttribute('aria-label', activeTitles[i] ?? `${i + 1}`);
    if (item.type === 'image') {
      th.style.backgroundImage = `url('${asset(item.src)}')`;
    } else if (item.type === 'art') {
      th.style.backgroundImage = `url('${artSrc(item.slot)}')`;
      th.style.backgroundSize = 'contain';
      th.style.backgroundRepeat = 'no-repeat';
      th.style.backgroundPosition = 'center';
    } else if (item.type === 'youtube') {
      th.style.backgroundImage = `url('https://i.ytimg.com/vi/${item.id}/mqdefault.jpg')`;
    } else {
      th.textContent = 'MP4';
      void captureFrame(asset(item.src))
        .then((url) => {
          th.style.backgroundImage = `url('${url}')`;
          th.textContent = '';
        })
        .catch(() => {
          /* keep the MP4 label as fallback */
        });
    }
    th.addEventListener('click', () => goTo(i));
    thumbs.append(th);
  });

  mountStage();
  openModal(modal);
  play('click');
}

document.addEventListener('keydown', (e) => {
  const modal = document.getElementById('modal');
  if (modal && !modal.hidden) {
    if (e.key === 'ArrowLeft') goTo(slide - 1);
    if (e.key === 'ArrowRight') goTo(slide + 1);
  }
});

/* ---------- skills: staggered reveal, only first fill glows (spec) ---------- */
function renderSkills(): void {
  const host = document.getElementById('skillsHost');
  const section = document.getElementById('sec-skills');
  if (!host || !section) return;
  host.textContent = '';
  const fills: Array<{ fill: HTMLElement; level: number }> = [];
  skills.forEach((s, i) => {
    const row = el('div', 'stat');
    const head = el('div', 'stat-head');
    head.append(
      el('span', 'stat-name', t(`skills.${s.key}`)),
      el('span', 'stat-value', String(s.level))
    );
    const track = el('div', 'stat-track');
    const fill = el('span', `stat-fill${i === 0 ? ' glow' : ''}`);
    track.append(fill);
    row.append(head, track);
    host.append(row);
    fills.push({ fill, level: s.level });
  });
  let revealed = false;
  const reveal = (): void => {
    if (revealed) return;
    revealed = true;
    fills.forEach(({ fill, level }, i) => {
      window.setTimeout(() => {
        fill.style.transform = `scaleX(${level / 100})`;
      }, i * 60);
    });
  };
  // one observer on the static section element (attached at parse time) —
  // observing rows while detached proved unreliable in embedded viewports
  const io = new IntersectionObserver(
    (es) => {
      if (es.some((e) => e.isIntersecting)) {
        io.disconnect();
        reveal();
      }
    },
    { threshold: 0.15 }
  );
  io.observe(section);
  // geometric safety net: deep links / restored scroll positions land mid-section
  const r = section.getBoundingClientRect();
  if (r.top < window.innerHeight && r.bottom > 0) reveal();
}

/* ---------- boss battle: one hit per channel, sessionStorage persistence ---------- */
const HITS_KEY = 'cd-hits';

function getHits(): Set<string> {
  try {
    return new Set(JSON.parse(sessionStorage.getItem(HITS_KEY) ?? '[]') as string[]);
  } catch {
    return new Set();
  }
}

function saveHits(hits: Set<string>): void {
  sessionStorage.setItem(HITS_KEY, JSON.stringify([...hits]));
}

function syncBoss(): void {
  const hits = getHits();
  const hp = Math.max(0, 100 - hits.size * 20);
  const fill = document.getElementById('hpFill');
  const read = document.getElementById('hpRead');
  const status = document.getElementById('bossStatus');
  const victory = document.getElementById('victory');
  if (fill) fill.style.transform = `scaleX(${hp / 100})`;
  if (read) {
    read.textContent = `${hp}/100`;
    read.classList.toggle('win', hp === 0);
  }
  if (status) {
    status.textContent = t(hp === 0 ? 'cd.boss.defeated' : 'cd.boss.status');
    status.classList.toggle('win', hp === 0);
  }
  if (victory) victory.hidden = hp > 0;
  document.querySelectorAll<HTMLElement>('.channel').forEach((ch) => {
    const hit = hits.has(ch.dataset['key'] ?? '');
    ch.classList.toggle('is-hit', hit);
    const state = ch.querySelector('.ch-state');
    if (state) state.textContent = t(hit ? 'cd.boss.hit' : 'cd.boss.ready');
  });
}

function renderChannels(): void {
  const host = document.getElementById('channelsHost');
  if (!host) return;
  host.textContent = '';
  contactLinks.forEach((c) => {
    const a = el('a', 'channel');
    a.href = c.href;
    if (c.external) {
      a.target = '_blank';
      a.rel = 'noopener';
    }
    a.dataset['key'] = c.key;
    a.append(
      el('span', 'ch-label', t(`contact.buttons.${c.key}`).toUpperCase()),
      el('span', 'ch-state', t('cd.boss.ready'))
    );
    a.addEventListener('click', () => {
      const hits = getHits();
      if (!hits.has(c.key)) {
        hits.add(c.key);
        saveHits(hits);
        syncBoss();
        // per-channel reaction line (client merge order) — defeated line wins at 0 HP
        if (hits.size < contactLinks.length) {
          const status = document.getElementById('bossStatus');
          if (status) status.textContent = t(`cd.boss.phrase.${c.key}`);
        }
        play(hits.size >= contactLinks.length ? 'win' : 'hit');
      }
    });
    host.append(a);
  });
  syncBoss();
}

/* ---------- HUD ---------- */
function syncSound(): void {
  const btn = document.getElementById('soundBtn');
  const label = document.getElementById('sndLabel');
  if (btn) {
    btn.setAttribute('aria-pressed', String(sfxEnabled()));
  }
  if (label) label.textContent = sfxEnabled() ? 'SOUND ON' : 'SOUND OFF';
}

function buildLang(): void {
  const group = document.getElementById('langGroup');
  if (!group) return;
  group.textContent = '';
  LOCALES.forEach((l: Locale) => {
    const seg = el('button', `lang-seg${l === locale() ? ' is-active' : ''}`, l.toUpperCase());
    seg.type = 'button';
    seg.setAttribute('aria-label', `${t('ui.language')}: ${l.toUpperCase()}`);
    seg.addEventListener('click', () => {
      if (l !== locale()) setLocale(l);
    });
    group.append(seg);
  });
}

function renderAll(): void {
  applyI18n();
  buildNav();
  renderProjects();
  renderSkills();
  renderChannels();
  buildLang();
  syncSound();
}

document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.lang = locale();
  // stars + frost cost real rasterization — enable after the first paint
  requestAnimationFrame(() => requestAnimationFrame(() => {
    buildStars();
    document.documentElement.classList.add('fx-ready');
  }));
  renderAll();
  initParallax();
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  document.getElementById('soundBtn')?.addEventListener('click', () => {
    setSfx(!sfxEnabled());
    syncSound();
    play('click');
  });
  onLocaleChange(() => {
    closeModal();
    renderAll();
  });

  trackSections(SECTIONS, (active) => {
    document.querySelectorAll<HTMLElement>('.rail-row, .bb-item').forEach((d) => {
      d.classList.toggle('is-active', d.dataset['target'] === active);
    });
  });
});
