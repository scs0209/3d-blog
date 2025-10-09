'use client';

import { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import type { FocusedGroup } from '@/entities/portfolio/model/types';
import { usePortfolio } from '@/features/portfolio/model/use-portfolio';
import { FPSDisplay, FPSProvider, OverlayManager } from '@/widgets/portfolio/ui';
import { titleMap } from '@/widgets/portfolio/consts';

const PortfolioCanvas = dynamic(
  () => import('@/widgets/portfolio/ui/PortfolioCanvas').then((mod) => mod.PortfolioCanvas),
  {
    ssr: false,
    loading: () => <p>Loading 3D Models...</p>,
  },
);

export const PortfolioClient = () => {
  const portfolio = usePortfolio();

  const [currentTitle, setCurrentTitle] = useState('');
  const [currentSubtitle, setCurrentSubtitle] = useState('');
  const [titleAnimation, setTitleAnimation] = useState<'idle' | 'changing' | 'exiting'>('idle');

  const {
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
    setHoveredPosition,
    setCameraAnimationDone,
    setSecondaryAnimation,
    setTargetPos,
    setTargetLook,
    setFocusedGroup,
    setQuality,
    setSound,
    isShow,
    handleGroupClick,
    handleBack,
    openOverlay,
    closeOverlay,
  } = portfolio;

  const handleGroupClickWithTitle = (group: FocusedGroup) => {
    if (!group) {
      return;
    }

    setTitleAnimation('changing');

    const newTitle = titleMap[group] || { title: group.toUpperCase(), subtitle: 'Section' };

    setTimeout(() => {
      setCurrentTitle(newTitle.title);
      setCurrentSubtitle(newTitle.subtitle);
      setTitleAnimation('idle');
    }, 300);

    handleGroupClick(group);
  };

  const handleBackWithTitleReset = () => {
    setTitleAnimation('exiting');
    handleBack();
  };

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

        <Suspense fallback={<p>Loading 3D Models...</p>}>
          <PortfolioCanvas
            focusedGroup={focusedGroup}
            pulseActive={pulseActive}
            pulseCenter={pulseCenter}
            hoveredPosition={hoveredPosition}
            isShow={isShow}
            handleGroupClick={handleGroupClickWithTitle}
            setHoveredPosition={setHoveredPosition}
            openOverlay={openOverlay}
            targetPos={targetPos}
            targetLook={targetLook}
            secondaryAnimation={secondaryAnimation}
            setCameraAnimationDone={setCameraAnimationDone}
            setSecondaryAnimation={setSecondaryAnimation}
            setTargetPos={setTargetPos}
            setTargetLook={setTargetLook}
            hasClickedBack={hasClickedBack}
            setFocusedGroup={setFocusedGroup}
            cameraAnimationDone={cameraAnimationDone}
          />
        </Suspense>
        {!focusedGroup && <FPSDisplay />}
      </div>
    </FPSProvider>
  );
};
