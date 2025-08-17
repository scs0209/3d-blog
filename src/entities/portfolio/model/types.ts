export type FocusedGroup =
  | null
  | 'holoTable'
  | 'work'
  | 'server'
  | 'experience'
  | 'contactMe'
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
  liveUrl: string;
};
