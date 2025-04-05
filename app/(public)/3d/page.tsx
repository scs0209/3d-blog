'use client';

import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import {
  OrbitControls,
  Sparkles,
  Stars,
  Html,
  useHelper,
} from '@react-three/drei';
import { useControls, button, folder } from 'leva';
import * as THREE from 'three';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { CameraLogger } from '@/shared/ui/CameraLogger';
import { Model } from '@/shared/ui/Scene';
import CanvasLoader from '@/shared/ui/Loader';
import { Cloud } from '@/shared/ui/Cloud';
import Navbar from '@/shared/ui/Navbar';

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

// 마우스로 회전 가능한 객체 컴포넌트
const DraggableRotation = ({ children, label }) => {
  const groupRef = useRef();
  const [isSelected, setIsSelected] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [currentRotation, setCurrentRotation] = useState({ x: 0, y: 0, z: 0 });

  // 전역 상태 관리를 위한 ThreeJS Context
  const { gl, camera, scene } = useThree();

  // 선택 표시를 위한 박스 헬퍼
  useHelper(
    isSelected && groupRef,
    THREE.BoxHelper,
    label === 'Model' ? 'red' : 'blue',
  );

  // 로테이션 값을 Leva에도 연동
  const { rotateX, rotateY, rotateZ, resetRotation } = useControls(
    `${label} Rotation`,
    {
      rotateX: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 },
      rotateY: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 },
      rotateZ: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 },
      resetRotation: button(() => {
        if (groupRef.current) {
          groupRef.current.rotation.set(0, 0, 0);
          setCurrentRotation({ x: 0, y: 0, z: 0 });
        }
      }),
    },
  );

  // Leva 컨트롤 값으로 회전 업데이트
  useEffect(() => {
    if (groupRef.current && !isDragging) {
      groupRef.current.rotation.x = rotateX;
      groupRef.current.rotation.y = rotateY;
      groupRef.current.rotation.z = rotateZ;
      setCurrentRotation({ x: rotateX, y: rotateY, z: rotateZ });
    }
  }, [rotateX, rotateY, rotateZ, isDragging]);

  // 전역 이벤트 리스너 설정
  useEffect(() => {
    // 마우스 이동 핸들러
    const handleMouseMove = (event) => {
      if (isDragging && isSelected) {
        const deltaX = (event.clientX - startPoint.x) * 0.01;
        const deltaY = (event.clientY - startPoint.y) * 0.01;

        // 현재 회전 상태에 마우스 이동량을 반영
        if (groupRef.current) {
          groupRef.current.rotation.y = currentRotation.y + deltaX;
          groupRef.current.rotation.x = currentRotation.x + deltaY;
        }
      }
    };

    // 마우스 업 핸들러
    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        // 현재 회전 상태 저장
        if (groupRef.current) {
          setCurrentRotation({
            x: groupRef.current.rotation.x,
            y: groupRef.current.rotation.y,
            z: groupRef.current.rotation.z,
          });
        }
      }
    };

    // 이벤트 리스너 등록
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    // 클린업 함수
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, startPoint, currentRotation, isSelected]);

  // 마우스 이벤트 처리
  const handlePointerDown = (e) => {
    e.stopPropagation();

    // 다른 객체 선택 해제 (Scene 상태 설정 필요시)
    scene.traverse((object) => {
      if (
        object !== groupRef.current &&
        object.userData &&
        object.userData.isSelected
      ) {
        object.userData.isSelected = false;
      }
    });

    setIsSelected(true);
    setIsDragging(true);
    setStartPoint({ x: e.clientX, y: e.clientY });

    // 객체에 선택 상태 표시
    if (groupRef.current) {
      groupRef.current.userData.isSelected = true;
    }

    // 현재 회전 상태 저장
    if (groupRef.current) {
      setCurrentRotation({
        x: groupRef.current.rotation.x,
        y: groupRef.current.rotation.y,
        z: groupRef.current.rotation.z,
      });
    }
  };

  // 배경 클릭 시 선택 해제
  useEffect(() => {
    const handleCanvasClick = (event) => {
      // 만약 이벤트가 이 객체에서 시작되지 않았으면 선택 해제
      if (!groupRef.current.contains(event.target)) {
        setIsSelected(false);
      }
    };

    // OrbitControls와 충돌 방지를 위한 처리
    return () => {
      gl.domElement.removeEventListener('click', handleCanvasClick);
    };
  }, [gl]);

  return (
    <group
      ref={groupRef}
      onPointerDown={handlePointerDown}
      onClick={(e) => {
        // 이벤트 버블링 방지
        e.stopPropagation();
      }}
    >
      {children}
      {isSelected && (
        <Html position={[0, label === 'Model' ? 3 : 5, 0]}>
          <div
            style={{
              background: 'rgba(0,0,0,0.7)',
              color: 'white',
              padding: '8px',
              borderRadius: '4px',
              pointerEvents: 'none',
            }}
          >
            {label === 'Model' ? '모델 선택됨' : '구름 선택됨'}
            {isDragging && ' (회전 중)'}
          </div>
        </Html>
      )}
    </group>
  );
};

