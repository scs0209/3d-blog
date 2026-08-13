'use client';

import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
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
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className='flex min-h-[60vh] flex-col items-center justify-center px-4 py-16'
    >
      <div
        className={`mb-6 flex h-14 w-14 items-center justify-center rounded-full border backdrop-blur-sm ${blogTheme.card}`}
      >
        <Search size={22} className={blogTheme.textMuted} />
      </div>

      <h2
        className={`mb-2 text-center text-xl font-semibold ${blogTheme.textPrimary}`}
        style={{ fontFamily: 'var(--font-syne), sans-serif' }}
      >
        {hasFilters ? '검색 결과가 없습니다' : '아직 게시물이 없습니다'}
      </h2>

      {hasFilters && filterLabel ? (
        <p className={`mb-6 text-center text-sm ${blogTheme.textMuted}`}>{filterLabel}</p>
      ) : (
        <div className='mb-6' />
      )}

      <button
        type='button'
        onClick={() => router.push('/blog/all')}
        className={`rounded-lg border border-[#ff9a3c]/30 bg-[#ff9a3c]/10 px-6 py-2 text-sm transition hover:border-[#ff9a3c]/50 hover:bg-[#ff9a3c]/15 dark:border-[#3de8ff]/30 dark:bg-[#3de8ff]/8 dark:hover:border-[#3de8ff]/50 dark:hover:bg-[#3de8ff]/12 ${blogTheme.textAccent}`}
      >
        전체 게시물 보기
      </button>
    </motion.div>
  );
};
