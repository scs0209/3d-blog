import { motion, type HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface GlassmorphismButtonProps extends HTMLMotionProps<'button'> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

export const GlassmorphismButton = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: GlassmorphismButtonProps) => {
  const baseClasses =
    'font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-xl';

  const variantClasses = {
    primary:
      'bg-white/8 text-white hover:bg-white/15 hover:text-slate-900 hover:shadow-xl border border-white/15 hover:border-white/25',
    secondary:
      'bg-cyan-400/8 text-cyan-400 hover:bg-cyan-400/15 hover:text-cyan-300 border border-cyan-400/15 hover:border-cyan-400/25',
    outline: 'border border-white/20 text-white hover:bg-white/8 hover:border-white/30',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <motion.button
      className={classes}
      whileHover={{ scale: 1.05, y: -1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.button>
  );
};
