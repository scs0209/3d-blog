'use client';
import { usePost } from '@/features/post/model';
import { useSearchParams } from 'next/navigation';
import { RecentPosts } from './RecentPosts';
import { PostList } from './PostList';
import { NoResults } from './NoResults';

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

  // 로딩 중이 아니고 결과가 없을 때
  if (!isLoading && postsData.length === 0) {
    const category = searchParams.get('category');
    const tags = searchParams.get('tags')?.split(',').filter(Boolean) ?? [];

    return (
      <div className='max-w-4xl mx-auto w-full'>
        <NoResults
          searchTerm={search ?? undefined}
          category={category ?? undefined}
          tags={tags.length > 0 ? tags : undefined}
        />
      </div>
    );
  }

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
