'use client';
import { usePost } from '@/features/post/model';
import { useSearchParams } from 'next/navigation';
import { RecentPosts } from './RecentPosts';
import { PostList } from './PostList';

export const BlogMainPage = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get('search');
  const { posts, isLoading } = usePost({
    search: search ?? '',
    category: searchParams.get('category') ?? '',
    tags: searchParams.get('tags') ?? '',
    page: 1,
    limit: 10,
  });

  const postsData = posts?.pages?.flatMap((page) => page.data ?? []) ?? [];

  const recentPosts = postsData.slice(0, 6);
  const restPosts = postsData.slice(6);

  return (
    <div className='max-w-4xl mx-auto w-full'>
      {/* 최근 포스트 섹션 */}
      <RecentPosts posts={recentPosts} isLoading={isLoading} />

      {/* 포스트 리스트 섹션 */}
      <PostList posts={restPosts} isLoading={isLoading} />
    </div>
  );
};
