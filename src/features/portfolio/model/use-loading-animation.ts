import type React from 'react';
import { useEffect } from 'react';
import { LOADING_PROGRESS_STEP, LOADING_PROGRESS_INTERVAL } from '@/entities/portfolio/model/constants';

type UseLoadingAnimationProps = {
  showWorksLoading: boolean;
  showPortfolioOverlay: boolean;
  setLoadingProgress: React.Dispatch<React.SetStateAction<number>>;
  setLoadingBarFullExpand: (expand: boolean) => void;
  setShowPortfolioOverlay: (show: boolean) => void;
  setShowWorksLoading: (show: boolean) => void;
};

export const useLoadingAnimation = (props: UseLoadingAnimationProps) => {
  const {
    showWorksLoading,
    showPortfolioOverlay,
    setLoadingProgress,
    setLoadingBarFullExpand,
    setShowPortfolioOverlay,
    setShowWorksLoading,
  } = props;

  // 로딩 애니메이션 시작
  useEffect(() => {
    if (showWorksLoading && !showPortfolioOverlay) {
      setLoadingProgress(0);
      setLoadingBarFullExpand(false);

      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            console.log('로딩 완료!');
            // 로딩 완료 후 로딩바를 전체 화면으로 확장
            setTimeout(() => {
              console.log('로딩바 전체 화면 확장!');
              setLoadingBarFullExpand(true);
              setTimeout(() => {
                console.log('포트폴리오 갤러리 표시!');
                setShowPortfolioOverlay(true);
                // LoadingOverlay가 전체 화면 확장 애니메이션을 완료한 후에 사라지도록 추가 지연
                setTimeout(() => {
                  setShowWorksLoading(false);
                }, 1500); // 전체 화면 확장 애니메이션 완료 후 추가 지연
              }, 1000); // 전체 화면 확장 애니메이션 시간
            }, 300);
            return 100;
          }
          return prev + LOADING_PROGRESS_STEP; // 4%씩 증가
        });
      }, LOADING_PROGRESS_INTERVAL); // 50ms마다 업데이트

      return () => clearInterval(interval);
    }
  }, [
    showWorksLoading,
    showPortfolioOverlay,
    setLoadingProgress,
    setLoadingBarFullExpand,
    setShowPortfolioOverlay,
    setShowWorksLoading,
  ]);
};
