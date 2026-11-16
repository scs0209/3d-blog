'use client';

import { Billboard } from '@react-three/drei';
import { type ThreeEvent, useFrame } from '@react-three/fiber';
import { type RefObject, Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import * as three from 'three';
import { experiences } from '@/entities/portfolio/model/constants/experienceConstants';
import { aboutMeData, portfolioProjects, skillSections } from '@/widgets/portfolio/consts';
import { Bits, Citizens, Player, type Spot } from './Citizens';
import { type City as CityData, createCity } from './city';
import {
  AVENUES,
  DIE_HALF,
  DISTRICTS,
  type District,
  type DistrictId,
  HUB,
  MONUMENT_OFFSET,
  PAD,
  panelSize,
  RACK,
  rackHeight,
  type ViewId,
} from './district';
import { seededRandom } from './layout';
import { createBeaconLabel, createPanel } from './panels';
import { createSilk, type SilkPen } from './silk';
import { createLabelTexture } from './textures';

type BoxItem = {
  position: [number, number, number];
  scale: [number, number, number];
  color?: three.Color;
};

const setCursor = (pointer: boolean) => {
  document.body.style.cursor = pointer ? 'pointer' : '';
};

/** 글꼴이 준비된 뒤 캔버스 글씨를 다시 그리기 위한 신호 */
const useFontsReady = () => {
  const [ready, setReady] = useState(0);
  useEffect(() => {
    let alive = true;
    document.fonts.ready.then(() => {
      if (alive) {
        setReady(1);
      }
    });
    return () => {
      alive = false;
    };
  }, []);
  return ready;
};

const FLAT: [number, number, number] = [-Math.PI / 2, 0, 0];
const UPRIGHT: [number, number, number] = [0, 0, 0];
const ignoreRaycast = () => null;

/**
 * 실크 인쇄 한 장. 보드에서 부품마다 이름이 찍혀 있던 것과 같은 표기를
 * 칩 안의 바닥과 구조물에 그대로 찍는다. 클릭은 통과시킨다.
 */
const Silk = ({
  id,
  size,
  position,
  rotation = FLAT,
  ppu = 32,
  fonts,
  draw,
}: {
  /** 내용이 바뀌면 다시 그리기 위한 열쇠 */
  id: string;
  size: [number, number];
  position: [number, number, number];
  rotation?: [number, number, number];
  ppu?: number;
  fonts: number;
  draw: (pen: SilkPen) => void;
}) => {
  // biome-ignore lint/correctness/useExhaustiveDependencies: 내용은 id로 구분하고, 글꼴이 준비되면 다시 그린다
  const texture = useMemo(() => createSilk(size[0], size[1], ppu, draw), [id, size[0], size[1], ppu, fonts]);
  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <mesh position={position} rotation={rotation} raycast={ignoreRaycast}>
      <planeGeometry args={size} />
      <meshBasicMaterial
        map={texture}
        color='#f1f4f7'
        transparent
        depthWrite={false}
        polygonOffset
        polygonOffsetFactor={-2}
      />
    </mesh>
  );
};

/** 지구 바닥의 실크: 부품 외곽선, 1번 핀 표시, 그리고 보드와 같은 방식의 이름 */
const DistrictSilk = ({ district, index, fonts }: { district: District; index: number; fonts: number }) => (
  <Silk
    id={district.id}
    size={[PAD.width, PAD.depth]}
    position={[district.x, 0.04, district.z + PAD.offset]}
    fonts={fonts}
    draw={(pen) => {
      pen.box(1, 1, 47, 43, 0.6);
      pen.dot(3.2, 3.2, 0.7);
      // 모서리 눈금
      for (let tick = 5; tick < 44; tick += 2) {
        pen.line(tick, 43, tick, 43.7, 0.5);
      }
      // 패널 앞 바닥에 크게 찍는 이름. 대로가 닿는 자리보다 안쪽에 둔다
      pen.text(`MEM_${district.code}  ${district.file}`, 3.1, 26.6, 1.7, { alpha: 0.7 });
      pen.text(district.label, 2.9, 31.2, 4.6, { maxWidth: 30 });
      pen.text(`U${index + 1}`, 45, 40.6, 1.7, { align: 'right', alpha: 0.7 });
    }}
  />
);

/** 중심 광장 바닥의 실크: 어느 대로가 어느 지구로 가는지 찍어 둔 길 안내 */
const HubSilk = ({ fonts, compact }: { fonts: number; compact: boolean }) => {
  // 좁은 화면에서는 한눈에 들어오도록 줄여 찍는다
  const scale = compact ? 0.55 : 1;
  const find = (id: DistrictId) => {
    const district = DISTRICTS.find((item) => item.id === id);
    return district ? `${district.code} ${district.label}` : '';
  };
  return (
    <group position={[HUB[0], 0, HUB[1] + 2 * scale]} scale={[scale, 1, scale]}>
      <Silk
        id='hub'
        size={[44, 20]}
        position={[0, 0.04, 0]}
        fonts={fonts}
        draw={(pen) => {
          // 광장은 (22, 8). 대로는 좌우와 아래로 뻗고, 위쪽은 코어로 이어진다
          pen.arrow(15.2, 2, 1.5, -Math.PI / 2);
          pen.text(find('about'), 17, 2, 1.9);
          pen.arrow(1.4, 4.9, 1.5, Math.PI);
          pen.text(find('experience'), 3.4, 4.9, 1.9);
          pen.arrow(42.6, 4.9, 1.5, 0);
          pen.text(find('projects'), 40.6, 4.9, 1.9, { align: 'right' });
          pen.arrow(18.4, 17.6, 1.5, Math.PI / 2);
          pen.text(find('skills'), 16.6, 17.6, 1.9, { align: 'right' });
          pen.arrow(25.6, 17.6, 1.5, Math.PI / 2);
          pen.text(find('contact'), 27.4, 17.6, 1.9);
          pen.text('BUS_HUB', 3.4, 11.4, 1.2, { alpha: 0.6 });
        }}
      />
    </group>
  );
};

