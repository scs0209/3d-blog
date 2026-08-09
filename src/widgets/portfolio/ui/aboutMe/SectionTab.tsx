'use client';

import { motion } from 'framer-motion';
import type { AboutMeSection } from '../../consts';
import { createLabelVariants, createSectionBorderVariants } from '../../lib/animations';
import { overlayStyles } from '../overlayStyles';

interface SectionTabProps {
  section: AboutMeSection;
  sectionIndex: number;
  sectionCount: number;
  isClosing: boolean;
  isSelected: boolean;
  onSelect: (key: string) => void;
}

export function SectionTab({
  section,
  sectionIndex,
  sectionCount,
  isClosing,
  isSelected,
  onSelect,
}: SectionTabProps) {
  const borderSequence = createSectionBorderVariants(sectionIndex, sectionCount, isClosing);
  const labelVar = createLabelVariants(sectionIndex, sectionCount, isClosing);

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, delay: sectionIndex * 0.5, ease: 'easeOut' },
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
    { key: 'bottom', props: borderSequence.bottom, className: 'left-0 bottom-0 h-[2px]' },
    { key: 'right', props: borderSequence.right, className: 'right-0 bottom-0 w-[1px]' },
    { key: 'top', props: borderSequence.top, className: 'right-0 top-0 h-[1px]' },
    { key: 'left', props: borderSequence.left, className: 'left-0 top-0 w-[1px]' },
  ];

  const handleClick = () => {
    if (isClosing) {
      return;
    }
    onSelect(section.key);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <motion.div
      key={section.key}
      role='button'
      tabIndex={isClosing ? -1 : 0}
      aria-pressed={isSelected}
      aria-label={`${section.label} 섹션 선택`}
      variants={cardVariants}
      initial='hidden'
      animate={isClosing ? 'exit' : 'visible'}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`relative min-w-[140px] px-4 py-3 ${
        isSelected ? overlayStyles.panelSelected : overlayStyles.panel
      } flex flex-col items-start justify-end cursor-pointer transition-all duration-300 hover:border-[#E5D6C4]/55`}
      style={{ clipPath: 'polygon(10px 0, 100% 0, 100% 100%, 0 100%, 0 10px)' }}
    >
      <span className={`${overlayStyles.kicker} mb-1.5`}>SEC-{String(sectionIndex).padStart(2, '0')}</span>

      {borders.map((border) => (
        <motion.div
          key={border.key}
          className={`absolute ${overlayStyles.accentLine} ${border.className}`}
          {...border.props}
          style={{ zIndex: 2 }}
        />
      ))}

      <motion.span
        variants={labelVar}
        initial='hidden'
        animate={isClosing ? 'exit' : 'visible'}
        className={`${overlayStyles.title} text-sm`}
        style={{ letterSpacing: '0.12em' }}
      >
        {section.label}
      </motion.span>
    </motion.div>
  );
}
