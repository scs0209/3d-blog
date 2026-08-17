'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { MeshReflectorMaterial } from '@react-three/drei';
import { Macintosh } from '@/widgets/post/ui/Macintosh';
import { ComputerBackground } from '@/widgets/post/ui/ComputerBackground';
import { CanvasLoader } from '@/shared/ui/Loader';
import { AnimatedText } from '@/shared/ui/AnimatedText';
import { WatchRobot } from '@/shared/ui/WatchRobot';
import { HelloBot } from '@/shared/ui/HelloBot';
import { MoveBot } from '@/shared/ui/MoveBot';
import { FloatingActionButton } from '@/shared/ui/FloatingActionButton';
import { useRouter } from 'next/navigation';

function AnimatedCamera({ cameraPos }: { cameraPos: { x: number; y: number; z: number } }) {
  const { camera } = useThree();
  useFrame(() => {
    camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z);
    camera.updateProjectionMatrix();
  });
  return null;
}

const BlogLandingScene = () => {
  const router = useRouter();
  const [htmlScale, setHtmlScale] = useState(1);
  const [htmlOpacity, setHtmlOpacity] = useState(1);
  const [isNavigating, setIsNavigating] = useState(false);
  const [enableEffects, setEnableEffects] = useState(false);

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
    if (!isNavigating && htmlScale >= 8) {
      setIsNavigating(true);
      setTimeout(() => {
        router.push('/blog/all');
      }, 300);
    }
  }, [htmlScale, isNavigating, router]);

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
    <main className='fixed inset-0 z-10 h-full w-full bg-gray-700' onWheel={handleWheel} style={{ overflow: 'hidden' }}>
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
            dpr={[1, 1.25]}
            performance={{ min: 0.5 }}
            camera={{ fov: 70, near: 1, zoom: 15, position: [-0.2, 1.5, 8.88] }}
            eventPrefix='client'
          >
            <color attach='background' args={['black']} />
            <hemisphereLight intensity={0.15} groundColor='black' />
            <spotLight
              decay={0}
              position={[10, 20, 10]}
              angle={0.12}
              penumbra={1}
              intensity={1}
              castShadow={false}
            />
            <Suspense fallback={<CanvasLoader />}>
              <Macintosh
                scale={0.25}
                htmlScale={htmlScale}
                htmlOpacity={htmlOpacity}
                showFullPage={false}
                position={[-0.08, 0.08, 0]}
                rotation={[0, Math.PI / 6, 0]}
              />
              <ComputerBackground scale={0.11} position={[0, 0.001, 0]} />
              <AnimatedText />
              <WatchRobot scale={0.002} position={[0.1, 0.12, 0.3]} rotation={[0, -Math.PI / 1.5, 0]} />
              <HelloBot scale={0.06} position={[0.18, 0.18, -0.16]} rotation={[0, -Math.PI / 4, 0]} />
              <MoveBot scale={0.05} position={[0.4, 0, 0.7]} rotation={[0, -Math.PI / 4, 0]} />
              <AnimatedCamera cameraPos={{ x: -0.16, y: 1.4, z: 7.5 }} />
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
                  color='#202020'
                  metalness={0.8}
                />
              </mesh>
              {enableEffects ? (
                <EffectComposer enableNormalPass={false} multisampling={0}>
                  <Bloom luminanceThreshold={0.2} mipmapBlur luminanceSmoothing={0.1} intensity={2.5} />
                </EffectComposer>
              ) : null}
            </Suspense>
          </Canvas>
          <FloatingActionButton />

          <div className='absolute bottom-8 left-1/2 -translate-x-1/2 transform text-center text-white'>
            <div className='animate-pulse duration-[3000ms]'>
              <p className='mb-2 text-sm opacity-80'>스크롤하여 블로그 보기</p>
              <div className='relative mx-auto h-10 w-6 rounded-full border-2 border-white/70'>
                <div
                  className='mx-auto mt-2 h-3 w-1 translate-y-0 transform animate-bounce rounded-full bg-white duration-[2500ms]'
                  style={{ animationTimingFunction: 'cubic-bezier(0.4, 0, 0.6, 1)' }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </main>
  );
};

export default BlogLandingScene;
