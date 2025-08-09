import type React from 'react';
import { useEffect } from 'react';
import {
  LOADING_PROGRESS_STEP,
  LOADING_PROGRESS_INTERVAL,
  BAR_EXPAND_ANIMATION_DURATION,
  OVERLAY_TRANSITION_DELAY,
  INITIAL_DELAY,
} from '@/entities/portfolio/model/constants';
import type { OverlayKey, OverlayState } from './use-overlay-state';

type UseLoadingAnimationProps = {
  overlays: OverlayState;
  openOverlay: (key: OverlayKey) => void;
  showWorksLoading: boolean;
  setLoadingProgress: React.Dispatch<React.SetStateAction<number>>;
  setLoadingBarFullExpand: (expand: boolean) => void;
  setShowWorksLoading: (show: boolean) => void;
};

export const useLoadingAnimation = (props: UseLoadingAnimationProps) => {
  const { overlays, openOverlay, showWorksLoading, setLoadingProgress, setLoadingBarFullExpand, setShowWorksLoading } =
    props;

  // 로딩 애니메이션 시작
  useEffect(() => {
    if (showWorksLoading && !overlays.portfolio?.isOpen) {
      setLoadingProgress(0);
      setLoadingBarFullExpand(false);

      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            // 로딩 완료 후 로딩바를 전체 화면으로 확장
            setTimeout(() => {
              setLoadingBarFullExpand(true);
              setTimeout(() => {
                openOverlay('portfolio');
                // LoadingOverlay가 전체 화면 확장 애니메이션을 완료한 후에 사라지도록 추가 지연
                setTimeout(() => {
                  setShowWorksLoading(false);
                }, OVERLAY_TRANSITION_DELAY);
              }, BAR_EXPAND_ANIMATION_DURATION);
            }, INITIAL_DELAY);
            return 100;
          }
          return prev + LOADING_PROGRESS_STEP; // 4%씩 증가
        });
      }, LOADING_PROGRESS_INTERVAL); // 50ms마다 업데이트

      return () => clearInterval(interval);
    }
  }, [
    showWorksLoading,
    setLoadingProgress,
    setLoadingBarFullExpand,
    setShowWorksLoading,
    overlays.portfolio?.isOpen,
    openOverlay,
  ]);
};
