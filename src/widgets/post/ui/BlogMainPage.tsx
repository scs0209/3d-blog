'use client';

import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef } from 'react';
import { getPostList } from '@/features/post/api/post-api';
import type { GetPostListParams, GetPostListResponse } from '@/features/post/model';
import { AnalyticsEvents, trackEvent } from '@/shared/lib/analytics';
import { queryKeys } from '@/shared/queryKeys';
import { useBlogScrollRoot } from '@/widgets/post/ui/BlogScrollContext';
import { blogTheme } from '@/widgets/post/ui/blog-theme';
import { BlogSectionTitle } from './BlogSectionTitle';
import { NoResults } from './NoResults';
import { PostList } from './PostList';
import { RecentPosts } from './RecentPosts';

type BlogMainPageProps = {
  initialPosts?: GetPostListResponse;
};

type LoadMorePostsProps = {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
};

const LoadMorePosts = ({ hasNextPage, isFetchingNextPage, onLoadMore }: LoadMorePostsProps) => {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const scrollRoot = useBlogScrollRoot();

  useEffect(() => {
    if (!hasNextPage) return;

    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isFetchingNextPage) {
          onLoadMore();
        }
      },
      {
        root: scrollRoot,
        rootMargin: '320px',
        threshold: 0,
      },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, onLoadMore, scrollRoot]);

  if (!hasNextPage && !isFetchingNextPage) {
    return null;
  }

  return (
    <div ref={sentinelRef} className='mt-8 flex justify-center'>
      <button
        type='button'
        onClick={onLoadMore}
        disabled={isFetchingNextPage || !hasNextPage}
        className={`rounded-lg px-4 py-2 text-sm transition disabled:opacity-60 ${blogTheme.navBtn}`}
        aria-label='다음 글 불러오기'
      >
        {isFetchingNextPage ? '불러오는 중...' : '더 보기'}
      </button>
    </div>
  );
};

export const BlogMainPage = ({ initialPosts }: BlogMainPageProps) => {
  const searchParams = useSearchParams();
  const search = searchParams.get('search') ?? '';
  const category = searchParams.get('category') ?? '';
  const tagsParam = searchParams.get('tags') ?? '';
  const tags = tagsParam.split(',').filter(Boolean);
  const hasFilters = Boolean(search || category || tags.length > 0);

  const listParams: GetPostListParams = {
    search,
    category,
    tags: tagsParam,
    page: 1,
    limit: 10,
  };

  const canUseInitialData = Boolean(initialPosts) && !hasFilters;

  const { data, isLoading, isError, isSuccess, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useInfiniteQuery<GetPostListResponse>({
    queryKey: queryKeys.post.all(listParams).queryKey,
    queryFn: ({ pageParam = 1 }) => getPostList({ ...listParams, page: pageParam as number }),
    initialPageParam: 1,
    staleTime: 60_000,
    initialData: canUseInitialData
      ? {
          pages: [initialPosts as GetPostListResponse],
          pageParams: [1],
        }
      : undefined,
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage.meta?.pagination?.currentPage;
      const nextPageExists = lastPage.meta?.pagination?.hasNextPage;
      if (nextPageExists && currentPage) {
        return currentPage + 1;
      }
      return undefined;
    },
    placeholderData: keepPreviousData,
  });

  const postsData = data?.pages?.flatMap((page) => page.data ?? []) ?? [];
  const showLoading = isLoading && postsData.length === 0;
  const trackedKeyRef = useRef<string>('');

  const handleLoadMore = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleRetry = () => {
    refetch();
  };

  useEffect(() => {
    if (!isSuccess || showLoading || !hasFilters) return;

    const key = `${search}|${category}|${tagsParam}|${postsData.length}`;
    if (trackedKeyRef.current === key) return;
    trackedKeyRef.current = key;

    trackEvent(AnalyticsEvents.blogSearchSubmit, {
      query_length: search.length,
      has_query: Boolean(search),
      has_category: Boolean(category),
      has_tag: tags.length > 0,
      tag_count: tags.length,
      result_count: postsData.length,
    });

    if (postsData.length === 0) {
      trackEvent(AnalyticsEvents.blogSearchZeroResult, {
        query_length: search.length,
        has_query: Boolean(search),
        has_category: Boolean(category),
        has_tag: tags.length > 0,
        tag_count: tags.length,
      });
    }
  }, [isSuccess, showLoading, hasFilters, search, category, tagsParam, tags.length, postsData.length]);

  if (isError && postsData.length === 0) {
    return (
      <div className='mx-auto flex min-h-[40vh] w-full max-w-4xl flex-col items-center justify-center gap-4 px-4 py-16'>
        <p className={`text-center text-sm ${blogTheme.textMuted}`}>글을 불러오지 못했습니다.</p>
        <button
          type='button'
          onClick={handleRetry}
          className={`rounded-lg px-4 py-2 text-sm ${blogTheme.navBtn}`}
          aria-label='글 목록 다시 불러오기'
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (isSuccess && !showLoading && postsData.length === 0) {
    return (
      <div className='mx-auto w-full max-w-4xl'>
        <NoResults
          searchTerm={search || undefined}
          category={category || undefined}
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
        <PostList posts={postsData} isLoading={showLoading} />
        <LoadMorePosts
          hasNextPage={Boolean(hasNextPage)}
          isFetchingNextPage={isFetchingNextPage}
          onLoadMore={handleLoadMore}
        />
      </div>
    );
  }

  const recentPosts = postsData.slice(0, 6);
  const restPosts = postsData.slice(6);

  return (
    <div className='mx-auto w-full max-w-4xl'>
      <BlogSectionTitle subtitle='최근에 올라온 글'>Recent</BlogSectionTitle>
      <RecentPosts posts={recentPosts} isLoading={showLoading} />

      {restPosts.length > 0 && (
        <>
          <BlogSectionTitle subtitle='더 많은 이야기'>Archive</BlogSectionTitle>
          <PostList posts={restPosts} isLoading={showLoading} />
        </>
      )}
      <LoadMorePosts
        hasNextPage={Boolean(hasNextPage)}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={handleLoadMore}
      />
    </div>
  );
};
