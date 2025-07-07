import { useGLTF } from '@react-three/drei';
import type * as three from 'three';

export function ContactMe(props: any) {
  const { nodes, materials } = useGLTF('/cyberpunk_bar.glb');
  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]} scale={0.241}>
        <mesh castShadow receiveShadow geometry={(nodes.Object_2 as three.Mesh)?.geometry} material={materials.mat21} />
        <mesh castShadow receiveShadow geometry={(nodes.Object_3 as three.Mesh)?.geometry} material={materials.mat14} />
        <mesh castShadow receiveShadow geometry={(nodes.Object_4 as three.Mesh)?.geometry} material={materials.mat15} />
        <mesh castShadow receiveShadow geometry={(nodes.Object_5 as three.Mesh)?.geometry} material={materials.mat16} />
        <mesh castShadow receiveShadow geometry={(nodes.Object_6 as three.Mesh)?.geometry} material={materials.mat16} />
        <mesh castShadow receiveShadow geometry={(nodes.Object_7 as three.Mesh)?.geometry} material={materials.mat16} />
        <mesh castShadow receiveShadow geometry={(nodes.Object_8 as three.Mesh)?.geometry} material={materials.mat16} />
        <mesh castShadow receiveShadow geometry={(nodes.Object_9 as three.Mesh)?.geometry} material={materials.mat17} />
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.Object_10 as three.Mesh)?.geometry}
          material={materials.mat17}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.Object_11 as three.Mesh)?.geometry}
          material={materials.mat23}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.Object_12 as three.Mesh)?.geometry}
          material={materials.mat24}
        />
        <mesh castShadow receiveShadow geometry={(nodes.Object_13 as three.Mesh)?.geometry} material={materials.mat3} />
        <mesh castShadow receiveShadow geometry={(nodes.Object_14 as three.Mesh)?.geometry} material={materials.mat4} />
      </group>
    </group>
  );
}

useGLTF.preload('/cyberpunk_bar.glb');
