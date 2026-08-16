'use client';

import { useGLTF, useTexture } from '@react-three/drei';
import { useMemo } from 'react';
import * as three from 'three';
import { CYBER_COMPUTER } from './cyber-computer';

const isTowerMesh = (name: string) => name === 'Drive' || name.startsWith('System_unit');
const TOWER_SHIFT = { x: -50, y: -435, z: 12 };

export const CyberpunkComputer = () => {
  const gltf = useGLTF(CYBER_COMPUTER.model);
  const map = useTexture(CYBER_COMPUTER.texture);

  const scene = useMemo(() => {
    map.flipY = false;
    map.colorSpace = three.SRGBColorSpace;
    const material = new three.MeshStandardMaterial({
      map,
      color: '#c8d2de',
      metalness: 0.18,
      roughness: 0.52,
      emissive: '#ffffff',
      emissiveMap: map,
      emissiveIntensity: 0.32,
      envMapIntensity: 0,
      toneMapped: false,
      fog: true,
    });
    const clone = gltf.scene.clone(true);
    clone.traverse((child) => {
      const mesh = child as three.Mesh;
      if (!mesh.isMesh) {
        return;
      }
      mesh.material = material;
      mesh.castShadow = false;
      mesh.receiveShadow = false;
      if (isTowerMesh(mesh.name)) {
        mesh.position.x += TOWER_SHIFT.x;
        mesh.position.y += TOWER_SHIFT.y;
        mesh.position.z += TOWER_SHIFT.z;
      }
    });
    return clone;
  }, [gltf.scene, map]);

  return (
    <group>
      <group position={CYBER_COMPUTER.position} rotation={CYBER_COMPUTER.rotation} scale={CYBER_COMPUTER.scale}>
        <primitive object={scene} />
      </group>
    </group>
  );
};

useGLTF.preload(CYBER_COMPUTER.model);
useTexture.preload(CYBER_COMPUTER.texture);
