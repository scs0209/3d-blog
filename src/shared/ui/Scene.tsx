'use client';

import { Model as RoomModel } from '@/shared/ui/Room';
import { useGLTF } from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import type React from 'react';
import { useRef, useEffect, useState } from 'react';
import * as three from 'three';
import { CubeModel } from './Cube';
import { NeuralNetwork } from './NeutralNetwork';
import { useTheme } from 'next-themes';
import { useFrame } from '@react-three/fiber';

// 노란 발광 재질 생성
const glowingMaterial = new three.MeshStandardMaterial({
  color: '#ffff00', // 노란색
  emissive: '#ffaa00', // 발광색 (주황빛 노란색)
  emissiveIntensity: 0.5,
  transparent: true,
  opacity: 0.9,
});
// 파란 발광 재질 생성 (두 번째 행성용)
const glowingMaterial2 = new three.MeshStandardMaterial({
  color: '#ff6fa1', // 핑크/코랄
  emissive: '#ff3b6a', // 발광색 (선명한 핑크)
  emissiveIntensity: 0.7,
  transparent: true,
  opacity: 0.9,
});
// 보라 발광 재질 (구)
const glowingMaterialPurple = new three.MeshStandardMaterial({
  color: '#b266ff', // 보라색
  emissive: '#a259f7', // 발광색
  emissiveIntensity: 0.7,
  transparent: true,
  opacity: 0.95,
});
// 연보라 발광 재질 (선)
const glowingMaterialLine = new three.MeshStandardMaterial({
  color: '#e0b3ff', // 연보라
  emissive: '#c299fc',
  emissiveIntensity: 0.7,
  transparent: true,
  opacity: 0.95,
});
// 민트 발광 재질 (구)
const glowingMaterialMint = new three.MeshStandardMaterial({
  color: '#00ffd0', // 민트
  emissive: '#00e6b8',
  emissiveIntensity: 2.5, // 매우 높은 발광 강도
  transparent: true,
  opacity: 0.95,
});
// 연민트 발광 재질 (선)
const glowingMaterialMintLine = new three.MeshStandardMaterial({
  color: '#b2fff6', // 연민트
  emissive: '#7fffd4',
  emissiveIntensity: 0.7,
  transparent: true,
  opacity: 0.95,
});

