'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnalyticsEvents, trackEvent } from '@/shared/lib/analytics';

type PostViewTrackerProps = {
  postId: string | number;
  slug: string;
  categorySlug?: string | null;
};

export const PostViewTracker = ({ postId, slug, categorySlug }: PostViewTrackerProps) => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const utmSource = searchParams.get('utm_source');
    const fromParam = searchParams.get('from');
    const hasSearch = Boolean(searchParams.get('search') || searchParams.get('tags') || searchParams.get('category'));

    let from = 'direct';
    if (fromParam) from = fromParam;
    else if (utmSource === 'rss' || utmSource === 'feed') from = 'rss';
    else if (document.referrer.includes('/blog/all') || hasSearch) from = 'search';
    else if (document.referrer.includes('/blog/category/')) from = 'category';
    else if (document.referrer) from = 'referral';

    trackEvent(AnalyticsEvents.blogPostView, {
      post_id: String(postId),
      slug,
      category: categorySlug ?? 'uncategorized',
      from,
    });
  }, [postId, slug, categorySlug, searchParams]);

  return null;
};
