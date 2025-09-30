'use client';

import { useCategories } from '@/features/category/model';
import { useTags } from '@/features/tag/model';
import { motion } from 'framer-motion';
import { Loader2, Tag as TagIcon, Folder, Inbox } from 'lucide-react';
import { Tag } from '@/shared/ui/Tag';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import type { SearchPill } from './SearchBar';

interface SearchFilterProps {
  onSelect: (pill: SearchPill) => void;
  existingPills: SearchPill[];
  triggerRef?: React.RefObject<HTMLElement>;
}

export const SearchFilter = ({ onSelect, existingPills, triggerRef }: SearchFilterProps) => {
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: tags, isLoading: tagsLoading } = useTags();
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState({ top: 0, right: 0 });

  const isPillSelected = (pill: SearchPill) => {
    return existingPills.some((p) => p.type === pill.type && p.value === pill.value);
  };

  const isLoading = categoriesLoading || tagsLoading;
  const noResults = !isLoading && categories?.length === 0 && tags?.length === 0;

  useEffect(() => {
    setMounted(true);
    
    if (triggerRef?.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 20,
        right: window.innerWidth - rect.right
      });
    }
  }, [triggerRef]);

  if (!mounted) return null;

  return createPortal(
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className='w-80 bg-gray-900/95 backdrop-blur-xl border border-blue-400/30 rounded-xl shadow-2xl fixed z-[9999]'
      style={{
        top: `${position.top}px`,
        right: `${position.right}px`
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className='p-3'>
        <h2 className='text-sm font-bold text-blue-100 mb-3 px-1'>Filter by</h2>
        {isLoading ? (
          <div className='flex justify-center items-center p-4'>
            <Loader2 className='animate-spin text-blue-300' size={20} />
          </div>
        ) : noResults ? (
          <div className='text-center py-4 px-2'>
            <Inbox size={24} className='mx-auto text-gray-500' />
            <p className='mt-1 text-xs text-gray-400'>No categories or tags found.</p>
          </div>
        ) : (
          <div className='space-y-4'>
            {categories && categories.length > 0 && (
              <div>
                <h3 className='text-xs font-semibold text-blue-200 px-1 mb-2 flex items-center gap-1.5'>
                  <Folder size={14} /> Categories
                </h3>
                <div className='flex flex-wrap gap-1.5'>
                  {categories.map((category) => (
                    <motion.div
                      key={category.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (!isPillSelected({ type: 'category', value: category.name })) {
                          onSelect({ type: 'category', value: category.name });
                        }
                      }}
                    >
                      <Tag
                        size='sm'
                        color='blue'
                        type='glass'
                        hover={true}
                        className={`cursor-pointer transition-all duration-200 ${
                          isPillSelected({ type: 'category', value: category.name })
                            ? 'opacity-40 cursor-not-allowed'
                            : 'hover:bg-blue-500/20'
                        }`}
                      >
                        {category.name}
                        {category._count?.posts && (
                          <span className='ml-1 text-xs opacity-70'>({category._count.posts})</span>
                        )}
                      </Tag>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            
            {/* 구분선 */}
            {categories && categories.length > 0 && tags && tags.length > 0 && (
              <div className='border-t border-gray-600/50 my-3'></div>
            )}
            
            {tags && tags.length > 0 && (
              <div>
                <h3 className='text-xs font-semibold text-yellow-200 px-1 mb-2 flex items-center gap-1.5'>
                  <TagIcon size={14} /> Tags
                </h3>
                <div className='flex flex-wrap gap-1.5'>
                  {tags.map((tag) => (
                    <motion.div
                      key={tag.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (!isPillSelected({ type: 'tag', value: tag.name ?? '' })) {
                          onSelect({ type: 'tag', value: tag.name ?? '' });
                        }
                      }}
                    >
                      <Tag
                        size='sm'
                        color='yellow'
                        type='glass'
                        hover={true}
                        className={`cursor-pointer transition-all duration-200 ${
                          isPillSelected({ type: 'tag', value: tag.name ?? '' })
                            ? 'opacity-40 cursor-not-allowed'
                            : 'hover:bg-yellow-500/20'
                        }`}
                      >
                        #{tag.name}
                      </Tag>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>,
    document.body
  );
};