/** 같은 상자를 수천 개 그린다 */
export const Boxes = ({
  items,
  material,
  shadows = true,
}: {
  items: BoxItem[];
  material: three.Material;
  shadows?: boolean;
}) => {
  const ref = useRef<three.InstancedMesh>(null);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) {
      return;
    }
    const dummy = new three.Object3D();
    items.forEach((item, index) => {
      dummy.position.set(...item.position);
      dummy.scale.set(...item.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
      if (item.color) {
        mesh.setColorAt(index, item.color);
      }
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) {
      mesh.instanceColor.needsUpdate = true;
    }
  }, [items]);

  return (
    <instancedMesh
      key={items.length}
      ref={ref}
      args={[undefined, undefined, items.length]}
      material={material}
      castShadow={shadows}
      receiveShadow={shadows}
      frustumCulled={false}
    >
      <boxGeometry />
    </instancedMesh>
  );
};

/**
 * 도시 블록의 재질. 상자 하나하나에 층 이음새, 윗면의 미세 격자,
 * 드문드문 불이 켜진 셀을 그려 넣어 밋밋한 상자로 보이지 않게 한다.
 */
const createBlockMaterial = (accent: string) => {
  const material = new three.MeshStandardMaterial({ color: '#ffffff', metalness: 0.72, roughness: 0.38 });
  const glow = new three.Color(accent);
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uAccent = { value: glow };
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vWorld;\nvarying vec3 vFace;')
      .replace(
        '#include <project_vertex>',
        `#include <project_vertex>
        vec4 worldPoint = vec4(transformed, 1.0);
        #ifdef USE_INSTANCING
          worldPoint = instanceMatrix * worldPoint;
        #endif
        vWorld = (modelMatrix * worldPoint).xyz;
        vFace = normal;`,
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
        uniform vec3 uAccent;
        varying vec3 vWorld;
        varying vec3 vFace;
        float cellHash(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }`,
      )
      .replace(
        '#include <color_fragment>',
        `#include <color_fragment>
        float sideFace = 1.0 - abs(vFace.y);
        float seam = smoothstep(0.4, 0.5, abs(fract(vWorld.y * 0.85) - 0.5));
        diffuseColor.rgb *= mix(1.0, 0.38, seam * sideFace);
        vec2 topGrid = abs(fract(vWorld.xz * 1.4) - 0.5);
        float topLine = smoothstep(0.42, 0.5, max(topGrid.x, topGrid.y));
        diffuseColor.rgb *= mix(1.0, 0.55, topLine * (1.0 - sideFace));`,
      )
      .replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>
        float along = abs(vFace.x) > 0.5 ? vWorld.z : vWorld.x;
        vec3 cell = vec3(floor(along * 1.1), floor(vWorld.y * 0.85), abs(vFace.x) > 0.5 ? 1.0 : 2.0);
        vec2 inCell = abs(vec2(fract(along * 1.1), fract(vWorld.y * 0.85)) - 0.5);
        float window = step(0.9, cellHash(cell)) * step(inCell.x, 0.3) * step(inCell.y, 0.22);
        totalEmissiveRadiance += uAccent * window * sideFace * 2.2;`,
      );
  };
  return material;
};

export const useMaterials = (accent: string) =>
  useMemo(() => {
    const glow = new three.Color(accent).multiplyScalar(1.9);
    return {
      block: createBlockMaterial(accent),
      tower: new three.MeshPhysicalMaterial({
        color: '#2a323b',
        metalness: 0.86,
        roughness: 0.26,
        clearcoat: 0.5,
        clearcoatRoughness: 0.3,
      }),
      frame: new three.MeshStandardMaterial({ color: '#0d1014', metalness: 0.8, roughness: 0.42 }),
      gold: new three.MeshPhysicalMaterial({ color: '#d8b05a', metalness: 1, roughness: 0.22 }),
      shell: new three.MeshStandardMaterial({ color: '#0a0c0f', metalness: 0.5, roughness: 0.7 }),
      glow: new three.MeshBasicMaterial({ color: glow, toneMapped: false }),
      trace: new three.MeshBasicMaterial({ color: new three.Color(accent).multiplyScalar(0.55), toneMapped: false }),
      beam: new three.MeshBasicMaterial({
        color: accent,
        transparent: true,
        opacity: 0.16,
        blending: three.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      }),
    };
  }, [accent]);

export type Materials = ReturnType<typeof useMaterials>;

/** 다이 표면: 미세 배선이 새겨진 반사 바닥 */
export const Floor = ({ fonts, onGround }: { fonts: number; onGround: (point: three.Vector3) => void }) => {
  // biome-ignore lint/correctness/useExhaustiveDependencies: 글꼴이 준비되면 글씨를 다시 그린다
  const map = useMemo(() => {
    const size = 2048;
    const unit = size / (DIE_HALF * 2);
    const random = seededRandom(91);
    return createLabelTexture({
      width: size,
      height: size,
      background: '#0c1014',
      draw: (c, family) => {
        // 셀 배열: 구획마다 다른 방향의 가는 줄
        for (let gx = 0; gx < 25; gx += 1) {
          for (let gz = 0; gz < 25; gz += 1) {
            const x = gx * 12 * unit;
            const z = gz * 12 * unit;
            const cell = 12 * unit;
            c.fillStyle = `rgba(255,255,255,${0.012 + random() * 0.03})`;
            c.fillRect(x + 3, z + 3, cell - 6, cell - 6);
            c.strokeStyle = `rgba(190,205,220,${0.05 + random() * 0.07})`;
            c.lineWidth = 1;
            const horizontal = random() > 0.5;
            const step = 3 + Math.floor(random() * 4);
            for (let offset = 6; offset < cell - 6; offset += step) {
              c.beginPath();
              if (horizontal) {
                c.moveTo(x + 6, z + offset);
                c.lineTo(x + cell - 6, z + offset);
              } else {
                c.moveTo(x + offset, z + 6);
                c.lineTo(x + offset, z + cell - 6);
              }
              c.stroke();
            }
          }
        }
        // 금 패드
        for (let index = 0; index < 700; index += 1) {
          c.fillStyle = `rgba(200,168,96,${0.25 + random() * 0.4})`;
          c.fillRect(random() * size, random() * size, 3, 3);
        }
        // 다이 가장자리 표기
        c.fillStyle = 'rgba(225,232,238,0.55)';
        c.font = `700 44px ${family.display}`;
        c.textBaseline = 'middle';
        c.fillText('AYAAN', 60, size - 70);
        c.font = `500 18px ${family.mono}`;
        c.fillText('DIE REV 2026.11  /  SEOUL KR', 250, size - 66);
      },
    });
  }, [fonts]);

  useEffect(() => () => map.dispose(), [map]);

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: 3D 메시이며, 같은 이동은 화면의 버튼과 키보드로도 할 수 있다
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
      onClick={(event) => {
        // 끌어서 시점을 돌린 것은 이동으로 치지 않는다
        if (event.delta < 6) {
          onGround(event.point);
        }
      }}
    >
      <planeGeometry args={[DIE_HALF * 2, DIE_HALF * 2]} />
      <meshStandardMaterial map={map} metalness={0.78} roughness={0.34} envMapIntensity={0.9} />
    </mesh>
  );
};

