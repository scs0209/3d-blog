'use client';
import { useCategories } from '@/features/category/model';
import { useTags } from '@/features/tag/model/use-tags';
import { Tag } from '@/features/tag/ui';
import { toCategoryListItems } from '@/entities/category';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import { useMemo } from 'react';
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
    const match = pathname.match(/^\/blog\/category\/([^\/]+)/);
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
          className='fixed inset-0 z-40 bg-black/60 flex justify-end lg:hidden'
        >
          <motion.div
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 80, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className='w-72 max-w-full h-full flex flex-col gap-8 p-6 bg-[#181c2a]/90 border-l border-blue-300 shadow-[0_0_16px_4px_#7dd3fc55] backdrop-blur-sm overflow-y-auto'
          >
            <div className='flex items-center justify-between mb-4'>
              <span className='font-extrabold text-lg font-mono text-blue-100'>Category</span>
              <button
                type='button'
                className='text-blue-100 p-1 rounded-full hover:bg-blue-900/40'
                onClick={() => setMenuOpen(false)}
                aria-label='메뉴 닫기'
              >
                <svg width='24' height='24' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <title>메뉴 닫기</title>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>
            <nav className='flex flex-col gap-2 px-3 py-4'>
              <motion.button
                type='button'
                animate={{
                  boxShadow: isAllPage ? '0 0 12px #7dd3fc, 0 0 24px #7dd3fc55' : 'none',
                }}
                whileHover={{
                  scale: 1.06,
                  boxShadow: isAllPage ? '0 0 12px #7dd3fc, 0 0 24px #7dd3fc55' : '0 0 8px #7dd3fc55',
                }}
                whileTap={{ scale: 0.97 }}
                className={`text-left px-2 py-1 rounded-lg font-mono transition relative
                  ${
                    isAllPage
                      ? 'bg-blue-100 text-[#232946] border border-blue-300 shadow-[0_0_12px_#7dd3fc,0_0_24px_#7dd3fc55]'
                      : 'bg-transparent hover:bg-blue-900/40 text-blue-100 border-0'
                  }`}
                onClick={() => {
                  router.push('/blog/all');
                  setMenuOpen(false);
                }}
              >
                전체
              </motion.button>

              <CategoryTree
                categories={categories}
                currentCategorySlug={currentCategorySlug}
                onSelect={handleSelectCategory}
              />
            </nav>
            <div>
              <h2 className='font-extrabold text-base px-3 mb-2 font-mono text-blue-100'>Tags</h2>
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
