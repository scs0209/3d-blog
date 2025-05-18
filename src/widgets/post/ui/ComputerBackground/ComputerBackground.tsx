'use client';

import { useGLTF } from '@react-three/drei';
import { ComputerScreenText } from './ComputerScreenText';
import type * as three from 'three';

export const ComputerBackground = (props: any) => {
  const { nodes, materials } = useGLTF('/old_computers.glb');
  return (
    <group {...props} dispose={null} scale={0.085}>
      <group position={[0.27, 1.529, -2.613]}>
        <ComputerScreenText frame='Object_206' panel='Object_207' />
      </group>
      <group position={[-1.43, 2.496, -1.8]} rotation={[0, 1.002, 0]}>
        <ComputerScreenText frame='Object_209' panel='Object_210' x={0} y={5.5} invert />
      </group>
      <group position={[-2.731, 0.629, -0.522]} rotation={[0, 1.087, 0]}>
        <ComputerScreenText frame='Object_212' panel='Object_213' x={0} y={5.3} />
      </group>
      <group position={[1.845, 0.377, -1.771]} rotation={[0, -Math.PI / 9, 0]}>
        <ComputerScreenText frame='Object_215' invert panel='Object_216' />
      </group>
      <group position={[3.11, 2.145, -0.18]} rotation={[0, -0.793, 0]} scale={0.81}>
        <ComputerScreenText frame='Object_218' panel='Object_219' />
      </group>
      <group position={[-3.417, 3.056, 1.303]} rotation={[0, 1.222, 0]} scale={0.9}>
        <ComputerScreenText frame='Object_221' panel='Object_222' x={0} y={5.3} />
      </group>
      <group position={[-3.899, 4.287, -2.642]} rotation={[0, 0.539, 0]}>
        <ComputerScreenText frame='Object_224' panel='Object_225' />
      </group>
      <group position={[0.992, 4.287, -4.209]} rotation={[0, 0.429, 0]} scale={[-1, 1, 1]}>
        <ComputerScreenText frame='Object_227' panel='Object_228' />
      </group>
      <group position={[4.683, 4.29, -1.558]} rotation={[0, -Math.PI / 3, 0]}>
        <ComputerScreenText frame='Object_230' panel='Object_231' />
      </group>
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_4 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[0.165, 0.794, -1.972]}
        rotation={[-0.544, 0.929, -1.119]}
        scale={0.5}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_6 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[-2.793, 0.27, 1.816]}
        rotation={[-1.44, 1.219, 1.432]}
        scale={0.5}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_8 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[-5.603, 4.615, -0.027]}
        rotation={[-1.955, 0.163, 1.202]}
        scale={0.5}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_10 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[2.621, 1.985, -2.473]}
        rotation={[-0.419, -0.704, -1.851]}
        scale={0.5}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_12 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[4.598, 3.459, 1.19]}
        rotation={[-1.236, -0.719, 0.48]}
        scale={0.5}
      />
      {/* 바닥 */}
      {/* <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_14 as three.Mesh)?.geometry}
        material={materials['Material.001']}
        scale={13}
      /> */}
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_16 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[0.63, 0, -3]}
        rotation={[0, 0.17, 0]}
        scale={1.52}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_18 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[-0.186, 0, -2.962]}
        rotation={[0, -0.064, 0]}
        scale={1.52}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_20 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[-2.36, 0.32, -2.018]}
        rotation={[0, 0.534, -Math.PI / 2]}
        scale={1.52}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_22 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[-2.288, 1.56, -2.263]}
        rotation={[0, -0.012, -Math.PI / 2]}
        scale={1.52}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_24 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[-2.424, 0.938, -2.247]}
        rotation={[Math.PI, -0.136, -Math.PI / 2]}
        scale={[-1.52, 1.52, 1.52]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_26 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[-2.195, 2.188, -1.867]}
        rotation={[Math.PI, -0.512, -Math.PI / 2]}
        scale={[-1.52, 1.52, 1.52]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_28 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[0.353, 2.352, -3.336]}
        rotation={[-0.255, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_30 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[0.183, 2.801, -2.854]}
        rotation={[0.093, 0.146, -0.014]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_32 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[-3.528, 0, 0.586]}
        rotation={[Math.PI, -1.085, Math.PI]}
        scale={1.52}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_34 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[-2.896, 0.3, -1.466]}
        rotation={[Math.PI, -1.347, Math.PI / 2]}
        scale={1.52}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_36 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[-3.528, 1.528, 0.586]}
        rotation={[0, 0.911, 0]}
        scale={1.52}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_38 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[1.895, 0, -1.944]}
        rotation={[0, -0.436, 0]}
        scale={[1.5, 1, 1.5]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_40 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[3.423, 0, 0.005]}
        rotation={[-Math.PI, 1.127, -Math.PI]}
        scale={1.52}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_42 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[3.224, 0, -0.804]}
        rotation={[0, -1.324, 0]}
        scale={1.52}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_44 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[3.53, 1.834, 0.44]}
        rotation={[-Math.PI, 1.324, Math.PI / 2]}
        scale={1.52}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_46 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[1.862, 1.61, -1.807]}
        rotation={[0, -Math.PI / 3, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_48 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[4.086, 2.183, 2.41]}
        rotation={[0, -1.548, 1.571]}
        scale={1.52}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_50 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[4.255, 0.943, 2.219]}
        rotation={[0, -1.002, Math.PI / 2]}
        scale={1.52}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_52 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[4.314, 1.565, 2.343]}
        rotation={[Math.PI, 1.149, Math.PI / 2]}
        scale={[-1.52, 1.52, 1.52]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_54 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[3.87, 0.315, 2.35]}
        rotation={[3.14, 1.526, 1.571]}
        scale={[-1.52, 1.52, 1.52]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_56 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[3.954, 2.491, 1.607]}
        rotation={[0, -Math.PI / 3, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_58 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[-3.79, 0, 1.656]}
        rotation={[0, 1.393, 0]}
        scale={[-1.52, 1.52, 1.52]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_60 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[-3.79, 1.528, 1.656]}
        rotation={[-Math.PI, -1.218, -Math.PI]}
        scale={[-1.52, 1.52, 1.52]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_62 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[-3.693, 0, 2.585]}
        rotation={[0, -1.568, 0]}
        scale={1.52}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_64 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[-5.36, 2.183, 0.811]}
        rotation={[0, 0.772, Math.PI / 2]}
        scale={1.52}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_66 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[-5.614, 0.943, 0.817]}
        rotation={[0, 1.318, 1.571]}
        scale={1.52}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_68 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[-5.564, 1.565, 0.69]}
        rotation={[-Math.PI, -1.171, Math.PI / 2]}
        scale={[-1.52, 1.52, 1.52]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_70 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[-5.257, 0.315, 1.01]}
        rotation={[-Math.PI, -0.795, Math.PI / 2]}
        scale={[-1.52, 1.52, 1.52]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_72 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[-5.474, 2.794, 0.745]}
        rotation={[Math.PI, -1.155, Math.PI / 2]}
        scale={1.52}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_74 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[-5.39, 4.034, 0.986]}
        rotation={[Math.PI, -0.609, Math.PI / 2]}
        scale={1.52}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_76 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[-5.289, 3.412, 0.894]}
        rotation={[0, 0.757, Math.PI / 2]}
        scale={[-1.52, 1.52, 1.52]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_78 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[-5.696, 4.662, 0.718]}
        rotation={[0, 1.133, Math.PI / 2]}
        scale={[-1.52, 1.52, 1.52]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_80 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[-5.283, 0, -2.328]}
        rotation={[0, 0.755, 0]}
        scale={1.52}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_82 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[-5.952, 0, -0.641]}
        rotation={[0, 0.953, 0]}
        scale={1.52}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_84 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[-5.486, 0, -1.385]}
        rotation={[-Math.PI, -0.985, -Math.PI]}
        scale={1.52}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_86 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[-4.476, 0, -2.749]}
        rotation={[-Math.PI, -0.568, -Math.PI]}
        scale={1.52}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_88 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[-3.012, 0, -3.79]}
        rotation={[0, 0.597, 0]}
        scale={1.52}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_90 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[-3.716, 0, -2.886]}
        rotation={[0, 0.644, 0]}
        scale={1.52}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_92 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[-2.082, 0, -4.324]}
        rotation={[-Math.PI, -0.597, -Math.PI]}
        scale={1.52}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_94 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[-1.016, 0, -4.489]}
        rotation={[0, 0.308, 0]}
        scale={1.52}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_96 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[-0.084, 0, -5.026]}
        rotation={[-Math.PI, -0.039, -Math.PI]}
        scale={1.52}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_98 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[-5.315, 1.833, -1.412]}
        rotation={[0, 1.062, Math.PI / 2]}
        scale={1.52}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_100 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[-4.181, 1.833, -3.064]}
        rotation={[-Math.PI, -0.465, -Math.PI / 2]}
        scale={1.52}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_102 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[-1.758, 1.833, -3.605]}
        rotation={[0, -1.165, Math.PI / 2]}
        scale={1.52}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_104 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[-0.254, 1.833, -5.542]}
        rotation={[0, 1.553, 1.571]}
        scale={1.52}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_106 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[-4.194, 1.836, -2.768]}
        rotation={[0, 0.655, Math.PI / 2]}
        scale={[-1.52, 1.52, 1.52]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_108 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[-5.283, 2.143, -2.328]}
        rotation={[-Math.PI, -0.755, -Math.PI]}
        scale={1.52}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_110 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[-5.952, 2.143, -0.641]}
        rotation={[-Math.PI, -0.953, -Math.PI]}
        scale={1.52}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_112 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[-5.486, 2.143, -1.385]}
        rotation={[0, 0.985, 0]}
        scale={1.52}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_114 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[-4.476, 2.143, -2.749]}
        rotation={[0, 0.568, 0]}
        scale={1.52}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_116 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[-3.012, 2.143, -3.79]}
        rotation={[-Math.PI, -0.597, -Math.PI]}
        scale={1.52}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_118 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[-3.727, 2.143, -3.1]}
        rotation={[-Math.PI, -0.644, -Math.PI]}
        scale={1.52}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_120 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[-2.082, 2.143, -4.324]}
        rotation={[0, 0.597, 0]}
        scale={1.52}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_122 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[-1.016, 2.143, -4.489]}
        rotation={[-Math.PI, -0.308, -Math.PI]}
        scale={1.52}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_124 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[-0.084, 2.143, -5.026]}
        rotation={[0, 0.039, 0]}
        scale={1.52}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_126 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[-5.315, 3.976, -1.412]}
        rotation={[0, 1.062, Math.PI / 2]}
        scale={1.52}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_128 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[-4.181, 3.976, -3.064]}
        rotation={[-Math.PI, -0.465, -Math.PI / 2]}
        scale={1.52}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_130 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[-1.173, 3.976, -4.449]}
        rotation={[0, 0.168, Math.PI / 2]}
        scale={1.52}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_132 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[-0.941, 3.976, -4.664]}
        rotation={[Math.PI, 0.018, -Math.PI / 2]}
        scale={1.52}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_134 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[-4.194, 3.979, -2.768]}
        rotation={[0, 0.655, Math.PI / 2]}
        scale={[-1.52, 1.52, 1.52]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_136 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[-1.095, 4.291, -4.434]}
        rotation={[0, 0.357, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_138 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[-5.246, 4.291, -1.466]}
        rotation={[0, 1.246, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_140 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[5.531, 2.183, 0.174]}
        scale={[-1, 1, 1]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_142 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[5.786, 0.943, 0.18]}
        scale={[-1, 1, 1]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_144 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[5.736, 1.565, 0.053]}
        scale={[-1, 1, 1]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_146 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[5.428, 0.315, 0.373]}
        scale={[-1, 1, 1]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_148 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[5.646, 2.794, 0.107]}
        scale={[-1, 1, 1]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_150 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[5.562, 4.034, 0.348]}
        scale={[-1, 1, 1]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_152 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[5.461, 3.412, 0.256]}
        scale={[-1, 1, 1]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_154 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[5.868, 4.662, 0.081]}
        scale={[-1, 1, 1]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_156 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[4.856, 0, -2.541]}
        scale={[-1, 1, 1]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_158 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[5.525, 0, -0.854]}
        scale={[-1, 1, 1]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_160 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[5.059, 0, -1.597]}
        scale={[-1, 1, 1]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_162 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[4.05, 0, -2.962]}
        scale={[-1, 1, 1]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_164 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[2.585, 0, -4.002]}
        scale={[-1, 1, 1]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_166 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[3.289, 0, -3.098]}
        scale={[-1, 1, 1]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_168 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[1.655, 0, -4.536]}
        scale={[-1, 1, 1]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_170 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[0.59, 0, -4.701]}
        scale={[-1, 1, 1]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_172 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[4.888, 1.833, -1.624]}
        scale={[-1, 1, 1]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_174 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[3.754, 1.833, -3.277]}
        scale={[-1, 1, 1]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_176 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[1.332, 1.833, -3.817]}
        scale={[-1, 1, 1]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_178 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[3.767, 1.836, -2.98]}
        scale={[-1, 1, 1]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_180 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[4.856, 2.143, -2.541]}
        scale={[-1, 1, 1]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_182 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[5.525, 2.143, -0.854]}
        scale={[-1, 1, 1]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_184 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[5.059, 2.143, -1.597]}
        scale={[-1, 1, 1]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_186 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[4.05, 2.143, -2.962]}
        scale={[-1, 1, 1]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_188 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[2.585, 2.143, -4.002]}
        scale={[-1, 1, 1]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_190 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[3.3, 2.143, -3.312]}
        scale={[-1, 1, 1]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_192 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[1.655, 2.143, -4.536]}
        scale={[-1, 1, 1]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_194 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[0.59, 2.143, -4.701]}
        scale={[-1, 1, 1]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_196 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[4.888, 3.976, -1.624]}
        scale={[-1, 1, 1]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_198 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[3.754, 3.976, -3.277]}
        scale={[-1, 1, 1]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_200 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[0.746, 3.976, -4.662]}
        scale={[-1, 1, 1]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_202 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[3.767, 3.979, -2.98]}
        scale={[-1, 1, 1]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes?.Object_204 as three.Mesh)?.geometry}
        material={materials.Texture}
        position={[3.198, 4.291, -3.092]}
        rotation={[0, -0.563, 0]}
        scale={[-1, 1, 1]}
      />
    </group>
  );
};

useGLTF.preload('/old_computers.glb');
