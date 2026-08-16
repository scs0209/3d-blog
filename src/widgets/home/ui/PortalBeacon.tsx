'use client';

import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as three from 'three';
import { COSMOS_PORTALS, type CosmosPortal, type CosmosPortalId } from '@/widgets/home/model/cosmos-portals';

let sharedGlowTexture: three.CanvasTexture | null | undefined;

const createSoftGlow = () => {
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
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(255,255,255,0.95)');
  g.addColorStop(0.22, 'rgba(255,255,255,0.4)');
  g.addColorStop(0.55, 'rgba(255,255,255,0.1)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const texture = new three.CanvasTexture(canvas);
  texture.colorSpace = three.SRGBColorSpace;
  return texture;
};

const getSoftGlow = () => {
  if (sharedGlowTexture === undefined) {
    sharedGlowTexture = createSoftGlow();
  }
  return sharedGlowTexture;
};

const PARTICLE_COUNT = 28;

const PortalReveal = ({
  portal,
  active,
}: {
  portal: CosmosPortal;
  active: boolean;
}) => {
  const rootRef = useRef<three.Group>(null);
  const progress = useRef(0);
  const lastEase = useRef(-1);
  const { scene } = useGLTF(portal.revealModel);

  const prepared = useMemo(() => {
    const root = scene.clone(true);
    const fadeMaterials: three.Material[] = [];
    root.traverse((obj) => {
      if (!(obj as three.Mesh).isMesh) {
        return;
      }
      const mesh = obj as three.Mesh;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      const source = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      const tinted = source.map((mat) => {
        if (!mat) {
          return mat;
        }
        const next = mat.clone();
        if ('emissive' in next && next.emissive instanceof three.Color) {
          next.emissive.lerp(new three.Color(portal.accent), 0.35);
          if ('emissiveIntensity' in next) {
            (next as three.MeshStandardMaterial).emissiveIntensity = 0.45;
          }
        }
        if ('transparent' in next) {
          next.transparent = true;
        }
        if (next && 'opacity' in next) {
          fadeMaterials.push(next);
        }
        return next;
      });
      mesh.material = tinted.length === 1 ? tinted[0]! : tinted;
    });

    const box = new three.Box3().setFromObject(root);
    const size = new three.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z, 0.001);
    const scale = portal.revealHeight / maxDim;
    root.scale.setScalar(scale);

    box.setFromObject(root);
    const center = new three.Vector3();
    box.getCenter(center);
    root.position.x -= center.x;
    root.position.z -= center.z;
    root.position.y -= box.min.y;

    return { root, fadeMaterials };
  }, [scene, portal.accent, portal.revealHeight]);

  useEffect(() => {
    return () => {
      for (const mat of prepared.fadeMaterials) {
        mat.dispose();
      }
    };
  }, [prepared]);

  useFrame((_, delta) => {
    const group = rootRef.current;
    if (!group) {
      return;
    }
    progress.current = three.MathUtils.damp(progress.current, active ? 1 : 0, 5.5, delta);
    const p = progress.current;
    const ease = p * p * (3 - 2 * p);
    group.visible = ease > 0.01;
    group.scale.setScalar(0.15 + ease * 0.85);
    group.position.y = -0.85 + ease * 1.05;
    group.rotation.y += delta * (portal.id === 'portfolio' ? 0.2 + ease * 0.25 : 0.35 + ease * 0.55);

    if (Math.abs(ease - lastEase.current) < 0.002 && !active && ease < 0.01) {
      return;
    }
    lastEase.current = ease;
    for (const mat of prepared.fadeMaterials) {
      if ('opacity' in mat) {
        mat.opacity = 0.15 + ease * 0.85;
      }
    }
  });

  return (
    <group ref={rootRef} position={[0, -0.85, 0]} dispose={null}>
      <primitive object={prepared.root} />
    </group>
  );
};

type PortalBeaconProps = {
  portal: CosmosPortal;
  active: boolean;
};

