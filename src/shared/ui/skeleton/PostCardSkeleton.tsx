import { motion } from 'framer-motion';

export const PostCardSkeleton = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='relative group block p-2 h-full w-full'>
      <div className='bg-[#232946]/40 rounded-3xl p-4 h-full border border-blue-400/20'>
        {/* 제목 스켈레톤 */}
        <div className='h-4 bg-blue-400/20 rounded mb-3 animate-pulse' />
        <div className='h-3 bg-blue-400/20 rounded mb-2 w-3/4 animate-pulse' />

        {/* 카테고리 스켈레톤 */}
        <div className='h-3 bg-purple-400/20 rounded mb-3 w-1/3 animate-pulse' />

        {/* 날짜 스켈레톤 */}
        <div className='h-3 bg-blue-400/20 rounded mb-3 w-1/2 animate-pulse' />

        {/* 요약 스켈레톤 */}
        <div className='space-y-2'>
          <div className='h-3 bg-blue-400/20 rounded animate-pulse' />
          <div className='h-3 bg-blue-400/20 rounded w-5/6 animate-pulse' />
          <div className='h-3 bg-blue-400/20 rounded w-4/6 animate-pulse' />
        </div>
      </div>
    </motion.div>
  );
};

