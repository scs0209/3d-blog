import { useCallback } from 'react';
import type { FocusedGroup } from '@/entities/portfolio/model/types';
import { GROUP_CAMERA_TARGETS, PULSE_DURATION, CAMERA_ANIMATION_DELAY } from '@/entities/portfolio/model/constants';
import type { OverlayKey, OverlayState } from './use-overlay-state';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type UsePortfolioActionsProps = {
  focusedGroup: FocusedGroup;
  setFocusedGroup: (group: FocusedGroup) => void;
  setPulseCenter: (center: [number, number, number] | null) => void;
  setPulseActive: (active: boolean) => void;
  setTargetPos: (pos: [number, number, number]) => void;
  setTargetLook: (look: [number, number, number]) => void;
  setSecondaryAnimation: (animation: boolean) => void;
  setCameraAnimationDone: (done: boolean) => void;
  setHasClickedBack: (clicked: boolean) => void;
  resetToInitialPosition: () => void;
  resetAnimationState: () => void;
  // 오버레이 관련 함수들
  closeOverlay: (key: OverlayKey) => void;
  openOverlay: (key: OverlayKey) => void;
  finishClosing: (key: OverlayKey) => void;
  // 오버레이 상태들
  overlays: OverlayState;
};

export const usePortfolioActions = (props: UsePortfolioActionsProps) => {
  const {
    focusedGroup,
    setFocusedGroup,
    setPulseCenter,
    setPulseActive,
    setTargetPos,
    setTargetLook,
    openOverlay,
    closeOverlay,
    finishClosing,
    setCameraAnimationDone,
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

  const handleAboutMeClose = useCallback(() => {
    finishClosing('aboutMe');

    // Work 모델인 경우 AboutMe 닫힘 애니메이션 시작
    // 오버레이는 유지하되 isClosing 상태만 true로 설정
    if (focusedGroup === 'work') {
      closeOverlay('aboutMe');
      // 오버레이는 바로 닫지 않음 - 애니메이션 완료 후 onClose에서 처리
    } else {
      // 다른 모델들은 바로 초기 위치로 복귀
      closeOverlay('aboutMe');
      resetToInitialPosition();
      delay(CAMERA_ANIMATION_DELAY).then(() => {
        setFocusedGroup(null);
        finishClosing('aboutMe');
        setCameraAnimationDone(false);
      });
    }
  }, [focusedGroup, closeOverlay, resetToInitialPosition, setFocusedGroup, finishClosing, setCameraAnimationDone]);

  const handleExperienceClose = useCallback(() => {
    // Experience 모델인 경우 Experience 닫힘 애니메이션 시작
    // 오버레이는 유지하되 isClosing 상태만 true로 설정
    if (focusedGroup === 'experience') {
      openOverlay('experience');
      // 오버레이는 바로 닫지 않음 - 애니메이션 완료 후 onClose에서 처리
    } else {
      // 다른 모델들은 바로 초기 위치로 복귀
      closeOverlay('experience');
      resetToInitialPosition();
      delay(CAMERA_ANIMATION_DELAY).then(() => {
        setFocusedGroup(null);
        finishClosing('experience');
        setCameraAnimationDone(false);
      });
    }
  }, [
    focusedGroup,
    openOverlay,
    closeOverlay,
    resetToInitialPosition,
    setFocusedGroup,
    finishClosing,
    setCameraAnimationDone,
  ]);

  const handleContactClose = useCallback(() => {
    closeOverlay('contact');
  }, [closeOverlay]);

  const handleSkillsClose = useCallback(async () => {
    closeOverlay('skills');

    // 카메라 초기 위치로 복귀
    resetToInitialPosition();

    // 상태 리셋 (카메라 애니메이션 완료 대기)
    await delay(CAMERA_ANIMATION_DELAY);
    setFocusedGroup(null);
    setCameraAnimationDone(false);
  }, [closeOverlay, resetToInitialPosition, setFocusedGroup, setCameraAnimationDone]);

  return {
    handleGroupClick,
    handleBack,
    handleAboutMeClose,
    handleExperienceClose,
    handleContactClose,
    handleSkillsClose,
  };
};
