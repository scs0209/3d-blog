'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Model as RoomModel } from '@/shared/ui/Room';
import { CameraLogger } from '@/shared/ui/CameraLogger';

const GlTFPage = () => {
  return (
    <div className="w-screen h-screen bg-black">
      <Canvas
        camera={{ fov: 75, near: 0.1, far: 1000, position: [12, 238, -410] }}
      >
        <ambientLight intensity={2} color="white" />
        <RoomModel position={[0, -100, 0]} />
        <OrbitControls />
        <CameraLogger />
      </Canvas>
    </div>
  );
};

export default GlTFPage;
