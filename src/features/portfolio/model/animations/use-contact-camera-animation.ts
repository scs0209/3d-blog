import { useCallback } from 'react';
import type { FocusedGroup, Position3D } from '@/entities/portfolio/model/types';
import { GROUP_CAMERA_TARGETS } from '@/entities/portfolio/model/constants';

type UseContactCameraAnimationProps = {
  setShowContactForm: (show: boolean) => void;
  setTargetPos: (pos: Position3D) => void;
  setTargetLook: (look: Position3D) => void;
  setSecondaryAnimation: (secondary: boolean) => void;
  setCameraAnimationDone: (done: boolean) => void;
  focusedGroup: FocusedGroup;
};

export const useContactCameraAnimation = (props: UseContactCameraAnimationProps) => {
  const {
    setShowContactForm,
    setTargetPos,
    setTargetLook,
    setSecondaryAnimation,
    setCameraAnimationDone,
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

      // 나머지는 CameraController의 useFrame에서 자동 처리
    }
  }, [setShowContactForm, setTargetPos, setTargetLook, setSecondaryAnimation, setCameraAnimationDone, focusedGroup]);

  return {
    handleContactAnimationComplete,
  };
};
