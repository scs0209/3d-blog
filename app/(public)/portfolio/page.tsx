'use client';

import { Canvas } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import { INITIAL_CAMERA_POS } from '@/entities/portfolio/model/constants';
import type { FocusedGroup } from '@/entities/portfolio/model/types';
import { usePortfolio } from '@/features/portfolio/model/use-portfolio';
import { useInitialAnimation } from '@/features/portfolio/model/use-initial-animation';
import { SceneRenderer, FPSDisplay, CameraController, FPSProvider, OverlayManager } from '@/widgets/portfolio/ui';

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
    cameraAnimationDone,
    hasClickedBack,
    overlays,

    // Setters
    setHoveredPosition,
    setCameraAnimationDone,
    setSecondaryAnimation,
    setTargetPos,
    setTargetLook,
    setFocusedGroup,
    setQuality,
    setSound,

    // 액션들
    isShow,
    handleGroupClick,
    handleBack,
    openOverlay,
    closeOverlay,
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
          currentTitle={currentTitle}
          currentSubtitle={currentSubtitle}
          titleAnimation={titleAnimation}
          overlays={overlays}
          closeOverlay={closeOverlay}
        />

        <Canvas camera={{ position: INITIAL_CAMERA_POS, fov: 75, near: 0.1, far: 100 }}>
          <CameraController
            openOverlay={openOverlay}
            targetPos={targetPos}
            targetLook={targetLook}
            secondaryAnimation={secondaryAnimation}
            setCameraAnimationDone={setCameraAnimationDone}
            setSecondaryAnimation={setSecondaryAnimation}
            setTargetPos={setTargetPos}
            setTargetLook={setTargetLook}
            hasClickedBack={hasClickedBack}
            focusedGroup={focusedGroup}
            // workAnimation에서만 사용되는 props들
            setFocusedGroup={setFocusedGroup}
            // 초기 애니메이션 관련
            isInitialAnimation={!initialAnimation.isAnimationComplete}
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
