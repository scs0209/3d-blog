'use client';

import { Navbar } from '@/shared/ui';
import { HomeCanvas } from '@/views/home';

const HomePage = () => {
  return (
    <div className='w-screen h-screen scene-wrapper'>
      <Navbar />

      <HomeCanvas />
    </div>
  );
};

export default HomePage;
