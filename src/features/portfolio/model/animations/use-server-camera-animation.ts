import { useEffect } from 'react';
import type { FocusedGroup } from '@/entities/portfolio/model/types';

type UseServerCameraAnimationProps = {
  focusedGroup: FocusedGroup;
  cameraAnimationDone: boolean;
  secondaryAnimation: boolean;
  hasClickedBack: boolean;
  setShowWorksLoading: (show: boolean) => void;
  setShowCards: (show: boolean) => void;
};

export const useServerCameraAnimation = (props: UseServerCameraAnimationProps) => {
  const { focusedGroup, cameraAnimationDone, secondaryAnimation, hasClickedBack, setShowWorksLoading, setShowCards } =
    props;

  // Server 모델 클릭 시 카메라 애니메이션 완료 후 처리
  useEffect(() => {
    if (focusedGroup === 'server' && cameraAnimationDone && !secondaryAnimation && !hasClickedBack) {
      console.log('Server: 카메라 애니메이션 완료, Works 로딩 시작');
      setShowWorksLoading(true);
      setShowCards(false); // 카드 상태 초기화
    }
  }, [focusedGroup, cameraAnimationDone, secondaryAnimation, hasClickedBack, setShowWorksLoading, setShowCards]);

  return {};
};
