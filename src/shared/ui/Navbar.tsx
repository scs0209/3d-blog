'use client';

import { Menu, Orbit, LogOut, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';

const menuItems = [
  { href: '/portfolio', label: 'Portfolio', isComingSoon: false },
  { href: '/blog', label: 'Blog', isComingSoon: false },
  // { href: '/', label: 'Contact', isComingSoon: true },
];

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  const handleMenuClick = (e: React.MouseEvent, item: (typeof menuItems)[0]) => {
    if (item.isComingSoon) {
      e.preventDefault();
      alert('서비스 준비 중입니다...');
    }
  };

  return (
    <>
      {/* 데스크톱 헤더 */}
      <header className='hidden md:block fixed top-[10px] left-1/2 -translate-x-1/2 z-50 py-[5px] pl-5 pr-2 bg-[#1c1c1c] rounded-lg'>
        <div className='max-w-6xl mx-auto flex items-center justify-between gap-8'>
          {/* 네비게이션 링크 */}
          <nav className='flex items-center gap-8'>
            <Orbit fill={'white'} className='cursor-pointer' />
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className='group relative overflow-hidden'
                onClick={(e) => handleMenuClick(e, item)}
              >
                <div className='relative flex overflow-hidden'>
                  <span className='block text-gray-300 text-sm font-normal transition-transform duration-[600ms] ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:translate-y-[100%]'>
                    {item.label}
                  </span>
                  <span className='block absolute left-0 text-white text-sm font-normal -translate-y-full transition-transform duration-[600ms] ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:translate-y-0'>
                    {item.label}
                  </span>
                </div>
              </Link>
            ))}
          </nav>

          {/* 로그인/가입 버튼 */}
          <div className='flex items-center gap-2'>
            {status === 'loading' ? (
              <div className='w-20 h-8 bg-gray-700 rounded-xl animate-pulse' />
            ) : session ? (
              <button
                type='button'
                onClick={handleSignOut}
                className='group text-sm font-semibold py-2 px-4 border border-[#858585] rounded-xl transition-all duration-300 hover:border-[#ffffff] hover:shadow-[0_0_10px_#ffffff] flex items-center gap-2'
              >
                <LogOut className='text-gray-300' size={16} />
                <div className='relative flex overflow-hidden'>
                  <span className='block text-gray-300 transition-transform duration-[600ms] ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:translate-y-[100%]'>
                    Sign Out
                  </span>
                  <span className='block absolute left-0 text-white -translate-y-full transition-transform duration-[600ms] ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:translate-y-0'>
                    Sign Out
                  </span>
                </div>
              </button>
            ) : (
              <>
                <Link
                  href='/login'
                  className='text-white text-sm font-semibold py-2 px-4 border border-[#858585] rounded-xl transition-all duration-300 hover:border-[#ffffff] hover:shadow-[0_0_10px_#ffffff]'
                >
                  Log In
                </Link>
                <Link
                  href='/sign-up'
                  className='group relative overflow-hidden text-sm font-semibold py-2 px-4 rounded-xl bg-[#E5E4DF]'
                >
                  <div className='relative flex overflow-hidden'>
                    <span className='block transition-transform duration-[600ms] ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:translate-y-[100%]'>
                      Sign up
                    </span>
                    <span className='block absolute left-0 -translate-y-full transition-transform duration-[600ms] ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:translate-y-0'>
                      Sign up
                    </span>
                  </div>
                  <div className='absolute inset-0 -z-10 rounded-xl bg-gradient-to-b from-[#0066FF] via-[#6942EF] to-[#FF00E5] blur-md opacity-80' />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 모바일 햄버거 메뉴 버튼 */}
      <button
        type='button'
        className='md:hidden fixed top-4 left-4 z-50 p-3 bg-[#1c1c1c] rounded-lg text-gray-400 hover:text-white transition-all duration-300 border border-gray-700 hover:border-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:bg-[#1c1c1c]'
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <Menu size={20} />
      </button>

      {/* 모바일 전체 화면 메뉴 */}
      {isMenuOpen && (
        <div className='fixed inset-0 z-[60] md:hidden'>
          {/* 배경 */}
          <div
            className='absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer animate-in fade-in duration-300'
            onClick={() => setIsMenuOpen(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setIsMenuOpen(false);
              }
            }}
            role='button'
            tabIndex={0}
            aria-label='메뉴 닫기'
          />

          {/* 메뉴 패널 */}
          <div className='absolute inset-x-0 top-0 h-full bg-[#0a0a0a] animate-in slide-in-from-top duration-500 ease-out'>
            {/* 닫기 버튼 */}
            <div className='absolute top-4 right-4'>
              <button
                type='button'
                onClick={() => setIsMenuOpen(false)}
                className='p-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-300 border border-transparent hover:border-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]'
              >
                <X size={24} />
              </button>
            </div>

            {/* 메뉴 콘텐츠 */}
            <div className='flex flex-col h-full pt-20 px-8'>
              {/* 로고 */}
              <div className='text-center mb-12'>
                <Orbit fill={'white'} className='mx-auto mb-4' size={40} />
                <h1 className='text-2xl font-bold text-white'>3D Tech Blog</h1>
              </div>

              {/* 네비게이션 링크 */}
              <nav className='flex-1'>
                <ul className='space-y-6'>
                  {menuItems.map((item, index) => (
                    <li
                      key={item.label}
                      className='animate-in slide-in-from-top duration-700 ease-out'
                      style={{ animationDelay: `${index * 100 + 200}ms` }}
                    >
                      <Link
                        href={item.href}
                        onClick={(e) => {
                          handleMenuClick(e, item);
                          if (!item.isComingSoon) {
                            setIsMenuOpen(false);
                          }
                        }}
                        className='block py-4 px-6 text-2xl text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-xl transition-all duration-300 border border-transparent hover:border-white hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] text-center'
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* 인증 버튼들 */}
              <div
                className='pb-8 animate-in slide-in-from-bottom duration-700 ease-out'
                style={{ animationDelay: '500ms' }}
              >
                {status === 'loading' ? (
                  <div className='w-full h-14 bg-gray-700 rounded-xl animate-pulse' />
                ) : session ? (
                  <button
                    type='button'
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className='w-full flex items-center justify-center gap-3 py-4 px-6 text-lg text-white bg-gray-800 border border-gray-600 rounded-xl hover:bg-gray-700 hover:border-white hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-300'
                  >
                    <LogOut size={20} />
                    <span className='font-medium'>Sign Out</span>
                  </button>
                ) : (
                  <div className='space-y-4'>
                    <Link
                      href='/login'
                      onClick={() => setIsMenuOpen(false)}
                      className='block w-full text-center py-4 px-6 text-lg text-white border border-gray-600 rounded-xl hover:border-white hover:bg-gray-800/30 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-300'
                    >
                      Log In
                    </Link>
                    <Link
                      href='/sign-up'
                      onClick={() => setIsMenuOpen(false)}
                      className='block w-full text-center py-4 px-6 text-lg bg-gradient-to-r from-[#0066FF] via-[#6942EF] to-[#FF00E5] text-white rounded-xl font-semibold hover:opacity-90 hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all duration-300'
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
