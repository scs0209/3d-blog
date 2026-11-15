'use client';

import { Environment, useGLTF } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import * as three from 'three';
import type { PostResponse } from '@/entities/post/model/post';
import { formatDateToYMD } from '@/shared/utils';
import { Effects } from '@/widgets/portfolio/mainboard/ChipCanvas';
import { Citizens, pose, type Spot, turn, useBotBuilder } from '@/widgets/portfolio/mainboard/Citizens';
import { createCity } from '@/widgets/portfolio/mainboard/city';
import {
  Avenues,
  BondWires,
  City,
  Floor,
  Shell,
  useMaterials as useWorldMaterials,
} from '@/widgets/portfolio/mainboard/DieWorld';
import { wrap } from '@/widgets/portfolio/mainboard/panels';
import { createSilk } from '@/widgets/portfolio/mainboard/silk';
import { createLabelTexture } from '@/widgets/portfolio/mainboard/textures';

/** 슬롯 줄이 놓이는 자리: 포트폴리오와 같은 도시의, 중심 광장 바로 북쪽 빈터 */
const SITE: [number, number] = [0, 18];
const CARD = { width: 10.4, height: 13.6, gap: 1.8 };
/** 꽂혀 있을 때 슬롯 밖으로 나와 있는 높이 */
const TAB = 3.3;
/** 장면에 꽂는 카드 수 */
export const rackSize = (compact: boolean) => (compact ? 2 : 4);
const FLAT: [number, number, number] = [-Math.PI / 2, 0, 0];

type RackProps = {
  posts: PostResponse[];
  /** 좁은 화면: 카드 수를 줄이고 더 멀리서 본다 */
  compact: boolean;
  still: boolean;
  /** 조명 색. 포트폴리오에서 이번 방문에 쓰인 색과 같다 */
  accent: string;
  onOpen: (post: PostResponse) => void;
};

const useFontsReady = () => {
  const [ready, setReady] = useState(0);
  useEffect(() => {
    let alive = true;
    document.fonts.ready.then(() => {
      if (alive) {
        setReady(1);
      }
    });
    return () => {
      alive = false;
    };
  }, []);
  return ready;
};

/** 카드 앞면: 번호 · 분류 · 제목 · 날짜. 포트폴리오의 패널과 같은 표기 */
const createCardFace = (post: PostResponse, index: number, accent: string) =>
  createLabelTexture({
    width: 516,
    height: 696,
    background: '#06090c',
    draw: (c, fonts) => {
      c.textBaseline = 'top';
      c.font = `500 26px ${fonts.mono}`;
      c.fillStyle = accent;
      c.fillText(String(index + 1).padStart(2, '0'), 40, 44);
      c.fillStyle = '#7f8a95';
      c.textAlign = 'right';
      c.fillText((post.category?.name ?? '').toUpperCase().slice(0, 14), 476, 44);
      c.textAlign = 'left';
      c.font = `700 50px ${fonts.display}, ${fonts.sans}`;
      c.fillStyle = '#eef2f5';
      let y = 190;
      for (const line of wrap(c, post.title ?? '', 436).slice(0, 6)) {
        c.fillText(line, 40, y);
        y += 66;
      }
      c.font = `500 24px ${fonts.mono}`;
      c.fillStyle = '#7f8a95';
      c.fillText(formatDateToYMD(post.createdAt ?? ''), 40, 626);
    },
  });

