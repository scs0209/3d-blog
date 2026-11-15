'use client';

import { RoundedBox, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { type RefObject, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import * as three from 'three';
import { experiences } from '@/entities/portfolio/model/constants/experienceConstants';
import { portfolioProjects, skillSections } from '@/widgets/portfolio/consts';
import { BOARD, createRoutes, HALF_D, HALF_W, isFree, PARTS, type Route, seededRandom } from './layout';
import { createBoardTextures, createLabelTexture } from './textures';

const CPU_MODEL = '/portfolio/cpu.glb';

type BoardProps = {
  /** 포인트 색 (RGB 조명) */
  accent: string;
  /** 전원 인가 정도 0→1. 진입 시 조명이 순서대로 켜진다 */
  powerRef: RefObject<number>;
  still: boolean;
  /** 좁은 화면: 잔부품 수를 줄인다 */
  compact: boolean;
};

type Item = {
  p: [number, number, number];
  s: [number, number, number];
  /** y축 회전 */
  r?: number;
};

type InstancesProps = {
  items: Item[];
  geometry: three.BufferGeometry;
  material: three.Material;
  castShadow?: boolean;
};

/** 같은 모양의 부품 여러 개를 한 번에 그린다 */
const Instances = ({ items, geometry, material, castShadow = true }: InstancesProps) => {
  const mesh = useRef<three.InstancedMesh>(null);

  useLayoutEffect(() => {
    const target = mesh.current;
    if (!target) {
      return;
    }
    const dummy = new three.Object3D();
    items.forEach((item, index) => {
      dummy.position.set(...item.p);
      dummy.rotation.set(0, item.r ?? 0, 0);
      dummy.scale.set(...item.s);
      dummy.updateMatrix();
      target.setMatrixAt(index, dummy.matrix);
    });
    target.count = items.length;
    target.instanceMatrix.needsUpdate = true;
    target.computeBoundingSphere();
  }, [items]);

  return <instancedMesh ref={mesh} args={[geometry, material, items.length]} castShadow={castShadow} receiveShadow />;
};

/** 부품 윗면·옆면에 얹는 글씨 판 */
const Label = ({
  texture,
  size,
  position,
  rotation = [-Math.PI / 2, 0, 0],
  metalness = 0.4,
  roughness = 0.6,
}: {
  texture: three.Texture;
  size: [number, number];
  position: [number, number, number];
  rotation?: [number, number, number];
  metalness?: number;
  roughness?: number;
}) => (
  <mesh position={position} rotation={rotation} receiveShadow>
    <planeGeometry args={size} />
    <meshStandardMaterial
      map={texture}
      transparent
      depthWrite={false}
      metalness={metalness}
      roughness={roughness}
      polygonOffset
      polygonOffsetFactor={-2}
    />
  </mesh>
);

const useMaterials = (accent: string) =>
  useMemo(() => {
    const glow = new three.MeshBasicMaterial({ color: new three.Color(accent), toneMapped: false });
    return {
      edge: new three.MeshStandardMaterial({ color: '#0b0d0f', metalness: 0.3, roughness: 0.6 }),
      plastic: new three.MeshStandardMaterial({ color: '#0d0f12', metalness: 0.1, roughness: 0.42 }),
      chip: new three.MeshStandardMaterial({ color: '#0e1013', metalness: 0.25, roughness: 0.38 }),
      aluminium: new three.MeshStandardMaterial({ color: '#c9d0d6', metalness: 1, roughness: 0.27 }),
      darkMetal: new three.MeshPhysicalMaterial({
        color: '#181c21',
        metalness: 1,
        roughness: 0.32,
        clearcoat: 0.4,
        clearcoatRoughness: 0.35,
      }),
      gold: new three.MeshStandardMaterial({ color: '#d7ad55', metalness: 1, roughness: 0.28 }),
      ferrite: new three.MeshStandardMaterial({ color: '#2a2e33', metalness: 0.2, roughness: 0.85 }),
      smdDark: new three.MeshStandardMaterial({ color: '#15171a', metalness: 0.2, roughness: 0.5 }),
      smdLight: new three.MeshStandardMaterial({ color: '#a89f88', metalness: 0.3, roughness: 0.55 }),
      module: new three.MeshStandardMaterial({ color: '#0a120f', metalness: 0.2, roughness: 0.5 }),
      glow,
    };
  }, [accent]);

type Materials = ReturnType<typeof useMaterials>;

const useGeometries = () =>
  useMemo(
    () => ({
      box: new three.BoxGeometry(1, 1, 1),
      cylinder: new three.CylinderGeometry(0.5, 0.5, 1, 28),
    }),
    [],
  );

type Geometries = ReturnType<typeof useGeometries>;
type PartProps = { m: Materials; g: Geometries };

/** 기판: 두께가 있는 몸체와, 배선·실크스크린이 그려진 윗면 */
const Pcb = ({ routes, m }: { routes: Route[]; m: Materials }) => {
  const textures = useMemo(() => createBoardTextures(routes), [routes]);

  useEffect(() => {
    // 웹폰트가 도착한 뒤 한 번 더 그려 실크스크린 서체를 맞춘다
    let cancelled = false;
    void document.fonts.ready.then(() => {
      if (cancelled) {
        return;
      }
      const next = createBoardTextures(routes);
      textures.map.image = next.map.image;
      textures.map.needsUpdate = true;
      textures.roughnessMap.image = next.roughnessMap.image;
      textures.roughnessMap.needsUpdate = true;
    });
    return () => {
      cancelled = true;
    };
  }, [routes, textures]);

  return (
    <group>
      <RoundedBox
        args={[BOARD.width, BOARD.thickness, BOARD.depth]}
        radius={0.35}
        smoothness={3}
        position={[0, -BOARD.thickness / 2 - 0.01, 0]}
        material={m.edge}
        receiveShadow
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[BOARD.width - 0.7, BOARD.depth - 0.7]} />
        <meshStandardMaterial map={textures.map} roughnessMap={textures.roughnessMap} roughness={1} metalness={0.35} />
      </mesh>
    </group>
  );
};

/** CPU: Blender로 만든 패키지. 방열판에 이름이 각인돼 있다 */
const Cpu = ({ m }: { m: Materials }) => {
  const gltf = useGLTF(CPU_MODEL);
  const { x, z } = PARTS.cpu;

  const model = useMemo(() => {
    const cloned = gltf.scene.clone(true);
    const lid = new three.MeshPhysicalMaterial({
      color: '#cfd5db',
      metalness: 1,
      roughness: 0.3,
      clearcoat: 0.25,
      clearcoatRoughness: 0.4,
    });
    const etch = new three.MeshStandardMaterial({ color: '#4d545c', metalness: 0.7, roughness: 0.9 });
    const substrate = new three.MeshStandardMaterial({ color: '#0a1512', metalness: 0.2, roughness: 0.5 });
    const capBody = new three.MeshStandardMaterial({ color: '#33251b', metalness: 0.1, roughness: 0.6 });
    const byName = new Map<string, three.Material>([
      ['lid', lid],
      ['etch', etch],
      ['substrate', substrate],
      ['gold', m.gold],
      ['cap_body', capBody],
      ['cap_end', m.aluminium],
    ]);
    cloned.traverse((child) => {
      const mesh = child as three.Mesh;
      if (!mesh.isMesh) {
        return;
      }
      const name = (mesh.material as three.Material).name;
      mesh.material = byName.get(name) ?? mesh.material;
      mesh.castShadow = name !== 'etch';
      mesh.receiveShadow = true;
    });
    return cloned;
  }, [gltf.scene, m]);

  return (
    <group position={[x, 0, z]}>
      {/* 소켓 */}
      <RoundedBox
        args={[20, 0.7, 20]}
        radius={0.2}
        smoothness={3}
        position={[0, 0.35, 0]}
        material={m.plastic}
        castShadow
        receiveShadow
      />
      {/* 고정 브래킷 */}
      {[-9.7, 9.7].map((offset) => (
        <group key={offset}>
          <RoundedBox
            args={[21, 0.45, 1.3]}
            radius={0.12}
            position={[0, 0.93, offset]}
            material={m.aluminium}
            castShadow
          />
          <RoundedBox
            args={[1.3, 0.45, 21]}
            radius={0.12}
            position={[offset, 0.93, 0]}
            material={m.aluminium}
            castShadow
          />
        </group>
      ))}
      <RoundedBox args={[0.5, 0.5, 9]} radius={0.2} position={[11.2, 1.1, -3]} material={m.aluminium} castShadow />
      <primitive object={model} position={[0, 0.7, 0]} />
    </group>
  );
};

/** 핀이 촘촘히 선 방열판 */
const Heatsink = ({
  position,
  size,
  along,
  m,
  g,
}: PartProps & { position: [number, number]; size: [number, number, number]; along: 'x' | 'z' }) => {
  const [width, height, depth] = size;
  const fins = useMemo<Item[]>(() => {
    const length = along === 'z' ? depth : width;
    const count = Math.floor(length / 0.85);
    return Array.from({ length: count }, (_, index) => {
      const offset = -length / 2 + 0.45 + index * ((length - 0.9) / (count - 1));
      return along === 'z'
        ? { p: [0, 0.9 + (height - 0.9) / 2, offset], s: [width, height - 0.9, 0.3] }
        : { p: [offset, 0.9 + (height - 0.9) / 2, 0], s: [0.3, height - 0.9, depth] };
    });
  }, [along, depth, height, width]);

  const cover: [number, number, number] =
    along === 'z' ? [width + 0.5, 0.5, depth * 0.42] : [width * 0.42, 0.5, depth + 0.5];
  const strip: [number, number, number] = along === 'z' ? [0.22, 0.12, depth * 0.36] : [width * 0.36, 0.12, 0.22];

  return (
    <group position={[position[0], 0, position[1]]}>
      <RoundedBox
        args={[width, 0.9, depth]}
        radius={0.15}
        position={[0, 0.45, 0]}
        material={m.aluminium}
        castShadow
        receiveShadow
      />
      <Instances items={fins} geometry={g.box} material={m.aluminium} />
      <RoundedBox args={cover} radius={0.14} position={[0, height + 0.26, 0]} material={m.darkMetal} castShadow />
      <mesh
        position={[along === 'z' ? width * 0.28 : 0, height + 0.53, along === 'z' ? 0 : depth * 0.28]}
        material={m.glow}
        scale={strip}
        geometry={g.box}
      />
    </group>
  );
};

/** 램 5개 = 기술 5분류. 각 모듈 옆면에 분류 이름이 새겨져 있고 위쪽 조명 바가 켜진다 */
const Memory = ({ m, g }: PartProps) => {
  const { xs, z, length, height } = PARTS.ram;
  const labels = useMemo(
    () =>
      skillSections.slice(0, xs.length).map((section, index) =>
        createLabelTexture({
          width: 2048,
          height: 256,
          draw: (context, fonts) => {
            context.fillStyle = 'rgba(214,222,229,0.9)';
            context.textBaseline = 'middle';
            context.font = `600 120px ${fonts.display}`;
            context.fillText(section.title, 70, 138);
            context.font = `500 44px ${fonts.mono}`;
            context.textAlign = 'right';
            context.fillStyle = 'rgba(214,222,229,0.55)';
            context.fillText(`DIMM_${index + 1}  /  ${section.items.length} MODULES`, 1978, 142);
          },
        }),
      ),
    [xs.length],
  );

  useEffect(
    () => () => {
      for (const label of labels) {
        label.dispose();
      }
    },
    [labels],
  );

  return (
    <group>
      {xs.map((x, index) => (
        <group key={x} position={[x, 0, z]}>
          <RoundedBox
            args={[1.5, 1.1, length + 2.4]}
            radius={0.12}
            position={[0, 0.55, 0]}
            material={m.plastic}
            castShadow
            receiveShadow
          />
          {[-1, 1].map((end) => (
            <RoundedBox
              key={end}
              args={[1.7, 2, 0.9]}
              radius={0.12}
              position={[0, 1.2, end * (length / 2 + 1)]}
              material={m.plastic}
              castShadow
            />
          ))}
          <mesh
            position={[0, 1.1 + height / 2 - 0.2, 0]}
            scale={[0.22, height - 0.4, length - 0.6]}
            geometry={g.box}
            material={m.module}
          />
          <RoundedBox
            args={[0.92, height - 1, length]}
            radius={0.16}
            smoothness={3}
            position={[0, 1.6 + (height - 1) / 2, 0]}
            material={m.darkMetal}
            castShadow
            receiveShadow
          />
          <mesh
            position={[0, 1.6 + height - 1 + 0.16, 0]}
            scale={[0.42, 0.3, length - 1.2]}
            geometry={g.box}
            material={m.glow}
          />
          {labels[index] ? (
            <Label
              texture={labels[index]}
              size={[length - 2, (length - 2) / 8]}
              position={[0.475, 1.6 + (height - 1) / 2, 0]}
              rotation={[0, Math.PI / 2, 0]}
              metalness={0.8}
              roughness={0.5}
            />
          ) : null}
        </group>
      ))}
    </group>
  );
};

/** M.2 SSD 두 개 = 프로젝트. 스티커에 프로젝트 이름이 인쇄돼 있다 */
const Storage = ({ m, g }: PartProps) => {
  const stickers = useMemo(
    () =>
      portfolioProjects.slice(0, PARTS.ssd.length).map((project, index) =>
        createLabelTexture({
          width: 1280,
          height: 400,
          background: '#b9bfc5',
          draw: (context, fonts) => {
            context.fillStyle = '#0a0c0e';
            context.textBaseline = 'alphabetic';
            context.font = `700 96px ${fonts.display}`;
            context.fillText(project.title.toUpperCase(), 52, 150);
            context.font = `500 40px ${fonts.sans}`;
            context.fillStyle = '#3a4046';
            context.fillText(project.subtitle, 52, 220);
            context.font = `500 34px ${fonts.mono}`;
            context.fillText(`M2_${index + 1}   S/N AY-${String(project.id).padStart(4, '0')}   NVMe`, 52, 344);
            // 바코드
            let cursor = 880;
            for (let bar = 0; bar < 46; bar += 1) {
              const barWidth = 3 + ((bar * 7) % 9);
              context.fillRect(cursor, 280, barWidth, 78);
              cursor += barWidth + 4 + (bar % 3) * 2;
              if (cursor > 1220) {
                break;
              }
            }
          },
        }),
      ),
    [],
  );

  const fingers = useMemo<Item[]>(
    () => Array.from({ length: 22 }, (_, index) => ({ p: [-11.6, 1.09, -2.6 + index * 0.25], s: [0.7, 0.03, 0.14] })),
    [],
  );

  useEffect(
    () => () => {
      for (const sticker of stickers) {
        sticker.dispose();
      }
    },
    [stickers],
  );

  return (
    <group>
      {PARTS.ssd.map((slot, index) => (
        <group key={slot.z} position={[slot.x, 0, slot.z]}>
          <RoundedBox
            args={[2.2, 1.5, 7.2]}
            radius={0.12}
            position={[-12.6, 0.75, 0]}
            material={m.plastic}
            castShadow
            receiveShadow
          />
          <RoundedBox
            args={[24, 0.3, 5.6]}
            radius={0.08}
            position={[0, 0.92, 0]}
            material={m.module}
            castShadow
            receiveShadow
          />
          <Instances items={fingers} geometry={g.box} material={m.gold} castShadow={false} />
          <RoundedBox args={[3.8, 0.5, 3.8]} radius={0.08} position={[-7.6, 1.32, 0]} material={m.chip} castShadow />
          <RoundedBox args={[13.6, 0.42, 4.9]} radius={0.08} position={[2.6, 1.28, 0]} material={m.chip} castShadow />
          {stickers[index] ? (
            <Label
              texture={stickers[index]}
              size={[13, 4.06]}
              position={[2.6, 1.497, 0]}
              metalness={0}
              roughness={0.75}
            />
          ) : null}
          <mesh
            position={[11.3, 1.15, 0]}
            scale={[1.5, 0.3, 1.5]}
            geometry={g.cylinder}
            material={m.aluminium}
            castShadow
          />
          <mesh position={[11.3, 0.5, 0]} scale={[0.9, 1, 0.9]} geometry={g.cylinder} material={m.gold} />
        </group>
      ))}
    </group>
  );
};

/** 롬 칩 두 개 = 경력. 윗면에 회사·역할·기간이 각인돼 있다 */
const Roms = ({ m, g }: PartProps) => {
  const labels = useMemo(
    () =>
      experiences.slice(0, PARTS.rom.length).map((item) =>
        createLabelTexture({
          width: 1024,
          height: 1024,
          draw: (context, fonts) => {
            context.fillStyle = 'rgba(196,204,212,0.92)';
            context.textBaseline = 'alphabetic';
            context.font = `700 104px ${fonts.display}`;
            const words = item.company.split(' ');
            const lines = words.length > 2 ? [words.slice(0, 2).join(' '), words.slice(2).join(' ')] : [item.company];
            lines.forEach((line, index) => {
              context.fillText(line, 96, 330 + index * 112);
            });
            const below = 330 + lines.length * 112;
            context.fillRect(96, below - 56, 832, 4);
            context.font = `500 52px ${fonts.mono}`;
            context.fillStyle = 'rgba(196,204,212,0.75)';
            context.fillText(item.role, 96, below + 40);
            context.fillText(item.period.toUpperCase(), 96, below + 112);
            context.font = `500 40px ${fonts.mono}`;
            context.fillStyle = 'rgba(196,204,212,0.5)';
            context.fillText(item.id, 96, 900);
            // 1번 핀 표식
            context.beginPath();
            context.arc(128, 150, 26, 0, Math.PI * 2);
            context.fill();
          },
        }),
      ),
    [],
  );

  const legs = useMemo(
    () =>
      PARTS.rom.map(({ size }) => {
        const count = Math.round(size / 0.72);
        const items: Item[] = [];
        for (let side = 0; side < 4; side += 1) {
          for (let index = 0; index < count; index += 1) {
            const offset = -size / 2 + 0.6 + (index * (size - 1.2)) / (count - 1);
            const reach = size / 2 + 0.45;
            const angle = (side * Math.PI) / 2;
            items.push({
              p: [
                Math.cos(angle) * offset + Math.sin(angle) * reach,
                0.16,
                -Math.sin(angle) * offset + Math.cos(angle) * reach,
              ],
              s: [0.28, 0.3, 1],
              r: angle,
            });
          }
        }
        return items;
      }),
    [],
  );

  useEffect(
    () => () => {
      for (const label of labels) {
        label.dispose();
      }
    },
    [labels],
  );

  return (
    <group>
      {PARTS.rom.map((rom, index) => (
        <group key={rom.x} position={[rom.x, 0, rom.z]}>
          <Instances items={legs[index] ?? []} geometry={g.box} material={m.aluminium} castShadow={false} />
          <RoundedBox
            args={[rom.size, 1.15, rom.size]}
            radius={0.16}
            smoothness={3}
            position={[0, 0.78, 0]}
            material={m.chip}
            castShadow
            receiveShadow
          />
          {labels[index] ? (
            <Label
              texture={labels[index]}
              size={[rom.size * 0.92, rom.size * 0.92]}
              position={[0, 1.362, 0]}
              metalness={0.5}
              roughness={0.7}
            />
          ) : null}
        </group>
      ))}
    </group>
  );
};

const IO_LABELS = ['GITHUB', 'LINKEDIN', 'EMAIL'];

/** 뒤쪽 입출력부 = 연락. 덮개 위에 채널 이름이 있고, 그 아래로 포트가 나와 있다 */
const InputOutput = ({ m, g }: PartProps) => {
  const { xs, z } = PARTS.io;
  const cover = useMemo(
    () =>
      createLabelTexture({
        width: 2048,
        height: 512,
        draw: (context, fonts) => {
          context.textBaseline = 'middle';
          context.textAlign = 'center';
          IO_LABELS.forEach((label, index) => {
            const x = 2048 * ((index + 0.5) / 3);
            context.font = `500 44px ${fonts.mono}`;
            context.fillStyle = 'rgba(214,222,229,0.55)';
            context.fillText(`PORT_${index + 1}`, x, 150);
            context.font = `700 118px ${fonts.display}`;
            context.fillStyle = 'rgba(214,222,229,0.92)';
            context.fillText(label, x, 280);
          });
        },
      }),
    [],
  );

  useEffect(() => () => cover.dispose(), [cover]);

  const centre = ((xs[0] ?? 0) + (xs[xs.length - 1] ?? 0)) / 2;

  return (
    <group>
      <RoundedBox
        args={[40, 5.4, 8.6]}
        radius={0.5}
        smoothness={4}
        position={[centre, 3.3, z + 2.4]}
        material={m.darkMetal}
        castShadow
        receiveShadow
      />
      <Label
        texture={cover}
        size={[36, 9]}
        position={[centre, 6.01, z + 2.4]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
        metalness={0.9}
        roughness={0.5}
      />
      <mesh position={[centre, 0.75, z - 1.86]} scale={[38, 0.16, 0.16]} geometry={g.box} material={m.glow} />
      {xs.map((x) => (
        <group key={x} position={[x, 0, z]}>
          <RoundedBox
            args={[8.4, 3.3, 5.4]}
            radius={0.2}
            position={[0, 2.4, -1.4]}
            material={m.aluminium}
            castShadow
            receiveShadow
          />
          <mesh position={[0, 2.4, -4.12]} scale={[6.6, 1.7, 0.1]} geometry={g.box} material={m.plastic} />
          <mesh position={[0, 2.1, -4.14]} scale={[5.4, 0.5, 0.1]} geometry={g.box} material={m.gold} />
        </group>
      ))}
    </group>
  );
};

/** 칩셋 방열판. 윗면에 성능 수치가 각인돼 있다 */
const Chipset = ({ m, g }: PartProps) => {
  const { x, z, size } = PARTS.chipset;
  const label = useMemo(
    () =>
      createLabelTexture({
        width: 1024,
        height: 1024,
        draw: (context, fonts) => {
          context.fillStyle = 'rgba(214,222,229,0.9)';
          context.textBaseline = 'alphabetic';
          context.font = `700 210px ${fonts.display}`;
          context.fillText('52→80', 90, 560);
          context.font = `500 54px ${fonts.mono}`;
          context.fillStyle = 'rgba(214,222,229,0.6)';
          context.fillText('LIGHTHOUSE PERFORMANCE', 96, 660);
          context.fillText('3,000 × 255 ROWS VIRTUALIZED', 96, 736);
        },
      }),
    [],
  );

  useEffect(() => () => label.dispose(), [label]);

  return (
    <group position={[x, 0, z]}>
      <RoundedBox
        args={[size, 1.9, size]}
        radius={0.35}
        smoothness={4}
        position={[0, 0.95, 0]}
        material={m.darkMetal}
        castShadow
        receiveShadow
      />
      <Label texture={label} size={[size * 0.9, size * 0.9]} position={[0, 1.905, 0]} metalness={0.9} roughness={0.5} />
      <mesh position={[0, 1.93, size * 0.36]} scale={[size * 0.7, 0.1, 0.2]} geometry={g.box} material={m.glow} />
    </group>
  );
};

/** 나머지 부품: 방열판, 콘덴서, 인덕터, 슬롯, 커넥터, 그리고 기판 곳곳의 잔부품 */
const Components = ({ m, g, compact }: PartProps & { compact: boolean }) => {
  const parts = useMemo(() => {
    const random = seededRandom(612);
    const capacitors: Item[] = [];
    for (let index = 0; index < 11; index += 1) {
      capacitors.push({ p: [-19.6, 1.35, -17 + index * 2.15], s: [1.75, 2.7, 1.75] });
    }
    for (let index = 0; index < 9; index += 1) {
      capacitors.push({ p: [-14.6 + index * 2.15, 1.35, -19.6], s: [1.75, 2.7, 1.75] });
    }
    for (let index = 0; index < 4; index += 1) {
      capacitors.push({ p: [41 + (index % 2) * 2.4, 1.1, 8 + Math.floor(index / 2) * 2.6], s: [1.5, 2.2, 1.5] });
    }

    const inductors: Item[] = Array.from({ length: 7 }, (_, index) => ({
      p: [9, 1, -17 + index * 3.2],
      s: [2.3, 2, 2.3],
    }));

    const smdDark: Item[] = [];
    const smdLight: Item[] = [];
    const chips: Item[] = [];
    const total = compact ? 260 : 620;
    let guard = 0;
    while (smdDark.length + smdLight.length < total && guard < total * 20) {
      guard += 1;
      const x = Math.round((random() * 2 - 1) * (HALF_W - 3) * 2) / 2;
      const z = Math.round((random() * 2 - 1) * (HALF_D - 3) * 2) / 2;
      if (!isFree(x, z, 0.8)) {
        continue;
      }
      const turned = random() > 0.5 ? Math.PI / 2 : 0;
      if (random() > 0.45) {
        smdDark.push({ p: [x, 0.16, z], s: [0.95, 0.32, 0.5], r: turned });
      } else {
        smdLight.push({ p: [x, 0.17, z], s: [0.6, 0.34, 0.36], r: turned });
      }
    }
    guard = 0;
    while (chips.length < (compact ? 22 : 46) && guard < 2000) {
      guard += 1;
      const x = Math.round((random() * 2 - 1) * (HALF_W - 5));
      const z = Math.round((random() * 2 - 1) * (HALF_D - 5));
      if (!isFree(x, z, 2)) {
        continue;
      }
      const size = 1.4 + random() * 1.8;
      chips.push({ p: [x, 0.22, z], s: [size, 0.44, size * (random() > 0.5 ? 1 : 0.7)] });
    }

    const pins: Item[] = [];
    for (let index = 0; index < 30; index += 1) {
      for (let row = 0; row < 2; row += 1) {
        pins.push({ p: [-44 + index * 0.82, 1.05, 35.4 + row * 0.82], s: [0.16, 1.3, 0.16] });
      }
    }
    for (let index = 0; index < 12; index += 1) {
      for (let row = 0; row < 2; row += 1) {
        pins.push({ p: [28 + index * 0.82, 1.05, 35.9 + row * 0.82], s: [0.16, 1.3, 0.16] });
      }
    }

    const atxHoles: Item[] = [];
    for (let index = 0; index < 12; index += 1) {
      for (let row = 0; row < 2; row += 1) {
        atxHoles.push({ p: [43.4 + row * 1.5, 3.42, -17.6 + index * 1.45], s: [0.95, 0.06, 0.95] });
      }
    }

    const screws: Item[] = [
      [-45, -20],
      [45, -35],
      [45, 35],
      [-45, 35],
      [0, 35],
      [10, -35],
    ].map(([sx, sz]) => ({ p: [sx ?? 0, 0.14, sz ?? 0], s: [2.3, 0.28, 2.3] }));

    return { capacitors, inductors, smdDark, smdLight, chips, pins, atxHoles, screws };
  }, [compact]);

  return (
    <group>
      <Heatsink position={[-25.6, -6]} size={[5.6, 5, 25]} along='z' m={m} g={g} />
      <Heatsink position={[-5, -25.2]} size={[27, 5, 5.6]} along='x' m={m} g={g} />

      <Instances items={parts.capacitors} geometry={g.cylinder} material={m.aluminium} />
      <Instances items={parts.inductors} geometry={g.box} material={m.ferrite} />
      <Instances items={parts.smdDark} geometry={g.box} material={m.smdDark} castShadow={false} />
      <Instances items={parts.smdLight} geometry={g.box} material={m.smdLight} castShadow={false} />
      <Instances items={parts.chips} geometry={g.box} material={m.chip} />
      <Instances items={parts.pins} geometry={g.box} material={m.gold} castShadow={false} />
      <Instances items={parts.screws} geometry={g.cylinder} material={m.aluminium} castShadow={false} />

      {/* 핀 헤더 받침 */}
      <mesh position={[-32.1, 0.25, 35.8]} scale={[25, 0.5, 2]} geometry={g.box} material={m.plastic} />
      <mesh position={[32.5, 0.25, 36.3]} scale={[10.4, 0.5, 2]} geometry={g.box} material={m.plastic} />

      {/* PCIe 슬롯 */}
      {[6, 12].map((z) => (
        <group key={z} position={[-27, 0, z]}>
          <RoundedBox
            args={[35, 1.35, 1.5]}
            radius={0.12}
            position={[0, 0.68, 0]}
            material={m.plastic}
            castShadow
            receiveShadow
          />
          <mesh position={[0, 1.33, 0]} scale={[33, 0.08, 0.5]} geometry={g.box} material={m.gold} />
          <RoundedBox args={[1.6, 1.9, 2]} radius={0.14} position={[18, 0.95, 0]} material={m.plastic} castShadow />
        </group>
      ))}

      {/* 24핀 전원 커넥터 */}
      <RoundedBox
        args={[3.9, 3.4, 18.4]}
        radius={0.18}
        position={[44.15, 1.7, -9.6]}
        material={m.plastic}
        castShadow
        receiveShadow
      />
      <Instances items={parts.atxHoles} geometry={g.box} material={m.smdDark} castShadow={false} />

      {/* 코인 배터리 */}
      <mesh
        position={[-42.5, 0.5, 26]}
        scale={[5.2, 0.5, 5.2]}
        geometry={g.cylinder}
        material={m.aluminium}
        castShadow
        receiveShadow
      />
      <mesh position={[-42.5, 0.2, 26]} scale={[6, 0.4, 6]} geometry={g.cylinder} material={m.plastic} />
    </group>
  );
};

/** 배선을 따라 흐르는 신호 */
const Signals = ({
  routes,
  m,
  g,
  powerRef,
  still,
}: PartProps & { routes: Route[]; powerRef: RefObject<number>; still: boolean }) => {
  const mesh = useRef<three.InstancedMesh>(null);
  const paths = useMemo(() => {
    return routes
      .filter((_, index) => index % 3 === 0)
      .map((route, index) => {
        const points = route.map(([x, z]) => new three.Vector3(x, 0.06, z));
        const lengths = points.slice(1).map((point, segment) => point.distanceTo(points[segment] ?? point));
        const total = lengths.reduce((sum, length) => sum + length, 0);
        return { points, lengths, total, offset: (index * 7.3) % 23, speed: 7 + (index % 5) * 2.2 };
      });
  }, [routes]);
  const dummy = useMemo(() => new three.Object3D(), []);

  useFrame(({ clock }) => {
    const target = mesh.current;
    if (!target) {
      return;
    }
    const time = still ? 0 : clock.elapsedTime;
    const power = powerRef.current;
    paths.forEach((path, index) => {
      const cycle = path.total + 26;
      let distance = (time * path.speed + path.offset * 3) % cycle;
      let visible = power > 0.6 && distance <= path.total;
      if (visible) {
        visible = false;
        for (let segment = 0; segment < path.lengths.length; segment += 1) {
          const length = path.lengths[segment] ?? 0;
          const from = path.points[segment];
          const to = path.points[segment + 1];
          if (from && to && distance <= length) {
            dummy.position.lerpVectors(from, to, length ? distance / length : 0);
            dummy.rotation.set(0, Math.atan2(to.x - from.x, to.z - from.z), 0);
            visible = true;
            break;
          }
          distance -= length;
        }
      }
      dummy.scale.set(0.15, 0.05, visible ? 1.5 : 0.0001);
      dummy.updateMatrix();
      target.setMatrixAt(index, dummy.matrix);
    });
    target.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={mesh} args={[g.box, m.glow, paths.length]} frustumCulled={false} />;
};

/**
 * 메인보드 전체. 보드의 부품 하나하나가 포트폴리오의 한 부분이다.
 */
export const Board = ({ accent, powerRef, still, compact }: BoardProps) => {
  const m = useMaterials(accent);
  const g = useGeometries();
  const routes = useMemo(() => createRoutes(2026), []);

  // 전원이 들어오는 만큼 조명 부품이 밝아진다
  useFrame(({ clock }) => {
    const power = powerRef.current;
    const flicker = still || power >= 1 ? 1 : 0.75 + Math.sin(clock.elapsedTime * 40) * 0.25;
    m.glow.color.set(accent).multiplyScalar(power * flicker * 2.2);
  });

  useEffect(
    () => () => {
      for (const material of Object.values(m)) {
        material.dispose();
      }
    },
    [m],
  );

  return (
    <group>
      <Pcb routes={routes} m={m} />
      <Cpu m={m} />
      <Memory m={m} g={g} />
      <Storage m={m} g={g} />
      <Roms m={m} g={g} />
      <InputOutput m={m} g={g} />
      <Chipset m={m} g={g} />
      <Components m={m} g={g} compact={compact} />
      <Signals routes={routes} m={m} g={g} powerRef={powerRef} still={still} />
    </group>
  );
};

useGLTF.preload(CPU_MODEL);
