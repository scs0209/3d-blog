import { useRef, useEffect } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import type * as three from 'three';

export function HelloBot(props: any) {
  const group = useRef<three.Group>(null);
  const { nodes, materials, animations } = useGLTF('/friendly_sci-fi_robot_with_animations.glb');
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
        <group name='Sketchfab_model' rotation={[-Math.PI / 2, 0, 0]} scale={1.28}>
          <group name='root'>
            <group name='GLTF_SceneRootNode' rotation={[Math.PI / 2, 0, 0]}>
              <group name='Robot_12'>
                <group name='GLTF_created_0'>
                  <primitive object={nodes?.GLTF_created_0_rootJoint as three.Object3D} />
                  <skinnedMesh
                    name='Object_7'
                    geometry={(nodes?.Object_7 as three.Mesh)?.geometry}
                    material={materials['Material.002']}
                    skeleton={(nodes?.Object_7 as three.SkinnedMesh)?.skeleton}
                  />
                  <group name='temp_11' />
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload('/friendly_sci-fi_robot_with_animations.glb');
