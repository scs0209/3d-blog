import type * as three from 'three';
import type { JSX } from 'react';
import { useGLTF } from '@react-three/drei';
import type { GLTF } from 'three-stdlib';

type GLTFResult = GLTF & {
  nodes: {
    Object_4: three.Mesh;
    Object_6: three.Mesh;
    Object_8: three.Mesh;
    Object_10: three.Mesh;
    Object_12: three.Mesh;
    Object_14: three.Mesh;
    Object_16: three.Mesh;
    Object_18: three.Mesh;
    Object_19: three.Mesh;
    Object_21: three.Mesh;
    Object_23: three.Mesh;
    Object_25: three.Mesh;
    Object_27: three.Mesh;
    Object_28: three.Mesh;
    Object_30: three.Mesh;
    Object_31: three.Mesh;
    Object_33: three.Mesh;
    Object_35: three.Mesh;
    Object_37: three.Mesh;
    Object_39: three.Mesh;
    Object_40: three.Mesh;
    Object_42: three.Mesh;
    Object_44: three.Mesh;
    Object_46: three.Mesh;
    Object_48: three.Mesh;
    Object_50: three.Mesh;
    Object_52: three.Mesh;
    Object_54: three.Mesh;
    Object_55: three.Mesh;
    Object_57: three.Mesh;
    Object_58: three.Mesh;
    Object_60: three.Mesh;
    Object_62: three.Mesh;
    Object_64: three.Mesh;
    Object_66: three.Mesh;
    Object_68: three.Mesh;
    Object_70: three.Mesh;
    Object_71: three.Mesh;
    Object_72: three.Mesh;
    Object_74: three.Mesh;
    Object_75: three.Mesh;
    Object_77: three.Mesh;
    Object_78: three.Mesh;
    Object_80: three.Mesh;
    Object_82: three.Mesh;
    Object_84: three.Mesh;
    Object_86: three.Mesh;
    Object_87: three.Mesh;
    Object_88: three.Mesh;
    Object_89: three.Mesh;
    Object_91: three.Mesh;
    Object_92: three.Mesh;
    Object_93: three.Mesh;
    Object_95: three.Mesh;
    Object_96: three.Mesh;
    Object_98: three.Mesh;
    Object_100: three.Mesh;
    Object_102: three.Mesh;
    Object_104: three.Mesh;
    Object_106: three.Mesh;
    Object_107: three.Mesh;
    Object_109: three.Mesh;
    Object_111: three.Mesh;
    Object_112: three.Mesh;
    Object_114: three.Mesh;
    Object_116: three.Mesh;
    Object_118: three.Mesh;
    Object_120: three.Mesh;
    Object_122: three.Mesh;
    Object_124: three.Mesh;
    Object_126: three.Mesh;
    Object_128: three.Mesh;
    Object_130: three.Mesh;
    Object_132: three.Mesh;
    Object_134: three.Mesh;
    Object_136: three.Mesh;
    Object_138: three.Mesh;
    Object_139: three.Mesh;
    Object_140: three.Mesh;
    Object_141: three.Mesh;
    Object_143: three.Mesh;
    Object_144: three.Mesh;
    Object_146: three.Mesh;
    Object_148: three.Mesh;
    Object_150: three.Mesh;
    Object_151: three.Mesh;
    Object_153: three.Mesh;
    Object_155: three.Mesh;
    Object_157: three.Mesh;
    Object_159: three.Mesh;
    Object_161: three.Mesh;
    Object_163: three.Mesh;
    Object_165: three.Mesh;
    Object_167: three.Mesh;
    Object_168: three.Mesh;
    Object_170: three.Mesh;
    Object_171: three.Mesh;
    Object_173: three.Mesh;
    Object_174: three.Mesh;
    Object_176: three.Mesh;
    Object_177: three.Mesh;
    Object_179: three.Mesh;
    Object_180: three.Mesh;
    Object_182: three.Mesh;
    Object_183: three.Mesh;
    Object_185: three.Mesh;
    Object_186: three.Mesh;
    Object_188: three.Mesh;
    Object_189: three.Mesh;
    Object_191: three.Mesh;
    Object_192: three.Mesh;
    Object_194: three.Mesh;
    Object_195: three.Mesh;
    Object_197: three.Mesh;
    Object_198: three.Mesh;
    Object_199: three.Mesh;
    Object_200: three.Mesh;
    Object_201: three.Mesh;
    Object_202: three.Mesh;
    Object_203: three.Mesh;
    Object_204: three.Mesh;
    Object_205: three.Mesh;
    Object_206: three.Mesh;
    Object_207: three.Mesh;
    Object_208: three.Mesh;
    Object_209: three.Mesh;
    Object_210: three.Mesh;
    Object_211: three.Mesh;
    Object_212: three.Mesh;
    Object_213: three.Mesh;
    Object_214: three.Mesh;
    Object_215: three.Mesh;
    Object_217: three.Mesh;
    Object_219: three.Mesh;
    Object_221: three.Mesh;
    Object_222: three.Mesh;
    Object_224: three.Mesh;
    Object_226: three.Mesh;
  };
  materials: {
    'Materil.002': three.MeshStandardMaterial;
    'Materil.003': three.MeshPhysicalMaterial;
    'Materil.005': three.MeshStandardMaterial;
    'Materil.008': three.MeshStandardMaterial;
    'Materil.006': three.MeshStandardMaterial;
    'Materil.007': three.MeshStandardMaterial;
    'Materil.015': three.MeshStandardMaterial;
    'Materil.009': three.MeshPhysicalMaterial;
    'Materil.012': three.MeshStandardMaterial;
    'Materil.011': three.MeshStandardMaterial;
    'Materil.013': three.MeshStandardMaterial;
    'Materil.016': three.MeshStandardMaterial;
    'Materil.014': three.MeshStandardMaterial;
    'Materil.018': three.MeshStandardMaterial;
    'Materil.019': three.MeshStandardMaterial;
    'Materil.020': three.MeshPhysicalMaterial;
    'Materil.021': three.MeshPhysicalMaterial;
    'Materil.022': three.MeshPhysicalMaterial;
    'Materil.023': three.MeshStandardMaterial;
    'Materil.010': three.MeshPhysicalMaterial;
    'Materil.017': three.MeshPhysicalMaterial;
    'Materil.024': three.MeshStandardMaterial;
    'Materil.025': three.MeshStandardMaterial;
    'Materil.026': three.MeshStandardMaterial;
    'Materil.027': three.MeshStandardMaterial;
    'Materil.038': three.MeshStandardMaterial;
    'Materil.037': three.MeshPhysicalMaterial;
    'Materil.032': three.MeshStandardMaterial;
    'Materil.004': three.MeshStandardMaterial;
    'Materil.035': three.MeshStandardMaterial;
    'Materil.036': three.MeshStandardMaterial;
    'Materil.040': three.MeshPhysicalMaterial;
    'Materil.041': three.MeshStandardMaterial;
    'Materil.029': three.MeshStandardMaterial;
    'Materil.031': three.MeshPhysicalMaterial;
    'Materil.042': three.MeshPhysicalMaterial;
    'Materil.044': three.MeshPhysicalMaterial;
    'Materil.045': three.MeshStandardMaterial;
    'Materil.054': three.MeshPhysicalMaterial;
    'Materil.055': three.MeshPhysicalMaterial;
    'Materil.065': three.MeshPhysicalMaterial;
    'Materil.057': three.MeshStandardMaterial;
    'Materil.066': three.MeshPhysicalMaterial;
    'Materil.067': three.MeshPhysicalMaterial;
    'Materil.069': three.MeshPhysicalMaterial;
    'Materil.068': three.MeshPhysicalMaterial;
    'Materil.070': three.MeshPhysicalMaterial;
    'Materil.071': three.MeshPhysicalMaterial;
    'Materil.072': three.MeshPhysicalMaterial;
    'Materil.073': three.MeshPhysicalMaterial;
    'Materil.074': three.MeshPhysicalMaterial;
    'Materil.075': three.MeshPhysicalMaterial;
    'Materil.076': three.MeshPhysicalMaterial;
    'Materil.077': three.MeshStandardMaterial;
    'Materil.078': three.MeshPhysicalMaterial;
    'Materil.079': three.MeshStandardMaterial;
    'Materil.080': three.MeshPhysicalMaterial;
    'Materil.081': three.MeshPhysicalMaterial;
    'Materil.082': three.MeshPhysicalMaterial;
    'Materil.083': three.MeshPhysicalMaterial;
    'Materil.084': three.MeshPhysicalMaterial;
    'Materil.085': three.MeshPhysicalMaterial;
    'Materil.086': three.MeshPhysicalMaterial;
    'Materil.087': three.MeshPhysicalMaterial;
    'Materil.088': three.MeshPhysicalMaterial;
    'Materil.093': three.MeshPhysicalMaterial;
    'Materil.094': three.MeshPhysicalMaterial;
    'Materil.095': three.MeshPhysicalMaterial;
    'Materil.097': three.MeshPhysicalMaterial;
    'Materil.098': three.MeshPhysicalMaterial;
  };
};

