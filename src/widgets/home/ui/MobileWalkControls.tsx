'use client';

import { useEffect, useRef, useState } from 'react';
import { useViewportProfile } from '@/shared/hooks/use-viewport-profile';
import { clearCosmosTouchMove, setCosmosTouchMove } from '@/widgets/home/lib/cosmos-move-input';

const DEAD_ZONE = 10;
const MAX_RADIUS = 52;

export const MobileWalkControls = () => {
  const { isMobile, coarsePointer } = useViewportProfile();
  const [active, setActive] = useState(false);
  const originRef = useRef({ x: 0, y: 0 });
  const pointerIdRef = useRef<number | null>(null);
  const knobRef = useRef({ x: 0, y: 0 });

  const show = isMobile || coarsePointer;

  useEffect(() => {
    if (!show) {
      clearCosmosTouchMove();
    }
  }, [show]);

  if (!show) {
    return null;
  }

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current != null) {
      return;
    }
    pointerIdRef.current = event.pointerId;
    originRef.current = { x: event.clientX, y: event.clientY };
    knobRef.current = { x: 0, y: 0 };
    setActive(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== event.pointerId) {
      return;
    }

    const dx = event.clientX - originRef.current.x;
    const dy = event.clientY - originRef.current.y;
    const distance = Math.hypot(dx, dy);

    if (distance < DEAD_ZONE) {
      knobRef.current = { x: 0, y: 0 };
      clearCosmosTouchMove();
      event.currentTarget.style.setProperty('--knob-x', '0px');
      event.currentTarget.style.setProperty('--knob-y', '0px');
      return;
    }

    const clamped = Math.min(distance, MAX_RADIUS);
    const nx = (dx / distance) * clamped;
    const ny = (dy / distance) * clamped;
    knobRef.current = { x: nx, y: ny };

    const moveX = nx / MAX_RADIUS;
    const moveZ = -ny / MAX_RADIUS;
    setCosmosTouchMove(moveX, moveZ);

    event.currentTarget.style.setProperty('--knob-x', `${nx}px`);
    event.currentTarget.style.setProperty('--knob-y', `${ny}px`);
  };

  const handlePointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== event.pointerId) {
      return;
    }
    pointerIdRef.current = null;
    setActive(false);
    clearCosmosTouchMove();
    event.currentTarget.style.setProperty('--knob-x', '0px');
    event.currentTarget.style.setProperty('--knob-y', '0px');
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return (
    <div
      className='pointer-events-auto fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-4 z-30 touch-none select-none sm:bottom-8 sm:right-6'
      aria-hidden={!active}
    >
      <div
        role='presentation'
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        className='relative flex h-28 w-28 items-center justify-center rounded-full border border-white/20 bg-black/35 backdrop-blur-sm [--knob-x:0px] [--knob-y:0px]'
      >
        <span className='pointer-events-none absolute h-12 w-12 translate-x-[var(--knob-x)] translate-y-[var(--knob-y)] rounded-full border border-white/35 bg-white/15 shadow-[0_0_16px_rgba(126,200,255,0.25)] transition-[box-shadow] duration-150' />
      </div>
      <p className='mt-2 text-center text-[10px] uppercase tracking-[0.2em] text-white/55'>Move</p>
    </div>
  );
};
