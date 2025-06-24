import { useGLTF } from '@react-three/drei';
import * as three from 'three';

const screenGlowMaterial = new three.MeshStandardMaterial({
  color: '#8ff0ff',
  emissive: '#8ff0ff',
  emissiveIntensity: 0.5,
  toneMapped: false,
});

interface ComputerProps {
  [key: string]: any;
}

export function Computer({ ...props }: ComputerProps) {
  const { nodes } = useGLTF('/computer.glb');

  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.Object_5 as three.Mesh)?.geometry}
        material={screenGlowMaterial}
        position={[-0.056, 0.066, 0.3]}
        scale={[0.531, 0.354, 0.001]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.Object_7 as three.Mesh)?.geometry}
        material={screenGlowMaterial}
        position={[0.15, -0.078, 0.383]}
        scale={[0.513, 0.342, 0.001]}
      />
    </group>
  );
}

useGLTF.preload('/computer.glb');
