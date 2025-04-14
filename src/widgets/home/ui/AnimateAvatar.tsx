import { useRef, useEffect } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import type { Group, Material, Bone, SkinnedMesh } from 'three';
import type { GLTF } from 'three-stdlib';

// biome-ignore lint/style/noNamespace: GLB file node names must match exactly
type GLTFResult = GLTF & {
  nodes: {
    _rootJoint: Bone;
    Object_9: SkinnedMesh;
    Object_10: SkinnedMesh;
  };
  materials: {
    bake_1: Material;
    bake_2: Material;
  };
};

export function AnimateAvatar(props: { [key: string]: any }) {
  const group = useRef<Group>(null);
  const gltf = useGLTF('/astronaut_rigged_and_animated.glb');
  const { nodes, materials, animations } = gltf as unknown as GLTFResult;
  const { actions } = useAnimations(animations, group);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    // idle 애니메이션 실행
    const idleAction = actions['astro_bones|idle_1'];
    if (idleAction) {
      idleAction
        .reset()
        .setEffectiveTimeScale(1)
        .setEffectiveWeight(1)
        .fadeIn(0.5)
        .play()
        .setLoop(2201, Number.POSITIVE_INFINITY);
    } else {
      console.warn('Idle animation not found in:', Object.keys(actions));
    }

    return () => {
      if (idleAction) {
        idleAction.fadeOut(0.5);
      }
    };
  }, [actions, animations]);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name='Sketchfab_Scene'>
        <group name='Sketchfab_model' rotation={[-Math.PI / 2, 0, 0]}>
          <group name='e952fa4833e348ad9d5195d3a7080abbfbx' rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
            <group name='Object_2'>
              <group name='RootNode'>
                <group name='suit_low_poly' rotation={[-Math.PI / 2, 0, 0]} scale={100} />
                <group name='astro_bones' rotation={[-Math.PI / 2, 0, 0]} scale={100}>
                  <group name='Object_6'>
                    <primitive object={nodes._rootJoint} />
                    <skinnedMesh
                      name='Object_9'
                      geometry={nodes.Object_9.geometry}
                      material={materials.bake_1}
                      skeleton={nodes.Object_9.skeleton}
                    />
                    <skinnedMesh
                      name='Object_10'
                      geometry={nodes.Object_10.geometry}
                      material={materials.bake_2}
                      skeleton={nodes.Object_10.skeleton}
                    />
                    <group name='Object_8' rotation={[-Math.PI / 2, 0, 0]} scale={100} />
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

useGLTF.preload('/astronaut_rigged_and_animated.glb');
