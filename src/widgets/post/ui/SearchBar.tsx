'use client';

import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export interface SearchPill {
  type: 'tag' | 'category';
  value: string;
}

export const SearchBar = ({
  text,
  pills,
  onTextChange,
  onPillRemove,
  placeholder = 'Search posts...',
}: {
  text: string;
  pills: SearchPill[];
  onTextChange: (v: string) => void;
  onPillRemove: (pill: SearchPill) => void;
  placeholder?: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className='w-full flex items-center ml-auto'
    >
      <div className='w-full flex items-center flex-wrap gap-2 px-4 py-2 rounded-lg bg-[#232946]/80 border border-blue-300 focus-within:ring-2 focus-within:ring-blue-400 shadow-[0_0_8px_#7dd3fc55] transition'>
        {pills.map((pill) => (
          <motion.div
            key={`${pill.type}-${pill.value}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
            className={`flex items-center gap-1 pl-2 pr-1 py-0.5 rounded-full text-sm font-medium ${
              pill.type === 'tag'
                ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30'
                : 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
            }`}
          >
            <span>{pill.value}</span>
            <button
              type='button'
              onClick={() => onPillRemove(pill)}
              className='p-0.5 rounded-full hover:bg-white/20 transition-colors'
              aria-label={`Remove ${pill.value}`}
            >
              <X size={12} />
            </button>
          </motion.div>
        ))}
        <input
          type='text'
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder={pills.length === 0 ? placeholder : ''}
          className='flex-1 min-w-[100px] bg-transparent focus:outline-none text-slate-100 placeholder:text-blue-200'
        />
      </div>
    </motion.div>
  );
};
