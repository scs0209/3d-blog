'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as three from 'three';

export function GridBackground() {
  const gridRef = useRef<three.Group>(null);

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

  useFrame((state) => {
    if (gridRef.current) {
      // 교차점만 펄스 효과 (선은 제외)
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
      {/* 메인 그리드 라인 - 촘촘한 옅은 회색 */}
      <primitive object={createGrid(100, 100, '#747272', 0.15)} />
      {/* 메인 그리드 교차점 - 원형 흰색 */}
      <primitive object={createGridPoints(100, 100, '#ffffff', 3, 0.8)} />

      {/* 네온 보라색 경로들 - HoloTable(중심)에서 각 모델로 */}
      <primitive object={createNeonPath(new three.Vector3(0, 2, 0), new three.Vector3(4.4, 2, 0), '#8b5cf6')} />
      <primitive object={createNeonPath(new three.Vector3(0, 2, 0), new three.Vector3(-4, 2, 0), '#8b5cf6')} />
      <primitive object={createNeonPath(new three.Vector3(0, 2, 0), new three.Vector3(0, 2, -4), '#8b5cf6')} />
      <primitive object={createNeonPath(new three.Vector3(0, 2, 0), new three.Vector3(0, 2, -5), '#8b5cf6')} />
      <primitive object={createNeonPath(new three.Vector3(0, 2, 0), new three.Vector3(0, 2, -6), '#8b5cf6')} />

      {/* 포그 효과 */}
      <fog attach='fog' args={['#1e293b', 20, 80]} />

      {/* 주변 조명 효과 - 어둡게 조정 */}
      <ambientLight intensity={0.05} color='#001122' />
    </group>
  );
}
