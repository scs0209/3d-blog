'use client';

import { Suspense, useMemo, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { SceneClickHandler, WalkingAvatar, Planet, FallingAstronaut, RoomModel } from '@/widgets/home';
import { CanvasLoader, Earth, Scene, Sun } from '@/shared/ui';
import { OrbitControls, Sparkles, Stars, useGLTF } from '@react-three/drei';
import { useTheme } from 'next-themes';
import { motion, useMotionValue, useSpring, useAnimationFrame } from 'framer-motion';

export const HomeCanvas = ({ onCubeClick }: { onCubeClick?: (clicked: boolean) => void }) => {
  const { theme } = useTheme();

  const [triggerSnp, setTriggerSnp] = useState<number>(0);
  const [isCubeActive, setIsCubeActive] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (theme === 'dark') {
        useGLTF.preload('/challenge_isometric_room--kidnap.glb');
        useGLTF.preload('/Falling.glb');
      } else {
        useGLTF.preload('/space_boi.glb');
        useGLTF.preload('/WalkingAstro.glb');
      }
    }, 100);

    const delayedTimer = setTimeout(() => {
      if (theme === 'light') {
        useGLTF.preload('/floating_astronaut.glb');
        useGLTF.preload('/earth_globe_hologram_2mb_looping_animation.glb');
      }
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearTimeout(delayedTimer);
    };
  }, [theme]);

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayTheme, setDisplayTheme] = useState(theme);

  const darkRadius = 20;
  const lightRadius = 100;

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

  const radius = useMotionValue(displayTheme === 'dark' ? darkRadius : lightRadius);
  const spring = useSpring(radius, { stiffness: 80, damping: 20 });

  useEffect(() => {
    if (theme !== displayTheme) {
      setIsTransitioning(true);
      if (theme === 'dark') {
        radius.set(darkRadius);
        setTimeout(() => {
          setDisplayTheme('dark');
          setIsTransitioning(false);
        }, 500);
      } else {
        setDisplayTheme('light');
        setTimeout(() => {
          radius.set(lightRadius);
          setIsTransitioning(false);
        }, 50);
      }
    }
  }, [theme, displayTheme, radius]);

  const [currentRadius, setCurrentRadius] = useState(radius.get());
  const [overlayOpacity, setOverlayOpacity] = useState(displayTheme === 'dark' ? 1 : 0);
  useAnimationFrame(() => {
    setCurrentRadius(spring.get());
    if (displayTheme === 'dark' || (theme === 'dark' && isTransitioning)) {
      setOverlayOpacity(1);
    } else {
      const progress = (currentRadius - darkRadius) / (lightRadius - darkRadius);
      setOverlayOpacity(Math.max(0, 1 - progress));
    }
  });

  return (
    <>
      <div className='absolute inset-0'>
        <Canvas camera={{ fov: 75, near: 0.1, zoom: 0.9, position: [-5.3, 3.1, -6.7] }}>
          <ambientLight intensity={2} color='white' />
          <directionalLight position={[5, 10, 5]} intensity={2} castShadow />

          {displayTheme === 'dark' ? (
            <>
              <Suspense fallback={<CanvasLoader />}>
                <RoomModel scale={0.013} position={[0, -3, 0]} rotation={[0, 4.4, 0]} />
              </Suspense>
              <Suspense fallback={<CanvasLoader />}>
                <FallingAstronaut position={[-0.5, 1.2, 0]} rotation={[0, -2, 0]} />
              </Suspense>
            </>
          ) : (
            <Suspense fallback={<CanvasLoader />}>
              <SceneClickHandler />
              <Stars radius={100} depth={100} count={4000} factor={4} saturation={0} fade speed={0.2} />
              <Sparkles count={300} size={3} speed={0.02} opacity={1} scale={20} color='#fff3b0' />
              {/* <Suspense fallback={<CanvasLoader />}>
                <AnimateAvatar scale={3000} position={[0, 5, 0]} />
              </Suspense> */}
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
          )}
        </Canvas>
      </div>

      {(displayTheme === 'dark' || overlayOpacity > 0) && (
        <motion.div
          className='pointer-events-none absolute inset-0 z-10'
          style={{
            opacity: overlayOpacity,
            background: `radial-gradient(circle at 50% 50%, transparent ${currentRadius}%, #000 ${currentRadius + 10}%)`,
            transition: 'background 0.5s ease-in-out, opacity 0.4s ease-in-out',
          }}
        >
          {stars.map((star) => {
            const centerX = 50;
            const centerY = 50;
            const distance = Math.sqrt((star.x - centerX) ** 2 + (star.y - centerY) ** 2);
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
