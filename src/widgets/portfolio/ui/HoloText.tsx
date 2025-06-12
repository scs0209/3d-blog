'use client';

import { Text3D } from '@react-three/drei';
import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import type * as three from 'three';

function Corner({
  x,
  y,
  color = '#a78bfa',
  length = 0.13,
  thickness = 0.035,
  animate = true,
}: {
  x: number;
  y: number;
  color?: string;
  length?: number;
  thickness?: number;
  animate?: boolean;
}) {
  const groupRef = useRef<three.Group>(null);
  const materialRef = useRef<three.MeshStandardMaterial>(null);

  useFrame(({ clock }) => {
    if (animate && groupRef.current && materialRef.current) {
      const time = clock.getElapsedTime();
      // 미세한 위치 흔들림
      const offset = Math.sin(time * 3 + x + y) * 0.005;
      groupRef.current.position.z = 0.03 + offset;
      // 밝기 깜빡임
      materialRef.current.emissiveIntensity = 1.5 + Math.sin(time * 5 + x * y) * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={[x, y, 0.03]}>
      {/* 가로선 */}
      <mesh position={[x > 0 ? -length / 2 : length / 2, 0, 0]}>
        <boxGeometry args={[length, thickness, thickness]} />
        <meshStandardMaterial ref={materialRef} color={color} emissive={color} emissiveIntensity={1.5} />
      </mesh>
      {/* 세로선 */}
      <mesh position={[0, y > 0 ? -length / 2 : length / 2, 0]}>
        <boxGeometry args={[thickness, length, thickness]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} />
      </mesh>
    </group>
  );
}

type HoloTextProps = {
  text: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  color?: string;
};

export function HoloText({ text, position, rotation = [0, 0, 0], scale = 1, color = '#a78bfa' }: HoloTextProps) {
  const textRef = useRef<three.Mesh>(null);
  const [bounds, setBounds] = useState<three.Box3 | null>(null);

  useEffect(() => {
    if (textRef.current) {
      textRef.current.geometry.computeBoundingBox();
      const boundingBox = textRef.current.geometry.boundingBox;
      if (boundingBox) {
        setBounds(boundingBox.clone());
      }
    }
  }, []);

  useFrame((state) => {
    if (textRef.current) {
      const time = state.clock.getElapsedTime();
      textRef.current.position.y = 0 + Math.sin(time * 2) * 0.02;

      const material = textRef.current.material as three.MeshStandardMaterial;
      if (material) {
        material.opacity = 0.8 + Math.sin(time * 3) * 0.1;
        material.emissiveIntensity = 1.5;
      }
    }
  });

  const padding = 0.15 * scale;
  const corners = [];

  if (bounds) {
    const min = bounds.min;
    const max = bounds.max;

    const left = min.x - padding;
    const right = max.x + padding;
    const bottom = min.y - padding;
    const top = max.y + padding;

    const length = 0.13 * scale;
    const thickness = 0.035 * scale;

    corners.push(<Corner key='tl' x={left} y={top} color={color} length={length} thickness={thickness} />);
    corners.push(<Corner key='tr' x={right} y={top} color={color} length={length} thickness={thickness} />);
    corners.push(<Corner key='bl' x={left} y={bottom} color={color} length={length} thickness={thickness} />);
    corners.push(<Corner key='br' x={right} y={bottom} color={color} length={length} thickness={thickness} />);
  }

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <Text3D
        ref={textRef}
        font='/gt.json'
        size={0.3}
        height={0.05}
        position={[0, 0, 0]}
        curveSegments={12}
        bevelEnabled
        bevelThickness={0.01}
        bevelSize={0.01}
        bevelOffset={0}
        bevelSegments={5}
      >
        {text}
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.8}
          emissive={color}
          emissiveIntensity={1.5}
          wireframe={false}
        />
      </Text3D>
      {corners}
    </group>
  );
}
