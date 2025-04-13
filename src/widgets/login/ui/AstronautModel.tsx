'use client';

import { OrbitControls, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { useRef } from 'react';
import * as three from 'three';

const AstronautModel = (props: any) => {
  const { nodes, materials } = useGLTF('/cute_astronaut.glb');
  const groupRef = useRef<three.Group>(null);
  const time = useRef(0);

  useFrame((state, delta) => {
    if (groupRef.current) {
      time.current += delta;
      // 부드러운 떠다니는 효과
      groupRef.current.position.y = Math.sin(time.current * 0.5) * 0.2;
      // 천천히 회전하는 효과
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <Physics gravity={[0, 0, 0]}>
      <group {...props} dispose={null}>
        <group ref={groupRef} scale={0.01}>
          <mesh
            castShadow
            receiveShadow
            geometry={(nodes.Mesh_0_Material_0_0 as any).geometry}
            material={materials.Material_0}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          />
        </group>
      </group>
      <OrbitControls />
    </Physics>
  );
};

export default AstronautModel;
