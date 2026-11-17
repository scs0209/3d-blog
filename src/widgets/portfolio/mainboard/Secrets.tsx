'use client';

import { useFrame } from '@react-three/fiber';
import { type RefObject, useEffect, useMemo, useRef } from 'react';
import type * as three from 'three';
import type { City } from './city';
import type { Materials } from './DieWorld';
import {
  SECRET_ACT,
  SECRET_FOUND,
  SECRET_NEAR,
  SECRET_OPEN,
  SECRET_PULL,
  type SecretAct,
  type SecretNear,
} from './district';
import { wrap } from './panels';
import { createLabelTexture } from './textures';

const BOOT_KEY = 'ayaan-portfolio-boot';
const CARD = { width: 8, height: 5 };
/** 서랍: 캐릭터 손이 닿는 높이에 달려 있고, 앞으로 TRAVEL만큼 빠져나온다 */
const DRAWER = { y: 2.5, height: 1.5, depth: 2.4, travel: 2 };
/** 서랍을 당길 때 캐릭터가 서는 자리: 건물 앞면에서 이만큼 떨어진 곳 */
const STAND = 3.9;
/** 서버 앞면을 유닛으로 나누는 홈의 높이(서랍 중심 기준)와 통풍구의 칸 번호 */
const GROOVES = [-0.95, 0.95, 2.05];
const VENTS = [0, 1, 2, 3, 4];

/** 숨은 서버마다 들어 있는 것. 사람에 대한 사실이 아니라 이 도시 자체에 대한 것과 농담만 담는다 */
const notes = (city: City): { file: string; lines: string[] }[] => {
  let boot = 1;
  try {
    boot = Number(window.localStorage.getItem(BOOT_KEY) ?? '1') || 1;
  } catch {
    // 저장소를 못 쓰면 첫 방문으로 적는다
  }
  return [
    {
      file: 'README.md',
      lines: [`이 칩 안에는 건물이 ${city.blocks.length}채 서 있습니다.`, '그중 서랍이 열리는 서버는 여섯 대뿐입니다.'],
    },
    { file: '404.md', lines: ['기억을 찾을 수 없습니다.', '아직 만들어지지 않은 기억입니다.'] },
    { file: 'boot.log', lines: [`이 브라우저에서 ${boot}번째 부팅입니다.`, '또 와 줘서 고맙습니다.'] },
    { file: '/dev/null', lines: ['(비어 있음)', '여기에 넣은 것은 돌아오지 않습니다.'] },
    { file: 'sleep.pid', lines: ['zzz…', '절전 중인 프로세스입니다. 서랍은 살살 닫아 주세요.'] },
    { file: 'credits.txt', lines: ['Next.js · React Three Fiber · Blender', '이 세계는 이것들로 만들었습니다.'] },
  ];
};

const createCard = (file: string, lines: string[], accent: string, index: number, total: number) =>
  createLabelTexture({
    width: 960,
    height: 600,
    background: '#0b0f14',
    draw: (c, fonts) => {
      c.textBaseline = 'top';
      c.fillStyle = accent;
      c.font = `500 30px ${fonts.mono}`;
      c.fillText(`secret / ${file}`, 64, 60);
      c.textAlign = 'right';
      c.fillStyle = '#8d98a3';
      c.fillText(`${index + 1} / ${total}`, 896, 60);
      c.textAlign = 'left';
      let y = 176;
      lines.forEach((line, row) => {
        c.fillStyle = row === 0 ? '#eef2f5' : '#aab4bd';
        c.font = row === 0 ? `600 50px ${fonts.sans}` : `400 36px ${fonts.sans}`;
        const step = row === 0 ? 66 : 50;
        for (const part of wrap(c, line, 832)) {
          c.fillText(part, 64, y);
          y += step;
        }
        y += 22;
      });
    },
  });

const ease = (value: number) => value * value * (3 - 2 * value);

type SecretsProps = {
  city: City;
  m: Materials;
  accent: string;
  still: boolean;
  /** 글꼴이 준비되면 글씨를 다시 그린다 */
  fonts: number;
  playerRef: RefObject<three.Vector3>;
};

/**
 * 도시의 건물 가운데 몇 대는 서랍이 달린 진짜 서버다. 금빛 손잡이와 깜박이는 표시등으로만 티가 난다.
 * 가까이 가서 열면 캐릭터가 손으로 서랍을 당겨 열고, 안에 든 쪽지가 떠오른다.
 */
