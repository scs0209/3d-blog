'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { AboutMeSection } from '../../consts';
import { aboutMeData, calculateBorderDelay, calculateTotalCloseTime } from '../../consts';
import { contentContainerVariants, contentVariants, createBorderSlideVariants } from '../../lib/animations';
import { OverlayPanel } from '../OverlayShell';
import { overlayStyles } from '../overlayStyles';

interface ContentAreaProps {
  section: AboutMeSection;
  sectionCount: number;
  isClosing: boolean;
  onClose?: () => void;
}

export function ContentArea({ section, sectionCount, isClosing, onClose }: ContentAreaProps) {
  const [slideDone, setSlideDone] = useState(false);
  const borderDelay = calculateBorderDelay(sectionCount);
  const borderSlideVariants = createBorderSlideVariants(borderDelay);

  useEffect(() => {
    if (isClosing) {
      const totalCloseTime = calculateTotalCloseTime(sectionCount);
      const timer = setTimeout(() => {
        onClose?.();
      }, totalCloseTime * 1000);

      return () => clearTimeout(timer);
    }
  }, [isClosing, onClose, sectionCount]);

  const handleContentAnimationComplete = () => {
    if (!isClosing) return;
    setSlideDone(false);
  };

  return (
    <>
      {!slideDone && !isClosing && (
        <motion.div
          className='w-full h-[2px] overflow-hidden'
          variants={borderSlideVariants}
          initial='initial'
          animate='animate'
          onAnimationComplete={() => setSlideDone(true)}
        >
          <div className={`h-[2px] ${overlayStyles.accentLine} w-full`} />
        </motion.div>
      )}

      {(slideDone || isClosing) && (
        <motion.div
          key={isClosing ? 'closing' : section.key}
          className='w-full overflow-hidden'
          variants={contentContainerVariants}
          initial='closed'
          animate={isClosing ? 'closed' : 'open'}
          onAnimationComplete={handleContentAnimationComplete}
        >
          <OverlayPanel className='p-5 h-full'>
            <motion.div
              variants={contentVariants}
              initial='hidden'
              animate={isClosing ? 'hidden' : 'visible'}
              className='flex flex-col sm:flex-row gap-6 items-start'
            >
              <div className='flex-1 min-w-0 space-y-3'>
                <p className={overlayStyles.kicker}>{section.kicker}</p>
                {section.paragraphs.map((line) => (
                  <p key={line} className={overlayStyles.body}>
                    {line}
                  </p>
                ))}
              </div>
              {section.showProfile && (
                <div className='flex-shrink-0'>
                  <div className={`w-44 h-44 sm:w-52 sm:h-52 ${overlayStyles.panel} overflow-hidden`}>
                    <img
                      src={aboutMeData.profileImage}
                      alt={`${aboutMeData.name} profile`}
                      className='w-full h-full object-cover opacity-90'
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </OverlayPanel>
        </motion.div>
      )}

      {isClosing && (
        <motion.div
          className='w-full h-[2px] overflow-hidden'
          variants={borderSlideVariants}
          initial='animate'
          animate='exit'
        >
          <div className={`h-[2px] ${overlayStyles.accentLine} w-full`} />
        </motion.div>
      )}
    </>
  );
}
