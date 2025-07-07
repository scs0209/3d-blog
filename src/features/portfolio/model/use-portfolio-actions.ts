import type React from 'react';
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
  setSecondaryAnimation: (animation: boolean) => void;
  setCameraAnimationDone: (done: boolean) => void;
  setHasClickedBack: (clicked: boolean) => void;
  resetToInitialPosition: () => void;
  resetAnimationState: () => void;
  resetOverlayState: () => void;
  resetLoadingState: () => void;
  // 오버레이 상태들
  setShowAboutMeOverlay: (show: boolean) => void;
  setAboutMeClosing: (closing: boolean) => void;
  setShowExperienceOverlay: (show: boolean) => void;
  setExperienceClosing: (closing: boolean) => void;
  setContactClosing: (closing: boolean) => void;
  setShowContactForm: (show: boolean) => void;
  setAboutMeAnimationDone: (done: boolean) => void;
  // 로딩 상태들
  showPortfolioOverlay: boolean;
  showWorksLoading: boolean;
  setShowPortfolioOverlay: (show: boolean) => void;
  setPortfolioExiting: (exiting: boolean) => void;
  setShowExitLoading: (show: boolean) => void;
  setExitLoadingProgress: React.Dispatch<React.SetStateAction<number>>;
  setShowWorksLoading: (show: boolean) => void;
  setLoadingProgress: (progress: number) => void;
  setLoadingBarFullExpand: (expand: boolean) => void;
  setShowPortfolioContent: (show: boolean) => void;
  setShowCards: (show: boolean) => void;
};

export const usePortfolioActions = (props: UsePortfolioActionsProps) => {
  const {
    focusedGroup,
    setFocusedGroup,
    setPulseCenter,
    setPulseActive,
    setTargetPos,
    setTargetLook,
    setCameraAnimationDone,
    setHasClickedBack,
    resetToInitialPosition,
    resetAnimationState,
    resetLoadingState,
    setShowAboutMeOverlay,
    setAboutMeClosing,
    setShowExperienceOverlay,
    setExperienceClosing,
    setContactClosing,
    setShowContactForm,
    setAboutMeAnimationDone,
    showPortfolioOverlay,
    showWorksLoading,
    setShowPortfolioOverlay,
    setShowExitLoading,
    setExitLoadingProgress,
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
    if (showPortfolioOverlay || showWorksLoading) {
      // 포트폴리오 오버레이에서 나가는 복잡한 로직
      setTimeout(() => {
        setTimeout(() => {
          setShowPortfolioOverlay(false);
          setShowExitLoading(true);
          setExitLoadingProgress(100);

          const exitInterval = setInterval(() => {
            setExitLoadingProgress((prev: number) => {
              if (prev <= 0) {
                clearInterval(exitInterval);
                setTimeout(() => {
                  resetLoadingState();
                  resetToInitialPosition();
                  setTimeout(() => {
                    setFocusedGroup(null);
                  }, CAMERA_ANIMATION_DELAY);
                }, 500);
                return 0;
              }
              return prev - 4;
            });
          }, 50);
        }, 1000);
      }, 2000);
    } else if (focusedGroup === 'radar') {
      // Radar 모델인 경우 - Contact Form 역순 애니메이션 시작
      console.log(`handleBack: ${focusedGroup} 모델 닫기 - Contact Form 역순 애니메이션 시작`);
      setContactClosing(true);
      // Contact Form은 바로 닫지 않음 - 역순 애니메이션 완료 후 처리
    } else {
      // 일반적인 뒤로가기 (contactMe 포함)
      resetToInitialPosition();
      setTimeout(() => {
        setFocusedGroup(null);
      }, CAMERA_ANIMATION_DELAY);
    }
    resetAnimationState();
    setHasClickedBack(true);
  }, [
    showPortfolioOverlay,
    showWorksLoading,
    setShowPortfolioOverlay,
    setShowExitLoading,
    setExitLoadingProgress,
    resetLoadingState,
    resetToInitialPosition,
    setFocusedGroup,
    resetAnimationState,
    setHasClickedBack,
    focusedGroup,
    setContactClosing,
  ]);

  const handleAboutMeClose = useCallback(() => {
    console.log('handleAboutMeClose 호출됨');
    setAboutMeAnimationDone(true);

    // Work 모델인 경우 AboutMe 닫힘 애니메이션 시작
    // 오버레이는 유지하되 isClosing 상태만 true로 설정
    if (focusedGroup === 'work') {
      setAboutMeClosing(true);
      // 오버레이는 바로 닫지 않음 - 애니메이션 완료 후 onClose에서 처리
    } else {
      // 다른 모델들은 바로 초기 위치로 복귀
      setShowAboutMeOverlay(false);
      resetToInitialPosition();
      setTimeout(() => {
        setFocusedGroup(null);
        setAboutMeClosing(false);
        setAboutMeAnimationDone(false);
        setCameraAnimationDone(false);
      }, CAMERA_ANIMATION_DELAY);
    }
  }, [
    setAboutMeAnimationDone,
    setShowAboutMeOverlay,
    focusedGroup,
    setAboutMeClosing,
    resetToInitialPosition,
    setFocusedGroup,
    setCameraAnimationDone,
  ]);

  const handleExperienceClose = useCallback(() => {
    console.log('handleExperienceClose 호출됨');

    // Experience 모델인 경우 Experience 닫힘 애니메이션 시작
    // 오버레이는 유지하되 isClosing 상태만 true로 설정
    if (focusedGroup === 'experience') {
      setExperienceClosing(true);
      // 오버레이는 바로 닫지 않음 - 애니메이션 완료 후 onClose에서 처리
    } else {
      // 다른 모델들은 바로 초기 위치로 복귀
      setShowExperienceOverlay(false);
      resetToInitialPosition();
      setTimeout(() => {
        setFocusedGroup(null);
        setExperienceClosing(false);
        setCameraAnimationDone(false);
      }, CAMERA_ANIMATION_DELAY);
    }
  }, [
    setShowExperienceOverlay,
    focusedGroup,
    setExperienceClosing,
    resetToInitialPosition,
    setFocusedGroup,
    setCameraAnimationDone,
  ]);

  const handleContactClose = useCallback(() => {
    console.log('handleContactClose 호출됨 - Contact Form 역순 애니메이션 시작');
    setContactClosing(true);
  }, [setContactClosing]);

  return {
    handleGroupClick,
    handleBack,
    handleAboutMeClose,
    handleExperienceClose,
    handleContactClose,
  };
};
