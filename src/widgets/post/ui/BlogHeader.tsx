'use client';

import { motion } from 'framer-motion';
import { Globe, Home, LogOut, Menu, Navigation, User } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';
import { Dropdown } from '@/shared/ui';
import ThemeToggleButton from '@/shared/ui/ThemeToggleButton';
import { BlogSearch } from './BlogSearch';
import { MobileNavbar } from './MobileNavbar';

export default function BlogHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

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
          <ThemeToggleButton variant='blog' />
          {/* 네비게이션 드롭다운 */}
          <Dropdown
            className='relative z-50'
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
              onClick={() => handleNavigation('/')}
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
              className='w-full flex items-center gap-2 px-3 py-2 rounded text-left text-blue-100 hover:text-white transition-colors'
            >
              <Globe size={14} />
              <span className='text-sm'>메인으로</span>
            </motion.button>
            <motion.button
              type='button'
              onClick={() => handleNavigation('/blog')}
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
              className='w-full flex items-center gap-2 px-3 py-2 rounded text-left text-blue-100 hover:text-white transition-colors'
            >
              <Home size={14} />
              <span className='text-sm'>블로그로</span>
            </motion.button>
            {isAuthenticated ? (
              <motion.button
                type='button'
                onClick={handleLogout}
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                className='w-full flex items-center gap-2 px-3 py-2 rounded text-left text-red-300 hover:text-red-200 transition-colors'
              >
                <LogOut size={14} />
                <span className='text-sm'>로그아웃</span>
              </motion.button>
            ) : (
              <motion.button
                type='button'
                onClick={() => handleNavigation('/login')}
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                className='w-full flex items-center gap-2 px-3 py-2 rounded text-left text-blue-100 hover:text-white transition-colors'
              >
                <User size={14} />
                <span className='text-sm'>로그인</span>
              </motion.button>
            )}
          </Dropdown>

          {/* 검색 영역 */}
          <BlogSearch />
        </div>
      </motion.div>

      {/* 모바일 헤더 */}
      <div className='block lg:hidden w-full max-w-4xl mx-auto'>
        <motion.div
          className='mt-4 mb-6 mx-4 p-3 bg-black/20 backdrop-blur-md border border-blue-400/20 shadow-xl relative transition-all duration-300 rounded-full'
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
                onClick={() => handleNavigation('/')}
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                className='w-full flex items-center gap-2 px-3 py-2 rounded text-left text-blue-100 hover:text-white transition-colors'
              >
                <Globe size={12} />
                <span className='text-xs'>메인</span>
              </motion.button>
              <motion.button
                type='button'
                onClick={() => handleNavigation('/blog')}
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                className='w-full flex items-center gap-2 px-3 py-2 rounded text-left text-blue-100 hover:text-white transition-colors'
              >
                <Home size={12} />
                <span className='text-xs'>블로그</span>
              </motion.button>
              {isAuthenticated ? (
                <motion.button
                  type='button'
                  onClick={handleLogout}
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                  className='w-full flex items-center gap-2 px-3 py-2 rounded text-left text-red-300 hover:text-red-200 transition-colors'
                >
                  <LogOut size={12} />
                  <span className='text-xs'>로그아웃</span>
                </motion.button>
              ) : (
                <motion.button
                  type='button'
                  onClick={() => handleNavigation('/login')}
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                  className='w-full flex items-center gap-2 px-3 py-2 rounded text-left text-blue-100 hover:text-white transition-colors'
                >
                  <User size={12} />
                  <span className='text-xs'>로그인</span>
                </motion.button>
              )}
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
            <div className='absolute top-4 right-3 flex gap-2 items-center'>
              <ThemeToggleButton variant='blog' className='h-8 w-8' />
              {/* 검색 영역 */}
              <BlogSearch />

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
        </motion.div>
      </div>

      {/* 모바일/태블릿 드로어 사이드바 */}
      <MobileNavbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
    </>
  );
}
