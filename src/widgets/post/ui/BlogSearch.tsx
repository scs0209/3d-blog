'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQueryState, parseAsString, parseAsArrayOf } from 'nuqs';
import { Search, X, Filter } from 'lucide-react';
import { useCategories } from '@/features/category/model';
import { blogTheme } from '@/widgets/post/ui/blog-theme';
import type { SearchPill } from './SearchBar';

const SearchBar = dynamic(() => import('./SearchBar').then((mod) => ({ default: mod.SearchBar })), { ssr: false });

const SearchFilter = dynamic(() => import('./SearchFilter').then((mod) => ({ default: mod.SearchFilter })), {
  ssr: false,
});

export function BlogSearch() {
  const pathname = usePathname();
  const { data: categories } = useCategories();
  const [search, setSearch] = useQueryState('search', {
    defaultValue: '',
    limitUrlUpdates: {
      method: 'debounce',
      timeMs: 500,
    },
  });
  const [category, setCategory] = useQueryState('category', parseAsString.withDefault(''));
  const [tags, setTags] = useQueryState('tags', parseAsArrayOf(parseAsString).withDefault([]));

  const [pills, setPills] = useState<SearchPill[]>([]);

  const [searchExpanded, setSearchExpanded] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const filterButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const newPills: SearchPill[] = [];
    if (category) {
      const categoryData = categories?.find((cat) => cat.slug === category);
      newPills.push({
        type: 'category',
        value: categoryData?.name ?? category,
      });
    }
    for (const tag of tags) {
      newPills.push({ type: 'tag', value: tag });
    }

    setPills(newPills);
  }, [category, tags, categories]);

  const handlePillRemove = (pillToRemove: SearchPill) => {
    if (pillToRemove.type === 'category') {
      setCategory(null);
    } else {
      const newTags = tags.filter((tag) => tag !== pillToRemove.value);
      setTags(newTags.length > 0 ? newTags : null);
    }
  };

  const handlePillAdd = (pillToAdd: SearchPill, slug?: string) => {
    if (pillToAdd.type === 'category') {
      setCategory(slug ?? pillToAdd.value);
    } else if (!tags.includes(pillToAdd.value)) {
      setTags([...tags, pillToAdd.value]);
    }
    setFilterOpen(false);
  };

  const toggleSearch = () => {
    setSearchExpanded(!searchExpanded);
    if (!searchExpanded) {
      setTimeout(() => {
        const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
        searchInput?.focus();
      }, 150);
    }
  };

  const shouldShowSearch = pathname === '/blog/all';

  const searchBarPlaceholder = useMemo(() => {
    if (pills.length > 0) return '검색어 추가...';
    return '제목·본문·태그 검색...';
  }, [pills.length]);

  if (!shouldShowSearch) {
    return null;
  }

  return (
    <>
      {/* Desktop Search */}
      <div className='hidden lg:block relative overflow-hidden max-w-sm' style={{ zIndex: 1000 }}>
        <AnimatePresence mode='wait'>
          {searchExpanded ? (
            <motion.div
              key='search-expanded'
              initial={{ width: 40, opacity: 0 }}
              animate={{ width: 380, opacity: 1 }}
              exit={{ width: 40, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 0.8 }}
              className='relative flex items-center gap-2 rounded-lg bg-[#12082a]/60 dark:bg-black/10'
            >
              <div className='flex-1 pl-2'>
                <SearchBar
                  text={search ?? ''}
                  pills={pills}
                  onTextChange={setSearch}
                  onPillRemove={handlePillRemove}
                  placeholder={searchBarPlaceholder}
                />
              </div>
              <motion.button
                ref={filterButtonRef}
                type='button'
                onClick={() => setFilterOpen(!filterOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`rounded-full p-1 transition-all duration-200 ${blogTheme.searchIcon}`}
                aria-label='검색 필터'
                aria-expanded={filterOpen}
              >
                <Filter size={16} />
              </motion.button>
              <motion.button
                type='button'
                onClick={toggleSearch}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className={`mr-1 flex-shrink-0 rounded-full p-1 transition-all duration-200 ${blogTheme.searchIcon}`}
              >
                <X size={16} />
              </motion.button>
              <AnimatePresence>
                {filterOpen && (
                  <SearchFilter
                    onSelect={handlePillAdd}
                    existingPills={pills}
                    triggerRef={filterButtonRef as React.RefObject<HTMLElement>}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.button
              key='search-collapsed'
              type='button'
              onClick={toggleSearch}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className={`rounded-full p-2 transition-all duration-300 ${blogTheme.searchIcon}`}
              aria-label='검색 열기'
            >
              <Search size={18} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Search */}
      <div className='block lg:hidden'>
        <motion.button
          type='button'
          onClick={toggleSearch}
          whileHover={{ scale: 1.1, rotate: 15 }}
          whileTap={{ scale: 0.9 }}
          className={`rounded-full p-2 transition-all duration-300 ${blogTheme.searchIcon}`}
        >
          <Search size={18} />
        </motion.button>

        <AnimatePresence>
          {searchExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='fixed inset-0 z-40 flex items-start justify-center bg-slate-900/40 p-4 backdrop-blur-sm dark:bg-black/50'
              onClick={toggleSearch}
            >
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className={`mt-16 w-full max-w-md rounded-2xl p-4 shadow-2xl ${blogTheme.searchPanel}`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className='flex items-center gap-2 mb-4'>
                  <div className='flex-1'>
                    <SearchBar
                      text={search ?? ''}
                      pills={pills}
                      onTextChange={setSearch}
                      onPillRemove={handlePillRemove}
                      placeholder={searchBarPlaceholder}
                    />
                  </div>
                  <motion.button
                    type='button'
                    onClick={() => setFilterOpen(!filterOpen)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`rounded-full p-2 transition-all duration-200 ${blogTheme.searchIcon}`}
                  >
                    <Filter size={20} />
                  </motion.button>
                </div>
                <AnimatePresence>
                  {filterOpen && (
                    <SearchFilter
                      onSelect={handlePillAdd}
                      existingPills={pills}
                      triggerRef={filterButtonRef as React.RefObject<HTMLElement>}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
