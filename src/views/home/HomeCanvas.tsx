'use client';

import { useFBX, useGLTF } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useAnimationFrame, useMotionValue, useSpring } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import * as three from 'three';
import { CanvasLoader } from '@/shared/ui';
import { CinematicCosmosScene, FallingAstronaut, PortalDiscoveryOverlay, RoomModel } from '@/widgets/home';
import type { CosmosPortalId } from '@/widgets/home/model/cosmos-portals';

export const HomeCanvas = () => {
  const { theme } = useTheme();
  const [activePortalId, setActivePortalId] = useState<CosmosPortalId | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (theme === 'dark') {
        useGLTF.preload('/challenge_isometric_room--kidnap.glb');
        useGLTF.preload('/Falling.glb');
      } else {
        useGLTF.preload('/WalkingAstro.glb');
        useFBX.preload('/snp.fbx');
        useFBX.preload('/Typing.fbx');
      }
    }, 100);

    return () => {
      clearTimeout(timer);
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
    if (displayTheme === 'dark') {
      setActivePortalId(null);
    }
  }, [displayTheme]);

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
        const timer = window.setTimeout(() => {
          setDisplayTheme('dark');
          displayThemeRef.current = 'dark';
          setIsTransitioning(false);
          isTransitioningRef.current = false;
        }, 500);
        return () => {
          window.clearTimeout(timer);
        };
      }

      setDisplayTheme('light');
      displayThemeRef.current = 'light';
      const timer = window.setTimeout(() => {
        radius.set(lightRadius);
        setIsTransitioning(false);
        isTransitioningRef.current = false;
      }, 50);
      return () => {
        window.clearTimeout(timer);
      };
    }
  }, [theme, displayTheme, radius]);

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
    overlay.style.display = currentDisplayTheme === 'dark' || overlayOpacity > 0 ? 'block' : 'none';

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
        <Canvas
          shadows
          dpr={[1, 1.75]}
          gl={{
            antialias: true,
            toneMapping: three.ACESFilmicToneMapping,
            toneMappingExposure: 0.88,
          }}
          camera={{ fov: 36, near: 0.1, far: 500, position: [5.5, 2.1, 14] }}
        >
          {displayTheme === 'dark' ? (
            <>
              <ambientLight intensity={2} color='white' />
              <directionalLight position={[5, 10, 5]} intensity={2} castShadow />
              <Suspense fallback={<CanvasLoader />}>
                <RoomModel scale={0.013} position={[0, -3, 0]} rotation={[0, 4.4, 0]} />
              </Suspense>
              <Suspense fallback={<CanvasLoader />}>
                <FallingAstronaut position={[-0.5, 1.2, 0]} rotation={[0, -2, 0]} />
              </Suspense>
            </>
          ) : (
            <Suspense fallback={<CanvasLoader />}>
              <CinematicCosmosScene onActivePortalChange={setActivePortalId} />
            </Suspense>
          )}
        </Canvas>
      </div>

      {displayTheme !== 'dark' ? <PortalDiscoveryOverlay activePortalId={activePortalId} /> : null}
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
