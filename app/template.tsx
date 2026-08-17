'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

const transitionVariants = {
  initial: {
    x: '100%',
  },
  animate: {
    x: '100%',
  },
  exit: {
    x: ['0%', '100%'],
  },
};

/**
 * 페이지 전환 오버레이.
 * width 애니메이션은 CLS를 유발하므로 transform만 사용.
 * 블로그 읽기 경로에서는 오버레이를 생략해 LCP/CLS를 지킨다.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const skipTransition = pathname?.startsWith('/blog');

  if (skipTransition) {
    return children;
  }

  return (
    <>
      {children}
      <motion.div
        className='pointer-events-none fixed inset-y-0 right-0 z-30 h-screen w-screen origin-right bg-gradient-to-br from-slate-800 to-slate-900'
        variants={transitionVariants}
        initial='initial'
        animate='animate'
        exit='exit'
        transition={{ delay: 0, duration: 0.7, ease: 'easeInOut' }}
        aria-hidden
      />
      <motion.div
        className='pointer-events-none fixed inset-y-0 right-0 z-31 h-screen w-screen origin-right bg-gradient-to-br from-gray-800 to-blue-900'
        variants={transitionVariants}
        initial='initial'
        animate='animate'
        exit='exit'
        transition={{ delay: 0.1, duration: 0.7, ease: 'easeInOut' }}
        aria-hidden
      />
      <motion.div
        className='pointer-events-none fixed inset-y-0 right-0 z-32 h-screen w-screen origin-right bg-gradient-to-br from-blue-900 to-indigo-900'
        variants={transitionVariants}
        initial='initial'
        animate='animate'
        exit='exit'
        transition={{ delay: 0.2, duration: 0.7, ease: 'easeInOut' }}
        aria-hidden
      />
    </>
  );
}
