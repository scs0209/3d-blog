import type React from 'react';

export type SizeToken = 'sm' | 'md' | 'lg';
export type ColorToken = 'blue' | 'navy' | 'neon' | 'blueToCyan' | 'fuchsiaToBlue';
export type SpacingToken = 'tight' | 'normal' | 'loose';

const sizeStyles: Record<SizeToken, string> = {
  sm: 'text-[10px] px-1.5 py-0.5',
  md: 'text-[11px] px-2 py-0.5', // PostListCard와 동일
  lg: 'text-[14px] px-3 py-1.5',
};

const colorStyles: Record<ColorToken, string> = {
  blue: 'bg-blue-900/80 border border-blue-400/60 text-blue-100 shadow-[0_0_8px_1px_#7dd3fc66]',
  navy: 'bg-[#181c2a] border border-blue-900 text-blue-100',
  neon: 'bg-blue-900/80 border border-cyan-300/80 text-blue-100 shadow-[0_0_8px_1px_#7dd3fc66]',
  blueToCyan: 'bg-gradient-to-r from-blue-500 to-cyan-400 border border-blue-300/80 text-white',
  fuchsiaToBlue: 'bg-gradient-to-r from-fuchsia-500 to-blue-500 border border-fuchsia-400/80 text-white',
};

const spacingStyles: Record<SpacingToken, string> = {
  tight: 'mb-0.5',
  normal: 'mb-1',
  loose: 'mb-2',
};

export type TagProps = {
  children: React.ReactNode;
  size?: SizeToken;
  color?: ColorToken;
  spacing?: SpacingToken;
  className?: string;
};

export const Tag = ({ children, size = 'md', color = 'blue', spacing = 'normal', className = '' }: TagProps) => {
  return (
    <span
      className={[
        'inline-block font-mono font-bold rounded-md',
        sizeStyles[size],
        colorStyles[color],
        spacingStyles[spacing],
        className,
      ].join(' ')}
    >
      {children}
    </span>
  );
};
