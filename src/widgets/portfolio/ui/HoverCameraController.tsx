import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as three from 'three';
import type { Position3D, FocusedGroup } from '@/entities/portfolio/model/types';

type HoverCameraControllerProps = {
  hoveredPosition: Position3D | null;
  isInitialAnimation?: boolean;
  focusedGroup?: FocusedGroup | null;
};

export const HoverCameraController = ({
  hoveredPosition,
  isInitialAnimation = false,
  focusedGroup,
}: HoverCameraControllerProps) => {
  const { camera } = useThree();
  const originalPosition = useRef<three.Vector3>(new three.Vector3());
  const targetPosition = useRef<three.Vector3>(new three.Vector3());
  const currentTarget = useRef<three.Vector3>(new three.Vector3());

  // 초기 카메라 위치 저장 (한 번만)
  useEffect(() => {
    if (!isInitialAnimation && !focusedGroup) {
      originalPosition.current.copy(camera.position);
      targetPosition.current.copy(camera.position);
      currentTarget.current.copy(camera.position);
    }
  }, [camera, isInitialAnimation, focusedGroup]);

  // 호버 상태 변경 처리
  useEffect(() => {
    if (isInitialAnimation || focusedGroup) {
      return;
    }

    if (hoveredPosition) {
      // 호버된 모델의 위치와 카메라의 거리 계산
      const modelPos = new three.Vector3(...hoveredPosition);
      const distance = originalPosition.current.distanceTo(modelPos);

      // 카메라에서 모델로의 방향 벡터
      const direction = new three.Vector3().subVectors(modelPos, originalPosition.current).normalize();

      // 거리에 따른 이동량 조절
      let moveAmount = 0;
      if (distance > 7) {
        // 먼 모델: 그 방향으로 살짝 이동 (가까워짐)
        moveAmount = 0.3;
      } else if (distance > 4) {
        // 중간 거리: 약간 이동
        moveAmount = 0.15;
      } else {
        // 가까운 모델: 반대 방향으로 살짝 이동 (멀어짐)
        moveAmount = -0.2;
      }

      targetPosition.current.copy(originalPosition.current).add(direction.multiplyScalar(moveAmount));
    } else {
      // 호버 해제 시 원래 위치로 복귀
      targetPosition.current.copy(originalPosition.current);
    }
  }, [hoveredPosition, isInitialAnimation, focusedGroup]);

  useFrame(() => {
    if (isInitialAnimation || focusedGroup) {
      return;
    }

    // 더욱 부드러운 lerp로 목표 위치로 이동 (매우 부드럽게)
    currentTarget.current.lerp(targetPosition.current, 0.03);
    camera.position.copy(currentTarget.current);
  });

  return null;
};
