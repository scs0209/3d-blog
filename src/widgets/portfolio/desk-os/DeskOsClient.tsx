'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { BiosLoadingScreen } from './BiosLoadingScreen';
import { DeskDeskChrome } from './DeskDeskChrome';
import { DeskHud } from './DeskHud';
import { DeskMonitorChrome } from './DeskMonitorChrome';
import { DESK_EXIT, type DeskExitState } from './desk-exit';
import { playDeskMouseClick, setDeskAudioMuted, setDeskTypingEnabled, startDeskAudio, stopDeskAudio } from './desk-audio';
import type { DeskCameraMode } from './types';

const DeskCanvas = dynamic(() => import('./DeskCanvas').then((mod) => mod.DeskCanvas), {
  ssr: false,
});

export const DeskOsClient = () => {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [begun, setBegun] = useState(false);
  const [mode, setMode] = useState<DeskCameraMode>('idle');
  const [freeCam, setFreeCam] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [exit, setExit] = useState<DeskExitState | null>(null);
  const skipToggleRef = useRef(false);
  const exitFrameRef = useRef<number | null>(null);

  const handleProgress = useCallback((next: number) => {
    setProgress((current) => Math.max(current, next));
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setProgress((current) => Math.max(current, 100));
    }, 2400);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    return () => {
      if (exitFrameRef.current !== null) {
        cancelAnimationFrame(exitFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && mode === 'monitor') {
        setMode('desk');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode]);

  useEffect(() => {
    if (!started || freeCam || mode === 'monitor' || exit) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if ((event.target as HTMLElement | null)?.closest('#desk-hud, #computer-screen, #desk-os-overlay, #desk-monitor-chrome, #desk-desk-chrome')) {
        return;
      }
      if (skipToggleRef.current) {
        skipToggleRef.current = false;
        return;
      }
      setBegun(true);
      setMode((current) => (current === 'idle' ? 'desk' : 'idle'));
    };

    window.addEventListener('pointerdown', handlePointerDown);
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, [started, freeCam, mode, exit]);

  const handleStart = () => {
    setStarted(true);
    void startDeskAudio();
  };

  useEffect(() => {
    return () => {
      stopDeskAudio();
    };
  }, []);

  useEffect(() => {
    setDeskAudioMuted(muted);
  }, [muted]);

  useEffect(() => {
    setDeskTypingEnabled(started && !muted && mode !== 'monitor' && !exit);
  }, [started, muted, mode, exit]);

  useEffect(() => {
    if (mode !== 'monitor' || muted) {
      return;
    }
    const handleMonitorClick = (event: PointerEvent) => {
      if ((event.target as HTMLElement | null)?.closest('#desk-hud, #desk-monitor-chrome')) {
        return;
      }
      playDeskMouseClick();
    };
    window.addEventListener('pointerdown', handleMonitorClick);
    return () => window.removeEventListener('pointerdown', handleMonitorClick);
  }, [mode, muted]);

  const handleModeChange = (next: DeskCameraMode) => {
    if (next === 'desk' || next === 'monitor') {
      setBegun(true);
    }
    if (next === 'monitor') {
      skipToggleRef.current = true;
      setFreeCam(false);
    }
    setMode(next);
  };

  const handleNavigate = useCallback(
    (href: string) => {
      if (exit) {
        return;
      }
      if (mode === 'monitor' || !started) {
        router.push(href);
        return;
      }

      setBegun(true);
      setMode('desk');
      setFreeCam(false);
      setExit({ href, progress: 0 });
      const startedAt = performance.now();

      const step = (now: number) => {
        const progressValue = Math.min(1, (now - startedAt) / DESK_EXIT.durationMs);
        setExit({ href, progress: progressValue });
        if (progressValue < 1) {
          exitFrameRef.current = requestAnimationFrame(step);
          return;
        }
        // progress=1 유지 — setExit(null)하면 앉은 자리로 스냅되어 뒤로 튀어 보임
        setExit({ href, progress: 1 });
        router.push(href);
      };

      exitFrameRef.current = requestAnimationFrame(step);
    },
    [exit, mode, router, started],
  );

  const handleMuteChange = (next: boolean) => {
    setMuted(next);
  };

  const handleFreeCamChange = (next: boolean) => {
    setFreeCam(next);
    if (next) {
      setBegun(true);
    }
  };

  const handleLeaveMonitor = () => {
    setMode('desk');
  };

  const exitFade =
    exit && exit.progress > DESK_EXIT.fadeStart
      ? (exit.progress - DESK_EXIT.fadeStart) / (1 - DESK_EXIT.fadeStart)
      : 0;

  return (
    <div className='relative h-screen w-screen overflow-hidden bg-[#02010a] text-[#d8f4ff]' style={{ cursor: 'auto' }}>
      <DeskCanvas
        mode={mode}
        started={started}
        freeCam={freeCam}
        exiting={Boolean(exit)}
        exitProgress={exit?.progress ?? 0}
        onProgress={handleProgress}
        onModeChange={handleModeChange}
        onNavigate={handleNavigate}
      />
      {!started && <BiosLoadingScreen progress={progress} onStart={handleStart} />}
      {started && mode !== 'monitor' && !exit && (
        <>
          <DeskDeskChrome
            muted={muted}
            onMuteChange={handleMuteChange}
            onNavigate={handleNavigate}
            showSound={!begun}
          />
          <DeskHud
            showHelp={!begun && !freeCam}
            showInfo={begun}
            muted={muted}
            freeCam={freeCam}
            onMuteChange={handleMuteChange}
            onFreeCamChange={handleFreeCamChange}
          />
        </>
      )}
      {started && mode === 'monitor' && !exit && (
        <DeskMonitorChrome
          muted={muted}
          onMuteChange={handleMuteChange}
          onNavigate={handleNavigate}
          onLeaveMonitor={handleLeaveMonitor}
        />
      )}
      {exit ? (
        <div
          className='pointer-events-none absolute inset-0 z-[80] transition-opacity duration-200'
          style={{
            background: `linear-gradient(180deg, rgba(255,255,255,${exitFade * 0.15}) 0%, rgba(255,255,255,${exitFade * 0.92}) 100%)`,
            opacity: exitFade > 0 ? 1 : 0,
          }}
          aria-hidden
        />
      ) : null}
      <div id='desk-os-overlay' className='pointer-events-none absolute inset-0 z-[70]' />
    </div>
  );
};
