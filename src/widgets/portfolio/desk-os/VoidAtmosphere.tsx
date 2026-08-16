'use client';

import { Stars } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';
import { useMemo, useRef } from 'react';
import * as three from 'three';
import { VOID } from './void-theme';

const NEBULAS = [
  { position: [-24000, 9000, -28000] as const, color: '#4a2a88', scale: 38000, opacity: 0.55 },
  { position: [26000, 6000, -18000] as const, color: '#1a3a78', scale: 32000, opacity: 0.48 },
  { position: [8000, 14000, 22000] as const, color: '#6a2a68', scale: 28000, opacity: 0.42 },
  { position: [-12000, -4000, 26000] as const, color: '#2a1860', scale: 42000, opacity: 0.5 },
];

const createGlowMap = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext('2d');
  if (!context) {
    return null;
  }
  const gradient = context.createRadialGradient(128, 128, 8, 128, 128, 128);
  gradient.addColorStop(0, 'rgba(255,255,255,0.95)');
  gradient.addColorStop(0.35, 'rgba(255,255,255,0.28)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 256, 256);
  const map = new three.CanvasTexture(canvas);
  map.needsUpdate = true;
  return map;
};

const NebulaVeil = ({
  position,
  color,
  scale,
  opacity,
  spin,
  map,
}: {
  position: readonly [number, number, number];
  color: string;
  scale: number;
  opacity: number;
  spin: number;
  map: three.Texture;
}) => {
  const meshRef = useRef<three.Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) {
      return;
    }
    meshRef.current.rotation.z += delta * spin;
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <meshBasicMaterial
        map={map}
        color={color}
        transparent
        opacity={opacity}
        blending={three.AdditiveBlending}
        depthWrite={false}
        side={three.DoubleSide}
        toneMapped={false}
      />
    </mesh>
  );
};

const SNOW_COUNT = 780;
const SNOW_SPAN = 28000;
const SNOW_RESET_Y = -4200;
const SNOW_TOP_Y = 15000;

const snowVertex = `
attribute float aPhase;
attribute float aSize;
attribute float aSpark;
uniform float uTime;
uniform float uPixelRatio;
varying float vTwinkle;

void main() {
  float dim = 0.52;
  float flash = 0.0;
  if (aSpark > 0.5) {
    float beat = sin(uTime * (0.28 + aPhase * 0.22) + aPhase * 6.2831);
    flash = pow(max(beat, 0.0), 14.0);
  }
  vTwinkle = dim + flash * 1.35;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = aSize * (0.9 + flash * 0.9) * uPixelRatio * (560.0 / max(1.0, -mvPosition.z));
  gl_Position = projectionMatrix * mvPosition;
}
`;

const snowFragment = `
uniform vec3 uColor;
varying float vTwinkle;

void main() {
  vec2 uv = gl_PointCoord - vec2(0.5);
  float dist = length(uv);
  float core = smoothstep(0.48, 0.06, dist);
  float halo = smoothstep(0.5, 0.18, dist) * 0.45;
  float alpha = (core + halo) * vTwinkle;
  if (alpha < 0.02) discard;
  vec3 color = uColor * (0.5 + vTwinkle * 1.2);
  gl_FragColor = vec4(color, alpha);
}
`;

const VoidMotes = () => {
  const pointsRef = useRef<three.Points>(null);
  const drift = useRef<Float32Array | null>(null);
  const material = useMemo(
    () =>
      new three.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uPixelRatio: { value: typeof window === 'undefined' ? 1 : Math.min(window.devicePixelRatio, 2) },
          uColor: { value: new three.Color('#d4f3ff') },
        },
        vertexShader: snowVertex,
        fragmentShader: snowFragment,
        transparent: true,
        blending: three.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
        fog: false,
      }),
    [],
  );

  const geometry = useMemo(() => {
    const positions = new Float32Array(SNOW_COUNT * 3);
    const phases = new Float32Array(SNOW_COUNT);
    const sizes = new Float32Array(SNOW_COUNT);
    const sparks = new Float32Array(SNOW_COUNT);
    const motion = new Float32Array(SNOW_COUNT * 4);
    for (let i = 0; i < SNOW_COUNT; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * SNOW_SPAN;
      positions[i * 3 + 1] = Math.random() * (SNOW_TOP_Y + 2000) - 2000;
      positions[i * 3 + 2] = (Math.random() - 0.5) * SNOW_SPAN;
      phases[i] = Math.random();
      sizes[i] = 28 + Math.random() * 26;
      sparks[i] = Math.random() < 0.12 ? 1 : 0;
      motion[i * 4] = (Math.random() - 0.5) * 70;
      motion[i * 4 + 1] = 240 + Math.random() * 420;
      motion[i * 4 + 2] = (Math.random() - 0.5) * 70;
      motion[i * 4 + 3] = Math.random() * Math.PI * 2;
    }
    drift.current = motion;
    const geo = new three.BufferGeometry();
    geo.setAttribute('position', new three.BufferAttribute(positions, 3));
    geo.setAttribute('aPhase', new three.BufferAttribute(phases, 1));
    geo.setAttribute('aSize', new three.BufferAttribute(sizes, 1));
    geo.setAttribute('aSpark', new three.BufferAttribute(sparks, 1));
    return geo;
  }, []);

  useFrame((state, delta) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
    const attr = pointsRef.current?.geometry.getAttribute('position');
    const motion = drift.current;
    if (!attr || !motion) {
      return;
    }
    const positions = attr.array as Float32Array;
    const time = state.clock.elapsedTime;
    for (let i = 0; i < SNOW_COUNT; i += 1) {
      const px = i * 3;
      const mx = i * 4;
      const phase = motion[mx + 3];
      positions[px] += (motion[mx] + Math.sin(time * 0.45 + phase) * 48) * delta;
      positions[px + 1] -= motion[mx + 1] * delta;
      positions[px + 2] += (motion[mx + 2] + Math.cos(time * 0.38 + phase) * 36) * delta;
      if (positions[px + 1] < SNOW_RESET_Y) {
        positions[px] = (Math.random() - 0.5) * SNOW_SPAN;
        positions[px + 1] = SNOW_TOP_Y + Math.random() * 3500;
        positions[px + 2] = (Math.random() - 0.5) * SNOW_SPAN;
      }
    }
    attr.needsUpdate = true;
  });

  return <points ref={pointsRef} geometry={geometry} material={material} frustumCulled={false} />;
};

export const VoidAtmosphere = () => {
  const glowMap = useMemo(() => createGlowMap(), []);

  return (
    <>
      <color attach='background' args={[VOID.bg]} />
      <fog attach='fog' args={[VOID.fog, 14000, 78000]} />
      <Stars radius={82000} depth={42000} count={4600} factor={160} saturation={0.42} fade speed={0.18} />
      {glowMap
        ? NEBULAS.map((nebula, index) => (
            <NebulaVeil
              key={`${nebula.position.join('-')}`}
              {...nebula}
              map={glowMap}
              spin={index % 2 === 0 ? 0.008 : -0.006}
            />
          ))
        : null}
      <VoidMotes />
      <pointLight position={[0, 1400, 900]} color={VOID.cyan} intensity={0.18} distance={5000} decay={2} />
      <pointLight position={[-2200, 2200, -1200]} color={VOID.violet} intensity={0.12} distance={8000} decay={2} />
      <EffectComposer multisampling={4} enableNormalPass={false}>
        <Bloom mipmapBlur luminanceThreshold={0.62} intensity={0.55} radius={0.58} />
        <Vignette offset={0.18} darkness={0.68} />
      </EffectComposer>
    </>
  );
};
