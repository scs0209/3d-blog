import { useAnimations, useGLTF } from '@react-three/drei';
import { useRef } from 'react';
import type * as three from 'three';

export function ContactMe(props: any) {
  const group = useRef<three.Group>(null);
  const { nodes, materials, animations } = useGLTF('/sci-fi_door..glb');
  const { actions } = useAnimations(animations, group);

  // useEffect(() => {
  //   if (actions) {
  //     for (const action of Object.values(actions)) {
  //       if (action) {
  //         action.play();
  //       }
  //     }
  //   }
  // }, []);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name='Sketchfab_Scene'>
        <group name='Sketchfab_model' rotation={[-Math.PI / 2, 0, 0]}>
          <group name='root'>
            <group name='GLTF_SceneRootNode' rotation={[Math.PI / 2, 0, 0]}>
              <group name='panel_top_0' position={[-0.038, 1.477, 0.009]}>
                <mesh
                  name='Object_4'
                  castShadow
                  receiveShadow
                  geometry={(nodes.Object_4 as three.Mesh)?.geometry}
                  material={materials['Material.006']}
                />
                <mesh
                  name='Object_5'
                  castShadow
                  receiveShadow
                  geometry={(nodes.Object_5 as three.Mesh)?.geometry}
                  material={materials['Material.010']}
                />
                <mesh
                  name='Object_6'
                  castShadow
                  receiveShadow
                  geometry={(nodes.Object_6 as three.Mesh)?.geometry}
                  material={materials['Material.013']}
                />
              </group>
              <group name='panel_bottom_3' position={[0, 0.559, 0]}>
                <group name='Bone_2' position={[0, -0.5, 0]}>
                  <group name='Plane002_1' position={[0, 0.448, 0]}>
                    <mesh
                      name='Object_10'
                      castShadow
                      receiveShadow
                      geometry={(nodes.Object_10 as three.Mesh)?.geometry}
                      material={materials['Material.007']}
                    />
                  </group>
                </group>
              </group>
              <group name='panel_side_top_6' position={[0, 2.951, 0]}>
                <group name='Bone_5' rotation={[0, 0, Math.PI]}>
                  <group name='Plane001_4' position={[0, 2.408, 0]} rotation={[0, 0, Math.PI]}>
                    <mesh
                      name='Object_14'
                      castShadow
                      receiveShadow
                      geometry={(nodes.Object_14 as three.Mesh)?.geometry}
                      material={materials['Material.007']}
                    />
                  </group>
                </group>
              </group>
              <group name='panel_side_R__9' position={[0.714, 1.639, 0]} rotation={[0, 0, -Math.PI / 2]}>
                <group name='Bone_8' position={[0, 0.344, 0]} rotation={[0, 0, Math.PI]}>
                  <group name='Plane008_7' position={[-1.639, 1.069, 0]} rotation={[0, 0, -Math.PI / 2]}>
                    <mesh
                      name='Object_18'
                      castShadow
                      receiveShadow
                      geometry={(nodes.Object_18 as three.Mesh)?.geometry}
                      material={materials['Material.007']}
                    />
                  </group>
                </group>
              </group>
              <group name='irons_12' position={[0.017, 1.315, 0]}>
                <mesh
                  name='Object_23'
                  castShadow
                  receiveShadow
                  geometry={(nodes.Object_23 as three.Mesh)?.geometry}
                  material={materials['Material.009']}
                />
              </group>
              <group name='strings_13' position={[0.307, 0.03, 0]}>
                <mesh
                  name='Object_25'
                  castShadow
                  receiveShadow
                  geometry={(nodes.Object_25 as three.Mesh)?.geometry}
                  material={materials['Material.006']}
                />
              </group>
              <group name='lights_14' position={[0.001, 2.771, -0.001]} rotation={[Math.PI / 2, 0, 0]}>
                <mesh
                  name='Object_27'
                  castShadow
                  receiveShadow
                  geometry={(nodes.Object_27 as three.Mesh)?.geometry}
                  material={materials['Material.006']}
                />
                <mesh
                  name='Object_28'
                  castShadow
                  receiveShadow
                  geometry={(nodes.Object_28 as three.Mesh)?.geometry}
                  material={materials['Material.002']}
                />
              </group>
              <group name='panel_side_R_001_19' position={[-0.714, 1.642, 0]} rotation={[0, 0, Math.PI / 2]}>
                <group name='Bone_18' position={[0, 0.344, 0]} rotation={[0, 0, Math.PI]}>
                  <group name='Plane003_16' position={[1.642, 1.055, 0]} rotation={[0, 0, Math.PI / 2]}>
                    <mesh
                      name='Object_32'
                      castShadow
                      receiveShadow
                      geometry={(nodes.Object_32 as three.Mesh)?.geometry}
                      material={materials['Material.007']}
                    />
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

useGLTF.preload('/sci-fi_door..glb');
