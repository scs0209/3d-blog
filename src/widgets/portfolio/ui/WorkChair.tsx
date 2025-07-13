import type * as three from 'three';
import { useGLTF } from '@react-three/drei';
import type { GLTF } from 'three-stdlib';
import type { JSX } from 'react';

type GLTFResult = GLTF & {
  nodes: {
    Object_4: three.Mesh;
    Object_5: three.Mesh;
    Object_6: three.Mesh;
  };
  materials: {
    Color_E10: three.MeshStandardMaterial;
    Color_004: three.MeshStandardMaterial;
    Material: three.MeshStandardMaterial;
  };
};

export function WorkChair(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('/chair__futuristic_chair.glb') as unknown as GLTFResult;

  return (
    <group {...props} dispose={null}>
      <group rotation={[-1.562, 0, -1.577]}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <group position={[-0.325, 0.597, -0.623]} rotation={[Math.PI / 2, 0, 1.724]} scale={0.029}>
            <mesh castShadow receiveShadow geometry={nodes.Object_4.geometry} material={materials.Color_E10} />
            <mesh castShadow receiveShadow geometry={nodes.Object_5.geometry} material={materials.Color_004} />
            <mesh castShadow receiveShadow geometry={nodes.Object_6.geometry} material={materials.Material} />
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload('/chair__futuristic_chair.glb');
