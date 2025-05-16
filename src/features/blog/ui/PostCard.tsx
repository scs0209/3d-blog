import { motion } from 'framer-motion';

export const CategoryList = ({
  categories,
  selectedCategory,
  onCategoryClick,
}: { categories: any; selectedCategory: any; onCategoryClick: any }) => {
  return (
    <ul className='space-y-2'>
      {categories.map((category: any) => (
        <li key={category.id}>
          <motion.button
            className={`w-full text-left px-3 py-2 rounded-md flex justify-between items-center ${
              selectedCategory === category.name
                ? 'bg-purple-500/30 text-white'
                : 'text-purple-300 hover:bg-purple-500/20'
            }`}
            onClick={() => onCategoryClick(category.name)}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>{category.name}</span>
            <motion.span className='bg-purple-800/50 text-xs rounded-full py-1 px-2' whileHover={{ scale: 1.1 }}>
              {category.count}
            </motion.span>
          </motion.button>
        </li>
      ))}
    </ul>
  );
};
