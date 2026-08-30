'use client';

import { useEffect, useState } from 'react';

const MOBILE_MAX = 767;
const TABLET_MAX = 1023;

export type ViewportProfile = {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isPortrait: boolean;
  coarsePointer: boolean;
};

const getProfile = (): ViewportProfile => {
  if (typeof window === 'undefined') {
    return {
      width: 1280,
      height: 800,
      isMobile: false,
      isTablet: false,
      isPortrait: false,
      coarsePointer: false,
    };
  }

  const width = window.innerWidth;
  const height = window.innerHeight;

  return {
    width,
    height,
    isMobile: width <= MOBILE_MAX,
    isTablet: width > MOBILE_MAX && width <= TABLET_MAX,
    isPortrait: height > width,
    coarsePointer: window.matchMedia('(pointer: coarse)').matches,
  };
};

export const useViewportProfile = (): ViewportProfile => {
  const [profile, setProfile] = useState<ViewportProfile>(getProfile);

  useEffect(() => {
    const handleResize = () => setProfile(getProfile());
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return profile;
};
