'use client';

import { useGLTF, useTexture } from '@react-three/drei';
import { useMemo } from 'react';
import * as three from 'three';

type BakedGltfProps = {
  model: string;
  texture: string;
  hide?: string[];
  nudge?: readonly (readonly [string, readonly [number, number, number]])[];
};

const GRADE_CHUNK = `
#include <map_fragment>
float luma = dot(diffuseColor.rgb, vec3(0.22, 0.55, 0.23));
vec3 graded = vec3(
  diffuseColor.r * 0.36 + luma * 0.06,
  diffuseColor.g * 0.5 + luma * 0.1,
  diffuseColor.b * 0.98 + luma * 0.24
);
graded = mix(graded, vec3(0.07, 0.06, 0.22), 0.2);
graded += vec3(0.12, 0.42, 0.95) * pow(luma, 3.1) * 0.62;
graded += vec3(0.62, 0.16, 0.9) * smoothstep(0.52, 1.0, luma) * 0.14;
diffuseColor.rgb = graded;
`;

const EMPTY_HIDE: string[] = [];
const EMPTY_NUDGE: readonly (readonly [string, readonly [number, number, number]])[] = [];

export const BakedGltf = ({ model, texture, hide = EMPTY_HIDE, nudge = EMPTY_NUDGE }: BakedGltfProps) => {
  const gltf = useGLTF(model);
  const map = useTexture(texture);

  const scene = useMemo(() => {
    map.flipY = false;
    map.colorSpace = three.SRGBColorSpace;
    const material = new three.MeshBasicMaterial({ map, toneMapped: false, fog: true });
    material.customProgramCacheKey = () => 'void-baked-grade';
    material.onBeforeCompile = (shader) => {
      shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>', GRADE_CHUNK);
    };
    const hidden = new Set(hide);
    const offsets = new Map(nudge);
    const clone = gltf.scene.clone(true);
    clone.traverse((child) => {
      const mesh = child as three.Mesh;
      if (!mesh.isMesh) {
        return;
      }
      if (hidden.has(mesh.name)) {
        mesh.visible = false;
        return;
      }
      mesh.scale.setScalar(900);
      const offset = offsets.get(mesh.name);
      if (offset) {
        mesh.position.x += offset[0];
        mesh.position.y += offset[1];
        mesh.position.z += offset[2];
      }
      mesh.material = material;
    });
    return clone;
  }, [gltf.scene, hide, map, nudge]);

  return <primitive object={scene} />;
};
