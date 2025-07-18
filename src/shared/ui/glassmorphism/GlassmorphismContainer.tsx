import { motion, type HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';

interface GlassmorphismContainerProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  rounded?: boolean;
}

export const GlassmorphismContainer = ({
  children,
  className = '',
  padding = 'md',
  rounded = true,
  ...props
}: GlassmorphismContainerProps) => {
  const baseClasses = 'bg-white/5 backdrop-blur-lg shadow-lg border border-white/20';
  const roundedClasses = rounded ? 'rounded-2xl' : '';

  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-8',
    lg: 'p-12',
  };

  const classes = `${baseClasses} ${roundedClasses} ${paddingClasses[padding]} ${className}`;

  return (
    <motion.div className={classes} {...props}>
      {children}
    </motion.div>
  );
};
