'use client';

import { useGLTF } from '@react-three/drei';
import { useMemo } from 'react';
import * as three from 'three';

type FittedGltfProps = {
  model: string;
  rotY?: number;
  min: readonly [number, number, number];
  max: readonly [number, number, number];
};

const toMetal = (source: three.Material) => {
  const std = source as three.MeshStandardMaterial;
  const color = std.color?.clone() ?? new three.Color('#1a1f2a');
  color.lerp(new three.Color('#8a9aac'), 0.55);
  return new three.MeshStandardMaterial({
    color,
    map: std.map ?? null,
    metalness: 0.16,
    roughness: 0.62,
    emissive: new three.Color('#1a2434'),
    emissiveIntensity: 0.28,
    envMapIntensity: 0,
    toneMapped: false,
    fog: true,
  });
};

export const FittedGltf = ({ model, rotY = 0, min, max }: FittedGltfProps) => {
  const gltf = useGLTF(model);

  const root = useMemo(() => {
    const inner = gltf.scene.clone(true);
    inner.rotation.y = rotY;
    inner.traverse((child) => {
      const mesh = child as three.Mesh;
      if (!mesh.isMesh) {
        return;
      }
      const source = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      const next = source.map(toMetal);
      mesh.material = next.length === 1 ? next[0]! : next;
      mesh.castShadow = false;
      mesh.receiveShadow = false;
    });
    inner.updateMatrixWorld(true);

    const box = new three.Box3().setFromObject(inner);
    const size = box.getSize(new three.Vector3());
    const center = box.getCenter(new three.Vector3());
    const targetSize = new three.Vector3(max[0] - min[0], max[1] - min[1], max[2] - min[2]);
    const targetCenter = new three.Vector3((min[0] + max[0]) / 2, (min[1] + max[1]) / 2, (min[2] + max[2]) / 2);

    inner.position.set(-center.x, -center.y, -center.z);

    const group = new three.Group();
    group.position.copy(targetCenter);
    group.scale.set(
      size.x === 0 ? 1 : targetSize.x / size.x,
      size.y === 0 ? 1 : targetSize.y / size.y,
      size.z === 0 ? 1 : targetSize.z / size.z,
    );
    group.add(inner);
    return group;
  }, [gltf.scene, max, min, rotY]);

  return <primitive object={root} />;
};