const Card = ({
  post,
  index,
  x,
  raised,
  boosted,
  still,
  fonts,
  accent,
  materials,
  onHover,
  onOpen,
}: {
  post: PostResponse;
  index: number;
  x: number;
  /** 슬롯에서 뽑혀 올라와 있는가 */
  raised: boolean;
  /** 가리키고 있는 카드는 조금 더 솟고 앞으로 나온다 */
  boosted: boolean;
  still: boolean;
  fonts: number;
  accent: string;
  materials: Materials;
  onHover: (index: number | null) => void;
  onOpen: () => void;
}) => {
  const body = useRef<three.Group>(null);
  const latch = useRef<three.Mesh>(null);
  const motion = useRef({ value: 0, velocity: 0, boost: 0 });
  // biome-ignore lint/correctness/useExhaustiveDependencies: 글꼴이 준비되면 글씨를 다시 그린다
  const face = useMemo(() => createCardFace(post, index, accent), [post, index, accent, fonts]);
  useEffect(() => () => face.dispose(), [face]);
  const drop = CARD.height - TAB;

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const state = motion.current;
    const target = raised ? 1 : 0;
    if (still) {
      state.value = target;
      state.velocity = 0;
    } else {
      // 뽑을 때는 살짝 튀어 오르고, 넣을 때는 툭 떨어진다
      const stiffness = target === 1 ? 90 : 130;
      const damping = target === 1 ? 11 : 22;
      state.velocity += ((target - state.value) * stiffness - state.velocity * damping) * delta;
      state.value += state.velocity * delta;
    }
    state.boost += ((boosted ? 1 : 0) - state.boost) * (still ? 1 : Math.min(1, delta * 12));
    if (body.current) {
      body.current.position.y = -(1 - state.value) * drop + state.boost * 1.3;
      body.current.position.z = state.boost * 0.9;
    }
    if (latch.current) {
      latch.current.scale.y = 1 + Math.min(1, Math.abs(state.velocity) * 0.6) * 5;
    }
  });

  return (
    <group position={[x, 0, 0]}>
      {/* 슬롯 */}
      <mesh position={[0, 0.7, -0.3]} material={materials.frame} castShadow receiveShadow>
        <boxGeometry args={[CARD.width + 1.1, 1.4, 2.6]} />
      </mesh>
      <mesh position={[0, 1.42, -0.3]} material={materials.gold}>
        <boxGeometry args={[CARD.width + 0.2, 0.06, 1]} />
      </mesh>
      <mesh ref={latch} position={[0, 0.72, 1.02]} material={materials.glow}>
        <boxGeometry args={[CARD.width + 0.6, 0.1, 0.06]} />
      </mesh>
      {/* 카드 */}
      <group ref={body}>
        <mesh position={[0, 1.4 + CARD.height / 2, -0.3]} material={materials.frame} castShadow>
          <boxGeometry args={[CARD.width + 0.5, CARD.height + 0.5, 0.5]} />
        </mesh>
        <mesh position={[0, 1.4 + CARD.height + 0.4, -0.2]} material={materials.glow}>
          <boxGeometry args={[CARD.width + 0.5, 0.1, 0.2]} />
        </mesh>
        {/* biome-ignore lint/a11y/noStaticElementInteractions: 3D 메시이며, 같은 글은 화면 밖 링크 목록으로도 열 수 있다 */}
        <mesh
          position={[0, 1.4 + CARD.height / 2, -0.04]}
          onPointerOver={(event) => {
            event.stopPropagation();
            onHover(index);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            onHover(null);
            document.body.style.cursor = '';
          }}
          onClick={(event) => {
            event.stopPropagation();
            onOpen();
          }}
        >
          <planeGeometry args={[CARD.width, CARD.height]} />
          <meshBasicMaterial map={face} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
};

const useMaterials = (accent: string) =>
  useMemo(
    () => ({
      frame: new three.MeshStandardMaterial({ color: '#0d1014', metalness: 0.8, roughness: 0.42 }),
      gold: new three.MeshPhysicalMaterial({ color: '#d8b05a', metalness: 1, roughness: 0.22 }),
      glow: new three.MeshBasicMaterial({ color: new three.Color(accent).multiplyScalar(1.9), toneMapped: false }),
    }),
    [accent],
  );

type Materials = ReturnType<typeof useMaterials>;

/** 슬롯 옆에 서서, 가리킨 카드를 쳐다보는 꼬마 */
const Keeper = ({
  x,
  z,
  lookX,
  active,
  still,
  accent,
}: {
  x: number;
  z: number;
  lookX: number | null;
  active: boolean;
  still: boolean;
  accent: string;
}) => {
  const build = useBotBuilder(accent);
  const bot = useMemo(() => build('#8b939c', true), [build]);
  const state = useRef({ heading: 0.5, hop: 0 });
  useEffect(() => () => bot.shell.dispose(), [bot]);

  useFrame(({ clock }, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const current = state.current;
    const target = lookX === null ? 0.45 : Math.atan2(lookX - x, -4);
    current.heading = turn(current.heading, target, Math.min(1, delta * 6));
    current.hop += ((active ? 1 : 0) - current.hop) * Math.min(1, delta * 8);
    const bounce = still ? 0 : Math.abs(Math.sin(clock.elapsedTime * 6)) * 0.5 * current.hop;
    bot.root.position.set(x, bounce, z);
    bot.root.rotation.y = current.heading;
    pose(bot, 0, 0, still ? 0 : clock.elapsedTime, 0);
  });

  return <primitive object={bot.root} />;
};

