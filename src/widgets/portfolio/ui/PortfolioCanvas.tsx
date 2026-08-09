'use client';

import { Canvas } from '@react-three/fiber';
import { INITIAL_CAMERA_POS } from '@/entities/portfolio/model/constants';
import type { FocusedGroup, Position3D } from '@/entities/portfolio/model/types';
import { useInitialAnimation } from '@/features/portfolio/model/use-initial-animation';
import type { OverlayKey } from '@/features/portfolio/model/use-overlay-state';
import { CameraController, SceneRenderer } from '@/widgets/portfolio/ui';

interface PortfolioCanvasProps {
  focusedGroup: FocusedGroup;
  pulseActive: boolean;
  pulseCenter: [number, number, number] | null;
  hoveredPosition: [number, number, number] | null;
  isShow: (group: FocusedGroup) => boolean;
  handleGroupClick: (group: FocusedGroup) => void;
  setHoveredPosition: (position: [number, number, number] | null) => void;
  openOverlay: (key: OverlayKey) => void;
  targetPos: Position3D | null;
  targetLook: Position3D | null;
  secondaryAnimation: boolean;
  setCameraAnimationDone: (done: boolean) => void;
  setSecondaryAnimation: (active: boolean) => void;
  setTargetPos: (pos: [number, number, number]) => void;
  setTargetLook: (look: [number, number, number]) => void;
  hasClickedBack: boolean;
  setFocusedGroup: (group: FocusedGroup) => void;
  cameraAnimationDone: boolean;
}

export function PortfolioCanvas({
  focusedGroup,
  pulseActive,
  pulseCenter,
  hoveredPosition,
  isShow,
  handleGroupClick,
  setHoveredPosition,
  openOverlay,
  targetPos,
  targetLook,
  secondaryAnimation,
  setCameraAnimationDone,
  setSecondaryAnimation,
  setTargetPos,
  setTargetLook,
  hasClickedBack,
  setFocusedGroup,
  cameraAnimationDone,
}: PortfolioCanvasProps) {
  const initialAnimation = useInitialAnimation();

  return (
    <Canvas camera={{ position: INITIAL_CAMERA_POS, fov: 75, near: 0.1, far: 100 }}>
      <CameraController
        openOverlay={openOverlay}
        targetPos={targetPos}
        targetLook={targetLook}
        secondaryAnimation={secondaryAnimation}
        setCameraAnimationDone={setCameraAnimationDone}
        setSecondaryAnimation={setSecondaryAnimation}
        setTargetPos={setTargetPos}
        setTargetLook={setTargetLook}
        hasClickedBack={hasClickedBack}
        focusedGroup={focusedGroup}
        setFocusedGroup={setFocusedGroup}
        isInitialAnimation={!initialAnimation.isAnimationComplete}
      />
      <SceneRenderer
        focusedGroup={focusedGroup}
        pulseActive={pulseActive}
        pulseCenter={pulseCenter}
        hoveredPosition={hoveredPosition}
        isShow={isShow}
        onGroupClick={handleGroupClick}
        onPointerOver={setHoveredPosition}
        onPointerOut={() => setHoveredPosition(null)}
        holoTableScale={initialAnimation.holoTableScale}
        holoTablePosition={initialAnimation.holoTablePosition}
        showOtherModels={initialAnimation.showOtherModels}
        isInitialAnimation={!initialAnimation.isAnimationComplete}
        cameraAnimationDone={cameraAnimationDone}
      />
    </Canvas>
  );
}
