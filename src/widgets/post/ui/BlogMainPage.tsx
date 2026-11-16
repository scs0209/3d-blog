'use client';

import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toCategoryListItems } from '@/entities/category';
import type { PostResponse } from '@/entities/post/model/post';
import { getTagPostCount } from '@/entities/tag/lib/get-tag-post-count';
import { getPostList } from '@/features/post/api/post-api';
import type { GetPostListParams, GetPostListResponse } from '@/features/post/model';
import { useSidebarData } from '@/features/sidebar/model/use-sidebar-data';
import { useVisitor } from '@/features/visitor/model';
import { getPostPath } from '@/shared/consts/baseUrl';
import { useViewportProfile } from '@/shared/hooks/use-viewport-profile';
import { AnalyticsEvents, trackEvent } from '@/shared/lib/analytics';
import { getNextPageParamFromMeta } from '@/shared/lib/pagination';
import { POST_LIST_STALE_TIME } from '@/shared/lib/query-persist';
import { queryKeys } from '@/shared/queryKeys';
import { getBlogIndexHref } from '@/widgets/post/lib/blog-index-path';
import { useBlogScrollRoot, useScrolledPast } from '@/widgets/post/ui/BlogScrollContext';
import { blogTheme } from '@/widgets/post/ui/blog-theme';
import { LoadMoreSentinel } from '@/widgets/post/ui/LoadMoreSentinel';
import { BlogSectionTitle } from './BlogSectionTitle';
import { NoResults } from './NoResults';
import { PostList } from './PostList';

/** 3D 장면은 브라우저에서만 그린다 */
const LogRack = dynamic(() => import('./LogRack'), { ssr: false, loading: () => null });

const useMounted = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
};

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => setReduced(query.matches);
    handleChange();
    query.addEventListener('change', handleChange);
    return () => query.removeEventListener('change', handleChange);
  }, []);
  return reduced;
};

type BlogMainPageProps = {
  initialPosts?: GetPostListResponse;
};

/** 3D 첫 화면이 아닌 상태(검색 결과, 오류, 빈 목록)의 틀. 머리줄 아래에서 시작한다 */
const Frame = ({ children }: { children: React.ReactNode }) => (
  <div className='mx-auto w-full max-w-5xl px-5 pt-36 pb-16 md:px-12 lg:mx-0 lg:max-w-none lg:pt-28 lg:pr-[22rem]'>
    {children}
  </div>
);

/** 포트폴리오와 같은 조명 색 목록. 이번 방문에 포트폴리오가 고른 색을 그대로 쓴다 */
const ACCENTS = ['#4de3ff', '#9d8cff', '#5cf0b6', '#ff7ab6'] as const;
const useVisitAccent = () => {
  const [accent, setAccent] = useState<string>(ACCENTS[0]);
  useEffect(() => {
    try {
      const boot = Number(window.localStorage.getItem('ayaan-portfolio-boot') ?? '1');
      setAccent(ACCENTS[(Math.max(1, boot) - 1) % ACCENTS.length] ?? ACCENTS[0]);
    } catch {
      // 저장소를 쓸 수 없으면 기본 색을 쓴다
    }
  }, []);
  return accent;
};

const chip =
  'rounded-md bg-white/[0.07] px-2.5 py-1 text-[13px] text-[#d3dae0] transition-colors hover:bg-white/[0.14] hover:text-white';

/**
 * 방문자 수 · 카테고리 · 태그. 첫 화면에서 바로 보이도록 3D 장면 위에 얹는다.
 * 넓은 화면에서는 오른쪽의 패널, 좁은 화면에서는 머리줄 아래 가로로 넘기는 한 줄이다.
 * 둘 다 스크롤해도 제자리에 고정되어, 목록을 내려 보는 중에도 바로 쓸 수 있다.
 * layout='inline'은 좁은 화면의 검색 결과에서 본문 위에 놓는 형태다.
 */
