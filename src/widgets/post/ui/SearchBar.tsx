'use client';

import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { blogTheme } from '@/widgets/post/ui/blog-theme';

export interface SearchPill {
  type: 'tag' | 'category';
  value: string;
}

export const SearchBar = ({
  text,
  pills,
  onTextChange,
  onPillRemove,
  placeholder = '글 검색...',
}: {
  text: string;
  pills: SearchPill[];
  onTextChange: (v: string) => void;
  onPillRemove: (pill: SearchPill) => void;
  placeholder?: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className='ml-auto flex w-full items-center'
    >
      <div
        className={`flex w-full flex-wrap items-center gap-2 rounded-lg border px-3 py-2 transition-all duration-300 focus-within:border-[#ff9a3c]/55 focus-within:shadow-[0_0_18px_rgba(255,154,60,0.15)] dark:focus-within:border-[#3de8ff]/45 dark:focus-within:shadow-[0_0_18px_rgba(61,232,255,0.12)] ${blogTheme.card}`}
      >
        {pills.map((pill) => (
          <motion.div
            key={`${pill.type}-${pill.value}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
            className={
              pill.type === 'tag'
                ? 'flex items-center gap-1 rounded-full border border-[#ff9a3c]/30 bg-[#ff9a3c]/10 py-0.5 pl-2 pr-1 text-sm font-medium text-[#ffc8a0] dark:border-[#3de8ff]/30 dark:bg-[#3de8ff]/10 dark:text-[#3de8ff]'
                : 'flex items-center gap-1 rounded-full border border-[#e878a0]/30 bg-[#e878a0]/10 py-0.5 pl-2 pr-1 text-sm font-medium text-[#ffc8a0] dark:border-[#818cf8]/30 dark:bg-[#818cf8]/10 dark:text-[#a5b4fc]'
            }
          >
            <span>{pill.type === 'tag' ? `#${pill.value}` : pill.value}</span>
            <button
              type='button'
              onClick={() => onPillRemove(pill)}
              className='rounded-full p-0.5 transition-colors hover:bg-white/20'
              aria-label={`${pill.value} 필터 제거`}
            >
              <X size={12} />
            </button>
          </motion.div>
        ))}
        <input
          type='search'
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder={pills.length === 0 ? placeholder : '검색어 추가...'}
          aria-label='게시물 검색'
          className={`min-w-[100px] flex-1 bg-transparent text-sm focus:outline-none ${blogTheme.textPrimary} placeholder:text-[#d4a8c0]/55 dark:placeholder:text-[#7ec8ff]/45`}
        />
      </div>
    </motion.div>
  );
};
