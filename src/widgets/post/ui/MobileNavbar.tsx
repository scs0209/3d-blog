'use client';

import { toCategoryListItems } from '@/entities/category';
import { useCategories } from '@/features/category/model';
import { useTags } from '@/features/tag/model/use-tags';
import { Tag } from '@/features/tag/ui';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { blogTheme } from '@/widgets/post/ui/blog-theme';
import { CategoryTree } from './CategoryTree';

export const MobileNavbar = ({
  menuOpen,
  setMenuOpen,
}: {
  menuOpen: boolean;
  setMenuOpen: (menuOpen: boolean) => void;
}) => {
  const { data } = useCategories();
  const { data: tags } = useTags();
  const router = useRouter();
  const pathname = usePathname();
  const categories = useMemo(() => toCategoryListItems(data), [data]);

  const currentCategorySlug = (() => {
    const match = pathname.match(/^\/blog\/category\/([^/]+)/);
    return match?.[1] ? decodeURIComponent(match[1]) : null;
  })();
  const isAllPage = pathname === '/blog/all';

  const handleSelectCategory = (slug: string) => {
    router.push(`/blog/category/${slug}`);
    setMenuOpen(false);
  };

  return (
    <AnimatePresence>
      {menuOpen && (
        <motion.div
          key='mobile-sidebar'
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={`fixed inset-0 z-40 flex justify-end backdrop-blur-sm lg:hidden ${blogTheme.overlay}`}
        >
          <motion.div
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 80, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className={`flex h-full w-72 max-w-full flex-col gap-8 overflow-y-auto border-l p-6 ${blogTheme.sidebar}`}
            style={{ fontFamily: 'var(--font-syne), sans-serif' }}
          >
            <div className='mb-4 flex items-center justify-between'>
              <span className={`text-sm font-semibold uppercase tracking-[0.16em] ${blogTheme.labelAccent}`}>
                Category
              </span>
              <button
                type='button'
                className={`rounded-lg p-1 ${blogTheme.iconBtn}`}
                onClick={() => setMenuOpen(false)}
                aria-label='메뉴 닫기'
              >
                <svg width='24' height='24' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <title>메뉴 닫기</title>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>
            <nav className='flex flex-col gap-2 px-1 py-2'>
              <motion.button
                type='button'
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={`rounded-lg px-2 py-1.5 text-left text-sm transition ${
                  isAllPage ? blogTheme.navActive : blogTheme.navIdle
                }`}
                onClick={() => {
                  router.push('/blog/all');
                  setMenuOpen(false);
                }}
              >
                All
              </motion.button>

              <CategoryTree
                categories={categories}
                currentCategorySlug={currentCategorySlug}
                onSelect={handleSelectCategory}
              />
            </nav>
            <div>
              <h2 className={`mb-2 px-1 text-sm font-semibold uppercase tracking-[0.16em] ${blogTheme.labelAccent}`}>
                Tags
              </h2>
              <div className='flex flex-wrap gap-2'>
                {tags?.map((tag) => (
                  <Tag key={tag.id} tag={tag} count={tag.count?.posts ?? 0} />
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
