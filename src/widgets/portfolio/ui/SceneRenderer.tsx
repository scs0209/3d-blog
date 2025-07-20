import { OrbitControls } from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import type { FocusedGroup, Position3D } from '@/entities/portfolio/model/types';
import {
  Antenna,
  Computer,
  ContactMe,
  LabMachine,
  ExperienceDesk,
  ExperiencePerson,
  FloatMan,
  GridBackground,
  HoloText,
  InspectingPerson,
  Platform,
  RobotArm,
  Server,
  TypingMan,
  WorkPerson,
  WorkTable,
  FPSMeasurer,
  WorkChair,
} from '@/widgets/portfolio/ui';
import { HoloTable } from '@/widgets/portfolio/ui/HoloTable';
import { HoloContainer } from '@/widgets/portfolio/ui/HoloContainer';
import { HoverCameraController } from '@/widgets/portfolio/ui/HoverCameraController';

type SceneRendererProps = {
  focusedGroup: FocusedGroup;
  pulseActive: boolean;
  pulseCenter: Position3D | null;
  hoveredPosition: Position3D | null;
  isShow: (group: FocusedGroup) => boolean;
  onGroupClick: (group: FocusedGroup) => void;
  onPointerOver: (position: Position3D) => void;
  onPointerOut: () => void;
  // onFpsUpdate prop 제거
  // 초기 애니메이션 props 추가
  holoTableScale?: number;
  holoTablePosition?: [number, number, number];
  showOtherModels?: boolean;
  isInitialAnimation?: boolean;
  // 카메라 애니메이션 완료 상태 추가
  cameraAnimationDone?: boolean;
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
    holoTableScale = 0.1,
    holoTablePosition = [0, 0.4, 0],
    showOtherModels = true,
    isInitialAnimation = false,
    cameraAnimationDone = false,
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
      {/* 호버 카메라 컨트롤러 - 초기 애니메이션이 아니고 특정 그룹에 포커스되지 않았을 때만 작동 */}
      <HoverCameraController
        hoveredPosition={hoveredPosition}
        isInitialAnimation={isInitialAnimation}
        focusedGroup={focusedGroup}
      />

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
          <HoloTable scale={holoTableScale} position={holoTablePosition} />
        </>
      )}

      {/* 다른 모델들은 초기 애니메이션 완료 후에만 표시 */}
      {/* work 그룹: workTable + typingMan */}
      {showOtherModels &&
        isShow('work') && [
          <WorkTable
            key='workTable'
            scale={0.3}
            position={[4.7, 0, 0.4]}
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
          <WorkChair
            key='workChair'
            scale={0.4}
            position={[4.45, 0, -0.1]}
            rotation={[0, -Math.PI, 0]}
            onClick={() => onGroupClick('work')}
            onPointerOver={handlePointerOver([4.2, 0, 0])}
            onPointerOut={handlePointerOut}
          />,
        ]}

      {/* HOME */}
      {showOtherModels && isShow('contactMe') && (
        <ContactMe
          scale={0.4}
          rotation={[0, -Math.PI / 2, 0]}
          position={[-5, 0, -0.1]}
          onClick={() => onGroupClick('contactMe')}
          onPointerOver={handlePointerOver([-5, 0, -0.1])}
          onPointerOut={handlePointerOut}
          triggerAnimation={focusedGroup === 'contactMe' && cameraAnimationDone}
          onAnimationComplete={() => {
            // 홈으로 이동
            window.location.href = '/';
          }}
        />
      )}

      {/* server 그룹: server0,1,2 */}
      {showOtherModels &&
        isShow('server') && [
          <WorkPerson
            key='serverPerson'
            scale={0.2}
            rotation={[0, Math.PI, 0]}
            position={[0.3, 0, -3.4]}
            onClick={() => onGroupClick('server')}
            onPointerOver={handlePointerOver([0, 0, -4])}
            onPointerOut={handlePointerOut}
            animationType='touch'
          />,
          <Computer key='computer' scale={0.06} position={[0.3, 0.3, -3.6]} rotation={[0, Math.PI / 2, 0]} />,
          [0, 1, 2].map((index) => {
            const position: Position3D = [0.3, 0, -4.2 - index * 0.2];
            return (
              <Server
                key={index}
                scale={0.004}
                rotation={[0, Math.PI / 2, 0]}
                position={position}
                onClick={() => onGroupClick('server')}
                onPointerOver={handlePointerOver([0, 0, -4])}
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
            position={[-1, 0, 4.2]}
            onClick={() => onGroupClick('experience')}
            onPointerOver={handlePointerOver([-1, 0, 4])}
            onPointerOut={handlePointerOut}
          />,
          <ExperienceDesk
            key='experienceDesk'
            scale={0.4}
            position={[-1, 0, 4]}
            onPointerOver={handlePointerOver([-1, 0, 4])}
            onPointerOut={handlePointerOut}
            onClick={() => onGroupClick('experience')}
          />,
        ]}

      {showOtherModels && isShow('platform') && (
        <>
          <Platform
            scale={0.1}
            position={[-4, 0, 3.5]}
            onPointerOver={handlePointerOver([-4, 0, 3.4])}
            onPointerOut={handlePointerOut}
          />
          <FloatMan
            scale={0.2}
            rotation={[-Math.PI / 2, 0, Math.PI / 2]}
            position={[-4.1, 0.2, 3.45]}
            onPointerOver={handlePointerOver([-4, 0, 3.4])}
            onPointerOut={handlePointerOut}
          />
        </>
      )}

      {/* 홀로그램 이름표들 */}
      {showOtherModels && !focusedGroup && !pulseActive && (
        <>
          <HoloText
            text='ABOUT ME'
            position={[3.4, 0, 0.5]}
            rotation={[-Math.PI / 2, 0, Math.PI / 2]}
            color='#E5D6C4'
          />
          <HoloText
            text='CONTACT'
            position={[-1.9, 0, -3.1]}
            rotation={[-Math.PI / 2, 0, Math.PI / 2]}
            color='#E5D6C4'
            scale={0.8}
          />
          <HoloText text='WORKS' position={[-0.1, 0, -3]} rotation={[-Math.PI / 2, 0, 0]} color='#E5D6C4' />
          <HoloText
            text='RESUME'
            position={[2.85, 0, -2.5]}
            rotation={[-Math.PI / 2, 0, Math.PI / 2]}
            color='#E5D6C4'
          />
          <HoloText text='EXPERIENCE' position={[-1.3, 0, 3.3]} rotation={[-Math.PI / 2, 0, 0]} color='#E5D6C4' />
          <HoloText text='SKILLS' position={[2.3, 0, 2]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} color='#E5D6C4' />
          <HoloText
            text='HOME'
            position={[-4, 0, 0.3]}
            rotation={[-Math.PI / 2, 0, Math.PI / 2]}
            color='#E5D6C4'
            scale={0.8}
          />
          <HoloText text='PLAYGROUND' position={[-4.5, 0, 2.8]} rotation={[-Math.PI / 2, 0, 0]} color='#E5D6C4' />
        </>
      )}

      {showOtherModels && isShow('resumeConsole') && (
        <>
          <InspectingPerson
            scale={0.2}
            rotation={[0, -Math.PI / 2, 0]}
            position={[3.7, 0, -2.9]}
            onClick={() => onGroupClick('resumeConsole')}
            onPointerOver={handlePointerOver([3, 0, -2.6])}
            onPointerOut={handlePointerOut}
          />
          <LabMachine
            scale={0.3}
            position={[3, 0, -3]}
            rotation={[0, Math.PI / 2, 0]}
            onClick={() => onGroupClick('resumeConsole')}
            onPointerOver={handlePointerOver([3, 0, -2.6])}
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
          scale={0.3}
          rotation={[0, Math.PI, 0]}
          position={[-3, 0, -3.5]}
          onClick={() => onGroupClick('radar')}
          onPointerOver={handlePointerOver([-3, 0, -3.5])}
          onPointerOut={handlePointerOut}
        />
      )}

      {/* 메인 조명 */}
      <directionalLight position={[10, 10, 5]} intensity={0.5} color='#ffffff' />

      <EffectComposer>
        <Bloom luminanceThreshold={0} mipmapBlur luminanceSmoothing={0.0} intensity={1} />
      </EffectComposer>

      {/* OrbitControls는 전체 뷰에서만 허용하고 초기 애니메이션 중에는 비활성화 */}
      <OrbitControls />

      <FPSMeasurer />
    </>
  );
};
