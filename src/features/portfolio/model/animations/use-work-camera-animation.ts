import { useEffect, useCallback } from 'react';
import type { FocusedGroup, Position3D } from '@/entities/portfolio/model/types';
import {
  GROUP_CAMERA_TARGETS,
  CAMERA_ANIMATION_DELAY,
  INITIAL_CAMERA_POS,
  INITIAL_CAMERA_LOOK,
} from '@/entities/portfolio/model/constants';
import type { OverlayState, OverlayKey } from '../use-overlay-state';

type UseWorkCameraAnimationProps = {
  overlays: OverlayState;
  openOverlay: (key: OverlayKey) => void;
  closeOverlay: (key: OverlayKey) => void;
  finishClosing: (key: OverlayKey) => void;
  focusedGroup: FocusedGroup;
  cameraAnimationDone: boolean;
  secondaryAnimation: boolean;
  hasClickedBack: boolean;
  setSecondaryAnimation: (animation: boolean) => void;
  setTargetPos: (pos: Position3D) => void;
  setTargetLook: (look: Position3D) => void;
  setFocusedGroup: (group: FocusedGroup) => void;
  setCameraAnimationDone: (done: boolean) => void;
};

export const useWorkCameraAnimation = (props: UseWorkCameraAnimationProps) => {
  const {
    overlays,
    openOverlay,
    closeOverlay,
    finishClosing,
    focusedGroup,
    cameraAnimationDone,
    secondaryAnimation,
    hasClickedBack,
    setSecondaryAnimation,
    setTargetPos,
    setTargetLook,
    setFocusedGroup,
    setCameraAnimationDone,
  } = props;

  // Work 모델의 보조 애니메이션 처리
  const triggerSecondaryAnimation = useCallback(() => {
    const target = GROUP_CAMERA_TARGETS.work;
    if (target?.secondaryOffset && target?.secondaryLookAt) {
      setSecondaryAnimation(true);
      // 처음 모델 위치 + secondaryOffset 위치로 이동
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
    // focusedGroup === 'work' 이고 첫 번째 애니메이션이 완료되었고, AboutMe가 닫히지 않았고, 보조 애니메이션이 진행중이지 않고, 뒤로가기 버튼이 클릭되지 않았다면 aboutMeOverlay 표시
    if (
      focusedGroup === 'work' &&
      cameraAnimationDone &&
      !overlays.aboutMe?.isClosing &&
      !secondaryAnimation &&
      !hasClickedBack
    ) {
      openOverlay('aboutMe');
    }
  }, [focusedGroup, cameraAnimationDone, overlays.aboutMe?.isClosing, secondaryAnimation, hasClickedBack, openOverlay]);

  // AboutMePage 애니메이션 완료 후 호출될 핸들러
  const handleAboutMeAnimationComplete = useCallback(() => {
    // AboutMePage 애니메이션 완료 후 처리
    closeOverlay('aboutMe');

    // 원래 줌인 위치로
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
  }, [closeOverlay, setSecondaryAnimation, setTargetPos, setTargetLook]);

  // Work 모델의 완전한 종료 처리
  const handleWorkExit = useCallback(() => {
    // 초기 위치로
    setTargetPos(INITIAL_CAMERA_POS);
    setTargetLook(INITIAL_CAMERA_LOOK);

    // 초기 위치로 이동 후 처리
    setTimeout(() => {
      setFocusedGroup(null);

      closeOverlay('aboutMe');
      finishClosing('aboutMe');
      setCameraAnimationDone(false);
    }, CAMERA_ANIMATION_DELAY);
  }, [setTargetPos, setTargetLook, setFocusedGroup, closeOverlay, finishClosing, setCameraAnimationDone]);

  return {
    triggerSecondaryAnimation,
    handleWorkAboutMeClose,
    handleWorkExit,
    handleAboutMeAnimationComplete,
  };
};