const BlogAside = ({ layout }: { layout: 'overlay' | 'inline' }) => {
  const scrolled = useScrolledPast(useBlogScrollRoot(), 120);
  const { data } = useSidebarData();
  const { data: visitor } = useVisitor();
  const categories = toCategoryListItems(data?.categories);
  const tags = data?.tags ?? [];
  const count = (value: number | undefined) => (value == null ? '—' : value.toLocaleString('en-US'));
  const visitors = (
    <p className='text-[13px] text-[#8d98a3]'>
      오늘 <span className='tabular-nums text-[#e9edf1]'>{count(visitor?.today)}</span>
      <span className='mx-2 text-white/20'>·</span>
      전체 <span className='tabular-nums text-[#e9edf1]'>{count(visitor?.total)}</span>
    </p>
  );
  const categoryLinks = categories.map((category) => (
    <Link key={category.id} href={`/blog/category/${category.slug}`} className={`${chip} ${blogTheme.focus}`}>
      {category.name}
    </Link>
  ));
  const tagLinks = tags.map((tag) => (
    <Link
      key={tag.id}
      href={getBlogIndexHref({ tags: tag.name ?? '' })}
      aria-label={`${tag.name ?? ''}, ${getTagPostCount(tag)}개의 글`}
      className={`${chip} ${blogTheme.focus}`}
    >
      #{tag.name}
      <span className='ml-1.5 text-[#8d98a3]' aria-hidden>
        {getTagPostCount(tag)}
      </span>
    </Link>
  ));

  if (layout === 'inline') {
    return (
      <div className='mb-12 flex flex-col gap-4 lg:hidden'>
        {visitors}
        <div className='flex flex-wrap gap-2'>{categoryLinks}</div>
        <div className='flex flex-wrap gap-2'>{tagLinks}</div>
      </div>
    );
  }

  return (
    <>
      {/* 넓은 화면: 오른쪽 위에 고정된 패널 */}
      <aside
        aria-label='방문자 수, 카테고리, 태그'
        className='fixed top-20 right-12 z-20 hidden w-[17rem] flex-col gap-5 rounded-xl bg-[#0b0e12]/90 p-5 lg:flex'
      >
        {visitors}
        <div>
          <h2 className='mb-2 text-[13px] font-medium text-[#8d98a3]'>카테고리</h2>
          <div className='flex flex-wrap gap-1.5'>{categoryLinks}</div>
        </div>
        <div>
          <h2 className='mb-2 text-[13px] font-medium text-[#8d98a3]'>태그</h2>
          <div className='flex flex-wrap gap-1.5'>{tagLinks}</div>
        </div>
      </aside>
      {/* 좁은 화면: 머리줄 아래에 고정된, 가로로 넘겨 보는 한 줄 */}
      <div
        className={`fixed inset-x-0 top-16 z-20 flex flex-col gap-2 px-5 pb-2 transition-colors duration-300 lg:hidden ${scrolled ? 'bg-[#050608]/95' : 'bg-transparent'}`}
      >
        {visitors}
        <div className='-mx-5 flex gap-1.5 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
          {categoryLinks.map((link) => (
            <span key={link.key} className='shrink-0'>
              {link}
            </span>
          ))}
          {tagLinks.map((link) => (
            <span key={link.key} className='shrink-0'>
              {link}
            </span>
          ))}
        </div>
      </div>
    </>
  );
};

