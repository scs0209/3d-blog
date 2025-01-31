'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Model } from '@/shared/ui/Scene';

const GlTFPage = () => {
  return (
    <div className="w-screen h-screen bg-black">
      <Canvas>
        <PerspectiveCamera
          position={[0, 5, 10]}
          rotation={[-Math.PI / 4, 0, 0]} // x축 기준으로 -45도 회전
        />
        <Model />
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default GlTFPage;
