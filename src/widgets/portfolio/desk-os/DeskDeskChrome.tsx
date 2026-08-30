'use client';

import { DeskSiteNav } from './DeskSiteNav';

type DeskDeskChromeProps = {
  muted: boolean;
  onMuteChange: (muted: boolean) => void;
  onNavigate: (href: string) => void;
  showSound?: boolean;
};

export const DeskDeskChrome = ({ muted, onMuteChange, onNavigate, showSound = true }: DeskDeskChromeProps) => {
  return (
    <div id='desk-desk-chrome' className='pointer-events-auto absolute top-[4.5rem] right-3 z-40 sm:top-4 sm:right-4'>
      <DeskSiteNav muted={muted} onMuteChange={onMuteChange} onNavigate={onNavigate} showSound={showSound} />
    </div>
  );
};