/** 회로 블록으로 이루어진 도시. 구획과 길은 실제 다이 사진의 배열을 따른다 */
export const City = ({ m, city }: { m: Materials; city: CityData }) => {
  const { blocks, caps } = useMemo(() => {
    const dark = new three.Color('#1d232a');
    const light = new three.Color('#48525e');
    const blockItems: BoxItem[] = city.blocks.map((block) => ({
      position: [block.x, block.height / 2, block.z],
      scale: [block.width, block.height, block.depth],
      color: dark.clone().lerp(light, block.tint),
    }));
    const capItems: BoxItem[] = city.blocks
      .filter((block) => block.cap !== 'none')
      .map((block) => ({
        position: [block.x, block.height + 0.07, block.z],
        scale: block.cap === 'x' ? [block.width * 0.72, 0.14, 0.2] : [0.2, 0.14, block.depth * 0.72],
      }));
    return { blocks: blockItems, caps: capItems };
  }, [city]);

  return (
    <>
      <Boxes items={blocks} material={m.block} />
      <Boxes items={caps} material={m.glow} shadows={false} />
    </>
  );
};

/** 대로: 바닥에 깔린 빛나는 배선과 그 위를 달리는 신호 */
export const Avenues = ({ m, still }: { m: Materials; still: boolean }) => {
  const pulses = useRef<three.InstancedMesh>(null);
  const dummy = useMemo(() => new three.Object3D(), []);

  const { lines, paths } = useMemo(() => {
    const items: BoxItem[] = [];
    const measured = AVENUES.map((avenue) => {
      const segments: { a: [number, number]; b: [number, number]; length: number }[] = [];
      for (let index = 0; index < avenue.length - 1; index += 1) {
        const a = avenue[index];
        const b = avenue[index + 1];
        if (!a || !b) {
          continue;
        }
        const length = Math.hypot(b[0] - a[0], b[1] - a[1]);
        segments.push({ a, b, length });
        const alongX = Math.abs(b[0] - a[0]) > Math.abs(b[1] - a[1]);
        for (const offset of [-1.4, 0, 1.4]) {
          items.push({
            position: [(a[0] + b[0]) / 2 + (alongX ? 0 : offset), 0.06, (a[1] + b[1]) / 2 + (alongX ? offset : 0)],
            scale: alongX ? [length + 2.8, 0.08, 0.22] : [0.22, 0.08, length + 2.8],
          });
        }
      }
      return { segments, total: segments.reduce((sum, segment) => sum + segment.length, 0) };
    });
    return { lines: items, paths: measured };
  }, []);

  // 가로등: 대로를 따라 양쪽에 선 작은 등
  const lamps = useMemo(() => {
    const poles: BoxItem[] = [];
    const bulbs: BoxItem[] = [];
    for (const avenue of AVENUES) {
      for (let index = 0; index < avenue.length - 1; index += 1) {
        const a = avenue[index];
        const b = avenue[index + 1];
        if (!a || !b) {
          continue;
        }
        const length = Math.hypot(b[0] - a[0], b[1] - a[1]);
        const alongX = Math.abs(b[0] - a[0]) > Math.abs(b[1] - a[1]);
        for (let travelled = 7; travelled < length - 4; travelled += 14) {
          const t = travelled / length;
          for (const side of [-3.4, 3.4]) {
            const x = a[0] + (b[0] - a[0]) * t + (alongX ? 0 : side);
            const z = a[1] + (b[1] - a[1]) * t + (alongX ? side : 0);
            // 패널 앞 진입로에는 세우지 않는다: 패널을 보는 시야를 가린다
            if (
              DISTRICTS.some((district) => Math.abs(x - district.x) < 14 && z > district.z - 4 && z < district.z + 84)
            ) {
              continue;
            }
            poles.push({ position: [x, 2.1, z], scale: [0.22, 4.2, 0.22] });
            bulbs.push({ position: [x, 4.5, z], scale: [0.7, 0.7, 0.7] });
          }
        }
      }
    }
    return { poles, bulbs };
  }, []);

  const perPath = 5;

  useFrame(({ clock }) => {
    const mesh = pulses.current;
    if (!mesh) {
      return;
    }
    const time = still ? 0 : clock.elapsedTime;
    paths.forEach((path, pathIndex) => {
      for (let index = 0; index < perPath; index += 1) {
        let travel = ((time * 26 + (index / perPath) * path.total + pathIndex * 17) % path.total) + 0;
        let placed = false;
        for (const segment of path.segments) {
          if (travel <= segment.length) {
            const t = segment.length === 0 ? 0 : travel / segment.length;
            const alongX = Math.abs(segment.b[0] - segment.a[0]) > Math.abs(segment.b[1] - segment.a[1]);
            dummy.position.set(
              segment.a[0] + (segment.b[0] - segment.a[0]) * t,
              0.16,
              segment.a[1] + (segment.b[1] - segment.a[1]) * t,
            );
            dummy.scale.set(alongX ? 5 : 0.5, 0.16, alongX ? 0.5 : 5);
            placed = true;
            break;
          }
          travel -= segment.length;
        }
        if (!placed) {
          dummy.scale.set(0, 0, 0);
        }
        dummy.updateMatrix();
        mesh.setMatrixAt(pathIndex * perPath + index, dummy.matrix);
      }
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <Boxes items={lines} material={m.trace} shadows={false} />
      <Boxes items={lamps.poles} material={m.frame} />
      <Boxes items={lamps.bulbs} material={m.glow} shadows={false} />
      <instancedMesh
        ref={pulses}
        args={[undefined, undefined, paths.length * perPath]}
        material={m.glow}
        frustumCulled={false}
      >
        <boxGeometry />
      </instancedMesh>
    </>
  );
};

/** 층 사이마다 빛이 새는 탑 */
const Tower = ({
  m,
  position,
  size,
  height,
  floors,
}: {
  m: Materials;
  position: [number, number, number];
  size: [number, number];
  height: number;
  floors: number;
}) => {
  const floor = height / floors;
  return (
    <group position={position}>
      {Array.from({ length: floors }, (_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: 층은 순서가 곧 정체다
        <group key={index} position={[0, floor * index, 0]}>
          <mesh position={[0, floor / 2, 0]} material={m.tower} castShadow receiveShadow>
            <boxGeometry args={[size[0], floor - 0.3, size[1]]} />
          </mesh>
          <mesh position={[0, floor - 0.15, 0]} material={m.glow}>
            <boxGeometry args={[size[0] - 0.5, 0.14, size[1] - 0.5]} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

/** 지구마다 패널 뒤에 서는 기념물. 멀리서도 어느 지구인지 형태로 구분된다 */
const Monument = ({
  district,
  m,
  still,
  fonts,
}: {
  district: District;
  m: Materials;
  still: boolean;
  fonts: number;
}) => {
  const core = useRef<three.Mesh>(null);

  useFrame(({ clock }) => {
    if (core.current && !still) {
      core.current.rotation.y = clock.elapsedTime * 0.35;
      core.current.position.y = 47 + Math.sin(clock.elapsedTime * 0.8) * 0.6;
    }
  });

  const origin: [number, number, number] = [district.x, 0, district.z + MONUMENT_OFFSET];

  if (district.id === 'about') {
    // 코어: 위로 갈수록 좁아지는 층탑과 그 위에 떠 있는 금빛 핵
    return (
      <group position={origin}>
        {Array.from({ length: 6 }, (_, index) => {
          const side = 28 - index * 4;
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: 층은 순서가 곧 정체다
            <group key={index} position={[0, index * 6.4, 0]}>
              <mesh position={[0, 3.1, 0]} material={m.tower} castShadow receiveShadow>
                <boxGeometry args={[side, 6.1, side]} />
              </mesh>
              <mesh position={[0, 6.25, 0]} material={m.glow}>
                <boxGeometry args={[side - 1.2, 0.16, side - 1.2]} />
              </mesh>
            </group>
          );
        })}
        <mesh ref={core} position={[0, 47, 0]} rotation={[0.6, 0, 0.6]} material={m.gold} castShadow>
          <boxGeometry args={[5, 5, 5]} />
        </mesh>
        <Silk
          id='core'
          size={[10.4, 4.4]}
          position={[0, 28.65, 6.04]}
          rotation={UPRIGHT}
          fonts={fonts}
          draw={(pen) => {
            pen.text('U1  CORE', 0.5, 1.05, 0.95, { alpha: 0.6 });
            pen.text(aboutMeData.name, 0.4, 2.9, 2.3, { font: 'display', maxWidth: 9.6 });
          }}
        />
      </group>
    );
  }

  if (district.id === 'experience') {
    // 경력: 두 개의 탑. 지금 일하는 곳이 더 높다
    return (
      <group position={origin}>
        <Tower m={m} position={[-9, 0, 0]} size={[13, 13]} height={40} floors={8} />
        <Tower m={m} position={[9, 0, 2]} size={[11, 11]} height={20} floors={4} />
        {/* 탑마다 회사 이름: 앞면과 지붕(위에서 내려다볼 때)에 찍는다 */}
        {(
          [
            { x: -9, z: 0, side: 13, height: 40, floor: 5 },
            { x: 9, z: 2, side: 11, height: 20, floor: 5 },
          ] as const
        ).map((tower, index) => {
          const item = experiences[index];
          if (!item) {
            return null;
          }
          const wide = tower.side - 1.6;
          const draw = (pen: SilkPen) => {
            pen.text(`IC${index + 1}  ${item.period}`, 0.3, 0.9, 0.8, { alpha: 0.6, maxWidth: wide - 0.6 });
            pen.text(item.company, 0.3, 2.4, 1.5, { maxWidth: wide - 0.6 });
          };
          return (
            <group key={item.company}>
              <Silk
                id={`${item.company}-front`}
                size={[wide, 3.4]}
                position={[tower.x, tower.height - tower.floor / 2 - 0.15, tower.z + tower.side / 2 + 0.04]}
                rotation={UPRIGHT}
                ppu={48}
                fonts={fonts}
                draw={draw}
              />
              <Silk
                id={`${item.company}-roof`}
                size={[wide, 3.4]}
                position={[tower.x, tower.height + 0.02, tower.z + tower.side / 2 - 2.6]}
                ppu={48}
                fonts={fonts}
                draw={draw}
              />
            </group>
          );
        })}
      </group>
    );
  }

  if (district.id === 'projects') {
    // 프로젝트: 세워 놓은 저장 장치 두 장
    return (
      <group position={origin}>
        {[-9, 9].map((x, index) => (
          <group key={x} position={[x, 0, index * 2]} rotation={[0, index === 0 ? 0.12 : -0.12, 0]}>
            <mesh position={[0, 19, 0]} material={m.tower} castShadow receiveShadow>
              <boxGeometry args={[14, 38, 2.2]} />
            </mesh>
            <mesh position={[0, 19, 1.16]} material={m.glow}>
              <boxGeometry args={[10.5, 0.16, 0.1]} />
            </mesh>
            <mesh position={[0, 31, 1.16]} material={m.glow}>
              <boxGeometry args={[10.5, 0.16, 0.1]} />
            </mesh>
            <mesh position={[0, 0.6, 0]} material={m.gold}>
              <boxGeometry args={[14.6, 1.2, 3]} />
            </mesh>
            <Silk
              id={`m2-${index}`}
              size={[11.4, 4.6]}
              position={[0, 25, 1.14]}
              rotation={UPRIGHT}
              ppu={48}
              fonts={fonts}
              draw={(pen) => {
                pen.text(`M2_${index + 1}`, 0.3, 1.1, 1, { alpha: 0.6 });
                pen.text(portfolioProjects[index]?.title ?? '', 0.3, 3.1, 1.7, { maxWidth: 10.8 });
              }}
            />
          </group>
        ))}
      </group>
    );
  }

  if (district.id === 'skills') {
    // 기술: 나란히 꽂힌 메모리 다섯 장
    return (
      <group position={origin}>
        {[0, 1, 2, 3, 4].map((index) => {
          const tall = 26 + ((index * 7) % 5) * 3;
          return (
            <group key={index} position={[(index - 2) * 6.4, 0, 0]}>
              <mesh position={[0, tall / 2, 0]} material={m.tower} castShadow receiveShadow>
                <boxGeometry args={[2.4, tall, 16]} />
              </mesh>
              <mesh position={[0, tall + 0.1, 0]} material={m.glow}>
                <boxGeometry args={[1.5, 0.18, 15]} />
              </mesh>
              {/* 메모리 스티커처럼 세로로 찍은 이름 */}
              <Silk
                id={`dimm-${index}`}
                size={[2.1, 15]}
                position={[0, tall - 8.2, 8.04]}
                rotation={UPRIGHT}
                ppu={48}
                fonts={fonts}
                draw={(pen) => {
                  pen.text(`DIMM_${index + 1}`, 0.55, 14.6, 0.72, { alpha: 0.6, rotate: -Math.PI / 2 });
                  pen.text(skillSections[index]?.title ?? '', 1.4, 14.6, 1.05, {
                    rotate: -Math.PI / 2,
                    maxWidth: 14,
                  });
                }}
              />
            </group>
          );
        })}
      </group>
    );
  }

  // 연락: 송신탑과 고리
  return (
    <group position={origin}>
      <mesh position={[0, 24, 0]} material={m.tower} castShadow>
        <cylinderGeometry args={[0.7, 1.6, 48, 20]} />
      </mesh>
      {[20, 30, 40].map((y, index) => (
        <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]} material={m.glow}>
          <torusGeometry args={[9 - index * 2.4, 0.16, 10, 72]} />
        </mesh>
      ))}
      <mesh position={[0, 49, 0]} material={m.gold}>
        <sphereGeometry args={[1.5, 24, 16]} />
      </mesh>
      {[-10, 0, 10].map((x, index) => (
        <group key={x} position={[x, 0, 6]}>
          <mesh position={[0, 2.5, 0]} material={m.tower} castShadow receiveShadow>
            <boxGeometry args={[7, 5, 7]} />
          </mesh>
          {/* 단자마다 연결되는 곳의 이름 */}
          <Silk
            id={`port-${index}`}
            size={[6.2, 6.2]}
            position={[0, 5.03, 0]}
            ppu={48}
            fonts={fonts}
            draw={(pen) => {
              pen.box(0.3, 0.3, 5.9, 5.9, 0.4);
              pen.text(`J${index + 1}`, 0.8, 1.4, 0.85, { alpha: 0.6 });
              pen.text((aboutMeData.socials[index]?.type ?? '').toUpperCase(), 0.8, 4.2, 1.15, { maxWidth: 4.6 });
            }}
          />
        </group>
      ))}
    </group>
  );
};

type PanelProps = {
  district: District;
  m: Materials;
  accent: string;
  portrait: boolean;
  focused: boolean;
  /** 내 캐릭터가 이 지구의 사각형 안에 들어와 있는가 (들어오면 저절로 뽑혀 올라온다) */
  pulled: boolean;
  fonts: number;
  still: boolean;
  onSelect: (id: ViewId) => void;
};

/** 랙 기둥에 달린 상태등의 줄 번호 */
const LED_ROWS = [0, 1, 2, 3, 4, 5, 6];
const smoothstep = (from: number, to: number, value: number) => {
  const t = Math.min(1, Math.max(0, (value - from) / (to - from)));
  return t * t * (3 - 2 * t);
};

/**
 * 지구의 내용 패널. 평소에는 작은 카트리지로 서버 랙 안에 꽂혀 있고 랙의 문은 닫혀 있다.
 * 그 지구를 열면 문이 열리고, 카트리지가 랙에서 꺼내져 앞의 거치대에 놓이며 패널로 펼쳐진다.
 * 글과 링크는 3D 표면에 그대로 놓인다.
 */
const Panel = ({ district, m, accent, portrait, focused, pulled, fonts, still, onSelect }: PanelProps) => {
  const size = panelSize(portrait);
  const bottom = size.centre - size.height / 2;
  const height = rackHeight(portrait);
  /** 랙 중심의, 지구 중심에서 본 z */
  const rackZ = RACK.front - RACK.depth / 2;
  /** 랙 안에 있을 때의 크기 비율: 선반에 들어갈 만큼 작다 */
  const stowedScale = (RACK.width - 3) / (size.width + 1.4);
  const body = useRef<three.Group>(null);
  const latch = useRef<three.Mesh>(null);
  const doorLeft = useRef<three.Group>(null);
  const doorRight = useRef<three.Group>(null);
  const screen = useRef<three.MeshBasicMaterial>(null);
  const leds = useRef<three.Group>(null);
  const out = focused || pulled;
  const motion = useRef({ value: out ? 1 : 0, velocity: 0, delay: 0, target: out ? 1 : 0 });
  const glass = useMemo(
    () =>
      new three.MeshStandardMaterial({
        color: '#0b1016',
        transparent: true,
        opacity: 0.42,
        metalness: 0.7,
        roughness: 0.18,
      }),
    [],
  );
  useEffect(() => () => glass.dispose(), [glass]);

  useFrame(({ clock }, rawDelta) => {
    const state = motion.current;
    const target = out ? 1 : 0;
    if (target !== state.target) {
      state.target = target;
      // 꺼낼 때는 뜸을 들인다: 캐릭터가 힘을 주는 순간에 맞춘다
      state.delay = target === 1 ? 0.2 : 0;
    }
    const delta = Math.min(rawDelta, 0.05);
    if (still) {
      state.value = target;
      state.velocity = 0;
    } else if (state.delay > 0) {
      state.delay -= delta;
    } else {
      // 스프링: 꺼낼 때는 거치대에서 살짝 튕기고, 넣을 때는 빠르게 돌아간다
      const stiffness = target === 1 ? 34 : 60;
      const damping = target === 1 ? 8.2 : 15;
      state.velocity += ((target - state.value) * stiffness - state.velocity * damping) * delta;
      state.value += state.velocity * delta;
    }
    // 문이 먼저 열리고, 그다음 카트리지가 나온다. 닫을 때는 그 반대
    const swing = smoothstep(0, 0.34, state.value) * 1.85;
    if (doorLeft.current) {
      doorLeft.current.rotation.y = -swing;
    }
    if (doorRight.current) {
      doorRight.current.rotation.y = swing;
    }
    const travel = smoothstep(0.22, 1, state.value) + Math.max(0, state.value - 1);
    if (body.current) {
      const scale = stowedScale + (1 - stowedScale) * travel;
      body.current.scale.setScalar(scale);
      // 선반에서 앞으로 빠져나온 뒤, 포물선을 그리며 거치대로 날아가 펼쳐진다
      const leave = smoothstep(0.22, 0.42, state.value);
      body.current.position.set(
        0,
        RACK.shelf + (size.centre - RACK.shelf) * travel + Math.sin(Math.PI * Math.min(1, travel)) * 5,
        (rackZ + leave * (RACK.depth / 2 + 1)) * (1 - travel),
      );
    }
    if (screen.current) {
      // 랙 안에서는 화면이 꺼져 있고, 꺼내서 펼쳐지며 켜진다
      screen.current.color.setScalar(0.05 + 0.95 * smoothstep(0.35, 0.95, state.value));
    }
    if (latch.current) {
      // 움직이는 동안 거치대의 빛이 밝아진다
      const busy = Math.min(1, Math.abs(state.velocity) * 0.6);
      latch.current.scale.y = 1 + busy * 5;
    }
    if (leds.current && !still) {
      leds.current.children.forEach((led, index) => {
        led.visible = Math.sin(clock.elapsedTime * (2.1 + (index % 5) * 0.7) + index * 1.9) > -0.35;
      });
    }
  });
  const [hovered, setHovered] = useState<number | null>(null);
  // biome-ignore lint/correctness/useExhaustiveDependencies: 글꼴이 준비되면 글씨를 다시 그린다
  const art = useMemo(() => createPanel(district.id, portrait, accent), [district.id, portrait, accent, fonts]);

  useEffect(() => () => art.texture.dispose(), [art]);
  useEffect(() => () => setCursor(false), []);

  const handleSelect = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (!focused) {
      onSelect(district.id);
    }
  };

  return (
    <group position={[district.x, 0, district.z]}>
      {/* 거치대: 꺼낸 카트리지가 놓이는 받침과 양옆의 기둥 */}
      <mesh position={[0, 0.7, -0.6]} material={m.frame} castShadow receiveShadow>
        <boxGeometry args={[size.width + 4.4, 1.4, 3.4]} />
      </mesh>
      <mesh position={[0, 1.42, -0.6]} material={m.gold}>
        <boxGeometry args={[size.width + 1.8, 0.06, 1.5]} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          position={[side * (size.width / 2 + 1.5), (bottom + 3) / 2, -0.6]}
          material={m.frame}
          castShadow
        >
          <boxGeometry args={[1.2, bottom + 3, 1.8]} />
        </mesh>
      ))}
      <mesh ref={latch} position={[0, 0.72, 1.12]} material={m.glow}>
        <boxGeometry args={[size.width + 3.2, 0.12, 0.08]} />
      </mesh>
      <mesh position={[0, 0.1, 5]} material={m.glow}>
        <boxGeometry args={[size.width, 0.1, 0.24]} />
      </mesh>

      {/* 서버 랙: 거치대 바로 뒤 한가운데에 선 캐비닛 */}
      <group position={[0, 0, rackZ]}>
        <mesh position={[0, height / 2, -RACK.depth / 2 + 0.2]} material={m.frame} castShadow receiveShadow>
          <boxGeometry args={[RACK.width, height, 0.4]} />
        </mesh>
        {[-1, 1].map((side) => (
          <mesh
            key={side}
            position={[side * (RACK.width / 2 - 0.3), height / 2, 0]}
            material={m.frame}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[0.6, height, RACK.depth]} />
          </mesh>
        ))}
        <mesh position={[0, height - 0.4, 0]} material={m.frame} castShadow>
          <boxGeometry args={[RACK.width, 0.8, RACK.depth]} />
        </mesh>
        <mesh position={[0, 0.5, 0]} material={m.frame} receiveShadow>
          <boxGeometry args={[RACK.width, 1, RACK.depth]} />
        </mesh>
        <mesh position={[0, height + 0.06, RACK.depth / 2 - 0.4]} material={m.glow}>
          <boxGeometry args={[RACK.width - 1, 0.12, 0.3]} />
        </mesh>
        {/* 안에 층층이 꽂힌 다른 유닛들. 카트리지가 있는 선반만 비어 있다 */}
        <group ref={leds}>
          {LED_ROWS.flatMap((row) => {
            const y = 2.4 + (row / (LED_ROWS.length - 1)) * (height - 5.2);
            if (Math.abs(y - RACK.shelf) < 2.6) {
              return [];
            }
            return [-1, 1].map((side) => (
              <mesh key={`${row}:${side}`} position={[side * 3.6, y + 0.5, RACK.depth / 2 - 0.9]} material={m.glow}>
                <boxGeometry args={[0.9, 0.22, 0.1]} />
              </mesh>
            ));
          })}
        </group>
        {LED_ROWS.map((row) => {
          const y = 2.4 + (row / (LED_ROWS.length - 1)) * (height - 5.2);
          return Math.abs(y - RACK.shelf) < 2.6 ? null : (
            <mesh key={row} position={[0, y, -0.4]} material={m.frame} castShadow>
              <boxGeometry args={[RACK.width - 1.6, 2.2, RACK.depth - 1.4]} />
            </mesh>
          );
        })}
        <mesh position={[0, RACK.shelf - 2.2, 0]} material={m.gold}>
          <boxGeometry args={[RACK.width - 1.6, 0.12, RACK.depth - 1]} />
        </mesh>
        {/* 문: 양쪽으로 열리는 유리문 */}
        {[
          { side: -1, ref: doorLeft },
          { side: 1, ref: doorRight },
        ].map(({ side, ref }) => (
          <group key={side} ref={ref} position={[side * (RACK.width / 2), 0, RACK.depth / 2 + 0.1]}>
            <group position={[-side * (RACK.width / 4), height / 2 + 0.3, 0]}>
              <mesh material={glass}>
                <boxGeometry args={[RACK.width / 2 - 0.5, height - 1.8, 0.12]} />
              </mesh>
              {[-1, 1].map((edge) => (
                <mesh key={edge} position={[0, (edge * (height - 1.2)) / 2, 0]} material={m.frame} castShadow>
                  <boxGeometry args={[RACK.width / 2, 0.6, 0.3]} />
                </mesh>
              ))}
              {[-1, 1].map((edge) => (
                <mesh key={edge} position={[(edge * (RACK.width / 2 - 0.3)) / 2, 0, 0]} material={m.frame} castShadow>
                  <boxGeometry args={[0.3, height - 0.6, 0.3]} />
                </mesh>
              ))}
              {/* 손잡이: 가운데 쪽 가장자리 */}
              <mesh position={[-side * (RACK.width / 4 - 0.9), -height / 2 + 6, 0.3]} material={m.gold}>
                <boxGeometry args={[0.28, 3.4, 0.4]} />
              </mesh>
            </group>
          </group>
        ))}
      </group>

      {/* 랙에서 꺼내져 펼쳐지는 카드 */}
      <group ref={body}>
        <mesh position={[0, 0, -0.6]} material={m.frame} castShadow receiveShadow>
          <boxGeometry args={[size.width + 1.4, size.height + 1.4, 1]} />
        </mesh>
        <mesh position={[0, size.height / 2 + 0.8, -0.3]} material={m.glow}>
          <boxGeometry args={[size.width + 1.4, 0.14, 0.3]} />
        </mesh>

        {/* 내용 */}
        {/* biome-ignore lint/a11y/noStaticElementInteractions: 3D 메시이며, 같은 이동은 화면의 버튼과 키보드로도 할 수 있다 */}
        <mesh
          position={[0, 0, 0]}
          onClick={handleSelect}
          onPointerOver={() => !focused && setCursor(true)}
          onPointerOut={() => setCursor(false)}
        >
          <planeGeometry args={[size.width, size.height]} />
          <meshBasicMaterial ref={screen} map={art.texture} toneMapped={false} />
        </mesh>

        {/* 링크: 이 지구를 보고 있을 때만 누를 수 있다 */}
        {focused
          ? art.hits.map((hit, index) => (
              // biome-ignore lint/a11y/noStaticElementInteractions: 3D 메시이며, 같은 이동은 화면의 버튼과 키보드로도 할 수 있다
              <mesh
                key={hit.url}
                position={[
                  ((hit.x + hit.w / 2) / art.width - 0.5) * size.width,
                  (0.5 - (hit.y + hit.h / 2) / art.height) * size.height,
                  0.05,
                ]}
                onClick={(event) => {
                  event.stopPropagation();
                  // 메일 주소는 같은 창에서 메일 앱으로 넘기고, 나머지는 새 탭으로 연다
                  if (hit.url.startsWith('mailto:')) {
                    window.open(hit.url, '_self');
                  } else {
                    window.open(hit.url, '_blank', 'noopener,noreferrer');
                  }
                }}
                onPointerOver={(event) => {
                  event.stopPropagation();
                  setHovered(index);
                  setCursor(true);
                }}
                onPointerOut={() => {
                  setHovered(null);
                  setCursor(false);
                }}
              >
                <planeGeometry args={[(hit.w / art.width) * size.width, (hit.h / art.height) * size.height]} />
                <meshBasicMaterial
                  color={accent}
                  transparent
                  opacity={hovered === index ? 0.16 : 0}
                  depthWrite={false}
                  toneMapped={false}
                />
              </mesh>
            ))
          : null}
      </group>
    </group>
  );
};

