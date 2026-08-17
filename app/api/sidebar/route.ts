import { NextResponse } from 'next/server';
import prisma from '@/shared/lib/db';
import { READ_API_CACHE_HEADERS } from '@/shared/lib/api-cache-headers';
import { withPrismaRetry } from '@/shared/lib/with-prisma-retry';

/**
 * 사이드바용 category + tags 단일 조회.
 * 동시 lambda 2개 → 1개로 줄여 Supabase 연결 burst 완화.
 */
export async function GET() {
  try {
    const [categories, tags] = await withPrismaRetry(() =>
      Promise.all([
        prisma.category.findMany({
          orderBy: { name: 'asc' },
          include: {
            _count: {
              select: { children: true, posts: true },
            },
          },
        }),
        prisma.tag.findMany({
          include: {
            _count: {
              select: { posts: true },
            },
          },
        }),
      ]),
    );

    return NextResponse.json(
      {
        categories: categories.map(({ _count, ...category }) => ({
          ...category,
          _count: { children: _count.children },
        })),
        tags: tags.map(({ _count, ...tag }) => ({
          ...tag,
          count: _count.posts,
        })),
      },
      { headers: READ_API_CACHE_HEADERS },
    );
  } catch (error) {
    console.error('GET /api/sidebar error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
