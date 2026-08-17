'use client';

import { useCallback } from 'react';
import { useParams } from 'next/navigation';
import { PostListCard } from '@/features/blog/ui';
import { useCategoryPostsInfinite } from '@/features/category/model';
import { PostListCardSkeleton } from '@/shared/ui/skeleton';
import { LoadMoreSentinel } from '@/widgets/post/ui/LoadMoreSentinel';

export default function BlogPostPage() {
  const { slug: rawSlug } = useParams();
  const slug = (() => {
    const value = String(rawSlug ?? '');
    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  })();

  const {
    categoryName,
    categorySlug,
    posts,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCategoryPostsInfinite(slug, 10);

  const handleLoadMore = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading && posts.length === 0) {
    return (
      <div className='mx-auto flex w-full max-w-4xl flex-col gap-8' aria-busy='true'>
        {['a', 'b', 'c', 'd', 'e'].map((id) => (
          <PostListCardSkeleton key={`category-skeleton-${id}`} />
        ))}
      </div>
    );
  }

  return (
    <div className='mx-auto w-full max-w-4xl'>
      {posts.map((post) => (
        <PostListCard
          key={post.id}
          post={post}
          categoryName={categoryName}
          categorySlug={categorySlug}
        />
      ))}
      <LoadMoreSentinel
        hasNextPage={Boolean(hasNextPage)}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={handleLoadMore}
      />
    </div>
  );
};
