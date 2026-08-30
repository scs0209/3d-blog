'use client';

import { useEffect, useState } from 'react';
import { subscribeAdminNavPending } from './admin-nav-pending';

export const AdminNavigationProgress = () => {
  const [pending, setPending] = useState(false);

  useEffect(() => subscribeAdminNavPending(setPending), []);

  if (!pending) return null;

  return (
    <div
      className='pointer-events-none absolute inset-x-0 top-0 z-50 h-0.5 overflow-hidden'
      role='progressbar'
      aria-label='페이지 이동 중'
      aria-busy='true'
    >
      <div className='h-full w-1/3 animate-[admin-nav-progress_1.1s_ease-in-out_infinite] bg-gradient-to-r from-[#ff9a3c] via-[#ffc8a0] to-[#ff9a3c] shadow-[0_0_12px_rgba(255,154,60,0.7)] dark:from-[#3de8ff] dark:via-[#c8e8ff] dark:to-[#3de8ff] dark:shadow-[0_0_12px_rgba(61,232,255,0.55)]' />
    </div>
  );
};
