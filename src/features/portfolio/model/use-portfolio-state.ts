import { useState } from 'react';
import type { FocusedGroup, Position3D } from '@/entities/portfolio/model/types';

export const usePortfolioState = () => {
  const [focusedGroup, setFocusedGroup] = useState<FocusedGroup>(null);
  const [pulseActive, setPulseActive] = useState(false);
  const [pulseCenter, setPulseCenter] = useState<Position3D | null>(null);
  const [hoveredPosition, setHoveredPosition] = useState<Position3D | null>(null);
  const [quality, setQuality] = useState(false);
  const [sound, setSound] = useState(false);

  const isShow = (group: FocusedGroup) => {
    if (focusedGroup) {
      return focusedGroup === group;
    }
    return true;
  };

  return {
    // State
    focusedGroup,
    pulseActive,
    pulseCenter,
    hoveredPosition,
    quality,
    sound,
    // Setters
    setFocusedGroup,
    setPulseActive,
    setPulseCenter,
    setHoveredPosition,
    setQuality,
    setSound,
    // Computed
    isShow,
  };
};
