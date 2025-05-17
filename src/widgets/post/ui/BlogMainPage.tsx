import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PostCard, PostListCard, Tag, VisitorCounter } from '@/features/blog/ui';
import { Menu, ChevronLeft, ChevronRight } from 'lucide-react';

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
export const generateRandomString = (length: number) => {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

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

// 우주 배경용 별똥별/별 효과 (간단한 예시)
function SpaceBackground() {
  // Tailwind 색상 클래스 배열
  const colorClasses = [
    'bg-white',
    'bg-blue-400',
    'bg-purple-400',
    'bg-pink-400',
    'bg-yellow-400',
    'bg-cyan-400',
    'bg-fuchsia-400',
  ];
  // 별 60개, 색상 랜덤
  const stars = Array.from({ length: 100 }).map((_, i) => {
    const color = colorClasses[i % colorClasses.length];
    const size = `${Math.random() * 2 + 1}px`;
    const top = `${Math.random() * 100}%`;
    const left = `${Math.random() * 100}%`;
    const opacity = Math.random() * 0.7 + 0.3;
    const duration = `${2 + Math.random() * 2}s`;
    const delay = `${Math.random() * 2}s`;
    return (
      <span
        key={`star-${Math.random()}`}
        className={`absolute block rounded-full ${color} shadow-[0_0_8px_2px_#7dd3fc88] animate-pulse`}
        style={{
          width: size,
          height: size,
          top,
          left,
          opacity,
          animationDuration: duration,
          animationDelay: delay,
        }}
      />
    );
  });

  // 행성 생성
  const planets = [
    {
      id: 'planet-1',
      size: 80,
      top: '15%',
      left: '85%',
      color: 'from-red-500 to-orange-500',
      ringColor: 'border-yellow-500/20',
      ringSize: 100,
      duration: 120,
    },
    {
      id: 'planet-2',
      size: 40,
      top: '70%',
      left: '10%',
      color: 'from-blue-500 to-purple-500',
      ringColor: 'border-indigo-500/20',
      ringSize: 55,
      duration: 180,
    },
    {
      id: 'planet-3',
      size: 60,
      top: '30%',
      left: '20%',
      color: 'from-green-400 to-blue-400',
      ringColor: 'border-green-300/20',
      ringSize: 80,
      duration: 150,
    },
    {
      id: 'planet-4',
      size: 50,
      top: '60%',
      left: '70%',
      color: 'from-yellow-400 to-pink-400',
      ringColor: 'border-pink-300/20',
      ringSize: 65,
      duration: 100,
    },
    {
      id: 'planet-5',
      size: 35,
      top: '40%',
      left: '55%',
      color: 'from-fuchsia-400 to-purple-500',
      ringColor: 'border-fuchsia-300/20',
      ringSize: 50,
      duration: 90,
    },
  ];

  // 행성/은하수 등 추가
  return (
    <div className='absolute inset-0 z-10 pointer-events-none'>
      {/* 별 */}
      {stars}
      {/* 행성들 */}
      {planets.map((planet) => (
        <motion.div
          key={planet.id}
          className='absolute'
          style={{
            top: planet.top,
            left: planet.left,
          }}
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{
            duration: planet.duration,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'linear',
          }}
        >
          {/* 행성 고리 */}
          {planet.ringSize && (
            <div
              className={`absolute rounded-full border-4 ${planet.ringColor}`}
              style={{
                width: planet.ringSize,
                height: planet.ringSize / 2,
                top: planet.size / 2 - planet.ringSize / 4,
                left: planet.size / 2 - planet.ringSize / 2,
                transform: 'rotateX(75deg)',
              }}
            />
          )}

          {/* 행성 본체 */}
          <motion.div
            className={`absolute rounded-full bg-gradient-to-br ${planet.color}`}
            style={{
              width: planet.size,
              height: planet.size,
            }}
            animate={{ rotate: -360 }}
            transition={{
              duration: planet.duration * 0.8,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'linear',
            }}
          >
            {/* 행성 표면 특징 */}
            <div className='absolute w-3/4 h-1/2 bg-white/10 rounded-full top-1/4 left-1/8' />
          </motion.div>
        </motion.div>
      ))}
      {/* 은하수 느낌의 그라데이션 */}
      <div className='absolute inset-0 pointer-events-none -z-10'>
        {/* 여러 개의 큰 은하수 레이어 */}
        {Array.from({ length: 5 }).map((_, i) => {
          // 랜덤 위치, 각도, 색상, 투명도, 크기
          const top = `${40 + Math.random() * 20}%`;
          const left = `${10 + Math.random() * 60}%`;
          const width = `${320 + Math.random() * 160}px`;
          const height = `${24 + Math.random() * 24}px`;
          const rotate = `${-15 + Math.random() * 30}`;
          const opacity = 0.08 + Math.random() * 0.18;
          // Tailwind 지원 색상 조합
          const gradients = [
            'from-blue-200 via-white to-pink-200',
            'from-fuchsia-200 via-white to-blue-200',
            'from-purple-200 via-blue-100 to-pink-100',
            'from-cyan-200 via-white to-fuchsia-200',
            'from-blue-300 via-white to-purple-200',
          ];
          const gradient = gradients[i % gradients.length];
          return (
            <span
              key={`milkyway-${i}-${Math.random()}`}
              className={`absolute rounded-full blur-3xl bg-gradient-to-r ${gradient}`}
              style={{
                top,
                left,
                width,
                height,
                opacity,
                transform: `rotate(${rotate}deg)`,
              }}
            />
          );
        })}
        <div className='absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full bg-purple-500/20 blur-3xl' />
        <div className='absolute bottom-0 right-0 w-1/3 h-1/3 rounded-full bg-pink-500/20 blur-3xl' />
      </div>
    </div>
  );
}

