'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as three from 'three';
import { DESK_EXIT_PORTAL } from './desk-exit';

type DeskExitPortalProps = {
  progress: number;
  active: boolean;
};

const portalCenter = new three.Vector3(...DESK_EXIT_PORTAL.center);
const portalRotation = new three.Euler(...DESK_EXIT_PORTAL.rotation);
const { w, h } = DESK_EXIT_PORTAL.size;
const floorY = DESK_EXIT_PORTAL.floorY;

const createPortalTexture = (kind: 'core' | 'glow' | 'reflection') => {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return null;
  }

  if (kind === 'core') {
    const gradient = ctx.createLinearGradient(0, 0, 256, 0);
    gradient.addColorStop(0, 'rgba(255,255,255,0.92)');
    gradient.addColorStop(0.5, 'rgba(255,255,255,1)');
    gradient.addColorStop(1, 'rgba(255,255,255,0.92)');
    ctx.fillStyle = gradient;
    ctx.fillRect(48, 0, 160, 512);
    return canvas;
  }

  if (kind === 'glow') {
    const gradient = ctx.createRadialGradient(128, 256, 8, 128, 256, 220);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.35, 'rgba(255,255,255,0.55)');
    gradient.addColorStop(0.7, 'rgba(220,245,255,0.18)');
    gradient.addColorStop(1, 'rgba(180,220,255,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 512);
    return canvas;
  }

  const gradient = ctx.createLinearGradient(0, 0, 0, 512);
  gradient.addColorStop(0, 'rgba(255,255,255,0.72)');
  gradient.addColorStop(0.45, 'rgba(255,255,255,0.22)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(72, 0, 112, 512);
  return canvas;
};

export const DeskExitPortal = ({ progress, active }: DeskExitPortalProps) => {
  const groupRef = useRef<three.Group>(null);
  const glowMat = useRef<three.MeshBasicMaterial>(null);
  const coreMat = useRef<three.MeshBasicMaterial>(null);
  const spillMat = useRef<three.MeshBasicMaterial>(null);
  const reflectMat = useRef<three.MeshBasicMaterial>(null);
  const lightRef = useRef<three.PointLight>(null);

  const textures = useMemo(() => {
    const glowCanvas = createPortalTexture('glow');
    const coreCanvas = createPortalTexture('core');
    const reflectCanvas = createPortalTexture('reflection');

    const toTexture = (canvas: HTMLCanvasElement | null) => {
      if (!canvas) {
        return null;
      }
      const texture = new three.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    };

    return {
      glow: toTexture(glowCanvas),
      core: toTexture(coreCanvas),
      reflection: toTexture(reflectCanvas),
    };
  }, []);

  useFrame(() => {
    const reveal = active ? Math.min(1, progress / 0.14) : 0;
    const pulse = 0.94 + Math.sin(progress * Math.PI * 4) * 0.04 * reveal;
    const brightness = reveal * pulse;

    if (glowMat.current) {
      glowMat.current.opacity = brightness * 0.95;
    }
    if (coreMat.current) {
      coreMat.current.opacity = Math.min(1, 0.82 + brightness * 0.18);
    }
    if (spillMat.current) {
      spillMat.current.opacity = brightness * 0.42;
    }
    if (reflectMat.current) {
      reflectMat.current.opacity = brightness * 0.55;
    }
    if (lightRef.current) {
      lightRef.current.intensity = 22000 * brightness;
    }
    if (groupRef.current) {
      groupRef.current.visible = brightness > 0.02;
    }
  });

  if (!active && progress <= 0) {
    return null;
  }

  const portalBottomY = portalCenter.y - h / 2;
  const floorDrop = portalBottomY - floorY;

  return (
    <group ref={groupRef} position={portalCenter} rotation={portalRotation}>
      {textures.glow ? (
        <mesh position={[0, 0, -240]} renderOrder={1}>
          <planeGeometry args={[w * 1.55, h * 1.12]} />
          <meshBasicMaterial
            map={textures.glow}
            transparent
            opacity={0}
            ref={glowMat}
            blending={three.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      ) : null}

      <mesh position={[0, 0, -40]} renderOrder={3}>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial color='#ffffff' toneMapped={false} transparent opacity={0} ref={coreMat} />
      </mesh>

      {textures.core ? (
        <mesh position={[0, 0, -20]} renderOrder={4}>
          <planeGeometry args={[w * 0.94, h * 0.98]} />
          <meshBasicMaterial map={textures.core} transparent opacity={0} toneMapped={false} depthWrite={false} />
        </mesh>
      ) : null}

      <mesh position={[0, -h / 2 - 28, 30]} renderOrder={2}>
        <planeGeometry args={[w * 1.08, 56]} />
        <meshBasicMaterial
          color='#ffffff'
          transparent
          opacity={0}
          ref={spillMat}
          blending={three.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {textures.reflection ? (
        <group position={[0, -h / 2 - floorDrop / 2, 180]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]} renderOrder={0}>
            <planeGeometry args={[w * 0.92, floorDrop * 0.95]} />
            <meshBasicMaterial
              map={textures.reflection}
              transparent
              opacity={0}
              ref={reflectMat}
              blending={three.AdditiveBlending}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        </group>
      ) : null}

      <pointLight ref={lightRef} position={[0, 0, -120]} color='#ffffff' distance={18000} decay={2} intensity={0} />
    </group>
  );
};
