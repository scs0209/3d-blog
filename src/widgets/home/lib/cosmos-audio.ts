/**
 * 시네마틱 코스모스용 Web Audio 사운드
 * — 별도 에셋 없이 발소리 / 포털 진입·험 합성
 */

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let muted = false;

let walking = false;
let footstepTimer: number | null = null;
let stepToggle = false;
let pendingFootstepRestart = false;

let portalHumGain: GainNode | null = null;
let portalHumOsc: OscillatorNode[] = [];
let portalActive = false;

const MASTER_VOLUME = 0.55;

const getCtx = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  if (!audioCtx) {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new Ctx();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = muted ? 0 : MASTER_VOLUME;
    masterGain.connect(audioCtx.destination);
  }
  return audioCtx;
};

export const setCosmosAudioMuted = (next: boolean) => {
  muted = next;
  if (masterGain) {
    masterGain.gain.value = next ? 0 : MASTER_VOLUME;
  }
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('cosmos-audio-muted', next ? '1' : '0');
  }
};

export const isCosmosAudioMuted = () => muted;

export const unlockCosmosAudio = async () => {
  const ctx = getCtx();
  if (!ctx) {
    return;
  }
  if (ctx.state === 'suspended') {
    try {
      await ctx.resume();
    } catch {
      return;
    }
  }
  if (pendingFootstepRestart && walking) {
    pendingFootstepRestart = false;
    clearFootstepTimer();
    playFootstep();
    footstepTimer = window.setInterval(() => {
      if (!walking) {
        return;
      }
      playFootstep();
    }, 340);
  }
};

const ensureUnlocked = () => {
  const ctx = getCtx();
  if (!ctx) {
    return false;
  }
  if (ctx.state === 'running') {
    return true;
  }
  void unlockCosmosAudio();
  return false;
};

const playNoiseBurst = ({
  duration,
  gain,
  freqLow,
  freqHigh,
  type = 'bandpass',
}: {
  duration: number;
  gain: number;
  freqLow: number;
  freqHigh: number;
  type?: BiquadFilterType;
}) => {
  const ctx = getCtx();
  if (!ctx || !masterGain || !ensureUnlocked()) {
    return;
  }

  const samples = Math.floor(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, samples, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < samples; i += 1) {
    data[i] = Math.random() * 2 - 1;
  }

  const src = ctx.createBufferSource();
  src.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = type;
  filter.frequency.value = freqLow + Math.random() * (freqHigh - freqLow);
  filter.Q.value = 1.2;

  const g = ctx.createGain();
  const now = ctx.currentTime;
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(gain, now + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  src.connect(filter);
  filter.connect(g);
  g.connect(masterGain);
  src.start(now);
  src.stop(now + duration + 0.02);
};

const playFootstep = () => {
  stepToggle = !stepToggle;
  // 바위/먼지 위를 걷는 짧은 크런치
  playNoiseBurst({
    duration: 0.08 + Math.random() * 0.03,
    gain: stepToggle ? 0.28 : 0.22,
    freqLow: 180,
    freqHigh: 520,
    type: 'bandpass',
  });
  // 낮은 부츠 타격
  playNoiseBurst({
    duration: 0.055,
    gain: 0.14,
    freqLow: 70,
    freqHigh: 140,
    type: 'lowpass',
  });
};

const clearFootstepTimer = () => {
  if (footstepTimer !== null) {
    window.clearInterval(footstepTimer);
    footstepTimer = null;
  }
};

export const setCosmosWalking = (next: boolean) => {
  if (walking === next) {
    return;
  }
  walking = next;
  clearFootstepTimer();

  if (!next) {
    pendingFootstepRestart = false;
    return;
  }

  if (!ensureUnlocked()) {
    pendingFootstepRestart = true;
    return;
  }

  pendingFootstepRestart = false;
  playFootstep();
  footstepTimer = window.setInterval(() => {
    if (!walking) {
      return;
    }
    playFootstep();
  }, 340);
};

export const playPortalEnter = (accentHex = '#3de8ff') => {
  const ctx = getCtx();
  if (!ctx || !masterGain || !ensureUnlocked()) {
    return;
  }

  const color = Number.parseInt(accentHex.replace('#', '').slice(0, 6), 16);
  const hueBoost = Number.isFinite(color) ? (color % 200) / 200 : 0.5;
  const baseFreq = 220 + hueBoost * 180;
  const now = ctx.currentTime;

  // 상승 톤
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(baseFreq, now);
  osc.frequency.exponentialRampToValueAtTime(baseFreq * 2.1, now + 0.45);

  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(0.09, now + 0.06);
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

  osc.connect(g);
  g.connect(masterGain);
  osc.start(now);
  osc.stop(now + 0.56);

  // 쉬머 노이즈
  playNoiseBurst({
    duration: 0.35,
    gain: 0.07,
    freqLow: 800,
    freqHigh: 2400,
    type: 'bandpass',
  });
};

const stopPortalHum = () => {
  const ctx = getCtx();
  if (!ctx || !portalHumGain) {
    portalHumOsc = [];
    portalHumGain = null;
    return;
  }

  const now = ctx.currentTime;
  const gainNode = portalHumGain;
  const oscs = [...portalHumOsc];
  portalHumOsc = [];
  portalHumGain = null;

  try {
    gainNode.gain.cancelScheduledValues(now);
    gainNode.gain.setValueAtTime(Math.max(gainNode.gain.value, 0.0001), now);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
  } catch {
    gainNode.disconnect();
  }

  window.setTimeout(() => {
    for (const osc of oscs) {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        osc.disconnect();
      }
    }
    try {
      gainNode.disconnect();
    } catch {
      // already disconnected
    }
  }, 450);
};