function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className='w-full lg:max-w-xs flex items-center ml-auto p-2'
    >
      <input
        type='text'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder='Search posts...'
        className='w-full px-4 py-2 rounded-lg bg-[#232946]/80 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-slate-100 placeholder:text-blue-200 shadow-[0_0_8px_#7dd3fc55] transition'
      />
    </motion.div>
  );
}

export const BlogMainPage = () => {
  // 카테고리 미선택 상태(null)로 시작
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true); // 데스크톱 사이드바 열림/닫힘 상태

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

  const tags = [
    { id: '1', name: 'React', count: 10 },
    { id: '2', name: 'NextJS', count: 5 },
    { id: '3', name: 'CSS', count: 3 },
    { id: '4', name: 'Database', count: 2 },
  ];

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
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              key='desktop-sidebar'
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'tween', duration: 0.35, ease: 'easeInOut' }}
              className='hidden lg:flex h-screen flex-shrink-0 flex-col gap-8 w-80 p-6 bg-[#181c2a]/80 border-l border-blue-300 shadow-[0_0_16px_4px_#7dd3fc55] backdrop-blur-sm z-10'
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
                <VisitorCounter today={100} total={1000} />
                <div className='px-3 py-2 flex items-center justify-between'>
                  <span className='font-extrabold text-lg font-mono text-blue-100'>Category</span>
                </div>
                <nav className='flex flex-col gap-2 px-3 py-4'>
                  {categories.map((cat) => (
                    <motion.button
                      key={cat}
                      type='button'
                      whileHover={{
                        scale: 1.06,
                        boxShadow:
                          selectedCategory === cat ? '0 0 12px #7dd3fc, 0 0 24px #7dd3fc55' : '0 0 8px #7dd3fc55',
                      }}
                      whileTap={{ scale: 0.97 }}
                      className={`text-left px-2 py-1 rounded-lg font-mono transition relative
                        ${selectedCategory === cat ? 'bg-blue-100 text-[#232946] border border-blue-300 shadow-[0_0_12px_#7dd3fc,0_0_24px_#7dd3fc55]' : 'bg-transparent hover:bg-blue-900/40 text-blue-100 border border-transparent'}`}
                      onClick={() => handleCategoryClick(cat)}
                    >
                      {cat}
                    </motion.button>
                  ))}
                </nav>
              </div>
              <div>
                <h2 className='font-extrabold text-base mb-2 font-mono text-blue-100'>Tags</h2>
                <div className='flex flex-wrap gap-2'>
                  {tags.map((tag) => (
                    <Tag key={tag.id} tag={tag} />
                  ))}
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
        {/* 사이드바가 닫힌 상태에서만 열기 버튼 노출 (오른쪽 중앙) */}
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
      </div>
      {/* 모바일/태블릿 드로어 사이드바 */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key='mobile-sidebar'
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className='fixed inset-0 z-40 bg-black/60 flex justify-end lg:hidden'
          >
            <motion.div
              initial={{ x: 80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 80, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className='w-72 max-w-full h-full flex flex-col gap-8 p-6 bg-[#181c2a]/90 border-l border-blue-300 shadow-[0_0_16px_4px_#7dd3fc55] backdrop-blur-sm'
            >
              <div className='flex items-center justify-between mb-4'>
                <span className='font-extrabold text-lg font-mono text-blue-100'>Category</span>
                <button
                  type='button'
                  className='text-blue-100 p-1 rounded-full hover:bg-blue-900/40'
                  onClick={() => setMenuOpen(false)}
                  aria-label='메뉴 닫기'
                >
                  <svg width='24' height='24' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <title>메뉴 닫기</title>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                  </svg>
                </button>
              </div>
              <nav className='flex flex-col gap-2 px-3 py-4'>
                {categories.map((cat) => (
                  <motion.button
                    key={cat}
                    type='button'
                    whileHover={{
                      scale: 1.06,
                      boxShadow:
                        selectedCategory === cat ? '0 0 12px #7dd3fc, 0 0 24px #7dd3fc55' : '0 0 8px #7dd3fc55',
                    }}
                    whileTap={{ scale: 0.97 }}
                    className={`text-left px-2 py-1 rounded-lg font-mono transition relative
                      ${selectedCategory === cat ? 'bg-blue-100 text-[#232946] border border-blue-300 shadow-[0_0_12px_#7dd3fc,0_0_24px_#7dd3fc55]' : 'bg-transparent hover:bg-blue-900/40 text-blue-100 border border-transparent'}`}
                    onClick={() => handleCategoryClick(cat)}
                  >
                    {cat}
                  </motion.button>
                ))}
              </nav>
              <div>
                <h2 className='font-extrabold text-base mb-2 font-mono text-blue-100'>Tags</h2>
                <div className='flex flex-wrap gap-2'>
                  {tags.map((tag) => (
                    <Tag key={tag.id} tag={tag} />
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
