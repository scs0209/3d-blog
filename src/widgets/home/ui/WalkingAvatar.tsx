import { useRef, useEffect } from 'react';
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
  const { nodes, materials, animations: gltfAnimations } = useGLTF('/combined.glb') as unknown as GLTFResult;
  const fbxModel = useFBX('/Sitting_And_Pointing.fbx');

  useEffect(() => {
    if (group.current) {
      mixer.current = new three.AnimationMixer(group.current);

      // GLTF 애니메이션 설정
      for (const clip of gltfAnimations) {
        const action = mixer.current.clipAction(clip);
        if (clip.name === 'walking') {
          action.setEffectiveTimeScale(1);
          action.setEffectiveWeight(1);
        }
      }

      // FBX 애니메이션 설정
      if (fbxModel.animations && fbxModel.animations.length > 0) {
        const fbxAnimation = fbxModel.animations[0]!; // non-null assertion
        const action = mixer.current.clipAction(fbxAnimation);
        action.setEffectiveTimeScale(1);
        action.setEffectiveWeight(1);
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
      const walkAction = mixer.current.clipAction(gltfAnimations.find((clip) => clip.name === 'walking')!);
      if (walkAction && !walkAction.isRunning()) {
        walkAction.play();
      }

      // FBX 애니메이션 정지
      if (fbxModel.animations && fbxModel.animations.length > 0) {
        const fbxAction = mixer.current.clipAction(fbxModel.animations[0]!);
        fbxAction.stop();
      }

      switch (key) {
        case 'w':
          group.current.position.z += speed;
          group.current.rotation.y = 0;
          break;
        case 's':
          group.current.position.z -= speed;
          group.current.rotation.y = Math.PI;
          break;
        case 'a':
          group.current.rotation.y = Math.PI / 2;
          group.current.position.x += speed;
          break;
        case 'd':
          group.current.rotation.y = -Math.PI / 2;
          group.current.position.x -= speed;
          break;
      }
    };

    const handleKeyUp = () => {
      if (!mixer.current) {
        return;
      }

      // 걷기 애니메이션 정지
      const walkAction = mixer.current.clipAction(gltfAnimations.find((clip) => clip.name === 'walking')!);
      if (walkAction) {
        walkAction.stop();
      }

      // FBX 애니메이션 재생
      if (fbxModel.animations && fbxModel.animations.length > 0) {
        const fbxAction = mixer.current.clipAction(fbxModel.animations[0]!);
        fbxAction.play();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gltfAnimations, fbxModel]);

  // 애니메이션 업데이트
  useEffect(() => {
    let frameId: number;
    const animate = () => {
      if (mixer.current) {
        mixer.current.update(1 / 60); // 60fps 기준으로 업데이트
      }
      frameId = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <group ref={group} {...props} dispose={null}>
      <group>
        <group name='Boy_01_Meshes'>
          <skinnedMesh
            name='Boy01_Head_Geo'
            geometry={nodes.Boy01_Head_Geo?.geometry}
            material={materials.Boy01_Head_MAT}
            skeleton={nodes.Boy01_Head_Geo?.skeleton}
          />
          <skinnedMesh
            name='Boy01_Scarf_Geo'
            geometry={nodes.Boy01_Scarf_Geo?.geometry}
            material={materials.Boy01_Scarf_MAT}
            skeleton={nodes.Boy01_Scarf_Geo?.skeleton}
          />
          <skinnedMesh
            name='Boy01_Hands_Geo'
            geometry={nodes.Boy01_Hands_Geo?.geometry}
            material={materials.Boy01_Hands_MAT}
            skeleton={nodes.Boy01_Hands_Geo?.skeleton}
          />
          <skinnedMesh
            name='Boy01_LowerBody_Geo'
            geometry={nodes.Boy01_LowerBody_Geo?.geometry}
            material={materials.Boy01_LowerBody_MAT}
            skeleton={nodes.Boy01_LowerBody_Geo?.skeleton}
          />
          <skinnedMesh
            name='Boy01_UpperBody_Geo'
            geometry={nodes.Boy01_UpperBody_Geo?.geometry}
            material={materials.Boy01_UpperBody_MAT}
            skeleton={nodes.Boy01_UpperBody_Geo?.skeleton}
          />
          <skinnedMesh
            name='Boy01_Shoes_Geo'
            geometry={nodes.Boy01_Shoes_Geo?.geometry}
            material={materials.Boy01_Shoes_MAT}
            skeleton={nodes.Boy01_Shoes_Geo?.skeleton}
          />
          <skinnedMesh
            name='Boy01_Hair_Geo'
            geometry={nodes.Boy01_Hair_Geo?.geometry}
            material={materials.Boy01_Hair_MAT}
            skeleton={nodes.Boy01_Hair_Geo?.skeleton}
          />
        </group>
        {nodes.mixamorigHips && <primitive object={nodes.mixamorigHips} />}
      </group>
    </group>
  );
}

useGLTF.preload('/combined.glb');
