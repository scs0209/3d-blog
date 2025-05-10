'use client';

import { Macintosh } from '@/widgets/post/ui';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

export default function Home() {
  // const session = await auth();

  return (
    <main className='flex flex-col items-center row-start-2 gap-8 sm:items-start h-screen'>
      <Canvas
        camera={{ fov: 75, near: 0.1, zoom: 10, position: [0, 0, 10] }}
        // onPointerMissed={() => setActiveObject(null)}
      >
        {/* 부드러운 전체 조명 */}
        <ambientLight intensity={0.5} />
        {/* 강한 방향성 조명 (그림자와 하이라이트) */}
        <directionalLight
          intensity={1.2}
          position={[5, 10, 7]}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        {/* 보조 조명 (입체감 보강) */}
        <pointLight intensity={0.5} position={[-10, 5, -10]} />
        <Macintosh />
        <OrbitControls />
      </Canvas>
      {/* <BlogHeader />
      <BlogMain />
      <div>{session?.user.name}</div>
      <SignoutButton />
      <BlogFooter /> */}
    </main>
  );
}
