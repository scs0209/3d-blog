import { useEffect, useRef } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import type * as three from 'three';

export function HoloTable(props: any) {
  const group = useRef<three.Group>(null);
  const { nodes, materials, animations } = useGLTF('/holo-table.glb');
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
        <group name='Sketchfab_model' rotation={[-Math.PI / 2, 0, 0]} scale={0.013}>
          <group name='Holo_Tablefbx' rotation={[Math.PI / 2, 0, 0]}>
            <group name='Object_2'>
              <group name='RootNode'>
                <group name='Table' position={[0, 55.561, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={15.48}>
                  <mesh
                    name='Table_Table_0'
                    castShadow
                    receiveShadow
                    geometry={(nodes.Table_Table_0 as three.Mesh)?.geometry}
                    material={materials.Table}
                  />
                </group>
                <group name='Hologram' position={[0, 149.32, 0]} rotation={[-Math.PI / 2, 0.41, 0.016]} scale={52.304}>
                  <mesh
                    name='Hologram_Hologram_0'
                    castShadow
                    receiveShadow
                    geometry={(nodes.Hologram_Hologram_0 as three.Mesh)?.geometry}
                    material={materials.Hologram}
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

useGLTF.preload('/holo-table.glb');
