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
        className={`flex w-full flex-wrap items-center gap-2 rounded-md border px-3 py-2 transition-all duration-300 focus-within:border-[#4de3ff]/55 ${blogTheme.card}`}
      >
        {pills.map((pill) => (
          <motion.div
            key={`${pill.type}-${pill.value}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={
              pill.type === 'tag'
                ? 'flex items-center gap-1 border border-[#4de3ff]/50 py-0.5 pl-2 pr-1 font-mono text-[11px] text-[#e9edf1]'
                : 'flex items-center gap-1 border border-white/20 py-0.5 pl-2 pr-1 font-mono text-[11px] text-[#e9edf1]'
            }
          >
            <span>{pill.type === 'tag' ? `#${pill.value}` : pill.value}</span>
            <button
              type='button'
              onClick={() => onPillRemove(pill)}
              className='p-0.5 transition-colors hover:bg-white/20'
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
          className={`min-w-[100px] flex-1 bg-transparent text-sm focus:outline-none ${blogTheme.textPrimary} placeholder:text-[#8d98a3]`}
        />
      </div>
    </motion.div>
  );
};
