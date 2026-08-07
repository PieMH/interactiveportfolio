// Scroll reveals: adds .is-revealed once per [data-reveal] element.
// CSS owns the transition; prefers-reduced-motion is handled in CSS.

export function initReveals(): void {
  const els = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-revealed'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  els.forEach((el) => io.observe(el));
}

/** Section tracker for navs / progress meters. */
export function trackSections(
  ids: string[],
  onChange: (activeId: string) => void
): void {
  const sections = ids
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLElement => el !== null);
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) onChange(entry.target.id);
      });
    },
    { rootMargin: '-45% 0px -45% 0px' }
  );
  sections.forEach((s) => io.observe(s));
}
