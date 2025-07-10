import { type JSX, useEffect, useRef } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as three from 'three';

const subtleGlowMaterial = new three.MeshStandardMaterial({
  color: '#d8b4fe',
  emissive: '#c084fc',
  emissiveIntensity: 1.2,
  transparent: false,
  opacity: 1.0,
  roughness: 0.2,
  metalness: 0.8,
});

type HoloTableProps = {
  scale?: number | [number, number, number];
  position?: [number, number, number];
} & Omit<JSX.IntrinsicElements['group'], 'scale' | 'position'>;

export function HoloTable(props: HoloTableProps) {
  const group = useRef<three.Group>(null);
  const { nodes, materials, animations } = useGLTF('/placeholder-cube_3.glb');
  const { actions } = useAnimations(animations, group);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (actions) {
      for (const action of Object.values(actions)) {
        if (action) {
          action.setLoop(three.LoopOnce, 1);
          action.clampWhenFinished = true;
          action.play();
        }
      }
    }
  }, []);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name='Sketchfab_Scene'>
        <group name='Sketchfab_model' position={[-0.118, 0.005, -0.054]}>
          <group name='Root'>
            <group name='Icosphere002' scale={1.001}>
              <mesh
                name='Icosphere002_0'
                castShadow
                receiveShadow
                geometry={(nodes.Icosphere002_0 as three.Mesh)?.geometry}
                material={materials.material_8}
              />
            </group>
            <group name='Icosphere001' scale={1.001}>
              <mesh
                name='Icosphere001_0'
                castShadow
                receiveShadow
                geometry={(nodes.Icosphere001_0 as three.Mesh)?.geometry}
                material={materials['Material.002']}
              />
              <mesh
                name='Icosphere001_1'
                castShadow
                receiveShadow
                geometry={(nodes.Icosphere001_1 as three.Mesh)?.geometry}
                material={materials.material_7}
              />
            </group>
            {/* 寃됰㈃ ?먮툕??- ????諛쒓킅??*/}
            <group name='Cube_cell415' position={[0.992, 0.435, 0.178]}>
              <mesh
                name='Cube_cell415_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell415_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell414' position={[-0.953, -0.009, -0.1]}>
              <mesh
                name='Cube_cell414_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell414_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell413' position={[0.289, -0.053, 0.836]}>
              <mesh
                name='Cube_cell413_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell413_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell412' position={[0.998, 0.271, 0.225]}>
              <mesh
                name='Cube_cell412_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell412_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell411' position={[-0.906, -0.682, -0.978]}>
              <mesh
                name='Cube_cell411_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell411_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell410' position={[-0.366, 0.924, -0.314]}>
              <mesh
                name='Cube_cell410_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell410_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell409' position={[-0.941, 0.415, -0.416]}>
              <mesh
                name='Cube_cell409_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell409_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell408' position={[-0.027, -0.986, -0.171]}>
              <mesh
                name='Cube_cell408_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell408_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell407' position={[-0.956, -0.35, 0.352]}>
              <mesh
                name='Cube_cell407_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell407_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell406' position={[0.907, -0.533, -0.34]}>
              <mesh
                name='Cube_cell406_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell406_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell405' position={[0.9, 0.324, 0.482]}>
              <mesh
                name='Cube_cell405_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell405_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell404' position={[-0.667, -0.003, -0.852]}>
              <mesh
                name='Cube_cell404_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell404_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell402' position={[-0.854, -0.748, -0.52]}>
              <mesh
                name='Cube_cell402_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell402_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell401' position={[0.218, -0.157, 0.839]}>
              <mesh
                name='Cube_cell401_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell401_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell400' position={[-0.627, 0.836, 0.505]}>
              <mesh
                name='Cube_cell400_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell400_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell399' position={[0.923, 0.617, 0.462]}>
              <mesh
                name='Cube_cell399_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell399_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell398' position={[0.741, -0.596, -0.736]}>
              <mesh
                name='Cube_cell398_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell398_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell397' position={[0.945, 0.03, -0.171]}>
              <mesh
                name='Cube_cell397_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell397_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell396' position={[0.067, 0.972, -0.395]}>
              <mesh
                name='Cube_cell396_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell396_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell395' position={[-0.281, -0.782, -0.722]}>
              <mesh
                name='Cube_cell395_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell395_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell394' position={[-0.235, 0.953, 0.257]}>
              <mesh
                name='Cube_cell394_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell394_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell392_cell005' position={[-0.499, -0.933, -0.022]}>
              <mesh
                name='Cube_cell392_cell005_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell392_cell005_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell392_cell004' position={[-0.129, -0.957, -0.132]}>
              <mesh
                name='Cube_cell392_cell004_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell392_cell004_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell392_cell003' position={[-0.519, -0.945, -0.349]}>
              <mesh
                name='Cube_cell392_cell003_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell392_cell003_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell391_cell_cell005' position={[0.066, -0.893, -0.565]}>
              <mesh
                name='Cube_cell391_cell_cell005_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell391_cell_cell005_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell391_cell_cell004' position={[-0.209, -0.949, -0.466]}>
              <mesh
                name='Cube_cell391_cell_cell004_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell391_cell_cell004_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell391_cell_cell003' position={[-0.289, -0.977, -0.496]}>
              <mesh
                name='Cube_cell391_cell_cell003_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell391_cell_cell003_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell391_cell002' position={[0.102, -0.948, -0.227]}>
              <mesh
                name='Cube_cell391_cell002_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell391_cell002_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell389_cell004' position={[0.26, -0.965, 0.057]}>
              <mesh
                name='Cube_cell389_cell004_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell389_cell004_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell389_cell003' position={[0.07, -0.952, 0.104]}>
              <mesh
                name='Cube_cell389_cell003_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell389_cell003_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell389_cell002_cell005' position={[0.237, -0.876, 0.142]}>
              <mesh
                name='Cube_cell389_cell002_cell005_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell389_cell002_cell005_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell389_cell002_cell004' position={[0.419, -0.873, 0.068]}>
              <mesh
                name='Cube_cell389_cell002_cell004_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell389_cell002_cell004_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell389_cell002_cell003' position={[0.249, -0.865, -0.105]}>
              <mesh
                name='Cube_cell389_cell002_cell003_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell389_cell002_cell003_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell385_cell_cell005' position={[0.024, -0.998, 0.057]}>
              <mesh
                name='Cube_cell385_cell_cell005_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell385_cell_cell005_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell385_cell_cell004' position={[0.024, -0.996, 0.038]}>
              <mesh
                name='Cube_cell385_cell_cell004_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell385_cell_cell004_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell385_cell_cell003' position={[0.015, -0.993, 0.048]}>
              <mesh
                name='Cube_cell385_cell_cell003_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell385_cell_cell003_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell385_cell004' position={[0.033, -0.995, 0.02]}>
              <mesh
                name='Cube_cell385_cell004_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell385_cell004_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell385_cell003' position={[0.018, -0.981, 0.037]}>
              <mesh
                name='Cube_cell385_cell003_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell385_cell003_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell381_cell_cell005' position={[-0.995, 0.304, 0.696]}>
              <mesh
                name='Cube_cell381_cell_cell005_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell381_cell_cell005_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell381_cell_cell004' position={[-0.925, 0.313, 0.476]}>
              <mesh
                name='Cube_cell381_cell_cell004_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell381_cell_cell004_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell381_cell_cell003' position={[-0.934, 0.129, 0.097]}>
              <mesh
                name='Cube_cell381_cell_cell003_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell381_cell_cell003_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell381_cell003' position={[-0.929, 0.453, 0.059]}>
              <mesh
                name='Cube_cell381_cell003_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell381_cell003_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell381_cell002_cell005' position={[-0.915, -0.028, 0.12]}>
              <mesh
                name='Cube_cell381_cell002_cell005_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell381_cell002_cell005_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell381_cell002_cell004' position={[-0.932, -0.068, 0.091]}>
              <mesh
                name='Cube_cell381_cell002_cell004_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell381_cell002_cell004_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell381_cell002_cell003' position={[-0.932, -0.012, 0.064]}>
              <mesh
                name='Cube_cell381_cell002_cell003_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell381_cell002_cell003_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell380_cell009' position={[0.243, 0.994, -0.194]}>
              <mesh
                name='Cube_cell380_cell009_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell380_cell009_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell380_cell008' position={[0.092, 0.967, -0.12]}>
              <mesh
                name='Cube_cell380_cell008_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell380_cell008_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell380_cell007' position={[-0.159, 0.988, -0.159]}>
              <mesh
                name='Cube_cell380_cell007_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell380_cell007_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell380_cell006' position={[0.114, 0.965, -0.23]}>
              <mesh
                name='Cube_cell380_cell006_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell380_cell006_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell380_cell005' position={[-0.078, 0.99, -0.023]}>
              <mesh
                name='Cube_cell380_cell005_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell380_cell005_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell377_cell004' position={[-0.307, 0.368, -0.917]}>
              <mesh
                name='Cube_cell377_cell004_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell377_cell004_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell377_cell003' position={[-0.31, 0.813, -0.832]}>
              <mesh
                name='Cube_cell377_cell003_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell377_cell003_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell371_cell005' position={[0.177, 0.569, 0.846]}>
              <mesh
                name='Cube_cell371_cell005_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell371_cell005_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell371_cell004' position={[0.142, 0.947, 0.018]}>
              <mesh
                name='Cube_cell371_cell004_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell371_cell004_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell371_cell003' position={[-0.02, 0.924, 0.003]}>
              <mesh
                name='Cube_cell371_cell003_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell371_cell003_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell368_cell005' position={[0.028, -0.758, 0.835]}>
              <mesh
                name='Cube_cell368_cell005_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell368_cell005_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell368_cell004' position={[0.398, -0.96, 0.339]}>
              <mesh
                name='Cube_cell368_cell004_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell368_cell004_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell368_cell003' position={[0.195, -0.951, 0.38]}>
              <mesh
                name='Cube_cell368_cell003_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell368_cell003_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell367_cell003' position={[0.659, 0.796, -0.62]}>
              <mesh
                name='Cube_cell367_cell003_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell367_cell003_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell367_cell002_cell005' position={[0.639, 0.969, -0.441]}>
              <mesh
                name='Cube_cell367_cell002_cell005_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell367_cell002_cell005_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell367_cell002_cell004' position={[0.504, 0.949, -0.346]}>
              <mesh
                name='Cube_cell367_cell002_cell004_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell367_cell002_cell004_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell367_cell002_cell003' position={[0.759, 0.888, -0.223]}>
              <mesh
                name='Cube_cell367_cell002_cell003_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell367_cell002_cell003_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell367_cell001_cell005' position={[0.349, 0.945, -0.228]}>
              <mesh
                name='Cube_cell367_cell001_cell005_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell367_cell001_cell005_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell367_cell001_cell004' position={[0.24, 0.842, -0.54]}>
              <mesh
                name='Cube_cell367_cell001_cell004_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell367_cell001_cell004_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell367_cell001_cell003' position={[0.32, 0.964, -0.454]}>
              <mesh
                name='Cube_cell367_cell001_cell003_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell367_cell001_cell003_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell366_cell005' position={[-0.927, -0.783, 0.41]}>
              <mesh
                name='Cube_cell366_cell005_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell366_cell005_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell366_cell004' position={[-0.05, -0.143, 0.922]}>
              <mesh
                name='Cube_cell366_cell004_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell366_cell004_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell366_cell003' position={[-0.846, -0.574, 0.637]}>
              <mesh
                name='Cube_cell366_cell003_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell366_cell003_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell050_cell005' position={[0.79, -0.623, 0.024]}>
              <mesh
                name='Cube_cell050_cell005_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell050_cell005_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell050_cell004' position={[0.917, -0.423, 0.399]}>
              <mesh
                name='Cube_cell050_cell004_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell050_cell004_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell050_cell003' position={[0.742, -0.86, 0.214]}>
              <mesh
                name='Cube_cell050_cell003_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell050_cell003_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell032_cell006' position={[0.592, -0.806, 0.63]}>
              <mesh
                name='Cube_cell032_cell006_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell032_cell006_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell032_cell005' position={[0.812, -0.762, 0.725]}>
              <mesh
                name='Cube_cell032_cell005_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell032_cell005_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell032_cell003' position={[0.698, -0.929, 0.313]}>
              <mesh
                name='Cube_cell032_cell003_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell032_cell003_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Icosphere003' scale={1.001}>
              <mesh
                name='Icosphere003_0'
                castShadow
                receiveShadow
                geometry={(nodes.Icosphere003_0 as three.Mesh)?.geometry}
                material={materials.material_4}
              />
            </group>
            <group name='Icosphere004' scale={1.001}>
              <mesh
                name='Icosphere004_0'
                castShadow
                receiveShadow
                geometry={(nodes.Icosphere004_0 as three.Mesh)?.geometry}
                material={materials.material}
              />
            </group>
            <group name='Icosphere005' scale={1.001}>
              <mesh
                name='Icosphere005_0'
                castShadow
                receiveShadow
                geometry={(nodes.Icosphere005_0 as three.Mesh)?.geometry}
                material={materials['Material.001']}
              />
            </group>
            <group name='Icosphere006' scale={1.001}>
              <mesh
                name='Icosphere006_0'
                castShadow
                receiveShadow
                geometry={(nodes.Icosphere006_0 as three.Mesh)?.geometry}
                material={materials['Material.003']}
              />
            </group>
            <group name='Cube_cell377_cell005' position={[0.292, 0.137, -0.917]}>
              <mesh
                name='Cube_cell377_cell005_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell377_cell005_0 as three.Mesh)?.geometry}
                material={subtleGlowMaterial}
              />
            </group>
            <group name='Cube_cell427' position={[0.44, 0.607, 0.33]}>
              <mesh
                name='Cube_cell427_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell427_0 as three.Mesh)?.geometry}
                material={materials['Cube_cell.476_0']}
              />
            </group>
            <group name='Cube_cell428' position={[0.167, 0.099, 0.75]}>
              <mesh
                name='Cube_cell428_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell428_0 as three.Mesh)?.geometry}
                material={materials['Cube_cell.476_0']}
              />
            </group>
            <group name='Cube_cell429' position={[-0.067, 0.686, -0.387]}>
              <mesh
                name='Cube_cell429_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell429_0 as three.Mesh)?.geometry}
                material={materials['Cube_cell.476_0']}
              />
            </group>
            <group name='Cube_cell430' position={[0.191, 0.33, -0.719]}>
              <mesh
                name='Cube_cell430_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell430_0 as three.Mesh)?.geometry}
                material={materials['Cube_cell.476_0']}
              />
            </group>
            <group name='Cube_cell431' position={[-0.458, -0.106, 0.676]}>
              <mesh
                name='Cube_cell431_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell431_0 as three.Mesh)?.geometry}
                material={materials['Cube_cell.476_0']}
              />
            </group>
            <group name='Cube_cell432' position={[0.622, -0.569, -0.452]}>
              <mesh
                name='Cube_cell432_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell432_0 as three.Mesh)?.geometry}
                material={materials['Cube_cell.476_0']}
              />
            </group>
            <group name='Cube_cell433' position={[0.697, -0.326, 0.148]}>
              <mesh
                name='Cube_cell433_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell433_0 as three.Mesh)?.geometry}
                material={materials['Cube_cell.476_0']}
              />
            </group>
            <group name='Cube_cell434' position={[-0.389, 0.681, 0]}>
              <mesh
                name='Cube_cell434_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell434_0 as three.Mesh)?.geometry}
                material={materials['Cube_cell.476_0']}
              />
            </group>
            <group name='Cube_cell435' position={[0.305, -0.597, 0.344]}>
              <mesh
                name='Cube_cell435_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell435_0 as three.Mesh)?.geometry}
                material={materials['Cube_cell.476_0']}
              />
            </group>
            <group name='Cube_cell436' position={[-0.53, 0.532, 0.551]}>
              <mesh
                name='Cube_cell436_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell436_0 as three.Mesh)?.geometry}
                material={materials['Cube_cell.476_0']}
              />
            </group>
            <group name='Cube_cell437' position={[0.502, -0.122, 0.628]}>
              <mesh
                name='Cube_cell437_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell437_0 as three.Mesh)?.geometry}
                material={materials['Cube_cell.476_0']}
              />
            </group>
            <group name='Cube_cell438' position={[0.273, 0.719, -0.2]}>
              <mesh
                name='Cube_cell438_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell438_0 as three.Mesh)?.geometry}
                material={materials['Cube_cell.476_0']}
              />
            </group>
            <group name='Cube_cell439' position={[0.576, 0.412, -0.415]}>
              <mesh
                name='Cube_cell439_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell439_0 as three.Mesh)?.geometry}
                material={materials['Cube_cell.476_0']}
              />
            </group>
            <group name='Cube_cell440' position={[-0.688, 0.598, -0.05]}>
              <mesh
                name='Cube_cell440_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell440_0 as three.Mesh)?.geometry}
                material={materials['Cube_cell.476_0']}
              />
            </group>
            <group name='Cube_cell441' position={[-0.343, -0.487, 0.451]}>
              <mesh
                name='Cube_cell441_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell441_0 as three.Mesh)?.geometry}
                material={materials['Cube_cell.476_0']}
              />
            </group>
            <group name='Cube_cell442' position={[-0.033, 0.59, 0.585]}>
              <mesh
                name='Cube_cell442_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell442_0 as three.Mesh)?.geometry}
                material={materials['Cube_cell.476_0']}
              />
            </group>
            <group name='Cube_cell443' position={[0.237, 0.695, 0.381]}>
              <mesh
                name='Cube_cell443_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell443_0 as three.Mesh)?.geometry}
                material={materials['Cube_cell.476_0']}
              />
            </group>
            <group name='Cube_cell444' position={[0.375, -0.529, -0.626]}>
              <mesh
                name='Cube_cell444_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell444_0 as three.Mesh)?.geometry}
                material={materials['Cube_cell.476_0']}
              />
            </group>
            <group name='Cube_cell445' position={[-0.243, -0.34, -0.678]}>
              <mesh
                name='Cube_cell445_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell445_0 as three.Mesh)?.geometry}
                material={materials['Cube_cell.476_0']}
              />
            </group>
            <group name='Cube_cell446' position={[-0.733, -0.075, -0.101]}>
              <mesh
                name='Cube_cell446_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell446_0 as three.Mesh)?.geometry}
                material={materials['Cube_cell.476_0']}
              />
            </group>
            <group name='Cube_cell447' position={[0.695, -0.334, -0.205]}>
              <mesh
                name='Cube_cell447_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell447_0 as three.Mesh)?.geometry}
                material={materials['Cube_cell.476_0']}
              />
            </group>
            <group name='Cube_cell448' position={[-0.472, -0.596, -0.064]}>
              <mesh
                name='Cube_cell448_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell448_0 as three.Mesh)?.geometry}
                material={materials['Cube_cell.476_0']}
              />
            </group>
            <group name='Cube_cell449' position={[-0.58, -0.67, -0.722]}>
              <mesh
                name='Cube_cell449_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell449_0 as three.Mesh)?.geometry}
                material={materials['Cube_cell.476_0']}
              />
            </group>
            <group name='Cube_cell450' position={[0.21, 0.741, 0.147]}>
              <mesh
                name='Cube_cell450_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell450_0 as three.Mesh)?.geometry}
                material={materials['Cube_cell.476_0']}
              />
            </group>
            <group name='Cube_cell451' position={[0.488, 0.681, -0.648]}>
              <mesh
                name='Cube_cell451_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell451_0 as three.Mesh)?.geometry}
                material={materials['Cube_cell.476_0']}
              />
            </group>
            <group name='Cube_cell452' position={[-0.623, -0.229, -0.443]}>
              <mesh
                name='Cube_cell452_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell452_0 as three.Mesh)?.geometry}
                material={materials['Cube_cell.476_0']}
              />
            </group>
            <group name='Cube_cell453' position={[-0.474, 0.34, -0.522]}>
              <mesh
                name='Cube_cell453_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell453_0 as three.Mesh)?.geometry}
                material={materials['Cube_cell.476_0']}
              />
            </group>
            <group name='Cube_cell454' position={[-0.669, 0.09, 0.399]}>
              <mesh
                name='Cube_cell454_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell454_0 as three.Mesh)?.geometry}
                material={materials['Cube_cell.476_0']}
              />
            </group>
            <group name='Cube_cell455' position={[-0.015, 0.77, -0.028]}>
              <mesh
                name='Cube_cell455_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell455_0 as three.Mesh)?.geometry}
                material={materials['Cube_cell.476_0']}
              />
            </group>
            <group name='Cube_cell456' position={[0.478, -0.681, -0.12]}>
              <mesh
                name='Cube_cell456_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell456_0 as three.Mesh)?.geometry}
                material={materials['Cube_cell.476_0']}
              />
            </group>
            <group name='Cube_cell457' position={[0.523, 0.205, 0.599]}>
              <mesh
                name='Cube_cell457_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell457_0 as three.Mesh)?.geometry}
                material={materials['Cube_cell.476_0']}
              />
            </group>
            <group name='Cube_cell458' position={[0.01, 0.529, -0.625]}>
              <mesh
                name='Cube_cell458_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell458_0 as three.Mesh)?.geometry}
                material={materials['Cube_cell.476_0']}
              />
            </group>
            <group name='Cube_cell459' position={[-0.105, 0.256, 0.71]}>
              <mesh
                name='Cube_cell459_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell459_0 as three.Mesh)?.geometry}
                material={materials['Cube_cell.476_0']}
              />
            </group>
            <group name='Cube_cell460' position={[0.56, -0.048, -0.6]}>
              <mesh
                name='Cube_cell460_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell460_0 as three.Mesh)?.geometry}
                material={materials['Cube_cell.476_0']}
              />
            </group>
            <group name='Cube_cell461' position={[-0.23, 0.684, 0.308]}>
              <mesh
                name='Cube_cell461_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell461_0 as three.Mesh)?.geometry}
                material={materials['Cube_cell.476_0']}
              />
            </group>
            <group name='Cube_cell462' position={[-0.511, 0.717, -0.507]}>
              <mesh
                name='Cube_cell462_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell462_0 as three.Mesh)?.geometry}
                material={materials['Cube_cell.476_0']}
              />
            </group>
            <group name='Cube_cell463' position={[-Math.LN2, 0.235, 0.098]}>
              <mesh
                name='Cube_cell463_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell463_0 as three.Mesh)?.geometry}
                material={materials['Cube_cell.476_0']}
              />
            </group>
            <group name='Cube_cell464' position={[0.057, -0.036, -0.751]}>
              <mesh
                name='Cube_cell464_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell464_0 as three.Mesh)?.geometry}
                material={materials['Cube_cell.476_0']}
              />
            </group>
            <group name='Cube_cell465' position={[0.405, 0.534, 0.737]}>
              <mesh
                name='Cube_cell465_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell465_0 as three.Mesh)?.geometry}
                material={materials['Cube_cell.476_0']}
              />
            </group>
            <group name='Cube_cell466' position={[-0.165, 0.642, 0.759]}>
              <mesh
                name='Cube_cell466_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell466_0 as three.Mesh)?.geometry}
                material={materials['Cube_cell.476_0']}
              />
            </group>
            <group name='Cube_cell467' position={[-0.075, -0.708, -0.301]}>
              <mesh
                name='Cube_cell467_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell467_0 as three.Mesh)?.geometry}
                material={materials['Cube_cell.476_0']}
              />
            </group>
            <group name='Cube_cell468' position={[0.655, 0.709, -0.147]}>
              <mesh
                name='Cube_cell468_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell468_0 as three.Mesh)?.geometry}
                material={materials['Cube_cell.476_0']}
              />
            </group>
            <group name='Cube_cell469' position={[0.751, -0.018, 0.091]}>
              <mesh
                name='Cube_cell469_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell469_0 as three.Mesh)?.geometry}
                material={materials['Cube_cell.476_0']}
              />
            </group>
            <group name='Cube_cell470' position={[0.742, 0.194, -0.167]}>
              <mesh
                name='Cube_cell470_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell470_0 as three.Mesh)?.geometry}
                material={materials['Cube_cell.476_0']}
              />
            </group>
            <group name='Cube_cell471' position={[0.677, 0.382, 0.155]}>
              <mesh
                name='Cube_cell471_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell471_0 as three.Mesh)?.geometry}
                material={materials['Cube_cell.476_0']}
              />
            </group>
            <group name='Cube_cell472' position={[0.185, -0.554, -0.755]}>
              <mesh
                name='Cube_cell472_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell472_0 as three.Mesh)?.geometry}
                material={materials['Cube_cell.476_0']}
              />
            </group>
            <group name='Cube_cell473' position={[-0.004, -0.202, 0.729]}>
              <mesh
                name='Cube_cell473_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell473_0 as three.Mesh)?.geometry}
                material={materials['Cube_cell.476_0']}
              />
            </group>
            <group name='Cube_cell474' position={[0.232, -0.727, -0.487]}>
              <mesh
                name='Cube_cell474_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell474_0 as three.Mesh)?.geometry}
                material={materials['Cube_cell.476_0']}
              />
            </group>
            <group name='Cube_cell475' position={[-0.611, -0.678, -0.522]}>
              <mesh
                name='Cube_cell475_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell475_0 as three.Mesh)?.geometry}
                material={materials['Cube_cell.476_0']}
              />
            </group>
            <group name='Cube_cell476' position={[0.611, 0.463, 0.432]}>
              <mesh
                name='Cube_cell476_0'
                castShadow
                receiveShadow
                geometry={(nodes.Cube_cell476_0 as three.Mesh)?.geometry}
                material={materials['Cube_cell.476_0']}
              />
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload('/placeholder-cube_3.glb');
