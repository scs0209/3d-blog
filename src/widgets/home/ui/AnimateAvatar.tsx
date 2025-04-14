import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import type { Group, Material, Bone, SkinnedMesh } from 'three';
import type { GLTF } from 'three-stdlib';

type GLTFResult = GLTF & {
  nodes: {
    _rootJoint: Bone;
    // biome-ignore lint/style/useNamingConvention: <explanation>
    Object_9: SkinnedMesh;
    // biome-ignore lint/style/useNamingConvention: <explanation>
    Object_10: SkinnedMesh;
  };
  materials: {
    // biome-ignore lint/style/useNamingConvention: <explanation>
    bake_1: Material;
    // biome-ignore lint/style/useNamingConvention: <explanation>
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

  useFrame((state) => {
    if (group.current) {
      const time = state.clock.elapsedTime;
      // 넓은 범위의 사선 움직임
      const x = Math.sin(time * 0.3) * 5; // 좌우 5단위 범위
      const y = Math.sin(time * 0.5) * 3 + 3; // 상하 3단위 범위 + 기본 높이 5
      const z = Math.cos(time * 0.3) * 5; // 전후 5단위 범위

      // 위치 업데이트
      group.current.position.set(x, y, z);

      // 움직임에 따른 회전 계산
      const moveX = Math.cos(time * 0.3) * 0.3; // 좌우 움직임에 따른 회전
      const moveY = Math.cos(time * 0.5) * 0.5; // 상하 움직임에 따른 회전
      const moveZ = Math.sin(time * 0.3) * 0.3; // 전후 움직임에 따른 회전

      // 회전 업데이트
      group.current.rotation.set(moveY, moveX, moveZ);
    }
  });

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
