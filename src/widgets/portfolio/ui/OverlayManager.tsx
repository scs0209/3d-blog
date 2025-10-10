import type { FocusedGroup } from '@/entities/portfolio/model/types';
import { Mail, LinkedinIcon, GithubIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NeonToggle, AnimatedLink, LoadingProgressBar, ExperiencePage, SkillsOverlay } from '@/widgets/portfolio/ui';
import type { OverlayKey, OverlayState } from '@/features/portfolio/model/use-overlay-state';

interface OverlayManagerProps {
  focusedGroup: FocusedGroup;
  quality: boolean;
  sound: boolean;
  onQualityChange: (quality: boolean) => void;
  onSoundChange: (sound: boolean) => void;
  onBack: () => void;

  // Title
  currentTitle?: string;
  currentSubtitle?: string;
  titleAnimation?: 'idle' | 'changing' | 'exiting';

  // Overlay
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
    titleAnimation,
    overlays,
    closeOverlay,
    finishClosing,
  } = props;

  return (
    <>
      {/* 오버레이 UI: 상단좌측 타이틀/직함 */}
      <div className='absolute top-8 left-8 z-30 flex flex-col gap-1'>
        <span className='text-[#E5D6C4] font-bold text-2xl neon-glow'>Ayaan</span>
        <span className='text-[#eeebe7] text-xs font-mono neon-glow'>Frontend Developer</span>
      </div>

      {/* 오버레이 UI: 상단가운데 타이틀/직함 - 모델 클릭 시에만 표시 */}
      {focusedGroup && (
        <div className='absolute top-8 left-1/2 transform -translate-x-1/2 flex flex-col gap-1 items-center z-30'>
          <AnimatePresence mode='wait'>
            <motion.span
              key={currentTitle}
              className='text-[#E5D6C4] font-bold text-2xl neon-glow'
              initial={{
                opacity: 0,
                y: titleAnimation === 'changing' ? -20 : titleAnimation === 'exiting' ? 20 : 0,
                scale: 0.8,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: titleAnimation === 'changing' ? 20 : titleAnimation === 'exiting' ? -20 : 0,
                scale: 0.8,
              }}
              transition={{
                duration: 0.3,
                ease: 'easeInOut',
              }}
            >
              {currentTitle}
            </motion.span>
          </AnimatePresence>
          <AnimatePresence mode='wait'>
            <motion.span
              key={currentSubtitle}
              className='text-[#eeebe7] text-xs font-mono neon-glow'
              initial={{
                opacity: 0,
                y: titleAnimation === 'changing' ? -10 : titleAnimation === 'exiting' ? 10 : 0,
                scale: 0.9,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: titleAnimation === 'changing' ? 10 : titleAnimation === 'exiting' ? -10 : 0,
                scale: 0.9,
              }}
              transition={{
                duration: 0.3,
                ease: 'easeInOut',
                delay: 0.1,
              }}
            >
              {currentSubtitle}
            </motion.span>
          </AnimatePresence>
        </div>
      )}

      {/* 오버레이 UI: 하단좌측 퀄리티/사운드/라이트모드 */}
      <div className='absolute bottom-8 left-8 z-30 flex flex-col gap-3'>
        <NeonToggle checked={quality} onChange={onQualityChange} label='HIGH QUALITY' />
        <NeonToggle checked={sound} onChange={onSoundChange} label='SOUND EFFECTS' />
      </div>

      {/* 오버레이 UI: 하단중앙 저작권/소셜 */}
      <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex gap-6 items-center text-[#E5D6C4] font-mono text-xs'>
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

      {/* 오버레이 AboutMePage */}
      {/* {overlays.aboutMe?.isOpen && (
        <div className='fixed left-0 top-0 h-full w-1/2 max-w-3xl min-w-[320px] z-50 flex items-start justify-center'>
          <AboutMePage
            isClosing={overlays.aboutMe?.isClosing}
            onClose={overlays.aboutMe?.isClosing ? onAboutMeAnimationComplete : closeOverlay('aboutMe')}
          />
        </div>
      )} */}

      {/* 오버레이 ExperiencePage */}
      {overlays.experience?.isOpen && (
        <div className='fixed left-0 top-0 h-full w-1/2 max-w-3xl min-w-[320px] z-50 flex items-start justify-center'>
          <ExperiencePage
            isClosing={overlays.experience?.isClosing ?? false}
            onClose={() => {
              // closing 애니메이션 완료 후
              finishClosing('experience'); // 오버레이 완전히 닫기
              onBack(); // 카메라 리셋
            }}
          />
        </div>
      )}

      {/* Skills Overlay */}
      {overlays.skills?.isOpen && (
        <div className='fixed right-0 top-0 h-full w-1/2 max-w-4xl min-w-[600px] z-50 flex items-start justify-center'>
          <SkillsOverlay
            skillsClosing={overlays.skills?.isClosing}
            onAnimationComplete={() => {
              finishClosing('skills');
              onBack();
            }}
          />
        </div>
      )}

      {/* Contact Form */}
      {/* {overlays.contact?.isOpen && (
        <div className='fixed left-[100px] top-1/2 transform -translate-y-1/2 z-50'>
          <CyberpunkContactForm
            show={overlays.contact?.isOpen}
            isClosing={overlays.contact?.isClosing}
            onClose={overlays.contact?.isClosing ? onContactAnimationComplete : closeOverlay('contact')}
          />
        </div>
      )} */}

      {/* 로딩 오버레이들 */}
      {/* <LoadingOverlay
        showWorksLoading={showWorksLoading}
        showPortfolioOverlay={overlays.portfolio?.isOpen}
        showExitLoading={showExitLoading}
        loadingProgress={loadingProgress}
        loadingBarFullExpand={loadingBarFullExpand}
        exitLoadingProgress={exitLoadingProgress}
      /> */}

      {/* 포트폴리오 오버레이 */}
      {overlays.portfolio?.isOpen && (
        <LoadingProgressBar
          isReversing={overlays.portfolio?.isClosing ?? false}
          onCloseComplete={() => {
            // closing 애니메이션 완료 후
            finishClosing('portfolio'); // 오버레이 완전히 닫기
            onBack(); // 카메라 리셋
          }}
        />
      )}

      {/* 뒤로가기 버튼 */}
      {focusedGroup && (
        <button
          type='button'
          onClick={() => {
            if (overlays.portfolio?.isOpen) {
              // portfolio overlay가 열려있으면 오버레이만 닫고 카메라는 리셋하지 않음
              closeOverlay('portfolio');
            } else if (overlays.experience?.isOpen) {
              // experience overlay가 열려있으면 오버레이만 닫고 카메라는 리셋하지 않음
              closeOverlay('experience');
            } else if (overlays.skills?.isOpen) {
              // skills overlay가 열려있으면 오버레이만 닫고 카메라는 리셋하지 않음
              closeOverlay('skills');
            } else {
              // 다른 경우에는 일반적인 뒤로가기 (카메라 리셋 포함)
              onBack();
            }
          }}
          className='absolute top-6 right-6 z-escape-hatch px-4 py-2.5 bg-gray-900/80 backdrop-blur-sm text-[#E5D6C4] rounded border border-[#E5D6C4]/50 font-mono text-sm font-bold cursor-pointer transition-all duration-200 hover:bg-[#E5D6C4]/10 hover:border-[#E5D6C4] hover:text-[#f3efeb] hover:shadow-lg hover:shadow-[#E5D6C4]/25 active:scale-95'
        >
          ← EXIT
        </button>
      )}
    </>
  );
};
