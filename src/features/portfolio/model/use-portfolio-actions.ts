import { useCallback } from 'react';
import type { FocusedGroup } from '@/entities/portfolio/model/types';
import { GROUP_CAMERA_TARGETS, PULSE_DURATION, CAMERA_ANIMATION_DELAY } from '@/entities/portfolio/model/constants';

type UsePortfolioActionsProps = {
  focusedGroup: FocusedGroup;
  setFocusedGroup: (group: FocusedGroup) => void;
  setPulseCenter: (center: [number, number, number] | null) => void;
  setPulseActive: (active: boolean) => void;
  setTargetPos: (pos: [number, number, number]) => void;
  setTargetLook: (look: [number, number, number]) => void;
  setHasClickedBack: (clicked: boolean) => void;
  resetToInitialPosition: () => void;
  resetAnimationState: () => void;
};

export const usePortfolioActions = (props: UsePortfolioActionsProps) => {
  const {
    focusedGroup,
    setFocusedGroup,
    setPulseCenter,
    setPulseActive,
    setTargetPos,
    setTargetLook,
    setHasClickedBack,
    resetToInitialPosition,
    resetAnimationState,
  } = props;

  const handleGroupClick = useCallback(
    (groupName: FocusedGroup) => {
      if (groupName === focusedGroup) {
        return;
      }
      setFocusedGroup(groupName);
      resetAnimationState();
      setHasClickedBack(false);

      if (groupName && GROUP_CAMERA_TARGETS[groupName]) {
        const target = GROUP_CAMERA_TARGETS[groupName];
        setPulseCenter(target?.pulse ?? null);
        setPulseActive(true);
        setTimeout(() => {
          setPulseActive(false);
          if (target) {
            // 모델 위치에 offset을 더해서 카메라 위치 계산
            const newPos: [number, number, number] = [
              target.modelPosition[0] + target.offset[0],
              target.modelPosition[1] + target.offset[1],
              target.modelPosition[2] + target.offset[2],
            ];
            setTargetPos(newPos);
            setTargetLook(target.lookAt);
          }
        }, PULSE_DURATION);
      }
    },
    [
      focusedGroup,
      setFocusedGroup,
      resetAnimationState,
      setHasClickedBack,
      setPulseCenter,
      setPulseActive,
      setTargetPos,
      setTargetLook,
    ],
  );

  const handleBack = useCallback(() => {
    resetToInitialPosition();
    setTimeout(() => {
      setFocusedGroup(null);
    }, CAMERA_ANIMATION_DELAY);

    resetAnimationState();
    setHasClickedBack(true);
  }, [resetToInitialPosition, setFocusedGroup, resetAnimationState, setHasClickedBack]);

  return {
    handleGroupClick,
    handleBack,
  };
};
