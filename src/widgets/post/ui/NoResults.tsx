'use client';

import { useRouter } from 'next/navigation';
import { blogTheme } from '@/widgets/post/ui/blog-theme';

interface NoResultsProps {
  searchTerm?: string;
  category?: string;
  tags?: string[];
}

export const NoResults = ({ searchTerm, category, tags }: NoResultsProps) => {
  const router = useRouter();
  const hasFilters = Boolean(searchTerm || category || (tags && tags.length > 0));
  const filterLabel = [
    searchTerm ? `"${searchTerm}"` : null,
    category ? `카테고리: ${category}` : null,
    tags?.length ? `태그: ${tags.map((tag) => `#${tag}`).join(' ')}` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <div className='py-16'>
      <p className={`${blogTheme.mono} ${blogTheme.textAccent}`}>0 results</p>
      <h2 className='mt-4 font-[family-name:var(--font-syne),sans-serif] text-2xl font-semibold text-[#e9edf1]'>
        {hasFilters ? '검색 결과가 없습니다' : '아직 게시물이 없습니다'}
      </h2>
      {hasFilters && filterLabel ? <p className={`mt-3 text-sm ${blogTheme.textMuted}`}>{filterLabel}</p> : null}
      <button
        type='button'
        onClick={() => router.push('/blog')}
        className={`mt-8 px-4 py-2 ${blogTheme.mono} ${blogTheme.navBtn}`}
      >
        전체 게시물 보기
      </button>
    </div>
  );
};
