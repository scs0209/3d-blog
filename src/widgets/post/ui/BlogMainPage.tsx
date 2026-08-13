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
  const category = searchParams.get('category');
  const tagsParam = searchParams.get('tags');
  const tags = tagsParam?.split(',').filter(Boolean) ?? [];
  const hasFilters = Boolean(search || category || tags.length > 0);

  const { posts, isLoading } = usePost({
    search: search ?? '',
    category: category ?? '',
    tags: tagsParam ?? '',
    page: 1,
    limit: 10,
  });

  const postsData = posts?.pages?.flatMap((page) => page.data ?? []) ?? [];

  if (!isLoading && postsData.length === 0) {
    return (
      <div className='mx-auto w-full max-w-4xl'>
        <NoResults
          searchTerm={search ?? undefined}
          category={category ?? undefined}
          tags={tags.length > 0 ? tags : undefined}
        />
      </div>
    );
  }

  if (hasFilters) {
    const filterLabel = [
      search ? `"${search}"` : null,
      category ? `카테고리 ${category}` : null,
      tags.length > 0 ? `태그 ${tags.map((tag) => `#${tag}`).join(' ')}` : null,
    ]
      .filter(Boolean)
      .join(' · ');

    return (
      <div className='mx-auto w-full max-w-4xl'>
        <BlogSectionTitle subtitle={filterLabel || '조건에 맞는 글'}>검색 결과</BlogSectionTitle>
        <PostList posts={postsData} isLoading={isLoading} />
      </div>
    );
  }

  const recentPosts = postsData.slice(0, 6);
  const restPosts = postsData.slice(6);

  return (
    <div className='mx-auto w-full max-w-4xl'>
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
