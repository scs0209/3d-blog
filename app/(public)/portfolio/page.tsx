'use client';

import { Canvas } from '@react-three/fiber';
import { useState } from 'react';
import { INITIAL_CAMERA_POS } from '@/entities/portfolio/model/constants';
import { usePortfolio } from '@/features/portfolio/model/use-portfolio';
import { useInitialAnimation } from '@/features/portfolio/model/use-initial-animation';
import { useWorkCameraAnimation } from '@/features/portfolio/model/animations/use-work-camera-animation';
import { useExperienceCameraAnimation } from '@/features/portfolio/model/animations/use-experience-camera-animation';
import { useContactCameraAnimation } from '@/features/portfolio/model/animations/use-contact-camera-animation';
import { CameraController } from '@/widgets/portfolio/ui/CameraController';
import { SceneRenderer } from '@/widgets/portfolio/ui/SceneRenderer';
import { OverlayManager } from '@/widgets/portfolio/ui/OverlayManager';
import { FPSDisplay } from '@/widgets/portfolio/ui/FPSDisplay';

export default function PortfolioPage() {
  const [fps, setFps] = useState(60);
  const portfolio = usePortfolio();

  // 초기 애니메이션 훅 사용
  const initialAnimation = useInitialAnimation();

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

  return (
    <div className='h-screen w-screen bg-[#12161B]'>
      <OverlayManager
        focusedGroup={focusedGroup}
        quality={quality}
        sound={sound}
        onQualityChange={setQuality}
        onSoundChange={setSound}
        onBack={handleBack}
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
        />

        <SceneRenderer
          focusedGroup={focusedGroup}
          pulseActive={pulseActive}
          pulseCenter={pulseCenter}
          hoveredPosition={hoveredPosition}
          isShow={isShow}
          onGroupClick={handleGroupClick}
          onPointerOver={setHoveredPosition}
          onPointerOut={() => setHoveredPosition(null)}
          onFpsUpdate={setFps}
          // 초기 애니메이션 props 추가
          holoTableScale={initialAnimation.holoTableScale}
          holoTablePosition={initialAnimation.holoTablePosition}
          showOtherModels={initialAnimation.showOtherModels}
          isInitialAnimation={!initialAnimation.isAnimationComplete}
        />
      </Canvas>
      <FPSDisplay fps={fps} />
    </div>
  );
}
