'use client';

import { useThree } from '@react-three/fiber';
import { useControls } from 'leva';
import { useEffect } from 'react';

export const LevaCameraController = () => {
  const { camera } = useThree();
  const { x, y, z } = useControls('Camera', {
    x: { value: 0, min: -10, max: 10, step: 0.01 },
    y: { value: 1, min: -10, max: 10, step: 0.01 },
    z: { value: 10, min: 0, max: 20, step: 0.01 },
  });

  useEffect(() => {
    camera.position.set(x, y, z);
    camera.updateProjectionMatrix();
  }, [x, y, z, camera]);

  return null;
};
