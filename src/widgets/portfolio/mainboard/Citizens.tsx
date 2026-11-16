'use client';

import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { type RefObject, useCallback, useEffect, useMemo, useRef } from 'react';
import * as three from 'three';
import type { City } from './city';
import { ability, DISTRICTS, type DistrictId, grabSpot, HUB, insidePad, RACK, rackSpot, type ViewId } from './district';
import { seededRandom } from './layout';

const BOT_URL = '/portfolio/bot.glb';
/** 모델(약 1.5 단위)을 세계 크기로 키우는 배율 */
const SCALE = 3.1;
const PART_NAMES = ['body', 'head', 'foot_l', 'foot_r', 'arm_l', 'arm_r', 'pack'] as const;
type PartName = (typeof PART_NAMES)[number];

/** 주민들의 몸 색: 부드러운 플라스틱 색 */
const SHELLS = ['#aeb6bf', '#7fb4d6', '#9c8fd0', '#7fc4a6', '#d48aa9', '#c9c08a', '#8f99a4'];

type Bot = {
  root: three.Group;
  parts: Partial<Record<PartName, three.Object3D>>;
  base: Partial<Record<PartName, three.Vector3>>;
  shell: three.Material;
};

/** 모델을 복제해 주민 한 명을 만든다. 형태는 같고 몸 색만 다르다 */
export const useBotBuilder = (accent: string) => {
  const { scene } = useGLTF(BOT_URL);
  const shared = useMemo(
    () => ({
      visor: new three.MeshPhysicalMaterial({ color: '#05070a', roughness: 0.1, metalness: 0.3, clearcoat: 1 }),
      dark: new three.MeshStandardMaterial({ color: '#171b21', roughness: 0.45, metalness: 0.4 }),
      gold: new three.MeshPhysicalMaterial({ color: '#d8b05a', metalness: 1, roughness: 0.25 }),
      light: new three.MeshBasicMaterial({ color: new three.Color(accent).multiplyScalar(1.25), toneMapped: false }),
    }),
    [accent],
  );

  useEffect(
    () => () => {
      for (const material of Object.values(shared)) {
        material.dispose();
      }
    },
    [shared],
  );

  return useCallback(
    (color: string, withPack: boolean): Bot => {
      const root = scene.clone(true) as three.Group;
      const shell = new three.MeshPhysicalMaterial({
        color,
        roughness: 0.42,
        clearcoat: 0.35,
        clearcoatRoughness: 0.3,
      });
      root.traverse((child) => {
        const mesh = child as three.Mesh;
        if (!mesh.isMesh) {
          return;
        }
        mesh.castShadow = true;
        const name = (mesh.material as three.Material).name;
        if (name === 'shell') {
          mesh.material = shell;
        } else if (name === 'visor') {
          mesh.material = shared.visor;
        } else if (name === 'eye' || name === 'glow') {
          mesh.material = shared.light;
        } else if (name === 'accent') {
          mesh.material = shared.gold;
        } else {
          mesh.material = shared.dark;
        }
      });
      const parts: Bot['parts'] = {};
      const base: Bot['base'] = {};
      for (const name of PART_NAMES) {
        const part = root.getObjectByName(name);
        if (part) {
          parts[name] = part;
          base[name] = part.position.clone();
        }
      }
      if (parts.pack) {
        parts.pack.visible = withPack;
      }
      root.scale.setScalar(SCALE);
      return { root, parts, base, shell };
    },
    [scene, shared],
  );
};

