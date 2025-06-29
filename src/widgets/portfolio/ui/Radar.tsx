import { useEffect, useRef } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import type * as three from 'three';

export function Radar(props: any) {
  const group = useRef<three.Group>(null);
  const { nodes, materials, animations } = useGLTF('/rts_radar_tower.glb');
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
          <group name='d41881aed2fa40e59dfbc48a1b196a48fbx' rotation={[Math.PI / 2, 0, 0]}>
            <group name='Object_2'>
              <group name='RootNode'>
                <group
                  name='antene'
                  position={[397.035, 850.524, -3.714]}
                  rotation={[Math.PI, 0.419, -Math.PI]}
                  scale={15.75}
                >
                  <mesh
                    name='antene_antene_0'
                    castShadow
                    receiveShadow
                    geometry={(nodes.antene_antene_0 as three.Mesh)?.geometry}
                    material={materials.antene}
                  />
                </group>
                <group name='radar_tower' scale={15.75}>
                  <mesh
                    name='radar_tower_build_0'
                    castShadow
                    receiveShadow
                    geometry={(nodes.radar_tower_build_0 as three.Mesh)?.geometry}
                    material={materials.build}
                  />
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload('/rts_radar_tower.glb');
