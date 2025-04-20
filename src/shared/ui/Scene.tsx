import { Model as RoomModel } from '@/shared/ui/Room';
import { Float, useGLTF } from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import type React from 'react';
import { useState, useRef } from 'react';
import type * as three from 'three';
import { Atom } from './Atom';
import { CubeModel } from './Cube';
import { NeuralNetwork } from './NeutralNetwork';

export function Model(props: React.ComponentProps<'group'>) {
  const { nodes, materials } = useGLTF('/space_boi.glb');
  const [isCubeHovered, setIsCubeHovered] = useState(false);
  const floatingGroupRef = useRef<three.Group>(null);

  // 호버 상태 변경 핸들러
  const handleCubeHover = (hovered: boolean) => {
    setIsCubeHovered(hovered);
  };

  return (
    <>
      <fog attach='fog' args={['#000022', 0, 3000]} />
      <group ref={floatingGroupRef}>
        <group {...props} dispose={null}>
          <group scale={0.01}>
            <group rotation={[-Math.PI / 2, 0, 0]} scale={1}>
              <RoomModel position={[0, 0, 20]} />
              <CubeModel position={[0, -100, 300]} onHover={handleCubeHover} />
              <NeuralNetwork />
              {/* <group rotation={[10, 10.5, 10]} scale={30}>
              <fog attach="fog" args={['#202025', 0, 80]} />

              <Cloud />
            </group> */}
              {/* <TrackballControls /> */}
              {isCubeHovered && (
                <>
                  <Float speed={4} rotationIntensity={1} floatIntensity={2}>
                    <Atom />
                  </Float>
                  <EffectComposer>
                    <Bloom mipmapBlur luminanceThreshold={1} radius={0.7} />
                  </EffectComposer>
                </>
              )}
            </group>
            <group position={[-357.404, 392.646, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={39.706}>
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Sphere002_Material001_0 as three.Mesh).geometry}
                material={materials['Material.001']}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Sphere002_Material002_0 as three.Mesh).geometry}
                material={materials['Material.002']}
              />
            </group>
            <group position={[199.634, 566.883, -221.001]} rotation={[-Math.PI / 2, 0, 0]} scale={39.706}>
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Sphere007_Material001_0 as three.Mesh).geometry}
                material={materials['Material.001']}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Sphere007_Material002_0 as three.Mesh).geometry}
                material={materials['Material.002']}
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
              material={materials['Material.001']}
              position={[375.469, 427.948, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
              scale={62.402}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Sphere001_Material002_0 as three.Mesh).geometry}
              material={materials['Material.002']}
              position={[375.469, 427.948, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
              scale={60.324}
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
              material={materials['Material.001']}
              position={[-341.988, 460.196, -117.028]}
              rotation={[-Math.PI / 2, 0, 0]}
              scale={62.402}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Sphere006_Material002_0 as three.Mesh).geometry}
              material={materials['Material.002']}
              position={[-341.988, 460.196, -117.028]}
              rotation={[-Math.PI / 2, 0, 0]}
              scale={60.324}
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
              castShadow
              receiveShadow
              geometry={(nodes.Sphere003_Material002_0 as three.Mesh).geometry}
              material={materials['Material.002']}
              position={[-357.404, 392.646, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
              scale={41.075}
            />
            <mesh
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
}

useGLTF.preload('/space_boi.glb');
