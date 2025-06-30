'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as three from 'three';
import { useState } from 'react';

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
  const [lineAnimationProgress, setLineAnimationProgress] = useState(0);

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

  // 선 애니메이션 시작 (컴포넌트 마운트 시)
  useEffect(() => {
    if (showNeonPaths) {
      setLineAnimationProgress(0);
      const animationInterval = setInterval(() => {
        setLineAnimationProgress((prev) => {
          if (prev >= 1) {
            clearInterval(animationInterval);
            return 1;
          }
          return prev + 0.02; // 2%씩 증가
        });
      }, 50); // 50ms마다 업데이트

      return () => clearInterval(animationInterval);
    }
  }, [showNeonPaths]);

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

  // 애니메이션된 네온 경로 라인 생성 함수 (ㄹ자 형태, 수직/수평만)
  const createAnimatedNeonPath = (points: three.Vector3[], color: string, progress: number) => {
    const group = new three.Group();

    if (points.length < 2) {
      return group;
    }

    // 각 구간의 길이 계산
    const segmentLengths: number[] = [];
    let totalLength = 0;

    for (let i = 0; i < points.length - 1; i++) {
      const point1 = points[i];
      const point2 = points[i + 1];
      if (point1 && point2) {
        const length = point1.distanceTo(point2);
        segmentLengths.push(length);
        totalLength += length;
      }
    }

    // 각 구간의 비율 계산
    const segmentRatios = segmentLengths.map((length) => length / totalLength);

    // 현재 진행률에 따라 어느 구간까지 그릴지 결정
    let currentSegment = segmentRatios.length - 1; // 기본값을 마지막 구간으로 설정
    let accumulatedRatio = 0;

    for (let i = 0; i < segmentRatios.length; i++) {
      if (progress <= accumulatedRatio + segmentRatios[i]!) {
        currentSegment = i;
        break;
      }
      accumulatedRatio += segmentRatios[i]!;
    }

    // currentSegment가 결정된 후 해당 구간의 시작점까지의 누적 비율 재계산
    let segmentStartRatio = 0;
    for (let i = 0; i < currentSegment; i++) {
      segmentStartRatio += segmentRatios[i]!;
    }

    const material = new three.LineBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.8,
      linewidth: 3,
    });

    const glowMaterial = new three.LineBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.4,
      linewidth: 1,
    });

    // 완료된 구간들 그리기
    for (let i = 0; i < currentSegment; i++) {
      const startPoint = points[i];
      const endPoint = points[i + 1];
      if (startPoint && endPoint) {
        const geometry = new three.BufferGeometry().setFromPoints([startPoint, endPoint]);
        group.add(new three.Line(geometry.clone(), material));
        group.add(new three.Line(geometry.clone(), glowMaterial));
      }
    }

    // 현재 진행 중인 구간 그리기
    if (currentSegment < points.length - 1) {
      const startPoint = points[currentSegment];
      const endPoint = points[currentSegment + 1];
      const segmentRatio = segmentRatios[currentSegment];

      if (startPoint && endPoint && segmentRatio !== undefined) {
        const segmentProgress = (progress - segmentStartRatio) / segmentRatio;
        const clampedProgress = Math.max(0, Math.min(1, segmentProgress)); // 0-1 사이로 제한
        const animatedEnd = new three.Vector3().lerpVectors(startPoint, endPoint, clampedProgress);
        const geometry = new three.BufferGeometry().setFromPoints([startPoint, animatedEnd]);
        group.add(new three.Line(geometry.clone(), material));
        group.add(new three.Line(geometry.clone(), glowMaterial));
      }
    }

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
      <primitive object={createGrid(80, 80, '#747272', 0.15)} />
      {/* 메인 그리드 교차점 - 원형 흰색 */}
      <primitive ref={pointsRef} object={createGridPoints(80, 80, '#ffffff', 3, 0.8)} />
      {/* 네온 보라색 경로들 - HoloTable(중심)에서 홀로그램 텍스트로 */}
      {showNeonPaths && (
        <>
          {/* WORKS로 연결 (ㄹ자 형태, 수직/수평만) */}
          <primitive
            object={createAnimatedNeonPath(
              [
                new three.Vector3(0, 2, 0), // 시작점 (중심)
                new three.Vector3(0, 2, -2), // 뒤쪽으로
                new three.Vector3(1.2, 2, -2), // 왼쪽으로
                new three.Vector3(1.2, 2, -2.9), // 더 뒤쪽으로
                new three.Vector3(0.9, 2, -2.9), // 텍스트 시작 부분으로
              ],
              '#8b5cf6',
              lineAnimationProgress,
            )}
          />
          {/* RESUME로 연결 (ㄹ자 형태, 수직/수평만) */}
          <primitive
            object={createAnimatedNeonPath(
              [
                new three.Vector3(0.1, 2, -0.08), // 시작점 (중심)
                new three.Vector3(0.1, 2, -1), // 뒤쪽으로
                new three.Vector3(2.3, 2, -1), // 아래쪽으로
                new three.Vector3(2.3, 2, -2),
                // new three.Vector3(3.35, 2, 0.6),
              ],
              '#8b5cf6',
              lineAnimationProgress,
            )}
          />
          {/* EXPERIENCE로 연결 (ㄹ자 형태, 수직/수평만) */}
          <primitive
            object={createAnimatedNeonPath(
              [
                new three.Vector3(-0.1, 2, 0), // 시작점 (중심)
                new three.Vector3(-0.1, 2, 2.3), // 뒤쪽으로
                new three.Vector3(1, 2, 2.3), // 왼쪽으로
                new three.Vector3(1, 2, 3), // 더 뒤쪽으로
                new three.Vector3(0, 2, 3), // 텍스트 시작 부분으로
              ],
              '#8b5cf6',
              lineAnimationProgress,
            )}
          />
          {/* CONTACT로 연결 (ㄹ자 형태, 수직/수평만) */}
          <primitive
            object={createAnimatedNeonPath(
              [
                new three.Vector3(0, 2, 0), // 시작점 (중심)
                new three.Vector3(-2.0, 2, 0), // 왼쪽으로
                new three.Vector3(-2.0, 2, 1), // 아래쪽으로
                new three.Vector3(-2.55, 2, 1), // 텍스트 시작 부분으로
                new three.Vector3(-2.55, 2, 0.6), // 텍스트 시작 부분으로
              ],
              '#8b5cf6',
              lineAnimationProgress,
            )}
          />
          {/* RADAR로 연결 (ㄹ자 형태, 수직/수평만) */}
          <primitive
            object={createAnimatedNeonPath(
              [
                new three.Vector3(0, 2, -0.1), // 시작점 (중심)
                new three.Vector3(-1.5, 2, -0.1), // 왼쪽으로
                new three.Vector3(-1.5, 2, -2), // 아래쪽으로
                new three.Vector3(-2, 2, -2), // 텍스트 시작 부분으로
                new three.Vector3(-2, 2, -3), // 텍스트 시작 부분으로
              ],
              '#8b5cf6',
              lineAnimationProgress,
            )}
          />
          <primitive
            object={createAnimatedNeonPath(
              [
                new three.Vector3(0, 2, 0.1), // 시작점 (중심)
                new three.Vector3(-1.5, 2, 0.1), // 왼쪽으로
                new three.Vector3(-1.5, 2, 2.5), // 아래쪽으로
                new three.Vector3(-2.5, 2, 2.5), // 텍스트 시작 부분으로
              ],
              '#8b5cf6',
              lineAnimationProgress,
            )}
          />
          {/* ABOUT ME로 연결 (ㄹ자 형태, 수직/수평만) */}
          <primitive
            object={createAnimatedNeonPath(
              [
                new three.Vector3(0, 2, 0), // 시작점 (중심)
                new three.Vector3(3, 2, 0), // 오른쪽으로
                new three.Vector3(3, 2, 0.8), // 아래쪽으로
                new three.Vector3(3.35, 2, 0.8),
                new three.Vector3(3.35, 2, 0.6),
              ],
              '#8b5cf6',
              lineAnimationProgress,
            )}
          />
          {/* SKILL로 연결 (ㄹ자 형태, 수직/수평만) */}
          <primitive
            object={createAnimatedNeonPath(
              [
                new three.Vector3(0, 2, 0.1), // 시작점 (중심)
                new three.Vector3(2.3, 2, 0.1), // 오른쪽으로
                new three.Vector3(2.3, 2, 1), // 아래쪽으로
              ],
              '#8b5cf6',
              lineAnimationProgress,
            )}
          />
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
