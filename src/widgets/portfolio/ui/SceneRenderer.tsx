import { OrbitControls } from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import type { FocusedGroup, Position3D } from '@/entities/portfolio/model/types';
import {
  Antenna,
  Computer,
  ContactMe,
  DataRack,
  ExperienceDesk,
  ExperiencePerson,
  FloatMan,
  GridBackground,
  HoloText,
  InspectingPerson,
  Platform,
  ResumeConsole,
  RobotArm,
  Server,
  TypingMan,
  WorkPerson,
  WorkTable,
} from '@/widgets/portfolio/ui';
import { HoloTable } from '@/widgets/portfolio/ui/HoloTable';
import { HoloContainer } from '@/widgets/portfolio/ui/HoloContainer';

type SceneRendererProps = {
  focusedGroup: FocusedGroup;
  pulseActive: boolean;
  pulseCenter: Position3D | null;
  hoveredPosition: Position3D | null;
  isShow: (group: FocusedGroup) => boolean;
  onGroupClick: (group: FocusedGroup) => void;
  onPointerOver: (position: Position3D) => void;
  onPointerOut: () => void;
  // 초기 애니메이션 props 추가
  holoTableScale?: number;
  holoTablePosition?: [number, number, number];
  showOtherModels?: boolean;
  isInitialAnimation?: boolean;
};

