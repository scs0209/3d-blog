'use client';

import { useEffect, useId, useRef, useState } from 'react';

const HUD_PANEL =
  'border border-[#5ad8ff]/35 bg-[#050814]/80 text-[#d8f4ff] shadow-[0_0_18px_rgba(90,216,255,0.18)]';

const SITE_LINKS = [
  { href: '/', label: 'Home', ariaLabel: '홈으로 이동' },
  { href: '/blog', label: 'Blog', ariaLabel: '블로그로 이동' },
] as const;

type DeskSiteNavProps = {
  muted: boolean;
  onMuteChange: (muted: boolean) => void;
  onNavigate: (href: string) => void;
  showSound?: boolean;
  className?: string;
};

export const DeskSiteNav = ({
  muted,
  onMuteChange,
  onNavigate,
  showSound = true,
  className = '',
}: DeskSiteNavProps) => {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target;
      if (!(target instanceof Node) || !rootRef.current?.contains(target)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const handleMute = () => {
    onMuteChange(!muted);
  };

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  const handleNavigate = (href: string) => {
    setOpen(false);
    onNavigate(href);
  };

  return (
    <div ref={rootRef} className={`relative flex items-center gap-1 font-mono text-xs tracking-[0.12em] sm:text-sm ${className}`}>
      {showSound && (
        <button
          type='button'
          aria-label={muted ? '사운드 켜기' : '사운드 끄기'}
          tabIndex={0}
          onClick={handleMute}
          className={`pointer-events-auto px-3 py-1 ${HUD_PANEL} hover:bg-[#5ad8ff] hover:text-[#02010a]`}
        >
          {muted ? 'MUTED' : 'AUDIO'}
        </button>
      )}

      <button
        type='button'
        aria-label={open ? '사이트 메뉴 닫기' : '사이트 메뉴 열기'}
        aria-expanded={open}
        aria-controls={menuId}
        tabIndex={0}
        onClick={handleToggle}
        className={`pointer-events-auto px-3 py-1 ${HUD_PANEL} hover:bg-[#5ad8ff] hover:text-[#02010a]`}
      >
        MENU
      </button>

      {open && (
        <div
          id={menuId}
          role='menu'
          className={`absolute top-full right-0 mt-1 min-w-[8.5rem] overflow-hidden ${HUD_PANEL}`}
        >
          {SITE_LINKS.map((link) => (
            <button
              key={link.href}
              type='button'
              role='menuitem'
              aria-label={link.ariaLabel}
              tabIndex={0}
              onClick={() => handleNavigate(link.href)}
              className='pointer-events-auto block w-full px-3 py-2 text-left hover:bg-[#5ad8ff] hover:text-[#02010a]'
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const DESK_OS_SITE_LINKS = [
  { href: '/', label: 'Observatory' },
  { href: '/blog', label: 'Blog Relay' },
] as const;
