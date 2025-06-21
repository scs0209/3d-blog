'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as three from 'three';
import { useState } from 'react';

// groupCameraTargets의 타입 정의
type GroupCameraTargets = Record<
  string,
  {
    offset: [number, number, number];
    lookAt: [number, number, number];
    pulse: [number, number, number];
    modelPosition: [number, number, number];
    secondaryOffset?: [number, number, number];
    secondaryLookAt?: [number, number, number];
  }
>;

export function GridBackground({
  showNeonPaths = true,
  pulseActive = false,
  pulseCenter = null,
  hoveredPosition = null,
}: {
  showNeonPaths?: boolean;
  pulseActive?: boolean;
  pulseCenter?: [number, number, number] | null;
  hoveredPosition?: [number, number, number] | null;
}) {
  const gridRef = useRef<three.Group>(null);
  const pointsRef = useRef<three.Points>(null);
  const originalColors = useRef<Float32Array | null>(null);
  const highlightRef = useRef<three.Mesh>(null);
  const targetOpacity = useRef(0);
  const [highlightPosition, setHighlightPosition] = useState<three.Vector3 | null>(null);

  const [pulse, setPulse] = useState({ scale: 1, opacity: 0, running: false });
  const pulseDuration = 0.8; // 초
  const pulseMaxScale = 3.5;
  const pulseInnerStart = 0.7;
  const pulseOuterStart = 1.1;
  const pulseInnerEnd = 2.2;
  const pulseOuterEnd = 3.5;

  // 원형 텍스처 생성
  const circleTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const context = canvas.getContext('2d');

    if (context) {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = 15;

      // 원형 그라디언트
      const gradient = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.8)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      context.fillStyle = gradient;
      context.beginPath();
      context.arc(centerX, centerY, radius, 0, Math.PI * 2);
      context.fill();
    }

    const texture = new three.CanvasTexture(canvas);
    return texture;
  }, []);

  useEffect(() => {
    if (pointsRef.current) {
      const geometry = pointsRef.current.geometry as three.BufferGeometry;
      if (geometry.attributes.color && !originalColors.current) {
        // 원래 색상 데이터를 한 번만 저장
        originalColors.current = geometry.attributes.color.array.slice() as Float32Array;
      }
    }
  }, []);

  // hoveredGroup 변경 시 하이라이트 위치 및 투명도 목표 설정
  useEffect(() => {
    if (hoveredPosition) {
      const pos = hoveredPosition;
      // 가장 가까운 그리드 셀의 중앙으로 위치를 보정합니다.
      const snappedX = Math.round(pos[0]);
      const snappedZ = Math.round(pos[2]);

      setHighlightPosition(new three.Vector3(snappedX, 0.01, snappedZ));
      targetOpacity.current = 0.4; // 나타날 때의 최종 투명도
    } else {
      targetOpacity.current = 0; // 사라질 때의 최종 투명도
    }
  }, [hoveredPosition]);

  // pulseActive가 true로 바뀔 때마다 1회 애니메이션 트리거
  useEffect(() => {
    if (pulseActive && pulseCenter) {
      setPulse({ scale: 1, opacity: 0.5, running: true });
    }
  }, [pulseActive, pulseCenter]);

  useFrame((state, delta) => {
    // 하이라이트 원 투명도 애니메이션
    if (highlightRef.current) {
      const material = highlightRef.current.material as three.MeshBasicMaterial;
      material.opacity = three.MathUtils.lerp(material.opacity, targetOpacity.current, delta * 5);

      // 투명도가 거의 0이고, 목표도 0이면 위치 초기화 (불필요한 렌더링 방지)
      if (material.opacity < 0.01 && targetOpacity.current === 0) {
        setHighlightPosition(null);
      }
    }

    // 퍼짐 파동 애니메이션 (한 번만)
    if (pulse.running) {
      setPulse((prev) => {
        const nextScale = prev.scale + (pulseMaxScale - 1) * (delta / pulseDuration);
        const nextOpacity = Math.max(0, 0.5 - (nextScale - 1) * 0.4);
        if (nextScale > pulseMaxScale) {
          return { scale: 1, opacity: 0, running: false };
        }
        return { scale: nextScale, opacity: nextOpacity, running: true };
      });
    }
    // 기존 교차점 펄스 효과
    if (gridRef.current) {
      const time = state.clock.getElapsedTime();
      gridRef.current.children.forEach((child, index) => {
        if (child instanceof three.Points) {
          const material = child.material as three.PointsMaterial;
          material.opacity = 0.7 + Math.sin(time * 1 + index * 0.3) * 0.2;
        }
      });
    }
  });

  // 그리드 생성 함수 (거리에 따른 opacity 조절)
  const createGrid = (size: number, divisions: number, color: string, opacity = 0.1) => {
    const points: three.Vector3[] = [];
    const colors: number[] = [];
    const step = size / divisions;
    const halfSize = size / 2;

    // 수직선들
    for (let i = 0; i <= divisions; i++) {
      const x = -halfSize + i * step;
      points.push(new three.Vector3(x, 0, -halfSize));
      points.push(new three.Vector3(x, 0, halfSize));

      // 중심에서의 거리에 따른 색상 강도 조절
      const distanceFromCenter = Math.abs(x) / halfSize;
      const fadeOpacity = Math.max(0.1, 1 - distanceFromCenter * 0.8);

      // 실제 fadeOpacity 적용
      colors.push(fadeOpacity * 0.4, fadeOpacity * 0.4, fadeOpacity * 0.4);
      colors.push(fadeOpacity * 0.4, fadeOpacity * 0.4, fadeOpacity * 0.4);
    }

    // 수평선들
    for (let i = 0; i <= divisions; i++) {
      const z = -halfSize + i * step;
      points.push(new three.Vector3(-halfSize, 0, z));
      points.push(new three.Vector3(halfSize, 0, z));

      // 중심에서의 거리에 따른 색상 강도 조절
      const distanceFromCenter = Math.abs(z) / halfSize;
      const fadeOpacity = Math.max(0.1, 1 - distanceFromCenter * 0.8);

      // 실제 fadeOpacity 적용
      colors.push(fadeOpacity * 0.4, fadeOpacity * 0.4, fadeOpacity * 0.4);
      colors.push(fadeOpacity * 0.4, fadeOpacity * 0.4, fadeOpacity * 0.4);
    }

    const geometry = new three.BufferGeometry().setFromPoints(points);
    geometry.setAttribute('color', new three.Float32BufferAttribute(colors, 3));

    const material = new three.LineBasicMaterial({
      color: color,
      transparent: true,
      opacity: opacity,
      linewidth: 1,
      vertexColors: true,
    });

    return new three.LineSegments(geometry, material);
  };

  // 네온 경로 라인 생성 함수
  const createNeonPath = (start: three.Vector3, end: three.Vector3, color: string) => {
    const points = [start, end];
    const geometry = new three.BufferGeometry().setFromPoints(points);

    const material = new three.LineBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.8,
      linewidth: 3,
    });

    // 네온 효과를 위한 두 번째 라인 (더 밝고 얇은)
    const glowMaterial = new three.LineBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.4,
      linewidth: 1,
    });

    const group = new three.Group();
    group.add(new three.Line(geometry.clone(), material));
    group.add(new three.Line(geometry.clone(), glowMaterial));

    return group;
  };

  // 교차점 생성 함수 (거리에 따른 opacity 조절)
  const createGridPoints = (size: number, divisions: number, color: string, pointSize = 4, opacity = 0.8) => {
    const intersectionPoints: three.Vector3[] = [];
    const colors: number[] = [];
    const step = size / divisions;
    const halfSize = size / 2;

    // 모든 교차점 생성
    for (let i = 0; i <= divisions; i++) {
      for (let j = 0; j <= divisions; j++) {
        const x = -halfSize + i * step;
        const z = -halfSize + j * step;
        intersectionPoints.push(new three.Vector3(x, 0, z));

        // 중심에서의 거리 계산
        const distanceFromCenter = Math.sqrt(x * x + z * z) / (halfSize * Math.sqrt(2));
        const fadeOpacity = Math.max(0.2, 1 - distanceFromCenter * 0.7);

        // 거리에 따른 색상 강도
        colors.push(fadeOpacity, fadeOpacity, fadeOpacity);
      }
    }

    const geometry = new three.BufferGeometry().setFromPoints(intersectionPoints);
    geometry.setAttribute('color', new three.Float32BufferAttribute(colors, 3));

    const material = new three.PointsMaterial({
      color: color,
      size: pointSize,
      transparent: true,
      opacity: opacity,
      sizeAttenuation: false,
      blending: three.AdditiveBlending,
      map: circleTexture,
      alphaTest: 0.001,
      vertexColors: true,
    });

    return new three.Points(geometry, material);
  };

  return (
    <group ref={gridRef} position={[0, -2, 0]}>
      {/* 호버 하이라이트 원 */}
      {highlightPosition && (
        <mesh ref={highlightRef} position={highlightPosition} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[3, 3]} />
          <meshBasicMaterial
            color='#8b5cf6'
            transparent
            opacity={0}
            depthWrite={false}
            blending={three.AdditiveBlending}
          />
        </mesh>
      )}

      {/* 메인 그리드 라인 - 촘촘한 옅은 회색 */}
      <primitive object={createGrid(100, 100, '#747272', 0.15)} />
      {/* 메인 그리드 교차점 - 원형 흰색 */}
      <primitive ref={pointsRef} object={createGridPoints(100, 100, '#ffffff', 3, 0.8)} />
      {/* 네온 보라색 경로들 - HoloTable(중심)에서 각 모델로 */}
      {showNeonPaths && (
        <>
          <primitive object={createNeonPath(new three.Vector3(0, 2, 0), new three.Vector3(4.4, 2, 0), '#8b5cf6')} />
          <primitive object={createNeonPath(new three.Vector3(0, 2, 0), new three.Vector3(-4, 2, 0), '#8b5cf6')} />
          <primitive object={createNeonPath(new three.Vector3(0, 2, 0), new three.Vector3(0, 2, -4), '#8b5cf6')} />
          <primitive object={createNeonPath(new three.Vector3(0, 2, 0), new three.Vector3(0, 2, -5), '#8b5cf6')} />
          <primitive object={createNeonPath(new three.Vector3(0, 2, 0), new three.Vector3(0, 2, -6), '#8b5cf6')} />
        </>
      )}
      {/* 퍼짐 파동 효과 (링) */}
      {pulse.running && pulseCenter && pulse.opacity > 0 && (
        <mesh position={pulseCenter} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry
            args={[
              pulseInnerStart + ((pulseInnerEnd - pulseInnerStart) * (pulse.scale - 1)) / (pulseMaxScale - 1),
              pulseOuterStart + ((pulseOuterEnd - pulseOuterStart) * (pulse.scale - 1)) / (pulseMaxScale - 1),
              96,
            ]}
          />
          <meshBasicMaterial color={'#8b5cf6'} transparent opacity={pulse.opacity} depthWrite={false} />
        </mesh>
      )}
      {/* 포그 효과 */}
      <fog attach='fog' args={['#1e293b', 20, 80]} />
      {/* 주변 조명 효과 - 어둡게 조정 */}
      <ambientLight intensity={0.05} color='#001122' />
    </group>
  );
}
