'use client';

import { useCategories } from '@/features/category/model';
import { useTags } from '@/features/tag/model';
import { motion } from 'framer-motion';
import { Loader2, Tag as TagIcon, Folder, Inbox } from 'lucide-react';
import { Tag } from '@/shared/ui/Tag';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import { blogTheme } from '@/widgets/post/ui/blog-theme';
import type { SearchPill } from './SearchBar';

interface SearchFilterProps {
  onSelect: (pill: SearchPill, slug?: string) => void;
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
        top: rect.bottom + 12,
        right: window.innerWidth - rect.right,
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
      className={`fixed z-[9999] w-80 rounded-xl p-1 shadow-2xl ${blogTheme.searchPanel}`}
      style={{
        top: `${position.top}px`,
        right: `${position.right}px`,
      }}
      onClick={(e) => e.stopPropagation()}
      role='dialog'
      aria-label='검색 필터'
    >
      <div className='p-3'>
        <h2 className={`mb-3 px-1 text-sm font-bold ${blogTheme.sectionTitle}`}>필터</h2>
        {isLoading ? (
          <div className='flex items-center justify-center p-4'>
            <Loader2 className={`animate-spin ${blogTheme.textAccent}`} size={20} />
          </div>
        ) : noResults ? (
          <div className='px-2 py-4 text-center'>
            <Inbox size={24} className={`mx-auto ${blogTheme.textMuted}`} />
            <p className={`mt-1 text-xs ${blogTheme.textMuted}`}>카테고리·태그가 없습니다</p>
          </div>
        ) : (
          <div className='space-y-4'>
            {categories && categories.length > 0 && (
              <div>
                <h3 className={`mb-2 flex items-center gap-1.5 px-1 text-xs font-semibold ${blogTheme.textMuted}`}>
                  <Folder size={14} /> 카테고리
                </h3>
                <div className='flex flex-wrap gap-1.5'>
                  {categories.map((category) => (
                    <motion.div
                      key={category.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (!isPillSelected({ type: 'category', value: category.name })) {
                          onSelect({ type: 'category', value: category.name }, category.slug);
                        }
                      }}
                    >
                      <Tag
                        size='sm'
                        color='orange'
                        type='glass'
                        hover={true}
                        className={`mb-0 cursor-pointer transition-all duration-200 ${
                          isPillSelected({ type: 'category', value: category.name })
                            ? 'cursor-not-allowed opacity-40'
                            : ''
                        }`}
                      >
                        {category.name}
                        {category._count?.posts ? (
                          <span className='ml-1 text-xs opacity-70'>({category._count.posts})</span>
                        ) : null}
                      </Tag>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {categories && categories.length > 0 && tags && tags.length > 0 && (
              <div className={`my-3 border-t ${blogTheme.divider}`} />
            )}

            {tags && tags.length > 0 && (
              <div>
                <h3 className={`mb-2 flex items-center gap-1.5 px-1 text-xs font-semibold ${blogTheme.textMuted}`}>
                  <TagIcon size={14} /> 태그
                </h3>
                <div className='flex flex-wrap gap-1.5'>
                  {tags.map((tag) => {
                    if (tag.id == null || !tag.name) return null;
                    return (
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
                          color='amber'
                          type='glass'
                          hover={true}
                          className={`mb-0 cursor-pointer transition-all duration-200 ${
                            isPillSelected({ type: 'tag', value: tag.name ?? '' })
                              ? 'cursor-not-allowed opacity-40'
                              : ''
                          }`}
                        >
                          #{tag.name}
                        </Tag>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>,
    document.body,
  );
};
