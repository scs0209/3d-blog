'use client';

import { useGLTF } from '@react-three/drei';
import type * as three from 'three';

export const Macintosh = (props: any) => {
  const { nodes, materials } = useGLTF('/vintage_computer.glb');
  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]} scale={0.215}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <group scale={[1, 1.45, 1]}>
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Object_4 as three.Mesh)?.geometry}
              material={materials['Computer.Chassis']}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Object_5 as three.Mesh)?.geometry}
              material={materials['Computer.Black']}
            />
          </group>
          <mesh
            castShadow
            receiveShadow
            geometry={(nodes.Object_7 as three.Mesh)?.geometry}
            material={materials.Monkey}
            position={[-0.735, -0.73, 1.462]}
            scale={[0.047, 0.047, 0.006]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={(nodes.Object_9 as three.Mesh)?.geometry}
            material={materials['Computer.Monitor.Glass']}
            position={[0, 0.437, 1.255]}
            scale={[0.97, 0.97, 0.096]}
          />
        </group>
      </group>
    </group>
  );
};

useGLTF.preload('/vintage_computer.glb');
