import type * as three from 'three';
import { useGLTF } from '@react-three/drei';
import type { GLTF } from 'three-stdlib';
import type { JSX } from 'react';

type GLTFResult = GLTF & {
  nodes: {
    middle_piece_low_Material_0: three.Mesh;
    screen_low_Material_0: three.Mesh;
    hinge_bottom_low_Material_0: three.Mesh;
    back_piece_low_Material_0: three.Mesh;
    front_piece_low_Material_0: three.Mesh;
  };
  materials: {
    Material: three.MeshStandardMaterial;
  };
};

export function Computer(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('/scifi_terminal.glb') as unknown as GLTFResult;

  return (
    <group {...props} dispose={null}>
      <group scale={0.01}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.middle_piece_low_Material_0.geometry}
          material={materials.Material}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={100}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.screen_low_Material_0.geometry}
          material={materials.Material}
          position={[-89.674, 458.777, 0]}
          rotation={[-Math.PI / 2, Math.PI / 6, 0]}
          scale={114.035}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.hinge_bottom_low_Material_0.geometry}
          material={materials.Material}
          position={[-74.84, 402.051, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={100}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.back_piece_low_Material_0.geometry}
          material={materials.Material}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={100}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.front_piece_low_Material_0.geometry}
          material={materials.Material}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={100}
        />
      </group>
    </group>
  );
}

useGLTF.preload('/scifi_terminal.glb');
