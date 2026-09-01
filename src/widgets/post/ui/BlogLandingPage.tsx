'use client';

import dynamic from 'next/dynamic';
import { blogLandingTheme } from '@/widgets/post/ui/blog-landing-theme';

const BlogLandingScene = dynamic(() => import('@/widgets/post/ui/BlogLandingScene'), {
  ssr: false,
  loading: () => (
    <main className={`${blogLandingTheme.shell} flex items-center justify-center`}>
      <p className='text-sm text-[#f5f0e8]/70 dark:text-[#e8eef5]/70'>블로그 씬 불러오는 중...</p>
    </main>
  ),
});

export const BlogLandingPage = () => {
  return <BlogLandingScene />;
};
