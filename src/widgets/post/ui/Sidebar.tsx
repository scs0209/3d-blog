'use client';

import { toCategoryListItems } from '@/entities/category';
import { getTagPostCount } from '@/entities/tag/lib/get-tag-post-count';
import { VisitorCounter } from '@/features/blog/ui';
import { useSidebarData } from '@/features/sidebar/model/use-sidebar-data';
import { Tag } from '@/features/tag/ui';
import { SidebarSkeleton } from '@/shared/ui/skeleton';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { isBlogIndexPath } from '@/widgets/post/lib/blog-index-path';
import { sidebarLayout } from '@/widgets/post/ui/sidebar-layout';
import { blogTheme } from '@/widgets/post/ui/blog-theme';
import { CategoryTree } from './CategoryTree';

const SidebarSectionHeader = ({ title }: { title: string }) => (
  <div className={sidebarLayout.sectionHeader}>
    <span className={`h-px flex-1 ${blogTheme.sectionLine}`} aria-hidden />
    <span className={`text-sm font-semibold uppercase tracking-[0.16em] ${blogTheme.labelAccent}`}>{title}</span>
    <span className={`h-px flex-1 ${blogTheme.sectionLineReverse}`} aria-hidden />
  </div>
);

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: sidebarData, isLoading } = useSidebarData();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const categories = useMemo(() => toCategoryListItems(sidebarData?.categories), [sidebarData?.categories]);
  const tags = sidebarData?.tags;

  const currentCategorySlug = (() => {
    const match = pathname.match(/^\/blog\/category\/([^/]+)/);
    return match?.[1] ? decodeURIComponent(match[1]) : null;
  })();
  const isAllPage = isBlogIndexPath(pathname);

  if (isLoading) {
    return <SidebarSkeleton />;
  }

  return (
    <>
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            key='desktop-sidebar'
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
            className={`relative z-10 hidden h-screen w-80 shrink-0 flex-col overflow-hidden p-6 lg:flex ${blogTheme.sidebar}`}
            style={{ minWidth: 320, fontFamily: 'var(--font-syne), sans-serif' }}
          >
            <button
              type='button'
              className={`absolute left-[-40px] top-4 z-20 m-0 border-none bg-transparent p-0 outline-none transition hover:text-[#ff9a3c] dark:hover:text-[#3de8ff] ${blogTheme.textMuted}`}
              onClick={() => setSidebarOpen(false)}
              aria-label='사이드바 접기'
            >
              <ChevronRight size={28} />
            </button>

            <VisitorCounter />

            <div className='flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto'>
              <section className={sidebarLayout.section} aria-label='카테고리'>
                <SidebarSectionHeader title='Category' />
                <nav className={sidebarLayout.navList} aria-label='블로그 카테고리'>
                  <div className={sidebarLayout.navRow}>
                    <span className={sidebarLayout.navToggle} aria-hidden />
                    <motion.button
                      type='button'
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`${sidebarLayout.navButton} ${isAllPage ? blogTheme.navActive : blogTheme.navIdle}`}
                      onClick={() => router.push('/blog/all')}
                    >
                      <LayoutGrid size={15} className='shrink-0 opacity-80' aria-hidden />
                      <span className='truncate'>All</span>
                    </motion.button>
                  </div>

                  <CategoryTree
                    categories={categories}
                    currentCategorySlug={currentCategorySlug}
                    onSelect={(slug) => router.push(`/blog/category/${slug}`)}
                  />
                </nav>
              </section>

              <section className={sidebarLayout.section} aria-label='태그'>
                <SidebarSectionHeader title='Tags' />
                <div className={sidebarLayout.tags}>
                  {tags?.map((tag) => (
                    <Tag key={tag.id} tag={tag} count={getTagPostCount(tag)} variant='sidebar' />
                  ))}
                </div>
              </section>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {!sidebarOpen && (
        <button
          type='button'
          className={`fixed right-0 top-1/2 z-30 hidden -translate-y-1/2 border-none bg-transparent p-0 outline-none transition hover:text-[#ff9a3c] dark:hover:text-[#3de8ff] lg:flex ${blogTheme.textMuted}`}
          onClick={() => setSidebarOpen(true)}
          aria-label='사이드바 열기'
        >
          <ChevronLeft size={28} />
        </button>
      )}
    </>
  );
}
