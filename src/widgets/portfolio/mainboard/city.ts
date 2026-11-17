import { DIE_HALF, DISTRICTS, distanceToDistrict, HUB, isCleared, MONUMENT_OFFSET, panelSize, RACK } from './district';
import { seededRandom } from './layout';

export type CityBlock = {
  x: number;
  z: number;
  width: number;
  depth: number;
  height: number;
  /** 0–1, 블록마다 조금씩 다른 밝기 */
  tint: number;
  /** 지붕의 빛띠: 없음 / x방향 / z방향 */
  cap: 'none' | 'x' | 'z';
};

/** 충돌 상자. h는 그 구조물의 높이: 이보다 높이 떠 있으면 위로 지나갈 수 있다 */
type Rect = { x0: number; x1: number; z0: number; z1: number; h: number };

/** 문을 열어 볼 수 있는 숨은 서버. (x, z)는 문이 달린 앞면의 가운데 */
export type Secret = { id: number; x: number; z: number; width: number; height: number };

/** 숨은 서버의 수 */
export const SECRET_COUNT = 6;

export type LaneNode = { x: number; z: number; links: number[] };

export type City = {
  blocks: CityBlock[];
  /** 주민이 다니는 길의 교차점과 연결 */
  nodes: LaneNode[];
  /** 반지름 radius인 것이 (x, z)에 설 수 없으면 true. above 높이보다 낮은 구조물은 넘어간 것으로 친다 */
  blocked: (x: number, z: number, radius: number, above?: number) => boolean;
  /** (x, z) 아래에서 딛고 설 수 있는 가장 높은 면의 높이. 맨바닥이면 0 */
  groundAt: (x: number, z: number, radius: number) => number;
  /** 중심 광장에서 걸어서 닿을 수 있는 자리인가 */
  reachable: (x: number, z: number) => boolean;
  /** 문을 열어 볼 수 있는 숨은 서버들 */
  secrets: Secret[];
};

const CELL = 12;
const cellKey = (cx: number, cz: number) => `${cx}:${cz}`;

/** 지구의 패널과 기념물이 차지한 자리 */
const districtObstacles = (portrait: boolean): Rect[] => {
  const half = panelSize(portrait).width / 2 + 2.6;
  return DISTRICTS.flatMap((district) => [
    // 패널과 기념물은 뛰어넘을 수 없다
    {
      x0: district.x - half,
      x1: district.x + half,
      z0: district.z - 1.6,
      z1: district.z + 0.8,
      h: Number.POSITIVE_INFINITY,
    },
    // 거치대 뒤의 서버 랙 (문이 열리는 자리까지)
    {
      x0: district.x - RACK.width / 2 - 0.6,
      x1: district.x + RACK.width / 2 + 0.6,
      z0: district.z + RACK.front - RACK.depth - 0.4,
      z1: district.z - 1.6,
      h: Number.POSITIVE_INFINITY,
    },
    {
      x0: district.x - 16,
      x1: district.x + 16,
      z0: district.z + MONUMENT_OFFSET - 15,
      z1: district.z + MONUMENT_OFFSET + 10,
      h: Number.POSITIVE_INFINITY,
    },
  ]);
};

/**
 * 도시를 만든다. 같은 입력이면 항상 같은 도시가 나오며,
 * 그리는 쪽(블록)과 걷는 쪽(충돌·길)이 같은 데이터를 쓴다.
 */