export const BlogMainPage = ({ initialPosts }: BlogMainPageProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  // 화면 폭과 저장된 목록 데이터는 브라우저에서만 알 수 있다.
  // 서버가 그린 화면과 첫 화면이 어긋나지 않도록, 화면에 붙은 뒤에만 반영한다
  const mounted = useMounted();
  const viewport = useViewportProfile();
  const isMobile = mounted && viewport.isMobile;
  const still = usePrefersReducedMotion();
  const accent = useVisitAccent();
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
      staleTime: POST_LIST_STALE_TIME,
      initialData: canUseInitialData
        ? {
            pages: [initialPosts as GetPostListResponse],
            pageParams: [1],
          }
        : undefined,
      getNextPageParam: (lastPage) => getNextPageParamFromMeta(lastPage),
      placeholderData: keepPreviousData,
    });

  const loadedPosts = data?.pages?.flatMap((page) => page.data ?? []) ?? [];
  // 브라우저에 저장해 둔 목록은 서버가 그린 첫 페이지보다 길 수 있다.
  // 화면에 붙기 전에는 서버와 같은 첫 페이지만 그려, 두 화면이 어긋나지 않게 한다
  const postsData = canUseInitialData && !mounted ? (initialPosts?.data ?? loadedPosts) : loadedPosts;
  const showLoading = isLoading && postsData.length === 0;
  const trackedKeyRef = useRef<string>('');

  const handleLoadMore = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    // 같은 순간에 스크롤과 관찰자가 함께 불러도, 진행 중인 요청을 취소하고 다시 보내지 않는다
    fetchNextPage({ cancelRefetch: false });
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleOpen = useCallback(
    (post: PostResponse) => {
      router.push(getPostPath(post.category?.slug, post.slug ?? ''));
    },
    [router],
  );

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
      <Frame>
        <div className='flex min-h-[40vh] flex-col items-center justify-center gap-4'>
          <p className={`text-center text-sm ${blogTheme.textMuted}`}>글을 불러오지 못했습니다.</p>
          <button
            type='button'
            onClick={handleRetry}
            className={`px-4 py-2 ${blogTheme.mono} ${blogTheme.navBtn}`}
            aria-label='글 목록 다시 불러오기'
          >
            다시 시도
          </button>
        </div>
      </Frame>
    );
  }

  if (isSuccess && !showLoading && postsData.length === 0) {
    return (
      <Frame>
        <NoResults
          searchTerm={search || undefined}
          category={category || undefined}
          tags={tags.length > 0 ? tags : undefined}
        />
      </Frame>
    );
  }

  const loadMore = !mounted ? null : (
    <LoadMoreSentinel
      hasNextPage={Boolean(hasNextPage)}
      isFetchingNextPage={isFetchingNextPage}
      onLoadMore={handleLoadMore}
    />
  );

  if (hasFilters) {
    const filterLabel = [
      search ? `"${search}"` : null,
      category ? `카테고리 ${category}` : null,
      tags.length > 0 ? `태그 ${tags.map((tag) => `#${tag}`).join(' ')}` : null,
    ]
      .filter(Boolean)
      .join(' · ');

    return (
      <Frame>
        {mounted ? <BlogAside layout='overlay' /> : null}
        <BlogSectionTitle subtitle={filterLabel || '조건에 맞는 글'}>검색 결과</BlogSectionTitle>
        <PostList posts={postsData} isLoading={showLoading} />
        {loadMore}
      </Frame>
    );
  }

  // 첫 화면: 화면 전체가 칩 안의 도시이고, 최근 글은 슬롯에 꽂힌 카드다(좁은 화면은 2장). 나머지는 아래에 한 줄씩 둔다
  const rackCount = isMobile ? 2 : 4;
  const recentPosts: PostResponse[] = postsData.slice(0, rackCount);
  const restPosts: PostResponse[] = postsData.slice(rackCount);

  return (
    <>
      <section className='relative h-dvh min-h-[560px] w-full overflow-hidden' aria-label='최근 글'>
        {showLoading ? null : (
          <div className='absolute inset-0'>
            <LogRack posts={recentPosts} compact={isMobile} still={still} accent={accent} onOpen={handleOpen} />
          </div>
        )}
        <div className='pointer-events-none absolute inset-x-0 bottom-0 z-10 px-5 pb-8 md:px-12 md:pb-12'>
          <h1 className='font-[family-name:var(--font-syne),sans-serif] text-[clamp(3.4rem,13vw,10.5rem)] font-bold leading-[0.86] tracking-[-0.03em] text-[#e9edf1]'>
            Blog
          </h1>
          <div className='mt-5 flex flex-wrap items-end justify-between gap-x-10 gap-y-3'>
            <p className='max-w-md text-[15px] leading-relaxed text-[#c3ccd4]'>
              웹 개발 기록, Next.js·Three.js 실험과 학습 노트.
            </p>
            <p className={`${blogTheme.mono} text-[#8d98a3]`}>
              {isMobile
                ? '카드를 누르면 솟아오르고, 다시 누르면 열립니다'
                : '카드를 누르면 글이 열립니다 · 아래로 내리면 이전 글'}
            </p>
          </div>
        </div>
        {mounted ? <BlogAside layout='overlay' /> : null}
        {/* 3D 장면을 쓰지 못하는 경우를 위한 같은 글 목록 */}
        <ul className='sr-only'>
          {recentPosts.map((post) => (
            <li key={post.id ?? post.slug}>
              <Link href={getPostPath(post.category?.slug, post.slug ?? '')}>{post.title}</Link>
            </li>
          ))}
        </ul>
      </section>

      <div className='mx-auto w-full max-w-5xl px-5 py-16 md:px-12 lg:mx-0 lg:max-w-none lg:pr-[22rem]'>
        {restPosts.length > 0 && (
          <>
            <BlogSectionTitle subtitle='이전 글'>Archive</BlogSectionTitle>
            <PostList posts={restPosts} isLoading={showLoading} />
          </>
        )}
        {loadMore}
      </div>
    </>
  );
};
