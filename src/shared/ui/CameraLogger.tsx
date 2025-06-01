'use client';

import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import type { OrbitControls } from 'three-stdlib';

export const CameraLogger = () => {
  const { camera, controls } = useThree();
  const orbitControls = controls as OrbitControls;

  useEffect(() => {
    const logPosition = () => {
      console.log('Camera Position:', camera.position);
    };

    logPosition();
    orbitControls?.addEventListener('change', logPosition); // 카메라 이동 시 로그 출력

    return () => {
      orbitControls?.removeEventListener('change', logPosition);
    };
  }, [camera, orbitControls]);

  return null;
};
