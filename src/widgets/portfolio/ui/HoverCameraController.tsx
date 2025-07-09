import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as three from 'three';
import type { Position3D } from '@/entities/portfolio/model/types';

type HoverCameraControllerProps = {
  hoveredPosition: Position3D | null;
  isInitialAnimation?: boolean;
  focusedGroup?: string;
};

export const HoverCameraController = ({
  hoveredPosition,
  isInitialAnimation = false,
  focusedGroup,
}: HoverCameraControllerProps) => {
  const { camera } = useThree();
  const originalPosition = useRef<three.Vector3>(new three.Vector3());
  const originalTarget = useRef<three.Vector3>(new three.Vector3());
  const targetPosition = useRef<three.Vector3>(new three.Vector3());
  const targetLookAt = useRef<three.Vector3>(new three.Vector3());
  const isHovering = useRef(false);
  const animationProgress = useRef(0);

  // 초기 카메라 위치 저장
  useEffect(() => {
    if (!isInitialAnimation && !focusedGroup) {
      originalPosition.current.copy(camera.position);

      // 카메라가 바라보는 방향 계산
      const direction = new three.Vector3();
      camera.getWorldDirection(direction);
      originalTarget.current.copy(camera.position).add(direction);
    }
  }, [camera, isInitialAnimation, focusedGroup]);

  // 호버 상태 변경 처리
  useEffect(() => {
    if (isInitialAnimation || focusedGroup) {
      return;
    }

    if (hoveredPosition) {
      isHovering.current = true;

      // 현재 위치를 원본으로 저장
      originalPosition.current.copy(camera.position);
      const direction = new three.Vector3();
      camera.getWorldDirection(direction);
      originalTarget.current.copy(camera.position).add(direction);

      // 호버된 위치를 향한 새로운 카메라 위치 계산
      const hoverPos = new three.Vector3(...hoveredPosition);
      const cameraToHover = new three.Vector3().subVectors(hoverPos, camera.position).normalize();

      // 카메라를 호버 위치 방향으로 살짝 이동 (0.3 단위만큼)
      targetPosition.current.copy(camera.position).add(cameraToHover.multiplyScalar(0.3));

      // 카메라가 호버된 위치를 살짝 바라보도록 설정
      const currentLookDirection = new three.Vector3();
      camera.getWorldDirection(currentLookDirection);
      const currentLookTarget = new three.Vector3().copy(camera.position).add(currentLookDirection);

      targetLookAt.current.copy(currentLookTarget).lerp(hoverPos, 0.2); // 20%만 호버 위치 방향으로
    } else {
      isHovering.current = false;
    }
  }, [hoveredPosition, camera, isInitialAnimation, focusedGroup]);

  useFrame((_, delta) => {
    if (isInitialAnimation || focusedGroup) {
      return;
    }

    const animationSpeed = 3; // 애니메이션 속도

    if (isHovering.current) {
      // 호버 상태: 목표 위치로 애니메이션
      animationProgress.current = Math.min(1, animationProgress.current + delta * animationSpeed);
    } else {
      // 비호버 상태: 원래 위치로 복귀 애니메이션
      animationProgress.current = Math.max(0, animationProgress.current - delta * animationSpeed);
    }

    if (animationProgress.current > 0) {
      // 부드러운 애니메이션을 위한 easing 함수
      const eased = animationProgress.current * animationProgress.current * (3 - 2 * animationProgress.current); // smoothstep

      // 위치 보간
      camera.position.lerpVectors(originalPosition.current, targetPosition.current, eased);

      // 바라보는 방향 보간
      const currentLookTarget = new three.Vector3();
      currentLookTarget.lerpVectors(originalTarget.current, targetLookAt.current, eased);
      camera.lookAt(currentLookTarget);
    }
  });

  return null;
};
