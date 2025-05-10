'use client';

import { Macintosh } from '@/widgets/post/ui';
import BlogContent from '@/widgets/post/ui/BlogContent';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useScroll, useTransform } from 'framer-motion';
import { useState, useEffect } from 'react';

function AnimatedCamera({ cameraZ }: { cameraZ: any }) {
  const { camera } = useThree();
  useFrame(() => {
    camera.position.z = cameraZ.get();
    camera.updateProjectionMatrix();
  });
  return null;
}

export default function BlogPage() {
  const { scrollYProgress } = useScroll();
  const cameraZ = useTransform(scrollYProgress, [0, 1], [10, 2]);
  const htmlScale = useTransform(scrollYProgress, [0.7, 1], [1, 2]);
  const htmlOpacity = useTransform(scrollYProgress, [0.95, 1], [1, 0]);
  const [showFullPage, setShowFullPage] = useState(false);

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
    <main className='flex flex-col items-center row-start-2 gap-8 sm:items-start h-screen' style={{ height: '150vh' }}>
      {!showFullPage && (
        <Canvas camera={{ fov: 75, near: 0.1, zoom: 10, position: [0, 0, 10] }}>
          <ambientLight intensity={0.5} />
          <directionalLight
            intensity={1.2}
            position={[5, 10, 7]}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <pointLight intensity={0.5} position={[-10, 5, -10]} />
          <Macintosh htmlScale={htmlScale} htmlOpacity={htmlOpacity} />
          <AnimatedCamera cameraZ={cameraZ} />
        </Canvas>
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
