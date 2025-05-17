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
import { useTheme } from 'next-themes';
import { motion, useMotionValue, useSpring, useAnimationFrame } from 'framer-motion';
import { useEffect, useState } from 'react';

export const HomeCanvas = () => {
  const { theme } = useTheme();

  // 다크→라이트: 원형 투명 영역이 커지면서 전체 밝아짐
  // 라이트→다크: 원형 투명 영역이 줄어들면서 중앙만 보임
  const darkRadius = 20;
  const lightRadius = 100;

  // motion value로 radius를 관리
  const radius = useMotionValue(theme === 'dark' ? darkRadius : lightRadius);
  const spring = useSpring(radius, { stiffness: 60, damping: 20 });

  // theme이 바뀔 때 radius를 트리거
  useEffect(() => {
    radius.set(theme === 'dark' ? darkRadius : lightRadius);
  }, [theme, radius]);

  // spring 값을 state로 반영
  const [currentRadius, setCurrentRadius] = useState(radius.get());
  const [overlayOpacity, setOverlayOpacity] = useState(theme === 'dark' ? 1 : 0);
  useAnimationFrame(() => {
    setCurrentRadius(spring.get());
    // 라이트 모드로 전환 시 radius가 90 이상이면 opacity 0
    if (theme === 'light') {
      setOverlayOpacity(currentRadius < 90 ? 1 - (currentRadius - darkRadius) / (lightRadius - darkRadius) : 0);
    } else {
      setOverlayOpacity(1);
    }
  });

  return (
    <>
      <Canvas camera={{ fov: 75, near: 0.1, zoom: 0.9, position: [-5.3, 3.1, -6.7] }}>
        <ambientLight intensity={2} color='white' />
        <directionalLight position={[5, 10, 5]} intensity={2} castShadow />

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

      {/* 동그랗게 퍼지는 framer-motion 오버레이 */}
      {(theme === 'dark' || overlayOpacity > 0) && (
        <motion.div
          className='pointer-events-none absolute inset-0 z-10'
          style={{
            opacity: overlayOpacity,
            background: `radial-gradient(circle at 50% 50%, transparent ${currentRadius}%, #000 ${currentRadius + 10}%)`,
            transition: 'background 0.5s, opacity 0.5s',
          }}
        />
      )}
    </>
  );
};