// 경계를 명확히 하기 위한 장면 배경 클릭 핸들러
const SceneClickHandler = () => {
  const { scene } = useThree();

  const handleBackgroundClick = () => {
    // 모든 객체의 선택 상태 해제
    scene.traverse((object) => {
      if (object.userData && object.userData.isSelected) {
        object.userData.isSelected = false;
      }
    });
  };

  return (
    <mesh
      position={[0, 0, -100]}
      scale={[1000, 1000, 1]}
      onClick={handleBackgroundClick}
      visible={false}
    >
      <planeGeometry />
      <meshBasicMaterial transparent opacity={0} />
    </mesh>
  );
};

// 모델 컴포넌트
const ModelGroup = () => {
  return (
    <DraggableRotation label="Model">
      <Model />
    </DraggableRotation>
  );
};

// 구름 컴포넌트
const CloudGroup = () => {
  return (
    <DraggableRotation label="Cloud">
      <Cloud count={8} radius={20} />
    </DraggableRotation>
  );
};

// 전체 장면에 대한 컨트롤러
const SceneController = () => {
  const { scene } = useThree();

  useControls('Scene Controls', {
    'Reset All Rotations': button(() => {
      // 모든 그룹 요소에 접근해서 회전 초기화
      scene.traverse((object) => {
        if (object.isGroup) {
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
  const [activeObject, setActiveObject] = useState(null);

  return (
    <div className="w-screen h-screen scene-wrapper">
      <Navbar />

      <Canvas
        camera={{ fov: 75, near: 0.1, zoom: 0.9, position: [-5.3, 3.1, -6.7] }}
        // onPointerMissed={() => setActiveObject(null)}
      >
        <ambientLight intensity={2} color="white" />
        <directionalLight position={[5, 10, 5]} intensity={2} castShadow />
        <fog attach="fog" args={['#000000', 500, 2000]} />

        <Suspense fallback={<CanvasLoader />}>
          <CameraController />
          <SceneController />
          <SceneClickHandler />

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

          {/* 각 요소를 별도의 그룹으로 관리 */}
          {/* <ModelGroup /> */}
          <Model />
          {/* <CloudGroup /> */}
          <ambientLight intensity={0.5} />
          <pointLight position={[5, 5, 5]} intensity={2} />
          {/* <HologramCard /> */}

          {/* 카메라 조작용 기본 컨트롤 - 회전 방지 */}
          <OrbitControls
            makeDefault
            enableDamping
            dampingFactor={0.05}
            // enableRotate={false}
            enablePan
            enableZoom
          />
          {/* <EffectComposer>
            <Bloom
              luminanceThreshold={0.2}
              luminanceSmoothing={0.9}
              intensity={1.5}
            />
          </EffectComposer> */}
          <CameraLogger />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default GlTFPage;