/** 지구 위로 솟는 빛기둥과 이름표. 멀리서 어디로 갈지 알려 준다 */
const Beacon = ({
  district,
  m,
  accent,
  hidden,
  fonts,
  onSelect,
}: Omit<PanelProps, 'portrait' | 'focused' | 'pulled' | 'still'> & { hidden: boolean }) => {
  // biome-ignore lint/correctness/useExhaustiveDependencies: 글꼴이 준비되면 글씨를 다시 그린다
  const label = useMemo(
    () => createBeaconLabel(district.code, district.label, accent),
    [district.code, district.label, accent, fonts],
  );
  useEffect(() => () => label.dispose(), [label]);

  return (
    <group position={[district.x, 0, district.z + MONUMENT_OFFSET]}>
      <mesh position={[0, 90, 0]} material={m.beam}>
        <cylinderGeometry args={[0.9, 0.9, 180, 16, 1, true]} />
      </mesh>
      <Billboard position={[0, 58, 0]} visible={!hidden}>
        {/* biome-ignore lint/a11y/noStaticElementInteractions: 3D 메시이며, 같은 이동은 화면의 버튼과 키보드로도 할 수 있다 */}
        <mesh
          onClick={(event) => {
            event.stopPropagation();
            onSelect(district.id);
          }}
          onPointerOver={() => setCursor(true)}
          onPointerOut={() => setCursor(false)}
        >
          <planeGeometry args={[28, 6]} />
          <meshBasicMaterial map={label} transparent depthWrite={false} toneMapped={false} />
        </mesh>
      </Billboard>
    </group>
  );
};

