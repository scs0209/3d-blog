'use client';

import { Environment, OrbitControls } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Bloom, DepthOfField, EffectComposer, N8AO, Noise, ToneMapping, Vignette } from '@react-three/postprocessing';
import { type ComponentRef, type RefObject, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import * as three from 'three';
import { Board } from './Board';
import { DieWorld } from './DieWorld';
import { DISTRICTS, type DistrictId, insidePad, panelSize, type ViewId } from './district';
import { PARTS } from './layout';

/** 지금 어느 세계에 있는가: 보드 위(칩 바깥) 또는 칩 안 */
export type World = 'board' | 'die';

/** 카메라가 향할 곳. 새 객체를 넘길 때마다 그곳으로 날아간다 */
export type Shot = {
  kind: 'board' | 'dive' | 'walk' | ViewId;
  /** 장면이 바뀐 직후 카메라를 어디에 놓고 시작할지 */
  from?: 'sky' | 'lid';
};

type ChipCanvasProps = {
  world: World;
  shot: Shot;
  accent: string;
  still: boolean;
  compact: boolean;
  onEnter: () => void;
  onSelect: (id: ViewId) => void;
  onNear: (id: DistrictId | null) => void;
  collected: number[];
  onCollect: (index: number) => void;
  /** 걷기 화면의 시야 거리: 0 가까이, 1 보통, 2 멀리 */
  zoom: number;
};

/** 시야 거리 단계별 배율. 가까이(미니어처 접사)에서 멀리(주변 지구가 함께 보이는 거리)까지 */
export const ZOOM_SCALE = [1, 1.9, 3.3] as const;

const UP = new three.Vector3(0, 1, 0);
const FOV = 32;
const smoothstep = (from: number, to: number, value: number) => {
  const t = Math.min(1, Math.max(0, (value - from) / (to - from)));
  return t * t * (3 - 2 * t);
};
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

type Flight = {
  fromPosition: three.Vector3;
  fromTarget: three.Vector3;
  toPosition: three.Vector3;
  toTarget: three.Vector3;
  t: number;
  duration: number;
  lift: number;
};

/**
 * 카메라. 평소에는 사용자가 드래그·휠로 자유롭게 움직이고,
 * 목적지가 정해지면 그곳까지 날아간 뒤 다시 조작을 돌려준다.
 */
const Rig = ({
  world,
  shot,
  still,
  compact,
  zoom,
  focusRef,
  playerRef,
}: Pick<ChipCanvasProps, 'world' | 'shot' | 'still' | 'compact' | 'zoom'> & {
  focusRef: RefObject<three.Vector3>;
  playerRef: RefObject<three.Vector3>;
}) => {
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);
  const controls = useRef<ComponentRef<typeof OrbitControls>>(null);
  const flight = useRef<Flight | null>(null);
  const first = useRef(true);
  const touched = useRef(false);
  /** 고른 시야 거리 단계와, 그 단계로 옮겨 가는 중일 때의 목표 거리 */
  const zoomRef = useRef(zoom);
  const zoomGoal = useRef<number | null>(null);
  useEffect(() => {
    if (zoomRef.current === zoom) {
      return;
    }
    zoomRef.current = zoom;
    const base = compact ? Math.hypot(31.5, 40) : Math.hypot(16.5, 27);
    zoomGoal.current = base * (ZOOM_SCALE[zoom] ?? 1);
  }, [zoom, compact]);
  /** 시야각의 목표. 좁은 화면의 전체 보기에서만 넓힌다 */
  const fovTarget = useRef(FOV);
  const follow = useMemo(() => new three.Vector3(), []);
  const aspect = size.width / Math.max(1, size.height);
  const aspectRef = useRef(aspect);
  aspectRef.current = aspect;

  useEffect(() => {
    const orbit = controls.current;
    if (!orbit) {
      return;
    }
    const cpu = PARTS.cpu;
    const toPosition = new three.Vector3();
    const toTarget = new three.Vector3();
    let duration = 2;
    let lift = 0;

    if (shot.kind === 'board') {
      toTarget.set(cpu.x, 1.2, cpu.z);
      toPosition.set(cpu.x + (compact ? 30 : 36), compact ? 64 : 34, cpu.z + (compact ? 76 : 54));
      duration = 2.2;
    } else if (shot.kind === 'dive') {
      toTarget.set(cpu.x, 2.4, cpu.z);
      toPosition.set(cpu.x + 0.4, 12.5, cpu.z + 1.4);
      duration = 1.5;
    } else if (shot.kind === 'walk') {
      // 내 캐릭터의 뒤 위쪽에서 내려다본다
      const player = playerRef.current;
      toTarget.set(player.x, 2.5, player.z);
      const scale = ZOOM_SCALE[zoomRef.current] ?? 1;
      toPosition.set(player.x, 2.5 + ((compact ? 34 : 19) - 2.5) * scale, player.z + (compact ? 40 : 27) * scale);
      duration = 1.8;
    } else if (shot.kind === 'overview') {
      if (compact) {
        // 세로로 긴 화면: 물러나는 것만으로는 좌우 지구가 들어오지 않는다.
        // 높이 올라가 내려다보고, 시야도 넓혀(아래 fovTarget) 다섯 지구를 모두 담는다
        toTarget.set(0, 0, -4);
        toPosition.set(0, 236, 172);
      } else {
        toTarget.set(0, 6, 8);
        // 화면이 좁을수록 더 물러나 다섯 지구가 모두 들어오게 한다
        const back = Math.min(1.45, Math.max(1, 1.7 / aspectRef.current));
        toPosition.set(0, 122 * back, 204 * back);
      }
      duration = 2.4;
    } else {
      const district = DISTRICTS.find((item) => item.id === shot.kind);
      const panel = panelSize(compact);
      const tangent = Math.tan(three.MathUtils.degToRad(FOV / 2));
      const distance = Math.max(
        (panel.height * 1.42) / (2 * tangent),
        // 좁은 화면에서는 패널이 화면 폭을 거의 채우도록 다가간다
        (panel.width * (compact ? 1.05 : 1.3)) / (2 * tangent * aspectRef.current),
      );
      // 정면이 아니라 살짝 비껴 서서, 패널 뒤의 기념물과 도시가 함께 보이게 한다
      const side = compact ? 0 : (district && district.x > 0 ? -1 : 1) * distance * 0.3;
      toTarget.set(district?.x ?? 0, panel.centre + (compact ? 0 : 2.5), district?.z ?? 0);
      toPosition.set((district?.x ?? 0) + side, panel.centre + distance * 0.16, (district?.z ?? 0) + distance * 0.95);
      duration = 2;
      lift = 16;
    }

    if (shot.from === 'sky') {
      camera.position.set(0, 262, 30);
      orbit.target.set(0, 0, 0);
      duration = 3.2;
    }
    if (shot.from === 'lid') {
      camera.position.set(cpu.x + 0.4, 12.5, cpu.z + 1.4);
      orbit.target.set(cpu.x, 2.4, cpu.z);
    }
    touched.current = false;
    fovTarget.current = compact && shot.kind === 'overview' ? 76 : FOV;

    if (first.current || still) {
      first.current = false;
      camera.position.copy(toPosition);
      orbit.target.copy(toTarget);
      camera.lookAt(toTarget);
      flight.current = null;
      orbit.enabled = true;
      orbit.update();
      return;
    }
    flight.current = {
      fromPosition: camera.position.clone(),
      fromTarget: orbit.target.clone(),
      toPosition,
      toTarget,
      t: 0,
      duration,
      lift,
    };
    orbit.enabled = false;
  }, [shot, compact, still, camera, playerRef]);

  useFrame((_, delta) => {
    const orbit = controls.current;
    if (!orbit) {
      return;
    }
    // 시야각은 목표를 향해 부드럽게 바뀐다
    const view = camera as three.PerspectiveCamera;
    if (Math.abs(view.fov - fovTarget.current) > 0.05) {
      view.fov += (fovTarget.current - view.fov) * (still ? 1 : Math.min(1, delta * 3.5));
      view.updateProjectionMatrix();
    }
    const current = flight.current;
    if (current) {
      // 프레임이 느린 기기에서도 이동이 늘어지지 않도록, 한 프레임에 0.25초까지는 그대로 반영한다
      current.t = Math.min(1, current.t + Math.min(delta, 0.25) / current.duration);
      const eased = easeInOut(current.t);
      camera.position.lerpVectors(current.fromPosition, current.toPosition, eased);
      camera.position.y += Math.sin(Math.PI * eased) * current.lift;
      orbit.target.lerpVectors(current.fromTarget, current.toTarget, eased);
      camera.lookAt(orbit.target);
      if (current.t >= 1) {
        flight.current = null;
        orbit.enabled = true;
        orbit.update();
      }
    }
    // 걷는 동안에는 시점이 캐릭터를 따라간다. 돌려 둔 각도와 거리는 그대로 유지된다
    if (shot.kind === 'walk' && world === 'die' && !current) {
      const player = playerRef.current;
      follow.set(player.x, 2.5 + player.y * 0.85, player.z);
      // 지구의 사각형 안에서는 올라오는 패널이 함께 보이도록 시선을 패널 쪽으로 옮긴다
      const pad = DISTRICTS.find((district) => insidePad(district, player.x, player.z));
      if (pad) {
        // 캐릭터가 화면에서 벗어나지 않도록, 옮기는 거리는 3 단위까지만
        const reach = Math.hypot(pad.x - player.x, pad.z - player.z);
        const shift = reach === 0 ? 0 : Math.min(reach * 0.3, 3) / reach;
        follow.set(player.x + (pad.x - player.x) * shift, 3.5, player.z + (pad.z - player.z) * shift);
      }
      follow.sub(orbit.target);
      // 시야 거리 단계를 바꿨으면, 보던 방향은 그대로 둔 채 거리만 부드럽게 옮긴다
      if (zoomGoal.current !== null) {
        const offset = camera.position.clone().sub(orbit.target);
        const length = offset.length();
        const next = still
          ? zoomGoal.current
          : length + (zoomGoal.current - length) * (1 - Math.exp(-Math.min(delta, 0.05) * 5));
        camera.position.copy(orbit.target).add(offset.setLength(next));
        if (Math.abs(next - zoomGoal.current) < 0.2) {
          zoomGoal.current = null;
        }
      }
      follow.multiplyScalar(still ? 1 : 1 - Math.exp(-Math.min(delta, 0.05) * 6));
      orbit.target.add(follow);
      camera.position.add(follow);
    }
    // 칩 바깥에서는 손대기 전까지 천천히 돈다
    orbit.autoRotate = world === 'board' && shot.kind === 'board' && !still && !current && !touched.current;
    focusRef.current.copy(orbit.target);
  });

  return (
    <OrbitControls
      ref={controls}
      enablePan={false}
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.55}
      zoomSpeed={0.7}
      autoRotateSpeed={0.5}
      minDistance={world === 'board' ? 10 : 18}
      maxDistance={world === 'board' ? 130 : 270}
      minPolarAngle={0.12}
      maxPolarAngle={world === 'board' ? 1.38 : 1.5}
      onStart={() => {
        touched.current = true;
      }}
    />
  );
};

