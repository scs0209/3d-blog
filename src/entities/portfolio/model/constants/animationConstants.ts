export const PULSE_DURATION = 1000; // 1초
export const LOADING_PROGRESS_STEP = 4; // 4단계
export const LOADING_PROGRESS_INTERVAL = 50; // 50ms

export const BAR_EXPAND_ANIMATION_DURATION = 1000; // 1초
export const OVERLAY_TRANSITION_DELAY = 1500; // 1.5초
export const INITIAL_DELAY = 300; // 0.3초

export const easeInOutCubic = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
};
