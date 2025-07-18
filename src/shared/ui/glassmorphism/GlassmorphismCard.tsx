import { motion, type HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';

interface GlassmorphismCardProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  border?: boolean;
}

export const GlassmorphismCard = ({
  children,
  className = '',
  hover = true,
  border = true,
  ...props
}: GlassmorphismCardProps) => {
  const baseClasses = 'bg-white/3 backdrop-blur-xl shadow-2xl relative';
  const borderClasses = border ? 'border border-white/15' : '';
  const hoverClasses = hover ? 'hover:bg-white/8 hover:border-white/25 transition-all duration-300' : '';

  return (
    <motion.div
      className={`${baseClasses} ${borderClasses} ${hoverClasses} ${className}`}
      whileHover={hover ? { scale: 1.02, y: -2 } : undefined}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      {...props}
    >
      {/* L자 모서리 테두리 */}
      {border && (
        <svg
          className='absolute inset-0 w-full h-full pointer-events-none z-0'
          viewBox='0 0 100 100'
          preserveAspectRatio='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <title>Cyberpunk frame</title>
          {/* 네 변 border */}
          <line x1='8' y1='0' x2='92' y2='0' stroke='white' strokeWidth='1.5' opacity='0.3' />
          <line x1='100' y1='8' x2='100' y2='92' stroke='white' strokeWidth='1.5' opacity='0.3' />
          <line x1='92' y1='100' x2='8' y2='100' stroke='white' strokeWidth='1.5' opacity='0.3' />
          <line x1='0' y1='92' x2='0' y2='8' stroke='white' strokeWidth='1.5' opacity='0.3' />
          {/* 좌상단 ┏ */}
          <polyline points='0,16 0,0 16,0' stroke='white' strokeWidth='3.5' fill='none' opacity='0.8' />
          {/* 우상단 ┓ */}
          <polyline points='84,0 100,0 100,16' stroke='white' strokeWidth='3.5' fill='none' opacity='0.8' />
          {/* 우하단 ┛ */}
          <polyline points='100,84 100,100 84,100' stroke='white' strokeWidth='3.5' fill='none' opacity='0.8' />
          {/* 좌하단 ┗ */}
          <polyline points='16,100 0,100 0,84' stroke='white' strokeWidth='3.5' fill='none' opacity='0.8' />
        </svg>
      )}
      <div className='relative z-10'>{children}</div>
    </motion.div>
  );
};
