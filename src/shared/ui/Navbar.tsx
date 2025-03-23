'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu } from 'lucide-react';

const MinimalistNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-[10px] left-0 z-50 py-4 px-5 bg-[#1c1c1c]">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* 네비게이션 링크 - 데스크톱 */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/manifesto"
            className="text-gray-300 hover:text-white text-sm font-normal"
          >
            Manifesto
          </Link>
          <Link
            href="/careers"
            className="text-gray-300 hover:text-white text-sm font-normal"
          >
            Careers
          </Link>
          <Link
            href="/discover"
            className="text-gray-300 hover:text-white text-sm font-normal"
          >
            Discover
          </Link>
        </nav>

        {/* 로그인/가입 버튼 */}
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="text-white text-sm font-normal py-2 px-4 rounded-sm border border-gray-700 bg-gray-800/80 hover:bg-gray-700/80 transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="text-gray-800 text-sm font-medium py-2 px-4 rounded-full bg-gray-200 hover:bg-white transition-colors"
          >
            Sign up
          </Link>

          {/* 모바일 메뉴 버튼 */}
          <button
            className="md:hidden ml-2 text-gray-400 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {isMenuOpen && (
        <div className="md:hidden mt-2 py-4 px-6 bg-gray-900 rounded-lg">
          <nav className="flex flex-col gap-4">
            <Link
              href="/manifesto"
              className="text-gray-300 hover:text-white py-2 border-b border-gray-800"
              onClick={() => setIsMenuOpen(false)}
            >
              Manifesto
            </Link>
            <Link
              href="/careers"
              className="text-gray-300 hover:text-white py-2 border-b border-gray-800"
              onClick={() => setIsMenuOpen(false)}
            >
              Careers
            </Link>
            <Link
              href="/discover"
              className="text-gray-300 hover:text-white py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Discover
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default MinimalistNavbar;
