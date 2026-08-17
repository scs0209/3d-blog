'use client';

import dynamic from 'next/dynamic';

const BlogLandingScene = dynamic(() => import('@/widgets/post/ui/BlogLandingScene'), {
  ssr: false,
  loading: () => (
    <main className='fixed inset-0 z-10 flex h-full w-full items-center justify-center bg-black'>
      <div className='text-center text-white/80' role='status' aria-live='polite'>
        <div className='mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white' />
        <p className='text-sm'>3D 블로그 로딩 중...</p>
      </div>
    </main>
  ),
});

export default function BlogPage() {
  return <BlogLandingScene />;
}
