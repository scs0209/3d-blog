'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQueryState, parseAsString, parseAsArrayOf } from 'nuqs';
import { Search, X, Filter } from 'lucide-react';
import type { SearchPill } from './SearchBar';

const SearchBar = dynamic<any>(() => import('./SearchBar').then((mod) => ({ default: mod.SearchBar })), { ssr: false });

const SearchFilter = dynamic<any>(() => import('./SearchFilter').then((mod) => ({ default: mod.SearchFilter })), {
  ssr: false,
});

export function BlogSearch() {
  const pathname = usePathname();
  const [q, setQ] = useQueryState('q', parseAsString.withDefault(''));
  const [category, setCategory] = useQueryState('category', parseAsString.withDefault(''));
  const [tags, setTags] = useQueryState('tags', parseAsArrayOf(parseAsString).withDefault([]));

  const [pills, setPills] = useState<SearchPill[]>([]);
  const [text, setText] = useState('');

  const [searchExpanded, setSearchExpanded] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const filterButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const newPills: SearchPill[] = [];
    if (category) {
      newPills.push({ type: 'category', value: category });
    }
    tags.forEach((tag) => {
      newPills.push({ type: 'tag', value: tag });
    });
    setPills(newPills);
    setText(q);
  }, [q, category, tags]);

  const handleTextChange = (newText: string) => {
    setText(newText);
    setQ(newText || null);
  };

  const handlePillRemove = (pillToRemove: SearchPill) => {
    if (pillToRemove.type === 'category') {
      setCategory(null);
    } else {
      const newTags = tags.filter((tag) => tag !== pillToRemove.value);
      setTags(newTags.length > 0 ? newTags : null);
    }
  };

  const handlePillAdd = (pillToAdd: SearchPill) => {
    if (pillToAdd.type === 'category') {
      setCategory(pillToAdd.value);
    } else if (!tags.includes(pillToAdd.value)) {
      setTags([...tags, pillToAdd.value]);
    }
    setFilterOpen(false);
  };

  const toggleSearch = () => {
    setSearchExpanded(!searchExpanded);
    if (!searchExpanded) {
      setTimeout(() => {
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        searchInput?.focus();
      }, 150);
    }
  };

  const shouldShowSearch = pathname === '/blog/all';

  const searchBarPlaceholder = useMemo(() => {
    if (pills.length > 0) return 'Add to search...';
    return 'Search posts, tags, or categories...';
  }, [pills.length]);

  if (!shouldShowSearch) {
    return null;
  }

  return (
    <>
      {/* Desktop Search */}
      <div className='hidden lg:block relative' style={{ zIndex: 1000 }}>
        <AnimatePresence mode='wait'>
          {searchExpanded ? (
            <motion.div
              key='search-expanded'
              initial={{ width: 40, opacity: 0 }}
              animate={{ width: 380, opacity: 1 }}
              exit={{ width: 40, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 0.8 }}
              className='flex items-center gap-2 bg-black/10 rounded-lg'
            >
              <div className='flex-1 pl-2'>
                <SearchBar
                  text={text}
                  pills={pills}
                  onTextChange={handleTextChange}
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
                className='p-1 text-blue-100 hover:text-white transition-all duration-200 rounded-full hover:bg-white/10'
              >
                <Filter size={16} />
              </motion.button>
              <motion.button
                type='button'
                onClick={toggleSearch}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className='p-1 mr-1 text-blue-100 hover:text-white transition-all duration-200 rounded-full hover:bg-white/10 flex-shrink-0'
              >
                <X size={16} />
              </motion.button>
              <AnimatePresence>
                {filterOpen && (
                  <SearchFilter onSelect={handlePillAdd} existingPills={pills} triggerRef={filterButtonRef} />
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
              className='p-2 rounded-full text-blue-100 hover:text-white hover:bg-white/10 transition-all duration-300'
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
          className='p-2 rounded-full text-blue-100 hover:text-white hover:bg-white/10 transition-all duration-300'
        >
          <Search size={18} />
        </motion.button>

        <AnimatePresence>
          {searchExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex justify-center items-start p-4'
              onClick={toggleSearch}
            >
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className='w-full max-w-md bg-gray-800/80 backdrop-blur-xl border border-blue-400/20 rounded-2xl p-4 mt-16 shadow-2xl'
                onClick={(e) => e.stopPropagation()}
              >
                <div className='flex items-center gap-2 mb-4'>
                  <div className='flex-1'>
                    <SearchBar
                      text={text}
                      pills={pills}
                      onTextChange={handleTextChange}
                      onPillRemove={handlePillRemove}
                      placeholder={searchBarPlaceholder}
                    />
                  </div>
                  <motion.button
                    type='button'
                    onClick={() => setFilterOpen(!filterOpen)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className='p-2 text-blue-100 hover:text-white transition-all duration-200 rounded-full hover:bg-white/10'
                  >
                    <Filter size={20} />
                  </motion.button>
                </div>
                <AnimatePresence>
                  {filterOpen && (
                    <SearchFilter onSelect={handlePillAdd} existingPills={pills} triggerRef={filterButtonRef} />
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