'use client';

import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';

// 현재 카메라 포지션 확인용
export const CameraLogger = () => {
  const { camera, controls } = useThree();

  useEffect(() => {
    const logPosition = () => {
      console.log('Camera Position:', camera.position);
    };

    logPosition();
    controls?.addEventListener('change', logPosition); // 카메라 이동 시 로그 출력

    return () => {
      controls?.removeEventListener('change', logPosition);
    };
  }, [camera, controls]);

  return null;
};
