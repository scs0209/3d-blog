'use client';

import { Navbar } from '@/shared/ui';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const HomeCanvas = dynamic(() => import('@/views/home').then(mod => mod.HomeCanvas), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const HomePage = () => {
  const [isCubeClicked, setIsCubeClicked] = useState(false);

  return (
    <div className={`w-screen h-screen ${isCubeClicked ? 'bg-slate-900' : 'scene-wrapper'} dark:bg-none`}>
      <Navbar />

      <Suspense fallback={<p>Loading...</p>}>
        <HomeCanvas onCubeClick={setIsCubeClicked} />
      </Suspense>
    </div>
  );
};

export default HomePage;
