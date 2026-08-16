'use client';

import { type KeyboardEvent, useEffect, useRef, useState } from 'react';

const RESOURCE_NAMES = [
  'stellar_chart',
  'observatory_hull',
  'monitor_veil',
  'void_atmosphere',
  'harmonic_field',
  'showcase_ui',
];

type BiosLoadingScreenProps = {
  progress: number;
  onStart: () => void;
};

const padName = (name: string) => `${name}${' '.repeat(Math.max(0, 22 - name.length))}`;

const formatDate = () => {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${month}/${day}/${date.getFullYear()}`;
};

export const BiosLoadingScreen = ({ progress, onStart }: BiosLoadingScreenProps) => {
  const [visibleBios, setVisibleBios] = useState(false);
  const [lines, setLines] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [overlayOpacity, setOverlayOpacity] = useState(1);
  const [textOpacity, setTextOpacity] = useState(1);
  const [startOpacity, setStartOpacity] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const progressRef = useRef(progress);
  progressRef.current = progress;

  useEffect(() => {
    const syncMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    syncMobile();
    window.addEventListener('resize', syncMobile);
    const biosTimer = window.setTimeout(() => setVisibleBios(true), 180);
    return () => {
      window.removeEventListener('resize', syncMobile);
      window.clearTimeout(biosTimer);
    };
  }, []);

  useEffect(() => {
    if (!visibleBios) {
      return;
    }

    let index = 0;
    const timer = window.setInterval(() => {
      const ratio = Math.min(1, Math.max(progressRef.current / 100, (index + 1) / RESOURCE_NAMES.length));
      const name = RESOURCE_NAMES[Math.min(index, RESOURCE_NAMES.length - 1)];
      if (!name) {
        return;
      }
      setLines((prev) => {
        const next = [...prev, `Linked ${padName(name)} ... ${Math.round(ratio * 100)}%`];
        return next.slice(-8);
      });
      index += 1;
      if (index >= RESOURCE_NAMES.length) {
        window.clearInterval(timer);
        if (progressRef.current >= 100) {
          setReady(true);
        }
      }
    }, 220);

    return () => window.clearInterval(timer);
  }, [visibleBios]);

  useEffect(() => {
    if (progress < 100 || lines.length < RESOURCE_NAMES.length) {
      return;
    }
    setReady(true);
  }, [progress, lines.length]);

  useEffect(() => {
    if (!ready) {
      return;
    }
    const hideText = window.setTimeout(() => {
      setTextOpacity(0);
      window.setTimeout(() => setStartOpacity(1), 420);
    }, 700);
    return () => window.clearTimeout(hideText);
  }, [ready]);

  const handleStart = () => {
    setOverlayOpacity(0);
    window.setTimeout(onStart, 220);
  };

  const handleStartKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleStart();
    }
  };

  return (
    <div
      className='void-scanlines absolute inset-0 z-50 box-border flex flex-col bg-[#02010a] font-mono text-[13px] tracking-[0.14em] text-[#c8ecff] transition-opacity duration-200 md:text-base'
      style={{ opacity: overlayOpacity }}
    >
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(90,60,180,0.22),transparent_58%)]' />
      <div className='flex h-full flex-col justify-between' style={{ opacity: textOpacity }}>
        <div className='relative flex flex-col p-4 md:p-12'>
          <div className='flex flex-row'>
            <div className='flex flex-col'>
              <p>AYAAN OBSERVATORY</p>
              <p>Epoch: 08/16/2026</p>
              <p>VOID KERNEL (C)2026 Ayaan Inc.,</p>
            </div>
            <div className='ml-8 text-[#7aa0c0] md:ml-16'>
              <p>AYS S13 2000-2026 Special UC131S</p>
            </div>
          </div>

          {visibleBios && (
            <div className='mt-6'>
              <p>Stellar Showcase(tm) XX 113</p>
              <p>Checking RAM : 16000 OK</p>
              <p className='mt-4 text-[#5ad8ff]'>
                {lines.length > 0 ? (
                  ready ? (
                    'SIGNAL LOCKED — RESOURCES ALIGNED'
                  ) : (
                    <span className='after:inline-block after:w-[3ch] after:animate-pulse after:content-["..."]'>
                      ALIGNING RESOURCES ({Math.min(lines.length, RESOURCE_NAMES.length)}/{RESOURCE_NAMES.length})
                    </span>
                  )
                ) : (
                  'WAIT'
                )}
              </p>
              <div className='mt-4 flex flex-col pl-8 text-[#9ad4ff]'>
                {lines.map((line) => (
                  <p key={line} className='whitespace-pre'>
                    {line}
                  </p>
                ))}
              </div>
              {ready && (
                <p className='mt-4'>
                  All Content Loaded, launching <span className='text-[#7affc4]'>'Ayaan Portfolio Showcase'</span> V1.0
                </p>
              )}
            </div>
          )}
        </div>

        <div className='relative p-4 text-[#7aa0c0] md:p-12 md:pb-16'>
          <p>Press DEL to enter SETUP , ESC to skip memory test</p>
          <p>{formatDate()}</p>
        </div>
      </div>

      <p className='pointer-events-none absolute bottom-4 left-4 text-[#7aa0c0] md:bottom-8 md:left-12'>
        Ayaan Portfolio Showcase 2026
        {isMobile && (
          <span className='mt-2 block text-[#ffd28a]'>
            WARNING: This experience is best viewed on a desktop or laptop computer.
          </span>
        )}
      </p>

      <div
        className='absolute inset-0 flex items-center justify-center transition-opacity duration-300'
        style={{ opacity: startOpacity, pointerEvents: startOpacity > 0 ? 'auto' : 'none' }}
      >
        <div className='flex max-w-[500px] flex-col border-[7px] border-[#5ad8ff] bg-[#02010a]/90 p-6 shadow-[0_0_40px_rgba(90,216,255,0.35)]'>
          <p className='flex items-end text-[#d8f4ff]'>
            Click start to begin
            <span className='ml-2 mb-0.5 inline-block h-[0.15em] w-[0.8em] animate-pulse bg-[#5ad8ff]' />
          </p>
          <button
            type='button'
            aria-label='Start portfolio showcase'
            tabIndex={0}
            onClick={handleStart}
            onKeyDown={handleStartKeyDown}
            className='bios-start mt-6 self-start border-[4px] border-[#5ad8ff] bg-transparent px-3 py-2 text-[#5ad8ff] hover:bg-[#5ad8ff] hover:text-[#02010a]'
          >
            START
          </button>
        </div>
      </div>
    </div>
  );
};
