import { Tag } from '@/features/blog/ui';
import { AnimatePresence, motion } from 'framer-motion';

const tags: { id: string; name: string; count: number }[] = [
  { id: '1', name: 'React', count: 10 },
  { id: '2', name: 'NextJS', count: 5 },
  { id: '3', name: 'CSS', count: 3 },
  { id: '4', name: 'Database', count: 2 },
];

export const MobileNavbar = ({
  categories,
  selectedCategory,
  handleCategoryClick,
  menuOpen,
  setMenuOpen,
}: {
  categories: string[];
  selectedCategory: string | null;
  handleCategoryClick: (category: string) => void;
  menuOpen: boolean;
  setMenuOpen: (menuOpen: boolean) => void;
}) => {
  return (
    <AnimatePresence>
      {menuOpen && (
        <motion.div
          key='mobile-sidebar'
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className='fixed inset-0 z-40 bg-black/60 flex justify-end lg:hidden'
        >
          <motion.div
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 80, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className='w-72 max-w-full h-full flex flex-col gap-8 p-6 bg-[#181c2a]/90 border-l border-blue-300 shadow-[0_0_16px_4px_#7dd3fc55] backdrop-blur-sm'
          >
            <div className='flex items-center justify-between mb-4'>
              <span className='font-extrabold text-lg font-mono text-blue-100'>Category</span>
              <button
                type='button'
                className='text-blue-100 p-1 rounded-full hover:bg-blue-900/40'
                onClick={() => setMenuOpen(false)}
                aria-label='메뉴 닫기'
              >
                <svg width='24' height='24' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <title>메뉴 닫기</title>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>
            <nav className='flex flex-col gap-2 px-3 py-4'>
              {categories.map((cat) => (
                <motion.button
                  key={cat}
                  type='button'
                  whileHover={{
                    scale: 1.06,
                    boxShadow: selectedCategory === cat ? '0 0 12px #7dd3fc, 0 0 24px #7dd3fc55' : '0 0 8px #7dd3fc55',
                  }}
                  whileTap={{ scale: 0.97 }}
                  className={`text-left px-2 py-1 rounded-lg font-mono transition relative
                      ${selectedCategory === cat ? 'bg-blue-100 text-[#232946] border border-blue-300 shadow-[0_0_12px_#7dd3fc,0_0_24px_#7dd3fc55]' : 'bg-transparent hover:bg-blue-900/40 text-blue-100 border border-transparent'}`}
                  onClick={() => handleCategoryClick(cat)}
                >
                  {cat}
                </motion.button>
              ))}
            </nav>
            <div>
              <h2 className='font-extrabold text-base mb-2 font-mono text-blue-100'>Tags</h2>
              <div className='flex flex-wrap gap-2'>
                {tags.map((tag) => (
                  <Tag key={tag.id} tag={tag} />
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
