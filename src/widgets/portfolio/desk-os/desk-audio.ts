/**
 * Desk OS audio — 고요한 앰비언트 + 타이핑 / 모니터 클릭
 */

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let muted = false;
let bgm: HTMLAudioElement | null = null;
let typingTimer: number | null = null;
let typingWanted = false;

const MASTER_VOLUME = 0.42;
const BGM_VOLUME = 0.28;
const BGM_SRC = '/desk-os/audio/void-ambient.mp3';

const getCtx = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  if (!audioCtx) {
    const Ctx =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new Ctx();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = muted ? 0 : MASTER_VOLUME;
    masterGain.connect(audioCtx.destination);
  }
  return audioCtx;
};

const ensureRunning = async () => {
  const ctx = getCtx();
  if (!ctx) {
    return null;
  }
  if (ctx.state === 'suspended') {
    try {
      await ctx.resume();
    } catch {
      return null;
    }
  }
  return ctx;
};

const applyMute = () => {
  if (masterGain) {
    masterGain.gain.value = muted ? 0 : MASTER_VOLUME;
  }
  if (bgm) {
    bgm.volume = muted ? 0 : BGM_VOLUME;
  }
};

export const setDeskAudioMuted = (next: boolean) => {
  muted = next;
  applyMute();
  if (next) {
    stopTypingLoop();
    return;
  }
  if (typingWanted) {
    startTypingLoop();
  }
};

const startBgm = async () => {
  if (bgm) {
    return;
  }
  const el = new Audio(BGM_SRC);
  el.loop = true;
  el.volume = muted ? 0 : BGM_VOLUME;
  bgm = el;
  try {
    await el.play();
  } catch {
    bgm = null;
  }
};

const stopBgm = () => {
  if (!bgm) {
    return;
  }
  bgm.pause();
  bgm.src = '';
  bgm = null;
};

const playKeyClick = () => {
  const ctx = audioCtx;
  if (!ctx || !masterGain || muted) {
    return;
  }
  const now = ctx.currentTime;
  const dur = 0.028 + Math.random() * 0.018;
  const noiseLen = Math.floor(ctx.sampleRate * dur);
  const buffer = ctx.createBuffer(1, noiseLen, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < noiseLen; i += 1) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / noiseLen);
  }
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  const band = ctx.createBiquadFilter();
  band.type = 'bandpass';
  band.frequency.value = 2100 + Math.random() * 1600;
  band.Q.value = 3.4;
  const high = ctx.createBiquadFilter();
  high.type = 'highpass';
  high.frequency.value = 900;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(0.22 + Math.random() * 0.08, now + 0.004);
  g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
  src.connect(high);
  high.connect(band);
  band.connect(g);
  g.connect(masterGain);
  src.start(now);
  src.stop(now + dur + 0.01);
};

const stopTypingLoop = () => {
  if (typingTimer !== null) {
    window.clearTimeout(typingTimer);
    typingTimer = null;
  }
};

const startTypingLoop = () => {
  if (typingTimer !== null || muted) {
    return;
  }
  if (!getCtx()) {
    return;
  }
  const tick = () => {
    playKeyClick();
    if (Math.random() > 0.82) {
      window.setTimeout(playKeyClick, 28 + Math.random() * 36);
    }
    typingTimer = window.setTimeout(tick, 70 + Math.random() * 150);
  };
  tick();
};

export const setDeskTypingEnabled = (next: boolean) => {
  typingWanted = next;
  if (!next) {
    stopTypingLoop();
    return;
  }
  startTypingLoop();
};

export const playDeskMouseClick = () => {
  const ctx = audioCtx;
  if (!ctx || !masterGain || muted) {
    return;
  }
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  osc.type = 'square';
  osc.frequency.setValueAtTime(1900, now);
  osc.frequency.exponentialRampToValueAtTime(420, now + 0.05);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(0.16, now + 0.004);
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);
  osc.connect(g);
  g.connect(masterGain);
  osc.start(now);
  osc.stop(now + 0.08);
};

export const startDeskAudio = async () => {
  const ctx = await ensureRunning();
  if (!ctx) {
    return;
  }
  await startBgm();
  if (typingWanted) {
    startTypingLoop();
  }
};

export const stopDeskAudio = () => {
  stopTypingLoop();
  typingWanted = false;
  stopBgm();
};
