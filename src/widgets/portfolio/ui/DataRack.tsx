import { useGLTF } from '@react-three/drei';
import type * as three from 'three';

export function DataRack(props: any) {
  const { nodes, materials } = useGLTF('/data_center_rack.glb');
  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]} scale={0.005}>
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.Object_2 as three.Mesh)?.geometry}
          material={materials.material}
        />
        <mesh castShadow receiveShadow geometry={(nodes.Object_3 as three.Mesh)?.geometry} material={materials.Mat_2} />
        <mesh castShadow receiveShadow geometry={(nodes.Object_4 as three.Mesh)?.geometry} material={materials.Mat_1} />
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.Object_5 as three.Mesh)?.geometry}
          material={materials.material}
        />
      </group>
    </group>
  );
}

useGLTF.preload('/data_center_rack.glb');
