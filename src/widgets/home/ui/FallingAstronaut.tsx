import { useEffect, useRef } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import type * as three from 'three';

export function FallingAstronaut(props: any) {
  const group = useRef<three.Group>(null);
  const { nodes, materials, animations } = useGLTF('/Falling.glb');
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      const firstAction = actions[Object.keys(actions)[0]];
      if (firstAction) {
        firstAction.reset().fadeIn(0.5).play();
      }
    }
  }, [actions]);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name='Scene'>
        <group name='67359760e8bd414fac2378ecfb5ba5c5fbx' rotation={[-Math.PI, 0, 0]} scale={0.01}>
          <group name='RootNode1'>
            <group name='group1'>
              <group name='botas_nino'>
                <group name='pie_n_der' />
                <group name='pie_n_izq' />
              </group>
              <group name='broche_nino' />
              <group name='Casco_nino' />
            </group>
            <group name='left' position={[-100.1, 0, 0]}>
              <group name='Object_4' />
            </group>
            <group name='pasted__Lente_nino' />
            <group name='pasted__Traje_nino'>
              <group name='polySurface3' />
              <group name='polySurface4' />
            </group>
          </group>
        </group>
        <group name='Armature' rotation={[-Math.PI / 2 + Math.PI / 4, 0, 0]}>
          <skinnedMesh
            name='broche_nino_cremayera_t_0'
            geometry={nodes.broche_nino_cremayera_t_0?.geometry}
            material={materials.cremayera_t}
            skeleton={nodes.broche_nino_cremayera_t_0?.skeleton}
          />
          <skinnedMesh
            name='Casco_nino_casco_nino_m_0'
            geometry={nodes.Casco_nino_casco_nino_m_0.geometry}
            material={materials.casco_nino_m}
            skeleton={nodes.Casco_nino_casco_nino_m_0.skeleton}
          />
          <skinnedMesh
            name='pasted__Lente_nino_pasted__vidrio_astr_nina_0'
            geometry={nodes.pasted__Lente_nino_pasted__vidrio_astr_nina_0.geometry}
            material={materials.pasted__vidrio_astr_nina}
            skeleton={nodes.pasted__Lente_nino_pasted__vidrio_astr_nina_0.skeleton}
          />
          <skinnedMesh
            name='pie_n_der_botas_nino_m_0'
            geometry={nodes.pie_n_der_botas_nino_m_0.geometry}
            material={materials.botas_nino_m}
            skeleton={nodes.pie_n_der_botas_nino_m_0.skeleton}
          />
          <skinnedMesh
            name='pie_n_izq_botas_nino_m_0'
            geometry={nodes.pie_n_izq_botas_nino_m_0.geometry}
            material={materials.botas_nino_m}
            skeleton={nodes.pie_n_izq_botas_nino_m_0.skeleton}
          />
          <skinnedMesh
            name='polySurface3_pasted__logonino_0'
            geometry={nodes.polySurface3_pasted__logonino_0.geometry}
            material={materials.pasted__logonino}
            skeleton={nodes.polySurface3_pasted__logonino_0.skeleton}
          />
          <skinnedMesh
            name='polySurface3_pasted__trajechico_0'
            geometry={nodes.polySurface3_pasted__trajechico_0.geometry}
            material={materials.pasted__trajechico}
            skeleton={nodes.polySurface3_pasted__trajechico_0.skeleton}
          />
          <skinnedMesh
            name='polySurface4_pasted__trajechico_0'
            geometry={nodes.polySurface4_pasted__trajechico_0.geometry}
            material={materials.pasted__trajechico}
            skeleton={nodes.polySurface4_pasted__trajechico_0.skeleton}
          />
          <primitive object={nodes.mixamorigHips} />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload('/Falling.glb');
