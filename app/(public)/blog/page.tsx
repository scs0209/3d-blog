'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bloom, DepthOfField, EffectComposer } from '@react-three/postprocessing';
import { MeshReflectorMaterial } from '@react-three/drei';
import { Macintosh, ComputerBackground } from '@/widgets/post/ui';
import { CanvasLoader, AnimatedText, WatchRobot, HelloBot, MoveBot, FloatingActionButton } from '@/shared/ui';
import { useRouter } from 'next/navigation';

function AnimatedCamera({ cameraPos }: { cameraPos: { x: number; y: number; z: number } }) {
  const { camera } = useThree();
  useFrame(() => {
    camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z);
    camera.updateProjectionMatrix();
  });
  return null;
}

export default function BlogPage() {
  const router = useRouter();
  const [htmlScale, setHtmlScale] = useState(1);
  const [htmlOpacity, setHtmlOpacity] = useState(1);
  const [isNavigating, setIsNavigating] = useState(false);

  // 마우스 휠로 scale 조절 및 라우팅
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
      // 스크롤이 끝까지 도달하면 /blog/all로 라우팅
      setTimeout(() => {
        router.push('/blog/all');
      }, 300);
    }
  }, [htmlScale, isNavigating, router]);

  return (
    <main className='fixed inset-0 z-10 w-full h-full bg-gray-700' onWheel={handleWheel} style={{ overflow: 'hidden' }}>
      <AnimatePresence>
        <motion.div
          key='mac-canvas'
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0, y: 700 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className='w-full h-full'
        >
          <Canvas
            dpr={[1, 1.5]}
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
              castShadow
              shadow-mapSize={1024}
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
                  blur={[300, 30]}
                  resolution={2048}
                  mixBlur={1}
                  mixStrength={180}
                  roughness={1}
                  depthScale={1.2}
                  minDepthThreshold={0.4}
                  maxDepthThreshold={1.4}
                  color='#202020'
                  metalness={0.8}
                />
              </mesh>
              <EffectComposer enableNormalPass={false}>
                <Bloom luminanceThreshold={0} mipmapBlur luminanceSmoothing={0.0} intensity={5} />
                <DepthOfField target={[0, 0, 13]} focalLength={0.3} bokehScale={15} height={700} />
              </EffectComposer>
            </Suspense>
          </Canvas>
          <FloatingActionButton />

          {/* 스크롤 힌트 */}
          <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-center'>
            <div className='animate-bounce'>
              <p className='text-sm mb-2'>스크롤하여 블로그 보기</p>
              <div className='w-6 h-10 border-2 border-white rounded-full mx-auto'>
                <div className='w-1 h-3 bg-white rounded-full mx-auto mt-2 animate-pulse' />
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
