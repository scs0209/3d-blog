'use client';

import { useEffect, useRef } from 'react';
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { getPostList } from '@/features/post/api/post-api';
import type { GetPostListParams, GetPostListResponse } from '@/features/post/model';
import { AnalyticsEvents, trackEvent } from '@/shared/lib/analytics';
import { queryKeys } from '@/shared/queryKeys';
import { BlogSectionTitle } from './BlogSectionTitle';
import { NoResults } from './NoResults';
import { PostList } from './PostList';
import { RecentPosts } from './RecentPosts';

type BlogMainPageProps = {
  initialPosts?: GetPostListResponse;
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

  const { data, isLoading } = useInfiniteQuery<GetPostListResponse>({
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
      const hasNextPage = lastPage.meta?.pagination?.hasNextPage;
      if (hasNextPage && currentPage) {
        return currentPage + 1;
      }
      return undefined;
    },
    placeholderData: keepPreviousData,
  });

  const postsData = data?.pages?.flatMap((page) => page.data ?? []) ?? [];
  const showLoading = isLoading && postsData.length === 0;
  const trackedKeyRef = useRef<string>('');

  useEffect(() => {
    if (showLoading || !hasFilters) return;

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
  }, [showLoading, hasFilters, search, category, tagsParam, tags.length, postsData.length]);

  if (!showLoading && postsData.length === 0) {
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
    </div>
  );
};