/** 다이 가장자리에서 패키지로 뻗는 금 본딩 와이어 */
export const BondWires = ({ m }: { m: Materials }) => {
  const ref = useRef<three.InstancedMesh>(null);
  const geometry = useMemo(() => {
    const curve = new three.QuadraticBezierCurve3(
      new three.Vector3(0, 0.6, 0),
      new three.Vector3(10, 58, 0),
      new three.Vector3(46, 64, 0),
    );
    return new three.TubeGeometry(curve, 28, 0.42, 8);
  }, []);
  const count = 4 * 15;

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) {
      return;
    }
    const dummy = new three.Object3D();
    let index = 0;
    for (let side = 0; side < 4; side += 1) {
      for (let step = 0; step < 15; step += 1) {
        const along = (step - 7) * 18;
        const edge = DIE_HALF - 5;
        const positions: [number, number][] = [
          [edge, along],
          [along, edge],
          [-edge, along],
          [along, -edge],
        ];
        const place = positions[side] ?? [0, 0];
        dummy.position.set(place[0], 0, place[1]);
        dummy.rotation.set(0, -side * (Math.PI / 2), 0);
        // 앞쪽(카메라 쪽) 와이어는 시야를 가로지르므로 세우지 않는다
        const scale = side === 1 ? 0 : 1;
        dummy.scale.set(scale, scale, scale);
        dummy.updateMatrix();
        mesh.setMatrixAt(index, dummy.matrix);
        index += 1;
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, []);

  useEffect(() => () => geometry.dispose(), [geometry]);

  return <instancedMesh ref={ref} args={[geometry, m.gold, count]} frustumCulled={false} castShadow />;
};

