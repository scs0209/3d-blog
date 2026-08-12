'use client';

import { useRef } from 'react';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as three from 'three';

const cartoonGlowMaterial = new three.MeshStandardMaterial({
  color: '#ffff00',
  emissive: '#ffaa00',
  emissiveIntensity: 2.0,
  transparent: true,
  opacity: 0.95,
});

const cartoonActiveMaterial = new three.MeshStandardMaterial({
  color: '#ffffff',
  emissive: '#ffffff',
  emissiveIntensity: 1.5,
  transparent: true,
  opacity: 0.98,
});

const cinematicMaterial = new three.MeshStandardMaterial({
  color: '#fff6e8',
  emissive: '#ff9a3c',
  emissiveIntensity: 2.2,
  transparent: true,
  opacity: 1,
  toneMapped: false,
});

const cinematicActiveMaterial = new three.MeshStandardMaterial({
  color: '#ffffff',
  emissive: '#ffe2b8',
  emissiveIntensity: 2.6,
  transparent: true,
  opacity: 1,
  toneMapped: false,
});

type SunProps = React.ComponentProps<'group'> & {
  isCubeActive?: boolean;
  /** cinematic: 지평선 warm sun (네온 옐로 대신) */
  mood?: 'default' | 'cinematic';
};

export function Sun({ isCubeActive, mood = 'default', ...props }: SunProps) {
  const meshRef = useRef<three.Mesh>(null);
  const isCinematic = mood === 'cinematic';

  const material = isCinematic
    ? isCubeActive
      ? cinematicActiveMaterial
      : cinematicMaterial
    : isCubeActive
      ? cartoonActiveMaterial
      : cartoonGlowMaterial;

  return (
    <>
      <group {...props} dispose={null}>
        <mesh ref={meshRef} castShadow={false} receiveShadow={false} material={material}>
          <sphereGeometry args={[1, 48, 48]} />
        </mesh>
        <pointLight
          position={[0, 0, 0]}
          color={isCinematic ? (isCubeActive ? '#fff0d8' : '#ffb35c') : isCubeActive ? '#ffffff' : '#ffff00'}
          intensity={isCinematic ? (isCubeActive ? 18 : 14) : isCubeActive ? 20 : 15}
          distance={isCinematic ? 280 : 300}
          decay={2}
        />
      </group>
      <EffectComposer>
        <Bloom
          mipmapBlur
          luminanceThreshold={isCinematic ? 0.55 : 1.2}
          radius={isCinematic ? 1.05 : 0.8}
          intensity={isCinematic ? 1.1 : 0.3}
        />
      </EffectComposer>
    </>
  );
}
