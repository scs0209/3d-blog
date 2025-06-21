import { useGLTF } from '@react-three/drei';
import type * as three from 'three';

export function ContactMe(props: any) {
  const { nodes, materials } = useGLTF('/cyberpunk_city_-_1.glb');

  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]} scale={0.449}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <group rotation={[Math.PI / 2, 0, 0]} scale={0.015}>
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Object_4 as three.Mesh)?.geometry}
              material={materials.Meshpart1Mtl}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Object_5 as three.Mesh)?.geometry}
              material={materials.Meshpart2Mtl}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Object_6 as three.Mesh)?.geometry}
              material={materials.Meshpart3Mtl}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Object_7 as three.Mesh)?.geometry}
              material={materials.Meshpart4Mtl}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Object_8 as three.Mesh)?.geometry}
              material={materials.Meshpart5Mtl}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Object_9 as three.Mesh)?.geometry}
              material={materials.Meshpart6Mtl}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Object_10 as three.Mesh)?.geometry}
              material={materials.Meshpart7Mtl}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Object_11 as three.Mesh)?.geometry}
              material={materials.Meshpart8Mtl}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Object_12 as three.Mesh)?.geometry}
              material={materials.Meshpart9Mtl}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Object_13 as three.Mesh)?.geometry}
              material={materials.Meshpart11Mtl}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Object_14 as three.Mesh)?.geometry}
              material={materials.Meshpart12Mtl}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Object_15 as three.Mesh)?.geometry}
              material={materials.Meshpart13Mtl}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Object_16 as three.Mesh)?.geometry}
              material={materials.Meshpart14Mtl}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Object_17 as three.Mesh)?.geometry}
              material={materials.Meshpart15Mtl}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Object_18 as three.Mesh)?.geometry}
              material={materials.Meshpart16Mtl}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Object_19 as three.Mesh)?.geometry}
              material={materials.Meshpart17Mtl}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Object_20 as three.Mesh)?.geometry}
              material={materials.Meshpart18Mtl}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Object_21 as three.Mesh)?.geometry}
              material={materials.Meshpart19Mtl}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Object_22 as three.Mesh)?.geometry}
              material={materials.Meshpart20Mtl}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Object_23 as three.Mesh)?.geometry}
              material={materials.Meshpart21Mtl}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Object_24 as three.Mesh)?.geometry}
              material={materials.Meshpart22Mtl}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Object_25 as three.Mesh)?.geometry}
              material={materials.Meshpart23Mtl}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Object_26 as three.Mesh)?.geometry}
              material={materials.Meshpart24Mtl}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Object_27 as three.Mesh)?.geometry}
              material={materials.Meshpart26Mtl}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Object_28 as three.Mesh)?.geometry}
              material={materials.Meshpart27Mtl}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Object_29 as three.Mesh)?.geometry}
              material={materials.Meshpart28Mtl}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Object_30 as three.Mesh)?.geometry}
              material={materials.Meshpart30Mtl}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Object_31 as three.Mesh)?.geometry}
              material={materials.Meshpart32Mtl}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Object_32 as three.Mesh)?.geometry}
              material={materials.Meshpart35Mtl}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Object_33 as three.Mesh)?.geometry}
              material={materials.Meshpart36Mtl}
            />
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload('/cyberpunk_city_-_1.glb');
