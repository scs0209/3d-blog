'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { beginAdminNavPending, endAdminNavPending } from './admin-nav-pending';

export const useAdminNavigation = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  useEffect(() => {
    if (!isPending) return;
    beginAdminNavPending();
    return () => {
      endAdminNavPending();
    };
  }, [isPending]);

  const navigate = (href: string) => {
    setPendingHref(href);
    startTransition(() => {
      router.push(href);
    });
  };

  return {
    isPending,
    pendingHref,
    navigate,
    prefetch: router.prefetch.bind(router),
  };
};
