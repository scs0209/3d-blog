'use client';

import { useThree } from '@react-three/fiber';
import { useControls, button } from 'leva';

export const SceneController = () => {
  const { scene } = useThree();

  useControls('Scene Controls', {
    'Reset All Rotations': button(() => {
      // 모든 그룹 요소에 접근해서 회전 초기화
      scene.traverse((object) => {
        if (object.type === 'Group') {
          object.rotation.set(0, 0, 0);
          if (object.userData) {
            object.userData.currentRotation = { x: 0, y: 0, z: 0 };
          }
        }
      });
    }),
  });

  return null;
};