export function WorkTable(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('/computer_setup.glb') as unknown as GLTFResult;

  return (
    <group {...props} dispose={null}>
      <group rotation={[-1.5708, 0, 0]} scale={0.327}>
        <group rotation={[1.5708, 0, 0]}>
          <group position={[-7.893, 3.408, -5.292]} rotation={[0, -0.368, -0.288]} scale={[0.005, 0.097, 0.037]}>
            <mesh castShadow receiveShadow geometry={nodes.Object_138.geometry} material={materials['Materil.036']} />
            <mesh castShadow receiveShadow geometry={nodes.Object_139.geometry} material={materials['Materil.040']} />
            <mesh castShadow receiveShadow geometry={nodes.Object_140.geometry} material={materials['Materil.041']} />
            <mesh castShadow receiveShadow geometry={nodes.Object_141.geometry} material={materials['Materil.029']} />
          </group>
          <group position={[-7.587, 3.27, -5.176]} rotation={[-Math.PI / 2, 0, 0.43]} scale={[0.011, 0.149, 0.011]}>
            <mesh castShadow receiveShadow geometry={nodes.Object_143.geometry} material={materials['Materil.036']} />
            <mesh castShadow receiveShadow geometry={nodes.Object_144.geometry} material={materials['Materil.040']} />
          </group>
          <group position={[-8.013, 0.885, -2.184]} rotation={[0, 0.827, 0]}>
            <mesh castShadow receiveShadow geometry={nodes.Object_167.geometry} material={materials['Materil.065']} />
            <mesh castShadow receiveShadow geometry={nodes.Object_168.geometry} material={materials['Materil.057']} />
          </group>
          <group position={[-8.772, 0.997, -1.631]} scale={[0.124, 0.194, 0.124]}>
            <mesh castShadow receiveShadow geometry={nodes.Object_170.geometry} material={materials['Materil.066']} />
            <mesh castShadow receiveShadow geometry={nodes.Object_171.geometry} material={materials['Materil.067']} />
          </group>
          <group position={[-8.955, 0.997, -2.261]} scale={[0.124, 0.194, 0.124]}>
            <mesh castShadow receiveShadow geometry={nodes.Object_173.geometry} material={materials['Materil.066']} />
            <mesh castShadow receiveShadow geometry={nodes.Object_174.geometry} material={materials['Materil.067']} />
          </group>
          <group position={[-8.755, 0.928, -2.503]} rotation={[0, 0, -1.5708]} scale={[0.124, 0.194, 0.124]}>
            <mesh castShadow receiveShadow geometry={nodes.Object_176.geometry} material={materials['Materil.066']} />
            <mesh castShadow receiveShadow geometry={nodes.Object_177.geometry} material={materials['Materil.067']} />
          </group>
          <group position={[-8.772, 0.206, -1.985]} scale={[0.124, 0.194, 0.124]}>
            <mesh castShadow receiveShadow geometry={nodes.Object_179.geometry} material={materials['Materil.066']} />
            <mesh castShadow receiveShadow geometry={nodes.Object_180.geometry} material={materials['Materil.069']} />
          </group>
          <group position={[-8.955, 0.206, -1.652]} scale={[0.124, 0.194, 0.124]}>
            <mesh castShadow receiveShadow geometry={nodes.Object_182.geometry} material={materials['Materil.066']} />
            <mesh castShadow receiveShadow geometry={nodes.Object_183.geometry} material={materials['Materil.069']} />
          </group>
          <group position={[-8.755, 0.137, -2.25]} rotation={[0, 0, -Math.PI / 2]} scale={[0.124, 0.194, 0.124]}>
            <mesh castShadow receiveShadow geometry={nodes.Object_185.geometry} material={materials['Materil.066']} />
            <mesh castShadow receiveShadow geometry={nodes.Object_186.geometry} material={materials['Materil.068']} />
          </group>
          <group position={[-8.755, 0.137, -2.491]} rotation={[0, 0, -Math.PI / 2]} scale={[0.124, 0.194, 0.124]}>
            <mesh castShadow receiveShadow geometry={nodes.Object_188.geometry} material={materials['Materil.066']} />
            <mesh castShadow receiveShadow geometry={nodes.Object_189.geometry} material={materials['Materil.068']} />
          </group>
          <group position={[-8.755, 0.341, -2.372]} rotation={[0, 0, -Math.PI / 2]} scale={[0.124, 0.194, 0.124]}>
            <mesh castShadow receiveShadow geometry={nodes.Object_191.geometry} material={materials['Materil.066']} />
            <mesh castShadow receiveShadow geometry={nodes.Object_192.geometry} material={materials['Materil.068']} />
          </group>
          <group position={[-8.772, 0.997, -1.89]} scale={[0.124, 0.194, 0.124]}>
            <mesh castShadow receiveShadow geometry={nodes.Object_194.geometry} material={materials['Materil.066']} />
            <mesh castShadow receiveShadow geometry={nodes.Object_195.geometry} material={materials['Materil.067']} />
          </group>
          <group position={[-8.482, 3.269, -3.327]} rotation={[0, -0.592, 0]}>
            <mesh castShadow receiveShadow geometry={nodes.Object_197.geometry} material={materials['Materil.070']} />
            <mesh castShadow receiveShadow geometry={nodes.Object_198.geometry} material={materials['Materil.071']} />
            <mesh castShadow receiveShadow geometry={nodes.Object_199.geometry} material={materials['Materil.072']} />
            <mesh castShadow receiveShadow geometry={nodes.Object_200.geometry} material={materials['Materil.073']} />
            <mesh castShadow receiveShadow geometry={nodes.Object_201.geometry} material={materials['Materil.074']} />
            <mesh castShadow receiveShadow geometry={nodes.Object_202.geometry} material={materials['Materil.075']} />
            <mesh castShadow receiveShadow geometry={nodes.Object_203.geometry} material={materials['Materil.076']} />
            <mesh castShadow receiveShadow geometry={nodes.Object_204.geometry} material={materials['Materil.077']} />
            <mesh castShadow receiveShadow geometry={nodes.Object_205.geometry} material={materials['Materil.078']} />
            <mesh castShadow receiveShadow geometry={nodes.Object_206.geometry} material={materials['Materil.079']} />
            <mesh castShadow receiveShadow geometry={nodes.Object_207.geometry} material={materials['Materil.080']} />
            <mesh castShadow receiveShadow geometry={nodes.Object_208.geometry} material={materials['Materil.081']} />
            <mesh castShadow receiveShadow geometry={nodes.Object_209.geometry} material={materials['Materil.082']} />
            <mesh castShadow receiveShadow geometry={nodes.Object_210.geometry} material={materials['Materil.083']} />
            <mesh castShadow receiveShadow geometry={nodes.Object_211.geometry} material={materials['Materil.084']} />
            <mesh castShadow receiveShadow geometry={nodes.Object_212.geometry} material={materials['Materil.085']} />
            <mesh castShadow receiveShadow geometry={nodes.Object_213.geometry} material={materials['Materil.086']} />
            <mesh castShadow receiveShadow geometry={nodes.Object_214.geometry} material={materials['Materil.087']} />
            <mesh castShadow receiveShadow geometry={nodes.Object_215.geometry} material={materials['Materil.088']} />
          </group>
          <group position={[-9.425, 1.284, -3.189]} rotation={[Math.PI / 2, 0, 0]} scale={[0.407, 0.494, 0.363]}>
            <mesh castShadow receiveShadow geometry={nodes.Object_221.geometry} material={materials['Materil.094']} />
            <mesh castShadow receiveShadow geometry={nodes.Object_222.geometry} material={materials['Materil.095']} />
          </group>
          <mesh castShadow receiveShadow geometry={nodes.Object_4.geometry} material={materials['Materil.002']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_6.geometry} material={materials['Materil.002']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_8.geometry} material={materials['Materil.002']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_10.geometry} material={materials['Materil.002']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_12.geometry} material={materials['Materil.002']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_14.geometry} material={materials['Materil.002']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_16.geometry} material={materials['Materil.003']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_18.geometry} material={materials['Materil.005']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_19.geometry} material={materials['Materil.008']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_21.geometry} material={materials['Materil.006']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_23.geometry} material={materials['Materil.008']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_25.geometry} material={materials['Materil.008']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_27.geometry} material={materials['Materil.007']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_28.geometry} material={materials['Materil.015']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_30.geometry} material={materials['Materil.007']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_31.geometry} material={materials['Materil.015']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_33.geometry} material={materials['Materil.008']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_35.geometry} material={materials['Materil.008']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_37.geometry} material={materials['Materil.009']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_39.geometry} material={materials['Materil.007']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_40.geometry} material={materials['Materil.012']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_42.geometry} material={materials['Materil.011']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_44.geometry} material={materials['Materil.011']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_46.geometry} material={materials['Materil.006']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_48.geometry} material={materials['Materil.006']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_50.geometry} material={materials['Materil.008']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_52.geometry} material={materials['Materil.008']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_54.geometry} material={materials['Materil.002']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_55.geometry} material={materials['Materil.007']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_57.geometry} material={materials['Materil.002']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_58.geometry} material={materials['Materil.007']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_60.geometry} material={materials['Materil.008']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_62.geometry} material={materials['Materil.006']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_64.geometry} material={materials['Materil.007']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_66.geometry} material={materials['Materil.013']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_68.geometry} material={materials['Materil.006']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_70.geometry} material={materials['Materil.016']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_71.geometry} material={materials['Materil.014']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_72.geometry} material={materials['Materil.018']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_74.geometry} material={materials['Materil.019']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_75.geometry} material={materials['Materil.020']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_77.geometry} material={materials['Materil.021']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_78.geometry} material={materials['Materil.022']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_80.geometry} material={materials['Materil.022']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_82.geometry} material={materials['Materil.023']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_84.geometry} material={materials['Materil.023']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_86.geometry} material={materials['Materil.010']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_87.geometry} material={materials['Materil.017']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_88.geometry} material={materials['Materil.024']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_89.geometry} material={materials['Materil.025']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_91.geometry} material={materials['Materil.016']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_92.geometry} material={materials['Materil.014']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_93.geometry} material={materials['Materil.018']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_95.geometry} material={materials['Materil.026']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_96.geometry} material={materials['Materil.027']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_98.geometry} material={materials['Materil.038']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_100.geometry} material={materials['Materil.037']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_102.geometry} material={materials['Materil.037']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_104.geometry} material={materials['Materil.032']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_106.geometry} material={materials['Materil.004']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_107.geometry} material={materials['Materil.032']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_109.geometry} material={materials['Materil.032']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_111.geometry} material={materials['Materil.004']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_112.geometry} material={materials['Materil.032']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_114.geometry} material={materials['Materil.002']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_116.geometry} material={materials['Materil.005']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_118.geometry} material={materials['Materil.005']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_120.geometry} material={materials['Materil.005']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_122.geometry} material={materials['Materil.002']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_124.geometry} material={materials['Materil.005']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_126.geometry} material={materials['Materil.035']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_128.geometry} material={materials['Materil.035']} />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Object_130.geometry}
            material={materials['Materil.035']}
            position={[-7.377, 4.825, -7.209]}
            rotation={[-0.3, 0, 0]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Object_132.geometry}
            material={materials['Materil.035']}
            position={[-7.377, 4.645, -7.663]}
            rotation={[-0.3, 0, -Math.PI / 2]}
            scale={[0.025, 0.044, 0.025]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Object_134.geometry}
            material={materials['Materil.013']}
            position={[-7.373, 3.288, -7.388]}
            rotation={[0.1, 0, 0]}
            scale={[0.022, 0.056, 0.022]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Object_136.geometry}
            material={materials['Materil.035']}
            position={[-7.373, 3.285, -7.389]}
            rotation={[0.1, 0, 0]}
            scale={[0.023, 0.056, 0.023]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Object_146.geometry}
            material={materials['Materil.023']}
            position={[-7.478, 3.292, -3.12]}
            rotation={[0, 0, -0.04]}
            scale={[0.155, 0.003, 0.003]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Object_148.geometry}
            material={materials['Materil.023']}
            position={[-7.478, 3.292, -4.259]}
            rotation={[0, 0, -0.04]}
            scale={[0.155, 0.003, 0.003]}
          />
          <mesh castShadow receiveShadow geometry={nodes.Object_150.geometry} material={materials['Materil.031']} />
          <mesh castShadow receiveShadow geometry={nodes.Object_151.geometry} material={materials['Materil.042']} />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Object_153.geometry}
            material={materials['Materil.044']}
            position={[-6.9, 3.157, -1.724]}
            scale={[0.156, 0.03, 0.161]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Object_155.geometry}
            material={materials['Materil.045']}
            position={[-6.76, 3.155, -1.832]}
            scale={[0.019, 0.019, 0.029]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Object_157.geometry}
            material={materials['Materil.045']}
            position={[-6.76, 3.155, -1.742]}
            scale={[0.019, 0.019, 0.029]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Object_159.geometry}
            material={materials['Materil.054']}
            position={[-7.904, 2.285, -7.637]}
            rotation={[0, -0.373, 0]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Object_161.geometry}
            material={materials['Materil.055']}
            position={[-8.164, 2.557, -7.455]}
            rotation={[0, -0.373, 0]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Object_163.geometry}
            material={materials['Materil.055']}
            position={[-7.972, 2.556, -7.944]}
            rotation={[0, -0.373, 0]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Object_165.geometry}
            material={materials['Materil.065']}
            position={[-9.095, 0.851, -2.002]}
            scale={[0.63, 0.865, 0.642]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Object_217.geometry}
            material={materials['Materil.093']}
            position={[-9.418, 0.624, -3.19]}
            scale={[0.342, 0.634, 0.476]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Object_219.geometry}
            material={materials['Materil.094']}
            position={[-9.418, 1.271, -3.189]}
            scale={[0.431, 0.017, 0.517]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Object_224.geometry}
            material={materials['Materil.097']}
            position={[-7.435, 3.403, -6.699]}
            scale={[0.092, 0.147, 0.092]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Object_226.geometry}
            material={materials['Materil.098']}
            position={[-7.435, 3.321, -6.699]}
            scale={[0.089, 0.048, 0.089]}
          />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload('/computer_setup.glb');
