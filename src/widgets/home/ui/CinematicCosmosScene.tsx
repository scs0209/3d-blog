'use client';

import { Stars, Text3D, useGLTF, useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type MutableRefObject } from 'react';
import * as three from 'three';
import { bindCosmosAudioUnlock, setCosmosPortalActive } from '@/widgets/home/lib/cosmos-audio';
import { COSMOS_PORTALS, type CosmosPortalId } from '@/widgets/home/model/cosmos-portals';
import { PortalBeacon, resolveActivePortalId } from './PortalBeacon';
import { PortfolioPortalDoor } from './PortfolioPortalDoor';
import { WalkingAvatar } from './WalkingAvatar';

const ROCK_PATHS = [
  '/cosmos/rocks/moon_rock_01/moon_rock_01_1k.gltf',
  '/cosmos/rocks/moon_rock_02/moon_rock_02_1k.gltf',
  '/cosmos/rocks/moon_rock_03/moon_rock_03_1k.gltf',
  '/cosmos/rocks/moon_rock_05/moon_rock_05_1k.gltf',
  '/cosmos/rocks/rock_07/rock_07_1k.gltf',
  '/cosmos/rocks/rock_09/rock_09_1k.gltf',
] as const;

const hash = (x: number, z: number) => {
  const s = Math.sin(x * 127.1 + z * 311.7) * 43758.5453;
  return s - Math.floor(s);
};

const noise2 = (x: number, z: number) => {
  const ix = Math.floor(x);
  const iz = Math.floor(z);
  const fx = x - ix;
  const fz = z - iz;
  const ux = fx * fx * (3 - 2 * fx);
  const uz = fz * fz * (3 - 2 * fz);
  const a = hash(ix, iz);
  const b = hash(ix + 1, iz);
  const c = hash(ix, iz + 1);
  const d = hash(ix + 1, iz + 1);
  return a + (b - a) * ux + (c - a) * uz + (a - b - c + d) * ux * uz;
};

const fbm = (x: number, z: number) => {
  let v = 0;
  let a = 0.5;
  let f = 1;
  for (let i = 0; i < 5; i += 1) {
    v += noise2(x * f, z * f) * a;
    a *= 0.5;
    f *= 2.05;
  }
  return v;
};

const createRockyTerrain = () => {
  const geometry = new three.PlaneGeometry(380, 380, 128, 128);
  geometry.rotateX(-Math.PI / 2);
  const positions = geometry.attributes.position;
  if (!positions) {
    return geometry;
  }

  for (let i = 0; i < positions.count; i += 1) {
    const x = positions.getX(i);
    const z = positions.getZ(i);
    const dist = Math.hypot(x, z);

    // 큰 능선 + 잔물결 — 자갈 카펫이 아니라 고요한 대지
    let y = fbm(x * 0.018, z * 0.018) * 4.2 - 1.4;
    y += fbm(x * 0.055 + 3.1, z * 0.055) * 1.35;
    y += fbm(x * 0.14 + 8, z * 0.14) * 0.35;
    // 골짜기 (안개가 고이는 낮은 곳)
    y -= Math.exp(-((x - 18) ** 2) / 140 - ((z + 36) ** 2) / 160) * 3.2;
    y -= Math.exp(-((x + 28) ** 2) / 90 - ((z + 8) ** 2) / 110) * 2.1;
    y -= Math.exp(-((x - 4) ** 2) / 70 - ((z + 55) ** 2) / 120) * 2.6;

    // 스폰 근처만 완만
    if (dist < 18) {
      y *= (dist / 18) ** 1.55;
      y *= 0.45;
    } else if (dist < 36) {
      const t = (dist - 18) / 18;
      y *= 0.45 + t * 0.55;
    }

    positions.setY(i, y);
  }

  geometry.computeVertexNormals();
  return geometry;
};

