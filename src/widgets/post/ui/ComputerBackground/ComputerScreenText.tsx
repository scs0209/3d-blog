'use client';

import { Text, PerspectiveCamera } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { ComputerScreen } from './ComputerScreen';

export const ComputerScreenText = ({
  invert,
  x = 0,
  y = 1.2,
  frame,
  panel,
  ...props
}: { invert?: boolean; x?: number; y?: number; frame: string; panel: string; props?: any }) => {
  const textRef = useRef<any>(null);
  const rand = Math.random() * 10000;

  useFrame((state) => {
    if (textRef.current) {
      textRef.current.position.x = x + Math.sin(rand + state.clock.elapsedTime / 4) * 8;
    }
  });

  return (
    <ComputerScreen frame={frame} panel={panel} {...props}>
      <PerspectiveCamera makeDefault manual aspect={1 / 1} position={[0, 0, 15]} />
      <color attach='background' args={[invert ? 'black' : '#35c19f']} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} />
      <Text
        font='/Inter-Bold.woff'
        position={[x, y, 0]}
        ref={textRef}
        fontSize={2}
        letterSpacing={-0.1}
        color={!invert ? 'black' : '#35c19f'}
      >
        Blog
      </Text>
    </ComputerScreen>
  );
};
