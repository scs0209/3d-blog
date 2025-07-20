'use client';

import { MobileNavbar } from './MobileNavbar';
import dynamic from 'next/dynamic';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, Search, X, Home, Globe, Navigation } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dropdown } from '@/shared/ui';
import Image from 'next/image';

const SearchBar = dynamic(() => import('./SearchBar').then((mod) => ({ default: mod.SearchBar })), {
  ssr: false,
});

export default function BlogHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [searchExpanded, setSearchExpanded] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleGoToMain = () => {
    router.push('/');
  };

  const handleGoToBlog = () => {
    router.push('/blog');
  };

  const toggleSearch = () => {
    setSearchExpanded(!searchExpanded);
    if (!searchExpanded) {
      setTimeout(() => {
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        searchInput?.focus();
      }, 150);
    }
  };

  const shouldShowSearch = pathname === '/blog/all';

  return (
    <>
      {/* 데스크톱 헤더 */}
      <motion.div
        className='hidden lg:flex items-center justify-between mb-8 p-4 rounded-full bg-black/20 backdrop-blur-md border border-blue-400/20 shadow-2xl h-16 max-w-4xl mx-auto w-full'
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          boxShadow: `
            0 8px 32px rgba(0, 0, 0, 0.3),
            0 0 20px rgba(59, 130, 246, 0.2)
          `,
        }}
      >
        {/* 좌측: 로고 */}
        <div className='flex items-center'>
          <motion.button
            type='button'
            whileHover={{ scale: 1.02 }}
            className='font-extrabold text-lg text-blue-100 flex items-center gap-2 cursor-pointer select-none hover:text-white bg-transparent border-none p-0 m-0 focus:outline-none transition-colors duration-300'
          >
            <Image src='/logo.png' alt='logo' width={24} height={24} /> 3D Tech Blog
          </motion.button>
        </div>

        {/* 우측: 네비게이션 + 검색 */}
        <div className='flex items-center gap-3'>
          {/* 네비게이션 드롭다운 */}
          <Dropdown
            className='relative'
            placement='bottom-right'
            contentClassName='min-w-[120px]'
            trigger={({ ref, onClick }) => (
              <motion.button
                ref={ref as React.RefObject<HTMLButtonElement>}
                type='button'
                onClick={onClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='flex items-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-blue-400/30 text-blue-100 hover:from-purple-400/30 hover:to-blue-400/30 hover:border-blue-300/50 transition-all duration-300 group'
                title='페이지 이동'
              >
                <Navigation size={16} className='group-hover:rotate-12 transition-transform duration-300' />
                <span className='text-sm font-mono font-medium'>이동</span>
              </motion.button>
            )}
          >
            <motion.button
              type='button'
              onClick={handleGoToMain}
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
              className='w-full flex items-center gap-2 px-3 py-2 rounded text-left text-blue-100 hover:text-white transition-colors'
            >
              <Globe size={14} />
              <span className='text-sm'>메인으로</span>
            </motion.button>
            <motion.button
              type='button'
              onClick={handleGoToBlog}
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
              className='w-full flex items-center gap-2 px-3 py-2 rounded text-left text-blue-100 hover:text-white transition-colors'
            >
              <Home size={14} />
              <span className='text-sm'>블로그로</span>
            </motion.button>
          </Dropdown>

          {/* 검색 영역 */}
          {shouldShowSearch && (
            <AnimatePresence mode='wait'>
              {searchExpanded ? (
                <motion.div
                  key='search-expanded'
                  initial={{ width: 40, opacity: 0 }}
                  animate={{ width: 320, opacity: 1 }}
                  exit={{ width: 40, opacity: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                    mass: 0.8,
                  }}
                  className='flex items-center gap-2 overflow-hidden bg-black/10 rounded-lg px-2'
                >
                  <div className='flex-1'>
                    <SearchBar value={search} onChange={setSearch} />
                  </div>
                  <motion.button
                    type='button'
                    onClick={toggleSearch}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    className='p-1 text-blue-100 hover:text-white transition-all duration-200 rounded-full hover:bg-white/10 flex-shrink-0'
                  >
                    <X size={16} />
                  </motion.button>
                </motion.div>
              ) : (
                <motion.button
                  key='search-collapsed'
                  type='button'
                  onClick={toggleSearch}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  whileHover={{ scale: 1.1, rotate: 15 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className='p-2 rounded-full text-blue-100 hover:text-white hover:bg-white/10 transition-all duration-300'
                >
                  <Search size={18} />
                </motion.button>
              )}
            </AnimatePresence>
          )}
        </div>
      </motion.div>

      {/* 모바일 헤더 */}
      <div className='block lg:hidden w-full max-w-4xl mx-auto'>
        <motion.div
          className={`mt-4 mb-6 mx-4 p-3 bg-black/20 backdrop-blur-md border border-blue-400/20 shadow-xl relative transition-all duration-300 ${
            searchExpanded ? 'rounded-2xl' : 'rounded-full'
          }`}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            boxShadow: `
              0 8px 32px rgba(0, 0, 0, 0.3),
              0 0 20px rgba(59, 130, 246, 0.2)
            `,
          }}
        >
          {/* 네비게이션 버튼 - 좌측 상단 */}
          <div className='absolute top-4 left-3'>
            <Dropdown
              placement='bottom-left'
              contentClassName='min-w-[100px]'
              trigger={({ ref, onClick }) => (
                <motion.button
                  ref={ref as React.RefObject<HTMLButtonElement>}
                  type='button'
                  onClick={onClick}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className='p-2 rounded-full bg-gradient-to-r from-purple-500/30 to-blue-500/30 border border-blue-400/40 text-blue-100 hover:from-purple-400/40 hover:to-blue-400/40 transition-all duration-300 group'
                  title='페이지 이동'
                >
                  <Navigation size={14} className='group-hover:rotate-12 transition-transform duration-300' />
                </motion.button>
              )}
            >
              <motion.button
                type='button'
                onClick={handleGoToMain}
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                className='w-full flex items-center gap-2 px-3 py-2 rounded text-left text-blue-100 hover:text-white transition-colors'
              >
                <Globe size={12} />
                <span className='text-xs'>메인</span>
              </motion.button>
              <motion.button
                type='button'
                onClick={handleGoToBlog}
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                className='w-full flex items-center gap-2 px-3 py-2 rounded text-left text-blue-100 hover:text-white transition-colors'
              >
                <Home size={12} />
                <span className='text-xs'>블로그</span>
              </motion.button>
            </Dropdown>
          </div>

          <div className='flex items-center justify-between h-10 px-12'>
            {/* 로고 - 중앙 */}
            <motion.button
              type='button'
              whileHover={{ scale: 1.02 }}
              className='font-extrabold text-lg text-blue-100 flex items-center gap-2 cursor-pointer select-none hover:text-white bg-transparent border-none p-0 m-0 focus:outline-none transition-colors duration-300 flex-1 justify-center'
            >
              <Image src='/logo.png' alt='logo' width={24} height={24} /> 3D Tech Blog
            </motion.button>

            {/* 우측 버튼들 */}
            <div className='absolute top-4 right-3 flex gap-2'>
              {/* 검색 버튼 */}
              {shouldShowSearch && (
                <motion.button
                  type='button'
                  onClick={toggleSearch}
                  whileHover={{ scale: 1.1, rotate: 15 }}
                  whileTap={{ scale: 0.9 }}
                  className='p-2 rounded-full text-blue-100 hover:text-white hover:bg-white/10 transition-all duration-300'
                >
                  <Search size={18} />
                </motion.button>
              )}

              {/* 메뉴 버튼 */}
              <motion.button
                type='button'
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className='p-2 rounded-full text-blue-100 hover:text-white hover:bg-white/10 transition-all duration-300'
                onClick={() => setMenuOpen(true)}
                aria-label='메뉴 열기'
              >
                <Menu size={20} />
              </motion.button>
            </div>
          </div>

          {/* 모바일 검색 영역 */}
          <AnimatePresence>
            {shouldShowSearch && searchExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0, y: -10 }}
                animate={{ height: 'auto', opacity: 1, y: 0 }}
                exit={{ height: 0, opacity: 0, y: -10 }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 30,
                }}
                className='mt-3 pt-3 border-t border-blue-400/20'
              >
                <div className='flex items-center gap-2 bg-black/10 rounded-lg px-3 py-2'>
                  <div className='flex-1'>
                    <SearchBar value={search} onChange={setSearch} />
                  </div>
                  <motion.button
                    type='button'
                    onClick={toggleSearch}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    className='p-1 text-blue-100 hover:text-white transition-all duration-200 rounded-full hover:bg-white/10 flex-shrink-0'
                  >
                    <X size={16} />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* 모바일/태블릿 드로어 사이드바 */}
      <MobileNavbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
    </>
  );
}
