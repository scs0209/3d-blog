import { useEffect, useRef } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as three from 'three';

// 사이버펑크 안테나 특수 재질들
const cyberpunkAntennaMaterials = {
  // 빨간 전선 - 빨간 네온
  redWireGlow: new three.MeshStandardMaterial({
    color: '#ff0040',
    emissive: '#ff0040',
    emissiveIntensity: 0.8,
    metalness: 0.3,
    roughness: 0.4,
    toneMapped: false,
  }),
  // 파란 전선 - 파란 네온
  blueWireGlow: new three.MeshStandardMaterial({
    color: '#0080ff',
    emissive: '#0080ff',
    emissiveIntensity: 0.8,
    metalness: 0.3,
    roughness: 0.4,
    toneMapped: false,
  }),
  // 녹색 부분 - 강한 녹색 발광
  greenGlow: new three.MeshStandardMaterial({
    color: '#00ff40',
    emissive: '#00ff40',
    emissiveIntensity: 1.2,
    metalness: 0.5,
    roughness: 0.3,
    toneMapped: false,
  }),
  // 디스크 - 은색 메탈릭 발광
  dishGlow: new three.MeshStandardMaterial({
    color: '#9696a7',
    emissive: '#202040',
    emissiveIntensity: 0.3,
    metalness: 0.9,
    roughness: 0.1,
  }),
  // 전기 로고 - 노란 발광
  logoGlow: new three.MeshStandardMaterial({
    color: '#ffff00',
    emissive: '#ffff00',
    emissiveIntensity: 1.0,
    metalness: 0.2,
    roughness: 0.5,
    toneMapped: false,
  }),
  // 검은 전선 - 보라색 네온
  blackWireGlow: new three.MeshStandardMaterial({
    color: '#0080ff',
    emissive: '#0080ff',
    emissiveIntensity: 0.6,
    metalness: 0.3,
    roughness: 0.4,
    toneMapped: false,
  }),
  // 바닥 받침대 - 검정색 메탈
  blackBaseMetal: new three.MeshStandardMaterial({
    color: '#1a1a1a',
    metalness: 0.8,
    roughness: 0.3,
    envMapIntensity: 1.0,
  }),
  // 상부 본체 - 은색 메탈
  silverBodyMetal: new three.MeshStandardMaterial({
    color: '#e8e8e8',
    metalness: 0.9,
    roughness: 0.2,
    envMapIntensity: 1.5,
  }),
};

