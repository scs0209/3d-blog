'use client';

import { toCategoryListItems } from '@/entities/category';
import { VisitorCounter } from '@/features/blog/ui';
import { useCategories } from '@/features/category/model';
import { useTags } from '@/features/tag/model/use-tags';
import { Tag } from '@/features/tag/ui';
import { SidebarSkeleton } from '@/shared/ui/skeleton';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { blogTheme } from '@/widgets/post/ui/blog-theme';
import { CategoryTree } from './CategoryTree';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data, isLoading } = useCategories();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { data: tags } = useTags();
  const categories = useMemo(() => toCategoryListItems(data), [data]);

  const currentCategorySlug = (() => {
    const match = pathname.match(/^\/blog\/category\/([^/]+)/);
    return match?.[1] ? decodeURIComponent(match[1]) : null;
  })();
  const isAllPage = pathname === '/blog/all';

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
            className={`relative z-10 hidden h-screen w-80 flex-shrink-0 flex-col gap-8 p-6 lg:flex ${blogTheme.sidebar}`}
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

            <div>
              <VisitorCounter />
              <div className='mb-3 flex items-center gap-2 px-3'>
                <span className={`h-px flex-1 ${blogTheme.sectionLine}`} aria-hidden />
                <span className={`text-sm font-semibold uppercase tracking-[0.16em] ${blogTheme.labelAccent}`}>
                  Category
                </span>
                <span className={`h-px flex-1 ${blogTheme.sectionLineReverse}`} aria-hidden />
              </div>
              <nav className='flex flex-col gap-2 px-3 py-4'>
                <motion.button
                  type='button'
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`rounded-lg px-2 py-1.5 text-left text-sm transition ${
                    isAllPage ? blogTheme.navActive : blogTheme.navIdle
                  }`}
                  onClick={() => router.push('/blog/all')}
                >
                  All
                </motion.button>

                <CategoryTree
                  categories={categories}
                  currentCategorySlug={currentCategorySlug}
                  onSelect={(slug) => router.push(`/blog/category/${slug}`)}
                />
              </nav>
            </div>

            <div>
              <div className='mb-3 flex items-center gap-2 px-3'>
                <span className={`h-px flex-1 ${blogTheme.sectionLine}`} aria-hidden />
                <h2 className={`text-sm font-semibold uppercase tracking-[0.16em] ${blogTheme.labelAccent}`}>Tags</h2>
                <span className={`h-px flex-1 ${blogTheme.sectionLineReverse}`} aria-hidden />
              </div>
              <div className='flex flex-wrap gap-2'>
                {tags?.map((tag) => (
                  <Tag key={tag.id} tag={tag} count={tag.count?.posts ?? 0} />
                ))}
              </div>
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
