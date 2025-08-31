import { motion } from 'framer-motion';

export const SidebarSkeleton = () => {
  return (
    <motion.aside
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className='hidden lg:flex h-screen flex-shrink-0 flex-col gap-8 w-80 p-6 bg-[#181c2a]/80 border-l border-blue-300 shadow-[0_0_16px_4px_#7dd3fc55] backdrop-blur-sm z-10 relative'
      style={{ minWidth: 320 }}
    >
      {/* Visitor Counter 스켈레톤 */}
      <div className='space-y-3'>
        <div className='h-6 bg-blue-400/20 rounded animate-pulse' />
        <div className='h-4 bg-blue-400/20 rounded w-3/4 animate-pulse' />
        <div className='h-8 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-lg animate-pulse' />
      </div>

      {/* Category 섹션 스켈레톤 */}
      <div>
        <div className='px-3 py-2 flex items-center justify-between'>
          <div className='h-6 bg-blue-400/20 rounded w-24 animate-pulse' />
        </div>
        <nav className='flex flex-col gap-2 px-3 py-4'>
          {/* 전체 메뉴 스켈레톤 */}
          <div className='h-8 bg-blue-400/20 rounded-lg animate-pulse' />

          {/* 카테고리 메뉴 스켈레톤들 */}
          {Array.from({ length: 6 }).map((_) => (
            <div
              key={`sidebar-category-skeleton-${Math.random()}`}
              className='h-8 bg-blue-400/20 rounded-lg animate-pulse'
            />
          ))}
        </nav>
      </div>

      {/* Tags 섹션 스켈레톤 */}
      <div>
        <div className='h-5 bg-blue-400/20 rounded w-16 mb-2 animate-pulse' />
        <div className='flex flex-wrap gap-2'>
          {Array.from({ length: 8 }).map((_) => (
            <div
              key={`sidebar-tag-skeleton-${Math.random()}`}
              className='h-6 bg-purple-400/20 rounded-full px-3 w-16 animate-pulse'
            />
          ))}
        </div>
      </div>
    </motion.aside>
  );
};
