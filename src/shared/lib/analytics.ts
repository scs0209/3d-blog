'use client';

import { track as vercelTrack } from '@vercel/analytics';

type AnalyticsProps = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const sanitizeProps = (props?: AnalyticsProps) => {
  if (!props) return undefined;
  const next: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(props)) {
    if (value === undefined || value === null) continue;
    next[key] = value;
  }
  return Object.keys(next).length > 0 ? next : undefined;
};

export const trackEvent = (name: string, props?: AnalyticsProps) => {
  if (typeof window === 'undefined') return;

  const cleanProps = sanitizeProps(props);

  try {
    vercelTrack(name, cleanProps);
  } catch {
    // analytics must never break UX
  }

  if (typeof window.gtag === 'function') {
    window.gtag('event', name, cleanProps);
  }
};

export const AnalyticsEvents = {
  blogSearchSubmit: 'blog_search_submit',
  blogSearchZeroResult: 'blog_search_zero_result',
  blogPostView: 'blog_post_view',
} as const;