export const SceneRenderer = (props: SceneRendererProps) => {
  const {
    focusedGroup,
    pulseActive,
    pulseCenter,
    hoveredPosition,
    isShow,
    onGroupClick,
    onPointerOver,
    onPointerOut,
    holoTableScale = 0.3,
    holoTablePosition = [0, 0.4, 0],
    showOtherModels = true,
    isInitialAnimation = false,
  } = props;

  const handlePointerOver = (position: Position3D) => (e: any) => {
    e.stopPropagation();
    onPointerOver(position);
  };

  const handlePointerOut = (e: any) => {
    e.stopPropagation();
    onPointerOut();
  };

  return (
    <>
      {/* 초기 애니메이션 중이 아닐 때만 GridBackground 표시 */}
      {!isInitialAnimation && (
        <GridBackground
          showNeonPaths={!focusedGroup}
          pulseActive={pulseActive}
          pulseCenter={pulseCenter}
          hoveredPosition={hoveredPosition}
        />
      )}

      {/* 홀로테이블과 보관함 - 항상 표시하되 스케일과 위치를 동적으로 제어 */}
      {isShow('holoTable') && (
        <>
          {/* 보관함은 초기 애니메이션이 완료된 후에만 표시 */}
          {!isInitialAnimation && <HoloContainer scale={holoTableScale} position={[0, 0.6, 0]} />}
          <HoloTable
            scale={holoTableScale}
            position={holoTablePosition}
            onClick={() => onGroupClick('holoTable')}
            onPointerOver={handlePointerOver([0, 0, 0])}
            onPointerOut={handlePointerOut}
          />
        </>
      )}

      {/* 다른 모델들은 초기 애니메이션 완료 후에만 표시 */}
      {/* work 그룹: workTable + typingMan */}
      {showOtherModels &&
        isShow('work') && [
          <WorkTable
            key='workTable'
            scale={0.01}
            rotation={[0, Math.PI / 2, 0]}
            position={[4, 0, 0]}
            onClick={() => onGroupClick('work')}
            onPointerOver={handlePointerOver([4, 0, 0])}
            onPointerOut={handlePointerOut}
          />,
          <TypingMan
            key='typingMan'
            scale={0.2}
            rotation={[0, -Math.PI / 2, 0]}
            position={[4.2, 0, 0]}
            onClick={() => onGroupClick('work')}
            onPointerOver={handlePointerOver([4.2, 0, 0])}
            onPointerOut={handlePointerOut}
          />,
        ]}

      {/* contactMe 단독 */}
      {showOtherModels && isShow('contactMe') && (
        <ContactMe
          scale={0.3}
          rotation={[0, -Math.PI / 2, 0]}
          position={[-4, 0, -0.1]}
          onClick={() => onGroupClick('contactMe')}
          onPointerOver={handlePointerOver([-4, 0, -1])}
          onPointerOut={handlePointerOut}
        />
      )}

      {/* server 그룹: server0,1,2 */}
      {showOtherModels &&
        isShow('server') && [
          <WorkPerson
            key='serverPerson'
            scale={0.2}
            rotation={[0, Math.PI, 0]}
            position={[0, 0, -3.2]}
            onClick={() => onGroupClick('server')}
            onPointerOver={handlePointerOver([0, 0, -3.2])}
            onPointerOut={handlePointerOut}
            animationType='touch'
          />,
          <Computer key='computer' scale={0.5} position={[0.1, 0.6, -3.4]} />,
          [0, 1, 2].map((index) => {
            const position: Position3D = [0, 0, -4 - index * 0.2];
            return (
              <Server
                key={index}
                scale={0.002}
                rotation={[0, Math.PI / 2, 0]}
                position={position}
                onClick={() => onGroupClick('server')}
                onPointerOver={handlePointerOver(position)}
                onPointerOut={handlePointerOut}
              />
            );
          }),
        ]}

      {/* experience 그룹: experiencePerson + experienceDesk */}
      {showOtherModels &&
        isShow('experience') && [
          <ExperiencePerson
            key='experiencePerson'
            scale={0.2}
            rotation={[0, Math.PI, 0]}
            position={[-1, 0, 4]}
            onClick={() => onGroupClick('experience')}
            onPointerOver={handlePointerOver([0, 0, 3])}
            onPointerOut={handlePointerOut}
          />,
          <ExperienceDesk
            key='experienceDesk'
            scale={0.07}
            position={[1.8, 0, 5.7]}
            onClick={() => onGroupClick('experience')}
            onPointerOver={handlePointerOver([4, 0, 5.3])}
            onPointerOut={handlePointerOut}
          />,
        ]}

      {showOtherModels && isShow('platform') && (
        <>
          <Platform scale={0.1} position={[-3, 0, 3]} />
          <FloatMan scale={0.25} rotation={[-Math.PI / 2, 0, Math.PI / 2]} position={[-3.3, 0.2, 3]} />
        </>
      )}

      {/* 홀로그램 이름표들 */}
      {showOtherModels && !focusedGroup && !pulseActive && (
        <>
          <HoloText
            text='ABOUT ME'
            position={[3.4, 0, 0.5]}
            rotation={[-Math.PI / 2, 0, Math.PI / 2]}
            color='#8b5cf6'
          />
          <HoloText
            text='CONTACT'
            position={[-1.9, 0, -3.1]}
            rotation={[-Math.PI / 2, 0, Math.PI / 2]}
            color='#8b5cf6'
          />
          <HoloText text='WORKS' position={[-0.3, 0, -2.8]} rotation={[-Math.PI / 2, 0, 0]} color='#8b5cf6' />
          <HoloText
            text='RESUME'
            position={[2.35, 0, -2.2]}
            rotation={[-Math.PI / 2, 0, Math.PI / 2]}
            color='#8b5cf6'
          />
          <HoloText text='EXPERIENCE' position={[-1.3, 0, 3.1]} rotation={[-Math.PI / 2, 0, 0]} color='#8b5cf6' />
          <HoloText text='SKILLS' position={[2.3, 0, 2]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} color='#8b5cf6' />
          <HoloText text='HOME' position={[-2.5, 0, 0.5]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} color='#8b5cf6' />
          <HoloText text='PLAYGROUND' position={[-4, 0, 2.6]} rotation={[-Math.PI / 2, 0, 0]} color='#8b5cf6' />
        </>
      )}

      {showOtherModels && isShow('resumeConsole') && (
        <>
          <ResumeConsole
            scale={0.5}
            rotation={[0, Math.PI / 2, 0]}
            position={[3, 0, -2.5]}
            onClick={() => onGroupClick('resumeConsole')}
            onPointerOver={handlePointerOver([3, 0, -2.5])}
            onPointerOut={handlePointerOut}
          />
          <InspectingPerson
            scale={0.2}
            rotation={[0, -Math.PI / 2, 0]}
            position={[3.5, 0, -3]}
            onClick={() => onGroupClick('resumeConsole')}
            onPointerOver={handlePointerOver([3.5, 0, -3])}
            onPointerOut={handlePointerOut}
          />
          <DataRack
            scale={0.4}
            position={[3, 0, -3]}
            onClick={() => onGroupClick('resumeConsole')}
            onPointerOver={handlePointerOver([3, 0, -3])}
            onPointerOut={handlePointerOut}
          />
        </>
      )}

      {showOtherModels && isShow('skill') && (
        <RobotArm
          scale={0.005}
          position={[1.5, 0, 1.5]}
          onClick={() => onGroupClick('skill')}
          onPointerOver={handlePointerOver([1.5, 0, 1.5])}
          onPointerOut={handlePointerOut}
        />
      )}

      {showOtherModels && isShow('radar') && (
        <Antenna
          scale={0.2}
          rotation={[0, Math.PI, 0]}
          position={[-2.5, 0, -3.5]}
          onClick={() => onGroupClick('radar')}
          onPointerOver={handlePointerOver([-2.5, 0, -3.5])}
          onPointerOut={handlePointerOut}
        />
      )}

      {/* 메인 조명 */}
      <ambientLight intensity={0.2} color='#002244' />
      <directionalLight position={[10, 10, 5]} intensity={0.5} color='#ffffff' />

      <EffectComposer>
        <Bloom luminanceThreshold={0} mipmapBlur luminanceSmoothing={0.0} intensity={5} />
      </EffectComposer>

      {/* 분위기 조명 */}
      <pointLight position={[0, 5, 0]} intensity={0.3} color='#00ffff' />

      {/* OrbitControls는 전체 뷰에서만 허용하고 초기 애니메이션 중에는 비활성화 */}
      {!focusedGroup && !isInitialAnimation && <OrbitControls />}
    </>
  );
};
