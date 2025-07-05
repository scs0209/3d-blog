import { useState } from 'react';
import type { Position3D } from '@/entities/portfolio/model/types';
import { INITIAL_CAMERA_POS, INITIAL_CAMERA_LOOK } from '@/entities/portfolio/model/constants';

export const useCameraAnimation = () => {
  const [targetPos, setTargetPos] = useState<Position3D | null>(null);
  const [targetLook, setTargetLook] = useState<Position3D | null>(null);
  const [secondaryAnimation, setSecondaryAnimation] = useState(false);
  const [cameraAnimationDone, setCameraAnimationDone] = useState(false);
  const [hasClickedBack, setHasClickedBack] = useState(false);

  const resetToInitialPosition = () => {
    setTargetPos(INITIAL_CAMERA_POS);
    setTargetLook(INITIAL_CAMERA_LOOK);
  };

  const resetAnimationState = () => {
    setSecondaryAnimation(false);
    setCameraAnimationDone(false);
    setHasClickedBack(false);
  };

  return {
    // State
    targetPos,
    targetLook,
    secondaryAnimation,
    cameraAnimationDone,
    hasClickedBack,
    // Setters
    setTargetPos,
    setTargetLook,
    setSecondaryAnimation,
    setCameraAnimationDone,
    setHasClickedBack,
    // Actions
    resetToInitialPosition,
    resetAnimationState,
  };
};
