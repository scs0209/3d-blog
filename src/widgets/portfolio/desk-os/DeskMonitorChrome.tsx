'use client';

import { DeskSiteNav } from './DeskSiteNav';

type DeskMonitorChromeProps = {
  muted: boolean;
  onMuteChange: (muted: boolean) => void;
  onNavigate: (href: string) => void;
  onLeaveMonitor: () => void;
};

export const DeskMonitorChrome = ({
  muted,
  onMuteChange,
  onNavigate,
  onLeaveMonitor,
}: DeskMonitorChromeProps) => {
  return (
    <div
      id='desk-monitor-chrome'
      className='pointer-events-none absolute inset-0 z-50 font-mono text-xs tracking-[0.12em] text-[#d8f4ff] sm:text-sm'
    >
      <div className='pointer-events-auto absolute top-[4.5rem] right-3 flex flex-col items-end gap-2 sm:top-4 sm:right-4'>
        <DeskSiteNav muted={muted} onMuteChange={onMuteChange} onNavigate={onNavigate} />
        <button
          type='button'
          aria-label='데스크로 돌아가기'
          tabIndex={0}
          onClick={onLeaveMonitor}
          className='border border-[#5ad8ff]/35 bg-[#050814]/80 px-3 py-1 text-[#d8f4ff] shadow-[0_0_18px_rgba(90,216,255,0.18)] hover:bg-[#5ad8ff] hover:text-[#02010a]'
        >
          Leave Desk
        </button>
      </div>
    </div>
  );
};
