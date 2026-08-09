import type { FocusedGroup, Position3D } from '../types';

export type StationId = Exclude<FocusedGroup, null | 'holoTable'>;

export type StationLayout = {
  id: StationId;
  label: string;
  /** 스테이션 월드 앵커 — SceneRenderer group */
  anchor: Position3D;
  /** 호버 네온 박스 중심 — 모델 클러스터 시각적 중앙 */
  hoverCenter: Position3D;
  /** 라벨 월드 위치 = anchor + labelOffset */
  labelOffset: Position3D;
  labelRotation: Position3D;
  labelScale?: number;
};

/**
 * 모델·라벨 배치 SSOT.
 * 카메라는 cameraConstants.GROUP_CAMERA_TARGETS (검증된 절대 좌표)를 사용.
 */
export const SCENE_STATIONS: Record<StationId, StationLayout> = {
  work: {
    id: 'work',
    label: 'ABOUT ME',
    anchor: [4.2, 0, 0],
    hoverCenter: [4.2, 4, 0],
    labelOffset: [-0.8, 0, 0.5],
    labelRotation: [-Math.PI / 2, 0, Math.PI / 2],
    labelScale: 0.5,
  },
  home: {
    id: 'home',
    label: 'HOME',
    anchor: [-5, 0, -0.1],
    hoverCenter: [-5, 0, -0.1],
    labelOffset: [1.0, 0, 0.4],
    labelRotation: [-Math.PI / 2, 0, Math.PI / 2],
    labelScale: 0.8,
  },
  server: {
    id: 'server',
    label: 'WORKS',
    anchor: [0.3, 0, -3.8],
    hoverCenter: [0.3, 0, -4],
    labelOffset: [-0.4, 0, 0.8],
    labelRotation: [-Math.PI / 2, 0, 0],
  },
  experience: {
    id: 'experience',
    label: 'EXPERIENCE',
    anchor: [-1, 0, 4],
    hoverCenter: [-1, 0, 4.1],
    labelOffset: [-0.3, 0, -0.7],
    labelRotation: [-Math.PI / 2, 0, 0],
  },
  platform: {
    id: 'platform',
    label: 'PLAYGROUND',
    anchor: [-4, 0, 3.5],
    hoverCenter: [-4, 0, 3.5],
    labelOffset: [-0.5, 0, -0.7],
    labelRotation: [-Math.PI / 2, 0, 0],
  },
  resumeConsole: {
    id: 'resumeConsole',
    label: 'RESUME',
    anchor: [3.2, 0, -2.9],
    hoverCenter: [3.35, 0, -2.95],
    labelOffset: [-0.35, 0, 0.4],
    labelRotation: [-Math.PI / 2, 0, Math.PI / 2],
  },
  skill: {
    id: 'skill',
    label: 'SKILLS',
    anchor: [1.5, 0, 1.5],
    hoverCenter: [1.5, 0, 1.5],
    labelOffset: [0.8, 0, 0.5],
    labelRotation: [-Math.PI / 2, 0, Math.PI / 2],
  },
  radar: {
    id: 'radar',
    label: 'CONTACT',
    anchor: [-3, 0, -3.5],
    hoverCenter: [-3, 0, -3.5],
    labelOffset: [1.1, 0, 0.4],
    labelRotation: [-Math.PI / 2, 0, Math.PI / 2],
    labelScale: 0.8,
  },
};

export const STATION_LIST = Object.values(SCENE_STATIONS);

export const getStation = (id: StationId): StationLayout => SCENE_STATIONS[id];
