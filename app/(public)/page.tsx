'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Navbar } from '@/shared/ui';

const HomeCanvas = dynamic(() => import('@/views/home').then((mod) => mod.HomeCanvas), {
  ssr: false,
  loading: () => <div className='absolute inset-0 bg-[#070414]' aria-hidden />,
});

const HomePage = () => {
  return (
    <div className='relative w-screen h-screen overflow-hidden scene-wrapper dark:bg-none'>
      <Navbar />

      <Suspense fallback={<div className='absolute inset-0 bg-[#070414]' aria-hidden />}>
        <HomeCanvas />
      </Suspense>
    </div>
  );
};

export default HomePage;
