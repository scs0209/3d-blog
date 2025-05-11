import { useState } from 'react';

// 더미 카테고리 및 포스트 데이터
const categories = ['전체', '개발', '디자인', '일상', '리뷰', '기타'];

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

export const BlogMainPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [menuOpen, setMenuOpen] = useState(false);

  // 카테고리 필터링
  const filteredPosts =
    selectedCategory === categories[0] ? posts : posts.filter((post) => post.category === selectedCategory);
  const recentPosts = filteredPosts.slice(0, 6);

  return (
    <div className='flex flex-col lg:flex-row min-h-screen bg-white text-black font-mono relative'>
      {/* 모바일 메뉴 버튼 */}
      <button
        type='button'
        className='lg:hidden fixed top-4 right-4 z-30 bg-black text-white p-2 rounded shadow-md'
        onClick={() => setMenuOpen(true)}
        aria-label='메뉴 열기'
      >
        <svg width='28' height='28' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
          <title>메뉴 열기</title>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
        </svg>
      </button>
      {/* Main Content (왼쪽) */}
      <main className='flex-1 p-4 lg:p-10 flex justify-center'>
        <div className='w-full lg:w-[800px]'>
          <h1 className='text-2xl font-bold mb-6 font-mono border-b-4 border-black pb-2'>Recently Published</h1>
          <div className='flex flex-col gap-6'>
            {recentPosts.map((post) => (
              <div
                key={post.id}
                className='border-2 border-black rounded-lg bg-white p-5 flex flex-col gap-2 shadow-[4px_4px_0_0_#000]'
              >
                <span className='inline-block text-xs font-bold mb-1 px-2 py-0.5 rounded border border-black bg-gray-100 w-fit'>
                  {post.category}
                </span>
                <h2 className='text-lg font-bold font-mono'>{post.title}</h2>
                <p className='text-sm font-mono'>{post.summary}</p>
                <div className='flex items-center justify-between mt-2 text-xs text-gray-700 font-mono'>
                  <span>{post.author ? post.author : '관리자'}</span>
                  <span>{post.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      {/* Sidebar (오른쪽, 클래식 맥 스타일) */}
      <aside className='hidden lg:flex w-80 p-6 border-l-4 border-black bg-white min-h-screen flex-col gap-8 shadow-[-4px_0_0_0_#000]'>
        <div className='border-2 border-black rounded-t-lg rounded-b-none bg-gray-100 px-3 py-2 flex items-center justify-between'>
          <span className='font-bold text-lg'>Category</span>
          <span className='w-4 h-4 border-2 border-black rounded-full bg-white inline-block' />
        </div>
        <nav className='flex flex-col gap-2 border-2 border-t-0 border-black rounded-b-lg px-3 py-4 bg-white'>
          {categories.map((cat) => (
            <button
              key={cat}
              type='button'
              className={`text-left px-2 py-1 rounded font-mono border-2 border-black transition
                ${cat === selectedCategory ? 'bg-black text-white' : 'bg-white hover:bg-gray-200'}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </nav>
        <div>
          <h2 className='font-bold text-base mb-2'>Tags</h2>
          <div className='flex flex-wrap gap-2'>
            <span className='bg-gray-200 border border-black px-2 py-1 rounded text-xs font-mono'>#React</span>
            <span className='bg-gray-200 border border-black px-2 py-1 rounded text-xs font-mono'>#NextJS</span>
            <span className='bg-gray-200 border border-black px-2 py-1 rounded text-xs font-mono'>#CSS</span>
            <span className='bg-gray-200 border border-black px-2 py-1 rounded text-xs font-mono'>#Database</span>
          </div>
        </div>
      </aside>
      {/* 모바일/태블릿 드로어 사이드바 */}
      {menuOpen && (
        <div className='fixed inset-0 z-40 bg-black/40 flex justify-end lg:hidden'>
          <div className='w-72 max-w-full h-full bg-white border-l-4 border-black flex flex-col gap-8 p-6 shadow-[-4px_0_0_0_#000] animate-slideInRight'>
            <div className='flex items-center justify-between mb-4'>
              <span className='font-bold text-lg'>Category</span>
              <button
                type='button'
                className='text-black p-1 rounded hover:bg-gray-200'
                onClick={() => setMenuOpen(false)}
                aria-label='메뉴 닫기'
              >
                <svg width='24' height='24' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <title>메뉴 닫기</title>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>
            <nav className='flex flex-col gap-2 border-2 border-t-0 border-black rounded-b-lg px-3 py-4 bg-white'>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type='button'
                  className={`text-left px-2 py-1 rounded font-mono border-2 border-black transition
                    ${cat === selectedCategory ? 'bg-black text-white' : 'bg-white hover:bg-gray-200'}`}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setMenuOpen(false);
                  }}
                >
                  {cat}
                </button>
              ))}
            </nav>
            <div>
              <h2 className='font-bold text-base mb-2'>Tags</h2>
              <div className='flex flex-wrap gap-2'>
                <span className='bg-gray-200 border border-black px-2 py-1 rounded text-xs font-mono'>#React</span>
                <span className='bg-gray-200 border border-black px-2 py-1 rounded text-xs font-mono'>#NextJS</span>
                <span className='bg-gray-200 border border-black px-2 py-1 rounded text-xs font-mono'>#CSS</span>
                <span className='bg-gray-200 border border-black px-2 py-1 rounded text-xs font-mono'>#Database</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