const Scene = ({ posts, compact, still, accent, onOpen }: RackProps) => {
  const materials = useMaterials(accent);
  const world = useWorldMaterials(accent);
  const fonts = useFontsReady();
  const [hovered, setHovered] = useState<number | null>(null);
  /** 터치에서는 한 번 누르면 솟고, 다시 누르면 연다 */
  const [picked, setPicked] = useState<number | null>(null);
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);
  const shown = posts.slice(0, rackSize(compact));
  /** 들어올 때 카드가 한 장씩 차례로 뽑혀 올라온다 */
  const [risen, setRisen] = useState(still ? shown.length : 0);
  const span = shown.length * CARD.width + (shown.length - 1) * CARD.gap;
  const first = -span / 2 + CARD.width / 2;
  const active = hovered ?? picked;
  // 넓은 화면에서는 카드 줄 왼쪽 옆, 좁은 화면에서는 폭을 아끼려고 카드 앞에 선다
  const keeperX = compact ? first - 1.5 : first - CARD.width / 2 - 4.5;
  const keeperZ = compact ? 8.5 : 4;

  // 포트폴리오와 같은 도시. 주민은 슬롯 줄을 가로지르는 길로는 다니지 않는다
  const city = useMemo(() => {
    const base = createCity(compact);
    const blocked = (a: { x: number; z: number }, b: { x: number; z: number }) =>
      Math.min(a.x, b.x) < SITE[0] + span / 2 + 12 &&
      Math.max(a.x, b.x) > SITE[0] - span / 2 - 12 &&
      Math.min(a.z, b.z) < SITE[1] + 10 &&
      Math.max(a.z, b.z) > SITE[1] - 8;
    const nodes = base.nodes.map((node) => ({
      ...node,
      links: node.links.filter((link) => {
        const other = base.nodes[link];
        return other ? !blocked(node, other) : false;
      }),
    }));
    return { ...base, nodes };
  }, [compact, span]);
  // 주민은 슬롯 옆의 꼬마를 내 캐릭터처럼 여기고, 지나가다 인사한다
  const keeperSpot = useMemo(() => new three.Vector3(SITE[0] + keeperX, 0, SITE[1] + keeperZ), [keeperX, keeperZ]);
  const keeperRef = useRef(keeperSpot);
  keeperRef.current = keeperSpot;
  const crowdRef = useRef<Spot[]>([]);
  const focus = useRef(new three.Vector3(SITE[0], 6, SITE[1]));

  useEffect(
    () => () => {
      for (const material of [...Object.values(materials), ...Object.values(world)]) {
        material.dispose();
      }
      document.body.style.cursor = '';
    },
    [materials, world],
  );

  useEffect(() => {
    if (risen >= shown.length) {
      return;
    }
    const timer = window.setTimeout(() => setRisen((count) => count + 1), still ? 0 : risen === 0 ? 700 : 170);
    return () => window.clearTimeout(timer);
  }, [risen, shown.length, still]);

  // 카드 줄과 꼬마가 화면 폭에 들어오도록 거리를 맞춘다. 화면 아래쪽은 제목이 차지하므로 줄을 위쪽에 둔다
  useEffect(() => {
    const aspect = size.width / Math.max(1, size.height);
    const view = camera as three.PerspectiveCamera;
    // 좁은 화면은 시야를 넓혀 가까이 다가간다: 카드가 화면 폭을 채우고, 앞쪽 건물이 끼어들지 않는다
    view.fov = compact ? 50 : 32;
    view.updateProjectionMatrix();
    const tangent = Math.tan(three.MathUtils.degToRad(view.fov / 2));
    if (compact) {
      const distance = Math.max(36, (span / 2 + 2.2) / (tangent * aspect));
      camera.position.set(SITE[0], distance * 0.36 + 3, SITE[1] + distance * 0.93);
      camera.lookAt(SITE[0], 2.5, SITE[1]);
    } else {
      const distance = Math.max(38, (span / 2 + 10) / (tangent * aspect * 0.8));
      camera.position.set(SITE[0] + distance * 0.2, distance * 0.34 + 3, SITE[1] + distance * 0.94);
      camera.lookAt(SITE[0] + 8, 0.5, SITE[1]);
    }
  }, [camera, size, span, compact]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: 글꼴이 준비되면 글씨를 다시 그린다
  const silk = useMemo(
    () =>
      createSilk(span + 14, 9, 28, (pen) => {
        pen.text('LOG', 2.4, 4.6, 3.4, { font: 'display' });
        pen.text('RECENT ENTRIES', 12.5, 3.6, 1.2, { alpha: 0.65 });
        pen.text(`SLOT 01–${String(shown.length).padStart(2, '0')}`, 12.5, 5.6, 1.2, { alpha: 0.65 });
      }),
    [span, shown.length, fonts],
  );
  useEffect(() => () => silk.dispose(), [silk]);

  return (
    <>
      <color attach='background' args={['#050608']} />
      <fog attach='fog' args={['#050608', 200, 620]} />
      <hemisphereLight args={['#c9d8ff', '#0a0c10', 0.75]} />
      <directionalLight
        position={[70, 150, 90]}
        intensity={3}
        color='#f4f7ff'
        castShadow
        shadow-mapSize={compact ? [1024, 1024] : [2048, 2048]}
        shadow-camera-left={-190}
        shadow-camera-right={190}
        shadow-camera-top={190}
        shadow-camera-bottom={-190}
        shadow-camera-near={20}
        shadow-camera-far={420}
        shadow-bias={-0.0006}
        shadow-normalBias={0.3}
      />
      <directionalLight position={[-120, 60, -140]} intensity={1.1} color='#9cc8ff' />
      <pointLight position={[SITE[0], 20, SITE[1] + 14]} color={accent} intensity={1400} distance={110} decay={1.6} />
      <pointLight position={[SITE[0], 26, SITE[1] - 40]} color={accent} intensity={700} distance={120} decay={1.6} />
      <Suspense fallback={null}>
        <Environment files='/portfolio/studio.hdr' environmentIntensity={0.9} />
      </Suspense>

      {/* 도시: 포트폴리오의 칩 안과 같은 블록·길·벽 */}
      {/* 바닥은 포트폴리오의 다이 표면 그대로. 누르면 솟아 있던 카드를 도로 내린다 */}
      <Floor fonts={fonts} onGround={() => setPicked(null)} />
      <City m={world} city={city} />
      <Avenues m={world} still={still} />
      <BondWires m={world} />
      <Shell m={world} />
      <Suspense fallback={null}>
        <Citizens
          city={city}
          accent={accent}
          count={compact ? 12 : 26}
          still={still}
          playerRef={keeperRef}
          crowdRef={crowdRef}
        />
      </Suspense>

      {/* 슬롯 줄 */}
      <group position={[SITE[0], 0, SITE[1]]}>
        <mesh position={[0, 0.05, 9]} rotation={FLAT} raycast={() => null}>
          <planeGeometry args={[span + 14, 9]} />
          <meshBasicMaterial map={silk} color='#f1f4f7' transparent depthWrite={false} />
        </mesh>
        {shown.map((post, index) => (
          <Card
            key={post.id ?? post.slug ?? index}
            post={post}
            index={index}
            x={first + index * (CARD.width + CARD.gap)}
            raised={index < risen}
            boosted={active === index}
            still={still}
            fonts={fonts}
            accent={accent}
            materials={materials}
            onHover={setHovered}
            onOpen={() => {
              // 마우스로 가리킨 카드는 바로 열고, 터치는 먼저 솟게 한 뒤 다시 눌러 연다
              if (hovered === index || picked === index) {
                onOpen(post);
              } else {
                setPicked(index);
              }
            }}
          />
        ))}
        <Suspense fallback={null}>
          <Keeper
            x={keeperX}
            z={keeperZ}
            lookX={active === null ? null : first + active * (CARD.width + CARD.gap)}
            active={active !== null}
            still={still}
            accent={accent}
          />
        </Suspense>
      </group>

      <Effects compact={compact} world='die' walking focusRef={focus} />
    </>
  );
};

/**
 * 블로그 첫 화면의 장면: 최근 글이 슬롯에 꽂힌 카드로 놓여 있고,
 * 가리키면 포트폴리오의 패널처럼 슬롯에서 뽑혀 올라온다.
 */
export default function LogRack(props: RackProps) {
  return (
    <Canvas
      shadows
      dpr={props.compact ? [1, 1.5] : [1, 1.75]}
      camera={{ fov: 32, near: 1, far: 1800 }}
      gl={{ antialias: true, alpha: false, toneMapping: three.NoToneMapping, powerPreference: 'high-performance' }}
      style={{ touchAction: 'pan-y' }}
    >
      <Scene {...props} />
    </Canvas>
  );
}

useGLTF.preload('/portfolio/bot.glb');
