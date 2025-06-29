import { useGLTF } from '@react-three/drei';
import type * as three from 'three';

export function FloatMan(props: any) {
  const { nodes, materials } = useGLTF('/low_poly_man.glb');
  return (
    <group {...props} dispose={null}>
      <group rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
        <skinnedMesh
          geometry={(nodes.Cylinder_Pele_0 as three.Mesh)?.geometry}
          material={materials.Pele}
          skeleton={(nodes.Cylinder_Pele_0 as three.SkinnedMesh)?.skeleton}
        />
        <primitive object={nodes.mixamorigHips as any} />
      </group>
    </group>
  );
}

useGLTF.preload('/low_poly_man.glb');
