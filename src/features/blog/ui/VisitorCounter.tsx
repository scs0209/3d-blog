'use client';

import { motion, useAnimate } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useVisitor } from '@/features/visitor/model';
import { blogTheme } from '@/widgets/post/ui/blog-theme';

const formatNumber = (num: number | undefined) => {
  if (num == null) {
    return '000';
  }
  return num.toString().padStart(3, '0');
};

type DigitProps = {
  digit: string;
  index: number;
  variant: 'today' | 'total';
};

const Digit = ({ digit, index, variant }: DigitProps) => {
  const todayClass =
    'border-[#ff9a3c]/35 bg-gradient-to-b from-[#ffc8a0] via-[#ff9a3c] to-[#8a4a68] text-[#1c0e38] shadow-[0_0_10px_rgba(255,154,60,0.25)] dark:border-[#3de8ff]/35 dark:from-[#7ec8ff] dark:via-[#3de8ff] dark:to-[#1a4a6a] dark:text-[#070414] dark:shadow-[0_0_10px_rgba(61,232,255,0.2)]';
  const totalClass =
    'border-[#e878a0]/30 bg-gradient-to-b from-[#ffb870] via-[#c878ff] to-[#5a2868] text-[#1c0e38] shadow-[0_0_10px_rgba(200,120,180,0.2)] dark:border-[#7ec8ff]/25 dark:from-[#7ec8ff] dark:via-[#6366f1] dark:to-[#1e1b4b] dark:text-[#070414] dark:shadow-[0_0_10px_rgba(99,102,241,0.2)]';

  return (
    <motion.div
      key={`${variant}-${index}-${digit}`}
      className={`flex h-7 w-5 items-center justify-center rounded-md border text-base font-extrabold ${variant === 'today' ? todayClass : totalClass}`}
      initial={{ rotateX: -90 }}
      animate={{ rotateX: 0 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      {digit}
    </motion.div>
  );
};

export const VisitorCounter = () => {
  const [counterRef, animate] = useAnimate();
  const { data, isLoading } = useVisitor();
  const prevCountRef = useRef<number | null>(null);

  useEffect(() => {
    if (prevCountRef.current !== data?.total && data?.total != null) {
      animate(counterRef.current, { scale: [1, 1.2, 1] }, { duration: 0.5 });
      prevCountRef.current = data?.total;
    }
  }, [data?.total, animate, counterRef]);

  if (isLoading) {
    return <div className={`mb-4 text-sm ${blogTheme.textMuted}`}>Loading...</div>;
  }

  const todayDigits = formatNumber(data?.today).split('');
  const totalDigits = formatNumber(data?.total).split('');

  return (
    <div className='relative mb-4 w-full'>
      <div className='absolute inset-0 scale-105 rotate-1 rounded-xl bg-gradient-to-r from-[#ff9a3c]/15 to-[#8a4a68]/10 blur-md dark:from-[#3de8ff]/8 dark:to-[#6366f1]/10' />
      <motion.div
        ref={counterRef}
        className={`relative flex flex-col items-center rounded-xl px-3 py-2.5 ${blogTheme.card}`}
        whileHover={{ rotateY: 8, rotateX: 2, scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 200 }}
        aria-label='방문자 통계'
      >
        <span className={blogTheme.cardTopGlow} aria-hidden />

        <div className='flex flex-row items-end gap-5'>
          <div className='flex flex-col items-center'>
            <span className={`mb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${blogTheme.textAccent}`}>
              오늘
            </span>
            <div className='flex space-x-0.5'>
              {todayDigits.map((digit, idx) => (
                <Digit key={`today-${idx}-${digit}`} digit={digit} index={idx} variant='today' />
              ))}
            </div>
          </div>

          <div className='mb-3 h-8 w-px bg-[#ff9a3c]/20 dark:bg-[#3de8ff]/15' aria-hidden />

          <div className='flex flex-col items-center'>
            <span className={`mb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${blogTheme.labelAccent}`}>
              전체
            </span>
            <div className='flex space-x-0.5'>
              {totalDigits.map((digit, idx) => (
                <Digit key={`total-${idx}-${digit}`} digit={digit} index={idx} variant='total' />
              ))}
            </div>
          </div>
        </div>

        <div className='mt-1.5 flex justify-center'>
          <motion.div
            key={`led-${data?.total}`}
            className='h-1.5 w-1.5 rounded-full bg-[#ff9a3c] shadow-[0_0_5px_1px_rgba(255,154,60,0.7)] dark:bg-[#3de8ff] dark:shadow-[0_0_5px_1px_rgba(61,232,255,0.6)]'
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            aria-hidden
          />
        </div>
      </motion.div>
    </div>
  );
};
