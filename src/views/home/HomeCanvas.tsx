'use client';

import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { SceneClickHandler, AnimateAvatar, WalkingAvatar, Planet, FallingAstronaut, RoomModel } from '@/widgets/home';
import { CanvasLoader, Earth, Scene, Sun } from '@/shared/ui';
import { OrbitControls, Sparkles, Stars } from '@react-three/drei';
import { useTheme } from 'next-themes';
import { motion, useMotionValue, useSpring, useAnimationFrame, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export const HomeCanvas = ({ onCubeClick }: { onCubeClick?: (clicked: boolean) => void }) => {
  const { theme } = useTheme();

  // CubeModel 클릭 트리거 관리
  const [triggerSnp, setTriggerSnp] = useState<number>(0);
  const [isCubeActive, setIsCubeActive] = useState<boolean>(false);

  // 전환 상태 관리
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayTheme, setDisplayTheme] = useState(theme);

  // 다크→라이트: 원형 투명 영역이 커지면서 전체 밝아짐
  // 라이트→다크: 원형 투명 영역이 줄어들면서 중앙만 보임
  const darkRadius = 20;
  const lightRadius = 100;

  // 별들의 위치와 속성을 미리 계산해서 고정
  const stars = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      id: `star-${i}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 1.5 + Math.random() * 1.5,
      opacity: 0.4 + Math.random() * 0.6,
    }));
  }, []);

  // motion value로 radius를 관리
  const radius = useMotionValue(displayTheme === 'dark' ? darkRadius : lightRadius);
  const spring = useSpring(radius, { stiffness: 80, damping: 20 });

  // theme 변경 시 전환 로직
  useEffect(() => {
    if (theme !== displayTheme) {
      setIsTransitioning(true);

      if (theme === 'dark') {
        // 라이트 → 다크: 오버레이가 먼저 닫힌 후 Canvas 전환
        radius.set(darkRadius);

        // 오버레이 애니메이션 완료 후 Canvas 전환
        setTimeout(() => {
          setDisplayTheme('dark');
          setIsTransitioning(false);
        }, 500); // 오버레이 애니메이션 시간과 맞춤 (더 빠르게)
      } else {
        // 다크 → 라이트: Canvas 먼저 전환 후 오버레이 열림
        setDisplayTheme('light');
        setTimeout(() => {
          radius.set(lightRadius);
          setIsTransitioning(false);
        }, 50); // Canvas 전환 직후 (더 빠르게)
      }
    }
  }, [theme, displayTheme, radius]);

  // spring 값을 state로 반영
  const [currentRadius, setCurrentRadius] = useState(radius.get());
  const [overlayOpacity, setOverlayOpacity] = useState(displayTheme === 'dark' ? 1 : 0);
  useAnimationFrame(() => {
    setCurrentRadius(spring.get());

    // 다크 모드이거나 라이트→다크 전환 중일 때는 opacity 1
    if (displayTheme === 'dark' || (theme === 'dark' && isTransitioning)) {
      setOverlayOpacity(1);
    } else {
      // 라이트 모드일 때: radius가 변화하는 동안은 애니메이션 보이게, 완료되면 사라짐
      const progress = (currentRadius - darkRadius) / (lightRadius - darkRadius);
      setOverlayOpacity(Math.max(0, 1 - progress));
    }
  });

  return (
    <>
      <AnimatePresence mode='wait'>
        {displayTheme === 'dark' ? (
          <motion.div
            key='dark-canvas'
            className='absolute inset-0'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <Canvas camera={{ fov: 75, near: 0.1, zoom: 0.9, position: [-5.3, 3.1, -6.7] }}>
              <ambientLight intensity={2} color='white' />
              <directionalLight position={[5, 10, 5]} intensity={2} castShadow />
              <Suspense fallback={<CanvasLoader />}>
                <RoomModel scale={0.013} position={[0, -3, 0]} rotation={[0, 4.4, 0]} />
                <FallingAstronaut position={[-0.5, 1.2, 0]} rotation={[0, -2, 0]} />
              </Suspense>
            </Canvas>
          </motion.div>
        ) : (
          <motion.div
            key='light-canvas'
            className='absolute inset-0'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <Canvas camera={{ fov: 75, near: 0.1, zoom: 0.9, position: [-5.3, 3.1, -6.7] }}>
              <ambientLight intensity={2} color='white' />
              <directionalLight position={[5, 10, 5]} intensity={2} castShadow />
              <Suspense fallback={<CanvasLoader />}>
                {/* <CameraController /> */}
                {/* <SceneController /> */}
                <SceneClickHandler />
                <Stars radius={100} depth={100} count={4000} factor={4} saturation={0} fade speed={0.2} />
                <Sparkles count={300} size={3} speed={0.02} opacity={1} scale={20} color='#fff3b0' />
                <AnimateAvatar scale={3000} position={[0, 5, 0]} />
                <WalkingAvatar position={[0, 0.6, 0.5]} triggerSnp={triggerSnp} />
                <Sun scale={15} position={[70, 15, 30]} isCubeActive={isCubeActive} />
                <Earth scale={10} position={[-18, 0, 50]} />
                <Scene
                  isCubeActive={isCubeActive}
                  onCubeClick={() => {
                    setTriggerSnp(Date.now());
                    const newState = !isCubeActive;
                    setIsCubeActive(newState);
                    onCubeClick?.(newState);
                  }}
                />
                <ambientLight intensity={0.5} />
                <pointLight position={[5, 5, 5]} intensity={2} />
                <OrbitControls makeDefault enableDamping dampingFactor={0.05} enablePan enableZoom />
                <Planet scale={30} position={[0, -19, 0]} />
              </Suspense>
            </Canvas>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 오버레이 - 항상 렌더링하여 radial gradient 애니메이션 유지 */}
      {(displayTheme === 'dark' || overlayOpacity > 0) && (
        <motion.div
          className='pointer-events-none absolute inset-0 z-10'
          style={{
            opacity: overlayOpacity,
            background: `radial-gradient(circle at 50% 50%, transparent ${currentRadius}%, #000 ${currentRadius + 10}%)`,
            transition: 'background 0.5s ease-in-out, opacity 0.4s ease-in-out',
          }}
        >
          {/* 검정색 부분에만 나타나는 작은 별들 */}
          {stars.map((star) => {
            // 중심에서의 거리 계산 (화면 크기 기준)
            const centerX = 50;
            const centerY = 50;
            const distance = Math.sqrt((star.x - centerX) ** 2 + (star.y - centerY) ** 2);

            // 현재 radius 범위 밖에만 별 표시 (검정색 부분)
            const minDistance = currentRadius * 0.6;

            return distance > minDistance ? (
              <div
                key={star.id}
                className='absolute w-0.5 h-0.5 bg-white rounded-full animate-pulse'
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  animationDelay: `${star.delay}s`,
                  animationDuration: `${star.duration}s`,
                  opacity: star.opacity,
                }}
              />
            ) : null;
          })}
        </motion.div>
      )}
    </>
  );
};