const startPortalHum = (accentHex = '#3de8ff') => {
  const ctx = getCtx();
  if (!ctx || !masterGain) {
    return;
  }

  stopPortalHum();

  const color = Number.parseInt(accentHex.replace('#', '').slice(0, 6), 16);
  const hueBoost = Number.isFinite(color) ? (color % 200) / 200 : 0.5;
  const base = 55 + hueBoost * 40;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 420;
  filter.Q.value = 0.7;

  const gain = ctx.createGain();
  gain.gain.value = 0.0001;

  filter.connect(gain);
  gain.connect(masterGain);

  const freqs = [base, base * 1.5, base * 2.02];
  const oscs = freqs.map((freq, i) => {
    const osc = ctx.createOscillator();
    osc.type = i === 0 ? 'sine' : 'triangle';
    osc.frequency.value = freq;
    const partial = ctx.createGain();
    partial.gain.value = i === 0 ? 0.5 : 0.18;
    osc.connect(partial);
    partial.connect(filter);
    osc.start();
    return osc;
  });

  const now = ctx.currentTime;
  gain.gain.exponentialRampToValueAtTime(0.045, now + 0.5);

  portalHumOsc = oscs;
  portalHumGain = gain;
};

export const setCosmosPortalActive = (active: boolean, accentHex = '#3de8ff') => {
  ensureUnlocked();

  if (active && !portalActive) {
    playPortalEnter(accentHex);
    startPortalHum(accentHex);
    portalActive = true;
    return;
  }

  if (!active && portalActive) {
    stopPortalHum();
    portalActive = false;
  }
};

/** 첫 입력에서 AudioContext unlock */
export const bindCosmosAudioUnlock = () => {
  if (typeof window === 'undefined') {
    const noop = () => {
      return;
    };
    return noop;
  }

  muted = window.localStorage.getItem('cosmos-audio-muted') === '1';
  if (masterGain) {
    masterGain.gain.value = muted ? 0 : MASTER_VOLUME;
  }

  const handleUnlock = () => {
    void unlockCosmosAudio();
  };

  window.addEventListener('pointerdown', handleUnlock, { once: true, capture: true });
  window.addEventListener('keydown', handleUnlock, { once: true, capture: true });

  return () => {
    window.removeEventListener('pointerdown', handleUnlock, true);
    window.removeEventListener('keydown', handleUnlock, true);
  };
};
