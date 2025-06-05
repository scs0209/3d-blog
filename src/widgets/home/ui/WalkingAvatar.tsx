import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useFBX } from '@react-three/drei';
import type { Group } from 'three';
import * as three from 'three';
import type { GLTF } from 'three-stdlib';

type GLTFResult = GLTF & {
  nodes: Record<string, three.SkinnedMesh>;
  materials: Record<string, three.Material>;
  skeletons: Record<string, three.Skeleton>;
};

export function WalkingAvatar(props: any) {
  const group = useRef<Group>(null);
  const mixer = useRef<three.AnimationMixer | null>(null);
  const { nodes, materials, animations: gltfAnimations } = useGLTF('/WalkingAstro.glb') as unknown as GLTFResult;
  const fbxModel = useFBX('/snp.fbx');

  // 애니메이션 mixer 업데이트 (필수!)
  useFrame((_, delta) => {
    if (mixer.current) {
      mixer.current.update(delta);
    }
  });

  useEffect(() => {
    if (group.current) {
      // 초기 회전 설정 (서있게 만들기)
      group.current.rotation.set(0, 0, 0);

      mixer.current = new three.AnimationMixer(group.current);

      // GLTF 애니메이션 설정
      if (gltfAnimations && gltfAnimations.length > 0) {
        for (const clip of gltfAnimations) {
          if (clip) {
            const action = mixer.current.clipAction(clip);
            if (clip.name === 'Armature|mixamo.com|Layer0') {
              action.setEffectiveTimeScale(1);
              action.setEffectiveWeight(1);
              action.setLoop(three.LoopRepeat, Number.POSITIVE_INFINITY);
            }
          }
        }
      }

      // FBX 애니메이션 설정
      if (fbxModel.animations && fbxModel.animations.length > 0 && fbxModel.animations[0]) {
        const fbxAnimation = fbxModel.animations[0];
        const action = mixer.current.clipAction(fbxAnimation);
        action.setEffectiveTimeScale(1);
        action.setEffectiveWeight(1);
        action.setLoop(three.LoopRepeat, Number.POSITIVE_INFINITY);
        action.play();
      }
    }

    return () => {
      if (mixer.current) {
        mixer.current.stopAllAction();
      }
    };
  }, [gltfAnimations, fbxModel]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!group.current || !mixer.current) {
        return;
      }

      const speed = 0.08;
      const key = e.key.toLowerCase();

      // 걷기 애니메이션 재생
      const walkingClip = gltfAnimations?.find((clip) => clip && clip.name === 'Armature|mixamo.com|Layer0');
      if (walkingClip) {
        const walkAction = mixer.current.clipAction(walkingClip);
        if (walkAction && !walkAction.isRunning()) {
          walkAction.play();
        }
      }

      // FBX 애니메이션 정지
      if (fbxModel.animations && fbxModel.animations.length > 0 && fbxModel.animations[0]) {
        const fbxAction = mixer.current.clipAction(fbxModel.animations[0]);
        if (fbxAction) {
          fbxAction.stop();
        }
      }

      switch (key) {
        case 'w':
          group.current.position.z += speed;
          group.current.rotation.set(Math.PI / 2, 0, 0);
          break;
        case 's':
          group.current.position.z -= speed;
          group.current.rotation.set(-Math.PI / 2, Math.PI, 0);
          break;
        case 'a':
          group.current.position.x += speed;
          group.current.rotation.set(-Math.PI / 2, Math.PI, Math.PI / 2);
          break;
        case 'd':
          group.current.position.x -= speed;
          group.current.rotation.set(-Math.PI / 2, Math.PI, -Math.PI / 2);
          break;
      }
    };

    const handleKeyUp = () => {
      if (!mixer.current) {
        return;
      }

      // 원래 회전 상태로 복귀
      if (group.current) {
        group.current.rotation.set(0, 0, 0);
      }

      // 걷기 애니메이션 정지
      const walkingClip = gltfAnimations?.find((clip) => clip && clip.name === 'Armature|mixamo.com|Layer0');
      if (walkingClip) {
        const walkAction = mixer.current.clipAction(walkingClip);
        if (walkAction) {
          walkAction.stop();
        }
      }

      // FBX 애니메이션 재생
      if (fbxModel.animations && fbxModel.animations.length > 0 && fbxModel.animations[0]) {
        const fbxAction = mixer.current.clipAction(fbxModel.animations[0]);
        if (fbxAction) {
          fbxAction.play();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gltfAnimations, fbxModel]);

  return (
    <group ref={group} {...props} dispose={null}>
      <group>
        <group name='RootNode'>
          <group name='67359760e8bd414fac2378ecfb5ba5c5fbx' rotation={[0, 0, 0]}>
            <group name='RootNode1'>
              <group name='left' position={[-100.1, 0, 0]}>
                <group name='Object_4' />
              </group>
              <group name='group1'>
                <group name='broche_nino'>
                  <skinnedMesh
                    name='broche_nino_cremayera_t_0'
                    geometry={nodes.broche_nino_cremayera_t_0?.geometry}
                    material={materials.cremayera_t}
                    skeleton={nodes.broche_nino_cremayera_t_0?.skeleton}
                  />
                </group>
                <group name='Casco_nino'>
                  <skinnedMesh
                    name='Casco_nino_casco_nino_m_0'
                    geometry={nodes.Casco_nino_casco_nino_m_0?.geometry}
                    material={materials.casco_nino_m}
                    skeleton={nodes.Casco_nino_casco_nino_m_0?.skeleton}
                  />
                </group>
                <group name='botas_nino'>
                  <group name='pie_n_der'>
                    <skinnedMesh
                      name='pie_n_der_botas_nino_m_0'
                      geometry={nodes.pie_n_der_botas_nino_m_0?.geometry}
                      material={materials.botas_nino_m}
                      skeleton={nodes.pie_n_der_botas_nino_m_0?.skeleton}
                    />
                  </group>
                  <group name='pie_n_izq'>
                    <skinnedMesh
                      name='pie_n_izq_botas_nino_m_0'
                      geometry={nodes.pie_n_izq_botas_nino_m_0?.geometry}
                      material={materials.botas_nino_m}
                      skeleton={nodes.pie_n_izq_botas_nino_m_0?.skeleton}
                    />
                  </group>
                </group>
              </group>
              <group name='pasted__Lente_nino'>
                <skinnedMesh
                  name='pasted__Lente_nino_pasted__vidrio_astr_nina_0'
                  geometry={nodes.pasted__Lente_nino_pasted__vidrio_astr_nina_0?.geometry}
                  material={materials.pasted__vidrio_astr_nina}
                  skeleton={nodes.pasted__Lente_nino_pasted__vidrio_astr_nina_0?.skeleton}
                />
              </group>
              <group name='pasted__Traje_nino'>
                <group name='polySurface3'>
                  <skinnedMesh
                    name='polySurface3_pasted__trajechico_0'
                    geometry={nodes.polySurface3_pasted__trajechico_0?.geometry}
                    material={materials.pasted__trajechico}
                    skeleton={nodes.polySurface3_pasted__trajechico_0?.skeleton}
                  />
                  <skinnedMesh
                    name='polySurface3_pasted__logonino_0'
                    geometry={nodes.polySurface3_pasted__logonino_0?.geometry}
                    material={materials.pasted__logonino}
                    skeleton={nodes.polySurface3_pasted__logonino_0?.skeleton}
                  />
                </group>
                <group name='polySurface4'>
                  <skinnedMesh
                    name='polySurface4_pasted__trajechico_0'
                    geometry={nodes.polySurface4_pasted__trajechico_0?.geometry}
                    material={materials.pasted__trajechico}
                    skeleton={nodes.polySurface4_pasted__trajechico_0?.skeleton}
                  />
                </group>
              </group>
            </group>
          </group>
          <primitive object={nodes.mixamorigHips as unknown as three.Object3D} />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload('/WalkingAstro.glb');
