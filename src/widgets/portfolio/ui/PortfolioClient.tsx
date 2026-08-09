'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import type { FocusedGroup } from '@/entities/portfolio/model/types';
import { usePortfolio } from '@/features/portfolio/model/use-portfolio';
import { useToast } from '@/shared/ui/toast';
import { titleMap } from '@/widgets/portfolio/consts';
import { FPSDisplay, FPSProvider, OverlayManager } from '@/widgets/portfolio/ui';

const PortfolioCanvas = dynamic(
  () => import('@/widgets/portfolio/ui/PortfolioCanvas').then((mod) => mod.PortfolioCanvas),
  {
    ssr: false,
    loading: () => <p>Loading 3D Models...</p>,
  },
);

export const PortfolioClient = () => {
  const portfolio = usePortfolio();
  const toast = useToast();

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
    finishClosing,
  } = portfolio;

  const titleInfo = focusedGroup
    ? (titleMap[focusedGroup] ?? { title: focusedGroup.toUpperCase(), subtitle: 'Section' })
    : null;

  const handleGroupClickWithTitle = (group: FocusedGroup) => {
    if (!group) {
      return;
    }

    // platform 클릭 시 준비중 토스트 표시
    if (group === 'platform') {
      toast.info('준비중입니다', {
        position: 'top-center',
        duration: 3000,
      });
      return;
    }

    handleGroupClick(group);
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
          onBack={handleBack}
          currentTitle={titleInfo?.title}
          currentSubtitle={titleInfo?.subtitle}
          overlays={overlays}
          closeOverlay={closeOverlay}
          finishClosing={finishClosing}
        />

        <Suspense>
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