/** 칩 바깥(보드) 조명: 큰 주광과 그림자, CPU 위의 강조 조명, 커서를 따라다니는 빛 */
const BoardLights = ({ accent, powerRef, still }: { accent: string; powerRef: RefObject<number>; still: boolean }) => {
  const spot = useRef<three.PointLight>(null);
  const cursor = useRef<three.PointLight>(null);
  const plane = useMemo(() => new three.Plane(UP, -2), []);
  const hit = useMemo(() => new three.Vector3(), []);

  useFrame(({ raycaster, pointer, camera }, delta) => {
    if (spot.current) {
      spot.current.intensity = 130 * powerRef.current;
    }
    if (cursor.current) {
      raycaster.setFromCamera(pointer, camera);
      if (raycaster.ray.intersectPlane(plane, hit)) {
        cursor.current.position.lerp(hit.setY(3.2), still ? 1 : 1 - Math.exp(-delta * 9));
      }
      cursor.current.intensity = 55 * powerRef.current;
    }
  });

  return (
    <>
      <directionalLight
        position={[34, 60, 26]}
        intensity={1.5}
        color='#fff6ea'
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-62}
        shadow-camera-right={62}
        shadow-camera-top={52}
        shadow-camera-bottom={-52}
        shadow-camera-near={10}
        shadow-camera-far={160}
        shadow-bias={-0.0004}
        shadow-normalBias={0.04}
      />
      <directionalLight position={[-50, 22, -40]} intensity={0.55} color='#9cc8ff' />
      <pointLight
        ref={spot}
        position={[PARTS.cpu.x - 9, 9, PARTS.cpu.z - 8]}
        color={accent}
        intensity={0}
        distance={46}
        decay={1.6}
      />
      <pointLight ref={cursor} color='#ffffff' intensity={0} distance={16} decay={1.8} />
    </>
  );
};

