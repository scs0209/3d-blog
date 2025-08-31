import { motion } from 'framer-motion';

export const PostListCardSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className='bg-[#232946]/40 rounded-2xl p-6 border border-blue-400/20 hover:border-blue-400/40 transition-colors'
    >
      <div className='flex flex-col lg:flex-row gap-6'>
        {/* 왼쪽: 텍스트 영역 */}
        <div className='flex-1 space-y-4'>
          {/* 제목 스켈레톤 */}
          <div className='h-6 bg-blue-400/20 rounded animate-pulse' />
          <div className='h-5 bg-blue-400/20 rounded w-4/5 animate-pulse' />

          {/* 메타 정보 스켈레톤 */}
          <div className='flex items-center gap-4 text-sm'>
            <div className='h-4 bg-purple-400/20 rounded w-16 animate-pulse' />
            <div className='h-4 bg-blue-400/20 rounded w-24 animate-pulse' />
            <div className='h-4 bg-green-400/20 rounded w-20 animate-pulse' />
          </div>

          {/* 내용 스켈레톤 */}
          <div className='space-y-2'>
            <div className='h-4 bg-blue-400/20 rounded animate-pulse' />
            <div className='h-4 bg-blue-400/20 rounded w-5/6 animate-pulse' />
            <div className='h-4 bg-blue-400/20 rounded w-4/6 animate-pulse' />
            <div className='h-4 bg-blue-400/20 rounded w-3/4 animate-pulse' />
          </div>

          {/* 태그 스켈레톤 */}
          <div className='flex gap-2'>
            <div className='h-6 bg-blue-400/20 rounded-full px-3 w-16 animate-pulse' />
            <div className='h-6 bg-blue-400/20 rounded-full px-3 w-20 animate-pulse' />
            <div className='h-6 bg-blue-400/20 rounded-full px-3 w-14 animate-pulse' />
          </div>
        </div>

        {/* 오른쪽: 이미지 영역 (데스크톱에서만 표시) */}
        <div className='hidden lg:block w-48 h-32 bg-blue-400/20 rounded-xl animate-pulse' />
      </div>
    </motion.div>
  );
};
