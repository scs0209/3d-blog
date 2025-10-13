import { usePortfolioState } from './use-portfolio-state';
import { useCameraAnimation } from './use-camera-animation';
import { useOverlayState } from './use-overlay-state';
import { useLoadingState } from './use-loading-state';
import { usePortfolioActions } from './use-portfolio-actions';
import { useLoadingAnimation } from './use-loading-animation';

// 1. handleGroupClick을 하면 애니메이션이 시작됨
export const usePortfolio = () => {
  // 상태 관리 훅들
  const portfolioState = usePortfolioState();
  const cameraState = useCameraAnimation();
  const overlayState = useOverlayState();
  const loadingState = useLoadingState();

  // 액션 훅
  const actions = usePortfolioActions({
    ...portfolioState,
    ...cameraState,
    ...overlayState,
    ...loadingState,
    setSecondaryAnimation: cameraState.setSecondaryAnimation,
  });

  // 로딩 애니메이션 훅
  useLoadingAnimation({
    showWorksLoading: loadingState.showWorksLoading,
    overlays: overlayState.overlays,
    openOverlay: overlayState.openOverlay,
    setLoadingProgress: loadingState.setLoadingProgress,
    setLoadingBarFullExpand: loadingState.setLoadingBarFullExpand,
    setShowWorksLoading: loadingState.setShowWorksLoading,
  });

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  // 포트폴리오 EXIT 핸들러
  const handlePortfolioExit = async () => {
    // 1단계: 카드들만 사라지는 애니메이션 시작
    loadingState.setPortfolioExiting(true);

    // 2단계: 카드가 모두 사라진 후 창 닫기 (1100ms 대기)
    await delay(1100);

    overlayState.closeOverlay('portfolio');
    loadingState.setLoadingBarFullExpand(false);
    loadingState.setShowWorksLoading(false); // 명시적으로 로딩 상태 해제

    // 3단계: Exit 로딩 시작 (300ms 대기)
    await delay(300);

    loadingState.setShowExitLoading(true);
    loadingState.setExitLoadingProgress(100);

    // 4단계: Exit 로딩 진행 (50ms 간격으로 4씩 감소)
    const exitInterval = setInterval(() => {
      loadingState.setExitLoadingProgress((prev: number) => {
        if (prev <= 0) {
          clearInterval(exitInterval);
          // 5단계: 최종 상태 리셋 (300ms 대기 후)
          delay(300).then(() => {
            loadingState.resetLoadingState();
            cameraState.resetToInitialPosition();
            // 6단계: focusedGroup 리셋 (3000ms 대기 후)
            delay(3000).then(() => {
              portfolioState.setFocusedGroup(null);
            });
          });
          return 0;
        }
        return prev - 4;
      });
    }, 50);
  };

  // 포트폴리오 애니메이션 완료 핸들러
  const handlePortfolioAnimationComplete = async () => {
    // 창이 완전히 뜬 후 카드 표시
    if (!loadingState.portfolioExiting) {
      await delay(200);
      loadingState.setShowCards(true);
    }
  };

  return {
    // 상태들
    ...portfolioState,
    ...cameraState,
    ...overlayState,
    ...loadingState,

    // 액션들
    ...actions,
    handlePortfolioExit,
    handlePortfolioAnimationComplete,
  };
};
