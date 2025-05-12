'use client';

import { Macintosh, ComputerBackground, BlogMainPage } from '@/widgets/post/ui';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

function AnimatedCamera({ cameraPos }: { cameraPos: { x: number; y: number; z: number } }) {
  const { camera } = useThree();
  useFrame(() => {
    camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z);
    camera.updateProjectionMatrix();
  });
  return null;
}

export default function BlogPage() {
  // const { scrollYProgress } = useScroll(); // 더 이상 사용하지 않음
  // const cameraZ = useTransform(scrollYProgress, [0, 1], [10, 2]);
  // const htmlScaleMotion = useTransform(scrollYProgress, [0.7, 1], [1, 4]);
  // const htmlOpacityMotion = useTransform(scrollYProgress, [0.95, 1], [1, 0]);
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

  // scale에 따라 opacity도 조절 (선택)
  useEffect(() => {
    setHtmlOpacity(1 - (htmlScale - 1) / 8); // scale 1~4 -> opacity 1~0
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

  console.log(htmlScale, showFullPage);

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
            key='blog-main-page'
            initial={{ opacity: 0, scale: htmlScale }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: isExitingTo3D ? 0 : htmlScale, y: isExitingTo3D ? 700 : 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className='w-full bg-white flex justify-center items-start min-h-screen origin-top'
          >
            <BlogMainPage />
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
              <Macintosh
                scale={0.3}
                htmlScale={htmlScale}
                htmlOpacity={htmlOpacity}
                showFullPage={showFullPage}
                position={[0, 0.1, 1]}
              />
              <ComputerBackground scale={0.11} position={[0, 0.001, 0]} />
              {/* <LevaCameraController /> */}
              <AnimatedCamera cameraPos={{ x: -0.16, y: 1.4, z: 7.5 }} />
              {/* <OrbitControls /> */}
            </Canvas>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
