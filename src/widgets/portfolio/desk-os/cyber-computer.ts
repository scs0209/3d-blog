const DESK_DROP = 340;
const DESK_TOP = -452 - DESK_DROP;

export const DESK_FIT = {
  model: '/desk-os/furniture/desk.glb',
  rotY: Math.PI / 2,
  min: [-3587, -2979, -1146] as const,
  max: [2481, DESK_TOP, 1639] as const,
};

/** Combined chair_base + chair_seat bbox. Chair faces the desk (-Z). */
export const CHAIR_FIT = {
  model: '/desk-os/furniture/chair.glb',
  rotY: Math.PI,
  min: [-434, -2995, 1211] as const,
  max: [1969, 366, 3587] as const,
};

const CHAIR_CX = (CHAIR_FIT.min[0] + CHAIR_FIT.max[0]) / 2;
const CHAIR_CY = (CHAIR_FIT.min[1] + CHAIR_FIT.max[1]) / 2;
const CHAIR_CZ = (CHAIR_FIT.min[2] + CHAIR_FIT.max[2]) / 2;
const CHAIR_SCALE = (CHAIR_FIT.max[1] - CHAIR_FIT.min[1]) / 1.18;
const TYPING_SCALE = 1180;
const SEAT_TOP_Y = CHAIR_CY + (-1.18 / 2 + 0.5825) * CHAIR_SCALE;
/** Mixamo 바인드 높이 × 월드 스케일 */
const TYPIST_HEIGHT = 1.18 * TYPING_SCALE;

export const DESK_TYPIST = {
  model: '/Typing.glb',
  position: [CHAIR_CX - 40, SEAT_TOP_Y - 1.18 * TYPING_SCALE + 80, CHAIR_CZ + 40] as const,
  rotation: [0, Math.PI, 0] as const,
  scale: TYPING_SCALE,
  height: TYPIST_HEIGHT,
} as const;

export const CYBER_COMPUTER = {
  model: '/desk-os/computer/desk-pc.glb',
  texture: '/desk-os/computer/desk-pc.png',
  position: [0, DESK_TOP + 6, 50] as const,
  rotation: [0, 0, 0] as const,
  scale: 5,
};

export const DESK_LIGHT_TARGET: [number, number, number] = [0, DESK_TOP, 400];

/** Tower meshes (System_unit, Drive) are dropped to the floor under the desk in CyberpunkComputer. */

/** Inner LCD: 363.3 x 202.7 at y 68.7–271.3, z 8.98 (16:9). Slight overscan so Html meets the bezel. */
const SCREEN_LOCAL = { x: 0, y: 170, z: 11, w: 366, h: 205 };

export const SCREEN_WORLD = {
  w: SCREEN_LOCAL.w * CYBER_COMPUTER.scale,
  h: SCREEN_LOCAL.h * CYBER_COMPUTER.scale,
} as const;

export const CYBER_SCREEN = {
  position: [
    SCREEN_LOCAL.x * CYBER_COMPUTER.scale + CYBER_COMPUTER.position[0],
    SCREEN_LOCAL.y * CYBER_COMPUTER.scale + CYBER_COMPUTER.position[1],
    SCREEN_LOCAL.z * CYBER_COMPUTER.scale + CYBER_COMPUTER.position[2],
  ] as const,
  rotation: [0, 0, 0] as const,
};

export const OS_PIXEL = { w: 1280, h: 720 } as const;

export const SCREEN_SCALE = {
  x: (SCREEN_LOCAL.w * CYBER_COMPUTER.scale) / OS_PIXEL.w,
  y: (SCREEN_LOCAL.h * CYBER_COMPUTER.scale) / OS_PIXEL.h,
} as const;

export const ROOM_HIDE = ['desk', 'chair_base', 'chair_seat'];

export const DECOR_NUDGE = [
  ['binder_1', [0, -DESK_DROP, 340]],
  ['binder_2', [0, -DESK_DROP, 340]],
  ['coffee', [0, -DESK_DROP, 0]],
  ['paper', [0, -DESK_DROP, 0]],
  ['paper_holder_bottom', [0, -DESK_DROP, 0]],
  ['paper_holder_top', [0, -DESK_DROP, 0]],
  ['paper_stack_1', [0, -DESK_DROP, 0]],
  ['paper_stack_2', [0, -DESK_DROP, 0]],
] as const;
