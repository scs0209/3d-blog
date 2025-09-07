import type React from 'react';

export type SizeToken = 'sm' | 'md' | 'lg';
export type ColorToken =
  | 'blue'
  | 'navy'
  | 'neon'
  | 'blueToCyan'
  | 'fuchsiaToBlue'
  | 'purple'
  | 'green'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'pink'
  | 'cyan'
  | 'indigo'
  | 'emerald'
  | 'rose'
  | 'violet'
  | 'amber'
  | 'teal'
  | 'lime'
  | 'sky'
  | 'slate'
  | 'gray'
  | 'neutral';
export type SpacingToken = 'tight' | 'normal' | 'loose';
export type TypeToken = 'solid' | 'glass' | 'outline' | 'gradient';

const sizeStyles: Record<SizeToken, string> = {
  sm: 'text-[10px] px-1.5 py-0.5',
  md: 'text-[11px] px-2 py-0.5', // PostListCard와 동일
  lg: 'text-[14px] px-3 py-1.5',
};

// Solid 스타일 (기존)
const solidColorStyles: Record<ColorToken, string> = {
  blue: 'bg-blue-900/80 border border-blue-400/60 text-blue-100 shadow-[0_0_8px_1px_#7dd3fc66]',
  navy: 'bg-[#181c2a] border border-blue-900 text-blue-100',
  neon: 'bg-blue-900/80 border border-cyan-300/80 text-blue-100 shadow-[0_0_8px_1px_#7dd3fc66]',
  blueToCyan: 'bg-gradient-to-r from-blue-500 to-cyan-400 border border-blue-300/80 text-white',
  fuchsiaToBlue: 'bg-gradient-to-r from-fuchsia-500 to-blue-500 border border-fuchsia-400/80 text-white',

  // 새로운 solid 색상들
  purple: 'bg-purple-900/80 border border-purple-400/60 text-purple-100 shadow-[0_0_8px_1px_#a855f766]',
  green: 'bg-green-900/80 border border-green-400/60 text-green-100 shadow-[0_0_8px_1px_#22c55e66]',
  red: 'bg-red-900/80 border border-red-400/60 text-red-100 shadow-[0_0_8px_1px_#ef444466]',
  orange: 'bg-orange-900/80 border border-orange-400/60 text-orange-100 shadow-[0_0_8px_1px_#f97316_66]',
  yellow: 'bg-yellow-900/80 border border-yellow-400/60 text-yellow-100 shadow-[0_0_8px_1px_#eab30866]',
  pink: 'bg-pink-900/80 border border-pink-400/60 text-pink-100 shadow-[0_0_8px_1px_#ec489966]',
  cyan: 'bg-cyan-900/80 border border-cyan-400/60 text-cyan-100 shadow-[0_0_8px_1px_#06b6d466]',
  indigo: 'bg-indigo-900/80 border border-indigo-400/60 text-indigo-100 shadow-[0_0_8px_1px_#6366f166]',
  emerald: 'bg-emerald-900/80 border border-emerald-400/60 text-emerald-100 shadow-[0_0_8px_1px_#10b98166]',
  rose: 'bg-rose-900/80 border border-rose-400/60 text-rose-100 shadow-[0_0_8px_1px_#f43f5e66]',
  violet: 'bg-violet-900/80 border border-violet-400/60 text-violet-100 shadow-[0_0_8px_1px_#8b5cf666]',
  amber: 'bg-amber-900/80 border border-amber-400/60 text-amber-100 shadow-[0_0_8px_1px_#f59e0b66]',
  teal: 'bg-teal-900/80 border border-teal-400/60 text-teal-100 shadow-[0_0_8px_1px_#14b8a666]',
  lime: 'bg-lime-900/80 border border-lime-400/60 text-lime-100 shadow-[0_0_8px_1px_#65a30d66]',
  sky: 'bg-sky-900/80 border border-sky-400/60 text-sky-100 shadow-[0_0_8px_1px_#0ea5e966]',
  slate: 'bg-slate-900/80 border border-slate-400/60 text-slate-100 shadow-[0_0_8px_1px_#64748b66]',
  gray: 'bg-gray-900/80 border border-gray-400/60 text-gray-100 shadow-[0_0_8px_1px_#6b728066]',
  neutral: 'bg-neutral-900/80 border border-neutral-400/60 text-neutral-100 shadow-[0_0_8px_1px_#73737366]',
};

