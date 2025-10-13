'use client';

import { motion } from 'framer-motion';
import type { AboutMeSection } from '../../consts';
import { createSectionBorderVariants, createLabelVariants } from '../../lib/animations';

interface SectionTabProps {
  section: AboutMeSection;
  sectionIndex: number;
  sectionCount: number;
  isClosing: boolean;
}

export function SectionTab({ section, sectionIndex, sectionCount, isClosing }: SectionTabProps) {
  const borderSequence = createSectionBorderVariants(sectionIndex, sectionCount, isClosing);
  const labelVar = createLabelVariants(sectionIndex, sectionCount, isClosing);

  // 카드 전체 애니메이션
  const cardVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        delay: sectionIndex * 0.5,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.3,
        delay: (sectionCount - 1 - sectionIndex) * 0.5 + 0.7 + 0.5,
        ease: 'easeIn',
      },
    },
  };

  const borders = [
    {
      key: 'bottom',
      props: borderSequence.bottom,
      className: 'left-0 bottom-0 h-[4px] rounded shadow-[0_0_8px_white]',
    },
    { key: 'right', props: borderSequence.right, className: 'right-0 bottom-0 w-[2px]' },
    { key: 'top', props: borderSequence.top, className: 'right-0 top-0 h-[2px]' },
    { key: 'left', props: borderSequence.left, className: 'left-0 top-0 w-[2px]' },
  ];

  return (
    <motion.div
      key={section.key}
      variants={cardVariants}
      initial='hidden'
      animate={isClosing ? 'exit' : 'visible'}
      className='relative min-w-[180px] min-h-[70px] px-6 py-5 bg-white/10 backdrop-blur-xl border border-white/80 rounded-xl shadow-[0_0_12px_white,0_0_4px_white] flex flex-col items-start justify-end mr-6'
      style={{
        clipPath: 'polygon(12px 0, 100% 0, 100% 100%, 0 100%, 0 12px)',
      }}
    >
      <span className='text-xs font-mono text-white/70 drop-shadow-[0_0_6px_white] mb-2'>SEC-{sectionIndex}</span>

      {borders.map((border) => (
        <motion.div
          key={border.key}
          className={`absolute bg-white ${border.className}`}
          {...border.props}
          style={{ zIndex: 2 }}
        />
      ))}

      {/* 라벨 */}
      <motion.span
        variants={labelVar}
        initial='hidden'
        animate={isClosing ? 'exit' : 'visible'}
        className='text-white text-lg font-extrabold tracking-widest drop-shadow-[0_0_6px_white]'
        style={{
          textShadow: '0 0 8px #fff, 0 0 2px #fff',
          letterSpacing: '0.15em',
        }}
      >
        {section.label}
      </motion.span>
    </motion.div>
  );
}