/** 보드 아래에 깔리는 빛. 보드가 어둠 속에 떠 있는 것처럼 보이게 한다 */
const Underglow = ({ accent, powerRef }: { accent: string; powerRef: RefObject<number> }) => {
  const uniforms = useMemo(() => ({ uColor: { value: new three.Color(accent) }, uPower: { value: 0 } }), [accent]);

  useFrame(() => {
    uniforms.uPower.value = powerRef.current;
  });

  return (
    <mesh position={[0, -7, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[260, 260]} />
      <shaderMaterial
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={three.AdditiveBlending}
        vertexShader={
          /* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `
        }
        fragmentShader={
          /* glsl */ `
          uniform vec3 uColor;
          uniform float uPower;
          varying vec2 vUv;
          void main() {
            vec2 p = (vUv - 0.5) * vec2(2.0, 2.4);
            float d = length(p);
            float glow = pow(max(0.0, 1.0 - d), 2.6);
            gl_FragColor = vec4(uColor * glow * 0.42 * uPower, 1.0);
          }
        `
        }
      />
    </mesh>
  );
};

/**
 * 후처리. WebGL 컨텍스트가 유실된 상태에서 합성기를 만들면 페이지가 죽으므로,
 * 살아 있을 때만 붙인다.
 */
export const Effects = ({
  compact,
  world,
  walking,
  focusRef,
}: {
  compact: boolean;
  world: World;
  walking: boolean;
  focusRef: RefObject<three.Vector3>;
}) => {
  const gl = useThree((state) => state.gl);
  const [alive, setAlive] = useState(() => gl.getContext().getContextAttributes() !== null);
  const depth = useRef<{ target: three.Vector3 | null }>(null);

  useEffect(() => {
    const canvas = gl.domElement;
    const handleLost = () => setAlive(false);
    const handleRestored = () => setAlive(true);
    canvas.addEventListener('webglcontextlost', handleLost);
    canvas.addEventListener('webglcontextrestored', handleRestored);
    return () => {
      canvas.removeEventListener('webglcontextlost', handleLost);
      canvas.removeEventListener('webglcontextrestored', handleRestored);
    };
  }, [gl]);

  useFrame(() => {
    if (depth.current) {
      depth.current.target = focusRef.current;
    }
  });

  if (!alive) {
    return null;
  }

  if (compact) {
    return (
      <EffectComposer multisampling={0} enableNormalPass={false}>
        <Bloom mipmapBlur luminanceThreshold={1} luminanceSmoothing={0.2} intensity={0.5} radius={0.7} />
        <Vignette offset={0.25} darkness={0.75} />
        <ToneMapping />
      </EffectComposer>
    );
  }

  const inside = world === 'die';
  return (
    <EffectComposer key={`${world}-${walking}`} multisampling={0} enableNormalPass={false}>
      <N8AO aoRadius={inside ? 6 : 2.4} distanceFalloff={1.2} intensity={inside ? 3 : 2.6} quality='medium' halfRes />
      <DepthOfField
        ref={depth as never}
        worldFocusRange={walking ? 38 : inside ? 150 : 34}
        bokehScale={walking ? 4.6 : inside ? 2.2 : 3.2}
        resolutionScale={0.5}
      />
      <Bloom mipmapBlur luminanceThreshold={1} luminanceSmoothing={0.2} intensity={0.6} radius={0.74} />
      <Noise opacity={0.045} />
      <Vignette offset={0.22} darkness={0.78} />
      <ToneMapping />
    </EffectComposer>
  );
};

const Scene = ({
  world,
  shot,
  accent,
  still,
  compact,
  onEnter,
  onSelect,
  onNear,
  collected,
  onCollect,
  zoom,
}: ChipCanvasProps) => {
  const player = useRef(new three.Vector3(0, 0, 40));
  const destination = useRef<three.Vector3 | null>(null);
  const power = useRef(still ? 1 : 0);
  const focus = useRef(new three.Vector3());
  const start = useRef<number | null>(null);

  // 전원 인가: 진입 후 잠깐 뒤에 조명이 켜진다
  useFrame(({ clock }) => {
    if (still) {
      power.current = 1;
      return;
    }
    if (start.current === null) {
      start.current = clock.elapsedTime;
    }
    power.current = smoothstep(0.5, 2.6, clock.elapsedTime - start.current);
  });

  const view: ViewId = shot.kind === 'board' || shot.kind === 'dive' || shot.kind === 'walk' ? 'overview' : shot.kind;
  // 걷는 동안에는 초점 범위를 좁혀 미니어처 사진처럼 보이게 한다
  const walking = world === 'die' && shot.kind === 'walk';
  const inside = world === 'die';

  return (
    <>
      <color attach='background' args={['#050608']} />
      <fog key={`${world}-${compact}`} attach='fog' args={inside ? ['#050608', 260, 700] : ['#050608', 90, 260]} />
      <Rig world={world} shot={shot} still={still} compact={compact} zoom={zoom} focusRef={focus} playerRef={player} />
      <Suspense fallback={null}>
        <Environment files='/portfolio/studio.hdr' environmentIntensity={inside ? 0.9 : 0.55} />
      </Suspense>
      {inside ? (
        <DieWorld
          accent={accent}
          compact={compact}
          still={still}
          view={view}
          walking={walking}
          positionRef={player}
          destinationRef={destination}
          onSelect={onSelect}
          onNear={onNear}
          collected={collected}
          onCollect={onCollect}
        />
      ) : (
        <>
          <BoardLights accent={accent} powerRef={power} still={still} />
          <Underglow accent={accent} powerRef={power} />
          <Suspense fallback={null}>
            <Board accent={accent} powerRef={power} still={still} compact={compact} />
          </Suspense>
          {/* 칩을 누르면 안으로 들어간다 */}
          {/* biome-ignore lint/a11y/noStaticElementInteractions: 3D 메시이며, 같은 이동은 화면의 버튼과 키보드로도 할 수 있다 */}
          <mesh
            position={[PARTS.cpu.x, 2, PARTS.cpu.z]}
            onClick={(event) => {
              event.stopPropagation();
              onEnter();
            }}
            onPointerOver={() => {
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
              document.body.style.cursor = '';
            }}
          >
            <boxGeometry args={[15, 4, 15]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
        </>
      )}
      <Effects compact={compact} world={world} walking={walking} focusRef={focus} />
    </>
  );
};

export const ChipCanvas = (props: ChipCanvasProps) => (
  <Canvas
    shadows
    dpr={props.compact ? [1, 1.5] : [1, 1.75]}
    gl={{ antialias: true, alpha: false, toneMapping: three.NoToneMapping, powerPreference: 'high-performance' }}
    camera={{ fov: FOV, near: 1, far: 1800, position: [30, 34, 47] }}
    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', touchAction: 'none' }}
  >
    <Scene {...props} />
  </Canvas>
);
