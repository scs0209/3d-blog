'use client';

import { motion } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';
import type { ReactNode } from 'react';

type ButtonProps = {
  children?: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'comment' | 'reply';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  // Submit 버튼 전용 props (하위 호환성)
  isPending?: boolean;
  submitType?: 'comment' | 'reply';
};

const sizeClasses = {
  sm: 'px-2.5 py-1.5 text-xs',
  md: 'px-3 py-2 text-sm',
  lg: 'px-4 py-2.5 text-base',
};

const variantColors = {
  primary: 'from-blue-600/70 to-indigo-600/70 hover:from-blue-500/80 hover:to-indigo-500/80 border-blue-400/30',
  secondary: 'from-slate-600/70 to-gray-600/70 hover:from-slate-500/80 hover:to-gray-500/80 border-slate-400/30',
  comment: 'from-blue-600/70 to-indigo-800/70 hover:from-blue-500/80 hover:to-indigo-500/80 border-blue-400/30',
  reply: 'from-indigo-600/70 to-purple-600/70 hover:from-indigo-500/80 hover:to-purple-500/80 border-indigo-400/30',
};

const glowColors = {
  primary: '0 0 15px rgba(59, 130, 246, 0.4)',
  secondary: '0 0 15px rgba(100, 116, 139, 0.4)',
  comment: '0 0 15px rgba(59, 130, 246, 0.4)',
  reply: '0 0 15px rgba(99, 102, 241, 0.4)',
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
  // 하위 호환성을 위한 submit 관련 props
  isPending,
  submitType,
}: ButtonProps) {
  // 하위 호환성 처리
  const isLoading = loading || isPending || false;
  const buttonVariant = submitType ? submitType : variant;
  const colorClasses = variantColors[buttonVariant];
  const glowColor = glowColors[buttonVariant];

  // Submit 버튼인 경우 기본 children 설정
  const defaultChildren = submitType ? (
    isLoading ? (
      <>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
          className='w-2.5 h-2.5 border border-white/40 border-t-white rounded-full'
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

  const baseClasses = `
    bg-gradient-to-r ${colorClasses}
    backdrop-blur-sm border
    text-white/90 font-medium rounded-md shadow-lg
    transition-all duration-300 
    disabled:opacity-50 disabled:cursor-not-allowed 
    flex items-center gap-1.5 justify-center
    ${sizeClasses[size]}
    dark:text-white/95
    ${className}
  `;

  // Submit 버튼인 경우 absolute 위치 클래스 추가
  const submitClasses = submitType ? 'absolute bottom-4 right-2' : '';

  return (
    <motion.button
      type={type}
      onClick={onClick}
      whileHover={{
        scale: 1.02,
        rotate: 1,
        boxShadow: glowColor,
      }}
      whileTap={{
        scale: 0.98,
        rotate: 0,
      }}
      className={`${baseClasses} ${submitClasses}`}
      disabled={disabled || isLoading}
    >
      {buttonChildren}
    </motion.button>
  );
}
