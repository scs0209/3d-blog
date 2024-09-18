'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Box, Sphere } from '@react-three/drei';
import * as THREE from 'three';

const Scene = () => {
  const platformRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (platformRef.current) {
      platformRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <group ref={platformRef}>
      <Box args={[4, 0.2, 4]} position={[0, -1, 0]}>
        <meshStandardMaterial color="#f0e6d9" />
      </Box>

      <Box args={[1, 1, 1]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#808080" />
      </Box>

      <Text position={[-1.5, 1, 0]} fontSize={0.5} color="#000000">
        MODE DESIGN
      </Text>

      <Text position={[1.5, 1, 0]} fontSize={0.5} color="#000000">
        3D
      </Text>

      <Sphere args={[0.2]} position={[-1, 0, 1]}>
        <meshStandardMaterial color="#ff9966" />
      </Sphere>

      <Sphere args={[0.15]} position={[1, 0.5, -1]}>
        <meshStandardMaterial color="#000000" />
      </Sphere>

      {/* Add more 3D elements to match the image */}
    </group>
  );
};

export default Scene;
