'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export const BlogScrollContext = createContext<HTMLElement | null>(null);

export const useBlogScrollRoot = () => useContext(BlogScrollContext);

/** 스크롤 영역이 offset(px)보다 더 내려갔는가. 고정된 머리줄에 바탕을 깔 때 쓴다 */
export const useScrolledPast = (root: HTMLElement | null, offset: number) => {
  const [past, setPast] = useState(false);
  useEffect(() => {
    if (!root) {
      return;
    }
    const handleScroll = () => setPast(root.scrollTop > offset);
    handleScroll();
    root.addEventListener('scroll', handleScroll, { passive: true });
    return () => root.removeEventListener('scroll', handleScroll);
  }, [root, offset]);
  return past;
};
