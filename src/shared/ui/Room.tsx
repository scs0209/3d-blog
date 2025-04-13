'use client';

import { useGLTF } from '@react-three/drei';
import React from 'react';

type ModelProps = {
  // Define the props type to avoid implicit 'any' type
  [key: string]: any; // You can replace 'any' with a more specific type if known
};

export function Model(props: ModelProps) {
  const { nodes, materials } = useGLTF('/the_control_room.glb');

  // Optional: Check if nodes and materials are defined before rendering
  if (!nodes || !materials) {
    return null; // or some fallback UI
  }

  return (
    <group {...props} dispose={null} scale={1}>
      <group>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_2?.geometry} // Optional chaining to avoid undefined error
          material={materials.initialShadingGroup}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_3?.geometry} // Optional chaining to avoid undefined error
          material={materials.lambert2SG}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_4?.geometry} // Optional chaining to avoid undefined error
          material={materials.pasted__lambert2SG}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_5?.geometry} // Optional chaining to avoid undefined error
          material={materials.pasted__lambert2SG}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_6?.geometry} // Optional chaining to avoid undefined error
          material={materials.lambert3SG}
        />
      </group>
    </group>
  );
}

useGLTF.preload('/the_control_room.glb');
