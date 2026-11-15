'use client';

import { Suspense, useState } from 'react';
import BlogHeader from '@/widgets/post/ui/BlogHeader';
import { BlogScrollContext, useScrolledPast } from '@/widgets/post/ui/BlogScrollContext';

/**
 * 블로그 첫 화면의 틀. 사이드바 없이 화면 전체를 쓰고,
 * 머리줄은 스크롤해도 위에 고정된다. 3D 장면 위에서는 투명하고,
 * 아래 목록으로 내려가면 글자가 묻히지 않게 바탕이 깔린다.
 */
export const BlogLandingShell = ({ children }: { children: React.ReactNode }) => {
  const [scrollRoot, setScrollRoot] = useState<HTMLElement | null>(null);
  const scrolled = useScrolledPast(scrollRoot, 120);

  return (
    <div ref={setScrollRoot} className='relative h-dvh w-full overflow-y-auto bg-[#050608] text-[#c3ccd4]'>
      <BlogScrollContext.Provider value={scrollRoot}>
        <div
          className={`fixed inset-x-0 top-0 z-30 px-5 transition-colors duration-300 md:px-12 ${scrolled ? 'bg-[#050608]/95' : 'bg-transparent'}`}
        >
          <Suspense fallback={<div className='h-16' />}>
            <BlogHeader wide />
          </Suspense>
        </div>
        {children}
      </BlogScrollContext.Provider>
    </div>
  );
};