export const Secrets = ({ city, m, accent, still, fonts, playerRef }: SecretsProps) => {
  // biome-ignore lint/correctness/useExhaustiveDependencies: 글꼴이 준비되면 글씨를 다시 그린다
  const cards = useMemo(() => {
    const all = notes(city);
    return city.secrets.map((secret) => {
      const note = all[secret.id % all.length] ?? { file: 'empty', lines: ['(비어 있음)'] };
      return { file: note.file, texture: createCard(note.file, note.lines, accent, secret.id, city.secrets.length) };
    });
  }, [city, accent, fonts]);
  useEffect(
    () => () => {
      for (const card of cards) {
        card.texture.dispose();
      }
    },
    [cards],
  );

  const doors = useRef<(three.Group | null)[]>([]);
  const sheets = useRef<(three.Group | null)[]>([]);
  const lamps = useRef<(three.Mesh | null)[]>([]);
  const state = useRef({ near: -1, open: city.secrets.map(() => false), value: city.secrets.map(() => 0) });

  useEffect(() => {
    state.current = { near: -1, open: city.secrets.map(() => false), value: city.secrets.map(() => 0) };
  }, [city]);

  // 화면의 버튼이나 키보드에서 "열어 보기"가 오면, 캐릭터에게 서랍 앞으로 와서 당겨 달라고 한다.
  // 서랍은 캐릭터가 손잡이를 잡아당기는 순간(SECRET_PULL)에 움직인다
  useEffect(() => {
    let pending = -1;
    let fallback = 0;
    const toggle = () => {
      window.clearTimeout(fallback);
      const current = state.current;
      if (pending < 0) {
        return;
      }
      const next = !current.open[pending];
      current.open[pending] = next;
      if (next) {
        window.dispatchEvent(new CustomEvent(SECRET_FOUND, { detail: pending }));
      }
      pending = -1;
    };
    const handleOpen = () => {
      const current = state.current;
      const secret = city.secrets[current.near];
      if (!secret || pending >= 0) {
        return;
      }
      pending = current.near;
      window.dispatchEvent(
        new CustomEvent<SecretAct>(SECRET_ACT, {
          detail: { standX: secret.x, standZ: secret.z + STAND, faceX: secret.x, faceZ: secret.z },
        }),
      );
      // 캐릭터가 응답하지 못하는 상황에서도 서랍은 열린다
      fallback = window.setTimeout(toggle, 2600);
    };
    window.addEventListener(SECRET_OPEN, handleOpen);
    window.addEventListener(SECRET_PULL, toggle);
    return () => {
      window.clearTimeout(fallback);
      window.removeEventListener(SECRET_OPEN, handleOpen);
      window.removeEventListener(SECRET_PULL, toggle);
      window.dispatchEvent(new CustomEvent<SecretNear>(SECRET_NEAR, { detail: null }));
    };
  }, [city]);

  useFrame(({ clock }, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const player = playerRef.current;
    const current = state.current;
    let near = -1;
    city.secrets.forEach((secret, index) => {
      // 문 앞 길 위 어디에 서 있어도 닿도록, 문에서 조금 떨어진 자리를 기준으로 넉넉히 잡는다
      const distance = Math.hypot(player.x - secret.x, player.z - (secret.z + STAND));
      if (distance < 6) {
        near = index;
      }
      // 멀어지면 저절로 닫힌다
      if (distance > 13) {
        current.open[index] = false;
      }
      const target = current.open[index] ? 1 : 0;
      const value = current.value[index] ?? 0;
      const next = still ? target : value + (target - value) * (1 - Math.exp(-delta * 5));
      current.value[index] = next;
      const drawer = doors.current[index];
      const slide = ease(Math.min(1, next * 1.5));
      if (drawer) {
        drawer.position.z = slide * DRAWER.travel;
      }
      const sheet = sheets.current[index];
      if (sheet) {
        // 쪽지는 열린 서랍 안에서 꺼내져 머리 위로 떠오른다
        const lift = ease(Math.min(1, Math.max(0, (next - 0.3) / 0.7)));
        const from = DRAWER.y + 0.4;
        sheet.visible = lift > 0.01;
        sheet.scale.setScalar(0.08 + 0.92 * lift);
        sheet.position.set(0, from + (7.4 - from) * lift, DRAWER.travel * 0.5 + 0.9 * lift);
      }
      const lamp = lamps.current[index];
      if (lamp && !still) {
        // 표시등: 평소에는 느리게, 앞에 서면 빠르게 깜박인다
        const speed = near === index ? 9 : 2.2;
        lamp.visible = Math.sin(clock.elapsedTime * speed + index * 1.7) > -0.2;
      }
    });
    if (near !== current.near) {
      current.near = near;
      const card = cards[near];
      window.dispatchEvent(
        new CustomEvent<SecretNear>(SECRET_NEAR, { detail: near >= 0 && card ? { id: near, file: card.file } : null }),
      );
    }
  });

  return (
    <>
      {city.secrets.map((secret, index) => {
        const width = Math.min(secret.width - 0.5, 3.4);
        return (
          <group key={secret.id} position={[secret.x, 0, secret.z]}>
            {/* 서버 앞면: 유닛을 나누는 홈, 통풍구, 상태등 */}
            {GROOVES.filter((level) => DRAWER.y + level < secret.height - 0.3).map((level) => (
              <mesh key={level} position={[0, DRAWER.y + level, 0.02]}>
                <boxGeometry args={[secret.width - 0.1, 0.07, 0.03]} />
                <meshBasicMaterial color='#020304' />
              </mesh>
            ))}
            {VENTS.map((slot) => (
              <mesh key={slot} position={[-width / 2 + 0.35 + slot * 0.34, DRAWER.y - 1.6, 0.03]}>
                <boxGeometry args={[0.2, 0.5, 0.03]} />
                <meshBasicMaterial color='#020304' />
              </mesh>
            ))}
            {['#58d68d', '#f0c460'].map((color, lamp) => (
              <mesh key={color} position={[width / 2 - 0.3 - lamp * 0.36, DRAWER.y - 1.6, 0.05]}>
                <boxGeometry args={[0.18, 0.18, 0.05]} />
                <meshBasicMaterial color={color} toneMapped={false} />
              </mesh>
            ))}
            {/* 서랍이 들어가는 자리: 어두운 속과 위아래의 금빛 테 */}
            <mesh position={[0, DRAWER.y, 0.03]}>
              <planeGeometry args={[width, DRAWER.height]} />
              <meshBasicMaterial color='#020304' />
            </mesh>
            {[-1, 1].map((edge) => (
              <mesh key={edge} position={[0, DRAWER.y + (edge * (DRAWER.height + 0.1)) / 2, 0.06]} material={m.gold}>
                <boxGeometry args={[width + 0.2, 0.05, 0.04]} />
              </mesh>
            ))}
            {/* 서랍: 앞판과 손잡이, 그 뒤로 이어진 얕은 상자 */}
            <group
              ref={(node) => {
                doors.current[index] = node;
              }}
            >
              <mesh position={[0, DRAWER.y - 0.25, 0.1 - DRAWER.depth / 2]} material={m.frame} castShadow>
                <boxGeometry args={[width - 0.2, DRAWER.height - 0.6, DRAWER.depth]} />
              </mesh>
              <mesh position={[0, DRAWER.y, 0.12]} material={m.frame} castShadow>
                <boxGeometry args={[width, DRAWER.height, 0.16]} />
              </mesh>
              <mesh position={[0, DRAWER.y, 0.34]} material={m.gold}>
                <boxGeometry args={[width * 0.5, 0.16, 0.2]} />
              </mesh>
              {/* 양옆의 레일과, 앞판 가장자리의 얇은 금테 */}
              {[-1, 1].map((side) => (
                <mesh
                  key={side}
                  position={[side * (width / 2 - 0.06), DRAWER.y - 0.2, 0.1 - DRAWER.depth / 2]}
                  material={m.gold}
                >
                  <boxGeometry args={[0.05, 0.12, DRAWER.depth]} />
                </mesh>
              ))}
              {[-1, 1].map((side) => (
                <mesh key={side} position={[side * (width / 2 - 0.22), DRAWER.y, 0.21]} material={m.gold}>
                  <boxGeometry args={[0.08, 0.08, 0.04]} />
                </mesh>
              ))}
              <mesh position={[0, DRAWER.y + 0.06, 0.1 - DRAWER.depth / 2]} material={m.glow}>
                <boxGeometry args={[width - 0.7, 0.04, DRAWER.depth - 0.6]} />
              </mesh>
            </group>
            {/* 표시등: 이 건물만 금빛으로 깜박인다 */}
            <mesh
              ref={(node) => {
                lamps.current[index] = node;
              }}
              position={[0, DRAWER.y + DRAWER.height / 2 + 0.5, 0.08]}
            >
              <boxGeometry args={[0.5, 0.2, 0.08]} />
              <meshBasicMaterial color='#f0c460' toneMapped={false} />
            </mesh>
            {/* 안에 든 쪽지 */}
            <group
              ref={(node) => {
                sheets.current[index] = node;
              }}
              visible={false}
            >
              {/* 쪽지: 서류철처럼 위에 색인 탭이 달린 판, 가장자리에 빛띠 */}
              <mesh position={[0, 0, -0.08]} material={m.frame}>
                <boxGeometry args={[CARD.width + 0.3, CARD.height + 0.3, 0.12]} />
              </mesh>
              <mesh position={[-CARD.width / 2 + 1.3, CARD.height / 2 + 0.36, -0.08]} material={m.frame}>
                <boxGeometry args={[2.4, 0.5, 0.12]} />
              </mesh>
              <mesh position={[-CARD.width / 2 + 1.3, CARD.height / 2 + 0.36, -0.01]} material={m.gold}>
                <boxGeometry args={[1.5, 0.08, 0.03]} />
              </mesh>
              <mesh position={[0, -CARD.height / 2 - 0.2, -0.04]} material={m.glow}>
                <boxGeometry args={[CARD.width + 0.3, 0.06, 0.08]} />
              </mesh>
              <mesh>
                <planeGeometry args={[CARD.width, CARD.height]} />
                <meshBasicMaterial map={cards[index]?.texture} toneMapped={false} />
              </mesh>
            </group>
          </group>
        );
      })}
    </>
  );
};
