import { useEffect, useCallback } from 'react';
import type { FocusedGroup, Position3D } from '@/entities/portfolio/model/types';
import { CAMERA_ANIMATION_DELAY } from '@/entities/portfolio/model/constants';

type UseRadarCameraAnimationProps = {
  focusedGroup: FocusedGroup;
  cameraAnimationDone: boolean;
  secondaryAnimation: boolean;
  hasClickedBack: boolean;
  setShowContactForm: (show: boolean) => void;
  setTargetPos: (pos: Position3D) => void;
  setTargetLook: (look: Position3D) => void;
  setFocusedGroup: (group: FocusedGroup) => void;
  setCameraAnimationDone: (done: boolean) => void;
};

export const useRadarCameraAnimation = (props: UseRadarCameraAnimationProps) => {
  const {
    focusedGroup,
    cameraAnimationDone,
    secondaryAnimation,
    hasClickedBack,
    setShowContactForm,
    setTargetPos,
    setTargetLook,
    setFocusedGroup,
    setCameraAnimationDone,
  } = props;

  // Radar 모델의 완전한 종료 처리
  const handleRadarExit = useCallback(() => {
    console.log('Radar: 완전한 종료 처리');
    setShowContactForm(false);
    setTargetPos([2, 5, 2]); // INITIAL_CAMERA_POS
    setTargetLook([0, 0, 0]); // INITIAL_CAMERA_LOOK
    setTimeout(() => {
      setFocusedGroup(null);
      setCameraAnimationDone(false);
    }, CAMERA_ANIMATION_DELAY);
  }, [setShowContactForm, setTargetPos, setTargetLook, setFocusedGroup, setCameraAnimationDone]);

  // Radar 모델 클릭 시 카메라 애니메이션 완료 후 처리
  useEffect(() => {
    if (focusedGroup === 'radar' && cameraAnimationDone && !secondaryAnimation && !hasClickedBack) {
      console.log('Radar: 카메라 애니메이션 완료, Contact Form 표시');
      setShowContactForm(true);
    }
  }, [focusedGroup, cameraAnimationDone, secondaryAnimation, hasClickedBack, setShowContactForm]);

  return {
    handleRadarExit,
  };
};
