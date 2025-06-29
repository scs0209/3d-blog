import { useEffect, useRef } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as three from 'three';

// 사이버펑크 테마 재질 생성
const cyberpunkMaterials = {
  robotBody: new three.MeshStandardMaterial({
    color: '#00ffff',
    emissive: '#001a1a',
    emissiveIntensity: 0.3,
    metalness: 0.8,
    roughness: 0.2,
  }),
  robotJoint: new three.MeshStandardMaterial({
    color: '#ff00ff',
    emissive: '#1a001a',
    emissiveIntensity: 0.4,
    metalness: 0.9,
    roughness: 0.1,
  }),
  robotBase: new three.MeshStandardMaterial({
    color: '#ffff00',
    emissive: '#1a1a00',
    emissiveIntensity: 0.2,
    metalness: 0.7,
    roughness: 0.3,
  }),
  robotText: new three.MeshStandardMaterial({
    color: '#00ff00',
    emissive: '#001a00',
    emissiveIntensity: 0.5,
    metalness: 0.3,
    roughness: 0.7,
  }),
  purpleNeonBox: new three.MeshStandardMaterial({
    color: '#9d00ff',
    emissive: '#9d00ff',
    emissiveIntensity: 3.5,
    metalness: 0.1,
    roughness: 0.1,
    transparent: true,
    opacity: 0.95,
    toneMapped: false,
  }),
  silverMetal: new three.MeshStandardMaterial({
    color: '#ffffff',
    emissive: '#ffffff',
    emissiveIntensity: 0.1,
    metalness: 0.9,
    roughness: 0.1,
  }),
};

