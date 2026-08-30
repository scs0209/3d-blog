import { cache } from 'react';
import prisma from '@/shared/lib/db';
import { withPrismaRetry } from '@/shared/lib/with-prisma-retry';

export type AdminStats = {
  posts: {
    total: number;
    thisMonth: number;
    lastMonth: number;
  };
  users: {
    total: number;
    thisMonth: number;
    lastMonth: number;
  };
  comments: {
    total: number;
    thisMonth: number;
    lastMonth: number;
  };
  views: {
    total: number;
    thisMonth: number;
    lastMonth: number;
  };
  visitors: {
    today: number;
    total: number;
  };
};

type StatsRow = {
  totalPosts: number;
  thisMonthPosts: number;
  lastMonthPosts: number;
  totalUsers: number;
  thisMonthUsers: number;
  lastMonthUsers: number;
  totalComments: number;
  thisMonthComments: number;
  lastMonthComments: number;
  totalViews: number;
  thisMonthViews: number;
  lastMonthViews: number;
  todayVisitors: number;
  totalVisitors: number;
};

const toCount = (value: unknown) => Number(value ?? 0);

const getSeoulDateKey = (date = new Date()) =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);

/** Supabase session pool(connection_limit=1) 폭주 방지: 왕복 1회로 통계를 모음 */
export const getStats = cache(async (): Promise<AdminStats> => {
  return withPrismaRetry(async () => {
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const todayKey = getSeoulDateKey(now);

    const [row] = await prisma.$queryRaw<StatsRow[]>`
      SELECT
        (SELECT COUNT(*)::int FROM "Post") AS "totalPosts",
        (SELECT COUNT(*)::int FROM "Post" WHERE "createdAt" >= ${thisMonthStart}) AS "thisMonthPosts",
        (SELECT COUNT(*)::int FROM "Post" WHERE "createdAt" >= ${lastMonthStart} AND "createdAt" < ${thisMonthStart}) AS "lastMonthPosts",
        (SELECT COUNT(*)::int FROM "User") AS "totalUsers",
        (SELECT COUNT(*)::int FROM "User" WHERE "createdAt" >= ${thisMonthStart}) AS "thisMonthUsers",
        (SELECT COUNT(*)::int FROM "User" WHERE "createdAt" >= ${lastMonthStart} AND "createdAt" < ${thisMonthStart}) AS "lastMonthUsers",
        (SELECT COUNT(*)::int FROM "Comment") AS "totalComments",
        (SELECT COUNT(*)::int FROM "Comment" WHERE "createdAt" >= ${thisMonthStart}) AS "thisMonthComments",
        (SELECT COUNT(*)::int FROM "Comment" WHERE "createdAt" >= ${lastMonthStart} AND "createdAt" < ${thisMonthStart}) AS "lastMonthComments",
        (SELECT COALESCE(SUM("views"), 0)::int FROM "Post") AS "totalViews",
        (SELECT COALESCE(SUM("views"), 0)::int FROM "Post" WHERE "createdAt" >= ${thisMonthStart}) AS "thisMonthViews",
        (SELECT COALESCE(SUM("views"), 0)::int FROM "Post" WHERE "createdAt" >= ${lastMonthStart} AND "createdAt" < ${thisMonthStart}) AS "lastMonthViews",
        (SELECT COALESCE((SELECT "count" FROM "VisitorDaily" WHERE "date" = ${todayKey}), 0)::int) AS "todayVisitors",
        (SELECT COALESCE(SUM("count"), 0)::int FROM "VisitorDaily") AS "totalVisitors"
    `;

    if (!row) {
      throw new Error('Failed to fetch admin stats');
    }

    return {
      posts: {
        total: toCount(row.totalPosts),
        thisMonth: toCount(row.thisMonthPosts),
        lastMonth: toCount(row.lastMonthPosts),
      },
      users: {
        total: toCount(row.totalUsers),
        thisMonth: toCount(row.thisMonthUsers),
        lastMonth: toCount(row.lastMonthUsers),
      },
      comments: {
        total: toCount(row.totalComments),
        thisMonth: toCount(row.thisMonthComments),
        lastMonth: toCount(row.lastMonthComments),
      },
      views: {
        total: toCount(row.totalViews),
        thisMonth: toCount(row.thisMonthViews),
        lastMonth: toCount(row.lastMonthViews),
      },
      visitors: {
        today: toCount(row.todayVisitors),
        total: toCount(row.totalVisitors),
      },
    };
  });
});
