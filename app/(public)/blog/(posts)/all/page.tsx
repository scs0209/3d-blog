import { Suspense } from 'react';
import { getPostList } from '@/features/post/api/post-api';
import type { GetPostListResponse } from '@/features/post/model';
import { BlogMainPage } from '@/widgets/post/ui';

const BlogAllPage = async () => {
  let initialPosts: GetPostListResponse | undefined;
  try {
    initialPosts = await getPostList({
      search: '',
      category: '',
      tags: '',
      page: 1,
      limit: 10,
    });
  } catch {
    initialPosts = undefined;
  }

  return (
    <Suspense fallback={<div className='mx-auto w-full max-w-4xl py-8 text-white/70'>불러오는 중...</div>}>
      <BlogMainPage initialPosts={initialPosts} />
    </Suspense>
  );
};

export default BlogAllPage;
