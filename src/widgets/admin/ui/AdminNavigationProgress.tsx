'use client';

import { useEffect, useState } from 'react';
import { subscribeAdminNavPending } from './admin-nav-pending';
import { adminFormTheme } from './admin-form-theme';

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
      <div className={adminFormTheme.progressBar} />
    </div>
  );
};
