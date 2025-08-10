export const boxVariants = {
  hidden: {
    scaleX: 0,
    x: -100,
    opacity: 0,
  },
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
    scaleX: 0,
    x: -100,
    opacity: 0,
    transition: {
      delay: 0.3,
      duration: 0.4,
      ease: 'easeIn',
    },
  },
};
