export type FocusedGroup =
  | null
  | 'holoTable'
  | 'work'
  | 'server'
  | 'experience'
  | 'home'
  | 'resumeConsole'
  | 'skill'
  | 'radar'
  | 'platform';

export type Position3D = [number, number, number];

export type CameraTarget = {
  offset: Position3D;
  lookAt: Position3D;
  pulse: Position3D;
  modelPosition: Position3D;
  secondaryOffset?: Position3D;
  secondaryLookAt?: Position3D;
};

export type PortfolioState = {
  focusedGroup: FocusedGroup;
  pulseActive: boolean;
  pulseCenter: Position3D | null;
  hoveredPosition: Position3D | null;
  quality: boolean;
  sound: boolean;
};

export type CameraAnimationState = {
  targetPos: Position3D | null;
  targetLook: Position3D | null;
  secondaryAnimation: boolean;
  cameraAnimationDone: boolean;
  hasClickedBack: boolean;
};

export type CameraAnimationRef = {
  start: number;
  fromPos: Position3D;
  toPos: Position3D;
  fromLook: Position3D;
  toLook: Position3D;
  running: boolean;
  isSecondary: boolean;
};

export type PortfolioProject = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  /** 배포된 사이트 URL. 없으면 VIEW LIVE 미노출 */
  liveUrl?: string;
  /** GitHub 등 소스 저장소 URL */
  sourceUrl: string;
};

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  description: string[];
  skills: string[];
}

export type AnimationPhase =
  | 'idle'
  | 'cards-entering'
  | 'cards-entered'
  | 'content-entering'
  | 'active'
  | 'content-exiting'
  | 'cards-exiting'
  | 'exited';
