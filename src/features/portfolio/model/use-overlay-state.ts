import { useCallback, useState } from 'react';

export type OverlayKey = 'aboutMe' | 'experience' | 'skills' | 'contact' | 'portfolio' | 'resume' | 'resumeConsole';

export type OverlayState = {
  [Key in OverlayKey]?: {
    isOpen: boolean;
    isClosing: boolean;
  };
};

const initialOverlayState: OverlayState = {
  aboutMe: { isOpen: false, isClosing: false },
  experience: { isOpen: false, isClosing: false },
  skills: { isOpen: false, isClosing: false },
  contact: { isOpen: false, isClosing: false },
  portfolio: { isOpen: false, isClosing: false },
  resumeConsole: { isOpen: false, isClosing: false },
};

export const useOverlayState = () => {
  const [overlays, setOverlays] = useState<OverlayState>(initialOverlayState);

  // 특정 오버레이를 여는 함수
  const openOverlay = useCallback((key: OverlayKey) => {
    setOverlays((prev) => ({
      ...prev,
      [key]: { isOpen: true, isClosing: false },
    }));
  }, []);

  // 특정 오버레이를 닫기 시작하는 함수
  const closeOverlay = useCallback((key: OverlayKey) => {
    setOverlays((prev) => ({
      ...prev,
      [key]: { ...(prev[key] || { isOpen: true }), isClosing: true },
    }));
  }, []);

  // 애니메이션 종료 후 완전히 닫는 함수
  const finishClosing = useCallback((key: OverlayKey) => {
    setOverlays((prev) => ({
      ...prev,
      [key]: { isOpen: false, isClosing: false },
    }));
  }, []);

  const resetOverlayState = () => {
    setOverlays(initialOverlayState);
  };

  return {
    // State
    overlays,
    // Setters
    setOverlays,
    openOverlay,
    closeOverlay,
    finishClosing,
    // Actions
    resetOverlayState,
  };
};
