'use client';

import { OrbitControls, Sparkles, Stars, useFBX, useGLTF } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useAnimationFrame, useMotionValue, useSpring } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { CanvasLoader, Earth, Scene, Sun } from '@/shared/ui';
import { FallingAstronaut, Planet, RoomModel, SceneClickHandler, WalkingAvatar } from '@/widgets/home';

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
        useFBX.preload('/snp.fbx');
        useFBX.preload('/Typing.fbx');
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
  const isTransitioningRef = useRef(false);
  const displayThemeRef = useRef(theme);
  const themeRef = useRef(theme);

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
  const overlayRef = useRef<HTMLDivElement>(null);
  const starNodesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    displayThemeRef.current = displayTheme;
  }, [displayTheme]);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    isTransitioningRef.current = isTransitioning;
  }, [isTransitioning]);

  useEffect(() => {
    if (theme !== displayTheme) {
      setIsTransitioning(true);
      isTransitioningRef.current = true;
      if (theme === 'dark') {
        radius.set(darkRadius);
        setTimeout(() => {
          setDisplayTheme('dark');
          displayThemeRef.current = 'dark';
          setIsTransitioning(false);
          isTransitioningRef.current = false;
        }, 500);
      } else {
        setDisplayTheme('light');
        displayThemeRef.current = 'light';
        setTimeout(() => {
          radius.set(lightRadius);
          setIsTransitioning(false);
          isTransitioningRef.current = false;
        }, 50);
      }
    }
  }, [theme, displayTheme, radius]);

  // React setState 없이 DOM만 갱신 — WalkingAvatar 리렌더/위치 리셋 방지
  useAnimationFrame(() => {
    const overlay = overlayRef.current;
    if (!overlay) {
      return;
    }

    const currentRadius = spring.get();
    const currentDisplayTheme = displayThemeRef.current;
    const currentTheme = themeRef.current;
    const transitioning = isTransitioningRef.current;

    let overlayOpacity = 0;
    if (currentDisplayTheme === 'dark' || (currentTheme === 'dark' && transitioning)) {
      overlayOpacity = 1;
    } else {
      const progress = (currentRadius - darkRadius) / (lightRadius - darkRadius);
      overlayOpacity = Math.max(0, 1 - progress);
    }

    overlay.style.opacity = String(overlayOpacity);
    overlay.style.background = `radial-gradient(circle at 50% 50%, transparent ${currentRadius}%, #000 ${currentRadius + 10}%)`;
    overlay.style.display =
      currentDisplayTheme === 'dark' || overlayOpacity > 0 ? 'block' : 'none';

    const minDistance = currentRadius * 0.6;
    for (const starEl of starNodesRef.current) {
      if (!starEl) {
        continue;
      }
      const x = Number(starEl.dataset.x);
      const y = Number(starEl.dataset.y);
      const distance = Math.hypot(x - 50, y - 50);
      starEl.style.display = distance > minDistance ? 'block' : 'none';
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

      <div
        ref={overlayRef}
        className='pointer-events-none absolute inset-0 z-10'
        style={{
          opacity: displayTheme === 'dark' ? 1 : 0,
          display: displayTheme === 'dark' ? 'block' : 'none',
          background: `radial-gradient(circle at 50% 50%, transparent ${displayTheme === 'dark' ? darkRadius : lightRadius}%, #000 ${(displayTheme === 'dark' ? darkRadius : lightRadius) + 10}%)`,
          transition: 'background 0.5s ease-in-out, opacity 0.4s ease-in-out',
        }}
      >
        {stars.map((star, index) => (
          <div
            key={star.id}
            ref={(el) => {
              starNodesRef.current[index] = el;
            }}
            data-x={star.x}
            data-y={star.y}
            className='absolute w-0.5 h-0.5 bg-white rounded-full animate-pulse'
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
              opacity: star.opacity,
            }}
          />
        ))}
      </div>
    </>
  );
};
