'use client';

import { useEffect, useRef, useState } from 'react';

type DeskHudProps = {
  showHelp: boolean;
  showInfo: boolean;
  muted: boolean;
  freeCam: boolean;
  onMuteChange: (muted: boolean) => void;
  onFreeCamChange: (freeCam: boolean) => void;
};

const HELP_TEXT = 'Click anywhere to begin';
const NAME_TEXT = 'Ayaan';
const TITLE_TEXT = 'Frontend Developer';

const HUD_PANEL =
  'border border-[#5ad8ff]/35 bg-[#050814]/80 px-4 py-1 text-[#d8f4ff] shadow-[0_0_18px_rgba(90,216,255,0.18)]';

const typeLine = (text: string, setText: (value: string) => void, onDone: () => void, delay = 70) => {
  let index = 0;
  let current = '';
  const tick = () => {
    if (index >= text.length) {
      onDone();
      return;
    }
    current += text[index];
    setText(current);
    index += 1;
    window.setTimeout(tick, Math.random() * delay + delay * 0.6);
  };
  window.setTimeout(tick, 80);
};

export const DeskHud = ({ showHelp, showInfo, muted, freeCam, onMuteChange, onFreeCamChange }: DeskHudProps) => {
  const [helpText, setHelpText] = useState('');
  const [nameText, setNameText] = useState('');
  const [titleText, setTitleText] = useState('');
  const [timeText, setTimeText] = useState('');
  const [time, setTime] = useState(() => new Date().toLocaleTimeString());
  const [togglesReady, setTogglesReady] = useState(false);
  const helpVisible = useRef(showHelp);

  useEffect(() => {
    helpVisible.current = showHelp;
    if (!showHelp) {
      return;
    }
    setHelpText('');
    typeLine(HELP_TEXT, setHelpText, () => undefined, 90);
  }, [showHelp]);

  useEffect(() => {
    if (!showInfo || nameText) {
      return;
    }
    typeLine(
      NAME_TEXT,
      setNameText,
      () => {
        typeLine(
          TITLE_TEXT,
          setTitleText,
          () => {
            typeLine(
              new Date().toLocaleTimeString(),
              setTimeText,
              () => {
                setTogglesReady(true);
              },
              45,
            );
          },
          50,
        );
      },
      55,
    );
  }, [showInfo, nameText]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (togglesReady) {
      setTimeText(time);
    }
  }, [time, togglesReady]);

  const handleMute = () => {
    onMuteChange(!muted);
  };

  const handleFreeCam = () => {
    onFreeCamChange(!freeCam);
  };

  return (
    <div
      id='desk-hud'
      className='pointer-events-none absolute inset-0 z-40 font-mono text-sm tracking-[0.12em] text-[#d8f4ff] md:text-base'
    >
      {showInfo && (
        <div className='absolute top-8 left-8 flex flex-col items-start md:top-16 md:left-16'>
          {nameText && (
            <p className={`mb-1 ${HUD_PANEL}`}>
              {nameText}
              {!titleText && <span className='ml-2 inline-block h-[0.15em] w-[0.8em] animate-pulse bg-[#5ad8ff]' />}
            </p>
          )}
          {titleText && (
            <p className={`mb-1 ${HUD_PANEL}`}>
              {titleText}
              {!timeText && <span className='ml-2 inline-block h-[0.15em] w-[0.8em] animate-pulse bg-[#5ad8ff]' />}
            </p>
          )}
          {timeText && (
            <div className='flex flex-row items-stretch'>
              <p className={HUD_PANEL}>{timeText}</p>
              {togglesReady && (
                <>
                  <button
                    type='button'
                    aria-label={muted ? 'Unmute' : 'Mute'}
                    tabIndex={0}
                    onClick={handleMute}
                    className={`pointer-events-auto ml-1 ${HUD_PANEL} hover:bg-[#5ad8ff] hover:text-[#02010a]`}
                  >
                    {muted ? 'MUTED' : 'AUDIO'}
                  </button>
                  <button
                    type='button'
                    aria-label={freeCam ? 'Disable free camera' : 'Enable free camera'}
                    tabIndex={0}
                    onClick={handleFreeCam}
                    className={`pointer-events-auto ml-1 ${HUD_PANEL} hover:bg-[#5ad8ff] hover:text-[#02010a]`}
                  >
                    {freeCam ? 'FREE CAM' : 'ORBIT'}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {showHelp && helpText && (
        <div className={`absolute bottom-16 left-1/2 flex -translate-x-1/2 items-end ${HUD_PANEL}`}>
          {helpText}
          <span className='ml-2 mb-0.5 inline-block h-[0.15em] w-[0.8em] animate-pulse bg-[#5ad8ff]' />
        </div>
      )}
    </div>
  );
};
