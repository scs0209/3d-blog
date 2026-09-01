'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnalyticsEvents, trackEvent } from '@/shared/lib/analytics';
import { isBlogIndexPath } from '@/widgets/post/lib/blog-index-path';

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
    else if (document.referrer) {
      try {
        const refPath = new URL(document.referrer).pathname;
        if (isBlogIndexPath(refPath) || hasSearch) from = 'search';
        else if (refPath.includes('/blog/category/')) from = 'category';
        else from = 'referral';
      } catch {
        from = 'referral';
      }
    }

    trackEvent(AnalyticsEvents.blogPostView, {
      post_id: String(postId),
      slug,
      category: categorySlug ?? 'uncategorized',
      from,
    });
  }, [postId, slug, categorySlug, searchParams]);

  return null;
};
