'use client';

import { motion } from 'framer-motion';
import { GithubIcon, LinkedinIcon, Mail } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import type { FocusedGroup } from '@/entities/portfolio/model/types';
import type { OverlayKey, OverlayState } from '@/features/portfolio/model/use-overlay-state';
import { AnimatedLink } from './AnimatedLink';
import { AboutMePage } from './aboutMe/AboutMePage';
import { CyberpunkContactForm } from './CyberpunkContactForm';
import { ExperiencePage } from './experience/ExperiencePage';
import { LoadingProgressBar } from './LoadingProgressbar';
import { NeonToggle } from './NeonToggle';
import { OverlayShell } from './OverlayShell';
import { overlayStyles } from './overlayStyles';
import { ResumeConsoleOverlay } from './ResumeConsoleOverlay';
import { SkillsOverlay } from './skills/SkillsOverlay';

interface OverlayManagerProps {
  focusedGroup: FocusedGroup;
  quality: boolean;
  sound: boolean;
  onQualityChange: (quality: boolean) => void;
  onSoundChange: (sound: boolean) => void;
  onBack: () => void;
  currentTitle?: string;
  currentSubtitle?: string;
  overlays: OverlayState;
  closeOverlay: (key: OverlayKey) => void;
  finishClosing: (key: OverlayKey) => void;
}

export const OverlayManager = (props: OverlayManagerProps) => {
  const {
    focusedGroup,
    quality,
    sound,
    onQualityChange,
    onSoundChange,
    onBack,
    currentTitle,
    currentSubtitle,
    overlays,
    closeOverlay,
    finishClosing,
  } = props;

  const { resolvedTheme, setTheme } = useTheme();
  const [themeMounted, setThemeMounted] = useState(false);

  useEffect(() => {
    setThemeMounted(true);
  }, []);

  const handleExit = () => {
    if (overlays.portfolio?.isOpen) {
      closeOverlay('portfolio');
      return;
    }
    if (overlays.experience?.isOpen) {
      closeOverlay('experience');
      return;
    }
    if (overlays.skills?.isOpen) {
      closeOverlay('skills');
      return;
    }
    if (overlays.aboutMe?.isOpen) {
      closeOverlay('aboutMe');
      return;
    }
    if (overlays.resume?.isOpen) {
      closeOverlay('resume');
      return;
    }
    if (overlays.contact?.isOpen) {
      closeOverlay('contact');
      return;
    }
    onBack();
  };

  return (
    <>
      <div className='pointer-events-none absolute inset-0 z-escape-hatch'>
        {!focusedGroup && (
          <div className='absolute top-8 left-8 flex flex-col gap-1'>
            <span className='text-[#E5D6C4] font-bold text-2xl neon-glow'>Ayaan</span>
            <span className='text-[#eeebe7] text-xs font-mono neon-glow'>Frontend Developer</span>
          </div>
        )}

        {focusedGroup && currentTitle && (
          <div className='absolute top-7 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center px-4'>
            <motion.span
              key={focusedGroup}
              className='text-[#E5D6C4] font-bold text-2xl neon-glow text-center whitespace-nowrap'
              initial={{ opacity: 0, y: -16, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              {currentTitle}
            </motion.span>
            <motion.span
              key={`${focusedGroup}-subtitle`}
              className='text-[#eeebe7] text-xs font-mono neon-glow text-center'
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.25, ease: 'easeInOut', delay: 0.05 }}
            >
              {currentSubtitle}
            </motion.span>
          </div>
        )}

        <div className='pointer-events-auto absolute bottom-8 left-8 flex flex-col gap-3'>
          <NeonToggle checked={quality} onChange={onQualityChange} label='HIGH QUALITY' />
          <NeonToggle checked={sound} onChange={onSoundChange} label='SOUND EFFECTS' />
          {themeMounted && (
            <NeonToggle
              checked={resolvedTheme === 'dark'}
              onChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              label='DARK MODE'
            />
          )}
        </div>

        <div className='pointer-events-auto absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-6 items-center text-[#E5D6C4] font-mono text-xs'>
          <span>© 2025</span>
          <AnimatedLink href='https://github.com/scs0209' target='_blank' rel='noopener noreferrer'>
            <GithubIcon className='w-4 h-4' />
            <span>GITHUB</span>
          </AnimatedLink>
          <AnimatedLink href='https://www.linkedin.com/in/창수-성-7663b9275' target='_blank' rel='noopener noreferrer'>
            <LinkedinIcon className='w-4 h-4' />
            <span>LINKEDIN</span>
          </AnimatedLink>
          <AnimatedLink href='mailto:tjdckdtn2463@naver.com'>
            <Mail className='w-4 h-4' />
            <span>EMAIL</span>
          </AnimatedLink>
        </div>

        {focusedGroup && (
          <button
            type='button'
            onClick={handleExit}
            className={`pointer-events-auto absolute top-6 right-6 ${overlayStyles.button}`}
          >
            ← EXIT
          </button>
        )}
      </div>

      {overlays.aboutMe?.isOpen && (
        <OverlayShell side='left' className='max-w-3xl'>
          <AboutMePage
            isClosing={overlays.aboutMe?.isClosing}
            onClose={() => {
              finishClosing('aboutMe');
              onBack();
            }}
          />
        </OverlayShell>
      )}

      {overlays.experience?.isOpen && (
        <OverlayShell side='left' className='w-full max-w-none' contentClassName='overflow-hidden flex flex-col'>
          <ExperiencePage
            isClosing={overlays.experience?.isClosing ?? false}
            onClose={() => {
              finishClosing('experience');
              onBack();
            }}
          />
        </OverlayShell>
      )}

      {overlays.skills?.isOpen && (
        <OverlayShell side='right' className='max-w-4xl min-w-[min(100%,600px)]'>
          <SkillsOverlay
            skillsClosing={overlays.skills?.isClosing}
            onAnimationComplete={() => {
              finishClosing('skills');
              onBack();
            }}
          />
        </OverlayShell>
      )}

      {overlays.contact?.isOpen && (
        <OverlayShell side='left' className='max-w-md' contentClassName='flex items-center'>
          <CyberpunkContactForm
            show={overlays.contact?.isOpen}
            isClosing={overlays.contact?.isClosing}
            onClose={() => {
              finishClosing('contact');
              onBack();
            }}
          />
        </OverlayShell>
      )}

      {overlays.portfolio?.isOpen && (
        <LoadingProgressBar
          isReversing={overlays.portfolio?.isClosing ?? false}
          onCloseComplete={() => {
            finishClosing('portfolio');
            onBack();
          }}
        />
      )}

      {overlays.resume?.isOpen && (
        <OverlayShell side='left' className='max-w-sm' contentClassName='flex items-center'>
          <ResumeConsoleOverlay
            isOpen={overlays.resume?.isOpen}
            isClosing={overlays.resume?.isClosing ?? false}
            onAnimationComplete={() => {
              finishClosing('resume');
              onBack();
            }}
          />
        </OverlayShell>
      )}
    </>
  );
};
