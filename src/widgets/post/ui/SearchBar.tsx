import { motion } from 'framer-motion';

export const SearchBar = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className='w-full lg:max-w-xs flex items-center ml-auto p-2'
    >
      <input
        type='text'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder='Search posts...'
        className='w-full px-4 py-2 rounded-lg bg-[#232946]/80 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-slate-100 placeholder:text-blue-200 shadow-[0_0_8px_#7dd3fc55] transition'
      />
    </motion.div>
  );
};
