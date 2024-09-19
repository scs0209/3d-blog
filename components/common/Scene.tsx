'use client';

import { useRef } from 'react';
import {
  Text,
  Box,
  Sphere,
  useMatcapTexture,
  MeshReflectorMaterial,
} from '@react-three/drei';
import * as THREE from 'three';

const Scene = () => {
  const [matcapTexture] = useMatcapTexture('2E2E2D_7D7C76_A3A39F_949C94', 1024);
  const platformRef = useRef<THREE.Group>(null);
  const planeRef = useRef<THREE.Mesh>(null);

  return (
    <>
      <group ref={platformRef}>
        <Box args={[6, 0.2, 4]} position={[0, -1, 0]}>
          <meshMatcapMaterial matcap={matcapTexture} color="#f0e6d9" />
        </Box>

        <mesh
          rotation-x={-Math.PI / 2}
          position={[0, 0.01, 0]}
          scale={[200, 200, 200]}
          receiveShadow
          renderOrder={100000}
        >
          <planeGeometry />
          <shadowMaterial transparent color="#251005" opacity={0.25} />
        </mesh>

        {/* <mesh position={[0, -1.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[50, 50]} />
          <MeshReflectorMaterial
            mirror={0.2}
            blur={[300, 30]}
            resolution={2048}
            mixBlur={1}
            mixStrength={180}
            roughness={1}
            depthScale={1.2}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#f0e6d9"
            metalness={0.8}
          />
        </mesh> */}

        <mesh ref={planeRef} position={[0, 1, -2]} rotation={[0, 0, 0]}>
          <planeGeometry args={[6, 4]} />
          <MeshReflectorMaterial
            resolution={512} // 해상도 설정
            mirror={0.5} // 반사 강도, 0으로 설정하면 반사 안됨
            blur={[100, 100]} // 블러링 정도, [x, y] 값
            mixBlur={0.5} // 블러링 효과 강도
            mixStrength={1.5} // 반사 강도
            depthScale={0.5} // 깊이감 조정
            minDepthThreshold={0.9}
            maxDepthThreshold={1.2}
            color="#ffffff" // 거울 색상
            metalness={0.6} // 금속성
            roughness={0.4} // 거친 정도
            transparent
            opacity={0.5}
          />
        </mesh>

        <Box args={[1, 1, 1]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#e0d9d2" />
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
    </>
  );
};

export default Scene;
