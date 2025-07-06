import { useCallback } from 'react';
import type { FocusedGroup, Position3D } from '@/entities/portfolio/model/types';
import {
  CAMERA_ANIMATION_DELAY,
  INITIAL_CAMERA_POS,
  INITIAL_CAMERA_LOOK,
  GROUP_CAMERA_TARGETS,
} from '@/entities/portfolio/model/constants';

type UseContactCameraAnimationProps = {
  setShowContactForm: (show: boolean) => void;
  setTargetPos: (pos: Position3D) => void;
  setTargetLook: (look: Position3D) => void;
  setFocusedGroup: (group: FocusedGroup) => void;
  setContactClosing: (closing: boolean) => void;
  setCameraAnimationDone: (done: boolean) => void;
  setSecondaryAnimation: (secondary: boolean) => void;
  focusedGroup: FocusedGroup;
};

export const useContactCameraAnimation = (props: UseContactCameraAnimationProps) => {
  const {
    setShowContactForm,
    setTargetPos,
    setTargetLook,
    setFocusedGroup,
    setContactClosing,
    setCameraAnimationDone,
    setSecondaryAnimation,
    focusedGroup,
  } = props;

  // Contact Form 역순 애니메이션 완료 후 보조 애니메이션 역순 시작
  const handleContactAnimationComplete = useCallback(() => {
    console.log('Contact: Contact Form 역순 애니메이션 완료, 보조 애니메이션 역순 시작');
    setShowContactForm(false);

    // 보조 애니메이션 역순: 두 번째 위치 → 첫 번째 위치
    if (focusedGroup && GROUP_CAMERA_TARGETS[focusedGroup]) {
      const target = GROUP_CAMERA_TARGETS[focusedGroup];
      const firstPos: Position3D = [
        target.modelPosition[0] + target.offset[0],
        target.modelPosition[1] + target.offset[1],
        target.modelPosition[2] + target.offset[2],
      ];

      setSecondaryAnimation(true);
      setTargetPos(firstPos);
      setTargetLook(target.lookAt);
      setCameraAnimationDone(false);

      // 보조 애니메이션 역순 완료 후 초기 위치로 복귀
      setTimeout(() => {
        setSecondaryAnimation(false);
        setTargetPos(INITIAL_CAMERA_POS);
        setTargetLook(INITIAL_CAMERA_LOOK);
        setCameraAnimationDone(false);

        // 초기 위치 복귀 완료 후 완전 초기화
        setTimeout(() => {
          setFocusedGroup(null);
          setContactClosing(false);
        }, CAMERA_ANIMATION_DELAY);
      }, CAMERA_ANIMATION_DELAY);
    } else {
      // 타겟이 없는 경우 바로 초기 위치로 복귀
      setContactClosing(false);
      setTargetPos(INITIAL_CAMERA_POS);
      setTargetLook(INITIAL_CAMERA_LOOK);

      setTimeout(() => {
        setFocusedGroup(null);
        setCameraAnimationDone(false);
      }, CAMERA_ANIMATION_DELAY);
    }
  }, [
    setShowContactForm,
    setContactClosing,
    setTargetPos,
    setTargetLook,
    setFocusedGroup,
    setCameraAnimationDone,
    setSecondaryAnimation,
    focusedGroup,
  ]);

  return {
    handleContactAnimationComplete,
  };
};