export function RobotArm(props: any) {
  const group = useRef<three.Group>(null);
  const { nodes, materials, animations } = useGLTF('/robot_arm_animation.glb');
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (actions) {
      for (const action of Object.values(actions)) {
        if (action) {
          action.play();
        }
      }
    }
  }, [actions]);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name='Sketchfab_Scene'>
        <group name='Sketchfab_model' rotation={[-Math.PI / 2, 0, 0]}>
          <group name='50c85fbcdbeb4b29b9e0fe7c7a4f8e64fbx' rotation={[Math.PI / 2, 0, 0]}>
            <group name='Object_2'>
              <group name='RootNode'>
                <group name='Base' position={[-4.225, 1.754, 1.377]} rotation={[-Math.PI / 2, 0, 0]}>
                  <group name='Object_5' position={[30.896, 30.621, 29.898]}>
                    <mesh
                      name='Base_Robot_obj_Base_0'
                      castShadow
                      receiveShadow
                      geometry={(nodes.Base_Robot_obj_Base_0 as three.Mesh)?.geometry}
                      material={materials.Robot_obj_Base}
                    />
                  </group>
                  <group name='Shoulder' position={[0.39, -0.391, 17.089]}>
                    <group name='Object_8' position={[30.966, 30.614, 12.809]}>
                      <mesh
                        name='Shoulder_Robot_obj_Shoulder_0'
                        castShadow
                        receiveShadow
                        geometry={(nodes.Shoulder_Robot_obj_Shoulder_0 as three.Mesh)?.geometry}
                        material={cyberpunkMaterials.robotJoint}
                      />
                    </group>
                    <group name='UpperArm' position={[17.363, 0.581, 7.448]} rotation={[0, -0.016, 0]}>
                      <group name='Object_11' position={[13.602, 30.033, 5.361]}>
                        <mesh
                          name='UpperArm_Robot_obj_UpperArm_0'
                          castShadow
                          receiveShadow
                          geometry={(nodes.UpperArm_Robot_obj_UpperArm_0 as three.Mesh)?.geometry}
                          material={cyberpunkMaterials.robotBody}
                        />
                      </group>
                      <group name='ForeArm' position={[-0.316, 12.886, 48.232]} rotation={[0, 0.03, 0]}>
                        <group name='Object_14' position={[13.918, 17.147, -42.871]}>
                          <mesh
                            name='ForeArm_Robot_obj_ForeArm_0'
                            castShadow
                            receiveShadow
                            geometry={(nodes.ForeArm_Robot_obj_ForeArm_0 as three.Mesh)?.geometry}
                            material={cyberpunkMaterials.robotBody}
                          />
                        </group>
                        <group name='Hand' position={[41.145, -0.02, 8.614]}>
                          <group name='Object_17' position={[-27.227, 17.167, -51.485]}>
                            <mesh
                              name='Hand_Robot_obj_Hand_0'
                              castShadow
                              receiveShadow
                              geometry={(nodes.Hand_Robot_obj_Hand_0 as three.Mesh)?.geometry}
                              material={cyberpunkMaterials.robotBody}
                            />
                          </group>
                          <group name='Finger' position={[12.328, 4.238, -0.945]} rotation={[0, -0.014, 0]}>
                            <group name='Object_20' position={[-39.554, 12.929, -50.54]}>
                              <mesh
                                name='Finger_Robot_obj_Finger_0'
                                castShadow
                                receiveShadow
                                geometry={(nodes.Finger_Robot_obj_Finger_0 as three.Mesh)?.geometry}
                                material={cyberpunkMaterials.robotBody}
                              />
                            </group>

                            <mesh
                              name='Box001_09_-_Default_0'
                              position={[4.401, -3.916, -81.426]}
                              castShadow
                              receiveShadow
                              geometry={(nodes['Box001_09_-_Default_0'] as three.Mesh)?.geometry}
                              material={cyberpunkMaterials.purpleNeonBox}
                            />
                          </group>
                        </group>
                      </group>
                    </group>
                    <group name='Cylinder' position={[-6.648, -1.143, 6.552]}>
                      <group name='Object_27' position={[37.614, 31.756, 6.257]}>
                        <mesh
                          name='Cylinder_Robot_obj_Cylinder_0'
                          castShadow
                          receiveShadow
                          geometry={(nodes.Cylinder_Robot_obj_Cylinder_0 as three.Mesh)?.geometry}
                          material={materials.Robot_obj_Cylinder}
                        />
                      </group>
                    </group>
                  </group>
                </group>
                <group name='Circle001' position={[-4.225, -25.158, 1.377]} rotation={[-Math.PI / 2, 0, 0]}>
                  <mesh
                    name='Circle001_08_-_Default_0'
                    castShadow
                    receiveShadow
                    geometry={(nodes['Circle001_08_-_Default_0'] as three.Mesh)?.geometry}
                    material={cyberpunkMaterials.silverMetal}
                  />
                </group>
                <group
                  name='Circle002'
                  position={[-4.225, -27.126, 1.377]}
                  rotation={[-Math.PI / 2, 0, 0]}
                  scale={1.135}
                >
                  <mesh
                    name='Circle002_07_-_Default_0'
                    castShadow
                    receiveShadow
                    geometry={(nodes['Circle002_07_-_Default_0'] as three.Mesh)?.geometry}
                    material={materials.tech_pedestal_tech_pedestal_mat}
                  />
                </group>
                <group name='Circle003' position={[-4.225, -19.174, 1.377]} rotation={[-Math.PI / 2, 0, 0]}>
                  <mesh
                    name='Circle003_tech_pedestal_tech_pedestal_mat_0'
                    castShadow
                    receiveShadow
                    geometry={(nodes.Circle003_tech_pedestal_tech_pedestal_mat_0 as three.Mesh)?.geometry}
                    material={materials.tech_pedestal_tech_pedestal_mat}
                  />
                </group>
                <group name='Box002' position={[73.526, 0, 1.377]} rotation={[-Math.PI / 2, 0, 0]}>
                  <mesh
                    name='Box002_15_-_Default_0'
                    castShadow
                    receiveShadow
                    geometry={(nodes['Box002_15_-_Default_0'] as three.Mesh)?.geometry}
                    material={materials['15_-_Default']}
                  />
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload('/robot_arm_animation.glb');
