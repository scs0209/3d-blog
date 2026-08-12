'use client';

import { motion } from 'framer-motion';
import { Globe, Home, LogOut, Menu, Navigation, User } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';
import { Dropdown } from '@/shared/ui';
import ThemeToggleButton from '@/shared/ui/ThemeToggleButton';
import { blogTheme } from '@/widgets/post/ui/blog-theme';
import { BlogSearch } from './BlogSearch';
import { MobileNavbar } from './MobileNavbar';

const syne = { fontFamily: 'var(--font-syne), sans-serif' } as const;

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

  const navBtnClass = `flex items-center gap-2 rounded-lg px-3 py-2 transition ${blogTheme.navBtn}`;

  return (
    <>
      <motion.div
        className={`relative mx-auto mb-8 hidden h-16 w-full max-w-4xl items-center justify-between rounded-xl p-4 lg:flex ${blogTheme.chromeBar}`}
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <span className={blogTheme.chromeShine} aria-hidden />
        <div className='flex items-center'>
          <button
            type='button'
            onClick={() => handleNavigation('/blog')}
            aria-label='블로그 홈으로 이동'
            className='m-0 flex cursor-pointer select-none items-center gap-2 border-none bg-transparent p-0 text-base font-semibold tracking-wide focus:outline-none'
            style={syne}
          >
            <Image src='/logo.png' alt='logo' width={22} height={22} />
            <span className={blogTheme.titleGradient}>3D Tech Blog</span>
          </button>
        </div>

        <div className='flex items-center gap-3'>
          <ThemeToggleButton variant='blog' />
          <Dropdown
            className='relative z-50'
            placement='bottom-right'
            contentClassName={`min-w-[120px] ${blogTheme.dropdown}`}
            trigger={({ ref, onClick }) => (
              <motion.button
                ref={ref as React.RefObject<HTMLButtonElement>}
                type='button'
                onClick={onClick}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={navBtnClass}
                style={syne}
                title='페이지 이동'
              >
                <Navigation size={15} className={blogTheme.textAccent} />
                <span className='text-[11px] font-medium uppercase tracking-[0.14em]'>Go</span>
              </motion.button>
            )}
          >
            <button
              type='button'
              onClick={() => handleNavigation('/')}
              className={`flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm ${blogTheme.dropdownItem}`}
            >
              <Globe size={14} />
              Home
            </button>
            <button
              type='button'
              onClick={() => handleNavigation('/blog')}
              className={`flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm ${blogTheme.dropdownItem}`}
            >
              <Home size={14} />
              Blog
            </button>
            {isAuthenticated ? (
              <button
                type='button'
                onClick={handleLogout}
                className='flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm text-red-300 hover:bg-red-500/10'
              >
                <LogOut size={14} />
                Logout
              </button>
            ) : (
              <button
                type='button'
                onClick={() => handleNavigation('/login')}
                className={`flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm ${blogTheme.dropdownItem}`}
              >
                <User size={14} />
                Login
              </button>
            )}
          </Dropdown>
          <BlogSearch />
        </div>
      </motion.div>

      <div className='mx-auto block w-full max-w-4xl lg:hidden'>
        <motion.div
          className={`relative mx-4 mb-6 mt-4 rounded-xl p-3 transition-all duration-300 ${blogTheme.chromeBar}`}
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <span className={blogTheme.chromeShine} aria-hidden />
          <div className='absolute left-3 top-3'>
            <Dropdown
              placement='bottom-left'
              contentClassName={`min-w-[100px] ${blogTheme.dropdown}`}
              trigger={({ ref, onClick }) => (
                <button
                  ref={ref as React.RefObject<HTMLButtonElement>}
                  type='button'
                  onClick={onClick}
                  className={`rounded-lg p-2 ${blogTheme.navBtn}`}
                  title='페이지 이동'
                >
                  <Navigation size={14} className={blogTheme.textAccent} />
                </button>
              )}
            >
              <button
                type='button'
                onClick={() => handleNavigation('/')}
                className={`flex w-full items-center gap-2 rounded px-3 py-2 text-left text-xs ${blogTheme.dropdownItem}`}
              >
                <Globe size={12} />
                Home
              </button>
              <button
                type='button'
                onClick={() => handleNavigation('/blog')}
                className={`flex w-full items-center gap-2 rounded px-3 py-2 text-left text-xs ${blogTheme.dropdownItem}`}
              >
                <Home size={12} />
                Blog
              </button>
              {isAuthenticated ? (
                <button
                  type='button'
                  onClick={handleLogout}
                  className='flex w-full items-center gap-2 rounded px-3 py-2 text-left text-xs text-red-300 hover:bg-red-500/10'
                >
                  <LogOut size={12} />
                  Logout
                </button>
              ) : (
                <button
                  type='button'
                  onClick={() => handleNavigation('/login')}
                  className={`flex w-full items-center gap-2 rounded px-3 py-2 text-left text-xs ${blogTheme.dropdownItem}`}
                >
                  <User size={12} />
                  Login
                </button>
              )}
            </Dropdown>
          </div>

          <div className='relative flex h-10 items-center justify-center px-12'>
            <button
              type='button'
              onClick={() => handleNavigation('/blog')}
              aria-label='블로그 홈으로 이동'
              className='flex items-center gap-2 border-none bg-transparent p-0 text-base font-semibold'
              style={syne}
            >
              <Image src='/logo.png' alt='logo' width={22} height={22} />
              <span className={blogTheme.titleGradient}>3D Tech Blog</span>
            </button>

            <div className='absolute right-0 top-0 flex items-center gap-2'>
              <ThemeToggleButton variant='blog' className='h-8 w-8' />
              <BlogSearch />
              <button
                type='button'
                className={`rounded-lg p-2 transition ${blogTheme.iconBtn}`}
                onClick={() => setMenuOpen(true)}
                aria-label='메뉴 열기'
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <MobileNavbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
    </>
  );
}
