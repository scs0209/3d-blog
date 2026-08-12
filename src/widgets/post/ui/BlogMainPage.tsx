'use client';
import { usePost } from '@/features/post/model';
import { useSearchParams } from 'next/navigation';
import { RecentPosts } from './RecentPosts';
import { PostList } from './PostList';
import { NoResults } from './NoResults';
import { BlogSectionTitle } from './BlogSectionTitle';

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
      <BlogSectionTitle subtitle='최근에 올라온 글'>Recent</BlogSectionTitle>
      <RecentPosts posts={recentPosts} isLoading={isLoading} />

      {restPosts.length > 0 && (
        <>
          <BlogSectionTitle subtitle='더 많은 이야기'>Archive</BlogSectionTitle>
          <PostList posts={restPosts} isLoading={isLoading} />
        </>
      )}
    </div>
  );
};
