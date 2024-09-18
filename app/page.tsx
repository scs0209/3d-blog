'use client';

import Header from '@/components/common/Header';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import dynamic from 'next/dynamic';

const Scene = dynamic(() => import('@/components/common/Scene'), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="w-screen h-screen bg-[#e0d9d2]">
      <Header />
      <Canvas shadows className="w-full h-full">
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <OrbitControls enableZoom={false} enablePan={false} />
        <ambientLight intensity={0.5} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          castShadow
        />
        <Scene />
      </Canvas>
    </div>
  );
}
