'use client';

import {
  ContactMe,
  ExperienceDesk,
  ExperiencePerson,
  GridBackground,
  HoloText,
  Server,
  TypingMan,
  WorkTable,
} from '@/widgets/portfolio/ui';
import { HoloTable } from '@/widgets/portfolio/ui/HoloTable';
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { useState, useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as three from 'three';
import { AboutMePage } from '@/widgets/portfolio/ui/AboutMePage';
import { NeonToggle } from '@/widgets/portfolio/ui/NeonToggle';

export default function PortfolioPage() {
  // 그룹 집중 상태: null이면 전체, 아니면 해당 그룹만 보여줌
  const [focusedGroup, setFocusedGroup] = useState<null | 'holoTable' | 'work' | 'server' | 'experience' | 'contactMe'>(
    null,
  );
  // pulse 효과 상태
  const [pulseActive, setPulseActive] = useState(false);
  const [pulseCenter, setPulseCenter] = useState<[number, number, number] | null>(null);
  // 카메라 이동 목표 상태 추가
  const [targetPos, setTargetPos] = useState<[number, number, number] | null>(null);
  const [targetLook, setTargetLook] = useState<[number, number, number] | null>(null);
  const [showAboutMeOverlay, setShowAboutMeOverlay] = useState(false);
  const [aboutMeClosing, setAboutMeClosing] = useState(false);

  // 그룹별 카메라 타겟 위치 정의
  const groupCameraTargets: Record<
    string,
    { position: [number, number, number]; lookAt: [number, number, number]; pulse: [number, number, number] }
  > = {
    holoTable: { position: [0, 2, 5], lookAt: [0, 0, 0], pulse: [0, 0, 0] },
    work: { position: [5, 2, 2], lookAt: [4.2, 0, 0], pulse: [4.2, 0, 0] },
    server: { position: [0, 2, -8], lookAt: [0, 0, -5], pulse: [0, 0, -5] },
    experience: { position: [2, 2, 6], lookAt: [1.75, 0, 4.15], pulse: [1.75, 0, 4.15] },
    contactMe: { position: [-6, 2, 0], lookAt: [-4, 0, 0], pulse: [-4, 0, 0] },
  };

  // 초기 카메라 위치/LookAt 상수
  const initialCameraPos: [number, number, number] = [2, 5, 2];
  const initialCameraLook: [number, number, number] = [0, 0, 0];

  // 이징 함수 (easeInOutCubic)
  function easeInOutCubic(t: number) {
    return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
  }

  // 카메라 애니메이션 처리
  function CameraController({ onAnimationEnd }: { onAnimationEnd: () => void }) {
    const { camera, clock } = useThree();
    const animRef = useRef({
      start: 0,
      fromPos: [0, 0, 0] as [number, number, number],
      toPos: [0, 0, 0] as [number, number, number],
      fromLook: [0, 0, 0] as [number, number, number],
      toLook: [0, 0, 0] as [number, number, number],
      running: false,
    });

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
      if (targetPos && targetLook) {
        animRef.current.start = clock.getElapsedTime();
        animRef.current.fromPos = [camera.position.x, camera.position.y, camera.position.z];
        animRef.current.toPos = targetPos;
        const dir = new three.Vector3();
        camera.getWorldDirection(dir);
        animRef.current.fromLook = [camera.position.x + dir.x, camera.position.y + dir.y, camera.position.z + dir.z];
        animRef.current.toLook = targetLook;
        animRef.current.running = true;
      }
    }, [targetPos, targetLook, clock, camera]);

    useFrame(() => {
      if (animRef.current.running) {
        const elapsed = clock.getElapsedTime() - animRef.current.start;
        const t = Math.min(1, elapsed / 3);
        const eased = easeInOutCubic(t);

        // position 보간
        const from = animRef.current.fromPos;
        const to = animRef.current.toPos;
        camera.position.set(
          from[0] + (to[0] - from[0]) * eased,
          from[1] + (to[1] - from[1]) * eased,
          from[2] + (to[2] - from[2]) * eased,
        );

        // lookAt 보간
        const fromL = animRef.current.fromLook;
        const toL = animRef.current.toLook;
        camera.lookAt(
          fromL[0] + (toL[0] - fromL[0]) * eased,
          fromL[1] + (toL[1] - fromL[1]) * eased,
          fromL[2] + (toL[2] - fromL[2]) * eased,
        );

        if (t === 1) {
          animRef.current.running = false;
          onAnimationEnd();
        }
      }
    });
    return null;
  }

  // 그룹 클릭 핸들러
  const handleGroupClick = (groupName: typeof focusedGroup) => {
    setFocusedGroup(groupName);
    if (groupName && groupCameraTargets[groupName]) {
      -setPulseCenter(groupCameraTargets[groupName]?.pulse);
      +setPulseCenter(groupCameraTargets[groupName]?.pulse ?? null);
      setPulseActive(true);
      setTimeout(() => {
        setPulseActive(false);
        if (groupCameraTargets[groupName]) {
          setTargetPos(groupCameraTargets[groupName].position);
          setTargetLook(groupCameraTargets[groupName].lookAt);
        }
      }, 1000);
    }
  };

  // 뒤로가기
  const handleBack = () => {
    setAboutMeClosing(true);
  };

  // AboutMePage 닫힘 애니메이션 완료 후 처리
  const handleAboutMeClose = () => {
    setShowAboutMeOverlay(false);
    setAboutMeClosing(false);
    setTargetPos(initialCameraPos);
    setTargetLook(initialCameraLook);
    setTimeout(() => {
      setFocusedGroup(null);
      setTargetPos(null);
      setTargetLook(null);
    }, 3000);
  };

  // 렌더링 분기 함수
  const isShow = (group: typeof focusedGroup) => {
    if (focusedGroup) {
      return focusedGroup === group;
    }
    return true;
  };

  const [quality, setQuality] = useState(false);
  const [sound, setSound] = useState(false);

  return (
    <div className='h-screen w-screen bg-gray-900'>
      {/* 오버레이 UI: 상단좌측 타이틀/직함 */}
      <div className='absolute top-8 left-8 z-30 flex flex-col gap-1'>
        <span className='text-cyan-300 font-bold text-2xl neon-glow'>홍길동</span>
        <span className='text-cyan-500 text-xs font-mono neon-glow'>FULL STACK WEB DEVELOPER</span>
      </div>
      {/* 오버레이 UI: 상단우측 EXIT/FPS */}
      <div className='absolute top-8 right-8 z-30 flex gap-4 items-center'>
        <span className='text-cyan-400 font-mono text-sm'>FPS 76</span>
      </div>
      {/* 오버레이 UI: 하단좌측 퀄리티/사운드/라이트모드 */}
      <div className='absolute bottom-8 left-8 z-30 flex flex-col gap-3'>
        <NeonToggle checked={quality} onChange={setQuality} label='HIGH QUALITY' />
        <NeonToggle checked={sound} onChange={setSound} label='SOUND EFFECTS' />
      </div>
      {/* 오버레이 UI: 하단우측 저작권/소셜 */}
      <div className='absolute bottom-8 right-8 z-30 flex gap-4 items-center text-cyan-300 font-mono text-xs'>
        <span>© 2025</span>
        <a href='https://github.com/yourid' target='_blank' rel='noopener noreferrer'>
          GITHUB
        </a>
        <a href='mailto:your@email.com'>EMAIL</a>
      </div>
      {/* 오버레이 AboutMePage */}
      {showAboutMeOverlay && (
        <>
          {/* 왼쪽 1/2 패널 (최대폭 제한, 중앙정렬) */}
          <div className='fixed left-0 top-0 h-full w-1/2 max-w-3xl min-w-[320px] z-50 flex items-start justify-center'>
            <AboutMePage isClosing={aboutMeClosing} onClose={handleAboutMeClose} />
          </div>
        </>
      )}
      {/* 뒤로가기 버튼 */}
      {focusedGroup && (
        <button
          type='button'
          onClick={handleBack}
          style={{
            position: 'absolute',
            top: 24,
            right: 24,
            zIndex: 10,
            padding: '10px 18px',
            background: '#222',
            color: '#fff',
            borderRadius: 8,
            border: 'none',
            fontWeight: 'bold',
            fontSize: 18,
            cursor: 'pointer',
            opacity: 0.85,
          }}
        >
          돌아가기
        </button>
      )}
      <Canvas camera={{ position: [2, 5, 2], fov: 90, near: 0.1, far: 10000 }}>
        <CameraController onAnimationEnd={() => setShowAboutMeOverlay(true)} />
        {/* GridBackground는 항상 표시, 네온 경로/퍼짐 효과 prop 전달 */}
        <GridBackground showNeonPaths={!focusedGroup} pulseActive={pulseActive} pulseCenter={pulseCenter} />
        {/* 메인 3D 모델 */}
        {/* 홀로테이블 단독 */}
        {isShow('holoTable') && <HoloTable scale={0.5} onClick={() => handleGroupClick('holoTable')} />}
        {/* work 그룹: workTable + typingMan */}
        {isShow('work') && [
          <WorkTable
            key='workTable'
            scale={0.03}
            rotation={[0, Math.PI / 2, 0]}
            position={[4, 0, 0]}
            onClick={() => handleGroupClick('work')}
          />,
          <TypingMan
            key='typingMan'
            scale={0.4}
            rotation={[0, -Math.PI / 2, 0]}
            position={[4.4, 0, 0]}
            onClick={() => handleGroupClick('work')}
          />,
        ]}
        {/* contactMe 단독 */}
        {isShow('contactMe') && (
          <ContactMe
            scale={0.4}
            rotation={[0, Math.PI / 2, 0]}
            position={[-4, 0, 0]}
            onClick={() => handleGroupClick('contactMe')}
          />
        )}
        {/* server 그룹: server0,1,2 */}
        {isShow('server') &&
          [0, 1, 2].map((index) => (
            <Server
              key={index}
              scale={0.005}
              rotation={[0, Math.PI / 2, 0]}
              position={[0, 0, -4 - index * 1]}
              onClick={() => handleGroupClick('server')}
            />
          ))}
        {/* experience 그룹: experiencePerson + experienceDesk */}
        {isShow('experience') && [
          <ExperiencePerson
            key='experiencePerson'
            scale={0.4}
            rotation={[0, Math.PI, 0]}
            position={[0, 0, 3]}
            onClick={() => handleGroupClick('experience')}
          />,
          <ExperienceDesk
            key='experienceDesk'
            scale={0.1}
            rotation={[0, 0, 0]}
            position={[3.5, 0, 5.3]}
            onClick={() => handleGroupClick('experience')}
          />,
        ]}
        {/* 홀로그램 이름표들 */}
        {!focusedGroup && !pulseActive && (
          <>
            <HoloText
              text='ABOUT ME'
              position={[3.5, -1.8, 0]}
              rotation={[-Math.PI / 2, 0, Math.PI / 2]}
              color='#8b5cf6'
            />
            <HoloText
              text='CONTACT'
              position={[-2, -1.8, 0]}
              rotation={[-Math.PI / 2, 0, Math.PI / 2]}
              color='#8b5cf6'
            />
            <HoloText text='WORKS' position={[-1.3, -1.8, -4.5]} rotation={[-Math.PI / 2, 0, 0]} color='#8b5cf6' />
          </>
        )}
        {/* 메인 조명 */}
        <ambientLight intensity={0.2} color='#002244' />
        <directionalLight position={[10, 10, 5]} intensity={0.5} color='#ffffff' />
        <EffectComposer>
          <Bloom luminanceThreshold={0} mipmapBlur luminanceSmoothing={0.0} intensity={5} />
        </EffectComposer>
        {/* 분위기 조명 */}
        <pointLight position={[0, 5, 0]} intensity={0.3} color='#00ffff' />
        {/* OrbitControls는 전체 뷰에서만 허용 */}
        {!focusedGroup && !pulseActive && <OrbitControls />}
      </Canvas>
    </div>
  );
}
