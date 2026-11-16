'use client';

import { Environment, useGLTF } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import * as three from 'three';
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
import { createSilk } from '@/widgets/portfolio/mainboard/silk';
import { createLabelTexture } from '@/widgets/portfolio/mainboard/textures';

/** 접근 카드가 꽂히는 자리: 포트폴리오와 같은 도시의, 중심 광장 북쪽 빈터 */
const SITE: [number, number] = [0, 18];
const CARD = { width: 12, height: 16.5 };
/** 꽂혀 있을 때 슬롯 밖으로 나와 있는 높이 */
const TAB = 3.3;
const FLAT: [number, number, number] = [-Math.PI / 2, 0, 0];

export type AuthSceneProps = {
  /** 카드에 찍히는 글씨 (예: LOGIN) */
  label: string;
  accent: string;
  compact: boolean;
  still: boolean;
  /** 비밀번호를 입력하는 중: 꼬마가 등을 돌린다 */
  shy: boolean;
  /** 입력칸에 들어와 있는 중: 카드가 더 솟는다 */
  active: boolean;
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

/** 접근 카드 앞면: 이름, 용도, 금색 접점 */
const createPassFace = (label: string, accent: string) =>
  createLabelTexture({
    width: 600,
    height: 825,
    background: '#06090c',
    draw: (c, fonts) => {
      c.textBaseline = 'top';
      c.font = `500 30px ${fonts.mono}`;
      c.fillStyle = accent;
      c.fillText('ACCESS', 52, 56);
      c.fillStyle = '#7f8a95';
      c.textAlign = 'right';
      c.fillText('I/O', 548, 56);
      c.textAlign = 'left';
      c.font = `700 104px ${fonts.display}`;
      c.fillStyle = '#eef2f5';
      c.fillText('AYAAN', 46, 250);
      c.font = `700 64px ${fonts.display}`;
      c.fillStyle = accent;
      c.fillText(label, 50, 380);
      // 금색 접점
      c.fillStyle = '#d8b05a';
      for (let index = 0; index < 8; index += 1) {
        c.fillRect(52 + index * 62, 690, 44, 84);
      }
    },
  });

const Pass = ({
  label,
  accent,
  raised,
  boosted,
  still,
  fonts,
}: {
  label: string;
  accent: string;
  raised: boolean;
  boosted: boolean;
  still: boolean;
  fonts: number;
}) => {
  const body = useRef<three.Group>(null);
  const latch = useRef<three.Mesh>(null);
  const motion = useRef({ value: 0, velocity: 0, boost: 0 });
  // biome-ignore lint/correctness/useExhaustiveDependencies: 글꼴이 준비되면 글씨를 다시 그린다
  const face = useMemo(() => createPassFace(label, accent), [label, accent, fonts]);
  useEffect(() => () => face.dispose(), [face]);
  const materials = useMemo(
    () => ({
      frame: new three.MeshStandardMaterial({ color: '#0d1014', metalness: 0.8, roughness: 0.42 }),
      gold: new three.MeshPhysicalMaterial({ color: '#d8b05a', metalness: 1, roughness: 0.22 }),
      glow: new three.MeshBasicMaterial({ color: new three.Color(accent).multiplyScalar(1.9), toneMapped: false }),
    }),
    [accent],
  );
  useEffect(
    () => () => {
      for (const material of Object.values(materials)) {
        material.dispose();
      }
    },
    [materials],
  );
  const drop = CARD.height - TAB;

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const state = motion.current;
    const target = raised ? 1 : 0;
    if (still) {
      state.value = target;
      state.velocity = 0;
    } else {
      state.velocity += ((target - state.value) * 80 - state.velocity * 10.5) * delta;
      state.value += state.velocity * delta;
    }
    state.boost += ((boosted ? 1 : 0) - state.boost) * (still ? 1 : Math.min(1, delta * 10));
    if (body.current) {
      body.current.position.y = -(1 - state.value) * drop + state.boost * 1.6;
    }
    if (latch.current) {
      latch.current.scale.y = 1 + Math.min(1, Math.abs(state.velocity) * 0.6) * 5 + state.boost * 2;
    }
  });

  return (
    <group>
      <mesh position={[0, 0.8, -0.3]} material={materials.frame} castShadow receiveShadow>
        <boxGeometry args={[CARD.width + 2.4, 1.6, 3.4]} />
      </mesh>
      <mesh position={[0, 1.62, -0.3]} material={materials.gold}>
        <boxGeometry args={[CARD.width + 0.4, 0.06, 1.2]} />
      </mesh>
      <mesh ref={latch} position={[0, 0.8, 1.42]} material={materials.glow}>
        <boxGeometry args={[CARD.width + 1.6, 0.12, 0.06]} />
      </mesh>
      <group ref={body}>
        <mesh position={[0, 1.6 + CARD.height / 2, -0.3]} material={materials.frame} castShadow>
          <boxGeometry args={[CARD.width + 0.6, CARD.height + 0.6, 0.6]} />
        </mesh>
        <mesh position={[0, 1.6 + CARD.height + 0.45, -0.2]} material={materials.glow}>
          <boxGeometry args={[CARD.width + 0.6, 0.12, 0.2]} />
        </mesh>
        <mesh position={[0, 1.6 + CARD.height / 2, 0.02]}>
          <planeGeometry args={[CARD.width, CARD.height]} />
          <meshBasicMaterial map={face} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
};

