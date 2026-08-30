'use client';

import { useFrame } from '@react-three/fiber';
import { useLayoutEffect, useRef } from 'react';
import type { Group, Mesh } from 'three';
import { CHAIR_FIT } from './cyber-computer';
import { getExitChairOffsetZ } from './desk-exit';

const LEATHER = {
  color: '#4a5566',
  metalness: 0.06,
  roughness: 0.62,
  emissive: '#1a2030',
  emissiveIntensity: 0.22,
} as const;

const CHROME = {
  color: '#c5d0dc',
  metalness: 0.22,
  roughness: 0.4,
  emissive: '#2a3344',
  emissiveIntensity: 0.18,
} as const;

const DARK_METAL = {
  color: '#6a7584',
  metalness: 0.2,
  roughness: 0.48,
  emissive: '#1c2432',
  emissiveIntensity: 0.2,
} as const;

const SPOKE_ANGLES = [0, 1, 2, 3, 4].map((index) => (index * Math.PI * 2) / 5);

const ChairMesh = () => {
  return (
    <group>
      {SPOKE_ANGLES.map((angle) => (
        <group key={angle} rotation={[0, angle, 0]}>
          <mesh position={[0.2, 0.035, 0]}>
            <boxGeometry args={[0.34, 0.035, 0.055]} />
            <meshStandardMaterial {...CHROME} />
          </mesh>
          <mesh position={[0.37, 0.028, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.042, 0.042, 0.05, 20]} />
            <meshStandardMaterial {...DARK_METAL} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.07, 0.08, 0.04, 24]} />
        <meshStandardMaterial {...CHROME} />
      </mesh>
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.032, 0.04, 0.42, 20]} />
        <meshStandardMaterial {...CHROME} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.52, 0.07, 0.5]} />
        <meshStandardMaterial {...LEATHER} />
      </mesh>
      <mesh position={[0, 0.56, 0.02]}>
        <boxGeometry args={[0.48, 0.045, 0.44]} />
        <meshStandardMaterial {...LEATHER} />
      </mesh>
      <group position={[0, 0.86, 0.2]} rotation={[0.16, 0, 0]}>
        <mesh>
          <boxGeometry args={[0.48, 0.58, 0.07]} />
          <meshStandardMaterial {...LEATHER} />
        </mesh>
        <mesh position={[0, 0.36, 0.01]}>
          <boxGeometry args={[0.4, 0.12, 0.08]} />
          <meshStandardMaterial {...LEATHER} />
        </mesh>
      </group>
      {[-1, 1].map((side) => (
        <group key={side} position={[0.24 * side, 0.62, 0]}>
          <mesh position={[0, 0.08, 0]} rotation={[0, 0, side * 0.08]}>
            <cylinderGeometry args={[0.018, 0.018, 0.28, 12]} />
            <meshStandardMaterial {...DARK_METAL} />
          </mesh>
          <mesh position={[0, 0.2, -0.02]} rotation={[Math.PI / 2.4, 0, 0]}>
            <cylinderGeometry args={[0.016, 0.016, 0.22, 12]} />
            <meshStandardMaterial {...DARK_METAL} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

type MetalOfficeChairProps = {
  exitProgress?: number | null;
};

export const MetalOfficeChair = ({ exitProgress = null }: MetalOfficeChairProps) => {
  const groupRef = useRef<Group>(null);
  const localH = 1.18;
  const scale = (CHAIR_FIT.max[1] - CHAIR_FIT.min[1]) / localH;
  const cx = (CHAIR_FIT.min[0] + CHAIR_FIT.max[0]) / 2;
  const cy = (CHAIR_FIT.min[1] + CHAIR_FIT.max[1]) / 2;
  const cz = (CHAIR_FIT.min[2] + CHAIR_FIT.max[2]) / 2;

  useLayoutEffect(() => {
    groupRef.current?.traverse((child) => {
      const mesh = child as Mesh;
      if (!mesh.isMesh) {
        return;
      }
      mesh.castShadow = false;
      mesh.receiveShadow = false;
    });
  }, []);

  useFrame(() => {
    if (!groupRef.current) {
      return;
    }
    const pushZ = exitProgress === null ? 0 : getExitChairOffsetZ(exitProgress);
    groupRef.current.position.set(cx, cy, cz + pushZ);
  });

  return (
    <group ref={groupRef} position={[cx, cy, cz]} scale={scale}>
      <group position={[0, -localH / 2, 0]}>
        <ChairMesh />
      </group>
    </group>
  );
};
