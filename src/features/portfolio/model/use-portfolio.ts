import { usePortfolioState } from './use-portfolio-state';
import { useCameraAnimation } from './use-camera-animation';
import { useOverlayState } from './use-overlay-state';
import { useLoadingState } from './use-loading-state';
import { usePortfolioActions } from './use-portfolio-actions';
import { useLoadingAnimation } from './use-loading-animation';

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
  });

  // 로딩 애니메이션 훅
  useLoadingAnimation({
    showWorksLoading: loadingState.showWorksLoading,
    showPortfolioOverlay: loadingState.showPortfolioOverlay,
    setLoadingProgress: loadingState.setLoadingProgress,
    setLoadingBarFullExpand: loadingState.setLoadingBarFullExpand,
    setShowPortfolioOverlay: loadingState.setShowPortfolioOverlay,
    setShowWorksLoading: loadingState.setShowWorksLoading,
  });

  // 포트폴리오 EXIT 핸들러
  const handlePortfolioExit = () => {
    console.log('EXIT 버튼 클릭됨');

    // 1단계: 카드들만 사라지는 애니메이션 시작
    loadingState.setPortfolioExiting(true);

    // 2단계: 카드가 모두 사라진 후 창 닫기
    setTimeout(() => {
      loadingState.setShowPortfolioOverlay(false);
      loadingState.setLoadingBarFullExpand(false);

      setTimeout(() => {
        loadingState.setShowExitLoading(true);
        loadingState.setExitLoadingProgress(100);

        const exitInterval = setInterval(() => {
          loadingState.setExitLoadingProgress((prev: number) => {
            if (prev <= 0) {
              clearInterval(exitInterval);
              setTimeout(() => {
                loadingState.resetLoadingState();
                cameraState.resetToInitialPosition();
                setTimeout(() => {
                  portfolioState.setFocusedGroup(null);
                }, 3000);
              }, 300);
              return 0;
            }
            return prev - 4;
          });
        }, 50);
      }, 300);
    }, 1100); // 카드가 모두 사라진 후
  };

  // 포트폴리오 애니메이션 완료 핸들러
  const handlePortfolioAnimationComplete = () => {
    // 창이 완전히 뜬 후 카드 표시
    if (!loadingState.portfolioExiting) {
      setTimeout(() => {
        loadingState.setShowCards(true);
      }, 200);
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
