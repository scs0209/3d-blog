'use client';

import { MeshReflectorMaterial } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';
import type { PerspectiveCamera } from 'three';
import { useViewportProfile } from '@/shared/hooks/use-viewport-profile';
import { AnimatedText } from '@/shared/ui/AnimatedText';
import { FloatingActionButton } from '@/shared/ui/FloatingActionButton';
import { HelloBot } from '@/shared/ui/HelloBot';
import { CanvasLoader } from '@/shared/ui/Loader';
import { MoveBot } from '@/shared/ui/MoveBot';
import { WatchRobot } from '@/shared/ui/WatchRobot';
import { blogLandingTheme } from '@/widgets/post/ui/blog-landing-theme';
import { ComputerBackground } from '@/widgets/post/ui/ComputerBackground';
import { Macintosh } from '@/widgets/post/ui/Macintosh';

function ResponsiveBlogCamera() {
  const { camera, size } = useThree();

  useFrame(() => {
    const cam = camera as PerspectiveCamera;
    const aspect = size.width / Math.max(size.height, 1);
    const mobile = size.width < 768;

    if (mobile && aspect < 0.72) {
      cam.fov = 74;
      camera.position.set(-0.04, 1.58, 10.4);
    } else if (mobile) {
      cam.fov = 68;
      camera.position.set(-0.1, 1.46, 9.1);
    } else if (aspect < 1.1) {
      cam.fov = 66;
      camera.position.set(-0.14, 1.42, 8.2);
    } else {
      cam.fov = 70;
      camera.position.set(-0.16, 1.4, 7.5);
    }

    cam.updateProjectionMatrix();
  });

  return null;
}

const BlogLandingScene = () => {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const { isMobile } = useViewportProfile();
  const [htmlScale, setHtmlScale] = useState(1);
  const [htmlOpacity, setHtmlOpacity] = useState(1);
  const [isNavigating, setIsNavigating] = useState(false);
  const [enableEffects, setEnableEffects] = useState(false);
  const navigateTimeoutRef = useRef<number | null>(null);

  const isDark = resolvedTheme === 'dark';
  const canvasBg = isDark ? blogLandingTheme.canvasBgDark : blogLandingTheme.canvasBg;
  const spotColor = isDark ? blogLandingTheme.accentDark : blogLandingTheme.accentLight;

  const handleWheel = (e: React.WheelEvent) => {
    if (!isNavigating) {
      setHtmlScale((prev) => {
        let next = prev + e.deltaY * 0.01;
        if (next < 1) {
          next = 1;
        }
        if (next > 8) {
          next = 8;
        }
        return next;
      });
    }
  };

  useEffect(() => {
    setHtmlOpacity(1 - (htmlScale - 1) / 8);
  }, [htmlScale]);

  useEffect(() => {
    if (htmlScale < 8 || navigateTimeoutRef.current != null) {
      return;
    }

    setIsNavigating(true);
    navigateTimeoutRef.current = window.setTimeout(() => {
      router.push('/blog/all');
    }, 300);
  }, [htmlScale, router]);

  useEffect(() => {
    return () => {
      if (navigateTimeoutRef.current != null) {
        window.clearTimeout(navigateTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } })
      .connection;
    const saveData = Boolean(connection?.saveData);
    const slowNetwork = connection?.effectiveType === '2g' || connection?.effectiveType === 'slow-2g';
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lowMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    const shouldEnableEffects = !saveData && !slowNetwork && !reducedMotion && (lowMemory == null || lowMemory >= 4);
    setEnableEffects(shouldEnableEffects);
  }, []);

  return (
    <main className={blogLandingTheme.shell} onWheel={handleWheel}>
      <AnimatePresence>
        <motion.div
          key='mac-canvas'
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0, y: 700 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className='h-full w-full'
        >
          <Canvas
            dpr={isMobile ? [1, 1.1] : [1, 1.25]}
            performance={{ min: 0.5 }}
            camera={{ fov: 70, near: 1, zoom: 15, position: [-0.2, 1.5, 8.88] }}
            eventPrefix='client'
          >
            <color attach='background' args={[canvasBg]} />
            <hemisphereLight intensity={0.18} groundColor={canvasBg} color={isDark ? '#7ec8ff' : '#ffb870'} />
            <spotLight
              decay={0}
              position={[10, 20, 10]}
              angle={0.12}
              penumbra={1}
              intensity={1.1}
              color={spotColor}
              castShadow={false}
            />
            <Suspense fallback={<CanvasLoader />}>
              <Macintosh
                scale={isMobile ? 0.2 : 0.25}
                htmlScale={htmlScale}
                htmlOpacity={htmlOpacity}
                showFullPage={false}
                position={isMobile ? [-0.04, 0.06, 0] : [-0.08, 0.08, 0]}
                rotation={[0, Math.PI / 6, 0]}
              />
              <ComputerBackground scale={isMobile ? 0.095 : 0.11} position={[0, 0.001, 0]} />
              <AnimatedText />
              <WatchRobot
                scale={0.002}
                position={isMobile ? [0.06, 0.1, 0.28] : [0.1, 0.12, 0.3]}
                rotation={[0, -Math.PI / 1.5, 0]}
              />
              <HelloBot
                scale={isMobile ? 0.05 : 0.06}
                position={isMobile ? [0.14, 0.15, -0.14] : [0.18, 0.18, -0.16]}
                rotation={[0, -Math.PI / 4, 0]}
              />
              <MoveBot
                scale={isMobile ? 0.042 : 0.05}
                position={isMobile ? [0.28, 0, 0.62] : [0.4, 0, 0.7]}
                rotation={[0, -Math.PI / 4, 0]}
              />
              <ResponsiveBlogCamera />
              <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[50, 50]} />
                <MeshReflectorMaterial
                  blur={enableEffects ? [200, 20] : [0, 0]}
                  resolution={enableEffects ? 512 : 256}
                  mixBlur={1}
                  mixStrength={enableEffects ? 120 : 40}
                  roughness={1}
                  depthScale={1.2}
                  minDepthThreshold={0.4}
                  maxDepthThreshold={1.4}
                  color={blogLandingTheme.floor}
                  metalness={0.75}
                />
              </mesh>
              {enableEffects ? (
                <EffectComposer enableNormalPass={false} multisampling={0}>
                  <Bloom
                    luminanceThreshold={0.2}
                    mipmapBlur
                    luminanceSmoothing={0.1}
                    intensity={isDark ? 2.2 : 2.5}
                  />
                </EffectComposer>
              ) : null}
            </Suspense>
          </Canvas>
          <FloatingActionButton />

          <div className='absolute bottom-4 left-1/2 w-[min(92vw,20rem)] -translate-x-1/2 transform text-center sm:bottom-8'>
            <p className={blogLandingTheme.scrollHint}>스크롤하여 블로그 보기</p>
            <div className={blogLandingTheme.scrollTrack} aria-hidden>
              <motion.div
                className={blogLandingTheme.scrollThumb}
                animate={{ y: [0, 6, 0], opacity: [0.9, 0.35, 0.9] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
              />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </main>
  );
};

export default BlogLandingScene;
