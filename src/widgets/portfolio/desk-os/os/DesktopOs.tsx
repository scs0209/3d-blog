'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { OsAppId, OsWindowState } from '../types';
import { OsAppContent } from './OsAppContent';
import { APP_META, OsWindow } from './OsWindow';

const ICONS: OsAppId[] = ['welcome', 'about', 'experience', 'projects', 'skills', 'contact'];

type DesktopOsProps = {
  interactive: boolean;
  compact?: boolean;
};

const OVERLAY_ID = 'desk-os-overlay';

const createWindow = (id: OsAppId, z: number, compact: boolean): OsWindowState => ({
  id,
  x: compact ? 28 + z * 10 : 140 + z * 22,
  y: compact ? 18 + z * 10 : 28 + z * 18,
  z,
  minimized: false,
  maximized: false,
});

export const DesktopOs = ({ interactive, compact = false }: DesktopOsProps) => {
  const [windows, setWindows] = useState<OsWindowState[]>([createWindow('welcome', 1, compact)]);
  const [startOpen, setStartOpen] = useState(false);
  const [zCounter, setZCounter] = useState(2);
  const [clock, setClock] = useState(() => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [overlayHost, setOverlayHost] = useState<HTMLElement | null>(null);
  const windowsRef = useRef(windows);
  windowsRef.current = windows;

  useEffect(() => {
    setOverlayHost(document.getElementById(OVERLAY_ID));
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setClock(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const handleOpen = (id: OsAppId) => {
    setStartOpen(false);
    setWindows((prev) => {
      const existing = prev.find((item) => item.id === id);
      const nextZ = zCounter + 1;
      setZCounter(nextZ);
      if (existing) {
        return prev.map((item) => (item.id === id ? { ...item, minimized: false, z: nextZ } : item));
      }
      return [...prev, createWindow(id, nextZ, compact)];
    });
  };

  const handleIconActivate = (id: OsAppId) => {
    if (!interactive) {
      return;
    }
    handleOpen(id);
  };

  const handleFocus = (id: OsAppId) => {
    const nextZ = zCounter + 1;
    setZCounter(nextZ);
    setWindows((prev) => prev.map((item) => (item.id === id ? { ...item, z: nextZ } : item)));
  };

  const handleClose = (id: OsAppId) => {
    setWindows((prev) => prev.filter((item) => item.id !== id));
  };

  const handleMinimize = (id: OsAppId) => {
    setWindows((prev) => prev.map((item) => (item.id === id ? { ...item, minimized: true } : item)));
  };

  const handleMaximize = (id: OsAppId) => {
    const nextZ = zCounter + 1;
    setZCounter(nextZ);
    setWindows((prev) =>
      prev.map((item) => (item.id === id ? { ...item, minimized: false, maximized: !item.maximized, z: nextZ } : item)),
    );
  };

  const handleMove = (id: OsAppId, x: number, y: number) => {
    setWindows((prev) => prev.map((item) => (item.id === id && !item.maximized ? { ...item, x, y } : item)));
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return;
      }
      const maximized = windowsRef.current.find((item) => item.maximized && !item.minimized);
      if (!maximized) {
        return;
      }
      event.preventDefault();
      event.stopImmediatePropagation();
      setWindows((prev) => prev.map((item) => (item.id === maximized.id ? { ...item, maximized: false } : item)));
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, []);

  const handleToggleStart = () => {
    if (!interactive) {
      return;
    }
    setStartOpen((open) => !open);
  };

  const activeId = windows.reduce<OsAppId | null>((current, item) => {
    if (item.minimized) {
      return current;
    }
    const currentWindow = windows.find((entry) => entry.id === current);
    if (!currentWindow || item.z > currentWindow.z) {
      return item.id;
    }
    return current;
  }, null);

  const desktopW = compact ? 512 : 1280;
  const desktopH = compact ? 288 : 720;
  const restoredW = compact ? 340 : 780;
  const restoredH = compact ? 210 : 500;

  const renderWindow = (item: OsWindowState) => (
    <OsWindow
      key={item.id}
      title={APP_META[item.id].title}
      x={item.x}
      y={item.y}
      z={item.z}
      width={item.maximized ? '100%' : restoredW}
      height={item.maximized ? '100%' : restoredH}
      active={item.id === activeId}
      maximized={item.maximized}
      onFocus={() => handleFocus(item.id)}
      onClose={() => handleClose(item.id)}
      onMinimize={() => handleMinimize(item.id)}
      onMaximize={() => handleMaximize(item.id)}
      onMove={(x, y) => handleMove(item.id, x, y)}
    >
      <OsAppContent id={item.id} />
    </OsWindow>
  );

  return (
    <div
      className='void-os-desktop relative h-full w-full overflow-hidden select-none'
      style={{
        width: desktopW,
        height: desktopH,
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        pointerEvents: interactive ? 'auto' : 'none',
        cursor: 'default',
      }}
    >
      <div className={`absolute top-5 left-4 flex flex-col ${compact ? 'gap-3' : 'gap-5'}`}>
        {ICONS.map((id) => (
          <button
            key={id}
            type='button'
            aria-label={APP_META[id].label}
            tabIndex={0}
            onDoubleClick={() => handleIconActivate(id)}
            onClick={() => handleIconActivate(id)}
            className={`flex flex-col items-center gap-1 text-center text-[#d8f4ff] ${compact ? 'w-[64px] text-[10px]' : 'w-[92px] text-[13px]'}`}
          >
            <span
              className={`flex items-center justify-center border border-[#5ad8ff]/50 bg-[#5ad8ff]/10 shadow-[0_0_12px_rgba(90,216,255,0.25)] ${compact ? 'h-10 w-10 text-lg' : 'h-12 w-12 text-xl'}`}
            >
              {APP_META[id].icon}
            </span>
            {APP_META[id].label}
          </button>
        ))}
      </div>

      {!compact ? (
        <aside
          className='pointer-events-none absolute top-5 right-5 z-[5] flex w-[280px] flex-col gap-3 border border-[#5ad8ff]/30 bg-[#070b18]/88 p-3 shadow-[0_0_24px_rgba(90,216,255,0.12)]'
          aria-label='Station status'
        >
          <p className='text-[11px] tracking-[0.18em] text-[#5ad8ff]'>STATION / LINK</p>
          <p className='font-mono text-3xl text-[#d8f4ff]'>{clock}</p>
          <div className='space-y-2 text-[12px] text-[#9ec4dc]'>
            <p>SIGNAL ████████░░ 82%</p>
            <p>CORE&nbsp;&nbsp; ██████████ 96%</p>
            <p>UPLINK ██████░░░░ 61%</p>
          </div>
          <div className='border-t border-[#5ad8ff]/20 pt-2 font-mono text-[11px] leading-5 text-[#7aa0c0]'>
            <p>&gt; display locked to viewport</p>
            <p>&gt; await operator input</p>
            <p>&gt; esc returns to observatory</p>
          </div>
        </aside>
      ) : null}

      {windows.filter((item) => !item.minimized && !item.maximized).map((item) => renderWindow(item))}
      {overlayHost
        ? windows
            .filter((item) => item.maximized && !item.minimized)
            .map((item) => createPortal(renderWindow(item), overlayHost, item.id))
        : null}

      {startOpen && (
        <div
          className={`absolute bottom-8 left-0 z-[80] flex border border-[#5ad8ff]/40 bg-[#0a1020]/95 ${compact ? 'h-[170px] w-[170px]' : 'h-[280px] w-[220px]'}`}
        >
          <div className='flex w-8 items-end bg-gradient-to-b from-[#5ad8ff] to-[#7a5ac8] pb-3'>
            <span className='origin-bottom-left -rotate-90 whitespace-nowrap pl-2 text-xs font-bold text-[#02010a]'>
              VOID OS
            </span>
          </div>
          <ul className='flex-1 py-1'>
            {ICONS.map((id) => (
              <li key={id}>
                <button
                  type='button'
                  aria-label={`Open ${APP_META[id].label}`}
                  tabIndex={0}
                  onClick={() => handleOpen(id)}
                  className='flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] text-[#d8f4ff] hover:bg-[#5ad8ff]/20 hover:text-[#5ad8ff]'
                >
                  <span>{APP_META[id].icon}</span>
                  {APP_META[id].label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className='absolute right-0 bottom-0 left-0 z-[90] flex h-10 items-center justify-between border-t border-[#5ad8ff]/35 bg-[#070b18]/95 px-1'>
        <button
          type='button'
          aria-label='Start menu'
          tabIndex={0}
          onClick={handleToggleStart}
          className='flex h-8 items-center gap-1 border border-[#5ad8ff]/50 bg-[#5ad8ff]/10 px-3 text-[13px] font-bold text-[#5ad8ff] hover:bg-[#5ad8ff] hover:text-[#02010a]'
        >
          Start
        </button>
        <div className='flex items-center gap-1'>
          {windows.map((item) => (
            <button
              key={item.id}
              type='button'
              aria-label={`Focus ${APP_META[item.id].title}`}
              tabIndex={0}
              onClick={() => handleOpen(item.id)}
              className='h-8 max-w-[140px] truncate border border-[#5ad8ff]/25 bg-[#101828] px-2 text-left text-[12px] text-[#d8f4ff]'
            >
              {APP_META[item.id].label}
            </button>
          ))}
          <div className='ml-2 border border-[#5ad8ff]/25 bg-[#101828] px-3 py-1 text-[12px] text-[#5ad8ff]'>
            {clock}
          </div>
        </div>
      </div>
    </div>
  );
};
