'use client';

import { Macintosh, BlogContent, ComputerBackground } from '@/widgets/post/ui';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { useState, useEffect } from 'react';

function AnimatedCamera({ cameraPos }: { cameraPos: { x: number; y: number; z: number } }) {
  const { camera } = useThree();
  useFrame(() => {
    camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z);
    camera.updateProjectionMatrix();
  });
  return null;
}

export default function BlogPage() {
  const { scrollYProgress } = useScroll();
  // const cameraZ = useTransform(scrollYProgress, [0, 1], [10, 2]);
  const htmlScaleMotion = useTransform(scrollYProgress, [0.7, 1], [1, 4]);
  const htmlOpacityMotion = useTransform(scrollYProgress, [0.95, 1], [1, 0]);
  const [htmlScale, setHtmlScale] = useState(1);
  const [htmlOpacity, setHtmlOpacity] = useState(1);
  const [showFullPage, setShowFullPage] = useState(false);

  useMotionValueEvent(htmlScaleMotion, 'change', setHtmlScale);
  useMotionValueEvent(htmlOpacityMotion, 'change', setHtmlOpacity);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (v) => {
      if (v > 0.98) {
        setShowFullPage(true);
      } else {
        setShowFullPage(false);
      }
    });
    return unsubscribe;
  }, [scrollYProgress]);

  return (
    <main className='flex flex-col items-center row-start-2 gap-8 sm:items-start h-[150vh] bg-gray-700'>
      {!showFullPage && (
        <div className='fixed inset-0 z-10 w-full h-full'>
          <Canvas camera={{ fov: 90, near: 1, zoom: 15, position: [-0.16, 1.4, 8.88] }}>
            <ambientLight intensity={0.5} />
            <directionalLight
              intensity={1.2}
              position={[5, 10, 7]}
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
            />
            <pointLight intensity={0.5} position={[-10, 5, -10]} />
            <Macintosh scale={0.3} htmlScale={htmlScale} htmlOpacity={htmlOpacity} position={[0, 0.1, 1]} />
            <ComputerBackground scale={0.11} position={[0, 0.001, 0]} />
            {/* <LevaCameraController /> */}
            <AnimatedCamera cameraPos={{ x: -0.16, y: 1.4, z: 7.5 }} />
            {/* <OrbitControls /> */}
          </Canvas>
        </div>
      )}
      {showFullPage && (
        <div className='fixed inset-0 z-50 bg-white flex items-center justify-center'>
          <BlogContent title='Blog Title'>
            <h1 className='text-3xl font-bold mb-4'>Blog Title</h1>
            <p>블로그 상세 페이지 내용...</p>
          </BlogContent>
        </div>
      )}
    </main>
  );
}
