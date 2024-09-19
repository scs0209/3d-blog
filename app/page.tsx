'use client';

import Header from '@/components/common/Header';
import {
  MeshReflectorMaterial,
  OrbitControls,
  PerspectiveCamera,
} from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import dynamic from 'next/dynamic';

const Scene = dynamic(() => import('@/components/common/Scene'), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="w-screen h-screen bg-[#e0d9d2]">
      <Header />
      {/* <div className="w-full bg-gray-200 border border-gray-100 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-40">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-800">MODE DESIGN 3D</h1>
          <p className="text-lg text-gray-600">Featured Post</p>
        </div>
      </div> */}
      <Canvas
        camera={{
          fov: 75,
          position: [7, 7, 0],
        }}
        shadows
        className="w-full h-full"
      >
        <OrbitControls enableZoom enablePan={false} />
        <directionalLight
          // color={0xffffff}
          intensity={0.3} // 빛의 강도
          position={[0, 1, 2]} // 화면 정면에서 사물에 빛이 닿도록 위치 설정
          target-position={[0, 0, 0]} // 빛의 타겟 위치 설정
        />
        {/* <directionalLight color={0xffffff} intensity={1} position={[0, 5, 0]} /> */}
        {/* <ambientLight color={0xffffff} intensity={0.5} position={[0, 5, 0]} /> */}
        {/* <pointLight color="#ffffff" position={[0, 5, 0]} /> */}
        <Scene />
      </Canvas>
    </div>
  );
}
