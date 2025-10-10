import type { Variants } from 'framer-motion';

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
