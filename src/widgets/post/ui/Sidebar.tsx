import type { CategoryResponse } from '@/entities/category/model';
import { useTags } from '@/features/blog/model/use-tags';
import { VisitorCounter, Tag } from '@/features/blog/ui';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export const Sidebar = ({
  categories,
  selectedCategory,
  handleCategoryClick,
}: {
  categories?: CategoryResponse;
  selectedCategory: string | null;
  handleCategoryClick: (category: string) => void;
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { data: tags } = useTags();

  return (
    <>
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            key='desktop-sidebar'
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'tween', duration: 0.35, ease: 'easeInOut' }}
            className='hidden lg:flex h-screen flex-shrink-0 flex-col gap-8 w-80 p-6 bg-[#181c2a]/80 border-l border-blue-300 shadow-[0_0_16px_4px_#7dd3fc55] backdrop-blur-sm z-10'
            style={{ minWidth: 320 }}
          >
            {/* 접기 버튼 (사이드바 내부 오른쪽 상단) */}
            <button
              type='button'
              className='absolute top-4 left-[-44px] z-20 p-0 m-0 bg-none border-none outline-none text-blue-100 hover:text-blue-400 focus:text-blue-400 transition drop-shadow-[0_0_8px_#7dd3fc55] hover:drop-shadow-[0_0_12px_#7dd3fc] focus:drop-shadow-[0_0_12px_#7dd3fc]'
              onClick={() => setSidebarOpen(false)}
              aria-label='사이드바 접기'
              style={{ fontSize: 32, lineHeight: 1 }}
            >
              <ChevronRight size={32} />
            </button>
            {/* 사이드바 내용 */}
            <div>
              <VisitorCounter today={100} total={1000} />
              <div className='px-3 py-2 flex items-center justify-between'>
                <span className='font-extrabold text-lg font-mono text-blue-100'>Category</span>
              </div>
              <nav className='flex flex-col gap-2 px-3 py-4'>
                {categories?.map((cat) => (
                  <motion.button
                    key={cat.id}
                    type='button'
                    whileHover={{
                      scale: 1.06,
                      boxShadow:
                        selectedCategory === cat.name ? '0 0 12px #7dd3fc, 0 0 24px #7dd3fc55' : '0 0 8px #7dd3fc55',
                    }}
                    whileTap={{ scale: 0.97 }}
                    className={`text-left px-2 py-1 rounded-lg font-mono transition relative
                        ${selectedCategory === cat.name ? 'bg-blue-100 text-[#232946] border border-blue-300 shadow-[0_0_12px_#7dd3fc,0_0_24px_#7dd3fc55]' : 'bg-transparent hover:bg-blue-900/40 text-blue-100 border border-transparent'}`}
                    onClick={() => handleCategoryClick(cat.name)}
                  >
                    {cat.name}
                  </motion.button>
                ))}
              </nav>
            </div>
            <div>
              <h2 className='font-extrabold text-base mb-2 font-mono text-blue-100'>Tags</h2>
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
          className='hidden lg:flex fixed top-1/2 right-0 z-30 p-0 m-0 bg-none border-none outline-none text-blue-100 hover:text-blue-400 focus:text-blue-400 transition drop-shadow-[0_0_8px_#7dd3fc55] hover:drop-shadow-[0_0_12px_#7dd3fc] focus:drop-shadow-[0_0_12px_#7dd3fc]'
          onClick={() => setSidebarOpen(true)}
          aria-label='사이드바 열기'
          style={{ fontSize: 32, lineHeight: 1, transform: 'translateY(-50%)' }}
        >
          <ChevronLeft size={32} />
        </button>
      )}
    </>
  );
};
