'use client';

import { type KeyboardEvent, type PointerEvent, type ReactNode, useRef } from 'react';
import type { OsAppId } from '../types';

type OsWindowProps = {
  title: string;
  x: number;
  y: number;
  z: number;
  width?: number | string;
  height?: number | string;
  active: boolean;
  maximized: boolean;
  children: ReactNode;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onMove: (x: number, y: number) => void;
};

const isChromeButton = (target: EventTarget | null) =>
  target instanceof HTMLElement && Boolean(target.closest('button'));

export const OsWindow = ({
  title,
  x,
  y,
  z,
  width = 520,
  height = 360,
  active,
  maximized,
  children,
  onFocus,
  onClose,
  onMinimize,
  onMaximize,
  onMove,
}: OsWindowProps) => {
  const drag = useRef<{ dx: number; dy: number } | null>(null);

  const handleTitleDown = (event: PointerEvent<HTMLDivElement>) => {
    if (isChromeButton(event.target)) {
      return;
    }
    onFocus();
    if (maximized) {
      return;
    }
    drag.current = { dx: event.clientX - x, dy: event.clientY - y };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleTitleMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current || maximized) {
      return;
    }
    onMove(event.clientX - drag.current.dx, event.clientY - drag.current.dy);
  };

  const handleTitleUp = () => {
    drag.current = null;
  };

  const handleTitleDoubleClick = () => {
    onMaximize();
  };

  const runChromeAction = (action: () => void) => (event: PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    drag.current = null;
    action();
  };

  const handleChromeKeyDown = (action: () => void) => (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    drag.current = null;
    action();
  };

  return (
    <article
      className={`flex flex-col border border-[#5ad8ff]/40 bg-[#0c1224] shadow-[0_0_24px_rgba(90,216,255,0.16)] ${maximized ? 'pointer-events-auto inset-0' : 'absolute'}`}
      style={
        maximized
          ? { position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: z }
          : { position: 'absolute', left: x, top: y, zIndex: 30 + z, width, height }
      }
      onMouseDown={onFocus}
    >
      <div
        role='toolbar'
        aria-label='Window title bar'
        className={`flex h-7 items-center justify-between px-1 ${maximized ? 'cursor-default' : 'cursor-grab'} ${active ? 'bg-gradient-to-r from-[#14304a] to-[#3a2468]' : 'bg-[#161b2c]'}`}
        onPointerDown={handleTitleDown}
        onPointerMove={handleTitleMove}
        onPointerUp={handleTitleUp}
        onDoubleClick={handleTitleDoubleClick}
      >
        <h2 className='truncate px-2 font-mono text-[13px] font-bold tracking-wide text-[#d8f4ff]'>{title}</h2>
        <div className='flex gap-0.5'>
          <button
            type='button'
            aria-label='Minimize window'
            tabIndex={0}
            onPointerDown={runChromeAction(onMinimize)}
            onKeyDown={handleChromeKeyDown(onMinimize)}
            className='h-5 w-5 border border-[#5ad8ff]/40 bg-[#101828] text-[11px] leading-none text-[#5ad8ff]'
          >
            _
          </button>
          <button
            type='button'
            aria-label={maximized ? 'Restore window' : 'Maximize window'}
            tabIndex={0}
            onPointerDown={runChromeAction(onMaximize)}
            onKeyDown={handleChromeKeyDown(onMaximize)}
            className='h-5 w-5 border border-[#5ad8ff]/40 bg-[#101828] text-[11px] leading-none text-[#5ad8ff]'
          >
            {maximized ? '❐' : '□'}
          </button>
          <button
            type='button'
            aria-label='Close window'
            tabIndex={0}
            onPointerDown={runChromeAction(onClose)}
            onKeyDown={handleChromeKeyDown(onClose)}
            className='h-5 w-5 border border-[#ff6ad5]/40 bg-[#101828] text-[11px] leading-none text-[#ff6ad5]'
          >
            x
          </button>
        </div>
      </div>
      <div className='min-h-0 flex-1 overflow-auto bg-[#070b18] p-3 font-mono text-[13px] text-[#d8f4ff]'>
        {children}
      </div>
    </article>
  );
};

export const APP_META: Record<OsAppId, { title: string; icon: string; label: string }> = {
  welcome: { title: 'Welcome - VOID OS', icon: '✦', label: 'Observatory' },
  about: { title: 'About Me', icon: '☽', label: 'About Me' },
  experience: { title: 'Experience', icon: '☄', label: 'Experience' },
  projects: { title: 'Projects', icon: '✧', label: 'Projects' },
  skills: { title: 'Skills', icon: '⬡', label: 'Skills' },
  contact: { title: 'Contact', icon: '◎', label: 'Contact' },
};
