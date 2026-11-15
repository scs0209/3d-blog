'use client';

import { Suspense, useState } from 'react';
import BlogHeader from '@/widgets/post/ui/BlogHeader';
import { BlogScrollContext } from '@/widgets/post/ui/BlogScrollContext';
import { blogTheme } from '@/widgets/post/ui/blog-theme';
import Sidebar from '@/widgets/post/ui/Sidebar';

type PostsLayoutShellProps = {
  children: React.ReactNode;
};

export const PostsLayoutShell = ({ children }: PostsLayoutShellProps) => {
  const [scrollRoot, setScrollRoot] = useState<HTMLElement | null>(null);

  return (
    <div className={blogTheme.shellRoot}>
      <div className={`relative h-dvh w-full overflow-hidden ${blogTheme.shell}`}>
        <BlogScrollContext.Provider value={scrollRoot}>
          <div className='relative z-10 flex h-dvh'>
            <main ref={setScrollRoot} className='flex flex-1 justify-center overflow-y-auto px-5 pb-24 lg:px-12'>
              <div className='w-full'>
                <Suspense fallback={<div className='mx-auto h-16 w-full max-w-4xl' />}>
                  <BlogHeader />
                </Suspense>
                {children}
              </div>
            </main>

            <Suspense fallback={null}>
              <Sidebar />
            </Suspense>
          </div>
        </BlogScrollContext.Provider>
      </div>
    </div>
  );
};
