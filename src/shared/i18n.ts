import en from '../locales/en.json';
import it from '../locales/it.json';
import es from '../locales/es.json';

export type Locale = 'en' | 'it' | 'es';
export const LOCALES: Locale[] = ['en', 'it', 'es'];

const dicts: Record<Locale, unknown> = { en, it, es };
const STORAGE_KEY = 'portfolio-locale';

function isLocale(v: string | null): v is Locale {
  return v === 'en' || v === 'it' || v === 'es';
}

let current: Locale = (() => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return isLocale(saved) ? saved : 'en';
})();

const listeners = new Set<() => void>();

function resolve(dict: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((node, key) => {
    if (node && typeof node === 'object' && key in (node as Record<string, unknown>)) {
      return (node as Record<string, unknown>)[key];
    }
    return undefined;
  }, dict);
}

export function locale(): Locale {
  return current;
}

export function setLocale(l: Locale): void {
  current = l;
  localStorage.setItem(STORAGE_KEY, l);
  document.documentElement.lang = l;
  listeners.forEach((fn) => fn());
}

export function onLocaleChange(fn: () => void): void {
  listeners.add(fn);
}

/** String lookup with English fallback; returns the path itself as last resort. */
export function t(path: string): string {
  const hit = resolve(dicts[current], path) ?? resolve(dicts.en, path);
  return typeof hit === 'string' ? hit : path;
}

/** t() + {placeholder} substitution. */
export function tf(path: string, vars: Record<string, string | number>): string {
  return Object.entries(vars).reduce(
    (s, [k, v]) => s.replaceAll(`{${k}}`, String(v)),
    t(path)
  );
}

/** Array lookup (media titles, nav labels). */
export function ta(path: string): string[] {
  const hit = resolve(dicts[current], path) ?? resolve(dicts.en, path);
  return Array.isArray(hit) ? hit.map(String) : [];
}

/**
 * Fills every [data-i18n] element's textContent and every
 * [data-i18n-attr="attr:path,attr2:path2"] attribute set.
 */
export function applyI18n(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    const key = el.dataset['i18n'];
    if (key) el.textContent = t(key);
  });
  root.querySelectorAll<HTMLElement>('[data-i18n-attr]').forEach((el) => {
    const spec = el.dataset['i18nAttr'];
    if (!spec) return;
    spec.split(',').forEach((pair) => {
      const [attr, key] = pair.split(':');
      if (attr && key) el.setAttribute(attr.trim(), t(key.trim()));
    });
  });
  document.title = t('meta.title');
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute('content', t('meta.description'));
}