/** 걸음새. 뼈대 없이 부위를 직접 움직인다: 발은 앞뒤로, 팔은 반대로, 몸은 통통 */
export const pose = (bot: Bot, phase: number, gait: number, time: number, seed: number) => {
  const swing = Math.sin(phase) * gait;
  const { parts, base } = bot;
  if (parts.foot_l && base.foot_l) {
    parts.foot_l.position.z = base.foot_l.z + swing * 0.13;
    parts.foot_l.position.y = base.foot_l.y + Math.max(0, Math.cos(phase)) * 0.07 * gait;
  }
  if (parts.foot_r && base.foot_r) {
    parts.foot_r.position.z = base.foot_r.z - swing * 0.13;
    parts.foot_r.position.y = base.foot_r.y + Math.max(0, -Math.cos(phase)) * 0.07 * gait;
  }
  if (parts.arm_l) {
    parts.arm_l.rotation.x = -swing * 0.7;
  }
  if (parts.arm_r) {
    parts.arm_r.rotation.x = swing * 0.7;
  }
  const bounce = Math.abs(Math.sin(phase)) * gait;
  const breath = Math.sin(time * 2 + seed) * 0.008;
  if (parts.body && base.body) {
    parts.body.position.y = base.body.y + bounce * 0.035 + breath;
  }
  if (parts.pack && base.pack) {
    parts.pack.position.y = base.pack.y + bounce * 0.035 + breath;
  }
  if (parts.head && base.head) {
    parts.head.position.y = base.head.y + bounce * 0.05 + breath;
    parts.head.rotation.z = swing * 0.05;
    // 서 있을 때는 주변을 두리번거린다
    parts.head.rotation.y = (1 - gait) * Math.sin(time * 0.7 + seed) * 0.4;
  }
};

/** 각도를 가까운 쪽으로 돌린다 */
export const turn = (from: number, to: number, amount: number) => {
  const difference = Math.atan2(Math.sin(to - from), Math.cos(to - from));
  return from + difference * amount;
};

/** 미니어처 한 명이 서 있는 자리 */
export type Spot = { x: number; z: number };

/** 길 가운데에서 오른쪽으로 비켜 걷는 거리 */
const LANE_SIDE = 1.7;
/** 미니어처끼리 이보다 가까워지지 않는다 */
const GAP = 3.3;
/** 내 캐릭터와 주민 사이의 최소 거리. 주민끼리의 간격(GAP)보다 좁아야 길이 막히지 않는다 */
const PLAYER_GAP = 2.3;

type Walker = {
  bot: Bot;
  /** 길 위의 자리(목표)와 화면에 그리는 자리. 그리는 자리는 부드럽게 따라간다 */
  spot: Spot;
  x: number;
  z: number;
  /** 앞이 막혀 기다린 시간, 인사하는 남은 시간, 다음 인사까지의 쉬는 시간 */
  wait: number;
  greet: number;
  cool: number;
  from: number;
  to: number;
  travelled: number;
  speed: number;
  phase: number;
  gait: number;
  pause: number;
  heading: number;
  seed: number;
};

