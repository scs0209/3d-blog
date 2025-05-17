import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PostCard, PostListCard } from '@/features/blog/ui';
import { Menu } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { MobileNavbar } from './MobileNavbar';
import { SpaceBackground } from './SpaceBackground';
import { SearchBar } from './SearchBar';

const posts = [
  {
    id: 1,
    title: 'React로 맥OS 스타일 블로그 만들기',
    category: '개발',
    date: '2024-06-01',
    summary: 'React와 Three.js로 맥OS 느낌의 블로그를 만드는 방법을 소개합니다.',
  },
  {
    id: 2,
    title: 'Figma로 UI 디자인 빠르게 하기',
    category: '디자인',
    date: '2024-05-28',
    summary: 'Figma를 활용한 효율적인 UI 디자인 팁을 공유합니다.',
  },
  {
    id: 3,
    title: '2024년 상반기 회고',
    category: '일상',
    date: '2024-05-20',
    summary: '상반기 동안의 성장과 배움을 돌아봅니다.',
  },
  {
    id: 4,
    title: 'MacBook Pro M3 리뷰',
    category: '리뷰',
    date: '2024-05-15',
    summary: '최신 맥북 프로 M3의 실제 사용기를 전합니다.',
  },
  {
    id: 5,
    title: 'Next.js 14 새로운 기능 정리',
    category: '개발',
    date: '2024-05-10',
    summary: 'Next.js 14에서 추가된 주요 기능을 정리했습니다.',
  },
  {
    id: 6,
    title: '나만의 생산성 앱 만들기',
    category: '개발',
    date: '2024-05-05',
    summary: '직접 만든 생산성 앱의 개발 과정을 공유합니다.',
  },
  {
    id: 7,
    title: '디자인 시스템 구축기',
    category: '디자인',
    date: '2024-04-30',
    summary: '디자인 시스템을 구축하며 배운 점을 정리했습니다.',
  },
  {
    id: 8,
    title: '일상 속 작은 행복',
    category: '일상',
    date: '2024-04-25',
    summary: '일상에서 느낀 소소한 행복을 기록합니다.',
  },
  {
    id: 1,
    title: 'Text Tags: Blocks, Headings And Inlines A Quick Start',
    category: 'ReactJs',
    date: '2024-04-08',
    summary: 'Markdown is a lightweight markup language with plain-text formatting syntax. Its design allows it to...',
    author: 'vbm coder',
    thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 2,
    title: 'Unveiling The Web Browser: Gateway To The World Wide Web',
    category: 'Css',
    date: '2024-04-01',
    summary: 'Markdown is a lightweight markup language with plain-text formatting syntax. Its design allows it to...',
    author: 'vbm coder',
    thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80',
  },
];

const categories = ['전체', '개발', '디자인', '일상', '리뷰', '기타'];

export const BlogMainPage = () => {
  // 카테고리 미선택 상태(null)로 시작
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // 카테고리 필터링 + 검색
  const filteredPosts = (
    selectedCategory === null ? posts : posts.filter((post) => post.category === selectedCategory)
  ).filter(
    (post) =>
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.summary.toLowerCase().includes(search.toLowerCase()),
  );
  const recentPosts = posts.slice(0, 6); // 전체 포스트 기준 최근 6개
  const restPosts = selectedCategory === null ? filteredPosts.slice(6) : filteredPosts;

  // 카테고리 버튼 클릭 핸들러 (같은 카테고리 클릭 시 해제)
  const handleCategoryClick = (cat: string) => {
    setSelectedCategory((prev) => (prev === cat ? null : cat));
  };

  // 블로그 타이틀 클릭 시 카테고리 해제
  const handleTitleClick = () => setSelectedCategory(null);

  return (
    <div className='w-full h-screen overflow-hidden bg-gradient-to-b from-[#181c2a] via-[#232946] to-[#23234d] text-slate-100 font-mono relative'>
      <SpaceBackground />
      <div className='flex h-screen'>
        {/* Main Content (왼쪽) */}
        <main className='flex-1 h-screen overflow-y-auto p-4 lg:p-10 flex justify-center'>
          <div className='w-full lg:w-[800px]'>
            {/* 데스크톱: 로고+SearchBar 한 줄, 모바일: 로고만 */}
            <div className='hidden lg:flex items-center gap-4 mb-4'>
              <button
                type='button'
                className='font-extrabold text-2xl text-blue-100 flex items-center gap-2 cursor-pointer select-none hover:underline bg-transparent border-none p-0 m-0 focus:outline-none'
                onClick={handleTitleClick}
              >
                🪐 Space Retro Blog
              </button>
              <div className='flex-1'>
                <SearchBar value={search} onChange={setSearch} />
              </div>
            </div>
            {/* 모바일: 로고(왼쪽) + 메뉴 버튼(오른쪽) flex row */}
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
              <SearchBar value={search} onChange={setSearch} />
            </div>

            {/* 진입 시(카테고리 미선택)만 최근 포스트 6개 카드 */}
            {selectedCategory === null && recentPosts.length > 0 && (
              <div className='grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10'>
                {recentPosts.map((post, idx) => (
                  <a
                    href={`/blog/${post.id}`}
                    key={post.id}
                    className='relative group block p-2 h-full w-full'
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <AnimatePresence>
                      {hoveredIndex === idx && (
                        <motion.span
                          className='absolute inset-0 h-full w-full bg-slate-600/60 dark:bg-[#232946]/95 backdrop-blur-md block rounded-3xl pointer-events-none z-0'
                          layoutId='hoverBackground'
                          initial={{ opacity: 0 }}
                          animate={{
                            opacity: 1,
                            transition: { duration: 0.15 },
                          }}
                          exit={{
                            opacity: 0,
                            transition: { duration: 0.15, delay: 0.2 },
                          }}
                          style={{ willChange: 'opacity, background' }}
                        />
                      )}
                      <PostCard key={post.id} post={post} />
                    </AnimatePresence>
                  </a>
                ))}
              </div>
            )}

            {/* 나머지 포스트 리스트 (hover 효과 추가) */}
            <div className='flex flex-col gap-8'>
              {restPosts.map((post) => (
                <PostListCard key={post.id} post={post as any} />
              ))}
            </div>
          </div>
        </main>
        {/* 데스크톱 사이드바 */}
        <Sidebar
          categories={categories}
          selectedCategory={selectedCategory}
          handleCategoryClick={handleCategoryClick}
        />
      </div>
      {/* 모바일/태블릿 드로어 사이드바 */}
      <MobileNavbar
        categories={categories}
        selectedCategory={selectedCategory}
        handleCategoryClick={handleCategoryClick}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />
    </div>
  );
};
