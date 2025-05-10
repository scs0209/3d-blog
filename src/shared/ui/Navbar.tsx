'use client';

import { Menu, Orbit } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const MinimalistNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className='fixed top-[10px] left-1/2 -translate-x-1/2 z-50 py-[5px] pl-5 pr-2 bg-[#1c1c1c] rounded-lg'>
      <div className='max-w-6xl mx-auto flex items-center justify-between gap-8'>
        {/* 네비게이션 링크 - 데스크톱 */}
        <nav className='hidden md:flex items-center gap-8'>
          <Orbit fill='white' />
          <Link href='/manifesto' className='group relative overflow-hidden'>
            <div className='relative flex overflow-hidden'>
              <span className='block text-gray-300 text-sm font-normal transition-all duration-[800ms] ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:translate-y-[100%] group-hover:opacity-0'>
                Portfolio
              </span>
              <span className='block absolute left-0 text-white text-sm font-normal -translate-y-full opacity-0 transition-all duration-[800ms] ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:translate-y-0 group-hover:opacity-100'>
                Portfolio
              </span>
            </div>
          </Link>
          <Link href='/blog' className='group relative overflow-hidden'>
            <div className='relative flex overflow-hidden'>
              <span className='block text-gray-300 text-sm font-normal transition-transform duration-[600ms] ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:translate-y-[100%]'>
                Blog
              </span>
              <span className='block absolute left-0 text-white text-sm font-normal -translate-y-full transition-transform duration-[600ms] ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:translate-y-0'>
                Blog
              </span>
            </div>
          </Link>
          <Link href='/discover' className='group relative overflow-hidden'>
            <div className='relative flex overflow-hidden'>
              <span className='block text-gray-300 text-sm font-normal transition-transform duration-[600ms] ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:translate-y-[100%]'>
                Contact
              </span>
              <span className='block absolute left-0 text-white text-sm font-normal -translate-y-full transition-transform duration-[600ms] ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:translate-y-0'>
                Contact
              </span>
            </div>
          </Link>
        </nav>

        {/* 로그인/가입 버튼 */}
        <div className='flex items-center gap-2'>
          <Link
            href='/login'
            className='text-white text-sm font-semibold py-2 px-4 border border-[#858585] rounded-xl transition-all duration-300 hover:border-[#ffffff] hover:shadow-[0_0_10px_#ffffff]'
          >
            Log In
          </Link>
          <Link
            href='/signup'
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

          {/* 모바일 메뉴 버튼 */}
          <button
            type='button'
            className='md:hidden ml-2 text-gray-400 hover:text-white'
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {isMenuOpen && (
        <div className='md:hidden mt-2 py-4 px-6 bg-gray-900 rounded-lg'>
          <nav className='flex flex-col gap-4'>
            <Link
              href='/manifesto'
              className='text-gray-300 hover:text-white py-2 border-b border-gray-800'
              onClick={() => setIsMenuOpen(false)}
            >
              Manifesto
            </Link>
            <Link
              href='/careers'
              className='text-gray-300 hover:text-white py-2 border-b border-gray-800'
              onClick={() => setIsMenuOpen(false)}
            >
              Careers
            </Link>
            <Link href='/discover' className='text-gray-300 hover:text-white py-2' onClick={() => setIsMenuOpen(false)}>
              Discover
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default MinimalistNavbar;
