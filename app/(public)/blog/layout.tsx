'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bloom, DepthOfField, EffectComposer } from '@react-three/postprocessing';
import { MeshReflectorMaterial } from '@react-three/drei';
import { Macintosh, ComputerBackground } from '@/widgets/post/ui';
import { CanvasLoader } from '@/shared/ui';
import dynamic from 'next/dynamic';

const BlogLayoutClient = dynamic(() => import('@/widgets/post/ui/BlogLayoutClient'), {
  ssr: false,
});

function AnimatedCamera({ cameraPos }: { cameraPos: { x: number; y: number; z: number } }) {
  const { camera } = useThree();
  useFrame(() => {
    camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z);
    camera.updateProjectionMatrix();
  });
  return null;
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [htmlScale, setHtmlScale] = useState(1);
  const [htmlOpacity, setHtmlOpacity] = useState(1);
  const [showFullPage, setShowFullPage] = useState(false);
  const [lockedFullPage, setLockedFullPage] = useState(false);
  const [isExitingTo3D, setIsExitingTo3D] = useState(false);

  // 마우스 휠로 scale 조절
  const handleWheel = (e: React.WheelEvent) => {
    if (!lockedFullPage) {
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
    if (!lockedFullPage) {
      if (htmlScale >= 8) {
        setShowFullPage(true);
        setLockedFullPage(true);
      } else {
        setShowFullPage(false);
      }
    }
  }, [htmlScale, lockedFullPage]);

  const handleBackTo3D = () => {
    setIsExitingTo3D(true);
    setTimeout(() => {
      setShowFullPage(false);
      setLockedFullPage(false);
      setHtmlScale(1);
      setIsExitingTo3D(false);
    }, 600);
  };

  return (
    <main
      className={
        showFullPage
          ? 'flex flex-col items-center row-start-2 gap-8 sm:items-start bg-white min-h-screen'
          : 'fixed inset-0 z-10 w-full h-full bg-gray-700'
      }
      onWheel={handleWheel}
      style={showFullPage ? {} : { overflow: 'hidden' }}
    >
      {showFullPage && (
        <button
          type='button'
          onClick={handleBackTo3D}
          className='fixed top-4 left-4 z-50 bg-black text-white px-4 py-2 rounded shadow'
        >
          3D로 돌아가기
        </button>
      )}
      <AnimatePresence>
        {showFullPage ? (
          <motion.div
            key='blog-content'
            initial={{ opacity: 0, scale: htmlScale }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: isExitingTo3D ? 0 : htmlScale, y: isExitingTo3D ? 700 : 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className='w-full bg-white flex justify-center items-start min-h-screen origin-top'
          >
            <BlogLayoutClient>{children}</BlogLayoutClient>
          </motion.div>
        ) : (
          <motion.div
            key='mac-canvas'
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1 }}
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
                  scale={0.3}
                  htmlScale={htmlScale}
                  htmlOpacity={htmlOpacity}
                  showFullPage={showFullPage}
                  position={[0, 0.1, 0.8]}
                />
                <ComputerBackground scale={0.11} position={[0, 0.001, 0]} />
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
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
