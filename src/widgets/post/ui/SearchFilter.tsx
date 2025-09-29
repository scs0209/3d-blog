'use client';

import { useCategories } from '@/features/category/model';
import { useTags } from '@/features/tag/model';
import { motion } from 'framer-motion';
import { Loader2, Tag, Folder, Inbox } from 'lucide-react';
import type { SearchPill } from './SearchBar';

interface SearchFilterProps {
  onSelect: (pill: SearchPill) => void;
  existingPills: SearchPill[];
}

export const SearchFilter = ({ onSelect, existingPills }: SearchFilterProps) => {
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: tags, isLoading: tagsLoading } = useTags();

  const isPillSelected = (pill: SearchPill) => {
    return existingPills.some((p) => p.type === pill.type && p.value === pill.value);
  };

  const isLoading = categoriesLoading || tagsLoading;
  const noResults = !isLoading && categories?.length === 0 && tags?.length === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className='w-72 max-h-96 overflow-y-auto bg-gray-900/70 backdrop-blur-xl border border-blue-400/30 rounded-xl shadow-2xl'
    >
      <div className='p-3'>
        <h2 className='text-base font-bold text-blue-100 mb-3 px-1'>Filter by</h2>
        {isLoading ? (
          <div className='flex justify-center items-center p-8'>
            <Loader2 className='animate-spin text-blue-300' />
          </div>
        ) : noResults ? (
          <div className='text-center py-8 px-4'>
            <Inbox size={32} className='mx-auto text-gray-500' />
            <p className='mt-2 text-sm text-gray-400'>No categories or tags found.</p>
          </div>
        ) : (
          <div className='space-y-4'>
            {categories && categories.length > 0 && (
              <div>
                <h3 className='text-sm font-semibold text-blue-200 px-2 mb-2 flex items-center gap-2'>
                  <Folder size={16} /> Categories
                </h3>
                <ul className='space-y-1'>
                  {categories.map((category) => (
                    <li key={category.id}>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        type='button'
                        onClick={() => onSelect({ type: 'category', value: category.name })}
                        disabled={isPillSelected({ type: 'category', value: category.name })}
                        className='w-full text-left px-3 py-2 text-sm rounded-lg text-slate-100 hover:bg-blue-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-between'
                      >
                        <span>{category.name}</span>
                        {category._count?.posts && (
                          <span className='text-xs text-gray-400'>{category._count.posts}</span>
                        )}
                      </motion.button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {tags && tags.length > 0 && (
              <div>
                <h3 className='text-sm font-semibold text-yellow-200 px-2 mb-2 flex items-center gap-2'>
                  <Tag size={16} /> Tags
                </h3>
                <ul className='flex flex-wrap gap-2 p-1'>
                  {tags.map((tag) => (
                    <li key={tag.id}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type='button'
                        onClick={() => onSelect({ type: 'tag', value: tag.name ?? '' })}
                        disabled={isPillSelected({ type: 'tag', value: tag.name ?? '' })}
                        className='px-2.5 py-1 text-xs rounded-full bg-yellow-500/10 text-yellow-300 border border-yellow-400/30 hover:bg-yellow-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200'
                      >
                        #{tag.name}
                      </motion.button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};