/** 길을 따라 돌아다니는 꼬마 주민들 */
export const Citizens = ({
  city,
  accent,
  count,
  still,
  playerRef,
  crowdRef,
}: {
  city: City;
  accent: string;
  count: number;
  still: boolean;
  playerRef: RefObject<three.Vector3>;
  /** 주민들의 자리를 내 캐릭터에게 알려 준다 */
  crowdRef: RefObject<Spot[]>;
}) => {
  const build = useBotBuilder(accent);

  const walkers = useMemo(() => {
    const random = seededRandom(404);
    const usable = city.nodes.map((node, index) => ({ node, index })).filter((item) => item.node.links.length > 0);
    const list: Walker[] = [];
    // 처음부터 겹치지 않도록 서로 다른 교차점에서 출발한다
    for (let index = usable.length - 1; index > 0; index -= 1) {
      const other = Math.floor(random() * (index + 1));
      const held = usable[index];
      const swapped = usable[other];
      if (held && swapped) {
        usable[index] = swapped;
        usable[other] = held;
      }
    }
    for (let index = 0; index < count && index < usable.length; index += 1) {
      const start = usable[index];
      if (!start) {
        continue;
      }
      const to = start.node.links[Math.floor(random() * start.node.links.length)] ?? start.index;
      list.push({
        bot: build(SHELLS[index % SHELLS.length] ?? '#eef1f4', false),
        spot: { x: start.node.x, z: start.node.z },
        x: start.node.x,
        z: start.node.z,
        wait: 0,
        greet: 0,
        cool: 0,
        from: start.index,
        to,
        travelled: 0,
        speed: 5.5 + random() * 4,
        phase: random() * 6,
        gait: 1,
        pause: 0,
        heading: 0,
        seed: random() * 10,
      });
    }
    return list;
  }, [city, count, build]);

  useEffect(
    () => () => {
      for (const walker of walkers) {
        walker.bot.shell.dispose();
      }
    },
    [walkers],
  );

  useEffect(() => {
    crowdRef.current = walkers.map((walker) => walker.spot);
    return () => {
      crowdRef.current = [];
    };
  }, [walkers, crowdRef]);

  useFrame(({ clock }, rawDelta) => {
    const delta = still ? 0 : Math.min(rawDelta, 0.05);
    const time = clock.elapsedTime;
    const player = playerRef.current;
    // 길 위의 자리: 교차점 from에서 to로 travelled만큼 간 곳의, 길 오른쪽
    const place = (from: number, to: number, travelled: number) => {
      const a = city.nodes[from];
      const b = city.nodes[to];
      if (!a || !b) {
        return null;
      }
      const length = Math.hypot(b.x - a.x, b.z - a.z);
      const dx = length === 0 ? 0 : (b.x - a.x) / length;
      const dz = length === 0 ? 0 : (b.z - a.z) / length;
      const t = length === 0 ? 0 : Math.min(1, travelled / length);
      return {
        x: a.x + (b.x - a.x) * t - dz * LANE_SIDE,
        z: a.z + (b.z - a.z) * t + dx * LANE_SIDE,
        dx,
        dz,
        length,
        links: b.links,
      };
    };
    // 그 자리로 옮겨도 되는가: 다른 미니어처에게 GAP 안쪽으로 다가가는 이동은 안 된다
    const free = (walker: Walker, x: number, z: number) => {
      const closing = (otherX: number, otherZ: number) => {
        const after = Math.hypot(otherX - x, otherZ - z);
        return after < GAP && after < Math.hypot(otherX - walker.spot.x, otherZ - walker.spot.z) - 1e-6;
      };
      if (closing(player.x, player.z)) {
        return false;
      }
      for (const other of walkers) {
        if (other !== walker && closing(other.spot.x, other.spot.z)) {
          return false;
        }
      }
      return true;
    };

    for (const walker of walkers) {
      // 내 캐릭터가 다가오면 잠깐 멈춰 돌아보고 폴짝 뛰며 인사한 뒤, 다시 제 갈 길을 간다
      walker.cool -= delta;
      if (walker.greet > 0) {
        walker.greet -= delta;
      } else if (walker.cool <= 0 && Math.hypot(player.x - walker.spot.x, player.z - walker.spot.z) < 9) {
        walker.greet = 2.2;
        walker.cool = 10;
      }
      const greeting = walker.greet > 0;

      let advance = 0;
      if (walker.pause > 0) {
        walker.pause -= delta;
      } else if (!greeting) {
        advance = walker.speed * delta;
      }
      const here = place(walker.from, walker.to, walker.travelled);
      if (!here) {
        continue;
      }
      if (advance > 0) {
        // 한 걸음 내디딘 뒤의 상태를 먼저 셈해 보고, 그 자리가 비어 있을 때만 옮긴다
        let from = walker.from;
        let to = walker.to;
        let travelled = walker.travelled + advance;
        let pause = 0;
        if (travelled >= here.length) {
          // 교차점에 도착: 가끔 멈춰 서고, 왔던 길이 아닌 쪽으로 간다
          const options = here.links.filter((link) => link !== from);
          const pool = options.length > 0 ? options : here.links;
          const pick =
            pool[Math.floor(((Math.sin(time * 13.7 + walker.seed * 91) + 1) / 2) * pool.length) % pool.length];
          from = to;
          to = pick ?? from;
          travelled = 0;
          if (Math.sin(time * 7.3 + walker.seed * 37) > 0.55) {
            pause = 1.2 + (walker.seed % 3);
          }
        }
        const next = place(from, to, travelled);
        if (next && free(walker, next.x, next.z)) {
          walker.from = from;
          walker.to = to;
          walker.travelled = travelled;
          walker.pause = pause;
          walker.wait = 0;
        } else {
          // 막혔다: 서서 기다리고, 오래 막히면 돌아선다 (돌아설 자리도 비어 있어야 한다)
          advance = 0;
          walker.wait += delta;
          if (walker.wait > 1.2 + walker.seed * 0.15) {
            const back = Math.max(0, here.length - walker.travelled);
            const turned = place(walker.to, walker.from, back);
            if (turned && free(walker, turned.x, turned.z)) {
              const origin = walker.from;
              walker.from = walker.to;
              walker.to = origin;
              walker.travelled = back;
            }
            walker.wait = 0;
          }
        }
      }
      const now = place(walker.from, walker.to, walker.travelled) ?? here;
      const { dx, dz, length } = now;
      walker.spot.x = now.x;
      walker.spot.z = now.z;
      // 모퉁이를 돌거나 돌아설 때 자리가 튀지 않도록 부드럽게 따라간다
      const follow = still ? 1 : Math.min(1, delta * 14);
      walker.x += (walker.spot.x - walker.x) * follow;
      walker.z += (walker.spot.z - walker.z) * follow;

      const moving = advance > 0 ? 1 : 0;
      walker.gait += (moving - walker.gait) * Math.min(1, delta * 8);
      walker.phase += delta * walker.speed * 1.5 * walker.gait;
      if (greeting) {
        walker.heading = turn(
          walker.heading,
          Math.atan2(player.x - walker.x, player.z - walker.z),
          Math.min(1, delta * 9),
        );
      } else if (length > 0) {
        walker.heading = turn(walker.heading, Math.atan2(dx, dz), Math.min(1, delta * 7));
      }
      const hop = greeting && !still ? Math.abs(Math.sin(time * 7 + walker.seed)) * 0.7 : 0;
      walker.bot.root.position.set(walker.x, hop, walker.z);
      walker.bot.root.rotation.y = walker.heading;
      pose(walker.bot, walker.phase, walker.gait, time, walker.seed);
    }
  });

  return (
    <>
      {walkers.map((walker, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: 주민은 순서로만 구분된다
        <primitive key={index} object={walker.bot.root} />
      ))}
    </>
  );
};

