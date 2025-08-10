/**
 * @description 카드 컨테이너 애니메이션
 */
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.8, // 각 카드 완전히 나온 후 다음 시작
      delayChildren: 0.2,
    },
  },
  exit: {
    opacity: 1,
    transition: {
      staggerChildren: 0.6, // 나갈 때도 하나씩 완전히
      staggerDirection: -1,
      delayChildren: 0,
    },
  },
};

/**
 * @description 카드 애니메이션
 */
export const cardVariants = {
  hidden: {
    opacity: 0,
    y: 80,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7, // 카드 하나의 애니메이션 시간
      ease: [0.25, 0.4, 0.25, 1],
    },
  },
  exit: {
    opacity: 0,
    y: 80,
    scale: 0.9,
    transition: {
      duration: 0.5, // 나갈 때 조금 더 빠르게
      ease: [0.4, 0, 0.6, 1],
    },
  },
};
