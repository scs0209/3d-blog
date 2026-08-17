'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useBlogScrollRoot } from '@/widgets/post/ui/BlogScrollContext';
import { blogTheme } from '@/widgets/post/ui/blog-theme';

type LoadMoreSentinelProps = {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
};

export const LoadMoreSentinel = ({ hasNextPage, isFetchingNextPage, onLoadMore }: LoadMoreSentinelProps) => {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const scrollRoot = useBlogScrollRoot();
  const onLoadMoreRef = useRef(onLoadMore);

  onLoadMoreRef.current = onLoadMore;

  const tryLoadMore = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    onLoadMoreRef.current();
  }, [hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    if (!hasNextPage) return;

    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          tryLoadMore();
        }
      },
      {
        root: scrollRoot,
        rootMargin: '400px',
        threshold: 0,
      },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasNextPage, scrollRoot, tryLoadMore]);

  useEffect(() => {
    if (!hasNextPage || !scrollRoot) return;

    const handleScroll = () => {
      const nearBottom = scrollRoot.scrollTop + scrollRoot.clientHeight >= scrollRoot.scrollHeight - 400;
      if (nearBottom) tryLoadMore();
    };

    scrollRoot.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => scrollRoot.removeEventListener('scroll', handleScroll);
  }, [hasNextPage, scrollRoot, tryLoadMore]);

  if (!hasNextPage && !isFetchingNextPage) {
    return null;
  }

  return (
    <div ref={sentinelRef} className='mt-8 flex min-h-[48px] justify-center pb-8'>
      <button
        type='button'
        onClick={tryLoadMore}
        disabled={isFetchingNextPage || !hasNextPage}
        className={`rounded-lg px-4 py-2 text-sm transition disabled:opacity-60 ${blogTheme.navBtn}`}
        aria-label='다음 글 불러오기'
      >
        {isFetchingNextPage ? '불러오는 중...' : '더 보기'}
      </button>
    </div>
  );
};