type PlayerProps = {
  city: City;
  accent: string;
  /** 걷기 모드일 때만 조작을 받는다 */
  walking: boolean;
  view: ViewId;
  still: boolean;
  positionRef: RefObject<three.Vector3>;
  destinationRef: RefObject<three.Vector3 | null>;
  /** 주민들이 서 있는 자리. 그 위로는 걸어 들어갈 수 없다 */
  crowdRef: RefObject<Spot[]>;
  /** 좁은 화면용 세로 패널인가 (서는 자리가 달라진다) */
  portrait: boolean;
  onNear: (id: DistrictId | null) => void;
};

const RADIUS = 1.1;
/** 패널을 뽑아 올리는 몸짓의 길이(초) */
const PULL_TIME = 1.3;
/** 몸짓은 웅크리는 데서 시작한다 */
const PULL_START = 0.3;
/** 점프: 한 번에 건물 두세 층 높이, 공중에서 한 번 더 뛸 수 있다 */
const JUMP_SPEED = 34;
const GRAVITY = 58;
const MAX_JUMPS = 2;
/** 이 높이까지는 발을 들어 올려 그냥 올라선다 */
const STEP_UP = 0.6;
const smooth = (from: number, to: number, value: number) => {
  const t = Math.min(1, Math.max(0, (value - from) / (to - from)));
  return t * t * (3 - 2 * t);
};
const SPEED = 19;
/**
 * 이동 키. 글자(event.key)가 아니라 자판 위치(event.code)로 받는다:
 * 한글 입력 상태에서는 W가 'ㅈ'으로 들어와 글자로는 알아볼 수 없다.
 */
const MOVE_KEYS = new Map<string, [number, number]>([
  ['KeyW', [0, 1]],
  ['ArrowUp', [0, 1]],
  ['KeyS', [0, -1]],
  ['ArrowDown', [0, -1]],
  ['KeyA', [-1, 0]],
  ['ArrowLeft', [-1, 0]],
  ['KeyD', [1, 0]],
  ['ArrowRight', [1, 0]],
]);

