'use client';

import { Suspense } from 'react';
import { SpaceBackground } from '@/widgets/post/ui';
import BlogHeader from '@/widgets/post/ui/BlogHeader';
import Sidebar from '@/widgets/post/ui/Sidebar';
import { blogTheme } from '@/widgets/post/ui/blog-theme';

type PostsLayoutShellProps = {
  children: React.ReactNode;
};

export const PostsLayoutShell = ({ children }: PostsLayoutShellProps) => {
  return (
    <div className={blogTheme.shellRoot}>
      <div className={`relative h-screen w-full overflow-hidden ${blogTheme.shell}`}>
        <SpaceBackground />

        <div className='relative z-10 flex h-screen'>
          <main className='flex flex-1 justify-center overflow-y-auto p-4 lg:p-10'>
            <div className='w-full'>
              <Suspense fallback={<div className='mx-auto mb-8 h-16 w-full max-w-4xl' />}>
                <BlogHeader />
              </Suspense>
              {children}
            </div>
          </main>

          <Suspense fallback={null}>
            <Sidebar />
          </Suspense>
        </div>

        <div
          className={`pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[32vh] ${blogTheme.bottomVeil}`}
          aria-hidden
        />
      </div>
    </div>
  );
};