// Glassmorphism 스타일 (배경, 테두리, 텍스트 모두 색상별로)
const glassColorStyles: Record<ColorToken, string> = {
  blue: 'bg-blue-500/10 backdrop-blur-md border border-blue-400/30 text-blue-200',
  navy: 'bg-blue-900/10 backdrop-blur-md border border-blue-600/30 text-blue-200',
  neon: 'bg-cyan-500/10 backdrop-blur-md border border-cyan-400/30 text-cyan-200',
  blueToCyan:
    'bg-gradient-to-r from-blue-500/10 to-cyan-400/10 backdrop-blur-md border border-blue-300/30 text-blue-200',
  fuchsiaToBlue:
    'bg-gradient-to-r from-fuchsia-500/10 to-blue-500/10 backdrop-blur-md border border-fuchsia-400/30 text-fuchsia-200',

  purple: 'bg-purple-500/10 backdrop-blur-md border border-purple-400/30 text-purple-200',
  green: 'bg-green-500/10 backdrop-blur-md border border-green-400/30 text-green-200',
  red: 'bg-red-500/10 backdrop-blur-md border border-red-400/30 text-red-200',
  orange: 'bg-orange-500/10 backdrop-blur-md border border-orange-400/30 text-orange-200',
  yellow: 'bg-yellow-500/10 backdrop-blur-md border border-yellow-400/30 text-yellow-200',
  pink: 'bg-pink-500/10 backdrop-blur-md border border-pink-400/30 text-pink-200',
  cyan: 'bg-cyan-500/10 backdrop-blur-md border border-cyan-400/30 text-cyan-200',
  indigo: 'bg-indigo-500/10 backdrop-blur-md border border-indigo-400/30 text-indigo-200',
  emerald: 'bg-emerald-500/10 backdrop-blur-md border border-emerald-400/30 text-emerald-200',
  rose: 'bg-rose-500/10 backdrop-blur-md border border-rose-400/30 text-rose-200',
  violet: 'bg-violet-500/10 backdrop-blur-md border border-violet-400/30 text-violet-200',
  amber: 'bg-amber-500/10 backdrop-blur-md border border-amber-400/30 text-amber-200',
  teal: 'bg-teal-500/10 backdrop-blur-md border border-teal-400/30 text-teal-200',
  lime: 'bg-lime-500/10 backdrop-blur-md border border-lime-400/30 text-lime-200',
  sky: 'bg-sky-500/10 backdrop-blur-md border border-sky-400/30 text-sky-200',
  slate: 'bg-slate-500/10 backdrop-blur-md border border-slate-400/30 text-slate-200',
  gray: 'bg-gray-500/10 backdrop-blur-md border border-gray-400/30 text-gray-200',
  neutral: 'bg-neutral-500/10 backdrop-blur-md border border-neutral-400/30 text-neutral-200',
};

// Outline 스타일
const outlineColorStyles: Record<ColorToken, string> = {
  blue: 'bg-transparent border border-blue-400/60 text-blue-400 hover:bg-blue-500/10',
  navy: 'bg-transparent border border-blue-600/60 text-blue-400 hover:bg-blue-500/10',
  neon: 'bg-transparent border border-cyan-400/60 text-cyan-400 hover:bg-cyan-500/10',
  blueToCyan:
    'bg-transparent border border-blue-400/60 text-blue-400 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-cyan-400/10',
  fuchsiaToBlue:
    'bg-transparent border border-fuchsia-400/60 text-fuchsia-400 hover:bg-gradient-to-r hover:from-fuchsia-500/10 hover:to-blue-500/10',

  purple: 'bg-transparent border border-purple-400/60 text-purple-400 hover:bg-purple-500/10',
  green: 'bg-transparent border border-green-400/60 text-green-400 hover:bg-green-500/10',
  red: 'bg-transparent border border-red-400/60 text-red-400 hover:bg-red-500/10',
  orange: 'bg-transparent border border-orange-400/60 text-orange-400 hover:bg-orange-500/10',
  yellow: 'bg-transparent border border-yellow-400/60 text-yellow-400 hover:bg-yellow-500/10',
  pink: 'bg-transparent border border-pink-400/60 text-pink-400 hover:bg-pink-500/10',
  cyan: 'bg-transparent border border-cyan-400/60 text-cyan-400 hover:bg-cyan-500/10',
  indigo: 'bg-transparent border border-indigo-400/60 text-indigo-400 hover:bg-indigo-500/10',
  emerald: 'bg-transparent border border-emerald-400/60 text-emerald-400 hover:bg-emerald-500/10',
  rose: 'bg-transparent border border-rose-400/60 text-rose-400 hover:bg-rose-500/10',
  violet: 'bg-transparent border border-violet-400/60 text-violet-400 hover:bg-violet-500/10',
  amber: 'bg-transparent border border-amber-400/60 text-amber-400 hover:bg-amber-500/10',
  teal: 'bg-transparent border border-teal-400/60 text-teal-400 hover:bg-teal-500/10',
  lime: 'bg-transparent border border-lime-400/60 text-lime-400 hover:bg-lime-500/10',
  sky: 'bg-transparent border border-sky-400/60 text-sky-400 hover:bg-sky-500/10',
  slate: 'bg-transparent border border-slate-400/60 text-slate-400 hover:bg-slate-500/10',
  gray: 'bg-transparent border border-gray-400/60 text-gray-400 hover:bg-gray-500/10',
  neutral: 'bg-transparent border border-neutral-400/60 text-neutral-400 hover:bg-neutral-500/10',
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
  type?: TypeToken;
  className?: string | Element;
  hover?: boolean; // 호버 효과 활성화
};

const getColorStyles = (type: TypeToken, color: ColorToken): string => {
  switch (type) {
    case 'glass':
      return glassColorStyles[color];
    case 'outline':
      return outlineColorStyles[color];
    case 'gradient':
      // gradient 타입은 기존 gradient 색상들만 지원
      if (['blueToCyan', 'fuchsiaToBlue'].includes(color)) {
        return solidColorStyles[color];
      }
      return solidColorStyles[color]; // fallback to solid
    default: // 'solid' 포함
      return solidColorStyles[color];
  }
};

export const Tag = ({
  children,
  size = 'md',
  color = 'blue',
  spacing = 'normal',
  type = 'solid',
  className = '',
  hover = false,
}: TagProps) => {
  const baseClasses = 'inline-block font-mono font-bold rounded-md transition-all duration-200';
  const hoverClasses = hover ? 'hover:scale-105 hover:shadow-lg cursor-pointer' : '';

  return (
    <span
      className={[
        baseClasses,
        sizeStyles[size],
        getColorStyles(type, color),
        spacingStyles[spacing],
        hoverClasses,
        className,
      ].join(' ')}
    >
      {children}
    </span>
  );
};
