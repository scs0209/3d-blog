'use client';

import { plusVisitor } from '@/features/visitor/api';
import { useQueryClient } from '@tanstack/react-query';
import { VISITOR_QUERY_KEY } from '@/shared/queryKeys/visitor';
import { useEffect, useRef } from 'react';

const STORAGE_DAY_PREFIX = 'visitor_day:';
const STORAGE_VISITOR_ID = 'visitor_id';

const getSeoulDateKey = () =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());

const getOrCreateVisitorId = () => {
  try {
    const existing = window.localStorage.getItem(STORAGE_VISITOR_ID);
    if (existing) return existing;
    const created = crypto.randomUUID();
    window.localStorage.setItem(STORAGE_VISITOR_ID, created);
    return created;
  } catch {
    return crypto.randomUUID();
  }
};

/**
 * 페이지 진입 시 오늘 1회만 방문자 집계 API를 호출합니다.
 * - 클라이언트: 안정적인 visitorId + localStorage로 중복 요청 감소
 * - 서버: VisitorClaim 유니크 제약 + visitor_day 쿠키로 최종 중복 방지
 */
const VisitorLogger = () => {
  const queryClient = useQueryClient();
  const requestedRef = useRef(false);

  useEffect(() => {
    if (requestedRef.current) return;
    requestedRef.current = true;

    const todayKey = getSeoulDateKey();
    const storageKey = `${STORAGE_DAY_PREFIX}${todayKey}`;

    try {
      if (window.localStorage.getItem(storageKey) === '1') return;
    } catch {
      // private mode 등 localStorage 불가 시 서버 판정에 위임
    }

    const visitorId = getOrCreateVisitorId();

    plusVisitor({ visitorId })
      .then(() => {
        try {
          window.localStorage.setItem(storageKey, '1');
        } catch {
          // ignore
        }
        void queryClient.invalidateQueries({ queryKey: VISITOR_QUERY_KEY.today.queryKey });
      })
      .catch(() => {
        // 집계 실패는 UX를 막지 않음
      });
  }, [queryClient]);

  return null;
};

export default VisitorLogger;
