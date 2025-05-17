'use client';

import { useThree } from '@react-three/fiber';
import { useControls } from 'leva';
import { useEffect } from 'react';

export const CameraController = () => {
  const { camera } = useThree();

  // Leva로 카메라의 위치와 zoom을 제어합니다.
  const { x, y, z, zoom } = useControls('Camera Position', {
    x: { value: -5.3, min: -20, max: 20, step: 0.1 },
    y: { value: 3.1, min: -10, max: 10, step: 0.1 },
    z: { value: -6.7, min: -20, max: 20, step: 0.1 },
    zoom: { value: 0.9, min: 0.1, max: 5, step: 0.1 },
  });

  // 카메라의 위치와 zoom 업데이트
  useEffect(() => {
    camera.position.set(x, y, z);
    camera.zoom = zoom;
    camera.updateProjectionMatrix();
  }, [x, y, z, zoom, camera]);

  return null;
};
