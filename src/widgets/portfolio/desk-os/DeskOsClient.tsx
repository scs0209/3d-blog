'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
import { BiosLoadingScreen } from './BiosLoadingScreen';
import { DeskHud } from './DeskHud';
import { playDeskMouseClick, setDeskAudioMuted, setDeskTypingEnabled, startDeskAudio, stopDeskAudio } from './desk-audio';
import type { DeskCameraMode } from './types';

const DeskCanvas = dynamic(() => import('./DeskCanvas').then((mod) => mod.DeskCanvas), {
  ssr: false,
});

export const DeskOsClient = () => {
  const [started, setStarted] = useState(false);
  const [begun, setBegun] = useState(false);
  const [mode, setMode] = useState<DeskCameraMode>('idle');
  const [freeCam, setFreeCam] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const skipToggleRef = useRef(false);

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
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && mode === 'monitor') {
        setMode('desk');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode]);

  useEffect(() => {
    if (!started || freeCam || mode === 'monitor') {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if ((event.target as HTMLElement | null)?.closest('#desk-hud, #computer-screen, #desk-os-overlay')) {
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
  }, [started, freeCam, mode]);

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
    setDeskTypingEnabled(started && !muted && mode !== 'monitor');
  }, [started, muted, mode]);

  useEffect(() => {
    if (mode !== 'monitor' || muted) {
      return;
    }
    const handleMonitorClick = (event: PointerEvent) => {
      if ((event.target as HTMLElement | null)?.closest('#desk-hud')) {
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

  const handleMuteChange = (next: boolean) => {
    setMuted(next);
  };

  const handleFreeCamChange = (next: boolean) => {
    setFreeCam(next);
    if (next) {
      setBegun(true);
    }
  };

  return (
    <div className='relative h-screen w-screen overflow-hidden bg-[#02010a] text-[#d8f4ff]' style={{ cursor: 'auto' }}>
      <DeskCanvas
        mode={mode}
        started={started}
        freeCam={freeCam}
        onProgress={handleProgress}
        onModeChange={handleModeChange}
      />
      {!started && <BiosLoadingScreen progress={progress} onStart={handleStart} />}
      {started && mode !== 'monitor' && (
        <DeskHud
          showHelp={!begun && !freeCam}
          showInfo={begun}
          muted={muted}
          freeCam={freeCam}
          onMuteChange={handleMuteChange}
          onFreeCamChange={handleFreeCamChange}
        />
      )}
      <div id='desk-os-overlay' className='pointer-events-none absolute inset-0 z-[70]' />
    </div>
  );
};
