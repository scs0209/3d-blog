import { useEffect, useRef } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import type * as three from 'three';

export function InspectingPerson(props: any) {
  const group = useRef<three.Group>(null);
  const { nodes, materials, animations } = useGLTF('/inspecting.glb');

  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (actions) {
      for (const action of Object.values(actions)) {
        if (action) {
          action.play();
        }
      }
    }
  }, [actions]);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name='Scene'>
        <group name='6b3e8f562abf4f68b310838f9c86549afbx' rotation={[-Math.PI, 0, 0]} scale={0.01}>
          <group name='RootNode1'>
            <group name='Cylinder' position={[0, 135.854, -243.487]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
          </group>
        </group>
        <group name='Armature' rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <skinnedMesh
            name='Cylinder_Pele_0'
            geometry={(nodes.Cylinder_Pele_0 as three.Mesh)?.geometry}
            material={materials.Pele}
            skeleton={(nodes.Cylinder_Pele_0 as three.SkinnedMesh)?.skeleton}
          />
          <primitive object={nodes.mixamorigHips as three.Object3D} />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload('/inspecting.glb');
