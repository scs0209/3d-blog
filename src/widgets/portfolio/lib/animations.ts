import type { Variants } from 'framer-motion';
import { calculateBorderTiming, calculateSectionBaseDelay, ABOUT_ME_ANIMATION_CONFIG } from '../consts';

export const gridVariants: Variants = {
  hidden: {
    transition: {
      staggerChildren: 0.3,
      staggerDirection: -1,
      when: 'afterChildren',
    },
  },
  show: {
    transition: {
      staggerChildren: 0.5,
      delayChildren: 0.2,
    },
  },
};

export const cardVariants: Variants = {
  hidden: {
    y: 30,
    scale: 0.1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
      staggerChildren: 0.02,
      staggerDirection: -1,
      when: 'beforeChildren',
      opacity: {
        duration: 0.2,
        delay: 0.3,
      },
    },
    transitionEnd: {
      opacity: 0,
    },
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
      staggerChildren: 0.04,
      delayChildren: 0.05,
    },
  },
};

export const skillGridVariants: Variants = {
  hidden: {
    transition: {
      staggerChildren: 0.015,
      staggerDirection: -1,
      when: 'afterChildren',
    },
  },
  show: {
    transition: {
      staggerChildren: 0.02,
    },
  },
};

export const skillItemVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.25,
      type: 'spring',
      stiffness: 400,
    },
  },
};

/**
 * AboutMe - Section Border 시퀀스 생성
 */
export const createSectionBorderVariants = (sectionIndex: number, sectionCount: number, isClosing: boolean) => {
  const baseDelay = calculateSectionBaseDelay(sectionIndex, sectionCount, isClosing);
  const timing = calculateBorderTiming(baseDelay, isClosing);

  return {
    bottom: {
      initial: { width: isClosing ? '100%' : 0 },
      animate: { width: isClosing ? 0 : '100%' },
      transition: { duration: timing.bottom.duration, delay: timing.bottom.delay },
    },
    right: {
      initial: { height: isClosing ? '100%' : 0 },
      animate: { height: isClosing ? 0 : '100%' },
      transition: { duration: timing.right.duration, delay: timing.right.delay },
    },
    top: {
      initial: { width: isClosing ? '100%' : 0 },
      animate: { width: isClosing ? 0 : '100%' },
      transition: { duration: timing.top.duration, delay: timing.top.delay },
    },
    left: {
      initial: { height: isClosing ? '100%' : 0 },
      animate: { height: isClosing ? 0 : '100%' },
      transition: { duration: timing.left.duration, delay: timing.left.delay },
    },
  };
};

/**
 * AboutMe - Section Label Variants
 */
export const createLabelVariants = (sectionIndex: number, sectionCount: number, isClosing: boolean): Variants => {
  const baseDelay = calculateSectionBaseDelay(sectionIndex, sectionCount, isClosing);
  const { LABEL_DURATION, LABEL_OFFSET, LABEL_EXIT_OFFSET } = ABOUT_ME_ANIMATION_CONFIG;

  return {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: baseDelay + LABEL_OFFSET, duration: LABEL_DURATION },
    },
    exit: {
      opacity: 0,
      y: 10,
      transition: { delay: baseDelay - LABEL_EXIT_OFFSET, duration: LABEL_DURATION },
    },
  };
};

/**
 * AboutMe - Content Container Variants
 */
export const contentContainerVariants: Variants = {
  closed: { height: 3 },
  open: {
    height: '100%',
    transition: {
      duration: ABOUT_ME_ANIMATION_CONFIG.DROP_DURATION,
      ease: 'easeInOut',
    },
  },
};

/**
 * AboutMe - Content Variants
 */
export const contentVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delay: ABOUT_ME_ANIMATION_CONFIG.CONTENT_FADE_DELAY,
      duration: ABOUT_ME_ANIMATION_CONFIG.CONTENT_FADE_DURATION,
    },
  },
};

/**
 * AboutMe - Border Slide Variants
 */
export const createBorderSlideVariants = (borderDelay: number): Variants => {
  const { SLIDE_DURATION, DROP_DURATION } = ABOUT_ME_ANIMATION_CONFIG;

  return {
    initial: { width: 0 },
    animate: {
      width: '100%',
      transition: {
        duration: SLIDE_DURATION,
        delay: borderDelay,
        ease: 'easeInOut',
      },
    },
    exit: {
      width: 0,
      transition: {
        duration: SLIDE_DURATION,
        delay: DROP_DURATION,
        ease: 'easeInOut',
      },
    },
  };
};