/** 슬롯을 지키는 꼬마. 비밀번호를 입력하는 동안에는 등을 돌리고 있는다 */
const Keeper = ({
  x,
  shy,
  active,
  still,
  accent,
}: {
  x: number;
  shy: boolean;
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
    // 평소에는 화면 쪽을, 비밀번호를 칠 때는 반대쪽을 본다
    const target = shy ? Math.PI : active ? 0.15 : 0.5;
    current.heading = turn(current.heading, target, Math.min(1, delta * 7));
    current.hop += ((active && !shy ? 1 : 0) - current.hop) * Math.min(1, delta * 8);
    const bounce = still ? 0 : Math.abs(Math.sin(clock.elapsedTime * 5)) * 0.35 * current.hop;
    bot.root.position.set(x, bounce, 5);
    bot.root.rotation.y = current.heading;
    pose(bot, 0, 0, still ? 0 : clock.elapsedTime, 0);
  });

  return <primitive object={bot.root} />;
};

const Scene = ({ label, accent, compact, still, shy, active }: AuthSceneProps) => {
  const world = useWorldMaterials(accent);
  const fonts = useFontsReady();
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);
  const [raised, setRaised] = useState(still);
  // 꼬마는 카드 오른쪽, 입력 면과 카드 사이에 선다
  const keeperX = CARD.width / 2 + 5.5;

  // 포트폴리오와 같은 도시. 주민은 슬롯을 가로지르는 길로는 다니지 않는다
  const city = useMemo(() => {
    const base = createCity(compact);
    const blocked = (a: { x: number; z: number }, b: { x: number; z: number }) =>
      Math.min(a.x, b.x) < SITE[0] + 20 &&
      Math.max(a.x, b.x) > SITE[0] - 20 &&
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
  }, [compact]);
  const keeperSpot = useMemo(() => new three.Vector3(SITE[0] + keeperX, 0, SITE[1] + 5), [keeperX]);
  const keeperRef = useRef(keeperSpot);
  keeperRef.current = keeperSpot;
  const crowdRef = useRef<Spot[]>([]);
  const focus = useRef(new three.Vector3(SITE[0], 8, SITE[1]));

  useEffect(
    () => () => {
      for (const material of Object.values(world)) {
        material.dispose();
      }
    },
    [world],
  );

  // 들어오면 잠깐 뒤에 카드가 슬롯에서 솟아오른다
  useEffect(() => {
    if (still) {
      setRaised(true);
      return;
    }
    const timer = window.setTimeout(() => setRaised(true), 600);
    return () => window.clearTimeout(timer);
  }, [still]);

  // 넓은 화면에서는 오른쪽에 입력 면이 놓이므로 카드를 왼쪽에 둔다
  useEffect(() => {
    const aspect = size.width / Math.max(1, size.height);
    const view = camera as three.PerspectiveCamera;
    // 좁은 화면은 시야를 넓혀 가까이 다가가고, 아래쪽 입력 면에 가려지지 않게 카드를 위쪽에 둔다
    view.fov = compact ? 50 : 32;
    view.updateProjectionMatrix();
    if (compact) {
      const distance = Math.max(34, 15 / (Math.tan(three.MathUtils.degToRad(25)) * aspect));
      camera.position.set(SITE[0] + 3, distance * 0.3 + 4, SITE[1] + distance * 0.95);
      camera.lookAt(SITE[0] + 3, -11.5, SITE[1]);
    } else {
      camera.position.set(SITE[0] + 2, 70 * 0.26 + 4, SITE[1] + 70 * 0.96);
      camera.lookAt(SITE[0] + 12, 7, SITE[1]);
    }
  }, [camera, size, compact]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: 글꼴이 준비되면 글씨를 다시 그린다
  const silk = useMemo(
    () =>
      createSilk(28, 7, 28, (pen) => {
        pen.text('I/O', 1.2, 3.4, 3, { font: 'display' });
        pen.text('ACCESS PORT', 9.5, 2.5, 1.2, { alpha: 0.65 });
        pen.text('SLOT 01', 9.5, 4.5, 1.2, { alpha: 0.65 });
      }),
    [fonts],
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

      <Floor fonts={fonts} onGround={() => undefined} />
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

      <group position={[SITE[0], 0, SITE[1]]}>
        <mesh position={[0, 0.05, 9]} rotation={FLAT} raycast={() => null}>
          <planeGeometry args={[28, 7]} />
          <meshBasicMaterial map={silk} color='#f1f4f7' transparent depthWrite={false} />
        </mesh>
        <Pass label={label} accent={accent} raised={raised} boosted={active} still={still} fonts={fonts} />
        <Suspense fallback={null}>
          <Keeper x={keeperX} shy={shy} active={active} still={still} accent={accent} />
        </Suspense>
      </group>

      <Effects compact={compact} world='die' walking focusRef={focus} />
    </>
  );
};

/**
 * 로그인·회원가입의 배경 장면: 포트폴리오와 같은 칩 안 도시.
 * 슬롯에서 접근 카드가 솟아오르고, 꼬마가 입력에 반응한다.
 */
export default function AuthScene(props: AuthSceneProps) {
  return (
    <Canvas
      shadows
      dpr={props.compact ? [1, 1.5] : [1, 1.75]}
      camera={{ fov: 32, near: 1, far: 1800 }}
      gl={{ antialias: true, alpha: false, toneMapping: three.NoToneMapping, powerPreference: 'high-performance' }}
    >
      <Scene {...props} />
    </Canvas>
  );
}

useGLTF.preload('/portfolio/bot.glb');
