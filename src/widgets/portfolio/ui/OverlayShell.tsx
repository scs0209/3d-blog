import type { ReactNode } from 'react';
import { cn } from '@/shadcn-ui/lib/utils';

type OverlayShellProps = {
  children: ReactNode;
  side?: 'left' | 'right';
  className?: string;
  /** 콘텐츠 영역 추가 클래스 */
  contentClassName?: string;
};

/**
 * 포트폴리오 오버레이 공통 셸.
 * 상단 센터 타이틀/EXIT(z-escape-hatch) 아래부터 콘텐츠가 시작되도록 top padding 확보.
 */
export const OverlayShell = ({ children, side = 'left', className, contentClassName }: OverlayShellProps) => {
  return (
    <div
      className={cn(
        'fixed top-0 h-full z-overlay pointer-events-none',
        side === 'left' ? 'left-0' : 'right-0',
        'w-full max-w-3xl min-w-[300px]',
        className,
      )}
    >
      <div
        className={cn(
          'pointer-events-auto h-full pt-28 pb-24 px-5 md:px-8 overflow-y-auto overflow-x-hidden',
          contentClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
};

/** 패널 코너 브라켓 — 비율에 늘어나지 않는 고정 크기 */
export const OverlayCornerFrame = ({ className }: { className?: string }) => (
  <div className={cn('pointer-events-none absolute inset-0 z-20', className)} aria-hidden='true'>
    <span className='absolute top-0 left-0 h-3.5 w-3.5 border-l-2 border-t-2 border-neon-cream/85' />
    <span className='absolute top-0 right-0 h-3.5 w-3.5 border-r-2 border-t-2 border-neon-cream/85' />
    <span className='absolute bottom-0 left-0 h-3.5 w-3.5 border-b-2 border-l-2 border-neon-cream/85' />
    <span className='absolute bottom-0 right-0 h-3.5 w-3.5 border-b-2 border-r-2 border-neon-cream/85' />
  </div>
);

type OverlayPanelProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  withFrame?: boolean;
};

export const OverlayPanel = ({ children, className, contentClassName, withFrame = true }: OverlayPanelProps) => (
  <div
    className={cn(
      'relative overflow-hidden bg-black/55 backdrop-blur-md border border-neon-cream/20',
      className,
    )}
  >
    {withFrame && <OverlayCornerFrame />}
    <div className={cn('relative z-10', contentClassName)}>{children}</div>
  </div>
);

type OverlaySectionHeaderProps = {
  kicker: string;
  title?: string;
  description?: string;
  className?: string;
};

/** 오버레이 공통 섹션 헤더 */
export const OverlaySectionHeader = ({ kicker, title, description, className }: OverlaySectionHeaderProps) => (
  <div className={cn('mb-4', className)}>
    <p className='text-[10px] font-mono tracking-[0.2em] text-neon-cream/50 uppercase'>{kicker}</p>
    {title ? <p className='text-neon-cream font-mono font-bold tracking-wider text-lg mt-1'>{title}</p> : null}
    {description ? <p className='text-neon-muted/65 font-mono text-xs tracking-wide mt-1'>{description}</p> : null}
  </div>
);
