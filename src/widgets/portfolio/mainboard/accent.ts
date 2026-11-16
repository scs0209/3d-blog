'use client';

import { useEffect, useState } from 'react';

/** 포트폴리오의 조명 색 목록. 방문할 때마다 다음 색으로 넘어간다 */
export const ACCENTS = ['#4de3ff', '#9d8cff', '#5cf0b6', '#ff7ab6'] as const;

/** 포트폴리오가 이번 방문에 고른 조명 색. 다른 화면들도 같은 색을 쓰게 한다 */
export const useVisitAccent = () => {
  const [accent, setAccent] = useState<string>(ACCENTS[0]);
  useEffect(() => {
    try {
      const boot = Number(window.localStorage.getItem('ayaan-portfolio-boot') ?? '1');
      setAccent(ACCENTS[(Math.max(1, boot) - 1) % ACCENTS.length] ?? ACCENTS[0]);
    } catch {
      // 저장소를 쓸 수 없으면 기본 색을 쓴다
    }
  }, []);
  return accent;
};
