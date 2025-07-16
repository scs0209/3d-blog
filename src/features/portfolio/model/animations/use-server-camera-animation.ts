import { useEffect } from 'react';
import type { FocusedGroup } from '@/entities/portfolio/model/types';

type UseServerCameraAnimationProps = {
  focusedGroup: FocusedGroup;
  cameraAnimationDone: boolean;
  secondaryAnimation: boolean;
  hasClickedBack: boolean;
  setShowWorksLoading: (show: boolean) => void;
};

export const useServerCameraAnimation = (props: UseServerCameraAnimationProps) => {
  const { focusedGroup, cameraAnimationDone, secondaryAnimation, hasClickedBack, setShowWorksLoading } = props;

  // Server 모델 클릭 시 카메라 애니메이션 완료 후 처리
  useEffect(() => {
    if (focusedGroup === 'server' && cameraAnimationDone && !secondaryAnimation && !hasClickedBack) {
      console.log('Server: 카메라 애니메이션 완료, Works 로딩 시작');
      setShowWorksLoading(true);
    }
  }, [focusedGroup, cameraAnimationDone, secondaryAnimation, hasClickedBack, setShowWorksLoading]);

  // Server 모델의 보조 애니메이션 완료 후 처리
  useEffect(() => {
    if (focusedGroup === 'server' && cameraAnimationDone && secondaryAnimation && !hasClickedBack) {
      console.log('Server: 보조 애니메이션 완료, 카메라 제어 정리 완료');
      // 보조 애니메이션이 완료되면 카메라가 더 이상 움직이지 않도록 함
    }
  }, [focusedGroup, cameraAnimationDone, secondaryAnimation, hasClickedBack]);

  return {};
};
