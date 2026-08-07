// WebAudio SFX. Default OFF (client requirement R5): nothing may play until
// the user enables the toggle. One shared AudioContext, created lazily on the
// first *enabled* play call — never at page load.

export type Fx = 'click' | 'hover' | 'levelup' | 'easter' | 'hit' | 'win';

const STORAGE_KEY = 'portfolio-sfx';
let enabled = localStorage.getItem(STORAGE_KEY) === 'on';
let wave: OscillatorType = 'sine';
let ctx: AudioContext | null = null;

const RECIPES: Record<Fx, { freq: number; gain: number; dur: number }> = {
  click:   { freq: 800,  gain: 0.08, dur: 0.1 },
  hover:   { freq: 600,  gain: 0.04, dur: 0.05 },
  levelup: { freq: 1000, gain: 0.08, dur: 0.3 },
  easter:  { freq: 1200, gain: 0.08, dur: 0.2 },
  hit:     { freq: 220,  gain: 0.09, dur: 0.15 },
  win:     { freq: 880,  gain: 0.08, dur: 0.45 }
};

export function configureSfx(opts: { wave?: OscillatorType }): void {
  if (opts.wave) wave = opts.wave;
}

export function sfxEnabled(): boolean {
  return enabled;
}

export function setSfx(on: boolean): void {
  enabled = on;
  localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off');
  if (!on && ctx) {
    void ctx.suspend();
  }
}

export function play(fx: Fx): void {
  if (!enabled) return;
  ctx ??= new AudioContext();
  if (ctx.state === 'suspended') void ctx.resume();
  const { freq, gain, dur } = RECIPES[fx];
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = wave;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(gain, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
  osc.connect(g).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + dur + 0.05);
  if (fx === 'win') {
    // tiny victory arpeggio: two follow-up notes
    [1108, 1318].forEach((f, i) => {
      const o2 = ctx!.createOscillator();
      const g2 = ctx!.createGain();
      o2.type = wave;
      o2.frequency.value = f;
      const t0 = ctx!.currentTime + 0.12 * (i + 1);
      g2.gain.setValueAtTime(gain, t0);
      g2.gain.exponentialRampToValueAtTime(0.001, t0 + 0.3);
      o2.connect(g2).connect(ctx!.destination);
      o2.start(t0);
      o2.stop(t0 + 0.35);
    });
  }
}
