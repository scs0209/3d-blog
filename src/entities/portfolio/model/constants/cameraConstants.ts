import type { CameraTarget, Position3D } from '../types';

export const INITIAL_CAMERA_POS: Position3D = [2, 5, 2.5];
export const INITIAL_CAMERA_LOOK: Position3D = [0, 0, 0];

export const CAMERA_ANIMATION_DURATION = 3;
export const SECONDARY_ANIMATION_DURATION = 1;
export const CAMERA_ANIMATION_DELAY = 3000;

/**
 * 카메라 타겟 — 검증된 절대 좌표.
 * camPos = modelPosition + offset, lookAt/secondaryLookAt 은 월드 절대값.
 */
export const GROUP_CAMERA_TARGETS: Record<string, CameraTarget> = {
  work: {
    offset: [1, 2, 0],
    lookAt: [4.2, 0, 0],
    pulse: [4.2, 0, 0],
    modelPosition: [4.2, 0, 0],
    secondaryOffset: [0.7, 0.5, 2.7],
    secondaryLookAt: [0, 0, 0],
  },
  server: {
    offset: [0, 2.5, 1.5],
    lookAt: [0, 1, -4],
    pulse: [0, 0, -4],
    modelPosition: [0, 1, -4],
    secondaryOffset: [0.3, -0.38, 0.6],
    secondaryLookAt: [0.3, 0.3, -4],
  },
  experience: {
    modelPosition: [-1, -0.5, 3],
    offset: [0, 1, 2],
    lookAt: [-1, -0.5, 3],
    pulse: [1.75, 0, 4.15],
    secondaryOffset: [0, 1.5, 2],
    secondaryLookAt: [-1, 1, 4],
  },
  home: {
    offset: [2, 0.5, 0],
    lookAt: [-4, 0, -0.1],
    pulse: [-4, 0, -0.1],
    modelPosition: [-4, 0, -0.1],
    secondaryOffset: [0.3, 0.5, 0],
    secondaryLookAt: [-4.7, 0.5, -0.1],
  },
  resumeConsole: {
    offset: [1.5, 1.0, 0],
    lookAt: [3.2, 0, -2.8],
    pulse: [3.2, 0, -2.8],
    modelPosition: [3.2, 0, -2.8],
    secondaryOffset: [1.5, 1.0, 0.8],
    secondaryLookAt: [3.2, 0, -2.0],
  },
  radar: {
    offset: [1.6, 2.4, 1.6],
    lookAt: [-3, 0, -3.5],
    pulse: [-3, 0, -3.5],
    modelPosition: [-3, 0, -3.5],
    secondaryOffset: [0.4, 2.4, 2.8],
    secondaryLookAt: [-4.2, 0, -2.3],
  },
  skill: {
    modelPosition: [1.5, 0, 1.5],
    offset: [1, 1.5, 1],
    lookAt: [1.5, 0, 1.5],
    pulse: [1.5, 0, 1.5],
    secondaryOffset: [2.5, 1.5, -0.5],
    secondaryLookAt: [3, 0, 0],
  },
};

export type { StationId, StationLayout } from './sceneLayoutConstants';
export { getStation, SCENE_STATIONS, STATION_LIST } from './sceneLayoutConstants';
