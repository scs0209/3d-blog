import { Environment } from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { SCENE_STATIONS } from '@/entities/portfolio/model/constants';
import type { FocusedGroup, Position3D } from '@/entities/portfolio/model/types';
import {
  Antenna,
  Computer,
  ExperienceDesk,
  ExperiencePerson,
  FloatMan,
  FPSMeasurer,
  GridBackground,
  HoloText,
  HomeDoor,
  InspectingPerson,
  LabMachine,
  Platform,
  RobotArm,
  Server,
  TypingMan,
  WorkChair,
  WorkPerson,
  WorkTable,
} from '@/widgets/portfolio/ui';
import { HoloContainer } from '@/widgets/portfolio/ui/HoloContainer';
import { HoloTable } from '@/widgets/portfolio/ui/HoloTable';
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
  holoTableScale?: number;
  holoTablePosition?: [number, number, number];
  showOtherModels?: boolean;
  isInitialAnimation?: boolean;
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

  const handlePointerOver = (position: Position3D) => (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    onPointerOver(position);
  };

  const handlePointerOut = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    onPointerOut();
  };

  const work = SCENE_STATIONS.work;
  const home = SCENE_STATIONS.home;
  const server = SCENE_STATIONS.server;
  const experience = SCENE_STATIONS.experience;
  const platform = SCENE_STATIONS.platform;
  const resume = SCENE_STATIONS.resumeConsole;
  const skill = SCENE_STATIONS.skill;
  const radar = SCENE_STATIONS.radar;

  return (
    <>
      <HoverCameraController
        hoveredPosition={hoveredPosition}
        isInitialAnimation={isInitialAnimation}
        focusedGroup={focusedGroup}
      />

      {!isInitialAnimation && (
        <GridBackground
          showNeonPaths={!focusedGroup}
          pulseActive={pulseActive}
          pulseCenter={pulseCenter}
          hoveredPosition={hoveredPosition}
        />
      )}

      {isShow('holoTable') && (
        <>
          {!isInitialAnimation && <HoloContainer scale={holoTableScale} position={[0, 0.6, 0]} />}
          <HoloTable scale={holoTableScale} position={holoTablePosition} />
        </>
      )}

      {/* ABOUT ME */}
      {showOtherModels && isShow('work') && (
        <group position={work.anchor}>
          <WorkTable
            scale={0.3}
            position={[0.5, 0, 0.4]}
            onClick={() => onGroupClick('work')}
            onPointerOver={handlePointerOver(work.hoverCenter)}
            onPointerOut={handlePointerOut}
          />
          <TypingMan
            scale={0.2}
            rotation={[0, -Math.PI / 2, 0]}
            position={[0, 0, 0]}
            onClick={() => onGroupClick('work')}
            onPointerOver={handlePointerOver(work.hoverCenter)}
            onPointerOut={handlePointerOut}
          />
          <WorkChair
            scale={0.4}
            position={[0.25, 0, -0.1]}
            rotation={[0, -Math.PI, 0]}
            onClick={() => onGroupClick('work')}
            onPointerOver={handlePointerOver(work.hoverCenter)}
            onPointerOut={handlePointerOut}
          />
        </group>
      )}

      {/* HOME */}
      {showOtherModels && isShow('home') && (
        <group position={home.anchor}>
          <HomeDoor
            scale={0.4}
            rotation={[0, -Math.PI / 2, 0]}
            position={[0, 0, 0]}
            onClick={() => onGroupClick('home')}
            onPointerOver={handlePointerOver(home.hoverCenter)}
            onPointerOut={handlePointerOut}
            triggerAnimation={focusedGroup === 'home' && cameraAnimationDone}
          />
        </group>
      )}

      {/* WORKS */}
      {showOtherModels && isShow('server') && (
        <group position={server.anchor}>
          <WorkPerson
            scale={0.2}
            rotation={[0, Math.PI, 0]}
            position={[0, 0, 0.4]}
            onClick={() => onGroupClick('server')}
            onPointerOver={handlePointerOver(server.hoverCenter)}
            onPointerOut={handlePointerOut}
            animationType='touch'
          />
          <Computer scale={0.06} position={[0, 0.3, 0.2]} rotation={[0, Math.PI / 2, 0]} />
          {[0, 1, 2].map((index) => (
            <Server
              key={index}
              scale={0.004}
              rotation={[0, Math.PI / 2, 0]}
              position={[0, 0, -0.4 - index * 0.22]}
              onClick={() => onGroupClick('server')}
              onPointerOver={handlePointerOver(server.hoverCenter)}
              onPointerOut={handlePointerOut}
            />
          ))}
        </group>
      )}

      {/* EXPERIENCE */}
      {showOtherModels && isShow('experience') && (
        <group position={experience.anchor}>
          <ExperiencePerson
            scale={0.2}
            rotation={[0, Math.PI, 0]}
            position={[0, 0, 0.2]}
            onClick={() => onGroupClick('experience')}
            onPointerOver={handlePointerOver(experience.hoverCenter)}
            onPointerOut={handlePointerOut}
          />
          <ExperienceDesk
            scale={0.4}
            position={[0, 0, 0]}
            onPointerOver={handlePointerOver(experience.hoverCenter)}
            onPointerOut={handlePointerOut}
            onClick={() => onGroupClick('experience')}
          />
        </group>
      )}

      {/* PLAYGROUND */}
      {showOtherModels && isShow('platform') && (
        <group position={platform.anchor}>
          <Platform
            scale={0.1}
            position={[0, 0, 0]}
            onClick={() => onGroupClick('platform')}
            onPointerOver={handlePointerOver(platform.hoverCenter)}
            onPointerOut={handlePointerOut}
          />
          <FloatMan
            scale={0.2}
            rotation={[-Math.PI / 2, 0, Math.PI / 2]}
            position={[-0.1, 0.2, -0.05]}
            onClick={() => onGroupClick('platform')}
            onPointerOver={handlePointerOver(platform.hoverCenter)}
            onPointerOut={handlePointerOut}
          />
        </group>
      )}

      {/* RESUME */}
      {showOtherModels && isShow('resumeConsole') && (
        <group position={resume.anchor}>
          <InspectingPerson
            scale={0.2}
            rotation={[0, -Math.PI / 2, 0]}
            position={[0.5, 0, 0]}
            onClick={() => onGroupClick('resumeConsole')}
            onPointerOver={handlePointerOver(resume.hoverCenter)}
            onPointerOut={handlePointerOut}
          />
          <LabMachine
            scale={0.3}
            position={[-0.2, 0, -0.1]}
            rotation={[0, Math.PI / 2, 0]}
            onClick={() => onGroupClick('resumeConsole')}
            onPointerOver={handlePointerOver(resume.hoverCenter)}
            onPointerOut={handlePointerOut}
          />
        </group>
      )}

      {/* SKILLS */}
      {showOtherModels && isShow('skill') && (
        <group position={skill.anchor}>
          <RobotArm
            scale={0.005}
            position={[0, 0, 0]}
            onClick={() => onGroupClick('skill')}
            onPointerOver={handlePointerOver(skill.hoverCenter)}
            onPointerOut={handlePointerOut}
          />
        </group>
      )}

      {/* CONTACT */}
      {showOtherModels && isShow('radar') && (
        <group position={radar.anchor}>
          <Antenna
            scale={0.3}
            rotation={[0, Math.PI, 0]}
            position={[0, 0, 0]}
            onClick={() => onGroupClick('radar')}
            onPointerOver={handlePointerOver(radar.hoverCenter)}
            onPointerOut={handlePointerOut}
          />
        </group>
      )}

      {/* 라벨 — 앵커 + labelOffset */}
      {showOtherModels &&
        !focusedGroup &&
        !pulseActive &&
        Object.values(SCENE_STATIONS).map((station) => (
          <HoloText
            key={station.id}
            text={station.label}
            position={[
              station.anchor[0] + station.labelOffset[0],
              station.anchor[1] + station.labelOffset[1],
              station.anchor[2] + station.labelOffset[2],
            ]}
            rotation={station.labelRotation}
            color='#E5D6C4'
            scale={station.labelScale ?? 0.55}
          />
        ))}

      <ambientLight intensity={0.28} />
      <hemisphereLight args={['#b8d4ff', '#1a1a1a', 0.35]} />
      <directionalLight position={[8, 12, 6]} intensity={0.75} color='#ffffff' castShadow={false} />
      <Environment preset='city' environmentIntensity={0.35} />

      <EffectComposer>
        <Bloom luminanceThreshold={0.82} mipmapBlur luminanceSmoothing={0.2} intensity={0.45} />
      </EffectComposer>

      <FPSMeasurer />
    </>
  );
};
