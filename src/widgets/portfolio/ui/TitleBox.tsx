'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { boxVariants, textVariants } from '@/shared/animation';

export const TitleBox = () => {
  return (
    <AnimatePresence>
      <motion.div
        variants={boxVariants}
        initial='hidden'
        animate='visible'
        exit='exit'
        className='bg-gradient-to-r w-12 h-2 from-purple-500 to-pink-500 text-white text-center rounded-lg shadow-lg p-4 flex items-center justify-center'
        style={{ originX: 0 }}
      >
        <motion.div variants={textVariants} initial='hidden' animate='visible' exit='exit'>
          <p className='text-xs opacity-90'>Title</p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
