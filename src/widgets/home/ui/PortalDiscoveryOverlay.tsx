'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  isCosmosAudioMuted,
  setCosmosAudioMuted,
  unlockCosmosAudio,
} from '@/widgets/home/lib/cosmos-audio';
import {
  COSMOS_PORTAL_HINT_KEY,
  getCosmosPortal,
  type CosmosPortalId,
} from '@/widgets/home/model/cosmos-portals';

type PortalDiscoveryOverlayProps = {
  activePortalId: CosmosPortalId | null;
};

export const PortalDiscoveryOverlay = ({ activePortalId }: PortalDiscoveryOverlayProps) => {
  const portal = getCosmosPortal(activePortalId);
  const [showHint, setShowHint] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const nextMuted = isCosmosAudioMuted() || window.localStorage.getItem('cosmos-audio-muted') === '1';
    setCosmosAudioMuted(nextMuted);
    setAudioMuted(nextMuted);
    if (sessionStorage.getItem(COSMOS_PORTAL_HINT_KEY) === '1') {
      return;
    }

    setShowHint(true);
    const timer = window.setTimeout(() => {
      sessionStorage.setItem(COSMOS_PORTAL_HINT_KEY, '1');
      setShowHint(false);
    }, 8000);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!activePortalId || typeof window === 'undefined') {
      return;
    }
    if (sessionStorage.getItem(COSMOS_PORTAL_HINT_KEY) === '1') {
      return;
    }
    sessionStorage.setItem(COSMOS_PORTAL_HINT_KEY, '1');
    setShowHint(false);
  }, [activePortalId]);

  const handleToggleMute = () => {
    void unlockCosmosAudio();
    const next = !audioMuted;
    setCosmosAudioMuted(next);
    setAudioMuted(next);
  };

  const accent = portal?.accent ?? '#7ec8ff';

  return (
    <div className='pointer-events-none absolute inset-x-0 bottom-0 z-20'>
      <button
        type='button'
        className='pointer-events-auto absolute bottom-4 right-4 z-30 rounded border border-white/20 bg-black/40 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-white/80 backdrop-blur-sm transition hover:bg-black/55 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70'
        style={{ fontFamily: 'var(--font-syne), sans-serif' }}
        onClick={handleToggleMute}
        aria-pressed={audioMuted}
        aria-label={audioMuted ? '사운드 켜기' : '사운드 끄기'}
      >
        {audioMuted ? 'Sound Off' : 'Sound On'}
      </button>
      {/* 하단 대기 베일 — 카드 박스 없이 씬에 녹임 */}
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 h-[42vh] transition-opacity duration-700 ${
          portal ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background:
            'linear-gradient(180deg, rgba(2,4,10,0) 0%, rgba(2,6,14,0.35) 38%, rgba(1,4,12,0.78) 72%, rgba(0,2,8,0.92) 100%)',
        }}
        aria-hidden
      />

      <div className='relative flex flex-col items-center px-5 pb-10 pt-16 md:pb-12'>
        <div
          className={`mb-6 text-center transition-opacity duration-500 ${
            showHint && !portal ? 'opacity-70' : 'opacity-0'
          }`}
          aria-hidden={!(showHint && !portal)}
        >
          <p
            className='text-[13px] tracking-[0.22em] text-white/65'
            style={{ fontFamily: 'var(--font-syne), sans-serif' }}
          >
            WASD로 걸어 포털을 발견하세요
          </p>
        </div>

        <p className='sr-only' aria-live='polite'>
          {portal ? `${portal.label} 포털을 발견했습니다.` : ''}
        </p>

        <div
          className={`flex w-full max-w-xl flex-col items-center text-center transition-all duration-700 ${
            portal ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'
          }`}
          aria-hidden={!portal}
        >
          {portal ? (
            <>
              <p
                className='text-[11px] uppercase tracking-[0.42em] text-white/70'
                style={{ fontFamily: 'var(--font-syne), sans-serif' }}
              >
                Portal
              </p>

              <div
                className='relative mt-3 mb-4 h-px w-[min(72vw,22rem)]'
                style={{
                  background: `linear-gradient(90deg, transparent 0%, ${accent} 45%, ${accent} 55%, transparent 100%)`,
                  boxShadow: `0 0 18px ${accent}, 0 0 36px ${accent}88`,
                }}
              >
                <span
                  className='absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full'
                  style={{
                    background: accent,
                    boxShadow: `0 0 12px ${accent}, 0 0 28px ${accent}`,
                  }}
                />
              </div>

              <h2
                className='text-5xl font-semibold tracking-tight md:text-6xl'
                style={{
                  fontFamily: 'var(--font-syne), sans-serif',
                  color: accent,
                  textShadow: `0 0 24px ${accent}aa, 0 0 48px ${accent}55`,
                }}
              >
                {portal.label}
              </h2>

              <p
                className='mt-3 max-w-md text-[15px] leading-relaxed text-white/75 md:text-base'
                style={{ fontFamily: 'var(--font-syne), sans-serif' }}
              >
                {portal.description}
              </p>

              <Link
                href={portal.href}
                className='pointer-events-auto mt-7 inline-flex min-w-[10.5rem] items-center justify-center border px-7 py-2.5 text-[13px] uppercase tracking-[0.2em] transition-all duration-300 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4'
                style={{
                  fontFamily: 'var(--font-syne), sans-serif',
                  color: accent,
                  borderColor: `${accent}99`,
                  boxShadow: `0 0 0 1px ${accent}22, 0 0 28px ${accent}22`,
                }}
                aria-label={`${portal.label}: ${portal.cta}`}
              >
                {portal.cta}
              </Link>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
