'use client';

import { motion } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';
import type { ReactNode } from 'react';

type ButtonProps = {
  children?: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'comment' | 'reply' | 'glass' | 'glass-primary';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  isPending?: boolean;
  submitType?: 'comment' | 'reply';
};

const sizeClasses = {
  sm: 'px-2.5 py-1.5 text-xs',
  md: 'px-3 py-2 text-sm',
  lg: 'px-4 py-2.5 text-base',
};

const variantColors = {
  primary:
    'border-white/25 bg-white/12 text-white/90 hover:border-white/40 hover:bg-white/18 dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/16',
  secondary:
    'border-white/15 bg-transparent text-white/75 hover:border-white/30 hover:bg-white/8 dark:text-white/70',
  comment:
    'border-[#ff9a3c]/35 bg-[#ff9a3c]/12 text-[#ffd4b0] hover:border-[#ff9a3c]/55 hover:bg-[#ff9a3c]/20 dark:border-[#3de8ff]/30 dark:bg-[#3de8ff]/10 dark:text-[#b8e4ff] dark:hover:border-[#3de8ff]/45 dark:hover:bg-[#3de8ff]/16',
  reply:
    'border-[#ff9a3c]/30 bg-[#ff9a3c]/10 text-[#ffb870] hover:border-[#ff9a3c]/50 hover:bg-[#ff9a3c]/16 dark:border-[#3de8ff]/25 dark:bg-[#3de8ff]/8 dark:text-[#7ec8ff] dark:hover:border-[#3de8ff]/40 dark:hover:bg-[#3de8ff]/14',
};

const glowColors = {
  primary: '0 4px 18px rgba(255, 255, 255, 0.12)',
  secondary: '0 4px 14px rgba(255, 255, 255, 0.08)',
  comment: '0 4px 16px rgba(255, 154, 60, 0.18)',
  reply: '0 4px 16px rgba(255, 154, 60, 0.14)',
};

export function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  isPending,
  submitType,
}: ButtonProps) {
  const isLoading = loading || isPending || false;
  const buttonVariant = submitType ? submitType : variant;
  const isGlassButton = buttonVariant === 'glass' || buttonVariant === 'glass-primary';
  const colorClasses = isGlassButton ? '' : variantColors[buttonVariant as keyof typeof variantColors];
  const glowColor = isGlassButton
    ? '0 4px 18px rgba(255, 255, 255, 0.12)'
    : glowColors[buttonVariant as keyof typeof glowColors];

  const defaultChildren = submitType ? (
    isLoading ? (
      <>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
          className='h-2.5 w-2.5 rounded-full border border-white/40 border-t-white'
        />
        <span>등록중...</span>
      </>
    ) : (
      <>
        <Send size={size === 'sm' ? 12 : size === 'md' ? 14 : 16} />
        <span>등록</span>
      </>
    )
  ) : null;

  const buttonChildren =
    children ||
    defaultChildren ||
    (isLoading ? (
      <>
        <Loader2 size={size === 'sm' ? 14 : size === 'md' ? 16 : 18} className='animate-spin' />
        <span>로딩중...</span>
      </>
    ) : (
      <span>버튼</span>
    ));

  const baseClasses = isGlassButton
    ? `
      ${buttonVariant === 'glass-primary' ? 'btn-glass-primary' : 'btn-glass'}
      font-medium
      transition-all duration-300 
      disabled:opacity-50 disabled:cursor-not-allowed 
      flex items-center gap-1.5 justify-center
      ${sizeClasses[size]}
      ${className}
    `
    : `
      border backdrop-blur-sm
      font-medium rounded-md
      transition-all duration-200
      disabled:opacity-50 disabled:cursor-not-allowed 
      flex items-center gap-1.5 justify-center
      ${colorClasses}
      ${sizeClasses[size]}
      ${className}
    `;

  const submitClasses = submitType ? 'absolute bottom-4 right-2' : '';

  return (
    <motion.button
      type={type}
      onClick={onClick}
      whileHover={{ scale: 1.01, boxShadow: glowColor }}
      whileTap={{ scale: 0.99 }}
      className={`${baseClasses} ${submitClasses}`}
      disabled={disabled || isLoading}
    >
      {buttonChildren}
    </motion.button>
  );
}
