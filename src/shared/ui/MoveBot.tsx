import { useEffect, useRef } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import type * as three from 'three';

export function MoveBot(props: any) {
  const group = useRef<three.Group>(null);
  const { nodes, materials, animations } = useGLTF('/cute_home_robot.glb');
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
        <group name='Sketchfab_model' rotation={[-Math.PI / 2, 0, 0]} scale={0.057}>
          <group name='edca9fd234644d5480a540acc91ca584fbx' rotation={[Math.PI / 2, 0, 0]}>
            <group name='Object_2'>
              <group name='RootNode'>
                <group name='Object_4'>
                  <primitive object={nodes?._rootJoint as three.Object3D} />
                  <skinnedMesh
                    name='Object_7'
                    geometry={(nodes?.Object_7 as three.Mesh)?.geometry}
                    material={materials?.M_Metal1}
                    skeleton={(nodes?.Object_7 as three.SkinnedMesh)?.skeleton}
                  />
                  <skinnedMesh
                    name='Object_8'
                    geometry={(nodes?.Object_8 as three.Mesh)?.geometry}
                    material={materials?.M_Pantalla1}
                    skeleton={(nodes?.Object_8 as three.SkinnedMesh)?.skeleton}
                  />
                  <skinnedMesh
                    name='Object_9'
                    geometry={(nodes?.Object_9 as three.Mesh)?.geometry}
                    material={materials?.M_Pantalla2}
                    skeleton={(nodes?.Object_9 as three.SkinnedMesh)?.skeleton}
                  />
                  <skinnedMesh
                    name='Object_10'
                    geometry={(nodes?.Object_10 as three.Mesh)?.geometry}
                    material={materials?.M_Rueda}
                    skeleton={(nodes?.Object_10 as three.SkinnedMesh)?.skeleton}
                  />
                  <group name='Object_6' position={[0, 10, 0]} rotation={[-Math.PI / 2, 0, 0]} />
                  <group name='Robo' position={[0, 10, 0]} rotation={[-Math.PI / 2, 0, 0]} />
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload('/cute_home_robot.glb');