/** 패키지 안쪽: 다이가 놓인 받침, 벽, 그리고 들어온 구멍이 보이는 천장 */
export const Shell = ({ m }: { m: Materials }) => (
  <group>
    <mesh position={[0, -3, 0]} material={m.shell} receiveShadow>
      <boxGeometry args={[DIE_HALF * 2 + 6, 6, DIE_HALF * 2 + 6]} />
    </mesh>
    <mesh position={[0, -6.2, 0]} rotation={[-Math.PI / 2, 0, 0]} material={m.shell}>
      <planeGeometry args={[900, 900]} />
    </mesh>
    {[0, 1, 2, 3].map((side) => (
      <group key={side} rotation={[0, side * (Math.PI / 2), 0]}>
        <mesh position={[0, 135, -(DIE_HALF + 170)]} material={m.shell}>
          <boxGeometry args={[DIE_HALF * 2 + 360, 290, 8]} />
        </mesh>
        <mesh position={[0, 62, -(DIE_HALF + 47.5)]} material={m.gold}>
          <boxGeometry args={[DIE_HALF * 2 + 60, 2.4, 2]} />
        </mesh>
      </group>
    ))}
    <mesh position={[0, 276, 0]} rotation={[Math.PI / 2, 0, 0]} material={m.shell}>
      <planeGeometry args={[DIE_HALF * 2 + 360, DIE_HALF * 2 + 360]} />
    </mesh>
    {/* 들어온 자리: 뚜껑에 난 빛의 테두리 */}
    {[0, 1, 2, 3].map((side) => (
      <group key={side} rotation={[0, side * (Math.PI / 2), 0]}>
        <mesh position={[36, 275, 0]}>
          <boxGeometry args={[0.6, 0.6, 72.6]} />
          <meshBasicMaterial color='#ffffff' toneMapped={false} />
        </mesh>
      </group>
    ))}
  </group>
);

