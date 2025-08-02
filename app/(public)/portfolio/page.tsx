'use client';

import { Canvas } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import { INITIAL_CAMERA_POS } from '@/entities/portfolio/model/constants';
import type { FocusedGroup } from '@/entities/portfolio/model/types';
import { usePortfolio } from '@/features/portfolio/model/use-portfolio';
import { useInitialAnimation } from '@/features/portfolio/model/use-initial-animation';
import {
  useExperienceCameraAnimation,
  useWorkCameraAnimation,
  useContactCameraAnimation,
} from '@/features/portfolio/model/animations';
import { SceneRenderer, OverlayManager, FPSDisplay, CameraController, FPSProvider } from '@/widgets/portfolio/ui';

export default function PortfolioPage() {
  const portfolio = usePortfolio();

  // 초기 애니메이션 훅 사용
  const initialAnimation = useInitialAnimation();

  // 타이틀 상태 추가
  const [currentTitle, setCurrentTitle] = useState('');
  const [currentSubtitle, setCurrentSubtitle] = useState('');
  const [titleAnimation, setTitleAnimation] = useState<'idle' | 'changing' | 'exiting'>('idle');

  const {
    // 상태들
    focusedGroup,
    pulseActive,
    pulseCenter,
    hoveredPosition,
    quality,
    sound,
    targetPos,
    targetLook,
    secondaryAnimation,
    aboutMeAnimationDone,
    aboutMeClosing,
    cameraAnimationDone,
    hasClickedBack,
    showAboutMeOverlay,
    showExperienceOverlay,
    experienceClosing,
    contactClosing,
    showContactForm,
    showWorksLoading,
    showPortfolioOverlay,
    showExitLoading,
    loadingProgress,
    loadingBarFullExpand,
    exitLoadingProgress,
    portfolioExiting,
    showPortfolioContent,
    showCards,

    // Setters
    setHoveredPosition,
    setQuality,
    setSound,
    setCameraAnimationDone,
    setSecondaryAnimation,
    setTargetPos,
    setTargetLook,
    setShowAboutMeOverlay,
    setShowExperienceOverlay,
    setShowContactForm,
    setFocusedGroup,
    setAboutMeClosing,
    setAboutMeAnimationDone,
    setExperienceClosing,
    setContactClosing,
    setShowWorksLoading,
    setShowCards,

    // 액션들
    isShow,
    handleGroupClick,
    handleBack,
    handleAboutMeClose,
    handleExperienceClose,
    handleContactClose,
    handlePortfolioExit,
    handlePortfolioAnimationComplete,
  } = portfolio;

  // 모델 클릭 시 타이틀 변경 핸들러
  const handleGroupClickWithTitle = (group: FocusedGroup) => {
    if (!group) {
      return;
    }

    setTitleAnimation('changing');

    // 그룹에 따른 타이틀 매핑 (HoloText와 동일한 텍스트)
    const titleMap: Record<string, { title: string; subtitle: string }> = {
      work: { title: 'ABOUT ME', subtitle: 'Personal Information' },
      contactMe: { title: 'HOME', subtitle: 'Welcome Back' },
      server: { title: 'WORKS', subtitle: 'Portfolio Projects' },
      resumeConsole: { title: 'RESUME', subtitle: 'Professional Experience' },
      experience: { title: 'EXPERIENCE', subtitle: 'Work History' },
      skill: { title: 'SKILLS', subtitle: 'Technical Expertise' },
      platform: { title: 'PLAYGROUND', subtitle: 'Creative Space' },
      holoTable: { title: 'PLAYGROUND', subtitle: 'Creative Space' },
      radar: { title: 'CONTACT ME', subtitle: 'Get In Touch' },
    };

    const newTitle = titleMap[group] || { title: group.toUpperCase(), subtitle: 'Section' };

    setTimeout(() => {
      setCurrentTitle(newTitle.title);
      setCurrentSubtitle(newTitle.subtitle);
      setTitleAnimation('idle');
    }, 300);

    // 기존 클릭 핸들러 호출
    handleGroupClick(group);
  };

  // 뒤로가기 시 원래 타이틀로 복원
  const handleBackWithTitleReset = () => {
    setTitleAnimation('exiting');
    handleBack();
  };

  // Work 애니메이션 훅 사용
  const workAnimation = useWorkCameraAnimation({
    focusedGroup,
    cameraAnimationDone,
    aboutMeClosing,
    secondaryAnimation,
    hasClickedBack,
    setShowAboutMeOverlay,
    setSecondaryAnimation,
    setTargetPos,
    setTargetLook,
    setFocusedGroup,
    setAboutMeClosing,
    setAboutMeAnimationDone,
    setCameraAnimationDone,
  });

  // Experience 애니메이션 훅 사용
  const experienceAnimation = useExperienceCameraAnimation({
    focusedGroup,
    cameraAnimationDone,
    experienceClosing,
    secondaryAnimation,
    hasClickedBack,
    setShowExperienceOverlay,
    setTargetPos,
    setTargetLook,
    setFocusedGroup,
    setExperienceClosing,
    setCameraAnimationDone,
  });

  // Contact 애니메이션 훅 사용
  const contactAnimation = useContactCameraAnimation({
    setShowContactForm,
    setTargetPos,
    setTargetLook,
    setSecondaryAnimation,
    setCameraAnimationDone,
    focusedGroup,
  });

  useEffect(() => {
    document.title = 'Portfolio';
  }, []);

  return (
    <FPSProvider>
      <div className='h-screen w-screen bg-[#12161B]'>
        <OverlayManager
          focusedGroup={focusedGroup}
          quality={quality}
          sound={sound}
          onQualityChange={setQuality}
          onSoundChange={setSound}
          onBack={handleBackWithTitleReset}
          showAboutMeOverlay={showAboutMeOverlay}
          aboutMeClosing={aboutMeClosing}
          onAboutMeClose={handleAboutMeClose}
          onAboutMeAnimationComplete={workAnimation.handleAboutMeAnimationComplete}
          showExperienceOverlay={showExperienceOverlay}
          experienceClosing={experienceClosing}
          onExperienceClose={handleExperienceClose}
          onExperienceAnimationComplete={experienceAnimation.handleExperienceAnimationComplete}
          showContactForm={showContactForm}
          contactClosing={contactClosing}
          onContactClose={handleContactClose}
          onContactAnimationComplete={contactAnimation.handleContactAnimationComplete}
          showWorksLoading={showWorksLoading}
          showPortfolioOverlay={showPortfolioOverlay}
          showExitLoading={showExitLoading}
          loadingProgress={loadingProgress}
          loadingBarFullExpand={loadingBarFullExpand}
          exitLoadingProgress={exitLoadingProgress}
          portfolioExiting={portfolioExiting}
          showPortfolioContent={showPortfolioContent}
          showCards={showCards}
          onPortfolioExit={handlePortfolioExit}
          onPortfolioAnimationComplete={handlePortfolioAnimationComplete}
          currentTitle={currentTitle}
          currentSubtitle={currentSubtitle}
          titleAnimation={titleAnimation}
        />

        <Canvas camera={{ position: INITIAL_CAMERA_POS, fov: 75, near: 0.1, far: 100 }}>
          <CameraController
            targetPos={targetPos}
            targetLook={targetLook}
            secondaryAnimation={secondaryAnimation}
            aboutMeAnimationDone={aboutMeAnimationDone}
            aboutMeClosing={aboutMeClosing}
            setCameraAnimationDone={setCameraAnimationDone}
            setSecondaryAnimation={setSecondaryAnimation}
            setTargetPos={setTargetPos}
            setTargetLook={setTargetLook}
            cameraAnimationDone={cameraAnimationDone}
            hasClickedBack={hasClickedBack}
            focusedGroup={focusedGroup}
            setShowAboutMeOverlay={setShowAboutMeOverlay}
            setShowExperienceOverlay={setShowExperienceOverlay}
            setShowContactForm={setShowContactForm}
            // workAnimation에서만 사용되는 props들
            setFocusedGroup={setFocusedGroup}
            setAboutMeClosing={setAboutMeClosing}
            setAboutMeAnimationDone={setAboutMeAnimationDone}
            onAboutMeAnimationComplete={workAnimation.handleAboutMeAnimationComplete}
            // contact 역순 애니메이션용
            contactClosing={contactClosing}
            setContactClosing={setContactClosing}
            // 초기 애니메이션 관련
            isInitialAnimation={!initialAnimation.isAnimationComplete}
            // server 애니메이션용
            setShowWorksLoading={setShowWorksLoading}
            setShowCards={setShowCards}
            // 포트폴리오 EXIT 상태
            portfolioExiting={portfolioExiting}
          />

          <SceneRenderer
            focusedGroup={focusedGroup}
            pulseActive={pulseActive}
            pulseCenter={pulseCenter}
            hoveredPosition={hoveredPosition}
            isShow={isShow}
            onGroupClick={handleGroupClickWithTitle}
            onPointerOver={setHoveredPosition}
            onPointerOut={() => setHoveredPosition(null)}
            // 초기 애니메이션 props 추가
            holoTableScale={initialAnimation.holoTableScale}
            holoTablePosition={initialAnimation.holoTablePosition}
            showOtherModels={initialAnimation.showOtherModels}
            isInitialAnimation={!initialAnimation.isAnimationComplete}
            cameraAnimationDone={cameraAnimationDone}
          />
        </Canvas>
        {!focusedGroup && <FPSDisplay />}
      </div>
    </FPSProvider>
  );
}
