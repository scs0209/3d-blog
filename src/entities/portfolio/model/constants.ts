import type { CameraTarget, Position3D } from './types';

export const INITIAL_CAMERA_POS: Position3D = [2, 5, 2];
export const INITIAL_CAMERA_LOOK: Position3D = [0, 0, 0];

export const CAMERA_ANIMATION_DURATION = 3;
export const SECONDARY_ANIMATION_DURATION = 1;
export const PULSE_DURATION = 1000;
export const CAMERA_ANIMATION_DELAY = 3000;

export const LOADING_PROGRESS_STEP = 4;
export const LOADING_PROGRESS_INTERVAL = 50;

export const GROUP_CAMERA_TARGETS: Record<string, CameraTarget> = {
  holoTable: {
    offset: [0, 1, 2],
    lookAt: [0, 0, 0],
    pulse: [0, 0, 0],
    modelPosition: [0, 0, 0],
  },
  work: {
    offset: [1, 2, 0],
    lookAt: [4.2, 0, 0],
    pulse: [4.2, 0, 0],
    modelPosition: [4, 0, 0],
    secondaryOffset: [1, 1, 3],
    secondaryLookAt: [0, 0, 0],
  },
  server: {
    offset: [0, 2.5, 1.5],
    lookAt: [0, 1, -4],
    pulse: [0, 0, -4],
    modelPosition: [0, 1, -4],
    secondaryOffset: [0, 0.2, 0.5],
    secondaryLookAt: [0, 1, -4],
  },
  experience: {
    offset: [0, 1, 2],
    lookAt: [0, 1.5, 0],
    pulse: [1.75, 0, 4.15],
    modelPosition: [-1, -0.5, 3],
  },
  contactMe: {
    offset: [2, 0.5, -0.3],
    lookAt: [-4, 0, -1],
    pulse: [-4, 0, -1],
    modelPosition: [-4, 0, -1],
    secondaryOffset: [0.5, 0.5, -0.3],
    secondaryLookAt: [-4, 0, -1],
  },
  resumeConsole: {
    offset: [0, 1.5, -1],
    lookAt: [3.2, 0, -2.8],
    pulse: [3.2, 0, -2.8],
    modelPosition: [3.2, 0, -2.8],
  },
  radar: {
    offset: [1, 2, 1],
    lookAt: [-2.5, 0, -3.5],
    pulse: [-2.5, 0, -3.5],
    modelPosition: [-2.5, 0, -3.5],
    secondaryOffset: [0, 2, 2],
    secondaryLookAt: [-3.5, 0, -2.5],
  },
};

export const easeInOutCubic = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
};
