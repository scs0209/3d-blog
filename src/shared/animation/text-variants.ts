import type { Variants } from 'framer-motion';

const offscreen = { y: 30, opacity: 0 };

export const textVariants: Variants = {
  hidden: offscreen,
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      delay: 0.6,
      duration: 0.4,
      ease: 'easeOut',
    },
  },
  exit: {
    ...offscreen,
    transition: {
      duration: 0.3,
      ease: 'easeIn',
    },
  },
};