/** 네온 링 + 빛기둥 + 근접 시 모델 리빌 */
export const PortalBeacon = ({ portal, active }: PortalBeaconProps) => {
  const ringRef = useRef<three.Mesh>(null);
  const outerRingRef = useRef<three.Mesh>(null);
  const beamRef = useRef<three.Sprite>(null);
  const particlesRef = useRef<three.Points>(null);
  const glowMap = useMemo(() => getSoftGlow(), []);
  const color = useMemo(() => new three.Color(portal.accent), [portal.accent]);

  const particleData = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const speeds = new Float32Array(PARTICLE_COUNT);
    const radii = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const r = 0.25 + Math.random() * 1.1;
      radii[i] = r;
      speeds[i] = 0.45 + Math.random() * 0.9;
      positions[i * 3] = Math.cos(angle) * r;
      positions[i * 3 + 1] = Math.random() * 3.8;
      positions[i * 3 + 2] = Math.sin(angle) * r;
    }
    return { positions, speeds, radii };
  }, []);

  const particleGeometry = useMemo(() => {
    const geometry = new three.BufferGeometry();
    geometry.setAttribute('position', new three.BufferAttribute(particleData.positions, 3));
    return geometry;
  }, [particleData.positions]);

  useEffect(() => {
    return () => {
      particleGeometry.dispose();
    };
  }, [particleGeometry]);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    const ring = ringRef.current;
    if (ring) {
      const pulse = 1 + Math.sin(t * (active ? 2.2 : 1.1)) * (active ? 0.05 : 0.025);
      ring.scale.set(pulse, pulse, pulse);
      (ring.material as three.MeshBasicMaterial).opacity = active ? 0.95 : 0.45;
    }
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z = t * (active ? 0.35 : 0.12);
      (outerRingRef.current.material as three.MeshBasicMaterial).opacity = active ? 0.55 : 0.22;
    }
    if (beamRef.current) {
      const mat = beamRef.current.material as three.SpriteMaterial;
      mat.opacity = active ? 0.42 + Math.sin(t * 2.4) * 0.06 : 0.16;
    }
    const points = particlesRef.current;
    if (points) {
      const pos = points.geometry.attributes.position as three.BufferAttribute;
      const arr = pos.array as Float32Array;
      for (let i = 0; i < PARTICLE_COUNT; i += 1) {
        const yIndex = i * 3 + 1;
        const speed = particleData.speeds[i] ?? 0.5;
        const currentY = arr[yIndex] ?? 0;
        const nextY = currentY + speed * delta * (active ? 1.35 : 0.45);
        arr[yIndex] = nextY;
        if (nextY > 4.6) {
          arr[yIndex] = 0;
          const angle = Math.random() * Math.PI * 2;
          const r = particleData.radii[i] ?? 0.4;
          arr[i * 3] = Math.cos(angle) * r;
          arr[i * 3 + 2] = Math.sin(angle) * r;
        }
      }
      pos.needsUpdate = true;
      const mat = points.material as three.PointsMaterial;
      mat.opacity = active ? 0.85 : 0.28;
      mat.size = active ? 0.11 : 0.055;
    }
  });

  return (
    <group position={portal.position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <circleGeometry args={[1.55, 48]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={active ? 0.18 : 0.08}
          depthWrite={false}
          toneMapped={false}
          blending={three.AdditiveBlending}
        />
      </mesh>

      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.07, 0]}>
        <ringGeometry args={[1.2, 1.48, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.45} depthWrite={false} toneMapped={false} />
      </mesh>

      <mesh ref={outerRingRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.09, 0]}>
        <ringGeometry args={[1.7, 1.82, 64]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.22}
          depthWrite={false}
          toneMapped={false}
          blending={three.AdditiveBlending}
        />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.08, 0]}>
        <ringGeometry args={[0.5, 0.68, 48]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={active ? 0.7 : 0.28}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {glowMap ? (
        <>
          <sprite position={[0, 0.25, 0]} scale={active ? [4.2, 4.2, 1] : [2.8, 2.8, 1]} renderOrder={2}>
            <spriteMaterial
              map={glowMap}
              color={color}
              transparent
              depthWrite={false}
              blending={three.AdditiveBlending}
              opacity={active ? 0.7 : 0.32}
              toneMapped={false}
            />
          </sprite>
          {portal.kind === 'door' ? null : (
            <sprite ref={beamRef} position={[0, 2.6, 0]} scale={active ? [1.7, 6.2, 1] : [1.1, 4.2, 1]} renderOrder={1}>
              <spriteMaterial
                map={glowMap}
                color={color}
                transparent
                depthWrite={false}
                blending={three.AdditiveBlending}
                opacity={0.16}
                toneMapped={false}
              />
            </sprite>
          )}
        </>
      ) : null}

      {portal.kind === 'door' ? null : (
        <points ref={particlesRef} geometry={particleGeometry}>
          <pointsMaterial
            color={color}
            size={0.06}
            transparent
            opacity={0.28}
            depthWrite={false}
            blending={three.AdditiveBlending}
            toneMapped={false}
            sizeAttenuation
          />
        </points>
      )}

      <pointLight color={color} intensity={active ? 9 : 3.2} distance={12} decay={2} position={[0, 1.1, 0]} />
      <pointLight color={color} intensity={active ? 4 : 1.4} distance={6} decay={2} position={[0, 0.35, 0]} />

      {portal.kind === 'door' ? null : <PortalReveal portal={portal} active={active} />}
    </group>
  );
};

type ResolveActivePortalArgs = {
  avatarX: number;
  avatarZ: number;
  portals: readonly CosmosPortal[];
};

export const resolveActivePortalId = ({
  avatarX,
  avatarZ,
  portals,
}: ResolveActivePortalArgs): CosmosPortalId | null => {
  let bestId: CosmosPortalId | null = null;
  let bestDist = Number.POSITIVE_INFINITY;

  for (const portal of portals) {
    const [px, , pz] = portal.position;
    const dist = Math.hypot(avatarX - px, avatarZ - pz);
    if (dist <= portal.radius && dist < bestDist) {
      bestDist = dist;
      bestId = portal.id;
    }
  }

  return bestId;
};

for (const portal of COSMOS_PORTALS) {
  useGLTF.preload(portal.revealModel);
}