export function Antenna(props: any) {
  const group = useRef<three.Group>(null);
  const { nodes, materials, animations } = useGLTF('/antena_alma__modelo_norteamericano..glb');
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (actions) {
      for (const action of Object.values(actions)) {
        if (action) {
          action.play();
        }
      }
    }
  }, [actions]);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name='Sketchfab_Scene'>
        <group name='Sketchfab_model' rotation={[-Math.PI / 2, 0, 0]}>
          <group name='root'>
            <group name='GLTF_SceneRootNode' rotation={[Math.PI / 2, 0, 0]}>
              <group name='american_with_barrier_8' rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
                <group
                  name='almaVertex_7'
                  position={[0.977, -8.008, 8.6]}
                  rotation={[0, 0, -Math.PI / 2]}
                  scale={2.743}
                >
                  <group
                    name='antenna_base_0'
                    position={[-0.126, -1.91, -19.184]}
                    rotation={[0, 0, -2.422]}
                    scale={[0.2, 0.2, 0.271]}
                  >
                    <mesh
                      name='Object_6'
                      castShadow
                      receiveShadow
                      geometry={(nodes.Object_6 as three.Mesh)?.geometry}
                      material={materials.Dish_Door2}
                    />
                    <mesh
                      name='Object_7'
                      castShadow
                      receiveShadow
                      geometry={(nodes.Object_7 as three.Mesh)?.geometry}
                      material={cyberpunkAntennaMaterials.blackBaseMetal}
                    />
                    <mesh
                      name='Object_8'
                      castShadow
                      receiveShadow
                      geometry={(nodes.Object_8 as three.Mesh)?.geometry}
                      material={materials['03___Default8']}
                    />
                  </group>
                  <group name='azimuth_6' position={[-0.22, -1.72, -26.5]} rotation={[0, 0, Math.PI / 2]} scale={0.769}>
                    <group name='elevation_axis_4' position={[1.213, -0.088, -89.6]} rotation={[0, 0.154, Math.PI / 2]}>
                      <group
                        name='VertexRSIH_MeshPart0_1'
                        position={[-0.074, -0.526, -2.721]}
                        rotation={[0, 0, -Math.PI / 2]}
                        scale={0.26}
                      >
                        <mesh
                          name='Object_12'
                          castShadow
                          receiveShadow
                          geometry={(nodes.Object_12 as three.Mesh)?.geometry}
                          material={cyberpunkAntennaMaterials.silverBodyMetal}
                        />
                        <mesh
                          name='Object_13'
                          castShadow
                          receiveShadow
                          geometry={(nodes.Object_13 as three.Mesh)?.geometry}
                          material={cyberpunkAntennaMaterials.blueWireGlow}
                        />
                        <mesh
                          name='Object_14'
                          castShadow
                          receiveShadow
                          geometry={(nodes.Object_14 as three.Mesh)?.geometry}
                          material={cyberpunkAntennaMaterials.redWireGlow}
                        />
                      </group>
                      <group
                        name='VertexRSIH_MeshPart1_2'
                        position={[-0.074, -0.526, -2.721]}
                        rotation={[0, 0, -Math.PI / 2]}
                        scale={0.26}
                      >
                        <mesh
                          name='Object_16'
                          castShadow
                          receiveShadow
                          geometry={(nodes.Object_16 as three.Mesh)?.geometry}
                          material={cyberpunkAntennaMaterials.blueWireGlow}
                        />
                        <mesh
                          name='Object_17'
                          castShadow
                          receiveShadow
                          geometry={(nodes.Object_17 as three.Mesh)?.geometry}
                          material={materials.black}
                        />
                        <mesh
                          name='Object_18'
                          castShadow
                          receiveShadow
                          geometry={(nodes.Object_18 as three.Mesh)?.geometry}
                          material={materials.Metal}
                        />
                        <mesh
                          name='Object_19'
                          castShadow
                          receiveShadow
                          geometry={(nodes.Object_19 as three.Mesh)?.geometry}
                          material={materials.WhitePlate}
                        />
                        <mesh
                          name='Object_20'
                          castShadow
                          receiveShadow
                          geometry={(nodes.Object_20 as three.Mesh)?.geometry}
                          material={materials.ribbles}
                        />
                        <mesh
                          name='Object_21'
                          castShadow
                          receiveShadow
                          geometry={(nodes.Object_21 as three.Mesh)?.geometry}
                          material={cyberpunkAntennaMaterials.silverBodyMetal}
                        />
                        <mesh
                          name='Object_22'
                          castShadow
                          receiveShadow
                          geometry={(nodes.Object_22 as three.Mesh)?.geometry}
                          material={materials.ARMFRONT}
                        />
                        <mesh
                          name='Object_23'
                          castShadow
                          receiveShadow
                          geometry={(nodes.Object_23 as three.Mesh)?.geometry}
                          material={cyberpunkAntennaMaterials.blackWireGlow}
                        />
                        <mesh
                          name='Object_24'
                          castShadow
                          receiveShadow
                          geometry={(nodes.Object_24 as three.Mesh)?.geometry}
                          material={materials.Screws01DiffuseMap}
                        />
                        <mesh
                          name='Object_25'
                          castShadow
                          receiveShadow
                          geometry={(nodes.Object_25 as three.Mesh)?.geometry}
                          material={cyberpunkAntennaMaterials.silverBodyMetal}
                        />
                        <mesh
                          name='Object_26'
                          castShadow
                          receiveShadow
                          geometry={(nodes.Object_26 as three.Mesh)?.geometry}
                          material={cyberpunkAntennaMaterials.silverBodyMetal}
                        />
                        <mesh
                          name='Object_27'
                          castShadow
                          receiveShadow
                          geometry={(nodes.Object_27 as three.Mesh)?.geometry}
                          material={cyberpunkAntennaMaterials.silverBodyMetal}
                        />
                        <mesh
                          name='Object_28'
                          castShadow
                          receiveShadow
                          geometry={(nodes.Object_28 as three.Mesh)?.geometry}
                          material={materials.MetalStrip}
                        />
                        <mesh
                          name='Object_29'
                          castShadow
                          receiveShadow
                          geometry={(nodes.Object_29 as three.Mesh)?.geometry}
                          material={materials.DishCenter}
                        />
                        <mesh
                          name='Object_30'
                          castShadow
                          receiveShadow
                          geometry={(nodes.Object_30 as three.Mesh)?.geometry}
                          material={materials.SCREWS}
                        />
                        <mesh
                          name='Object_31'
                          castShadow
                          receiveShadow
                          geometry={(nodes.Object_31 as three.Mesh)?.geometry}
                          material={cyberpunkAntennaMaterials.greenGlow}
                        />
                        <mesh
                          name='Object_32'
                          castShadow
                          receiveShadow
                          geometry={(nodes.Object_32 as three.Mesh)?.geometry}
                          material={materials.Tape}
                        />
                      </group>
                      <group
                        name='VertexRSIH_MeshPart2_3'
                        position={[-0.074, -0.526, -2.721]}
                        rotation={[0, 0, -Math.PI / 2]}
                        scale={0.26}
                      >
                        <mesh
                          name='Object_34'
                          castShadow
                          receiveShadow
                          geometry={(nodes.Object_34 as three.Mesh)?.geometry}
                          material={cyberpunkAntennaMaterials.silverBodyMetal}
                        />
                        <mesh
                          name='Object_35'
                          castShadow
                          receiveShadow
                          geometry={(nodes.Object_35 as three.Mesh)?.geometry}
                          material={materials.Screws01DiffuseMap}
                        />
                        <mesh
                          name='Object_36'
                          castShadow
                          receiveShadow
                          geometry={(nodes.Object_36 as three.Mesh)?.geometry}
                          material={cyberpunkAntennaMaterials.greenGlow}
                        />
                        <mesh
                          name='Object_37'
                          castShadow
                          receiveShadow
                          geometry={(nodes.Object_37 as three.Mesh)?.geometry}
                          material={materials.Tape}
                        />
                        <mesh
                          name='Object_38'
                          castShadow
                          receiveShadow
                          geometry={(nodes.Object_38 as three.Mesh)?.geometry}
                          material={materials.PLATE}
                        />
                        <mesh
                          name='Object_39'
                          castShadow
                          receiveShadow
                          geometry={(nodes.Object_39 as three.Mesh)?.geometry}
                          material={materials.Dish_Door2}
                        />
                        <mesh
                          name='Object_40'
                          castShadow
                          receiveShadow
                          geometry={(nodes.Object_40 as three.Mesh)?.geometry}
                          material={materials['01___Default']}
                        />
                        <mesh
                          name='Object_41'
                          castShadow
                          receiveShadow
                          geometry={(nodes.Object_41 as three.Mesh)?.geometry}
                          material={cyberpunkAntennaMaterials.dishGlow}
                        />
                        <mesh
                          name='Object_42'
                          castShadow
                          receiveShadow
                          geometry={(nodes.Object_42 as three.Mesh)?.geometry}
                          material={materials.Copper}
                        />
                        <mesh
                          name='Object_43'
                          castShadow
                          receiveShadow
                          geometry={(nodes.Object_43 as three.Mesh)?.geometry}
                          material={cyberpunkAntennaMaterials.blackWireGlow}
                        />
                        <mesh
                          name='Object_44'
                          castShadow
                          receiveShadow
                          geometry={(nodes.Object_44 as three.Mesh)?.geometry}
                          material={materials.SmallPlate}
                        />
                      </group>
                    </group>
                    <group name='fork_5' position={[0.016, -0.213, 1.943]} scale={[0.315, 0.33, 0.162]}>
                      <mesh
                        name='Object_46'
                        castShadow
                        receiveShadow
                        geometry={(nodes.Object_46 as three.Mesh)?.geometry}
                        material={materials.MetalBeam}
                      />
                      <mesh
                        name='Object_47'
                        castShadow
                        receiveShadow
                        geometry={(nodes.Object_47 as three.Mesh)?.geometry}
                        material={materials.ARMSIDE}
                      />
                      <mesh
                        name='Object_48'
                        castShadow
                        receiveShadow
                        geometry={(nodes.Object_48 as three.Mesh)?.geometry}
                        material={materials.ARMFRONT}
                      />
                      <mesh
                        name='Object_49'
                        castShadow
                        receiveShadow
                        geometry={(nodes.Object_49 as three.Mesh)?.geometry}
                        material={materials.METALBAR}
                      />
                      <mesh
                        name='Object_50'
                        castShadow
                        receiveShadow
                        geometry={(nodes.Object_50 as three.Mesh)?.geometry}
                        material={materials['24___Default']}
                      />
                      <mesh
                        name='Object_51'
                        castShadow
                        receiveShadow
                        geometry={(nodes.Object_51 as three.Mesh)?.geometry}
                        material={materials.White}
                      />
                      <mesh
                        name='Object_52'
                        castShadow
                        receiveShadow
                        geometry={(nodes.Object_52 as three.Mesh)?.geometry}
                        material={cyberpunkAntennaMaterials.blackBaseMetal}
                      />
                      <mesh
                        name='Object_53'
                        castShadow
                        receiveShadow
                        geometry={(nodes.Object_53 as three.Mesh)?.geometry}
                        material={cyberpunkAntennaMaterials.blackBaseMetal}
                      />
                      <mesh
                        name='Object_54'
                        castShadow
                        receiveShadow
                        geometry={(nodes.Object_54 as three.Mesh)?.geometry}
                        material={cyberpunkAntennaMaterials.logoGlow}
                      />
                      <mesh
                        name='Object_55'
                        castShadow
                        receiveShadow
                        geometry={(nodes.Object_55 as three.Mesh)?.geometry}
                        material={materials.DANGER}
                      />
                      <mesh
                        name='Object_56'
                        castShadow
                        receiveShadow
                        geometry={(nodes.Object_56 as three.Mesh)?.geometry}
                        material={materials.MetalVent}
                      />
                      <mesh
                        name='Object_57'
                        castShadow
                        receiveShadow
                        geometry={(nodes.Object_57 as three.Mesh)?.geometry}
                        material={materials.WhitePlate}
                      />
                      <mesh
                        name='Object_58'
                        castShadow
                        receiveShadow
                        geometry={(nodes.Object_58 as three.Mesh)?.geometry}
                        material={materials.Metal5}
                      />
                    </group>
                  </group>
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload('/antena_alma__modelo_norteamericano..glb');
