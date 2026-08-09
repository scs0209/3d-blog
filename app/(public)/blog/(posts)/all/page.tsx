import { Suspense } from 'react';
import { BlogMainPage } from '@/widgets/post/ui';

const BlogAllPage = () => {
  return (
    <Suspense fallback={<div className='max-w-4xl mx-auto w-full py-8 text-white/70'>불러오는 중...</div>}>
      <BlogMainPage />
    </Suspense>
  );
};

export default BlogAllPage;
