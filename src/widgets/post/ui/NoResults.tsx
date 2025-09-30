'use client';

import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface NoResultsProps {
  searchTerm?: string;
  category?: string;
  tags?: string[];
}

export const NoResults = ({ searchTerm, category, tags }: NoResultsProps) => {
  const router = useRouter();
  const hasFilters = searchTerm || category || (tags && tags.length > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className='flex flex-col items-center justify-center min-h-[60vh] py-16 px-4'
    >
      {/* 메인 아이콘 */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className='relative mb-6'
      >
        <div className='w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-400/30 flex items-center justify-center backdrop-blur-sm'>
          <Search size={24} className='text-blue-300' />
        </div>
        <div className='absolute inset-0 rounded-full bg-blue-400/20 blur-xl animate-pulse' />
      </motion.div>

      {/* 메인 메시지 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className='text-center mb-8'
      >
        <h2 className='text-xl font-bold text-slate-100 mb-2'>
          {hasFilters ? '검색 결과가 없습니다' : '아직 게시물이 없습니다'}
        </h2>
      </motion.div>

      {/* 액션 버튼 */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => router.push('/blog/all')}
        className='px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 text-blue-300 hover:from-blue-500/30 hover:to-purple-500/30 hover:border-blue-400/50 transition-all duration-300 backdrop-blur-sm'
      >
        전체 게시물 보기
      </motion.button>

      {/* 장식적 요소들 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
        className='absolute inset-0 pointer-events-none overflow-hidden'
      >
        {/* 배경 장식 */}
        <div className='absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-blue-500/5 blur-3xl' />
        <div className='absolute bottom-1/4 right-1/4 w-24 h-24 rounded-full bg-purple-500/5 blur-2xl' />
        <div className='absolute top-1/2 right-1/3 w-16 h-16 rounded-full bg-cyan-500/5 blur-xl' />
      </motion.div>
    </motion.div>
  );
};
