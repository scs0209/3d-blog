import { useEffect, useRef } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import type { Group, Mesh, Material } from 'three';
import type { GLTF } from 'three-stdlib';

type GLTFResult = GLTF & {
  nodes: Record<string, Mesh>;
  materials: Record<string, Material>;
};

export function Planet(props: any) {
  const group = useRef<Group>(null);
  const { nodes, materials, animations } = useGLTF(
    '/earth_globe_hologram_2mb_looping_animation.glb',
    true,
  ) as unknown as GLTFResult;
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    // 모든 애니메이션 실행
    for (const action of Object.values(actions)) {
      if (action) {
        action
          .reset()
          .setEffectiveTimeScale(1)
          .setEffectiveWeight(1)
          .fadeIn(0.5)
          .play()
          .setLoop(2201, Number.POSITIVE_INFINITY);
      }
    }

    return () => {
      // cleanup: 모든 애니메이션 페이드 아웃
      for (const action of Object.values(actions)) {
        if (action) {
          action.fadeOut(0.5);
        }
      }
    };
  }, [actions]);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name='Sketchfab_Scene'>
        <group name='Sketchfab_model' rotation={[-Math.PI / 2, 0, 0]}>
          <group name='14451120394e4dd890e906789247ac40fbx' rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
            <group name='Object_2'>
              <group name='RootNode'>
                <group name='Earth_2' rotation={[-Math.PI / 2, 0, 0.025]} scale={100}>
                  <mesh
                    name='Earth_2_Earth_Surface002_0'
                    castShadow
                    receiveShadow
                    geometry={nodes.Earth_2_Earth_Surface002_0?.geometry}
                    material={materials['Earth_Surface.002']}
                  />
                </group>
                <group name='Earth_rays_2' rotation={[-Math.PI / 2, 0, 0.025]} scale={100}>
                  <mesh
                    name='Earth_rays_2_transparent004_0'
                    castShadow
                    receiveShadow
                    geometry={nodes.Earth_rays_2_transparent004_0?.geometry}
                    material={materials['transparent.004']}
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
