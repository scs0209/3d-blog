import { CHAIR_FIT, DESK_TYPIST } from './cyber-computer';

/** 의자/방 바닥 */
export const DESK_FLOOR_Y = CHAIR_FIT.min[1];

/**
 * Mixamo 서기 높이 (cm ≈ 180) × Armature 0.01 × group scale
 * Typing.glb 앉기용 height(1.18×scale)와 다름
 */
export const DESK_STAND_HEIGHT = 180 * 0.01 * DESK_TYPIST.scale;

/** 퇴장 서기/걷기 루트 Y — Mixamo 발이 루트보다 아래라 충분히 올려야 함 */
export const DESK_STAND_ROOT_Y = DESK_TYPIST.position[1] + 1120;

/** 머리 위 여유를 더 크게 — 문이 위로 더 길어짐 */
const portalTopY = DESK_STAND_ROOT_Y + DESK_STAND_HEIGHT * 1.42;
const portalHeight = portalTopY - DESK_FLOOR_Y;

export const DESK_EXIT_PORTAL = {
  center: [6380, DESK_FLOOR_Y + portalHeight / 2, 2350] as const,
  rotation: [0, -Math.PI / 2, 0] as const,
  size: {
    w: DESK_STAND_HEIGHT * 1.15,
    h: portalHeight,
  },
  floorY: DESK_FLOOR_Y,
} as const;

/**
 * Mixamo armature=0 기준 로컬 +Z 전방.
 * yaw = π/2 → 월드 +X (오른쪽 벽 포털)
 */
export const DESK_EXIT_DOOR_YAW = Math.PI / 2;

const SIT_TO_STAND_S = 2.2666666507720947;
/** root yaw만으로 문 방향 전환 (RightTurn 클립과 겹치면 사선) */
const TURN_TO_DOOR_S = 0.85;

const portalX = DESK_EXIT_PORTAL.center[0];

const seatedPosition = () => [...DESK_TYPIST.position] as const;

export const DESK_EXIT = {
  portal: DESK_EXIT_PORTAL,
  durationMs: 5800,
  fadeStart: 0.78,
  phases: {
    standEnd: SIT_TO_STAND_S / 5.8,
    turnEnd: (SIT_TO_STAND_S + TURN_TO_DOOR_S) / 5.8,
  },
  /** 포털을 지나 문 안으로 진입 (앞에서 멈추면 뒤로 튀어 보임) */
  walkTo: [portalX + 520, DESK_STAND_ROOT_Y, seatedPosition()[2]] as const,
} as const;

export type DeskExitState = {
  href: string;
  progress: number;
};

const easeOut = (t: number) => 1 - (1 - t) ** 2;
const easeIn = (t: number) => t * t;

/** stand/turn 제자리 → walk는 +X로 문 안까지 (감속·역행 없이) */
export const getExitTypistPosition = (
  progress: number,
  out: { set: (x: number, y: number, z: number) => void },
) => {
  const [sx, , sz] = seatedPosition();
  const uy = DESK_STAND_ROOT_Y;
  const [tx] = DESK_EXIT.walkTo;
  const { turnEnd } = DESK_EXIT.phases;

  if (progress < turnEnd) {
    out.set(sx, uy, sz);
    return;
  }

  const t = easeIn((progress - turnEnd) / (1 - turnEnd));
  out.set(sx + (tx - sx) * t, uy, sz);
};

/**
 * 바라보는 방향: 일어나기 후 문을 향해 부드럽게 회전 → 걷기 동안 문(+X) 고정
 * RightTurn 클립은 쓰지 않음 (root yaw와 겹치면 사선을 봄)
 */
export const getExitTypistYaw = (progress: number) => {
  const seatedYaw = DESK_TYPIST.rotation[1];
  const doorYaw = DESK_EXIT_DOOR_YAW;
  const { standEnd, turnEnd } = DESK_EXIT.phases;

  if (progress < standEnd) {
    return seatedYaw;
  }

  if (progress >= turnEnd) {
    return doorYaw;
  }

  const t = easeOut((progress - standEnd) / (turnEnd - standEnd));
  return seatedYaw + (doorYaw - seatedYaw) * t;
};

/** 의자: 책상 반대(+Z)로 밀림 — stand 구간에서 완료 */
export const DESK_EXIT_CHAIR = {
  pushZ: 1280,
} as const;

export const getExitChairOffsetZ = (progress: number) => {
  const { standEnd } = DESK_EXIT.phases;
  if (progress <= 0) {
    return 0;
  }
  const t = easeOut(Math.min(1, progress / standEnd));
  return DESK_EXIT_CHAIR.pushZ * t;
};
