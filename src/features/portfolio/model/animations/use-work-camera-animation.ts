import { useEffect, useCallback } from 'react';
import type { FocusedGroup, Position3D } from '@/entities/portfolio/model/types';
import { GROUP_CAMERA_TARGETS, CAMERA_ANIMATION_DELAY } from '@/entities/portfolio/model/constants';

type UseWorkCameraAnimationProps = {
  focusedGroup: FocusedGroup;
  cameraAnimationDone: boolean;
  aboutMeClosing: boolean;
  secondaryAnimation: boolean;
  hasClickedBack: boolean;
  setShowAboutMeOverlay: (show: boolean) => void;
  setSecondaryAnimation: (animation: boolean) => void;
  setTargetPos: (pos: Position3D) => void;
  setTargetLook: (look: Position3D) => void;
  setFocusedGroup: (group: FocusedGroup) => void;
  setAboutMeClosing: (closing: boolean) => void;
  setAboutMeAnimationDone: (done: boolean) => void;
  setCameraAnimationDone: (done: boolean) => void;
};

export const useWorkCameraAnimation = (props: UseWorkCameraAnimationProps) => {
  const {
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
  } = props;

  // Work 모델의 보조 애니메이션 처리
  const triggerSecondaryAnimation = useCallback(() => {
    const target = GROUP_CAMERA_TARGETS.work;
    if (target?.secondaryOffset && target?.secondaryLookAt) {
      console.log('Work: 보조 애니메이션 시작');
      setSecondaryAnimation(true);
      const newPos: Position3D = [
        target.modelPosition[0] + target.secondaryOffset[0],
        target.modelPosition[1] + target.secondaryOffset[1],
        target.modelPosition[2] + target.secondaryOffset[2],
      ];
      setTargetPos(newPos);
      setTargetLook(target.secondaryLookAt);
    }
  }, [setSecondaryAnimation, setTargetPos, setTargetLook]);

  // Work 모델의 AboutMe 닫힘 처리
  const handleWorkAboutMeClose = useCallback(() => {
    console.log('Work: AboutMe 닫힘 처리 시작');
    const target = GROUP_CAMERA_TARGETS.work;

    if (target?.secondaryOffset && target?.secondaryLookAt) {
      setSecondaryAnimation(true);
      // 먼저 원래 줌인 위치로
      const newPos: Position3D = [
        target.modelPosition[0] + target.offset[0],
        target.modelPosition[1] + target.offset[1],
        target.modelPosition[2] + target.offset[2],
      ];
      setTargetPos(newPos);
      setTargetLook(target.lookAt);
    }
  }, [setSecondaryAnimation, setTargetPos, setTargetLook]);

  // Work 모델 클릭 시 카메라 애니메이션 완료 후 처리
  useEffect(() => {
    if (focusedGroup === 'work' && cameraAnimationDone && !aboutMeClosing && !secondaryAnimation && !hasClickedBack) {
      console.log('Work: 카메라 애니메이션 완료, AboutMe 오버레이 표시');
      setShowAboutMeOverlay(true);
    }
  }, [focusedGroup, cameraAnimationDone, aboutMeClosing, secondaryAnimation, hasClickedBack, setShowAboutMeOverlay]);

  // AboutMePage 애니메이션 완료 후 호출될 핸들러
  const handleAboutMeAnimationComplete = useCallback(() => {
    console.log('Work: AboutMePage 애니메이션 완료, 오버레이 닫고 카메라 애니메이션 시작');
    setShowAboutMeOverlay(false);

    const target = GROUP_CAMERA_TARGETS.work;
    if (target?.secondaryOffset && target?.secondaryLookAt) {
      setSecondaryAnimation(true);
      // 먼저 원래 줌인 위치로
      const newPos: Position3D = [
        target.modelPosition[0] + target.offset[0],
        target.modelPosition[1] + target.offset[1],
        target.modelPosition[2] + target.offset[2],
      ];
      setTargetPos(newPos);
      setTargetLook(target.lookAt);
    }
  }, [setShowAboutMeOverlay, setSecondaryAnimation, setTargetPos, setTargetLook]);

  // Work 모델의 완전한 종료 처리
  const handleWorkExit = useCallback(() => {
    console.log('Work: 완전한 종료 처리');
    setTargetPos([2, 5, 2]); // INITIAL_CAMERA_POS
    setTargetLook([0, 0, 0]); // INITIAL_CAMERA_LOOK
    setTimeout(() => {
      setFocusedGroup(null);
      setAboutMeClosing(false);
      setAboutMeAnimationDone(false);
      setCameraAnimationDone(false);
    }, CAMERA_ANIMATION_DELAY);
  }, [
    setTargetPos,
    setTargetLook,
    setFocusedGroup,
    setAboutMeClosing,
    setAboutMeAnimationDone,
    setCameraAnimationDone,
  ]);

  return {
    triggerSecondaryAnimation,
    handleWorkAboutMeClose,
    handleWorkExit,
    handleAboutMeAnimationComplete,
  };
};
