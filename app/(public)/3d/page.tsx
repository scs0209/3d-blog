'use client';

import React, { Suspense, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Sparkles, Stars } from '@react-three/drei';
import { useControls } from 'leva';
import { Model as RoomModel } from '@/shared/ui/Room';
import { CameraLogger } from '@/shared/ui/CameraLogger';
import { CubeModel } from '@/shared/ui/Cube';
// import SkyBox from '@/shared/ui/SkyBox';
import { Model } from '@/shared/ui/Scene';
import CanvasLoader from '@/shared/ui/Loader';
import { Cloud } from '@/shared/ui/Cloud';

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

const GlTFPage = () => {
  return (
    <div className="w-screen h-screen scene-wrapper">
      <Canvas
        camera={{ fov: 75, near: 0.1, zoom: 0.9, position: [-5.3, 3.1, -6.7] }}
      >
        <ambientLight intensity={2} color="white" />
        <directionalLight position={[5, 10, 5]} intensity={2} castShadow />
        {/* <color attach="background" args={['#000000']} /> */}
        <fog attach="fog" args={['#000000', 500, 2000]} />
        {/* <SkyBox /> */}
        <Suspense fallback={<CanvasLoader />}>
          <CameraController />
          {/* <RoomModel position={[0, -100, 0]} /> */}
          <Stars
            radius={100}
            depth={100}
            count={4000}
            factor={4}
            saturation={0}
            fade
            speed={0.2}
          />
          <Sparkles
            count={300}
            size={3}
            speed={0.02}
            opacity={1}
            scale={20}
            color="#fff3b0"
          />
          <Model />
          {/* <CubeModel /> */}

          <OrbitControls />
          <fog attach="fog" args={['#202025', 0, 80]} />
          <Cloud count={8} radius={20} />
          {/* <group rotation={[10, 10.5, 10]} scale={0.1}>
          </group> */}
          <CameraLogger />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default GlTFPage;
