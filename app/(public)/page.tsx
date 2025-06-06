'use client';

import { Navbar } from '@/shared/ui';
import { HomeCanvas } from '@/views/home';
import { useState } from 'react';

const HomePage = () => {
  const [isCubeClicked, setIsCubeClicked] = useState(false);

  return (
    <div className={`w-screen h-screen ${isCubeClicked ? 'bg-slate-900' : 'scene-wrapper'} dark:bg-none`}>
      <Navbar />

      <HomeCanvas onCubeClick={setIsCubeClicked} />
    </div>
  );
};

export default HomePage;
