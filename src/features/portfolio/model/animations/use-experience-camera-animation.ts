import { useEffect, useCallback } from 'react';
import type { FocusedGroup, Position3D } from '@/entities/portfolio/model/types';
import { CAMERA_ANIMATION_DELAY } from '@/entities/portfolio/model/constants';

type UseExperienceCameraAnimationProps = {
  focusedGroup: FocusedGroup;
  cameraAnimationDone: boolean;
  experienceClosing: boolean;
  secondaryAnimation: boolean;
  hasClickedBack: boolean;
  setShowExperienceOverlay: (show: boolean) => void;
  setTargetPos: (pos: Position3D) => void;
  setTargetLook: (look: Position3D) => void;
  setFocusedGroup: (group: FocusedGroup) => void;
  setExperienceClosing: (closing: boolean) => void;
  setCameraAnimationDone: (done: boolean) => void;
};

export const useExperienceCameraAnimation = (props: UseExperienceCameraAnimationProps) => {
  const {
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
  } = props;

  // ExperiencePage 애니메이션 완료 후 호출될 핸들러
  const handleExperienceAnimationComplete = useCallback(() => {
    console.log('Experience: ExperiencePage 애니메이션 완료, 오버레이 닫고 카메라 애니메이션 시작');
    setShowExperienceOverlay(false);

    // 바로 초기 위치로 복귀
    setTargetPos([2, 5, 2]); // INITIAL_CAMERA_POS
    setTargetLook([0, 0, 0]); // INITIAL_CAMERA_LOOK
    setTimeout(() => {
      setFocusedGroup(null);
      setExperienceClosing(false);
      setCameraAnimationDone(false);
    }, CAMERA_ANIMATION_DELAY);
  }, [
    setShowExperienceOverlay,
    setTargetPos,
    setTargetLook,
    setFocusedGroup,
    setExperienceClosing,
    setCameraAnimationDone,
  ]);

  // Experience 모델의 완전한 종료 처리
  const handleExperienceExit = useCallback(() => {
    console.log('Experience: 완전한 종료 처리');
    setTargetPos([2, 5, 2]); // INITIAL_CAMERA_POS
    setTargetLook([0, 0, 0]); // INITIAL_CAMERA_LOOK
    setTimeout(() => {
      setFocusedGroup(null);
      setExperienceClosing(false);
      setCameraAnimationDone(false);
    }, CAMERA_ANIMATION_DELAY);
  }, [setTargetPos, setTargetLook, setFocusedGroup, setExperienceClosing, setCameraAnimationDone]);

  // Experience 모델 클릭 시 카메라 애니메이션 완료 후 처리
  useEffect(() => {
    if (
      focusedGroup === 'experience' &&
      cameraAnimationDone &&
      !experienceClosing &&
      !secondaryAnimation &&
      !hasClickedBack
    ) {
      console.log('Experience: 카메라 애니메이션 완료, Experience 오버레이 표시');
      setShowExperienceOverlay(true);
    }
  }, [
    focusedGroup,
    cameraAnimationDone,
    experienceClosing,
    secondaryAnimation,
    hasClickedBack,
    setShowExperienceOverlay,
  ]);

  // Experience 모델의 닫힘 감지 및 처리
  useEffect(() => {
    if (focusedGroup === 'experience' && experienceClosing) {
      console.log('Experience: 닫힘 감지, 초기 위치로 복귀');
      handleExperienceExit();
    }
  }, [focusedGroup, experienceClosing, handleExperienceExit]);

  return {
    handleExperienceExit,
    handleExperienceAnimationComplete,
  };
};
