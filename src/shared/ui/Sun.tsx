import { useRef } from 'react';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as three from 'three';

// 노란색 발광 재질 (기본 상태)
const yellowGlowMaterial = new three.MeshStandardMaterial({
  color: '#ffff00', // 밝은 노란색
  emissive: '#ffaa00', // 노란색 발광
  emissiveIntensity: 2.0,
  transparent: true,
  opacity: 0.95,
});

// 흰색 발광 재질 (클릭 시)
const whiteGlowMaterial = new three.MeshStandardMaterial({
  color: '#ffffff', // 흰색
  emissive: '#ffffff', // 흰색 발광
  emissiveIntensity: 1.5,
  transparent: true,
  opacity: 0.98,
});

export function Sun(props: React.ComponentProps<'group'> & { isCubeActive?: boolean }) {
  const meshRef = useRef<three.Mesh>(null);
  const { isCubeActive } = props;

  return (
    <>
      <group {...props} dispose={null}>
        <mesh ref={meshRef} castShadow receiveShadow material={isCubeActive ? whiteGlowMaterial : yellowGlowMaterial}>
          <sphereGeometry args={[1, 32, 32]} />
        </mesh>
        {/* 조명 효과 - 노란색 또는 흰색 */}
        <pointLight
          position={[0, 0, 0]}
          color={isCubeActive ? '#ffffff' : '#ffff00'}
          intensity={isCubeActive ? 20 : 15}
          distance={300}
          decay={2}
        />
      </group>
      {/* Sun 전용 EffectComposer - 항상 활성화 */}
      <EffectComposer>
        <Bloom mipmapBlur luminanceThreshold={1.2} radius={0.8} intensity={0.3} />
      </EffectComposer>
    </>
  );
}
