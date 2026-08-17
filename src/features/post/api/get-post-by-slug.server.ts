import { cache } from 'react';
import type { PostResponse } from '@/entities/post/model/post';
import { decodePathSegment } from '@/shared/lib/decode-path-segment';
import prisma from '@/shared/lib/db';
import { withPrismaRetry } from '@/shared/lib/with-prisma-retry';

const postInclude = {
  author: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
  category: true,
  tags: true,
} as const;

/** SSR에서 HTTP self-fetch 없이 slug로 게시물 조회 (Vercel cold start 404 방지) */
export const getPostBySlugOnServer = cache(async (rawSlug: string): Promise<PostResponse | null> => {
  const slug = decodePathSegment(rawSlug);
  if (!slug) return null;

  const post = await withPrismaRetry(() =>
    prisma.post.findUnique({
      where: { slug },
      include: postInclude,
    }),
  );

  return post as PostResponse | null;
});
