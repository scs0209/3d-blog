'use client';

import { useGLTF, RenderTexture } from '@react-three/drei';
import type * as three from 'three';

export const ComputerScreen = ({
  frame,
  panel,
  children,
  ...props
}: { frame: string; panel: string; children: React.ReactNode; props?: any }) => {
  const { nodes, materials } = useGLTF('/old_computers.glb');

  return (
    <group {...props}>
      <mesh castShadow receiveShadow geometry={(nodes[frame] as three.Mesh)?.geometry} material={materials.Texture} />
      <mesh geometry={(nodes[panel] as three.Mesh)?.geometry}>
        <meshBasicMaterial toneMapped={false}>
          <RenderTexture width={512} height={512} attach='map' anisotropy={16}>
            {children}
          </RenderTexture>
        </meshBasicMaterial>
      </mesh>
    </group>
  );
};

useGLTF.preload('/old_computers.glb');
