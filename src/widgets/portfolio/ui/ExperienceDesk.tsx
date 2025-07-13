import type * as three from 'three';
import type { JSX } from 'react';
import { useGLTF } from '@react-three/drei';
import type { GLTF } from 'three-stdlib';

type GLTFResult = GLTF & {
  nodes: {
    pPlane7_Tb_0: three.Mesh;
    pPlane3_Tb_0: three.Mesh;
    pPlane4_Tb_0: three.Mesh;
    pPlane8_Tb_0: three.Mesh;
    pPlane5_Tb_0: three.Mesh;
    pPlane6_Tb_0: three.Mesh;
    pCylinder1_Tb_0: three.Mesh;
  };
  materials: {
    material: three.MeshStandardMaterial;
  };
};

export function ExperienceDesk(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('/sci_fi_table.glb') as unknown as GLTFResult;

  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]} scale={15.767}>
        <group rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <mesh castShadow receiveShadow geometry={nodes.pPlane7_Tb_0.geometry} material={materials.material} />
          <mesh castShadow receiveShadow geometry={nodes.pPlane3_Tb_0.geometry} material={materials.material} />
          <mesh castShadow receiveShadow geometry={nodes.pPlane4_Tb_0.geometry} material={materials.material} />
          <mesh castShadow receiveShadow geometry={nodes.pPlane8_Tb_0.geometry} material={materials.material} />
          <mesh castShadow receiveShadow geometry={nodes.pPlane5_Tb_0.geometry} material={materials.material} />
          <mesh castShadow receiveShadow geometry={nodes.pPlane6_Tb_0.geometry} material={materials.material} />
          <mesh castShadow receiveShadow geometry={nodes.pCylinder1_Tb_0.geometry} material={materials.material} />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload('/sci_fi_table.glb');