type DieWorldProps = {
  accent: string;
  compact: boolean;
  still: boolean;
  view: ViewId;
  /** 내 캐릭터를 조종하는 중인가 */
  walking: boolean;
  positionRef: RefObject<three.Vector3>;
  destinationRef: RefObject<three.Vector3 | null>;
  onSelect: (id: ViewId) => void;
  onNear: (id: DistrictId | null) => void;
  /** 이미 모은 비트의 번호 */
  collected: number[];
  onCollect: (index: number) => void;
};

/** 칩 내부 세계 */
export const DieWorld = ({
  accent,
  compact,
  still,
  view,
  walking,
  positionRef,
  destinationRef,
  onSelect,
  onNear,
  collected,
  onCollect,
}: DieWorldProps) => {
  const m = useMaterials(accent);
  const fonts = useFontsReady();
  const city = useMemo(() => createCity(compact), [compact]);
  // 주민들이 지금 서 있는 자리. 주민과 내 캐릭터가 서로 겹치지 않게 하는 데 쓴다
  const crowdRef = useRef<Spot[]>([]);
  // 내 캐릭터가 들어와 있는 사각형의 지구. 그 지구의 패널이 저절로 올라온다
  const [inside, setInside] = useState<DistrictId | null>(null);
  const handleNear = (id: DistrictId | null) => {
    setInside(id);
    onNear(id);
  };

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
      <hemisphereLight args={['#c9d8ff', '#0a0c10', 0.75]} />
      <directionalLight
        position={[70, 150, 90]}
        intensity={3}
        color='#f4f7ff'
        castShadow
        shadow-mapSize={compact ? [1024, 1024] : [2048, 2048]}
        shadow-camera-left={-190}
        shadow-camera-right={190}
        shadow-camera-top={190}
        shadow-camera-bottom={-190}
        shadow-camera-near={20}
        shadow-camera-far={420}
        shadow-bias={-0.0006}
        shadow-normalBias={0.3}
      />
      <directionalLight position={[-120, 60, -140]} intensity={1.1} color='#9cc8ff' />
      {DISTRICTS.map((district) => (
        <pointLight
          key={district.id}
          position={[district.x, 22, district.z + 16]}
          color={accent}
          intensity={view === district.id ? 1500 : 800}
          distance={110}
          decay={1.6}
        />
      ))}

      <Floor
        fonts={fonts}
        onGround={(point) => {
          if (walking) {
            destinationRef.current = point.clone();
          }
        }}
      />
      <City m={m} city={city} />
      <Suspense fallback={null}>
        <Citizens
          city={city}
          accent={accent}
          count={compact ? 16 : 30}
          still={still}
          playerRef={positionRef}
          crowdRef={crowdRef}
        />
        <Bits city={city} collected={collected} still={still} playerRef={positionRef} onCollect={onCollect} />
        <Player
          city={city}
          accent={accent}
          walking={walking}
          view={view}
          still={still}
          positionRef={positionRef}
          destinationRef={destinationRef}
          crowdRef={crowdRef}
          portrait={compact}
          onNear={handleNear}
        />
      </Suspense>
      <Avenues m={m} still={still} />
      <HubSilk fonts={fonts} compact={compact} />
      <BondWires m={m} />
      <Shell m={m} />

      {DISTRICTS.map((district, index) => (
        <group key={district.id}>
          <DistrictSilk district={district} index={index} fonts={fonts} />
          <Monument district={district} m={m} still={still} fonts={fonts} />
          <Panel
            district={district}
            m={m}
            accent={accent}
            portrait={compact}
            focused={view === district.id}
            // 전체 보기에서는 어디에 무엇이 있는지 보이도록 모든 패널이 올라와 있다
            pulled={inside === district.id || (view === 'overview' && !walking)}
            fonts={fonts}
            still={still}
            onSelect={onSelect}
          />
          <Beacon
            district={district}
            m={m}
            accent={accent}
            hidden={view === district.id}
            fonts={fonts}
            onSelect={onSelect}
          />
        </group>
      ))}
    </group>
  );
};
