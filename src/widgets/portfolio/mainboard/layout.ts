/**
 * 메인보드의 치수와 부품 배치. x는 오른쪽, z는 앞(보는 사람 쪽), y는 위.
 * 기판 윗면이 y = 0 이다.
 */
export const BOARD = { width: 96, depth: 76, thickness: 1.2 } as const;
export const HALF_W = BOARD.width / 2;
export const HALF_D = BOARD.depth / 2;

/** 섹션 = 보드 위의 한 구역 */
export type SectionId = 'hero' | 'about' | 'experience' | 'projects' | 'skills' | 'contact';

export const SECTION_ORDER: SectionId[] = ['hero', 'about', 'experience', 'projects', 'skills', 'contact'];

/** 주요 부품 위치 */
export const PARTS = {
  cpu: { x: -6, z: -7, size: 14 },
  /** 램 슬롯 5개 (기술 5분류) */
  ram: { xs: [16, 21, 26, 31, 36], z: -8, length: 40, height: 5.2 },
  /** M.2 SSD 두 개 (프로젝트) */
  ssd: [
    { x: 8, z: 22 },
    { x: 8, z: 31 },
  ],
  /** 롬 칩 두 개 (경력) */
  rom: [
    { x: -31, z: 21, size: 11 },
    { x: -15, z: 29, size: 8 },
  ],
  /** 뒤쪽 가장자리의 입출력 포트 (연락) */
  io: { xs: [-38, -26, -14], z: -HALF_D + 4 },
  chipset: { x: 36, z: 27, size: 12 },
} as const;

export type CameraKey = {
  position: [number, number, number];
  target: [number, number, number];
  /** 피사체를 화면 한쪽으로 미는 정도 (+면 오른쪽에 보인다). 글 자리를 비운다 */
  shift: number;
};

/** 스크롤에 따라 지나가는 카메라 지점. 넓은 화면 기준 */
export const CAMERA_KEYS: Record<SectionId, CameraKey> = {
  hero: { position: [46, 50, 66], target: [-2, 0, 0], shift: 0 },
  about: { position: [10, 16, 17], target: [-6, 1.2, -7], shift: 5.2 },
  experience: { position: [-56, 17, 48], target: [-24, 0.5, 24], shift: -2.5 },
  projects: { position: [26, 13, 50], target: [8, 0.5, 26], shift: 5.5 },
  skills: { position: [70, 30, 40], target: [26, 2.5, -8], shift: -9 },
  contact: { position: [-6, 22, -86], target: [-26, 2, -34], shift: 9 },
};

/** 좁은 화면에서는 더 물러나고, 피사체를 위쪽에 둔다 */
export const CAMERA_KEYS_COMPACT: Record<SectionId, CameraKey> = {
  hero: { position: [70, 96, 110], target: [0, 0, 6], shift: 0 },
  about: { position: [10, 26, 22], target: [-6, 1.2, -4], shift: 0 },
  experience: { position: [-62, 30, 62], target: [-24, 0.5, 28], shift: 0 },
  projects: { position: [34, 28, 70], target: [8, 0.5, 30], shift: 0 },
  skills: { position: [74, 34, 30], target: [26, 2.5, -4], shift: 0 },
  contact: { position: [-10, 30, -92], target: [-26, 2, -30], shift: 0 },
};

/** 매번 같은 결과가 나오는 난수 */
export const seededRandom = (seed: number) => {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export type Route = [number, number][];

/** 부품이 차지한 자리. 배선과 잔부품이 이 안으로 들어가지 않게 한다 */
const KEEP_OUT: [number, number, number, number][] = [
  [PARTS.cpu.x - 11, PARTS.cpu.z - 11, PARTS.cpu.x + 11, PARTS.cpu.z + 11],
  [12, -30, 40, 14],
  [-6, 17, 23, 36],
  [-39, 13, -9, 35],
  [28, 19, 44, 35],
  [-47, -38, -6, -27],
  [-32, -19, -19, 8],
  [-19, -30, 9, -20],
  [-46, 1, -8, 12],
];

export const isFree = (x: number, z: number, margin = 0) =>
  Math.abs(x) < HALF_W - 2 &&
  Math.abs(z) < HALF_D - 2 &&
  !KEEP_OUT.some(([x0, z0, x1, z1]) => x > x0 - margin && x < x1 + margin && z > z0 - margin && z < z1 + margin);

/**
 * 기판 배선. 직각과 45°로만 꺾이는 실제 PCB 배선처럼 만든다.
 * 같은 경로를 기판 텍스처에 그리고, 그 위로 신호(빛)가 흐른다.
 */
export const createRoutes = (seed: number) => {
  const random = seededRandom(seed);
  const routes: Route[] = [];
  const directions: [number, number][] = [
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0],
    [-1, -1],
    [0, -1],
    [1, -1],
  ];

  for (let index = 0; index < 190; index += 1) {
    let x = Math.round((random() * 2 - 1) * (HALF_W - 4));
    let z = Math.round((random() * 2 - 1) * (HALF_D - 4));
    let heading = Math.floor(random() * 8);
    const route: Route = [[x, z]];
    const segments = 2 + Math.floor(random() * 4);
    for (let segment = 0; segment < segments; segment += 1) {
      const direction = directions[heading];
      if (!direction) {
        break;
      }
      const length = 3 + Math.floor(random() * 12);
      const nx = x + direction[0] * length;
      const nz = z + direction[1] * length;
      if (Math.abs(nx) > HALF_W - 3 || Math.abs(nz) > HALF_D - 3) {
        break;
      }
      x = nx;
      z = nz;
      route.push([x, z]);
      // 45°씩만 꺾는다
      heading = (heading + (random() > 0.5 ? 1 : 7)) % 8;
    }
    if (route.length > 1) {
      routes.push(route);
    }
  }

  // CPU에서 램으로 가는 버스: 나란한 선 다발
  for (let lane = 0; lane < 16; lane += 1) {
    const z0 = PARTS.cpu.z - 6 + lane * 0.8;
    routes.push([
      [PARTS.cpu.x + 9, z0],
      [PARTS.cpu.x + 13 + lane * 0.25, z0],
      [PARTS.cpu.x + 17 + lane * 0.25, z0 - 4],
      [14, z0 - 4],
    ]);
  }
  // CPU에서 아래쪽 SSD·칩셋으로 가는 다발
  for (let lane = 0; lane < 10; lane += 1) {
    const x0 = PARTS.cpu.x - 4 + lane * 0.8;
    routes.push([
      [x0, PARTS.cpu.z + 9],
      [x0, PARTS.cpu.z + 14 + lane * 0.3],
      [x0 + 6, PARTS.cpu.z + 20 + lane * 0.3],
      [x0 + 6, 17],
    ]);
  }
  return routes;
};
