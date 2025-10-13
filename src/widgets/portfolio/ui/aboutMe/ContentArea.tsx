'use client';

import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { contentContainerVariants, contentVariants, createBorderSlideVariants } from '../../lib/animations';
import { calculateBorderDelay, calculateTotalCloseTime, aboutMeData } from '../../consts';

interface ContentAreaProps {
  sectionCount: number;
  isClosing: boolean;
  onClose?: () => void;
}

export function ContentArea({ sectionCount, isClosing, onClose }: ContentAreaProps) {
  const [slideDone, setSlideDone] = useState(false);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const borderDelay = calculateBorderDelay(sectionCount);
  const borderSlideVariants = createBorderSlideVariants(borderDelay);

  // isClosing 상태 변화에 따라 타이머를 생성하고 정리하는 단일 useEffect
  useEffect(() => {
    if (isClosing) {
      const totalCloseTime = calculateTotalCloseTime(sectionCount);
      const timer = setTimeout(() => {
        onClose?.();
      }, totalCloseTime * 1000);

      // isClosing 상태가 바뀌거나 컴포넌트가 언마운트될 때 타이머를 정리합니다.
      return () => clearTimeout(timer);
    }
  }, [isClosing, onClose, sectionCount]);

  const handleContentAnimationComplete = () => {
    if (!isClosing) return;
    setSlideDone(false);
  };

  return (
    <>
      {/* 본문 영역 - 초기 슬라이드 인 */}
      {!slideDone && !isClosing && (
        <motion.div
          className='w-full h-[3px] overflow-hidden'
          variants={borderSlideVariants}
          initial='initial'
          animate='animate'
          onAnimationComplete={() => setSlideDone(true)}
        >
          <div className='h-[3px] bg-white shadow-[0_0_8px_white] rounded-t w-full' />
        </motion.div>
      )}

      {/* 본문 영역 - 메인 콘텐츠 */}
      {(slideDone || isClosing) && (
        <motion.div
          className='w-full flex flex-col gap-0 overflow-hidden'
          variants={contentContainerVariants}
          initial='closed'
          animate={isClosing ? 'closed' : 'open'}
          style={{
            minHeight: 0,
            boxSizing: 'border-box',
            background: 'rgba(0,0,0,0.25)',
            borderBottom: isClosing ? 'none' : '2px solid #fff',
          }}
          onAnimationComplete={handleContentAnimationComplete}
        >
          <motion.div
            variants={contentVariants}
            initial='hidden'
            animate={isClosing ? 'hidden' : 'visible'}
            className='flex flex-row gap-8 items-start w-full pt-4 h-full'
          >
            <div className='flex-1 min-w-0'>
              <div className='bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-inner'>
                {aboutMeData.bio.split('\n').map((line) => (
                  <p key={line} className='text-white/90 text-base font-mono leading-relaxed mb-2'>
                    {line}
                  </p>
                ))}
              </div>
            </div>
            <div className='flex-shrink-0 ml-4'>
              <div className='w-64 h-64 rounded-md shadow-2xl neon-glow flex items-center justify-center bg-black/60 overflow-hidden'>
                <img src={aboutMeData.profileImage} alt='profile' className='w-56 h-56 object-cover' />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* border-bottom 슬라이드 아웃 (닫힐 때) */}
      {isClosing && (
        <motion.div
          className='w-full h-[3px] overflow-hidden'
          variants={borderSlideVariants}
          initial='animate'
          animate='exit'
        >
          <div className='h-[3px] bg-white shadow-[0_0_8px_white] rounded-t w-full' />
        </motion.div>
      )}
    </>
  );
}