/** 내 캐릭터. 키보드나 바닥 클릭으로 걸어 다닌다 */
export const Player = ({
  city,
  accent,
  walking,
  view,
  still,
  positionRef,
  destinationRef,
  crowdRef,
  portrait,
  onNear,
}: PlayerProps) => {
  const build = useBotBuilder(accent);
  const bot = useMemo(() => build('#8b939c', true), [build]);
  const keys = useRef(new Set<string>());
  const marker = useRef<three.Mesh>(null);
  const burst = useRef<three.Mesh>(null);
  const ring = useRef<three.Mesh>(null);
  const state = useRef({
    heading: Math.PI,
    phase: 0,
    gait: 0,
    stuck: 0,
    /** 뽑는 몸짓: 어느 지구를, 시작한 지 몇 초째인지 */
    pullId: null as DistrictId | null,
    pullTime: PULL_TIME,
    near: null as DistrictId | null,
    /** 위아래 속도와, 땅을 떠난 뒤 뛴 횟수 */
    lift: 0,
    jumps: 0,
    /** 뛰어오르라는 요청 (키·버튼에서 들어온다) */
    jumpQueued: false,
  });
  const scratch = useMemo(
    () => ({ forward: new three.Vector3(), right: new three.Vector3(), up: new three.Vector3(0, 1, 0) }),
    [],
  );

  useEffect(() => () => bot.shell.dispose(), [bot]);

  // 처음에는 중심 광장에 선다
  useEffect(() => {
    positionRef.current.set(HUB[0], 0, HUB[1] + 4);
  }, [positionRef]);

  // 지구로 바로 이동하면 캐릭터도 슬롯 옆에 가서 뽑는다. 이미 그 사각형 안에 있다면 그대로 있는다
  useEffect(() => {
    const district = DISTRICTS.find((item) => item.id === view);
    if (!district) {
      return;
    }
    if (state.current.pullId !== district.id) {
      const [x, z] = grabSpot(district, portrait);
      positionRef.current.set(x, 0, z);
      destinationRef.current = null;
      // 가운데의 랙을 보고 선다
      state.current.heading = Math.atan2(district.x - x, district.z + RACK.front - z);
      state.current.pullId = district.id;
      state.current.pullTime = PULL_START;
    }
  }, [view, portrait, positionRef, destinationRef]);

  // 이동 키는 걷기 화면이 아닐 때도 기억해 둔다: 기억을 보다가 이동 키를 눌러
  // 걷기로 돌아오면, 누르고 있던 방향으로 곧바로 걷기 시작한다
  useEffect(() => {
    const handleDown = (event: KeyboardEvent) => {
      if (event.target instanceof Element && event.target.closest('input, textarea, select')) {
        return;
      }
      if (event.code === 'Space' && !(event.target instanceof Element && event.target.closest('a, button'))) {
        // 꾹 누르고 있을 때의 반복 입력은 치지 않는다
        if (!event.repeat) {
          state.current.jumpQueued = true;
        }
        event.preventDefault();
        return;
      }
      if (MOVE_KEYS.has(event.code)) {
        keys.current.add(event.code);
        event.preventDefault();
      }
    };
    const handleUp = (event: KeyboardEvent) => keys.current.delete(event.code);
    const handleBlur = () => keys.current.clear();
    // 화면의 점프 버튼(터치용)에서 오는 요청
    const handleJump = () => {
      state.current.jumpQueued = true;
    };
    window.addEventListener('portfolio:jump', handleJump);
    window.addEventListener('keydown', handleDown);
    window.addEventListener('keyup', handleUp);
    window.addEventListener('blur', handleBlur);
    return () => {
      window.removeEventListener('portfolio:jump', handleJump);
      window.removeEventListener('keydown', handleDown);
      window.removeEventListener('keyup', handleUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  useFrame(({ camera, clock }, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const position = positionRef.current;
    const current = state.current;
    let moveX = 0;
    let moveZ = 0;

    // 꺼내는 몸짓 중에는 조작을 받지 않는다. 먼저 랙을 보고 문을 열고, 꺼낸 뒤에는 패널 쪽으로 돌아선다
    const target = DISTRICTS.find((item) => item.id === current.pullId);
    const acting = target !== undefined && current.pullTime < PULL_TIME && !still;
    if (acting && target) {
      current.pullTime += delta;
      const [rackX, rackZ] = rackSpot(target);
      const lookX = current.pullTime < 0.9 ? rackX : target.x;
      const lookZ = current.pullTime < 0.9 ? rackZ : target.z;
      current.heading = turn(
        current.heading,
        Math.atan2(lookX - position.x, lookZ - position.z),
        Math.min(1, delta * 14),
      );
    } else if (still) {
      current.pullTime = PULL_TIME;
    }

    if (walking && !acting) {
      let inputX = 0;
      let inputY = 0;
      for (const key of keys.current) {
        const axis = MOVE_KEYS.get(key);
        if (axis) {
          inputX += axis[0];
          inputY += axis[1];
        }
      }
      if (inputX !== 0 || inputY !== 0) {
        // 키보드: 카메라가 보는 방향을 기준으로 움직인다
        destinationRef.current = null;
        camera.getWorldDirection(scratch.forward);
        scratch.forward.y = 0;
        scratch.forward.normalize();
        scratch.right.crossVectors(scratch.forward, scratch.up).normalize();
        moveX = scratch.forward.x * inputY + scratch.right.x * inputX;
        moveZ = scratch.forward.z * inputY + scratch.right.z * inputX;
      } else if (destinationRef.current) {
        // 바닥 클릭: 그 자리까지 걸어간다
        moveX = destinationRef.current.x - position.x;
        moveZ = destinationRef.current.z - position.z;
        if (Math.hypot(moveX, moveZ) < 0.9) {
          destinationRef.current = null;
          moveX = 0;
          moveZ = 0;
        }
      }
    }

    // 건물과 주민이 있는 자리로는 못 간다. 다만 이미 붙어 있는 주민에게서 멀어지는 것은 된다
    const solid = (x: number, z: number) => {
      // 지금 높이에서 발을 들어 올라설 수 있는 것보다 높은 구조물만 막는다
      if (city.blocked(x, z, RADIUS, position.y + STEP_UP)) {
        return true;
      }
      // 주민 머리 위로 뛰어넘는 중이면 부딪치지 않는다
      if (position.y > 5) {
        return false;
      }
      for (const spot of crowdRef.current) {
        // 내 캐릭터는 주민들끼리보다 가까이 지나갈 수 있다: 몸이 겹치지 않는 선에서 옆으로 비켜 간다
        const after = Math.hypot(spot.x - x, spot.z - z);
        if (after < PLAYER_GAP && after < Math.hypot(spot.x - position.x, spot.z - position.z)) {
          return true;
        }
      }
      return false;
    };

    const length = Math.hypot(moveX, moveZ);
    let moved = false;
    if (length > 0) {
      const step = SPEED * delta;
      const stepX = (moveX / length) * step;
      const stepZ = (moveZ / length) * step;
      // 막히면 막히지 않은 축으로 미끄러진다
      let movedX = false;
      let movedZ = false;
      if (Math.abs(stepX) > 1e-4 && !solid(position.x + stepX, position.z)) {
        position.x += stepX;
        movedX = true;
      }
      if (Math.abs(stepZ) > 1e-4 && !solid(position.x, position.z + stepZ)) {
        position.z += stepZ;
        movedZ = true;
      }
      // 모서리에 걸렸으면 옆으로 살짝 비켜 지나간다
      if (!movedX && !movedZ) {
        const dominantZ = Math.abs(stepZ) >= Math.abs(stepX);
        // 서 있는 주민은 둘레(GAP)가 넓어서, 그 바깥까지 살펴야 돌아갈 길이 보인다
        for (const reach of [1.2, 2.4, 3.8, 5.2]) {
          let passed = false;
          for (const side of [-1, 1]) {
            const probeX = position.x + (dominantZ ? side * reach : stepX);
            const probeZ = position.z + (dominantZ ? stepZ : side * reach);
            if (!solid(probeX, probeZ)) {
              const slide = side * step * 0.9;
              const nextX = position.x + (dominantZ ? slide : 0);
              const nextZ = position.z + (dominantZ ? 0 : slide);
              if (!solid(nextX, nextZ)) {
                position.x = nextX;
                position.z = nextZ;
                movedX = dominantZ;
                movedZ = !dominantZ;
                passed = true;
                break;
              }
            }
          }
          if (passed) {
            break;
          }
        }
      }
      moved = movedX || movedZ;
      current.heading = turn(current.heading, Math.atan2(moveX, moveZ), Math.min(1, delta * 12));
      current.stuck = moved ? 0 : current.stuck + delta;
      if (current.stuck > 0.5) {
        destinationRef.current = null;
        current.stuck = 0;
      }
    }

    // 점프와 낙하: 발밑에서 딛고 설 수 있는 가장 높은 면(바닥 또는 지붕) 위에 선다
    const ground = city.groundAt(position.x, position.z, RADIUS);
    const jumpable = walking && !acting && !still;
    if (current.jumpQueued && jumpable && (ability.flight || current.jumps < MAX_JUMPS)) {
      current.lift = JUMP_SPEED;
      current.jumps += 1;
    }
    current.jumpQueued = false;
    current.lift -= GRAVITY * delta;
    position.y += current.lift * delta;
    const airborne = position.y > ground + 0.01;
    if (!airborne) {
      position.y = ground;
      current.lift = 0;
      current.jumps = 0;
    }

    current.gait += ((moved && !airborne ? 1 : 0) - current.gait) * Math.min(1, delta * 10);
    current.phase += delta * 15 * current.gait;
    bot.root.position.set(position.x, position.y, position.z);
    bot.root.rotation.y = current.heading;
    pose(bot, current.phase, still ? 0 : current.gait, clock.elapsedTime, 0);
    // 꺼내는 몸짓: 손잡이를 잡아 문을 열고 → 꺼낸 것을 번쩍 들며 뛰어오르고 → 착지
    const time = acting ? current.pullTime : PULL_TIME;
    const crouch = smooth(0.3, 0.52, time) * (1 - smooth(0.6, 0.72, time));
    const leap = Math.sin(Math.min(1, Math.max(0, (time - 0.64) / 0.56)) * Math.PI);
    const armsUp = smooth(0.6, 0.76, time) * (1 - smooth(1.12, 1.3, time));
    bot.root.position.y = position.y + leap * 2.8;
    bot.root.scale.set(
      SCALE * (1 + crouch * 0.14 - leap * 0.06),
      SCALE * (1 - crouch * 0.24 + leap * 0.1),
      SCALE * (1 + crouch * 0.14 - leap * 0.06),
    );
    if (airborne && !acting) {
      // 공중에서는 두 팔을 들고 있다
      if (bot.parts.arm_l) {
        bot.parts.arm_l.rotation.x = -2.2;
      }
      if (bot.parts.arm_r) {
        bot.parts.arm_r.rotation.x = -2.2;
      }
    }
    if (acting) {
      // 손잡이를 잡으려 팔을 앞으로 뻗고, 꺼낸 것을 번쩍 들어 올린다
      const angle = -1.5 * crouch - 3 * armsUp;
      if (bot.parts.arm_l) {
        bot.parts.arm_l.rotation.x = angle;
      }
      if (bot.parts.arm_r) {
        bot.parts.arm_r.rotation.x = angle;
      }
      if (bot.parts.head) {
        // 뽑아 올리는 패널을 올려다본다
        bot.parts.head.rotation.x = -0.45 * armsUp + 0.3 * crouch;
        bot.parts.head.rotation.y = 0;
      }
    } else if (bot.parts.head) {
      bot.parts.head.rotation.x = 0;
    }
    if (burst.current) {
      // 힘을 주는 순간 발밑에서 퍼지는 고리
      const spread = (time - 0.64) / 0.5;
      const visible = acting && spread > 0 && spread < 1;
      burst.current.visible = visible;
      if (visible) {
        burst.current.position.set(position.x, 0.11, position.z);
        burst.current.scale.setScalar(1 + spread * 3.4);
        (burst.current.material as three.MeshBasicMaterial).opacity = 0.9 * (1 - spread);
      }
    }

    if (ring.current) {
      // 발밑 고리는 지금 서 있거나 내려앉을 면에 깔린다
      ring.current.position.set(position.x, ground + 0.09, position.z);
      ring.current.rotation.z = clock.elapsedTime * 0.6;
    }
    if (marker.current) {
      const destination = destinationRef.current;
      marker.current.visible = destination !== null;
      if (destination) {
        marker.current.position.set(destination.x, 0.1, destination.z);
        const pulse = 1 + Math.sin(clock.elapsedTime * 6) * 0.12;
        marker.current.scale.set(pulse, pulse, 1);
      }
    }

    // 지구 바닥의 사각형 안으로 들어오면 알려 준다
    let near: DistrictId | null = null;
    for (const district of DISTRICTS) {
      if (insidePad(district, position.x, position.z)) {
        near = district.id;
      }
    }
    if (near !== current.near) {
      current.near = near;
      onNear(near);
      if (near === null) {
        current.pullId = null;
      } else if (current.pullId !== near) {
        // 사각형에 들어서는 순간 랙 문이 열리고 기억이 나온다. 캐릭터는 그 자리에서 랙을 보고 받아 든다
        current.pullId = near;
        current.pullTime = PULL_START;
        destinationRef.current = null;
      }
    }
  });

  return (
    <>
      <primitive object={bot.root} />
      {/* 내 캐릭터임을 알리는 발밑 고리 */}
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.7, 3.05, 48, 1, 0, Math.PI * 1.6]} />
        <meshBasicMaterial color={accent} toneMapped={false} transparent opacity={0.9} depthWrite={false} />
      </mesh>
      <mesh ref={burst} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
        <ringGeometry args={[2.6, 3.1, 48]} />
        <meshBasicMaterial color={accent} toneMapped={false} transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh ref={marker} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
        <ringGeometry args={[1.1, 1.5, 40]} />
        <meshBasicMaterial color='#ffffff' toneMapped={false} transparent opacity={0.85} depthWrite={false} />
      </mesh>
    </>
  );
};

/** 숨겨진 비트의 개수 */
export const BIT_COUNT = 8;

/** 도시 곳곳에 숨겨진 금빛 비트. 걸어서 닿으면 모은다 */
export const Bits = ({
  city,
  collected,
  still,
  playerRef,
  onCollect,
}: {
  city: City;
  collected: number[];
  still: boolean;
  playerRef: RefObject<three.Vector3>;
  onCollect: (index: number) => void;
}) => {
  const group = useRef<three.Group>(null);
  const spots = useMemo(() => {
    // 중심에서 멀고 서로 떨어져 있으며, 걸어서 닿을 수 있는 교차점만 고른다
    const random = seededRandom(77);
    const candidates = city.nodes.filter(
      (node) => node.links.length > 0 && Math.hypot(node.x, node.z - 36) > 40 && city.reachable(node.x, node.z),
    );
    const picked: { x: number; z: number }[] = [];
    for (let attempt = 0; attempt < 400 && picked.length < BIT_COUNT && candidates.length > 0; attempt += 1) {
      const node = candidates[Math.floor(random() * candidates.length)];
      if (node && picked.every((spot) => Math.hypot(spot.x - node.x, spot.z - node.z) > 60)) {
        picked.push({ x: node.x, z: node.z });
      }
    }
    return picked;
  }, [city]);

  useFrame(({ clock }) => {
    const root = group.current;
    if (!root) {
      return;
    }
    root.children.forEach((child, index) => {
      const spot = spots[index];
      if (!spot || !child.visible) {
        return;
      }
      if (!still) {
        child.rotation.y = clock.elapsedTime * 1.4 + index;
        child.position.y = 3 + Math.sin(clock.elapsedTime * 2 + index) * 0.4;
      }
      if (Math.hypot(playerRef.current.x - spot.x, playerRef.current.z - spot.z) < 3.2) {
        onCollect(index);
      }
    });
  });

  return (
    <group ref={group}>
      {spots.map((spot, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: 비트는 자리 순서로 구분된다
        <group key={index} position={[spot.x, 3, spot.z]} visible={!collected.includes(index)}>
          <mesh castShadow>
            <octahedronGeometry args={[1.25, 0]} />
            <meshPhysicalMaterial
              color='#e2b85c'
              metalness={1}
              roughness={0.18}
              emissive='#6b4a12'
              emissiveIntensity={0.9}
            />
          </mesh>
          <pointLight color='#ffd27a' intensity={60} distance={18} decay={1.8} />
        </group>
      ))}
    </group>
  );
};

useGLTF.preload(BOT_URL);
