import { useAnimations, useGLTF } from '@react-three/drei';
import { useRef } from 'react';
import * as three from 'three';

// DNA 연구실 기계에 어울리는 발광 재질들
const screenGlowMaterial = new three.MeshStandardMaterial({
  color: '#00ffff',
  emissive: '#00cccc',
  emissiveIntensity: 1.2,
  transparent: true,
  opacity: 0.9,
  roughness: 0.1,
  metalness: 0.8,
});

const labGlowMaterial = new three.MeshStandardMaterial({
  color: '#00ff88',
  emissive: '#00aa55',
  emissiveIntensity: 1.5,
  transparent: true,
  opacity: 0.95,
  roughness: 0.2,
  metalness: 0.7,
});

// gltf.pmnd.rs 변환으로 손실된 재질들 복원
const restoredMainMaterial = new three.MeshStandardMaterial({
  color: '#cccccc',
  roughness: 0.3,
  metalness: 0.1,
});

const restoredPlasticMaterial = new three.MeshStandardMaterial({
  color: '#888888',
  roughness: 0.4,
  metalness: 0.0,
});

const restoredMetalMaterial = new three.MeshStandardMaterial({
  color: '#999999',
  roughness: 0.2,
  metalness: 0.8,
});

export function LabMachine(props: any) {
  const group = useRef<three.Group>(null);
  const { nodes, materials, animations } = useGLTF('/dna_lab_machine.glb');
  const { actions } = useAnimations(animations, group);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name='Sketchfab_Scene'>
        <group name='Sketchfab_model' rotation={[-Math.PI / 2, 0, 0]} scale={2.315}>
          <group name='9679a6287ec549b2a2d9e65aa1cfdd6dfbx' rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
            <group name='Object_2'>
              <group name='RootNode'>
                <group name='Main' rotation={[-Math.PI / 2, 0, 0]} scale={100}>
                  <mesh
                    name='Main_Main_0'
                    castShadow
                    receiveShadow
                    geometry={(nodes.Main_Main_0 as three.Mesh)?.geometry}
                    material={restoredMainMaterial}
                  />
                  <mesh
                    name='Main_Plastic_0'
                    castShadow
                    receiveShadow
                    geometry={(nodes.Main_Plastic_0 as three.Mesh)?.geometry}
                    material={restoredPlasticMaterial}
                  />
                  <mesh
                    name='Main_Metal_0'
                    castShadow
                    receiveShadow
                    geometry={(nodes.Main_Metal_0 as three.Mesh)?.geometry}
                    material={restoredMetalMaterial}
                  />
                  <mesh
                    name='Main_ScreenKeyboard_0'
                    castShadow
                    receiveShadow
                    geometry={(nodes.Main_ScreenKeyboard_0 as three.Mesh)?.geometry}
                    material={screenGlowMaterial}
                  />
                  <mesh
                    name='Main_Emisive_0'
                    castShadow
                    receiveShadow
                    geometry={(nodes.Main_Emisive_0 as three.Mesh)?.geometry}
                    material={labGlowMaterial}
                  />
                  <mesh
                    name='Main_Fuses_0'
                    castShadow
                    receiveShadow
                    geometry={(nodes.Main_Fuses_0 as three.Mesh)?.geometry}
                    material={labGlowMaterial}
                  />
                </group>
                <group
                  name='Main001'
                  position={[56.856, 58.787, 73.29]}
                  rotation={[-Math.PI / 2, 0, 0.811]}
                  scale={100}
                >
                  <mesh
                    name='Main001_Metal_0'
                    castShadow
                    receiveShadow
                    geometry={(nodes.Main001_Metal_0 as three.Mesh)?.geometry}
                    material={restoredMetalMaterial}
                  />
                  <mesh
                    name='Main001_Main_0'
                    castShadow
                    receiveShadow
                    geometry={(nodes.Main001_Main_0 as three.Mesh)?.geometry}
                    material={restoredMainMaterial}
                  />
                </group>
                <group
                  name='Main002'
                  position={[57.337, 56.423, 71.265]}
                  rotation={[-Math.PI / 2, 0, -0.826]}
                  scale={100}
                >
                  <mesh
                    name='Main002_Metal_0'
                    castShadow
                    receiveShadow
                    geometry={(nodes.Main002_Metal_0 as three.Mesh)?.geometry}
                    material={restoredMetalMaterial}
                  />
                  <mesh
                    name='Main002_Main_0'
                    castShadow
                    receiveShadow
                    geometry={(nodes.Main002_Main_0 as three.Mesh)?.geometry}
                    material={restoredMainMaterial}
                  />
                </group>
                <group name='Main003' position={[0, 0, 0.648]} rotation={[-Math.PI / 2, 0, 0]} scale={100}>
                  <mesh
                    name='Main003_Main_0'
                    castShadow
                    receiveShadow
                    geometry={(nodes.Main003_Main_0 as three.Mesh)?.geometry}
                    material={restoredMainMaterial}
                  />
                  <mesh
                    name='Main003_ScreenKeyboard_0'
                    castShadow
                    receiveShadow
                    geometry={(nodes.Main003_ScreenKeyboard_0 as three.Mesh)?.geometry}
                    material={screenGlowMaterial}
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

useGLTF.preload('/dna_lab_machine.glb');
