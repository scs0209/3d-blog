'use client';

import { useThree } from '@react-three/fiber';

export const SceneClickHandler = () => {
  const { scene } = useThree();

  const handleBackgroundClick = () => {
    // 모든 객체의 선택 상태 해제
    scene.traverse((object) => {
      if (object.userData?.isSelected) {
        object.userData.isSelected = false;
      }
    });
  };

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    <mesh position={[0, 0, -100]} scale={[1000, 1000, 1]} onClick={handleBackgroundClick} visible={false}>
      <planeGeometry />
      <meshBasicMaterial transparent opacity={0} />
    </mesh>
  );
};
