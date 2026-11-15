'use client';

import { useParams } from 'next/navigation';
import { useCallback } from 'react';
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

  const { categoryName, categorySlug, posts, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useCategoryPostsInfinite(slug, 10);

  const handleLoadMore = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    // 같은 순간에 스크롤과 관찰자가 함께 불러도, 진행 중인 요청을 취소하고 다시 보내지 않는다
    fetchNextPage({ cancelRefetch: false });
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading && posts.length === 0) {
    return (
      <div className='mx-auto flex w-full max-w-4xl flex-col' aria-busy='true'>
        {['a', 'b', 'c', 'd', 'e'].map((id) => (
          <PostListCardSkeleton key={`category-skeleton-${id}`} />
        ))}
      </div>
    );
  }

  return (
    <div className='mx-auto w-full max-w-4xl'>
      <div className='mb-12'>
        <p className='text-[14px] text-[#8d98a3]'>카테고리</p>
        <h1 className='mt-2 break-keep font-[family-name:var(--font-syne),sans-serif] text-[clamp(2.2rem,6vw,3.5rem)] font-bold leading-none tracking-[-0.02em] text-[#e9edf1]'>
          {categoryName ?? slug}
        </h1>
      </div>
      {posts.length === 0 ? (
        <p className='py-10 text-sm text-[#8d98a3]'>
          {isError ? '글을 불러오지 못했습니다.' : '이 카테고리에는 아직 글이 없습니다.'}
        </p>
      ) : null}
      {posts.map((post) => (
        <PostListCard key={post.id} post={post} categoryName={categoryName} categorySlug={categorySlug} />
      ))}
      <LoadMoreSentinel
        hasNextPage={Boolean(hasNextPage)}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={handleLoadMore}
      />
    </div>
  );
}
