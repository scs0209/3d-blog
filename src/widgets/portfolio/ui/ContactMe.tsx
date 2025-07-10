import { useAnimations, useGLTF } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import * as three from 'three';

// 보라색 네온 재질
const purpleNeonMaterial = new three.MeshStandardMaterial({
  color: '#c084fc',
  emissive: '#c48ff5',
  emissiveIntensity: 2.0,
  transparent: true,
  opacity: 0.9,
  metalness: 0.8,
  roughness: 0.2,
});

type ContactMeProps = {
  triggerAnimation?: boolean;
} & any;

export function ContactMe(props: ContactMeProps) {
  const { triggerAnimation, ...otherProps } = props;
  const group = useRef<three.Group>(null);
  const isAnimationRunning = useRef(false);
  const { nodes, materials, animations } = useGLTF('/sci-fi_door..glb');
  const { actions, mixer } = useAnimations(animations, group);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (triggerAnimation && actions && mixer && !isAnimationRunning.current) {
      isAnimationRunning.current = true;

      for (const action of Object.values(actions)) {
        if (action) {
          // 애니메이션 설정
          action.setLoop(three.LoopOnce, 1);
          action.clampWhenFinished = true;
          action.play();

          // 애니메이션 완료 이벤트 리스너
          const handleFinished = (e: any) => {
            if (e.action === action) {
              // 1.5초 대기 후 역방향 애니메이션 실행
              setTimeout(() => {
                action.reset();
                action.timeScale = -1; // 역방향으로 실행
                action.setLoop(three.LoopOnce, 1);
                action.clampWhenFinished = true;
                action.time = action.getClip().duration; // 끝 시간으로 설정
                action.play();

                // 역방향 애니메이션 완료 후 정리
                const handleReverseFinished = (e: any) => {
                  if (e.action === action) {
                    action.timeScale = 1; // 원래 방향으로 복원
                    action.stop(); // 애니메이션 정지 (reset 대신 stop 사용)
                    isAnimationRunning.current = false; // 애니메이션 완료
                    mixer.removeEventListener('finished', handleReverseFinished);
                  }
                };
                mixer.addEventListener('finished', handleReverseFinished);
              }, 1500);

              mixer.removeEventListener('finished', handleFinished);
            }
          };

          mixer.addEventListener('finished', handleFinished);
          break; // 첫 번째 액션만 실행하고 중단
        }
      }
    }
  }, [triggerAnimation]);

  return (
    <group ref={group} {...otherProps} dispose={null}>
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
                  material={purpleNeonMaterial}
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

              {/* 문 뒤 홀로그램 패널 - 문 안쪽 깊숙이 배치 */}
              <group name='back_panel' position={[0, 1.5, 0]}>
                <mesh position={[0, 0, 0]}>
                  <planeGeometry args={[2, 2.8]} />
                  <meshStandardMaterial
                    color='#c084fc'
                    emissive='#c48ff5'
                    emissiveIntensity={1.5}
                    transparent
                    opacity={0.8}
                    side={three.DoubleSide}
                  />
                </mesh>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload('/sci-fi_door..glb');
