'use client';

import { Canvas } from '@react-three/fiber';
import { INITIAL_CAMERA_POS } from '@/entities/portfolio/model/constants';
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
    <FPSProvider>
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
            // server 애니메이션용
            setShowWorksLoading={setShowWorksLoading}
            setShowCards={setShowCards}
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