export const Scene = (props: React.ComponentProps<'group'> & { onCubeClick?: () => void; isCubeActive?: boolean }) => {
  const { onCubeClick, isCubeActive, ...groupProps } = props;
  const { nodes, materials } = useGLTF('/space_boi.glb');
  const floatingGroupRef = useRef<three.Group>(null);
  const { theme } = useTheme();
  // 행성 회전 애니메이션 상태
  const planetGroupRef = useRef<three.Group>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const handlePlanetClick = (event: any) => {
    event.stopPropagation(); // 이벤트 버블링 방지
    setIsSpinning((prev) => !prev); // useState로 토글
  };

  useEffect(() => {
    // 최초 마운트 시에만 초기 회전값 할당
    if (planetGroupRef.current) {
      planetGroupRef.current.rotation.x = -Math.PI / 2;
      planetGroupRef.current.rotation.y = 0;
      planetGroupRef.current.rotation.z = 0;
    }
  }, []);

  useFrame((_, delta) => {
    if (isSpinning && planetGroupRef.current) {
      // Y축으로만 회전 (옆으로 회전)
      planetGroupRef.current.rotation.z += delta * 3; // 적당한 속도로 회전
      planetGroupRef.current.rotation.x = -Math.PI / 2 + Math.sin(planetGroupRef.current.rotation.z) * 0.1;
    }
  });

  // 두 번째 행성 회전/발광 상태
  const planetGroupRef2 = useRef<three.Group>(null);
  const [isSpinning2, setIsSpinning2] = useState(false);

  const handlePlanet2Click = (event: any) => {
    event.stopPropagation();
    setIsSpinning2((prev) => !prev);
  };

  useEffect(() => {
    if (planetGroupRef2.current) {
      planetGroupRef2.current.rotation.x = -Math.PI / 2;
      planetGroupRef2.current.rotation.y = 0;
      planetGroupRef2.current.rotation.z = 0;
    }
  }, []);

  useFrame((_, delta) => {
    if (isSpinning2 && planetGroupRef2.current) {
      planetGroupRef2.current.rotation.z += delta * 3;
      planetGroupRef2.current.rotation.x = -Math.PI / 2 + Math.sin(planetGroupRef2.current.rotation.z) * 0.1;
    }
  });

  // 세 번째 mesh(planetGroupRef2) 회전/발광 상태
  const meshRef262 = useRef<three.Mesh>(null);
  const [isSpinning262, setIsSpinning262] = useState(false);

  const handlePlanet262Click = (event: any) => {
    event.stopPropagation();
    setIsSpinning262((prev) => !prev);
  };

  useEffect(() => {
    if (meshRef262.current) {
      meshRef262.current.rotation.x = -Math.PI / 2;
      meshRef262.current.rotation.y = 0;
      meshRef262.current.rotation.z = 0;
    }
  }, []);

  useFrame((_, delta) => {
    if (isSpinning262 && meshRef262.current) {
      meshRef262.current.rotation.z += delta * 3;
      meshRef262.current.rotation.x = -Math.PI / 2 + Math.sin(meshRef262.current.rotation.z) * 0.1;
    }
  });

  // 세 번째 mesh(planetGroupRef2) 회전/발광 상태
  const meshRef375 = useRef<three.Mesh>(null);
  const [isSpinning375, setIsSpinning375] = useState(false);

  const handlePlanet375Click = (event: any) => {
    event.stopPropagation();
    setIsSpinning375((prev) => !prev);
  };

  useEffect(() => {
    if (meshRef375.current) {
      meshRef375.current.rotation.x = -Math.PI / 2;
      meshRef375.current.rotation.y = 0;
      meshRef375.current.rotation.z = 0;
    }
  }, []);

  useFrame((_, delta) => {
    if (isSpinning375 && meshRef375.current) {
      meshRef375.current.rotation.z += delta * 3;
      meshRef375.current.rotation.x = -Math.PI / 2 + Math.sin(meshRef375.current.rotation.z) * 0.1;
    }
  });
  return (
    <>
      <fog attach='fog' args={['#000022', 0, 3000]} />
      <group ref={floatingGroupRef}>
        <group {...groupProps} dispose={null}>
          <group scale={0.01}>
            <group rotation={[-Math.PI / 2, 0, 0]} scale={1}>
              <RoomModel position={[0, 0, 20]} />
              <CubeModel position={[0, -100, 300]} onClick={onCubeClick} />
              <NeuralNetwork />
              <fog attach='fog' args={['#202025', 0, 80]} />

              {theme === 'light' && !isCubeActive && (
                
                  <EffectComposer>
                    <Bloom mipmapBlur luminanceThreshold={1} radius={0.7} intensity={0.5} />
                  </EffectComposer>
                  
              )}
            </group>

            {/* 클릭 가능한 행성 그룹 - 발광 효과 추가 */}
            {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
            <group
              ref={planetGroupRef}
              position={[-357.404, 392.646, 0]}
              scale={39.706}
              onClick={handlePlanetClick}
              onPointerOver={(e) => {
                e.stopPropagation();
                document.body.style.cursor = 'pointer';
              }}
              onPointerOut={(e) => {
                e.stopPropagation();
                document.body.style.cursor = 'auto';
              }}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Sphere002_Material001_0 as three.Mesh).geometry}
                material={isSpinning ? glowingMaterial : materials['Material.001']}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Sphere002_Material002_0 as three.Mesh).geometry}
                material={isSpinning ? glowingMaterial : materials['Material.002']}
              />
            </group>

            {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
            <group
              ref={planetGroupRef2}
              position={[199.634, 566.883, -221.001]}
              scale={39.706}
              onClick={handlePlanet2Click}
              onPointerOver={(e) => {
                e.stopPropagation();
                document.body.style.cursor = 'pointer';
              }}
              onPointerOut={(e) => {
                e.stopPropagation();
                document.body.style.cursor = 'auto';
              }}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Sphere007_Material001_0 as three.Mesh).geometry}
                material={isSpinning2 ? glowingMaterial2 : materials['Material.001']}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Sphere007_Material002_0 as three.Mesh).geometry}
                material={isSpinning2 ? glowingMaterial2 : materials['Material.002']}
              />
            </group>
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.waves_Material002_0 as three.Mesh).geometry}
              material={materials['Material.002']}
              rotation={[-Math.PI / 2, 0, 0]}
              scale={[100, 100, 1.891]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.waves1_Material002_0 as three.Mesh).geometry}
              material={materials['Material.002']}
              rotation={[-Math.PI / 2, 0, 0]}
              scale={[100, 100, 1.891]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.waves2_Material002_0 as three.Mesh).geometry}
              material={materials['Material.002']}
              position={[92.464, 15.529, 2.112]}
              rotation={[-Math.PI / 2, 0, 0]}
              scale={[100, 100, 1.891]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.particles_Material002_0 as three.Mesh).geometry}
              material={materials['Material.002']}
              position={[489.69, 793.811, 355.293]}
              rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
              scale={20.408}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Sphere_Material001_0 as three.Mesh).geometry}
              material={isSpinning375 ? glowingMaterialMint : materials['Material.001']}
              position={[375.469, 427.948, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
              scale={62.402}
              ref={meshRef375}
            />
            {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Sphere001_Material002_0 as three.Mesh).geometry}
              material={isSpinning375 ? glowingMaterialMintLine : materials['Material.002']}
              position={[375.469, 427.948, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
              scale={60.324}
              onClick={handlePlanet375Click}
              onPointerOver={(e) => {
                e.stopPropagation();
                document.body.style.cursor = 'pointer';
              }}
              onPointerOut={(e) => {
                e.stopPropagation();
                document.body.style.cursor = 'auto';
              }}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Sphere004_Material002_0 as three.Mesh).geometry}
              material={materials['Material.002']}
              position={[375.469, 427.948, 0]}
              rotation={[-0.688, 0, 0]}
              scale={[104.129, 81.609, 0]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Sphere005_Material001_0 as three.Mesh).geometry}
              material={isSpinning262 ? glowingMaterialLine : materials['Material.001']}
              position={[-341.988, 460.196, -117.028]}
              rotation={[-Math.PI / 2, 0, 0]}
              scale={62.402}
              ref={meshRef262}
            />
            {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Sphere006_Material002_0 as three.Mesh).geometry}
              material={isSpinning262 ? glowingMaterialPurple : materials['Material.002']}
              position={[-341.988, 460.196, -117.028]}
              rotation={[-Math.PI / 2, 0, 0]}
              scale={60.324}
              onClick={handlePlanet262Click}
              onPointerOver={(e) => {
                e.stopPropagation();
                document.body.style.cursor = 'pointer';
              }}
              onPointerOut={(e) => {
                e.stopPropagation();
                document.body.style.cursor = 'auto';
              }}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Sphere009_Material002_0 as three.Mesh).geometry}
              material={materials['Material.002']}
              position={[507.522, 667.594, -214.475]}
              rotation={[-Math.PI / 2, 0, 0]}
              scale={16.881}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Sphere010_Material002_0 as three.Mesh).geometry}
              material={materials['Material.002']}
              position={[-287.442, 585.792, -311.857]}
              rotation={[-Math.PI / 2, 0, 0]}
              scale={16.881}
            />
            {/* 바닥 */}
            {/* <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Sphere011_Material002_0 as three.Mesh).geometry}
              material={mirrorMaterial}
              position={[-553.462, 331.074, -379.067]}
              rotation={[-Math.PI / 2, 0, 0]}
              scale={11.437}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Cube_Material001_0 as three.Mesh).geometry}
              material={spaceMaterial}
              position={[0, -101.673, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
              scale={[50000, 50000, 100]}
            /> */}
            <mesh
              ref={planetGroupRef}
              castShadow
              receiveShadow
              geometry={(nodes.Sphere003_Material002_0 as three.Mesh).geometry}
              material={materials['Material.002']}
              position={[-357.404, 392.646, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
              scale={41.075}
            />
            <mesh
              ref={planetGroupRef2}
              castShadow
              receiveShadow
              geometry={(nodes.Sphere008_Material002_0 as three.Mesh).geometry}
              material={materials['Material.002']}
              position={[199.634, 566.883, -221.001]}
              rotation={[-Math.PI / 2, 0, 0]}
              scale={41.075}
            />
          </group>
        </group>
      </group>
    </>
  );
};