export const createCity = (compact: boolean): City => {
  const random = seededRandom(7);
  const blocks: CityBlock[] = [];
  const pitch = compact ? 7.5 : 6;
  const limit = DIE_HALF - 8;
  const lanes: number[] = [];

  for (let g = -limit; g <= limit; g += pitch) {
    if (Math.round(g / pitch) % 6 === 0) {
      lanes.push(g);
    }
  }

  for (let gx = -limit; gx <= limit; gx += pitch) {
    for (let gz = -limit; gz <= limit; gz += pitch) {
      const lane = Math.round(gx / pitch) % 6 === 0 || Math.round(gz / pitch) % 6 === 0;
      const roll = random();
      const jitterX = (random() - 0.5) * 1.2;
      const jitterZ = (random() - 0.5) * 1.2;
      const width = pitch * (0.5 + random() * 0.38);
      const depth = pitch * (0.5 + random() * 0.38);
      const lift = random();
      const tint = random();
      const capped = random();
      if (lane || roll < 0.1) {
        continue;
      }
      const x = gx + jitterX;
      const z = gz + jitterZ;
      if (isCleared(x, z)) {
        continue;
      }
      // 높이는 구역마다 뭉쳐서 변한다: 낮은 메모리 평원과 높은 로직 숲
      const cluster = 0.5 + 0.5 * Math.sin(gx * 0.045 + 1.3) * Math.cos(gz * 0.052 - 0.4);
      let height = 0.7 + lift ** 2.4 * (3 + cluster * 17);
      // 패널 앞을 가리지 않도록 지구 주변은 낮게
      height = Math.min(height, 2 + Math.max(0, distanceToDistrict(x, z) - 26) * 0.16);
      blocks.push({
        x,
        z,
        width,
        depth,
        height,
        tint,
        cap: capped < 0.2 && height > 2.4 ? (capped < 0.1 ? 'x' : 'z') : 'none',
      });
    }
  }

  // 충돌: 블록과 지구 구조물을 격자에 나눠 담아 가까운 것만 검사한다
  const rects: Rect[] = [
    ...blocks.map((block) => ({
      x0: block.x - block.width / 2,
      x1: block.x + block.width / 2,
      z0: block.z - block.depth / 2,
      z1: block.z + block.depth / 2,
      h: block.height,
    })),
    ...districtObstacles(compact),
  ];
  const grid = new Map<string, Rect[]>();
  for (const rect of rects) {
    for (let cx = Math.floor(rect.x0 / CELL); cx <= Math.floor(rect.x1 / CELL); cx += 1) {
      for (let cz = Math.floor(rect.z0 / CELL); cz <= Math.floor(rect.z1 / CELL); cz += 1) {
        const key = cellKey(cx, cz);
        const bucket = grid.get(key);
        if (bucket) {
          bucket.push(rect);
        } else {
          grid.set(key, [rect]);
        }
      }
    }
  }
  const edge = DIE_HALF - 3;
  const blocked = (x: number, z: number, radius: number, above = 0) => {
    if (Math.abs(x) > edge - radius || Math.abs(z) > edge - radius) {
      return true;
    }
    for (let cx = Math.floor((x - radius) / CELL); cx <= Math.floor((x + radius) / CELL); cx += 1) {
      for (let cz = Math.floor((z - radius) / CELL); cz <= Math.floor((z + radius) / CELL); cz += 1) {
        for (const rect of grid.get(cellKey(cx, cz)) ?? []) {
          if (
            rect.h > above &&
            x > rect.x0 - radius &&
            x < rect.x1 + radius &&
            z > rect.z0 - radius &&
            z < rect.z1 + radius
          ) {
            return true;
          }
        }
      }
    }
    return false;
  };
  const groundAt = (x: number, z: number, radius: number) => {
    let ground = 0;
    for (let cx = Math.floor((x - radius) / CELL); cx <= Math.floor((x + radius) / CELL); cx += 1) {
      for (let cz = Math.floor((z - radius) / CELL); cz <= Math.floor((z + radius) / CELL); cz += 1) {
        for (const rect of grid.get(cellKey(cx, cz)) ?? []) {
          if (
            Number.isFinite(rect.h) &&
            rect.h > ground &&
            x > rect.x0 - radius &&
            x < rect.x1 + radius &&
            z > rect.z0 - radius &&
            z < rect.z1 + radius
          ) {
            ground = rect.h;
          }
        }
      }
    }
    return ground;
  };

  // 길: 블록 사이 골목의 교차점을 잇는다. 구조물을 가로지르는 구간은 뺀다
  const clear = (ax: number, az: number, bx: number, bz: number) => {
    const steps = Math.max(1, Math.ceil(Math.hypot(bx - ax, bz - az) / 2));
    for (let step = 0; step <= steps; step += 1) {
      const t = step / steps;
      if (blocked(ax + (bx - ax) * t, az + (bz - az) * t, 1.2)) {
        return false;
      }
    }
    return true;
  };
  const nodes: LaneNode[] = [];
  const index = new Map<string, number>();
  lanes.forEach((x, ix) => {
    lanes.forEach((z, iz) => {
      if (!blocked(x, z, 1.2)) {
        index.set(cellKey(ix, iz), nodes.length);
        nodes.push({ x, z, links: [] });
      }
    });
  });
  lanes.forEach((_, ix) => {
    lanes.forEach((__, iz) => {
      const from = index.get(cellKey(ix, iz));
      if (from === undefined) {
        return;
      }
      for (const [dx, dz] of [
        [1, 0],
        [0, 1],
      ] as const) {
        const to = index.get(cellKey(ix + dx, iz + dz));
        const a = nodes[from];
        const b = to === undefined ? undefined : nodes[to];
        if (to !== undefined && a && b && clear(a.x, a.z, b.x, b.z)) {
          a.links.push(to);
          b.links.push(from);
        }
      }
    });
  });

  // 걸어서 닿는 곳: 중심 광장에서 시작해 막히지 않은 칸을 따라 번져 나간다
  const Step = 2;
  const walkable = new Set<string>();
  const queue: [number, number][] = [[Math.round(HUB[0] / Step), Math.round((HUB[1] + 4) / Step)]];
  const start = queue[0];
  if (start) {
    walkable.add(cellKey(start[0], start[1]));
  }
  while (queue.length > 0) {
    const cell = queue.pop();
    if (!cell) {
      break;
    }
    for (const [dx, dz] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ] as const) {
      const nx = cell[0] + dx;
      const nz = cell[1] + dz;
      const key = cellKey(nx, nz);
      if (!walkable.has(key) && !blocked(nx * Step, nz * Step, 1.4)) {
        walkable.add(key);
        queue.push([nx, nz]);
      }
    }
  }
  const reachable = (x: number, z: number) => walkable.has(cellKey(Math.round(x / Step), Math.round(z / Step)));

  // 숨은 서버: 앞이 트여 있어 걸어가 설 수 있고, 문을 달 만한 크기인 건물 가운데서 고른다.
  // 첫 번째는 광장에서 멀지 않은 곳에 둬서 우연히 마주칠 수 있게 하고, 나머지는 서로 멀리 흩어 놓는다
  const candidates = blocks
    .map((block) => ({
      x: block.x,
      z: block.z + block.depth / 2,
      width: block.width,
      height: block.height,
    }))
    .filter(
      (spot) =>
        spot.height >= 4 &&
        spot.height <= 14 &&
        spot.width >= 3.4 &&
        distanceToDistrict(spot.x, spot.z) > 34 &&
        Math.hypot(spot.x - HUB[0], spot.z - HUB[1]) > 18 &&
        !blocked(spot.x, spot.z + 2, 1.3) &&
        reachable(spot.x, spot.z + 2),
    );
  const secrets: Secret[] = [];
  const nearest = [...candidates].sort(
    (a, b) => Math.hypot(a.x - HUB[0], a.z - HUB[1]) - Math.hypot(b.x - HUB[0], b.z - HUB[1]),
  )[0];
  if (nearest) {
    secrets.push({ id: 0, ...nearest });
  }
  const pick = seededRandom(23);
  for (let attempt = 0; attempt < 600 && secrets.length < SECRET_COUNT && candidates.length > 0; attempt += 1) {
    const spot = candidates[Math.floor(pick() * candidates.length)];
    if (spot && secrets.every((other) => Math.hypot(other.x - spot.x, other.z - spot.z) > 60)) {
      secrets.push({ id: secrets.length, ...spot });
    }
  }

  return { blocks, nodes, blocked, groundAt, reachable, secrets };
};
