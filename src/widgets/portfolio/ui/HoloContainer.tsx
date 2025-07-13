import type { JSX } from 'react';
import * as three from 'three';

// 메인 프레임 재질 (어두운 메탈)
const frameMaterial = new three.MeshStandardMaterial({
  color: '#0f172a',
  emissive: '#1e293b',
  emissiveIntensity: 0.2,
  metalness: 0.9,
  roughness: 0.3,
});

// 네온 라인 재질 (화이트-블루)
const neonBlueMaterial = new three.MeshStandardMaterial({
  color: '#f0f9ff',
  emissive: '#bae6fd',
  emissiveIntensity: 1.0,
  transparent: true,
  opacity: 0.8,
});

// 네온 라인 재질 (퍼플)
const neonPurpleMaterial = new three.MeshStandardMaterial({
  color: '#c084fc',
  emissive: '#a855f7',
  emissiveIntensity: 1.2,
  transparent: true,
  opacity: 0.9,
});

// 홀로그램 패널 재질
const holoPanelMaterial = new three.MeshStandardMaterial({
  color: '#f8fafc',
  emissive: '#e2e8f0',
  emissiveIntensity: 0.4,
  transparent: true,
  opacity: 0.15,
  side: three.DoubleSide,
});

// 바닥 그리드 재질
const gridMaterial = new three.MeshStandardMaterial({
  color: '#f1f5f9',
  emissive: '#cbd5e1',
  emissiveIntensity: 0.6,
  transparent: true,
  opacity: 0.7,
});

type HoloContainerProps = {
  scale?: number | [number, number, number];
  position?: [number, number, number];
} & Omit<JSX.IntrinsicElements['group'], 'scale' | 'position'>;

export function HoloContainer(props: HoloContainerProps) {
  return (
    <group {...props} dispose={null}>
      {/* 메인 컨테이너 */}
      <group position={[0, -0.9, 0]}>
        {/* 바닥 플랫폼 */}
        <mesh position={[0, -0.9, 0]} material={frameMaterial}>
          <cylinderGeometry args={[2.2, 2.5, 0.3, 8]} />
        </mesh>

        {/* 바닥 네온 그리드 */}
        <mesh position={[0, -0.76, 0]} material={gridMaterial} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.8, 2.1, 32]} />
        </mesh>

        {/* 바닥 겉면 보라색 네온 테두리 */}
        <mesh position={[0, -0.74, 0]} material={neonPurpleMaterial} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.3, 2.6, 32]} />
        </mesh>

        {/* 코너 필러 (8각형) */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * Math.PI * 2) / 8;
          const x = Math.cos(angle) * 2.0;
          const z = Math.sin(angle) * 2.0;
          return (
            <group key={`pillar-${i}-${angle.toFixed(2)}`} position={[x, 0, z]} rotation={[0, angle, 0]}>
              {/* 메인 필러 */}
              <mesh position={[0, 0, 0]} material={frameMaterial}>
                <boxGeometry args={[0.15, 1.8, 0.15]} />
              </mesh>
              {/* 네온 스트립 */}
              <mesh position={[0.08, 0, 0]} material={neonBlueMaterial}>
                <boxGeometry args={[0.02, 1.8, 0.02]} />
              </mesh>
              <mesh position={[-0.08, 0, 0]} material={neonPurpleMaterial}>
                <boxGeometry args={[0.02, 1.8, 0.02]} />
              </mesh>
            </group>
          );
        })}

        {/* 추가 수직 네온 링 - X축 회전 */}
        <mesh position={[0, 0.93, 0]} rotation={[Math.PI / 2, 0, 0]} material={neonBlueMaterial}>
          <torusGeometry args={[2.0, 0.03, 8, 32]} />
        </mesh>

        {/* 에너지 코어 라인들 (중앙에서 퍼져나가는) */}
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i * Math.PI * 2) / 6;
          const x = Math.cos(angle) * 0.8;
          const z = Math.sin(angle) * 0.8;
          return (
            <mesh
              key={`core-${angle.toFixed(2)}-${x.toFixed(2)}`}
              position={[x / 2, -0.3, z / 2]}
              rotation={[0, angle, 0]}
              material={neonPurpleMaterial}
            >
              <boxGeometry args={[0.8, 0.02, 0.02]} />
            </mesh>
          );
        })}

        {/* 플로팅 디테일 (작은 홀로그램 큐브들) */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * Math.PI * 2) / 12;
          const radius = 1.5 + Math.sin(i) * 0.2;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          const y = Math.sin(i * 0.5) * 0.3;
          return (
            <mesh
              key={`detail-${x.toFixed(2)}-${y.toFixed(2)}-${z.toFixed(2)}`}
              position={[x, y, z]}
              rotation={[i * 0.2, i * 0.3, i * 0.1]}
              material={i % 2 === 0 ? neonBlueMaterial : neonPurpleMaterial}
            >
              <boxGeometry args={[0.03, 0.03, 0.03]} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}
