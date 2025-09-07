'use client';

import { useState, useRef, useCallback, type ReactNode } from 'react';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  position?: TooltipPosition;
  className?: string;
  delay?: number;
  disabled?: boolean;
  neon?: boolean;
  neonIntensity?: 'low' | 'medium' | 'high' | number;
}

const positionClasses = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  'top-left': 'bottom-full right-0 mb-2',
  'top-right': 'bottom-full left-0 mb-2',
  'bottom-left': 'top-full right-0 mt-2',
  'bottom-right': 'top-full left-0 mt-2',
} as const;

const arrowClasses = {
  top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent',
  bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent',
  left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent',
  right: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent',
  'top-left': 'top-full right-2 border-l-transparent border-r-transparent border-b-transparent',
  'top-right': 'top-full left-2 border-l-transparent border-r-transparent border-b-transparent',
  'bottom-left': 'bottom-full right-2 border-l-transparent border-r-transparent border-t-transparent',
  'bottom-right': 'bottom-full left-2 border-l-transparent border-r-transparent border-t-transparent',
} as const;

const arrowBorderClasses = {
  top: 'border-t-white/20',
  bottom: 'border-b-white/20',
  left: 'border-l-white/20',
  right: 'border-r-white/20',
  'top-left': 'border-t-white/20',
  'top-right': 'border-t-white/20',
  'bottom-left': 'border-b-white/20',
  'bottom-right': 'border-b-white/20',
} as const;

export const Tooltip = ({
  children,
  content,
  position = 'top',
  className = '',
  delay = 500,
  disabled = false,
  neon = false,
  neonIntensity = 'medium',
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const tooltipId = useRef(`tooltip-${Math.random().toString(36).substring(2, 9)}`);

  const showTooltip = useCallback(() => {
    if (disabled) return;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  }, [disabled, delay]);

  const hideTooltip = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 100);
  }, []);

  const handleMouseEnter = useCallback(() => {
    showTooltip();
  }, [showTooltip]);

  const handleMouseLeave = useCallback(() => {
    hideTooltip();
  }, [hideTooltip]);

  const handleFocus = useCallback(() => {
    showTooltip();
  }, [showTooltip]);

  const handleBlur = useCallback(() => {
    hideTooltip();
  }, [hideTooltip]);

  const baseTooltipClasses = `
    absolute z-50 px-3 py-2 text-sm font-medium text-white rounded-lg shadow-lg
    backdrop-blur-md border transition-all duration-200 ease-in-out pointer-events-none whitespace-nowrap
    ${isVisible ? 'opacity-100 visible' : 'opacity-0 invisible'}
    ${positionClasses[position]}
  `.trim();

  const defaultClasses = 'bg-white/10 border-white/20';
  const tooltipClasses = className || defaultClasses;

  // Neon 효과를 위한 스타일 생성
  const getNeonStyle = () => {
    if (!neon) {
      return {
        boxShadow: '0 0 15px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
      };
    }

    // className에서 색상 추출 (기본값: 흰색)
    let neonColor = '255, 255, 255'; // 기본 흰색

    if (className.includes('orange')) {
      neonColor = '249, 115, 22'; // orange-500
    } else if (className.includes('cyan')) {
      neonColor = '6, 182, 212'; // cyan-500
    } else if (className.includes('blue')) {
      neonColor = '59, 130, 246'; // blue-500
    } else if (className.includes('green')) {
      neonColor = '34, 197, 94'; // green-500
    } else if (className.includes('purple')) {
      neonColor = '139, 69, 255'; // purple-500
    } else if (className.includes('red')) {
      neonColor = '239, 68, 68'; // red-500
    } else if (className.includes('yellow')) {
      neonColor = '251, 191, 36'; // yellow-500
    }

    // 강도에 따른 투명도 계산
    const getIntensityValues = () => {
      if (typeof neonIntensity === 'number') {
        // 사용자 정의 값 (0-1 범위)
        const intensity = Math.max(0, Math.min(1, neonIntensity));
        return {
          inner: intensity * 0.7,
          middle: intensity * 0.5,
          outer: intensity * 0.2,
          inset: 0.2 + intensity * 0.2,
          blur: [15 + intensity * 25, 30 + intensity * 30, 45 + intensity * 45],
        };
      }

      // 프리셋 값들 (테두리 네온 효과에 최적화)
      switch (neonIntensity) {
        case 'low':
          return {
            inner: 0.1, // inset 글로우 감소
            middle: 0.3, // 테두리 주변 글로우
            outer: 0.1, // 외부 글로우 감소
            inset: 0.15,
            blur: [8, 15, 25], // 블러 감소
          };
        case 'high':
          return {
            inner: 0.2, // inset 글로우 감소
            middle: 0.7, // 테두리 주변 글로우 강화
            outer: 0.3,
            inset: 0.4,
            blur: [15, 30, 50], // 블러 감소
          };
        default: // medium
          return {
            inner: 0.15, // inset 글로우 감소
            middle: 0.5, // 테두리 주변 글로우
            outer: 0.2,
            inset: 0.3,
            blur: [10, 20, 35], // 블러 감소
          };
      }
    };

    const intensity = getIntensityValues();

    return {
      boxShadow: `
        inset 0 0 ${intensity.blur[0]}px rgba(${neonColor}, ${intensity.inner}),
        0 0 ${intensity.blur[1]}px rgba(${neonColor}, ${intensity.middle}),
        0 0 ${intensity.blur[2]}px rgba(${neonColor}, ${intensity.outer})
      `,
      borderColor: `rgba(${neonColor}, 0.8)`,
    };
  };

  return (
    <div
      className='relative inline-block z-50'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <button
        type='button'
        aria-describedby={isVisible ? tooltipId.current : undefined}
        className='cursor-pointer focus:outline-none inline-flex bg-transparent border-none p-0 m-0'
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            showTooltip();
          }
        }}
      >
        {children}
      </button>

      {/* Tooltip Content */}
      <div
        id={tooltipId.current}
        role='tooltip'
        className={`${baseTooltipClasses} ${tooltipClasses}`}
        style={getNeonStyle()}
      >
        {content}

        {/* Arrow */}
        <div
          className={`absolute border-4 ${arrowClasses[position]} ${arrowBorderClasses[position]}`}
          style={{
            filter: 'drop-shadow(0 0 2px rgba(255, 255, 255, 0.1))',
          }}
        />
      </div>
    </div>
  );
};
