'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Grid } from '@react-three/drei';
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

  // 원형 텍스처 생성 (빛나는 교차점용)
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

  // 교차점 생성 함수 (빛나는 점들)
  const createGridPoints = useMemo(() => {
    const intersectionPoints: three.Vector3[] = [];
    const colors: number[] = [];
    const fadeDistance = 15; // Grid의 fadeDistance와 일치
    const step = 1; // Grid의 cellSize와 일치

    // fadeDistance 범위 내에서만 교차점 생성
    for (let i = -fadeDistance; i <= fadeDistance; i += step) {
      for (let j = -fadeDistance; j <= fadeDistance; j += step) {
        const x = i;
        const z = j;

        // 중심에서의 거리 계산
        const distanceFromCenter = Math.sqrt(x * x + z * z);

        // fadeDistance 내에 있는 점들만 추가
        if (distanceFromCenter <= fadeDistance) {
          intersectionPoints.push(new three.Vector3(x, 0, z));

          // 거리에 따른 페이드 효과 (Grid와 동일한 방식)
          const fadeOpacity = Math.max(0.1, 1 - (distanceFromCenter / fadeDistance) * 0.8);

          // 거리에 따른 색상 강도
          colors.push(fadeOpacity, fadeOpacity, fadeOpacity);
        }
      }
    }

    const geometry = new three.BufferGeometry().setFromPoints(intersectionPoints);
    geometry.setAttribute('color', new three.Float32BufferAttribute(colors, 3));

    const material = new three.PointsMaterial({
      color: '#ffffff',
      size: 3,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: false,
      blending: three.AdditiveBlending,
      map: circleTexture,
      alphaTest: 0.001,
      vertexColors: true,
    });

    return new three.Points(geometry, material);
  }, [circleTexture]);

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

    // 교차점 펄스 효과
    if (pointsRef.current) {
      const time = state.clock.getElapsedTime();
      const material = pointsRef.current.material as three.PointsMaterial;
      material.opacity = 0.7 + Math.sin(time * 1.5) * 0.3;
    }
  });

  // 애니메이션된 네온 경로 라인 생성 함수 (ㄹ자 형태, 수직/수평만)
  const createAnimatedNeonPath = (points: three.Vector3[], color: string, progress: number) => {
    const group = new three.Group();

    if (points.length < 2) {
      return group;
    }

    // 모든 점들을 살짝 위로 올려서 그리드와 겹치지 않게 함
    const elevatedPoints = points.map((point) => new three.Vector3(point.x, 0.01, point.z));

    // 각 구간의 길이 계산
    const segmentLengths: number[] = [];
    let totalLength = 0;

    for (let i = 0; i < elevatedPoints.length - 1; i++) {
      const point1 = elevatedPoints[i];
      const point2 = elevatedPoints[i + 1];
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

    // 메인 네온 라인 재질 (더 밝고 명확하게)
    const material = new three.LineBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.95,
      linewidth: 2,
      depthWrite: false,
    });

    // 내부 glow 재질
    const innerGlowMaterial = new three.LineBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.6,
      linewidth: 4,
      depthWrite: false,
    });

    // 외부 glow 재질 (더 넓은 범위)
    const outerGlowMaterial = new three.LineBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.2,
      linewidth: 8,
      depthWrite: false,
    });

    // 완료된 구간들 그리기
    for (let i = 0; i < currentSegment; i++) {
      const startPoint = elevatedPoints[i];
      const endPoint = elevatedPoints[i + 1];
      if (startPoint && endPoint) {
        const geometry = new three.BufferGeometry().setFromPoints([startPoint, endPoint]);
        // 레이어 순서: 외부 glow -> 내부 glow -> 메인 라인
        group.add(new three.Line(geometry.clone(), outerGlowMaterial));
        group.add(new three.Line(geometry.clone(), innerGlowMaterial));
        group.add(new three.Line(geometry.clone(), material));
      }
    }

    // 현재 진행 중인 구간 그리기
    if (currentSegment < elevatedPoints.length - 1) {
      const startPoint = elevatedPoints[currentSegment];
      const endPoint = elevatedPoints[currentSegment + 1];
      const segmentRatio = segmentRatios[currentSegment];

      if (startPoint && endPoint && segmentRatio !== undefined) {
        const segmentProgress = (progress - segmentStartRatio) / segmentRatio;
        const clampedProgress = Math.max(0, Math.min(1, segmentProgress)); // 0-1 사이로 제한
        const animatedEnd = new three.Vector3().lerpVectors(startPoint, endPoint, clampedProgress);
        const geometry = new three.BufferGeometry().setFromPoints([startPoint, animatedEnd]);
        // 레이어 순서: 외부 glow -> 내부 glow -> 메인 라인
        group.add(new three.Line(geometry.clone(), outerGlowMaterial));
        group.add(new three.Line(geometry.clone(), innerGlowMaterial));
        group.add(new three.Line(geometry.clone(), material));
      }
    }

    return group;
  };

  return (
    <group ref={gridRef} position={[0, 0, 0]}>
      {/* @react-three/drei Grid 컴포넌트 사용 */}
      <Grid
        args={[80, 80]}
        cellSize={1}
        cellThickness={0.5}
        cellColor={'#404040'}
        sectionSize={10}
        sectionThickness={0}
        sectionColor={'#606060'}
        fadeDistance={15}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid={false}
      />

      {/* 빛나는 교차점들 */}
      <primitive ref={pointsRef} object={createGridPoints} />

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

      {/* 네온 보라색 경로들 - HoloTable(중심)에서 홀로그램 텍스트로 */}
      {showNeonPaths && (
        <>
          {/* WORKS로 연결 (ㄹ자 형태, 수직/수평만) */}
          <primitive
            object={createAnimatedNeonPath(
              [
                new three.Vector3(0, 0, 0), // 시작점 (중심)
                new three.Vector3(0, 0, -2), // 뒤쪽으로
                new three.Vector3(1.2, 0, -2), // 왼쪽으로
                new three.Vector3(1.2, 0, -2.9), // 더 뒤쪽으로
                new three.Vector3(0.9, 0, -2.9), // 텍스트 시작 부분으로
              ],
              '#8b5cf6',
              lineAnimationProgress,
            )}
          />
          {/* RESUME로 연결 (ㄹ자 형태, 수직/수평만) */}
          <primitive
            object={createAnimatedNeonPath(
              [
                new three.Vector3(0.1, 0, -0.08), // 시작점 (중심)
                new three.Vector3(0.1, 0, -1), // 뒤쪽으로
                new three.Vector3(2.3, 0, -1), // 아래쪽으로
                new three.Vector3(2.3, 0, -2),
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
                new three.Vector3(-0.1, 0, 0), // 시작점 (중심)
                new three.Vector3(-0.1, 0, 2.3), // 뒤쪽으로
                new three.Vector3(1, 0, 2.3), // 왼쪽으로
                new three.Vector3(1, 0, 3), // 더 뒤쪽으로
                new three.Vector3(0, 0, 3), // 텍스트 시작 부분으로
              ],
              '#8b5cf6',
              lineAnimationProgress,
            )}
          />
          {/* CONTACT로 연결 (ㄹ자 형태, 수직/수평만) */}
          <primitive
            object={createAnimatedNeonPath(
              [
                new three.Vector3(0, 0, 0), // 시작점 (중심)
                new three.Vector3(-2.0, 0, 0), // 왼쪽으로
                new three.Vector3(-2.0, 0, 1), // 아래쪽으로
                new three.Vector3(-2.55, 0, 1), // 텍스트 시작 부분으로
                new three.Vector3(-2.55, 0, 0.6), // 텍스트 시작 부분으로
              ],
              '#8b5cf6',
              lineAnimationProgress,
            )}
          />
          {/* RADAR로 연결 (ㄹ자 형태, 수직/수평만) */}
          <primitive
            object={createAnimatedNeonPath(
              [
                new three.Vector3(0, 0, -0.1), // 시작점 (중심)
                new three.Vector3(-1.5, 0, -0.1), // 왼쪽으로
                new three.Vector3(-1.5, 0, -2), // 아래쪽으로
                new three.Vector3(-2, 0, -2), // 텍스트 시작 부분으로
                new three.Vector3(-2, 0, -3), // 텍스트 시작 부분으로
              ],
              '#8b5cf6',
              lineAnimationProgress,
            )}
          />
          <primitive
            object={createAnimatedNeonPath(
              [
                new three.Vector3(0, 0, 0.1), // 시작점 (중심)
                new three.Vector3(-1.5, 0, 0.1), // 왼쪽으로
                new three.Vector3(-1.5, 0, 2.5), // 아래쪽으로
                new three.Vector3(-2.5, 0, 2.5), // 텍스트 시작 부분으로
              ],
              '#8b5cf6',
              lineAnimationProgress,
            )}
          />
          {/* ABOUT ME로 연결 (ㄹ자 형태, 수직/수평만) */}
          <primitive
            object={createAnimatedNeonPath(
              [
                new three.Vector3(0, 0, 0), // 시작점 (중심)
                new three.Vector3(3, 0, 0), // 오른쪽으로
                new three.Vector3(3, 0, 0.8), // 아래쪽으로
                new three.Vector3(3.35, 0, 0.8),
                new three.Vector3(3.35, 0, 0.6),
              ],
              '#8b5cf6',
              lineAnimationProgress,
            )}
          />
          {/* SKILL로 연결 (ㄹ자 형태, 수직/수평만) */}
          <primitive
            object={createAnimatedNeonPath(
              [
                new three.Vector3(0, 0, 0.1), // 시작점 (중심)
                new three.Vector3(2.3, 0, 0.1), // 오른쪽으로
                new three.Vector3(2.3, 0, 1), // 아래쪽으로
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

      {/* 포그 효과 - 포트폴리오 모델들이 잘 보이도록 색상과 거리 조정 */}
      <fog attach='fog' args={['#2a2a3a', 25, 100]} />

      {/* 부드러운 주변 조명 */}
      <ambientLight intensity={0.1} color='#333366' />
    </group>
  );
}
