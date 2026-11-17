/**
 * 칩 내부 세계의 구역. 이 칩은 AYAAN에 대한 AI 메모리이고,
 * 다섯 지구는 각각 하나의 기억(메모리 항목)이다.
 */
export type DistrictId = 'about' | 'experience' | 'projects' | 'skills' | 'contact';

/** 지금 카메라가 보고 있는 곳 */
export type ViewId = 'overview' | DistrictId;

export type District = {
  id: DistrictId;
  code: string;
  label: string;
  /** 이 지구가 칩의 어떤 블록인지 */
  part: string;
  /** 이 지구가 담고 있는 기억의 파일 이름과 종류. AI 메모리의 항목처럼 표기한다 */
  file: string;
  kind: string;
  x: number;
  z: number;
};

export const DISTRICTS: District[] = [
  { id: 'about', code: '01', label: 'ABOUT', part: 'CORE', x: 0, z: -10, file: 'about.md', kind: 'user' },
  {
    id: 'experience',
    code: '02',
    label: 'EXPERIENCE',
    part: 'ROM',
    x: -80,
    z: -74,
    file: 'experience.md',
    kind: 'history',
  },
  {
    id: 'projects',
    code: '03',
    label: 'PROJECTS',
    part: 'STORAGE',
    x: 80,
    z: -74,
    file: 'projects.md',
    kind: 'project',
  },
  { id: 'skills', code: '04', label: 'SKILLS', part: 'MEMORY', x: -72, z: 52, file: 'skills.md', kind: 'skill' },
  { id: 'contact', code: '05', label: 'CONTACT', part: 'I/O', x: 72, z: 52, file: 'contact.md', kind: 'reference' },
];

export const DISTRICT_IDS = DISTRICTS.map((district) => district.id);

/** 다이(바닥) 한 변의 절반 */
export const DIE_HALF = 150;

/** 내용 패널의 크기. 좁은 화면에서는 세로로 긴 패널을 쓴다 */
export const panelSize = (portrait: boolean) =>
  portrait ? { width: 17, height: 30, centre: 18.5 } : { width: 34, height: 20, centre: 13.5 };

/** 지구 바닥에 찍힌 사각형(부품 외곽선)의 크기와, 지구 중심에서 본 그 중심의 z 위치 */
export const PAD = { width: 48, depth: 44, offset: 16, inset: 1 };

/** (x, z)가 그 지구의 사각형 안인가 */
export const insidePad = (district: District, x: number, z: number) =>
  Math.abs(x - district.x) < PAD.width / 2 - PAD.inset &&
  Math.abs(z - (district.z + PAD.offset)) < PAD.depth / 2 - PAD.inset;

/** 서버 랙: 거치대 바로 뒤, 지구 한가운데에 선 양문형 캐비닛. front는 지구 중심에서 본 앞면의 z */
export const RACK = { width: 13, depth: 6, front: -7.5, shelf: 10 };

/** 랙의 높이: 꺼낸 패널 위로 머리가 올라오도록 패널보다 조금 높다 */
export const rackHeight = (portrait: boolean) => {
  const size = panelSize(portrait);
  return Math.max(size.centre + size.height / 2 + 3.5, 27);
};

/** 랙의 중심 (x, z) */
export const rackSpot = (district: District): [number, number] => [
  district.x,
  district.z + RACK.front - RACK.depth / 2,
];

/** 기억을 꺼낼 때 내 캐릭터가 서는 자리: 거치대 왼쪽 기둥 옆, 패널을 가리지 않는 곳 */
export const grabSpot = (district: District, portrait: boolean): [number, number] => [
  district.x - panelSize(portrait).width / 2 - 4.2,
  district.z + 3.2,
];

/** 지구 뒤편 기념물이 서는 자리 (패널 뒤) */
export const MONUMENT_OFFSET = -24;

/** 중심 광장에서 각 지구로 이어지는 대로. 직각으로만 꺾인다 */
export const HUB: [number, number] = [0, 36];

export const AVENUES: [number, number][][] = DISTRICTS.filter((district) => district.id !== 'about').map((district) =>
  district.z < 0
    ? [HUB, [district.x, HUB[1]], [district.x, district.z + 30]]
    : [HUB, [0, district.z + 50], [district.x, district.z + 50]],
);

const distanceToSegment = (x: number, z: number, a: [number, number], b: [number, number]) => {
  const dx = b[0] - a[0];
  const dz = b[1] - a[1];
  const length = dx * dx + dz * dz;
  const t = length === 0 ? 0 : Math.min(1, Math.max(0, ((x - a[0]) * dx + (z - a[1]) * dz) / length));
  return Math.hypot(x - (a[0] + dx * t), z - (a[1] + dz * t));
};

/** 건물이 들어서면 안 되는 자리: 지구 앞 진입로, 기념물 자리, 대로 */
export const isCleared = (x: number, z: number) => {
  for (const district of DISTRICTS) {
    if (Math.abs(x - district.x) < 25 && z > district.z - 40 && z < district.z + 82) {
      return true;
    }
  }
  for (const avenue of AVENUES) {
    for (let index = 0; index < avenue.length - 1; index += 1) {
      const a = avenue[index];
      const b = avenue[index + 1];
      if (a && b && distanceToSegment(x, z, a, b) < 4.2) {
        return true;
      }
    }
  }
  return false;
};

/** 가장 가까운 지구까지의 거리. 패널 주변 건물을 낮게 유지하는 데 쓴다 */
export const distanceToDistrict = (x: number, z: number) =>
  Math.min(...DISTRICTS.map((district) => Math.hypot(x - district.x, z - district.z)));

/** 기억 조각을 모두 모으면 켜진다: 공중에서 몇 번이든 다시 뛸 수 있다 */
export const ability = { flight: false };

/** 숨은 서버(이스터에그)가 3D 장면과 화면 UI 사이에 주고받는 신호의 이름 */
export const SECRET_NEAR = 'portfolio:secret-near';
export const SECRET_OPEN = 'portfolio:secret-open';
export const SECRET_FOUND = 'portfolio:secret-found';
/** 숨은 서버가 캐릭터에게: 이 서랍 앞으로 와서 손으로 당겨 달라 (여닫기 모두) */
export const SECRET_ACT = 'portfolio:secret-act';
/** 캐릭터가 숨은 서버에게: 지금 손잡이를 잡아당겼다 */
export const SECRET_PULL = 'portfolio:secret-pull';
/** 캐릭터가 서야 할 자리와 바라볼 곳 */
export type SecretAct = { standX: number; standZ: number; faceX: number; faceZ: number };
/** 지금 캐릭터가 앞에 서 있는 숨은 서버. 없으면 null */
export type SecretNear = { id: number; file: string } | null;
