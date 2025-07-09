import type { FocusedGroup } from '@/entities/portfolio/model/types';
import {
  CyberpunkContactForm,
  LoadingOverlay,
  PortfolioOverlay,
  NeonToggle,
  ExperiencePage,
  AboutMePage,
} from '@/widgets/portfolio/ui';

interface OverlayManagerProps {
  focusedGroup: FocusedGroup;
  quality: boolean;
  sound: boolean;
  onQualityChange: (quality: boolean) => void;
  onSoundChange: (sound: boolean) => void;
  onBack: () => void;

  // About Me
  showAboutMeOverlay: boolean;
  aboutMeClosing: boolean;
  onAboutMeClose: () => void;
  onAboutMeAnimationComplete?: () => void;

  // Experience
  showExperienceOverlay: boolean;
  experienceClosing: boolean;
  onExperienceClose: () => void;
  onExperienceAnimationComplete?: () => void;

  // Contact
  showContactForm: boolean;
  contactClosing: boolean;
  onContactClose: () => void;
  onContactAnimationComplete?: () => void;

  // Loading
  showWorksLoading: boolean;
  showPortfolioOverlay: boolean;
  showExitLoading: boolean;
  loadingProgress: number;
  loadingBarFullExpand: boolean;
  exitLoadingProgress: number;

  // Portfolio
  portfolioExiting: boolean;
  showPortfolioContent: boolean;
  showCards: boolean;
  onPortfolioExit: () => void;
  onPortfolioAnimationComplete: () => void;
}

export const OverlayManager = (props: OverlayManagerProps) => {
  const {
    focusedGroup,
    quality,
    sound,
    onQualityChange,
    onSoundChange,
    onBack,
    showAboutMeOverlay,
    aboutMeClosing,
    onAboutMeClose,
    onAboutMeAnimationComplete,
    showExperienceOverlay,
    experienceClosing,
    onExperienceClose,
    onExperienceAnimationComplete,
    showContactForm,
    contactClosing,
    onContactClose,
    onContactAnimationComplete,
    showWorksLoading,
    showPortfolioOverlay,
    showExitLoading,
    loadingProgress,
    loadingBarFullExpand,
    exitLoadingProgress,
    portfolioExiting,
    showPortfolioContent,
    showCards,
    onPortfolioExit,
    onPortfolioAnimationComplete,
  } = props;

  return (
    <>
      {/* 오버레이 UI: 상단좌측 타이틀/직함 */}
      <div className='absolute top-8 left-8 z-30 flex flex-col gap-1'>
        <span className='text-cyan-300 font-bold text-2xl neon-glow'>Ayaan</span>
        <span className='text-cyan-500 text-xs font-mono neon-glow'>Frontend Developer</span>
      </div>

      {/* 오버레이 UI: 하단좌측 퀄리티/사운드/라이트모드 */}
      <div className='absolute bottom-8 left-8 z-30 flex flex-col gap-3'>
        <NeonToggle checked={quality} onChange={onQualityChange} label='HIGH QUALITY' />
        <NeonToggle checked={sound} onChange={onSoundChange} label='SOUND EFFECTS' />
      </div>

      {/* 오버레이 UI: 하단우측 저작권/소셜 */}
      <div className='absolute bottom-8 right-8 z-30 flex gap-4 items-center text-cyan-300 font-mono text-xs'>
        <span>© 2025</span>
        <a href='https://github.com/yourid' target='_blank' rel='noopener noreferrer'>
          GITHUB
        </a>
        <a href='mailto:your@email.com'>EMAIL</a>
      </div>

      {/* 오버레이 AboutMePage */}
      {showAboutMeOverlay && (
        <div className='fixed left-0 top-0 h-full w-1/2 max-w-3xl min-w-[320px] z-50 flex items-start justify-center'>
          <AboutMePage
            isClosing={aboutMeClosing}
            onClose={aboutMeClosing ? onAboutMeAnimationComplete : onAboutMeClose}
          />
        </div>
      )}

      {/* 오버레이 ExperiencePage */}
      {showExperienceOverlay && (
        <div className='fixed left-0 top-0 h-full w-1/2 max-w-3xl min-w-[320px] z-50 flex items-start justify-center'>
          <ExperiencePage
            isClosing={experienceClosing}
            onClose={experienceClosing ? onExperienceAnimationComplete : onExperienceClose}
          />
        </div>
      )}

      {/* Contact Form */}
      {showContactForm && (
        <div className='fixed left-[100px] top-1/2 transform -translate-y-1/2 z-50'>
          <CyberpunkContactForm
            show={showContactForm}
            isClosing={contactClosing}
            onClose={contactClosing ? onContactAnimationComplete : onContactClose}
          />
        </div>
      )}

      {/* 로딩 오버레이들 */}
      <LoadingOverlay
        showWorksLoading={showWorksLoading}
        showPortfolioOverlay={showPortfolioOverlay}
        showExitLoading={showExitLoading}
        loadingProgress={loadingProgress}
        loadingBarFullExpand={loadingBarFullExpand}
        exitLoadingProgress={exitLoadingProgress}
      />

      {/* 포트폴리오 오버레이 */}
      <PortfolioOverlay
        showPortfolioOverlay={showPortfolioOverlay}
        portfolioExiting={portfolioExiting}
        showPortfolioContent={showPortfolioContent}
        showCards={showCards}
        onExit={onPortfolioExit}
        onAnimationComplete={onPortfolioAnimationComplete}
      />

      {/* 뒤로가기 버튼 */}
      {focusedGroup && !showPortfolioOverlay && !showExitLoading && (
        <button
          type='button'
          onClick={() => {
            // 각 오버레이별 닫기 핸들러 호출
            if (showAboutMeOverlay) {
              onAboutMeClose();
            } else if (showExperienceOverlay) {
              onExperienceClose();
            } else if (showContactForm) {
              // Contact Form 닫기 (역순 애니메이션 시작)
              onContactClose();
            } else {
              // 다른 상태에서는 기본 onBack 호출
              onBack();
            }
          }}
          className='absolute top-6 right-6 z-10 px-[18px] py-[10px] bg-gray-800 text-white rounded-lg border-none font-bold text-lg cursor-pointer opacity-85 hover:opacity-100 transition-opacity'
        >
          돌아가기
        </button>
      )}
    </>
  );
};
