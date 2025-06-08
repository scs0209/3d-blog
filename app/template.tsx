'use client';
import { motion } from 'framer-motion';

const transitionVariants = {
  initial: {
    x: '100%',
    width: '100%',
  },
  animate: {
    x: '0%',
    width: '0%',
  },
  exit: {
    x: ['0%', '100%'],
    width: ['0%', '100%'],
  },
};

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      {/* 첫 번째 레이어 */}
      <motion.div
        className='fixed top-0 bottom-0 right-full w-screen h-screen z-30 bg-gradient-to-br from-slate-800 to-slate-900'
        variants={transitionVariants}
        initial='initial'
        animate='animate'
        exit='exit'
        transition={{ delay: 0, duration: 0.7, ease: 'easeInOut' }}
      />
      {/* 두 번째 레이어 */}
      <motion.div
        className='fixed top-0 bottom-0 right-full w-screen h-screen z-31 bg-gradient-to-br from-gray-800 to-blue-900'
        variants={transitionVariants}
        initial='initial'
        animate='animate'
        exit='exit'
        transition={{ delay: 0.1, duration: 0.7, ease: 'easeInOut' }}
      />
      {/* 세 번째 레이어 */}
      <motion.div
        className='fixed top-0 bottom-0 right-full w-screen h-screen z-32 bg-gradient-to-br from-blue-900 to-indigo-900'
        variants={transitionVariants}
        initial='initial'
        animate='animate'
        exit='exit'
        transition={{ delay: 0.2, duration: 0.7, ease: 'easeInOut' }}
      />
    </>
  );
}
