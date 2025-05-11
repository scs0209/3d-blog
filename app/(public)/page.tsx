'use client';

import { Suspense, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Sparkles, Stars } from '@react-three/drei';
import { useControls, button } from 'leva';
import { Scene } from '@/shared/ui/index';
import CanvasLoader from '@/shared/ui/Loader';
import Navbar from '@/shared/ui/Navbar';
import { AnimateAvatar } from '@/widgets/home/ui/AnimateAvatar';
import { Planet } from '@/widgets/home/ui/Planet';
import { WalkingAvatar } from '@/widgets/home/ui/WalkingAvatar';
const CameraController = () => {
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

// 경계를 명확히 하기 위한 장면 배경 클릭 핸들러
const SceneClickHandler = () => {
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

// 전체 장면에 대한 컨트롤러
const SceneController = () => {
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

const GlTFPage = () => {
  return (
    <div className='w-screen h-screen scene-wrapper'>
      <Navbar />

      <Canvas
        camera={{ fov: 75, near: 0.1, zoom: 0.9, position: [-5.3, 3.1, -6.7] }}
        // onPointerMissed={() => setActiveObject(null)}
      >
        <ambientLight intensity={2} color='white' />
        <directionalLight position={[5, 10, 5]} intensity={2} castShadow />
        <fog attach='fog' args={['#000000', 500, 2000]} />

        <Suspense fallback={<CanvasLoader />}>
          <CameraController />
          <SceneController />
          <SceneClickHandler />

          <Stars radius={100} depth={100} count={4000} factor={4} saturation={0} fade speed={0.2} />
          <Sparkles count={300} size={3} speed={0.02} opacity={1} scale={20} color='#fff3b0' />
          <AnimateAvatar scale={3000} position={[0, 5, 0]} />
          <WalkingAvatar scale={0.01} position={[0, 0.6, 0.5]} />
          <Scene />
          <ambientLight intensity={0.5} />
          <pointLight position={[5, 5, 5]} intensity={2} />

          {/* 카메라 조작용 기본 컨트롤 - 회전 방지 */}
          <OrbitControls
            makeDefault
            enableDamping
            dampingFactor={0.05}
            // enableRotate={false}
            enablePan
            enableZoom
          />
          <Planet scale={30} position={[0, -19, 0]} />
          {/* <CameraLogger /> */}
        </Suspense>
      </Canvas>
    </div>
  );
};

export default GlTFPage;