const createGlowSprite = () => {
  if (typeof document === 'undefined') {
    return null;
  }
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return null;
  }
  const g = ctx.createRadialGradient(size / 2, size / 2, 2, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(255,236,210,0.95)');
  g.addColorStop(0.22, 'rgba(255,160,90,0.4)');
  g.addColorStop(0.5, 'rgba(180,80,40,0.12)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const texture = new three.CanvasTexture(canvas);
  texture.colorSpace = three.SRGBColorSpace;
  return texture;
};

const createMistTexture = () => {
  if (typeof document === 'undefined') {
    return null;
  }
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return null;
  }
  // 차가운 신비 안개
  const g = ctx.createRadialGradient(size / 2, size / 2, 4, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(160,120,220,0.45)');
  g.addColorStop(0.4, 'rgba(80,50,130,0.14)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const texture = new three.CanvasTexture(canvas);
  texture.colorSpace = three.SRGBColorSpace;
  return texture;
};

type RockPlacement = {
  path: (typeof ROCK_PATHS)[number];
  position: [number, number, number];
  scale: number | [number, number, number];
  rotation: [number, number, number];
  tint?: string;
};

/** 지평선 산맥 — 차가운 실루엣 */
const HORIZON_MOUNTAINS: RockPlacement[] = [
  { path: ROCK_PATHS[5], position: [-62, -16, -82], scale: [220, 160, 200], rotation: [0.15, 0.4, -0.05], tint: '#1a1e28' },
  { path: ROCK_PATHS[0], position: [-38, -14, -92], scale: [190, 200, 170], rotation: [0.2, -0.6, 0.1], tint: '#161a22' },
  { path: ROCK_PATHS[2], position: [-12, -18, -100], scale: [250, 180, 220], rotation: [0.1, 0.9, 0], tint: '#1c202a' },
  { path: ROCK_PATHS[3], position: [18, -15, -96], scale: [210, 170, 200], rotation: [-0.1, -0.3, 0.08], tint: '#141820' },
  { path: ROCK_PATHS[1], position: [48, -13, -88], scale: [180, 150, 170], rotation: [0.25, 1.1, -0.1], tint: '#1a1e26' },
  { path: ROCK_PATHS[4], position: [72, -17, -80], scale: [200, 140, 190], rotation: [0.05, -0.8, 0.12], tint: '#12161e' },
  { path: ROCK_PATHS[0], position: [5, -20, -114], scale: [280, 200, 260], rotation: [0.08, 0.5, -0.05], tint: '#0e1218' },
  { path: ROCK_PATHS[2], position: [-50, -11, -58], scale: [140, 110, 130], rotation: [0.2, -1.2, 0.1], tint: '#1e222c' },
];

/** 전경 — 중앙 통로·포털 자리 비우고 좌우로 프레이밍 */
const FOREGROUND_ROCKS: RockPlacement[] = [
  { path: ROCK_PATHS[0], position: [-18, -1.15, -1], scale: 38, rotation: [0.12, 0.9, 0.05], tint: '#2a303c' },
  { path: ROCK_PATHS[2], position: [-20, -0.85, -14], scale: 32, rotation: [0.2, -0.4, 0.1], tint: '#242a34' },
  { path: ROCK_PATHS[1], position: [19, -1.05, -2], scale: 36, rotation: [0.15, -0.7, 0.08], tint: '#2e3440' },
  { path: ROCK_PATHS[3], position: [21, -0.7, -16], scale: 40, rotation: [-0.1, 1.0, 0.12], tint: '#222830' },
  { path: ROCK_PATHS[2], position: [-16, -0.9, -30], scale: 34, rotation: [0.18, 0.6, -0.05], tint: '#282e38' },
  { path: ROCK_PATHS[0], position: [16, -0.8, -31], scale: 36, rotation: [0.1, -0.5, 0.1], tint: '#2a303a' },
  { path: ROCK_PATHS[4], position: [0, -1.15, -42], scale: 48, rotation: [0.12, 0.25, 0], tint: '#1e242e' },
  { path: ROCK_PATHS[5], position: [-6.5, -1.3, 7.5], scale: 12, rotation: [0, 0.8, 0.05], tint: '#323844' },
];

const NEON_LANTERNS: Array<{ position: [number, number, number]; color: string; intensity: number }> = [
  { position: [-6.5, 1.6, 4.5], color: '#ff9a3c', intensity: 6.5 },
  { position: [5.8, 1.4, 3.2], color: '#ff7a55', intensity: 5.5 },
  { position: [-4.2, 1.2, -15], color: '#ff6ad5', intensity: 4.2 },
  { position: [4.5, 1.3, -15.5], color: '#7a6aff', intensity: 4.5 },
  { position: [0, 1.5, -6], color: '#5ad8ff', intensity: 3.2 },
];

export type CosmosSceneTheme = 'light' | 'dark';

type CosmosThemePreset = {
  background: string;
  fog: string;
  fogNear: number;
  fogFar: number;
  ambientIntensity: number;
  ambientColor: string;
  hemiSky: string;
  hemiGround: string;
  hemiIntensity: number;
  keyIntensity: number;
  keyColor: string;
  rimIntensity: number;
  rimColor: string;
  fillIntensity: number;
  fillColor: string;
  lanternScale: number;
  terrainColor: string;
  terrainEnv: number;
  starCount: number;
  starFactor: number;
  starSaturation: number;
  wispCount: number;
  wispSize: number;
  wispOpacity: number;
  mistOpacityScale: number;
  sunCoreColor: string;
  sunGlowColor: string;
  sunGlowOpacity: number;
  sunHaloOpacity: number;
  sunLightIntensity: number;
  sky: {
    uTop: string;
    uMid: string;
    uHorizonCold: string;
    uHorizonWarm: string;
    uGlow: string;
    uWarmAmount: number;
  };
  bloomThreshold: number;
  bloomIntensity: number;
  bloomRadius: number;
  vignetteOffset: number;
  vignetteDarkness: number;
  exposure: number;
};

/** light = 황혼 산책 / dark = 심해 밤 — 조명만이 아니라 분위기 자체가 갈리게 */
const COSMOS_THEME_PRESETS: Record<CosmosSceneTheme, CosmosThemePreset> = {
  light: {
    background: '#0a0618',
    fog: '#1a1230',
    fogNear: 85,
    fogFar: 240,
    ambientIntensity: 0.32,
    ambientColor: '#4a2a78',
    hemiSky: '#7a5ac8',
    hemiGround: '#1a1020',
    hemiIntensity: 0.95,
    keyIntensity: 1.05,
    keyColor: '#ffc8a0',
    rimIntensity: 0.45,
    rimColor: '#8890ff',
    fillIntensity: 0.28,
    fillColor: '#ff8ad0',
    lanternScale: 0.85,
    terrainColor: '#3a3450',
    terrainEnv: 0.55,
    starCount: 1600,
    starFactor: 1.2,
    starSaturation: 0.08,
    wispCount: 36,
    wispSize: 0.11,
    wispOpacity: 0.55,
    mistOpacityScale: 0.7,
    sunCoreColor: '#ffe8d0',
    sunGlowColor: '#d49870',
    sunGlowOpacity: 0.38,
    sunHaloOpacity: 0.2,
    sunLightIntensity: 22,
    sky: {
      uTop: '#100828',
      uMid: '#1c0e38',
      uHorizonCold: '#2a1858',
      uHorizonWarm: '#8a4a68',
      uGlow: '#ffc090',
      uWarmAmount: 1,
    },
    bloomThreshold: 0.48,
    bloomIntensity: 1.05,
    bloomRadius: 0.7,
    vignetteOffset: 0.18,
    vignetteDarkness: 0.42,
    exposure: 0.98,
  },
  dark: {
    background: '#000006',
    fog: '#04040c',
    fogNear: 28,
    fogFar: 130,
    ambientIntensity: 0.045,
    ambientColor: '#0a1028',
    hemiSky: '#142040',
    hemiGround: '#020208',
    hemiIntensity: 0.28,
    keyIntensity: 0.08,
    keyColor: '#607090',
    rimIntensity: 0.55,
    rimColor: '#3a6aff',
    fillIntensity: 0.04,
    fillColor: '#304080',
    lanternScale: 1.55,
    terrainColor: '#0e121c',
    terrainEnv: 0.22,
    starCount: 4200,
    starFactor: 2.6,
    starSaturation: 0.4,
    wispCount: 160,
    wispSize: 0.16,
    wispOpacity: 0.85,
    mistOpacityScale: 2.4,
    sunCoreColor: '#8890a8',
    sunGlowColor: '#405070',
    sunGlowOpacity: 0.06,
    sunHaloOpacity: 0.03,
    sunLightIntensity: 1.2,
    sky: {
      uTop: '#000008',
      uMid: '#020614',
      uHorizonCold: '#061028',
      uHorizonWarm: '#0c1830',
      uGlow: '#203858',
      uWarmAmount: 0.08,
    },
    bloomThreshold: 0.32,
    bloomIntensity: 1.55,
    bloomRadius: 0.85,
    vignetteOffset: 0.32,
    vignetteDarkness: 0.88,
    exposure: 0.5,
  },
};

const SunsetSky = ({ theme }: { theme: CosmosSceneTheme }) => {
  const material = useMemo(
    () =>
      new three.ShaderMaterial({
        side: three.BackSide,
        depthWrite: false,
        fog: false,
        uniforms: {
          uTop: { value: new three.Color(COSMOS_THEME_PRESETS.light.sky.uTop) },
          uMid: { value: new three.Color(COSMOS_THEME_PRESETS.light.sky.uMid) },
          uHorizonCold: { value: new three.Color(COSMOS_THEME_PRESETS.light.sky.uHorizonCold) },
          uHorizonWarm: { value: new three.Color(COSMOS_THEME_PRESETS.light.sky.uHorizonWarm) },
          uGlow: { value: new three.Color(COSMOS_THEME_PRESETS.light.sky.uGlow) },
          uWarmAmount: { value: COSMOS_THEME_PRESETS.light.sky.uWarmAmount },
          uSunDir: { value: new three.Vector3(0.58, 0.03, -0.81).normalize() },
        },
        vertexShader: `
          varying vec3 vDir;
          void main() {
            vec4 world = modelMatrix * vec4(position, 1.0);
            vDir = normalize(world.xyz - cameraPosition);
            gl_Position = projectionMatrix * viewMatrix * world;
          }
        `,
        fragmentShader: `
          uniform vec3 uTop;
          uniform vec3 uMid;
          uniform vec3 uHorizonCold;
          uniform vec3 uHorizonWarm;
          uniform vec3 uGlow;
          uniform float uWarmAmount;
          uniform vec3 uSunDir;
          varying vec3 vDir;
          void main() {
            vec3 dir = normalize(vDir);
            float h = dir.y * 0.5 + 0.5;
            vec3 sky = mix(uHorizonCold, uMid, smoothstep(0.38, 0.58, h));
            sky = mix(sky, uTop, smoothstep(0.55, 0.9, h));
            float sunFacing = max(dot(dir, normalize(uSunDir)), 0.0);
            float band = exp(-pow((dir.y - 0.01) / 0.14, 2.0));
            float wideBand = exp(-pow((dir.y + 0.02) / 0.28, 2.0));
            float sunset = pow(sunFacing, 6.5) * band * uWarmAmount;
            float glow = pow(sunFacing, 26.0) * uWarmAmount;
            sky = mix(sky, uHorizonWarm, clamp(sunset * 0.45 + wideBand * 0.08 * sunFacing * uWarmAmount, 0.0, 0.55));
            sky += uGlow * glow * 0.55;
            sky += uHorizonWarm * band * 0.08 * sunFacing * uWarmAmount;
            sky = mix(sky, vec3(0.08, 0.04, 0.16), 0.22 * uWarmAmount);
            // 밤 모드: 차가운 보이드로 당김
            sky = mix(sky, uTop * 0.35 + uHorizonCold * 0.65, 1.0 - uWarmAmount);
            gl_FragColor = vec4(sky, 1.0);
          }
        `,
      }),
    [],
  );

  useEffect(() => {
    const sky = COSMOS_THEME_PRESETS[theme].sky;
    const { uTop, uMid, uHorizonCold, uHorizonWarm, uGlow, uWarmAmount } = material.uniforms;
    if (!uTop || !uMid || !uHorizonCold || !uHorizonWarm || !uGlow || !uWarmAmount) {
      return;
    }
    uTop.value.set(sky.uTop);
    uMid.value.set(sky.uMid);
    uHorizonCold.value.set(sky.uHorizonCold);
    uHorizonWarm.value.set(sky.uHorizonWarm);
    uGlow.value.set(sky.uGlow);
    uWarmAmount.value = sky.uWarmAmount;
  }, [material, theme]);

  useEffect(() => {
    return () => {
      material.dispose();
    };
  }, [material]);

  return (
    <mesh material={material} renderOrder={-10}>
      <sphereGeometry args={[280, 64, 40]} />
    </mesh>
  );
};

const HorizonSun = ({
  glowMap,
  preset,
}: {
  glowMap: three.Texture | null;
  preset: CosmosThemePreset;
}) => (
  <group position={[72, 2.2, -145]}>
    <mesh>
      <sphereGeometry args={[1.05, 32, 32]} />
      <meshBasicMaterial
        color={preset.sunCoreColor}
        toneMapped={false}
        fog={false}
        transparent
        opacity={Math.min(1, preset.sunGlowOpacity * 3.2)}
      />
    </mesh>
    {glowMap ? (
      <>
        <sprite scale={[12, 12, 1]} renderOrder={2}>
          <spriteMaterial
            map={glowMap}
            transparent
            depthWrite={false}
            blending={three.AdditiveBlending}
            opacity={preset.sunGlowOpacity}
            toneMapped={false}
            fog={false}
          />
        </sprite>
        <sprite scale={[28, 16, 1]} renderOrder={1}>
          <spriteMaterial
            map={glowMap}
            color={preset.sunGlowColor}
            transparent
            depthWrite={false}
            blending={three.AdditiveBlending}
            opacity={preset.sunHaloOpacity}
            toneMapped={false}
            fog={false}
          />
        </sprite>
      </>
    ) : null}
    <pointLight color={preset.sunGlowColor} intensity={preset.sunLightIntensity} distance={160} decay={2} />
  </group>
);

const RockInstance = ({
  path,
  position,
  scale = 1,
  rotation = [0, 0, 0],
  tint,
}: RockPlacement) => {
  const { scene } = useGLTF(path);
  const cloned = useMemo(() => {
    const root = scene.clone(true);
    root.traverse((obj) => {
      if ((obj as three.Mesh).isMesh) {
        const mesh = obj as three.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (mesh.name.includes('LOD1') || mesh.name.includes('LOD2') || mesh.name.includes('LOD3')) {
          mesh.visible = false;
        }
        if (tint && mesh.material) {
          const source = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          const tinted = source.map((mat) => {
            const next = mat.clone();
            if ('color' in next && next.color instanceof three.Color) {
              next.color.multiply(new three.Color(tint));
            }
            return next;
          });
          mesh.material = tinted.length === 1 ? tinted[0]! : tinted;
        }
      }
      if (obj.name.includes('LOD1') || obj.name.includes('LOD2') || obj.name.includes('LOD3')) {
        obj.visible = false;
      }
    });
    return root;
  }, [scene, tint]);

  return <primitive object={cloned} position={position} scale={scale} rotation={rotation} />;
};

/** NASA Black Marble 야경 지구 — 도시광이 빛나는 밤의 행성 */
const RealisticEarth = () => {
  const earthRef = useRef<three.Group>(null);
  const [nightMap, dayMap] = useTexture([
    '/cosmos/textures/earth_black_marble.jpg',
    '/cosmos/textures/earth_day_hq.jpg',
  ]);

  const earthMat = useMemo(
    () =>
      new three.ShaderMaterial({
        fog: false,
        toneMapped: false,
        uniforms: {
          uNight: { value: null as three.Texture | null },
          uDay: { value: null as three.Texture | null },
          // 해는 가장자리만 살짝 — 본체는 야경
          uLightDir: { value: new three.Vector3(0.55, 0.55, 0.15).normalize() },
          uAtm: { value: new three.Color('#6ec8ff') },
        },
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vNormalW;
          varying vec3 vPosW;
          void main() {
            vUv = uv;
            vec4 world = modelMatrix * vec4(position, 1.0);
            vPosW = world.xyz;
            vNormalW = normalize(mat3(modelMatrix) * normal);
            gl_Position = projectionMatrix * viewMatrix * world;
          }
        `,
        fragmentShader: `
          uniform sampler2D uNight;
          uniform sampler2D uDay;
          uniform vec3 uLightDir;
          uniform vec3 uAtm;
          varying vec2 vUv;
          varying vec3 vNormalW;
          varying vec3 vPosW;
          void main() {
            vec3 n = normalize(vNormalW);
            vec3 L = normalize(uLightDir);
            float ndl = dot(n, L);
            // 아주 얇은 일출 림만
            float dayEdge = smoothstep(0.35, 0.85, ndl);
            float twilight = smoothstep(0.15, 0.55, ndl) * (1.0 - smoothstep(0.55, 0.95, ndl));

            vec3 lights = texture2D(uNight, vUv).rgb;
            vec3 dayAlbedo = texture2D(uDay, vUv).rgb;

            // 어두운 대지 (대륙 실루엣만 아주 약하게)
            float landHint = max(max(dayAlbedo.r, dayAlbedo.g), dayAlbedo.b);
            vec3 surface = vec3(0.01, 0.015, 0.03) + dayAlbedo * 0.04 * landHint;

            // 도시광 — 금빛으로 강하게 (Bloom 타겟)
            float lum = max(max(lights.r, lights.g), lights.b);
            vec3 city = lights * vec3(1.35, 1.05, 0.55);
            city += pow(lum, 1.6) * vec3(1.4, 0.95, 0.35) * 1.2;

            vec3 color = surface + city;

            // 가장자리 일출 글로우만 살짝
            color += dayAlbedo * dayEdge * 0.22;
            color += vec3(1.0, 0.92, 0.85) * pow(dayEdge, 4.0) * 0.35;
            color += uAtm * twilight * 0.2;

            vec3 viewDir = normalize(cameraPosition - vPosW);
            float fresnel = pow(1.0 - max(dot(viewDir, n), 0.0), 3.2);
            color += uAtm * fresnel * 0.28;

            // 도시광은 클램프를 느슨하게 — bloom이 먹도록
            color = min(color, vec3(2.2));
            gl_FragColor = vec4(color, 1.0);
          }
        `,
      }),
    [],
  );

  const atmosphere = useMemo(
    () =>
      new three.ShaderMaterial({
        side: three.BackSide,
        transparent: true,
        depthWrite: false,
        fog: false,
        toneMapped: false,
        blending: three.AdditiveBlending,
        uniforms: {
          uColor: { value: new three.Color('#7ad0ff') },
          uPower: { value: 4.8 },
          uIntensity: { value: 0.75 },
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vWorldPos;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vec4 world = modelMatrix * vec4(position, 1.0);
            vWorldPos = world.xyz;
            gl_Position = projectionMatrix * viewMatrix * world;
          }
        `,
        fragmentShader: `
          uniform vec3 uColor;
          uniform float uPower;
          uniform float uIntensity;
          varying vec3 vNormal;
          varying vec3 vWorldPos;
          void main() {
            vec3 viewDir = normalize(cameraPosition - vWorldPos);
            float fresnel = pow(1.0 - max(dot(viewDir, normalize(vNormal)), 0.0), uPower);
            float a = fresnel * uIntensity;
            gl_FragColor = vec4(uColor * a, a);
          }
        `,
      }),
    [],
  );

  useLayoutEffect(() => {
    if (!nightMap || !dayMap) {
      return;
    }
    nightMap.colorSpace = three.SRGBColorSpace;
    dayMap.colorSpace = three.SRGBColorSpace;
    nightMap.anisotropy = 16;
    dayMap.anisotropy = 8;
    const { uNight, uDay } = earthMat.uniforms;
    if (uNight) {
      uNight.value = nightMap;
    }
    if (uDay) {
      uDay.value = dayMap;
    }
  }, [nightMap, dayMap, earthMat]);

  useEffect(() => {
    return () => {
      earthMat.dispose();
      atmosphere.dispose();
    };
  }, [earthMat, atmosphere]);

  useFrame((_, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.008;
    }
  });

  return (
    <group position={[-100, 18, -210]} rotation={[0.05, 0.45, -0.02]}>
      {/* 아시아·유럽 야경이 보이도록 초기 회전 */}
      <group ref={earthRef} rotation={[0.2, -0.55, 0.08]}>
        <mesh material={earthMat}>
          <sphereGeometry args={[78, 64, 64]} />
        </mesh>
      </group>
      <mesh scale={1.03} material={atmosphere}>
        <sphereGeometry args={[78, 64, 64]} />
      </mesh>
    </group>
  );
};

/** 지구 옆 여백 — 네온 행성 (링 없음) */
type NeonPlanetProps = {
  position: [number, number, number];
  radius: number;
  core: string;
  neon: string;
  accent: string;
  spin?: number;
};

const NeonPlanet = ({ position, radius, core, neon, accent, spin = 0.06 }: NeonPlanetProps) => {
  const meshRef = useRef<three.Mesh>(null);
  const material = useMemo(
    () =>
      new three.ShaderMaterial({
        fog: false,
        toneMapped: false,
        uniforms: {
          uCore: { value: new three.Color(core) },
          uNeon: { value: new three.Color(neon) },
          uAccent: { value: new three.Color(accent) },
          uLightDir: { value: new three.Vector3(0.7, 0.25, 0.45).normalize() },
          uTime: { value: 0 },
        },
        vertexShader: `
          varying vec3 vNormalW;
          varying vec3 vPosW;
          varying vec2 vUv;
          void main() {
            vUv = uv;
            vec4 world = modelMatrix * vec4(position, 1.0);
            vPosW = world.xyz;
            vNormalW = normalize(mat3(modelMatrix) * normal);
            gl_Position = projectionMatrix * viewMatrix * world;
          }
        `,
        fragmentShader: `
          uniform vec3 uCore;
          uniform vec3 uNeon;
          uniform vec3 uAccent;
          uniform vec3 uLightDir;
          uniform float uTime;
          varying vec3 vNormalW;
          varying vec3 vPosW;
          varying vec2 vUv;
          float hash(vec2 p) {
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
          }
          float noise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            float a = hash(i);
            float b = hash(i + vec2(1.0, 0.0));
            float c = hash(i + vec2(0.0, 1.0));
            float d = hash(i + vec2(1.0, 1.0));
            vec2 u = f * f * (3.0 - 2.0 * f);
            return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
          }
          void main() {
            vec3 n = normalize(vNormalW);
            float lat = vUv.y;
            float veins = abs(sin(vUv.x * 38.0 + noise(vUv * 14.0) * 4.0 + uTime * 0.35));
            veins = pow(1.0 - veins, 8.0);
            float grid = pow(1.0 - abs(sin(vUv.x * 55.0)), 14.0) * 0.55
                       + pow(1.0 - abs(sin(lat * 70.0)), 16.0) * 0.45;
            float city = veins * 0.75 + grid * 0.55;
            city *= smoothstep(0.15, 0.85, noise(vUv * 22.0 + uTime * 0.05));

            float ndl = max(dot(n, normalize(uLightDir)), 0.0);
            vec3 col = uCore * (0.22 + ndl * 0.55);
            col += uNeon * city * 1.6;
            col += uAccent * city * city * 0.8;

            vec3 viewDir = normalize(cameraPosition - vPosW);
            float fresnel = pow(1.0 - max(dot(viewDir, n), 0.0), 2.8);
            col += uNeon * fresnel * 1.15;
            col += uAccent * fresnel * fresnel * 0.55;

            gl_FragColor = vec4(col, 1.0);
          }
        `,
      }),
    [core, neon, accent],
  );

  const glow = useMemo(
    () =>
      new three.ShaderMaterial({
        side: three.BackSide,
        transparent: true,
        depthWrite: false,
        fog: false,
        toneMapped: false,
        blending: three.AdditiveBlending,
        uniforms: {
          uColor: { value: new three.Color(neon) },
          uPower: { value: 3.8 },
          uIntensity: { value: 1.35 },
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vWorldPos;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vec4 world = modelMatrix * vec4(position, 1.0);
            vWorldPos = world.xyz;
            gl_Position = projectionMatrix * viewMatrix * world;
          }
        `,
        fragmentShader: `
          uniform vec3 uColor;
          uniform float uPower;
          uniform float uIntensity;
          varying vec3 vNormal;
          varying vec3 vWorldPos;
          void main() {
            vec3 viewDir = normalize(cameraPosition - vWorldPos);
            float fresnel = pow(1.0 - max(dot(viewDir, normalize(vNormal)), 0.0), uPower);
            gl_FragColor = vec4(uColor, fresnel * uIntensity);
          }
        `,
      }),
    [neon],
  );

  useFrame(({ clock }, delta) => {
    const uTime = material.uniforms.uTime;
    if (uTime) {
      uTime.value = clock.elapsedTime;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * spin;
    }
  });

  useEffect(() => {
    return () => {
      material.dispose();
      glow.dispose();
    };
  }, [material, glow]);

  return (
    <group position={position}>
      <mesh ref={meshRef} material={material}>
        <sphereGeometry args={[radius, 64, 64]} />
      </mesh>
      <mesh scale={1.08} material={glow}>
        <sphereGeometry args={[radius, 40, 40]} />
      </mesh>
      <pointLight color={neon} intensity={radius * 0.85} distance={radius * 8} decay={2} />
    </group>
  );
};

const CompanionWorlds = () => (
  <group>
    <NeonPlanet
      position={[28, 18, -105]}
      radius={7.5}
      core='#12081c'
      neon='#ff4fd8'
      accent='#7a5cff'
      spin={0.05}
    />
    <NeonPlanet
      position={[14, 34, -88]}
      radius={3.4}
      core='#081018'
      neon='#3de8ff'
      accent='#7affc8'
      spin={0.08}
    />
    <NeonPlanet
      position={[42, 26, -92]}
      radius={2.1}
      core='#100818'
      neon='#ff9a3c'
      accent='#ff5a8a'
      spin={0.1}
    />
  </group>
);

/** 아바타를 부드럽게 추적하는 시네마틱 카메라 */
const AvatarFollowCamera = ({
  target,
  enteringPortfolio,
}: {
  target: MutableRefObject<three.Vector3>;
  enteringPortfolio: boolean;
}) => {
  const { camera } = useThree();
  const desired = useRef(new three.Vector3(5.5, 2.1, 14));
  const look = useRef(new three.Vector3(0.5, 1.35, -8));
  const smoothLook = useRef(new three.Vector3(0.5, 1.35, -8));
  const portfolio = COSMOS_PORTALS.find((item) => item.id === 'portfolio');

  useFrame((_, delta) => {
    if (enteringPortfolio && portfolio) {
      const [px, py, pz] = portfolio.position;
      const throughX = px;
      const throughZ = pz - 1.5;
      const len = Math.hypot(throughX, throughZ) || 1;
      const nx = throughX / len;
      const nz = throughZ / len;
      desired.current.set(px + nx * 0.35, py + 1.85, pz + nz * 0.35);
      look.current.set(px + nx * 8, py + 1.45, pz + nz * 8);
      const camEase = 1 - Math.exp(-1.7 * delta);
      const lookEase = 1 - Math.exp(-2.1 * delta);
      camera.position.lerp(desired.current, camEase);
      smoothLook.current.lerp(look.current, lookEase);
      camera.lookAt(smoothLook.current);
      return;
    }

    const t = target.current;
    desired.current.set(t.x + 5.2, t.y + 2.55, t.z + 11.8);
    look.current.set(t.x + 0.35, t.y + 1.4, t.z - 7.5);

    const camEase = 1 - Math.exp(-2.6 * delta);
    const lookEase = 1 - Math.exp(-3.2 * delta);
    camera.position.lerp(desired.current, camEase);
    smoothLook.current.lerp(look.current, lookEase);
    camera.lookAt(smoothLook.current);
  });

  return null;
};

const GroundMist = ({ map, opacityScale }: { map: three.Texture | null; opacityScale: number }) => {
  if (!map) {
    return null;
  }
  const sheets = [
    { position: [0, 0.8, -70] as [number, number, number], scale: [95, 14, 1] as [number, number, number], opacity: 0.1, rot: 0 },
    { position: [8, 1.1, -95] as [number, number, number], scale: [120, 18, 1] as [number, number, number], opacity: 0.08, rot: -0.02 },
    { position: [-6, 0.55, -48] as [number, number, number], scale: [70, 10, 1] as [number, number, number], opacity: 0.07, rot: 0.03 },
  ];
  return (
    <group>
      {sheets.map((sheet) => (
        <mesh
          key={sheet.position.join('-')}
          position={sheet.position}
          scale={sheet.scale}
          rotation={[0, sheet.rot, 0]}
        >
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            map={map}
            transparent
            opacity={Math.min(0.55, sheet.opacity * opacityScale)}
            depthWrite={false}
            side={three.DoubleSide}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
};

const NeonWisps = ({
  count,
  size,
  opacity,
  spread = 1,
  color = '#ff6ad5',
  heightRange = 2.4,
}: {
  count: number;
  size: number;
  opacity: number;
  spread?: number;
  color?: string;
  heightRange?: number;
}) => {
  const pointsRef = useRef<three.Points>(null);
  const data = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const spanX = 28 * spread;
    const spanZ = 36 * spread;
    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * spanX;
      positions[i * 3 + 1] = 0.2 + Math.random() * heightRange;
      positions[i * 3 + 2] = -Math.random() * spanZ + 4;
      speeds[i] = 0.18 + Math.random() * 0.7;
    }
    return { positions, speeds, count, spanX, spanZ, heightRange };
  }, [count, heightRange, spread]);

  const geometry = useMemo(() => {
    const g = new three.BufferGeometry();
    g.setAttribute('position', new three.BufferAttribute(data.positions, 3));
    return g;
  }, [data.positions]);

  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  useFrame((_, delta) => {
    const points = pointsRef.current;
    if (!points) {
      return;
    }
    const pos = points.geometry.attributes.position as three.BufferAttribute;
    const arr = pos.array as Float32Array;
    const maxY = data.heightRange + 1.1;
    for (let i = 0; i < data.count; i += 1) {
      const yIndex = i * 3 + 1;
      const speed = data.speeds[i] ?? 0.3;
      const currentY = arr[yIndex] ?? 0;
      const nextY = currentY + speed * delta;
      arr[yIndex] = nextY;
      if (nextY > maxY) {
        arr[yIndex] = 0.15;
        arr[i * 3] = (Math.random() - 0.5) * data.spanX;
        arr[i * 3 + 2] = -Math.random() * data.spanZ + 4;
      }
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        color={color}
        size={size}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={three.AdditiveBlending}
        toneMapped={false}
        sizeAttenuation
      />
    </points>
  );
};

const BrandTitle = () => (
  <group position={[-2.4, -0.55, 6.2]} rotation={[-0.08, 0.42, 0.02]}>
    <Text3D
      font='/gt.json'
      size={1.05}
      height={0.28}
      curveSegments={12}
      bevelEnabled
      bevelThickness={0.04}
      bevelSize={0.02}
      bevelSegments={4}
      letterSpacing={-0.04}
    >
      Ayaan
      <meshStandardMaterial
        color='#b8c8ff'
        emissive='#6a88ff'
        emissiveIntensity={1.15}
        roughness={0.35}
        metalness={0.2}
        toneMapped={false}
      />
    </Text3D>
    <pointLight position={[1.8, 1.4, 1.2]} color='#7aa8ff' intensity={5} distance={10} decay={2} />
    <pointLight position={[0.6, 0.4, 0.5]} color='#ff9a3c' intensity={2.4} distance={6} decay={2} />
  </group>
);

export type CinematicCosmosSceneProps = {
  theme?: CosmosSceneTheme;
  onActivePortalChange?: (id: CosmosPortalId | null) => void;
  enteringPortfolio?: boolean;
  onWalkThroughPortfolio?: () => void;
};

export const CinematicCosmosScene = ({
  theme = 'light',
  onActivePortalChange,
  enteringPortfolio = false,
  onWalkThroughPortfolio,
}: CinematicCosmosSceneProps) => {
  const preset = COSMOS_THEME_PRESETS[theme];
  const { gl, scene } = useThree();
  const terrain = useMemo(() => createRockyTerrain(), []);

  useEffect(() => {
    return () => {
      terrain.dispose();
    };
  }, [terrain]);

  useEffect(() => {
    gl.toneMappingExposure = preset.exposure;
  }, [gl, preset.exposure]);

  useEffect(() => {
    scene.background = new three.Color(preset.background);
    if (scene.fog instanceof three.Fog) {
      scene.fog.color.set(preset.fog);
      scene.fog.near = preset.fogNear;
      scene.fog.far = preset.fogFar;
    }
  }, [scene, preset.background, preset.fog, preset.fogNear, preset.fogFar]);

  const glowMap = useMemo(() => createGlowSprite(), []);
  const mistMap = useMemo(() => createMistTexture(), []);

  useEffect(() => {
    return () => {
      glowMap?.dispose();
      mistMap?.dispose();
    };
  }, [glowMap, mistMap]);

  const [activePortalId, setActivePortalId] = useState<CosmosPortalId | null>(null);
  const activePortalRef = useRef<CosmosPortalId | null>(null);
  const avatarWorldPos = useRef(new three.Vector3(0, 1.1, 1.5));
  const onActivePortalChangeRef = useRef(onActivePortalChange);
  onActivePortalChangeRef.current = onActivePortalChange;
  const onWalkThroughPortfolioRef = useRef(onWalkThroughPortfolio);
  onWalkThroughPortfolioRef.current = onWalkThroughPortfolio;
  const enteringPortfolioRef = useRef(enteringPortfolio);
  enteringPortfolioRef.current = enteringPortfolio;
  const portfolioPortal = COSMOS_PORTALS.find((item) => item.id === 'portfolio');

  const [diff, nor, rough] = useTexture([
    '/cosmos/textures/dark_rock_diff_2k.jpg',
    '/cosmos/textures/dark_rock_nor_2k.jpg',
    '/cosmos/textures/dark_rock_rough_2k.jpg',
  ]);

  useLayoutEffect(() => {
    for (const tex of [diff, nor, rough]) {
      if (!tex) {
        continue;
      }
      tex.wrapS = three.RepeatWrapping;
      tex.wrapT = three.RepeatWrapping;
      // 큰 암석 판 — 자잘한 타일 반복 제거
      tex.repeat.set(7, 7);
      tex.anisotropy = 16;
    }
    if (diff) {
      diff.colorSpace = three.SRGBColorSpace;
    }
  }, [diff, nor, rough]);

  useEffect(() => {
    const unbind = bindCosmosAudioUnlock();
    return () => {
      unbind();
      setCosmosPortalActive(false);
    };
  }, []);

  useEffect(() => {
    if (!activePortalId) {
      setCosmosPortalActive(false);
      return;
    }
    const portal = COSMOS_PORTALS.find((item) => item.id === activePortalId);
    setCosmosPortalActive(true, portal?.accent ?? '#3de8ff');
  }, [activePortalId]);

  const handleWorldPosition = useCallback((pos: three.Vector3) => {
    avatarWorldPos.current.copy(pos);
    const nextId = resolveActivePortalId({
      avatarX: pos.x,
      avatarZ: pos.z,
      portals: COSMOS_PORTALS,
    });
    if (nextId !== activePortalRef.current) {
      activePortalRef.current = nextId;
      setActivePortalId(nextId);
      onActivePortalChangeRef.current?.(nextId);
    }

    if (enteringPortfolioRef.current || !portfolioPortal) {
      return;
    }

    const [px, , pz] = portfolioPortal.position;
    const dist = Math.hypot(pos.x - px, pos.z - pz);
    if (dist <= 1.45) {
      onWalkThroughPortfolioRef.current?.();
    }
  }, [portfolioPortal]);

  return (
    <>
      <AvatarFollowCamera target={avatarWorldPos} enteringPortfolio={enteringPortfolio} />
      <color attach='background' args={[preset.background]} />
      <fog attach='fog' args={[preset.fog, preset.fogNear, preset.fogFar]} />

      <SunsetSky theme={theme} />

      <ambientLight intensity={preset.ambientIntensity} color={preset.ambientColor} />
      <hemisphereLight args={[preset.hemiSky, preset.hemiGround, preset.hemiIntensity]} />
      <directionalLight position={[55, 14, -65]} intensity={preset.keyIntensity} color={preset.keyColor} />
      <directionalLight position={[-35, 18, -10]} intensity={preset.rimIntensity} color={preset.rimColor} />
      <directionalLight position={[8, 8, 20]} intensity={preset.fillIntensity} color={preset.fillColor} />

      {NEON_LANTERNS.map((lantern) => (
        <group key={lantern.position.join(',')} position={lantern.position}>
          <pointLight
            color={lantern.color}
            intensity={lantern.intensity * preset.lanternScale}
            distance={14}
            decay={2}
          />
          <mesh>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshBasicMaterial color={lantern.color} toneMapped={false} />
          </mesh>
        </group>
      ))}

      <Stars
        radius={320}
        depth={180}
        count={preset.starCount}
        factor={preset.starFactor}
        saturation={preset.starSaturation}
        fade
        speed={0.005}
      />

      <mesh geometry={terrain} position={[0, -1.5, -22]} receiveShadow>
        <meshStandardMaterial
          map={diff}
          normalMap={nor}
          roughnessMap={rough}
          color={preset.terrainColor}
          roughness={0.92}
          metalness={0.08}
          normalScale={new three.Vector2(1.6, 1.6)}
          envMapIntensity={preset.terrainEnv}
        />
      </mesh>

      {HORIZON_MOUNTAINS.map((rock) => (
        <RockInstance key={`mtn-${rock.position.join(',')}`} {...rock} />
      ))}
      {FOREGROUND_ROCKS.map((rock) => (
        <RockInstance key={`fg-${rock.position.join(',')}`} {...rock} />
      ))}

      <RealisticEarth />
      <CompanionWorlds />
      <HorizonSun glowMap={glowMap} preset={preset} />
      <GroundMist map={mistMap} opacityScale={preset.mistOpacityScale} />
      <NeonWisps
        count={preset.wispCount}
        size={preset.wispSize}
        opacity={preset.wispOpacity}
        color='#ff6ad5'
      />
      {theme === 'dark' ? (
        <>
          <NeonWisps
            count={Math.round(preset.wispCount * 0.7)}
            size={preset.wispSize * 0.7}
            opacity={preset.wispOpacity * 0.65}
            spread={1.45}
            color='#5ad8ff'
            heightRange={4.2}
          />
          <NeonWisps
            count={Math.round(preset.wispCount * 0.45)}
            size={preset.wispSize * 1.35}
            opacity={preset.wispOpacity * 0.4}
            spread={1.8}
            color='#7a6aff'
            heightRange={5.5}
          />
        </>
      ) : null}
      <BrandTitle />

      {COSMOS_PORTALS.map((portal) => (
        <PortalBeacon key={portal.id} portal={portal} active={activePortalId === portal.id} />
      ))}

      {portfolioPortal ? (
        <PortfolioPortalDoor
          portal={portfolioPortal}
          open={activePortalId === 'portfolio' || enteringPortfolio}
        />
      ) : null}

      <group position={[0, -0.08, 1.5]} scale={1.25}>
        <WalkingAvatar
          variant='cinematic'
          position={[0, 0, 0]}
          onWorldPosition={handleWorldPosition}
          locked={enteringPortfolio}
        />
      </group>

      <EffectComposer multisampling={4} enableNormalPass={false}>
        <Bloom
          mipmapBlur
          luminanceThreshold={preset.bloomThreshold}
          intensity={preset.bloomIntensity}
          radius={preset.bloomRadius}
        />
        <Vignette offset={preset.vignetteOffset} darkness={preset.vignetteDarkness} />
      </EffectComposer>
    </>
  );
};

// 텍스처/록 모델 preload는 홈 씬 마운트 경로(HomeCanvas)에서만 수행
