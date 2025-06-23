'use client';

import {
  Computer,
  ContactMe,
  ExperienceDesk,
  ExperiencePerson,
  GridBackground,
  HoloText,
  Server,
  TypingMan,
  WorkPerson,
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
import { ExperiencePage } from '@/widgets/portfolio/ui/ExperiencePage';

export default function PortfolioPage() {
  // 그룹 집중 상태: null이면 전체, 아니면 해당 그룹만 보여줌
  const [focusedGroup, setFocusedGroup] = useState<null | 'holoTable' | 'work' | 'server' | 'experience' | 'contactMe'>(
    null,
  );
  // pulse 효과 상태
  const [pulseActive, setPulseActive] = useState(false);
  const [pulseCenter, setPulseCenter] = useState<[number, number, number] | null>(null);
  const [hoveredPosition, setHoveredPosition] = useState<[number, number, number] | null>(null);
  // 카메라 이동 목표 상태 추가
  const [targetPos, setTargetPos] = useState<[number, number, number] | null>(null);
  const [targetLook, setTargetLook] = useState<[number, number, number] | null>(null);
  const [showAboutMeOverlay, setShowAboutMeOverlay] = useState(false);
  const [showExperienceOverlay, setShowExperienceOverlay] = useState(false);
  const [aboutMeClosing, setAboutMeClosing] = useState(false);
  const [experienceClosing, setExperienceClosing] = useState(false);
  // 추가 애니메이션 상태
  const [secondaryAnimation, setSecondaryAnimation] = useState(false);
  // AboutMePage 애니메이션 완료 상태 추가
  const [aboutMeAnimationDone, setAboutMeAnimationDone] = useState(false);
  // 카메라 애니메이션 완료 상태 추가
  const [cameraAnimationDone, setCameraAnimationDone] = useState(false);
  // 돌아가기 버튼 클릭 여부
  const [hasClickedBack, setHasClickedBack] = useState(false);

  // 그룹별 카메라 타겟 위치 정의
  const groupCameraTargets: Record<
    string,
    {
      offset: [number, number, number];
      lookAt: [number, number, number];
      pulse: [number, number, number];
      modelPosition: [number, number, number];
      secondaryOffset?: [number, number, number];
      secondaryLookAt?: [number, number, number];
    }
  > = {
    holoTable: {
      offset: [0, 1, 2],
      lookAt: [0, 0, 0],
      pulse: [0, 0, 0],
      modelPosition: [0, 0, 0],
    },
    work: {
      offset: [1, 2, 0],
      lookAt: [4.2, 0, 0],
      pulse: [4.2, 0, 0],
      modelPosition: [4, 0, 0],
      secondaryOffset: [1, 1, 3],
      secondaryLookAt: [0, 0, 0],
    },
    server: {
      offset: [0, 2.5, 1.5],
      lookAt: [0, 1, -4],
      pulse: [0, 0, -4],
      modelPosition: [0, 1, -4],
      secondaryOffset: [0, 0.2, 0.5],
      secondaryLookAt: [0, 1, -4],
    },
    experience: {
      offset: [0, 1, 2],
      lookAt: [0, 1, 0],
      pulse: [1.75, 0, 4.15],
      modelPosition: [0, -1, 3],
    },
    contactMe: {
      offset: [-2, 1, 0],
      lookAt: [-4, 0, 0],
      pulse: [-4, 0, 0],
      modelPosition: [-4, 0, 0],
    },
  };

  // 초기 카메라 위치/LookAt 상수
  const initialCameraPos: [number, number, number] = [2, 5, 2];
  const initialCameraLook: [number, number, number] = [0, 0, 0];

  // 이징 함수 (easeInOutCubic)
  function easeInOutCubic(t: number) {
    return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
  }

  // 카메라 애니메이션 처리
  function CameraController() {
    const { camera, clock } = useThree();
    const animRef = useRef({
      start: 0,
      fromPos: [0, 0, 0] as [number, number, number],
      toPos: [0, 0, 0] as [number, number, number],
      fromLook: [0, 0, 0] as [number, number, number],
      toLook: [0, 0, 0] as [number, number, number],
      running: false,
      isSecondary: false,
    });

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
      if (targetPos && targetLook && (aboutMeAnimationDone || !aboutMeClosing)) {
        animRef.current.start = clock.getElapsedTime();
        animRef.current.fromPos = [camera.position.x, camera.position.y, camera.position.z];
        animRef.current.toPos = targetPos;
        const dir = new three.Vector3();
        camera.getWorldDirection(dir);
        animRef.current.fromLook = [camera.position.x + dir.x, camera.position.y + dir.y, camera.position.z + dir.z];
        animRef.current.toLook = targetLook;
        animRef.current.running = true;
        animRef.current.isSecondary = secondaryAnimation;
        setCameraAnimationDone(false);
      }
    }, [targetPos, targetLook, clock, camera, secondaryAnimation, aboutMeAnimationDone, aboutMeClosing]);

    useFrame(() => {
      if (animRef.current.running) {
        const elapsed = clock.getElapsedTime() - animRef.current.start;
        // 보조 애니메이션은 더 빠르게 진행
        const duration = animRef.current.isSecondary ? 1 : 3;
        const t = Math.min(1, elapsed / duration);
        // 보조 애니메이션일 때는 linear, 아닐 때는 easeInOutCubic 사용
        const eased = animRef.current.isSecondary ? t : easeInOutCubic(t);

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
          setCameraAnimationDone(true);

          if (
            !animRef.current.isSecondary &&
            (focusedGroup === 'work' || focusedGroup === 'server') &&
            !aboutMeClosing
          ) {
            // 들어갈 때: work와 server 그룹에 대해서 보조 애니메이션 실행
            const target = groupCameraTargets[focusedGroup];
            if (target?.secondaryOffset && target?.secondaryLookAt) {
              setSecondaryAnimation(true);
              const newPos: [number, number, number] = [
                target.modelPosition[0] + target.secondaryOffset[0],
                target.modelPosition[1] + target.secondaryOffset[1],
                target.modelPosition[2] + target.secondaryOffset[2],
              ];
              setTargetPos(newPos);
              setTargetLook(target.secondaryLookAt);
              return;
            }
          } else if (animRef.current.isSecondary && focusedGroup === 'work' && aboutMeClosing) {
            // 나갈 때: 초기 위치로 돌아가기
            setSecondaryAnimation(false);
            setTargetPos(initialCameraPos);
            setTargetLook(initialCameraLook);
            setTimeout(() => {
              setFocusedGroup(null);
              setAboutMeClosing(false);
              setAboutMeAnimationDone(false);
              setCameraAnimationDone(false);
            }, 3000);
            return;
          }
          setSecondaryAnimation(false);
        }
      }
    });

    // 카메라 애니메이션이 끝나고 AboutMePage 표시
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
      if (cameraAnimationDone && !aboutMeClosing && !experienceClosing && !secondaryAnimation && !hasClickedBack) {
        if (focusedGroup === 'work') {
          setShowAboutMeOverlay(true);
        } else if (focusedGroup === 'experience') {
          setShowExperienceOverlay(true);
        }
      }
    }, [cameraAnimationDone, aboutMeClosing, experienceClosing, secondaryAnimation, hasClickedBack, focusedGroup]);

    return null;
  }

  // 그룹 클릭 핸들러
  const handleGroupClick = (groupName: typeof focusedGroup) => {
    if (groupName === focusedGroup) {
      return;
    }
    setFocusedGroup(groupName);
    setSecondaryAnimation(false);
    setCameraAnimationDone(false);
    setHasClickedBack(false);

    if (groupName && groupCameraTargets[groupName]) {
      const target = groupCameraTargets[groupName];
      setPulseCenter(target?.pulse ?? null);
      setPulseActive(true);
      setTimeout(() => {
        setPulseActive(false);
        if (target) {
          // 모델 위치에 offset을 더해서 카메라 위치 계산
          const newPos: [number, number, number] = [
            target.modelPosition[0] + target.offset[0],
            target.modelPosition[1] + target.offset[1],
            target.modelPosition[2] + target.offset[2],
          ];
          setTargetPos(newPos);
          setTargetLook(target.lookAt);
        }
      }, 1000);
    }
  };

  // 뒤로가기
  const handleBack = () => {
    if (showAboutMeOverlay) {
      setAboutMeClosing(true);
    } else if (showExperienceOverlay) {
      setExperienceClosing(true);
    } else {
      // 오버레이가 없는 그룹(ContactMe, Server 등)에서 돌아갈 때
      setTargetPos(initialCameraPos);
      setTargetLook(initialCameraLook);
      // 카메라 애니메이션 시간(3초) 후 포커스 해제
      setTimeout(() => {
        setFocusedGroup(null);
      }, 3000);
    }
    setAboutMeAnimationDone(false);
    setCameraAnimationDone(false);
    setHasClickedBack(true);
  };

  // AboutMePage 닫힘 애니메이션 완료 후 처리
  const handleAboutMeClose = () => {
    setAboutMeAnimationDone(true);
    setShowAboutMeOverlay(false);
    if (focusedGroup === 'work' && groupCameraTargets.work) {
      const target = groupCameraTargets.work;
      // work 섹션에서는 역순으로 애니메이션 실행
      if (target.secondaryOffset && target.secondaryLookAt) {
        setSecondaryAnimation(true);
        // 먼저 원래 줌인 위치로
        const newPos: [number, number, number] = [
          target.modelPosition[0] + target.offset[0],
          target.modelPosition[1] + target.offset[1],
          target.modelPosition[2] + target.offset[2],
        ];
        setTargetPos(newPos);
        setTargetLook(target.lookAt);
      }
    } else {
      setTargetPos(initialCameraPos);
      setTargetLook(initialCameraLook);
      setTimeout(() => {
        setFocusedGroup(null);
        setAboutMeClosing(false);
        setAboutMeAnimationDone(false);
        setCameraAnimationDone(false);
      }, 3000);
    }
  };

  // ExperiencePage 닫힘 애니메이션 완료 후 처리
  const handleExperienceClose = () => {
    setShowExperienceOverlay(false);
    setTargetPos(initialCameraPos);
    setTargetLook(initialCameraLook);
    setTimeout(() => {
      setFocusedGroup(null);
      setExperienceClosing(false);
      setCameraAnimationDone(false);
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

      {/* 오버레이 ExperiencePage */}
      {showExperienceOverlay && (
        <>
          {/* 왼쪽 1/2 패널 (최대폭 제한, 중앙정렬) */}
          <div className='fixed left-0 top-0 h-full w-1/2 max-w-3xl min-w-[320px] z-50 flex items-start justify-center'>
            <ExperiencePage isClosing={experienceClosing} onClose={handleExperienceClose} />
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
        <CameraController />
        {/* GridBackground는 항상 표시, 네온 경로/퍼짐 효과 prop 전달 */}
        <GridBackground
          showNeonPaths={!focusedGroup}
          pulseActive={pulseActive}
          pulseCenter={pulseCenter}
          hoveredPosition={hoveredPosition}
        />
        {/* 메인 3D 모델 */}
        {/* 홀로테이블 단독 */}
        {isShow('holoTable') && (
          <HoloTable
            scale={0.5}
            onClick={() => handleGroupClick('holoTable')}
            onPointerOver={(e: any) => {
              e.stopPropagation();
              setHoveredPosition([0, 0, 0]);
            }}
            onPointerOut={() => setHoveredPosition(null)}
          />
        )}
        {/* work 그룹: workTable + typingMan */}
        {isShow('work') && [
          <WorkTable
            key='workTable'
            scale={0.03}
            rotation={[0, Math.PI / 2, 0]}
            position={[4, 0, 0]}
            onClick={() => handleGroupClick('work')}
            onPointerOver={(e: any) => {
              e.stopPropagation();
              setHoveredPosition([4, 0, 0]);
            }}
            onPointerOut={() => setHoveredPosition(null)}
          />,
          <TypingMan
            key='typingMan'
            scale={0.4}
            rotation={[0, -Math.PI / 2, 0]}
            position={[4.4, 0, 0]}
            onClick={() => handleGroupClick('work')}
            onPointerOver={(e: any) => {
              e.stopPropagation();
              setHoveredPosition([4.2, 0, 0]);
            }}
            onPointerOut={() => setHoveredPosition(null)}
          />,
        ]}
        {/* contactMe 단독 */}
        {isShow('contactMe') && (
          <ContactMe
            scale={0.4}
            rotation={[0, Math.PI / 2, 0]}
            position={[-4, 0, 0]}
            onClick={() => handleGroupClick('contactMe')}
            onPointerOver={(e: any) => {
              e.stopPropagation();
              setHoveredPosition([-4, 0, 0]);
            }}
            onPointerOut={() => setHoveredPosition(null)}
          />
        )}
        {/* server 그룹: server0,1,2 */}
        {isShow('server') && [
          <WorkPerson
            key='serverPerson'
            scale={0.4}
            rotation={[0, Math.PI, 0]}
            position={[0, 0, -3.2]}
            onClick={() => handleGroupClick('server')}
            onPointerOver={(e: any) => {
              e.stopPropagation();
              setHoveredPosition([0, 0, -3.2]);
            }}
            onPointerOut={() => setHoveredPosition(null)}
            animationType='touch'
          />,
          <Computer key='computer' scale={1} position={[0, 1, -4]} />,
          [0, 1, 2].map((index) => {
            const position: [number, number, number] = [0, 0, -4 - index * 1];
            return (
              <Server
                key={index}
                scale={0.005}
                rotation={[0, Math.PI / 2, 0]}
                position={position}
                onClick={() => handleGroupClick('server')}
                onPointerOver={(e: any) => {
                  e.stopPropagation();
                  setHoveredPosition(position);
                }}
                onPointerOut={() => setHoveredPosition(null)}
              />
            );
          }),
        ]}
        {/* experience 그룹: experiencePerson + experienceDesk */}
        {isShow('experience') && [
          <ExperiencePerson
            key='experiencePerson'
            scale={0.4}
            rotation={[0, Math.PI, 0]}
            position={[0, -1, 3]}
            onClick={() => handleGroupClick('experience')}
            onPointerOver={(e: any) => {
              e.stopPropagation();
              setHoveredPosition([0, 0, 3]);
            }}
            onPointerOut={() => setHoveredPosition(null)}
          />,
          <ExperienceDesk
            key='experienceDesk'
            scale={0.1}
            rotation={[0, 0, 0]}
            position={[4, 0, 5.3]}
            onClick={() => handleGroupClick('experience')}
            onPointerOver={(e: any) => {
              e.stopPropagation();
              setHoveredPosition([4, 0, 5.3]);
            }}
            onPointerOut={() => setHoveredPosition(null)}
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
        {/* {!focusedGroup && !pulseActive && <OrbitControls />} */}
        <OrbitControls />
      </Canvas>
    </div>
  );
}
