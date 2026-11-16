'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { toCategoryListItems } from '@/entities/category';
import { getTagPostCount } from '@/entities/tag/lib/get-tag-post-count';
import { useSidebarData } from '@/features/sidebar/model/use-sidebar-data';
import { Tag } from '@/features/tag/ui';
import { isBlogIndexPath } from '@/widgets/post/lib/blog-index-path';
import { blogTheme } from '@/widgets/post/ui/blog-theme';
import { CategoryTree } from './CategoryTree';

export const MobileNavbar = ({
  menuOpen,
  setMenuOpen,
}: {
  menuOpen: boolean;
  setMenuOpen: (menuOpen: boolean) => void;
}) => {
  const { data: sidebarData } = useSidebarData();
  const router = useRouter();
  const pathname = usePathname();
  const categories = useMemo(() => toCategoryListItems(sidebarData?.categories), [sidebarData?.categories]);
  const tags = sidebarData?.tags;

  const currentCategorySlug = (() => {
    const match = pathname.match(/^\/blog\/category\/([^/]+)/);
    return match?.[1] ? decodeURIComponent(match[1]) : null;
  })();
  const isAllPage = isBlogIndexPath(pathname);

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
          className={`fixed inset-0 z-50 flex justify-end lg:hidden ${blogTheme.overlay}`}
        >
          <motion.div
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 80, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className={`flex h-full w-72 max-w-full flex-col gap-8 overflow-y-auto p-6 ${blogTheme.sidebar}`}
          >
            <div className='mb-4 flex items-center justify-between'>
              <span className={`${blogTheme.mono} ${blogTheme.labelAccent}`}>Category</span>
              <button
                type='button'
                className={`rounded-md p-1 ${blogTheme.iconBtn}`}
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
                className={`rounded-md px-2 py-1.5 text-left text-sm transition ${
                  isAllPage ? blogTheme.navActive : blogTheme.navIdle
                }`}
                onClick={() => {
                  router.push('/blog');
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
              <h2 className={`mb-3 px-1 ${blogTheme.mono} ${blogTheme.labelAccent}`}>Tags</h2>
              <div className='flex flex-wrap gap-2'>
                {tags?.map((tag) => (
                  <Tag key={tag.id} tag={tag} count={getTagPostCount(tag)} />
                ))}
              </div>
            </div>
            {/* 좁은 화면에서는 머리줄의 이동 링크가 여기로 온다 */}
            <div className='mt-auto flex gap-5 pt-5'>
              {[
                { href: '/', label: 'Portfolio' },
                { href: '/login', label: 'Login' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${blogTheme.mono} text-[#8d98a3] transition-colors hover:text-white`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
