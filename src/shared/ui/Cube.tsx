'use client';

import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import type React from 'react';
import { useRef } from 'react';
import type * as three from 'three';

type CubeModelProps = {
  position: [number, number, number];
} & React.ComponentProps<'group'>;

export function CubeModel({ position, ...props }: CubeModelProps) {
  const { nodes, materials } = useGLTF('/tesseract_cube.glb');
  const textRef = useRef<three.Mesh | null>(null);
  const cubeRef = useRef<three.Group | null>(null);

  // Animation for the cube when hovered
  useFrame((state, delta) => {
    if (cubeRef.current) {
      cubeRef.current.rotation.y += delta * 0.5;

      // Optional animation for text
      if (textRef.current) {
        textRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 2;
      }
    }
  });

  return (
    <group {...props} dispose={null} scale={0.5} position={position}>
      <group ref={cubeRef}>
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.Cube_Material_0 as three.Mesh).geometry}
          material={materials.Material}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={100}
        />
      </group>
    </group>
  );
}

useGLTF.preload('/tesseract_cube.glb');
