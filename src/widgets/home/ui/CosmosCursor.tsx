'use client';

import { useEffect, useRef, useState } from 'react';

type CosmosCursorProps = {
  /** 활성 포털 accent — 기본은 따뜻한 주황 (씬 sun/neon 톤) */
  accent?: string;
};

const DEFAULT_ACCENT = '#ff9a3c';
const INTERACTIVE_SELECTOR =
  'button, a, input, textarea, select, [role="button"], [onclick], .cursor-pointer';

/**
 * 코스모스용 커스텀 커서.
 * 따뜻한 주황 레티클 — 게임 HUD 느낌 없이 탐험용 조준점.
 */
export const CosmosCursor = ({ accent = DEFAULT_ACCENT }: CosmosCursorProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -100, y: -100 });
  const targetRef = useRef({ x: -100, y: -100 });
  const hoverRef = useRef(false);
  const clickRef = useRef(false);
  const rafRef = useRef(0);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const finePointer = window.matchMedia('(pointer: fine)');
    const syncEnabled = () => {
      setEnabled(finePointer.matches);
    };
    syncEnabled();
    finePointer.addEventListener('change', syncEnabled);

    return () => {
      finePointer.removeEventListener('change', syncEnabled);
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    document.documentElement.classList.add('cosmos-cursor-active');

    const handleMove = (event: MouseEvent) => {
      targetRef.current.x = event.clientX;
      targetRef.current.y = event.clientY;
      if (rootRef.current) {
        rootRef.current.style.opacity = '1';
      }
    };

    const handleLeave = () => {
      if (rootRef.current) {
        rootRef.current.style.opacity = '0';
      }
    };

    const handleOver = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        hoverRef.current = false;
        return;
      }
      hoverRef.current = Boolean(target.closest(INTERACTIVE_SELECTOR));
    };

    const handleDown = () => {
      clickRef.current = true;
    };
    const handleUp = () => {
      clickRef.current = false;
    };

    const tick = () => {
      const pos = posRef.current;
      const target = targetRef.current;
      pos.x += (target.x - pos.x) * 0.28;
      pos.y += (target.y - pos.y) * 0.28;

      const root = rootRef.current;
      if (root) {
        root.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      }

      const hovering = hoverRef.current;
      const clicking = clickRef.current;
      const ringScale = clicking ? 0.72 : hovering ? 1.55 : 1;
      const coreScale = clicking ? 1.6 : hovering ? 0.55 : 1;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate(-50%, -50%) scale(${ringScale})`;
        ringRef.current.style.opacity = hovering ? '0.95' : '0.7';
      }
      if (coreRef.current) {
        coreRef.current.style.transform = `translate(-50%, -50%) scale(${coreScale})`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    window.addEventListener('mouseover', handleOver, { passive: true });
    window.addEventListener('mousedown', handleDown);
    window.addEventListener('mouseup', handleUp);
    document.documentElement.addEventListener('mouseleave', handleLeave);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      document.documentElement.classList.remove('cosmos-cursor-active');
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseover', handleOver);
      window.removeEventListener('mousedown', handleDown);
      window.removeEventListener('mouseup', handleUp);
      document.documentElement.removeEventListener('mouseleave', handleLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  return (
    <div
      ref={rootRef}
      className='pointer-events-none fixed left-0 top-0 z-[9998] opacity-0'
      style={{ willChange: 'transform' }}
      aria-hidden
    >
      <div
        ref={ringRef}
        className='absolute left-0 top-0 h-7 w-7 rounded-full transition-[transform,opacity] duration-200 ease-out'
        style={{
          transform: 'translate(-50%, -50%)',
          border: `1px solid ${accent}aa`,
          boxShadow: `
            0 0 10px ${accent}55,
            0 0 22px ${accent}28,
            inset 0 0 8px ${accent}18
          `,
        }}
      />

      <div
        className='absolute left-0 top-0 h-px w-8 -translate-x-1/2 -translate-y-1/2'
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}cc 28%, ${accent}ee 50%, ${accent}cc 72%, transparent)`,
          boxShadow: `0 0 6px ${accent}66`,
        }}
      />
      <div
        className='absolute left-0 top-0 h-8 w-px -translate-x-1/2 -translate-y-1/2'
        style={{
          background: `linear-gradient(180deg, transparent, ${accent}cc 28%, ${accent}ee 50%, ${accent}cc 72%, transparent)`,
          boxShadow: `0 0 6px ${accent}66`,
        }}
      />

      <div
        ref={coreRef}
        className='absolute left-0 top-0 h-1.5 w-1.5 rounded-full transition-transform duration-150 ease-out'
        style={{
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, #fff 0%, ${accent} 55%, transparent 100%)`,
          boxShadow: `0 0 8px ${accent}cc, 0 0 16px ${accent}66`,
        }}
      />
    </div>
  );
};
