'use client';

import { useCategories } from '@/features/category/model/use-category';
import { MobileNavbar } from './MobileNavbar';
import { SearchBar } from './SearchBar';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { useState } from 'react';

export default function BlogHeader() {
  const { data: categories } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const pathname = usePathname();

  const handleTitleClick = () => {
    setSelectedCategory(null);
  };

  return (
    <>
      {/* 데스크톱: 로고+SearchBar 한 줄, 모바일: 로고만 */}
      <div className='hidden lg:flex items-center gap-4 mb-4'>
        <button
          type='button'
          className='font-extrabold text-2xl text-blue-100 flex items-center gap-2 cursor-pointer select-none hover:underline bg-transparent border-none p-0 m-0 focus:outline-none'
          onClick={handleTitleClick}
        >
          🪐 Space Retro Blog
        </button>
        {pathname === '/blog/all' && (
          <div className='flex-1'>
            <SearchBar value={search} onChange={setSearch} />
          </div>
        )}
      </div>

      {/* 모바일: 로고(왼쪽) + 메뉴 버튼(오른쪽) */}
      <div className='block lg:hidden'>
        <div className='flex items-center justify-between mt-8 mb-6'>
          <button
            type='button'
            className='font-extrabold text-2xl text-blue-100 flex items-center gap-2 cursor-pointer select-none hover:underline bg-transparent border-none p-0 m-0 focus:outline-none ml-1'
            onClick={handleTitleClick}
          >
            🪐 Space Retro Blog
          </button>
          <button
            type='button'
            className='p-0 m-0 bg-none border-none outline-none text-blue-100 hover:text-blue-400 focus:text-blue-400 transition drop-shadow-[0_0_8px_#7dd3fc55] hover:drop-shadow-[0_0_12px_#7dd3fc] focus:drop-shadow-[0_0_12px_#7dd3fc]'
            onClick={() => setMenuOpen(true)}
            aria-label='메뉴 열기'
            style={{ fontSize: 28, lineHeight: 1 }}
          >
            <Menu size={28} />
          </button>
        </div>
        {pathname === '/blog/all' && <SearchBar value={search} onChange={setSearch} />}
      </div>

      {/* 모바일/태블릿 드로어 사이드바 */}
      <MobileNavbar
        categories={categories}
        selectedCategory={selectedCategory}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />
    </>
  );
}
