// Accessible modal: focus trap, Esc, backdrop click, scroll lock.

let lastFocus: HTMLElement | null = null;
let activeModal: HTMLElement | null = null;
let keyHandler: ((e: KeyboardEvent) => void) | null = null;

const FOCUSABLE =
  'a[href], button:not([disabled]), iframe, video, [tabindex]:not([tabindex="-1"])';

export function openModal(modal: HTMLElement, onClose?: () => void): void {
  lastFocus = document.activeElement as HTMLElement | null;
  activeModal = modal;
  modal.hidden = false;
  document.body.style.overflow = 'hidden';

  const close = (): void => closeModal(onClose);

  modal.querySelector<HTMLElement>('[data-modal-close]')?.addEventListener('click', close, { once: true });
  modal.addEventListener(
    'click',
    (e) => {
      if (e.target === modal) close();
    },
    { once: true }
  );

  keyHandler = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') close();
    if (e.key === 'Tab' && activeModal) {
      const items = Array.from(activeModal.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null
      );
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };
  document.addEventListener('keydown', keyHandler);
  modal.querySelector<HTMLElement>('[data-modal-close]')?.focus();
}

export function closeModal(onClose?: () => void): void {
  if (!activeModal) return;
  activeModal.querySelectorAll('video').forEach((v) => {
    v.pause();
    v.currentTime = 0;
  });
  // unmount youtube iframes so audio stops
  activeModal.querySelectorAll('iframe').forEach((f) => f.remove());
  activeModal.hidden = true;
  document.body.style.overflow = '';
  if (keyHandler) document.removeEventListener('keydown', keyHandler);
  keyHandler = null;
  activeModal = null;
  lastFocus?.focus();
  onClose?.();
}
