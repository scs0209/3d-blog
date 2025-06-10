'use client';

import { useTags } from '@/features/tag/model/use-tags';
import { Tag } from '@/features/tag/ui';
import { VisitorCounter } from '@/features/blog/ui';
import { useCategories } from '@/features/category/model';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { SparklesCore } from '@/shared/ui/sparkles';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: categories, isLoading } = useCategories();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { data: tags } = useTags();

  // pathname에서 category slug 추출 (/blog/category/react -> react)
  const currentCategorySlug = pathname.startsWith('/blog/category/') ? pathname.split('/blog/category/')[1] : null;
  const isAllPage = pathname === '/blog/all';

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {/* SparklesCore - 데스크톱에서만 표시 */}
      <div className='hidden lg:block'>
        <SparklesCore
          background='transparent'
          minSize={0.3}
          maxSize={0.8}
          particleDensity={300}
          className={`fixed top-0 w-8 h-full pointer-events-none z-5 transition-all duration-300 ${
            sidebarOpen ? 'right-80' : 'right-0'
          }`}
          particleColor='#7dd3fc'
          speed={2}
        />
      </div>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            key='desktop-sidebar'
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'tween', duration: 0.35, ease: 'easeInOut' }}
            className='hidden lg:flex h-screen flex-shrink-0 flex-col gap-8 w-80 p-6 bg-[#181c2a]/80 border-l border-blue-300 shadow-[0_0_16px_4px_#7dd3fc55] backdrop-blur-sm z-10 relative'
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
              <VisitorCounter />
              <div className='px-3 py-2 flex items-center justify-between'>
                <span className='font-extrabold text-lg font-mono text-blue-100'>Category</span>
              </div>
              <nav className='flex flex-col gap-2 px-3 py-4'>
                {/* 전체 메뉴 */}
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
                  }}
                >
                  전체
                </motion.button>

                {categories?.map((cat) => (
                  <motion.button
                    key={cat.id}
                    type='button'
                    animate={{
                      boxShadow: currentCategorySlug === cat.slug ? '0 0 12px #7dd3fc, 0 0 24px #7dd3fc55' : 'none',
                    }}
                    whileHover={{
                      scale: 1.06,
                      boxShadow:
                        currentCategorySlug === cat.slug ? '0 0 12px #7dd3fc, 0 0 24px #7dd3fc55' : '0 0 8px #7dd3fc55',
                    }}
                    whileTap={{ scale: 0.97 }}
                    className={`text-left px-2 py-1 rounded-lg font-mono transition relative
                        ${
                          currentCategorySlug === cat.slug
                            ? 'bg-blue-100 text-[#232946] border border-blue-300 shadow-[0_0_12px_#7dd3fc,0_0_24px_#7dd3fc55]'
                            : 'bg-transparent hover:bg-blue-900/40 text-blue-100 border-0'
                        }`}
                    onClick={() => {
                      router.push(`/blog/category/${cat.slug}`);
                    }}
                  >
                    {cat.name}
                  </motion.button>
                ))}
              </nav>
            </div>
            <div>
              <h2 className='font-extrabold text-base px-3 mb-2 font-mono text-blue-100'>Tags</h2>
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
}
