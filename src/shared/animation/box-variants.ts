import type { Variants } from 'framer-motion';

const closedState = {
  scaleX: 0,
  x: -100,
  opacity: 0,
};

export const boxVariants: Variants = {
  hidden: closedState,
  visible: {
    scaleX: 1,
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
  exit: {
    ...closedState,
    transition: {
      delay: 0.3,
      duration: 0.4,
      ease: 'easeIn',
    },
  },
};
