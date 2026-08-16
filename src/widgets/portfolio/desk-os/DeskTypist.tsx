'use client';

import { useAnimations, useGLTF } from '@react-three/drei';
import { useEffect, useMemo, useRef } from 'react';
import * as three from 'three';
import { DESK_TYPIST } from './cyber-computer';

export const DeskTypist = () => {
  const group = useRef<three.Group>(null);
  const { nodes, materials, animations } = useGLTF(DESK_TYPIST.model);
  const { actions } = useAnimations(animations, group);

  const material = useMemo(() => {
    const next = (materials.Pele as three.MeshStandardMaterial).clone();
    next.color.set('#b7c2ce');
    next.metalness = 0.08;
    next.roughness = 0.68;
    next.emissive.set('#243044');
    next.emissiveIntensity = 0.28;
    next.toneMapped = false;
    next.envMapIntensity = 0;
    return next;
  }, [materials]);

  useEffect(() => {
    for (const action of Object.values(actions)) {
      action?.reset().setLoop(three.LoopRepeat, Number.POSITIVE_INFINITY).play();
    }
  }, [actions]);

  const mesh = nodes.Cylinder_Pele_0 as three.SkinnedMesh;

  return (
    <group
      ref={group}
      position={DESK_TYPIST.position}
      rotation={DESK_TYPIST.rotation}
      scale={DESK_TYPIST.scale}
      dispose={null}
    >
      <group name='Scene'>
        <group name='Armature' rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <skinnedMesh
            name='Cylinder_Pele_0'
            geometry={mesh.geometry}
            material={material}
            skeleton={mesh.skeleton}
            frustumCulled={false}
          />
          <primitive object={nodes.mixamorigHips as three.Object3D} />
        </group>
      </group>
    </group>
  );
};

useGLTF.preload(DESK_TYPIST.model);
