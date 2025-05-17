'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  CameraController,
  SceneController,
  SceneClickHandler,
  AnimateAvatar,
  WalkingAvatar,
  Planet,
} from '@/widgets/home';
import { CanvasLoader, Scene } from '@/shared/ui';
import { OrbitControls, Sparkles, Stars } from '@react-three/drei';

export const HomeCanvas = () => {
  return (
    <Canvas camera={{ fov: 75, near: 0.1, zoom: 0.9, position: [-5.3, 3.1, -6.7] }}>
      <ambientLight intensity={2} color='white' />
      <directionalLight position={[5, 10, 5]} intensity={2} castShadow />
      <fog attach='fog' args={['#000000', 500, 2000]} />

      <Suspense fallback={<CanvasLoader />}>
        <CameraController />
        <SceneController />
        <SceneClickHandler />

        <Stars radius={100} depth={100} count={4000} factor={4} saturation={0} fade speed={0.2} />
        <Sparkles count={300} size={3} speed={0.02} opacity={1} scale={20} color='#fff3b0' />
        <AnimateAvatar scale={3000} position={[0, 5, 0]} />
        <WalkingAvatar scale={0.01} position={[0, 0.6, 0.5]} />
        <Scene />
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={2} />

        {/* 카메라 조작용 기본 컨트롤 - 회전 방지 */}
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.05}
          // enableRotate={false}
          enablePan
          enableZoom
        />
        <Planet scale={30} position={[0, -19, 0]} />
      </Suspense>
    </Canvas>
  );
};
